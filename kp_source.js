(function () {
    'use strict';

    var network = new Lampa.Reguest();
    var menu_list = [];
    var genres_map = {};
    var cache = {};
    var SOURCE_NAME = 'kp';
    var CACHE_SIZE = 100;
    var CACHE_TIME = 1000 * 60 * 60;

    function convertElem(elem) {
      var type = !elem.type || elem.type === 'FILM' || elem.type === 'VIDEO' ? 'movie' : 'tv';
      var kinopoisk_id = elem.kinopoiskId || elem.filmId || 0;
      var kp_rating = +elem.rating || +elem.ratingKinopoisk || 0;
      var adult = false;
      var result = {
        "source": SOURCE_NAME,
        "kp_obj": elem,
        "type": type,
        "adult": false,
        "id": kinopoisk_id,
        "name": elem.nameRu || elem.nameEn || elem.nameOriginal || '',
        "original_name": elem.nameOriginal || elem.nameEn || '',
        "overview": elem.description || elem.shortDescription || '',
        "img": elem.posterUrlPreview || elem.posterUrl || '',
        "background_image": elem.posterUrl || elem.posterUrlPreview || '',
        "genres": elem.genres && elem.genres.map(function (e) {
          if (e.genre === 'для взрослых') {
            adult = true;
          }

          return {
            id: e.genre && genres_map[e.genre] || 0,
            name: e.genre,
            url: ''
          };
        }) || [],
        "production_companies": [],
        "production_countries": elem.countries && elem.countries.map(function (e) {
          return {
            name: e.country
          };
        }) || [],
        "vote_average": kp_rating,
        "vote_count": elem.ratingVoteCount || elem.ratingKinopoiskVoteCount || 0,
        "kinopoisk_id": kinopoisk_id,
        "kp_rating": kp_rating,
        "imdb_id": elem.imdbId || '',
        "imdb_rating": elem.ratingImdb || 0
      };
      result.adult = adult;

      if (type === 'movie') {
        result.release_date = elem.year && elem.year !== 'null' ? elem.year : '';
      } else {
        result.first_air_date = elem.startYear && elem.startYear !== null ? elem.startYear : elem.year && elem.year !== 'null' ? elem.year : '';
        if (elem.endYear && elem.endYear !== null) result.last_air_date = elem.endYear;
      }

      return result;
    }

    function convertSeason(season) {
      var episodes = season.episodes || [];
      episodes = episodes.map(function (e) {
        return {
          "season_number": e.seasonNumber,
          "episode_number": e.episodeNumber,
          "name": e.nameRu || e.nameEn || 'S' + e.seasonNumber + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + e.episodeNumber,
          "overview": e.synopsis || '',
          "air_date": e.releaseDate
        };
      });
      return {
        "season_number": season.number,
        "episode_count": episodes.length,
        "episodes": episodes,
        "name": Lampa.Lang.translate('torrent_serial_season') + ' ' + season.number,
        "overview": ''
      };
    }

    function get(method, oncomplite, onerror) {
      var kp_prox = 'https://cors.kp556.workers.dev/';
      var url = kp_prox + 'https://kinopoiskapiunofficial.tech/';
      url += method;
      network.timeout(15000);
      network.silent(url, function (json) {
        oncomplite(json);
      }, onerror, false, {
        headers: {
          'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616'
        }
      });
    }

    function getCache(key) {
      var res = cache[key];

      if (res) {
        var cache_timestamp = new Date().getTime() - CACHE_TIME;
        if (res.timestamp > cache_timestamp) return res.value;

        for (var ID in cache) {
          var node = cache[ID];
          if (!(node && node.timestamp > cache_timestamp)) delete cache[ID];
        }
      }

      return null;
    }

    function setCache(key, value) {
      var timestamp = new Date().getTime();
      var size = Object.keys(cache).length;

      if (size >= CACHE_SIZE) {
        var cache_timestamp = timestamp - CACHE_TIME;

        for (var ID in cache) {
          var node = cache[ID];
          if (!(node && node.timestamp > cache_timestamp)) delete cache[ID];
        }

        size = Object.keys(cache).length;

        if (size >= CACHE_SIZE) {
          var min = null;
          var max = null;

          for (var _ID in cache) {
            var _node = cache[_ID];
            if (min == null || _node.timestamp < min) min = _node.timestamp;
            if (max == null || _node.timestamp > max) max = _node.timestamp;
          }

          cache_timestamp = min + (max - min) / 2;

          for (var _ID2 in cache) {
            var _node2 = cache[_ID2];
            if (!(_node2 && _node2.timestamp > cache_timestamp)) delete cache[_ID2];
          }
        }
      }

      cache[key] = {
        timestamp: timestamp,
        value: value
      };
    }

    function getList(method) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
      var onerror = arguments.length > 3 ? arguments[3] : undefined;
      var url = method;

      if (params.query) {
        var clean_title = params.query && decodeURIComponent(params.query).replace(/[\s.,:;!?]+/g, ' ').trim();

        if (!clean_title) {
          onerror();
          return;
        }

        url = Lampa.Utils.addUrlComponent(url, 'keyword=' + encodeURIComponent(clean_title));
      }

      var page = params.page || 1;
      url = Lampa.Utils.addUrlComponent(url, 'page=' + page);
      var cache_result = true;

      var success = function success(items, json) {
        if (items.length && cache_result) {
          setCache(url, json);
        }

        var results = items.map(function (elem) {
          return convertElem(elem);
        });
        results = results.filter(function (elem) {
          return !elem.adult;
        });
        var total_pages = json.pagesCount || json.totalPages || 1;
        var res = {
          "results": results,
          "url": method,
          "page": page,
          "total_pages": total_pages,
          "total_results": 0,
          "more": total_pages > page
        };
        oncomplite(res);
      };

      var onget = function onget(json) {
        if (json.items && json.items.length) success(json.items, json);else if (json.films && json.films.length) success(json.films, json);else if (json.releases && json.releases.length) success(json.releases, json);else success([], json);
      };

      var json = getCache(url);

      if (json) {
        cache_result = false;
        onget(json);
      } else get(url, onget, onerror);
    }

    function _getById(id) {
      var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
      var onerror = arguments.length > 3 ? arguments[3] : undefined;
      get('api/v2.2/films/' + id, function (json) {
        var elem = convertElem(json);

        var success = function success() {
          oncomplite(elem);
        };

        if (elem.type == 'tv') {
          elem.number_of_seasons = 1;
          get('api/v2.2/films/' + id + '/seasons', function (json) {
            var items = json.items || [];
            elem.number_of_seasons = json.total || items.length || 1;
            elem.seasons_obj = json;
            elem.seasons = items.map(function (s) {
              return convertSeason(s);
            });
            var number_of_episodes = 0;
            elem.seasons.forEach(function (s) {
              number_of_episodes += s.episode_count;
            });
            elem.number_of_episodes = number_of_episodes;
            success();
          }, success);
        } else success();
      }, onerror);
    }

    function getById(id) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
      var onerror = arguments.length > 3 ? arguments[3] : undefined;
      menu({}, function () {
        return _getById(id, params, oncomplite, onerror);
      });
    }

    function main() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var parts_limit = 6;
      var parts_data = [function (call) {
        getList('api/v2.2/films/top?type=TOP_100_POPULAR_FILMS', params, function (json) {
          json.title = Lampa.Lang.translate('title_now_watch');
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films/top?type=TOP_250_BEST_FILMS', params, function (json) {
          json.title = Lampa.Lang.translate('title_top_movie');
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films?order=NUM_VOTE&type=FILM', params, function (json) {
          json.title = 'Популярные фильмы';
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films?order=NUM_VOTE&type=TV_SERIES', params, function (json) {
          json.title = 'Полярные сериалы';
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films?order=NUM_VOTE&type=MINI_SERIES', params, function (json) {
          json.title = 'Полярные мини-сериалы';
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films?order=NUM_VOTE&type=TV_SHOW', params, function (json) {
          json.title = 'Полярные телешоу';
          call(json);
        }, call);
      }];

      function loadPart(partLoaded, partEmpty) {
        Lampa.Api.partNext(parts_data, parts_limit, partLoaded, partEmpty);
      }

      loadPart(oncomplite, onerror);
      return loadPart;
    }

    function category() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var show = ['movie', 'tv'].indexOf(params.url) > -1 && !params.genres;
      var books = show ? Lampa.Favorite.continues(params.url) : [];
      books.forEach(function (elem) {
        if (!elem.source) elem.source = 'tmdb';
      });
      books = books.filter(function (elem) {
        return [SOURCE_NAME, 'tmdb', 'cub'].indexOf(elem.source) !== -1;
      });
      var recomend = show ? Lampa.Arrays.shuffle(Lampa.Recomends.get(params.url)).slice(0, 19) : [];
      recomend.forEach(function (elem) {
        if (!elem.source) elem.source = 'tmdb';
      });
      recomend = recomend.filter(function (elem) {
        return [SOURCE_NAME, 'tmdb', 'cub'].indexOf(elem.source) !== -1;
      });
      var parts_limit = 6;
      var parts_data = [function (call) {
        call({
          results: books,
          title: params.url == 'tv' ? Lampa.Lang.translate('title_continue') : Lampa.Lang.translate('title_watched')
        });
      }, function (call) {
        call({
          results: recomend,
          title: Lampa.Lang.translate('title_recomend_watch')
        });
      }];

      function loadPart(partLoaded, partEmpty) {
        Lampa.Api.partNext(parts_data, parts_limit, partLoaded, partEmpty);
      }

      menu({}, function () {
        menu_list.forEach(function (g) {
          if (!g.hide && !g.separator) {
            parts_data.push(function (call) {
              getList('api/v2.2/films?order=NUM_VOTE&genres=' + g.id + '&type=' + (params.url == 'tv' ? 'TV_SERIES' : 'FILM'), params, function (json) {
                json.title = Lampa.Utils.capitalizeFirstLetter(g.title);
                call(json);
              }, call);
            });
          }
        });
        loadPart(oncomplite, onerror);
      });
      return loadPart;
    }

    function full() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;

      if (params.card && params.card.source === SOURCE_NAME && params.card.kp_obj && params.card.id) {
        getById(params.card.id, params, function (json) {
          var status = new Lampa.Status(1);
          status.onComplite = oncomplite;
          status.append('movie', json);
        }, onerror);
      } else onerror();
    }

    function list() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var method = params.url;

      if (method === '' && params.genres) {
        method = 'api/v2.2/films?order=NUM_VOTE&genres=' + params.genres;
      }

      getList(method, params, oncomplite, onerror);
    }

    function search() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var status = new Lampa.Status(1);

      status.onComplite = function (data) {
        var items = [];

        if (data.query && data.query.results) {
          var movie = Object.assign({}, data.query);
          movie.results = data.query.results.filter(function (elem) {
            return elem.type === 'movie';
          });
          movie.title = Lampa.Lang.translate('menu_movies');
          movie.type = 'movie';
          if (movie.results.length) items.push(movie);
          var tv = Object.assign({}, data.query);
          tv.results = data.query.results.filter(function (elem) {
            return elem.type === 'tv';
          });
          tv.title = Lampa.Lang.translate('menu_tv');
          tv.type = 'tv';
          if (tv.results.length) items.push(tv);
        }

        oncomplite(items);
      };

      getList('api/v2.1/films/search-by-keyword', params, function (json) {
        status.append('query', json);
      }, status.error.bind(status));
    }

    function discovery() {
      return {
        title: 'KP',
        search: search,
        params: {
          align_left: true,
          object: {
            source: SOURCE_NAME
          }
        },
        onMore: function onMore(params) {
          Lampa.Activity.push({
            url: 'api/v2.1/films/search-by-keyword',
            title: Lampa.Lang.translate('search') + ' - ' + params.query,
            component: 'category_full',
            page: 1,
            query: encodeURIComponent(params.query),
            source: SOURCE_NAME
          });
        },
        onCancel: network.clear.bind(network)
      };
    }

    function person() {
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      oncomplite({});
    }

    function menu() {
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      if (menu_list.length) oncomplite(menu_list);else {
        get('api/v2.2/films/filters', function (j) {
          j.genres.forEach(function (g) {
            menu_list.push({
              id: g.id,
              title: g.genre,
              url: '',
              hide: g.genre === 'для взрослых',
              separator: !g.genre
            });
            genres_map[g.genre] = g.id;
          });
          oncomplite(menu_list);
        }, function () {
          oncomplite([]);
        });
      }
    }

    function menuCategory(params, oncomplite) {
      oncomplite([]);
    }

    function seasons(tv, from, oncomplite) {
      var status = new Lampa.Status(from.length);
      status.onComplite = oncomplite;
      from.forEach(function (season) {
        var seasons = tv.seasons || [];
        seasons = seasons.filter(function (s) {
          return s.season_number === season;
        });

        if (seasons.length) {
          status.append('' + season, seasons[0]);
        } else {
          status.error();
        }
      });
    }

    function clear() {
      network.clear();
    }

    var KP = {
      main: main,
      menu: menu,
      full: full,
      list: list,
      category: category,
      clear: clear,
      person: person,
      seasons: seasons,
      menuCategory: menuCategory,
      discovery: discovery
    };

    var ALL_SOURCES = [{
      name: 'tmdb',
      title: 'TMDB'
    }, {
      name: 'cub',
      title: 'CUB'
    }, {
      name: 'pub',
      title: 'PUB'
    }, {
      name: 'filmix',
      title: 'FILMIX'
    }, {
      name: 'kp',
      title: 'KP'
    }];

    function startPlugin() {
      window.kp_source_plugin = true;

      function addPlugin() {
        Lampa.Api.sources.kp = KP;
        Object.defineProperty(Lampa.Api.sources, 'kp', {
          get: function get() {
            return KP;
          }
        });
        var sources = {};
        ALL_SOURCES.forEach(function (s) {
          if (Lampa.Api.sources[s.name]) sources[s.name] = s.title;
        });
        Lampa.Params.select('source', sources, 'tmdb');
      }

      if (window.appready) addPlugin();else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type == 'ready') addPlugin();
        });
      }
    }

    if (!window.kp_source_plugin) startPlugin();

})();
