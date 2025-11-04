(function () {
    'use strict';

    function startsWith(str, searchString) {
      return str.lastIndexOf(searchString, 0) === 0;
    }

    var network = new Lampa.Reguest();
    var cache = {};
    var total_cnt = 0;
    var proxy_cnt = 0;
    var good_cnt = 0;
    var genres_list = [];
    var countries_list = [];
    var genres_map = {};
    var countries_map = {};
    var CACHE_SIZE = 100;
    var CACHE_TIME = 1000 * 60 * 60;
    var SOURCE_NAME = 'KP';
    var SOURCE_TITLE = 'KP';

    function get(method, oncomplite, onerror) {
      var use_proxy = total_cnt >= 10 && good_cnt > total_cnt / 2;
      if (!use_proxy) total_cnt++;
      var kp_prox = 'https://cors.kp556.workers.dev:8443/';
      var url = 'https://kinopoiskapiunofficial.tech/';
      url += method;
      network.timeout(20000);
      network.silent((use_proxy ? kp_prox : '') + url, function (json) {
        oncomplite(json);
      }, function (a, c) {
        use_proxy = !use_proxy && (proxy_cnt < 10 || good_cnt > proxy_cnt / 2);

        if (use_proxy && (a.status == 429 || a.status == 0 && a.statusText !== 'timeout')) {
          proxy_cnt++;
          network.timeout(20000);
          network.silent(kp_prox + url, function (json) {
            good_cnt++;
            oncomplite(json);
          }, onerror, false, {
            headers: {
              'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616'
            }
          });
        } else onerror(a, c);
      }, false, {
        headers: {
          'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616'
        }
      });
    }

    function getComplite(method, oncomplite) {
      get(method, oncomplite, function () {
        oncomplite(null);
      });
    }

    function getCompliteIf(condition, method, oncomplite) {
      if (condition) getComplite(method, oncomplite);else {
        setTimeout(function () {
          oncomplite(null);
        }, 10);
      }
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
          var timestamps = [];

          for (var _ID in cache) {
            var _node = cache[_ID];
            timestamps.push(_node && _node.timestamp || 0);
          }

          timestamps.sort(function (a, b) {
            return a - b;
          });
          cache_timestamp = timestamps[Math.floor(timestamps.length / 2)];

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

    function getFromCache(method, oncomplite, onerror) {
      var json = getCache(method);

      if (json) {
        setTimeout(function () {
          oncomplite(json, true);
        }, 10);
      } else get(method, oncomplite, onerror);
    }

    function clear() {
      network.clear();
    }

    function convertElem(elem) {
      var type = !elem.type || elem.type === 'FILM' || elem.type === 'VIDEO' ? 'movie' : 'tv';
      var kinopoisk_id = elem.kinopoiskId || elem.filmId || 0;
      var kp_rating = +elem.rating || +elem.ratingKinopoisk || 0;
      var imdb_rating = +elem.ratingImdb || 0;
      var title = elem.nameRu || elem.nameEn || elem.nameOriginal || '';
      var original_title = elem.nameOriginal || elem.nameEn || elem.nameRu || '';
      var adult = false;
      var result = {
        "source": SOURCE_NAME,
        "type": type,
        "adult": false,
        "id": SOURCE_NAME + '_' + kinopoisk_id,
        "title": title,
        "original_title": original_title,
        "overview": elem.description || elem.shortDescription || '',
        "img": elem.posterUrlPreview || elem.posterUrl || '',
        "background_image": elem.coverUrl || elem.posterUrl || elem.posterUrlPreview || '',
        "genres": elem.genres && elem.genres.map(function (e) {
          if (e.genre === 'для взрослых') {
            adult = true;
          }

          return {
            "id": e.genre && genres_map[e.genre] || 0,
            "name": e.genre,
            "url": 'genre'
          };
        }) || [],
        "production_companies": [],
        "production_countries": elem.countries && elem.countries.map(function (e) {
          return {
            "name": e.country
          };
        }) || [],
        "vote_average": kp_rating,
        "vote_count": elem.ratingVoteCount || elem.ratingKinopoiskVoteCount || 0,
        "kinopoisk_id": kinopoisk_id,
        "kp_rating": kp_rating,
        "imdb_id": elem.imdbId || '',
        "imdb_rating": imdb_rating
      };
      result.adult = adult;
      var first_air_date = elem.year && elem.year !== 'null' ? elem.year : '';
      var last_air_date = '';

      if (type === 'tv') {
        if (elem.startYear && elem.startYear !== 'null') first_air_date = elem.startYear;
        if (elem.endYear && elem.endYear !== 'null') last_air_date = elem.endYear;
      }

      if (elem.distributions_obj) {
        var distributions = elem.distributions_obj.items || [];
        var year_timestamp = Date.parse(first_air_date);
        var min = null;
        distributions.forEach(function (d) {
          if (d.date && (d.type === 'WORLD_PREMIER' || d.type === 'ALL')) {
            var timestamp = Date.parse(d.date);

            if (!isNaN(timestamp) && (min == null || timestamp < min) && (isNaN(year_timestamp) || timestamp >= year_timestamp)) {
              min = timestamp;
              first_air_date = d.date;
            }
          }
        });
      }

      if (type === 'tv') {
        result.name = title;
        result.original_name = original_title;
        result.first_air_date = first_air_date + '';
        if (last_air_date) result.last_air_date = last_air_date + '';
      } else {
        result.release_date = first_air_date + '';
      }

      if (elem.seasons_obj) {
        var _seasons = elem.seasons_obj.items || [];

        result.number_of_seasons = elem.seasons_obj.total || _seasons.length || 1;
        result.seasons = _seasons.map(function (s) {
          return convertSeason(s);
        });
        var number_of_episodes = 0;
        result.seasons.forEach(function (s) {
          number_of_episodes += s.episode_count;
        });
        result.number_of_episodes = number_of_episodes;
      }

      if (elem.staff_obj) {
        var staff = elem.staff_obj || [];
        var cast = [];
        var crew = [];
        staff.forEach(function (s) {
          var person = convertPerson(s);
          if (s.professionKey === 'ACTOR') cast.push(person);else crew.push(person);
        });
        result.persons = {
          "cast": cast,
          "crew": crew
        };
      }

      if (elem.sequels_obj) {
        var sequels = elem.sequels_obj || [];
        result.collection = {
          "results": sequels.map(function (s) {
            return convertElem(s);
          })
        };
      }

      if (elem.similars_obj) {
        var similars = elem.similars_obj.items || [];
        result.simular = {
          "results": similars.map(function (s) {
            return convertElem(s);
          })
        };
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

    function convertPerson(person) {
      return {
        "id": person.staffId,
        "name": person.nameRu || person.nameEn || '',
        "url": 'person',
        "img": person.posterUrl || '',
        "character": person.description || '',
        "job": Lampa.Utils.capitalizeFirstLetter((person.professionKey || '').toLowerCase())
      };
    }

    function cleanTitle(str) {
      return str.replace(/[\s.,:;’'`!?]+/g, ' ').trim();
    }

    function kpCleanTitle(str) {
      return cleanTitle(str).replace(/^[ \/\\]+/, '').replace(/[ \/\\]+$/, '').replace(/\+( *[+\/\\])+/g, '+').replace(/([+\/\\] *)+\+/g, '+').replace(/( *[\/\\]+ *)+/g, '+');
    }

    function normalizeTitle(str) {
      return cleanTitle(str.toLowerCase().replace(/[\-\u2010-\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D]+/g, '-').replace(/ё/g, 'е'));
    }

    function containsTitle(str, title) {
      return typeof str === 'string' && typeof title === 'string' && normalizeTitle(str).indexOf(normalizeTitle(title)) !== -1;
    }

    function getList(method) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
      var onerror = arguments.length > 3 ? arguments[3] : undefined;
      var url = method;

      if (params.query) {
        var clean_title = params.query && kpCleanTitle(decodeURIComponent(params.query));

        if (!clean_title) {
          onerror();
          return;
        }

        url = Lampa.Utils.addUrlComponent(url, 'keyword=' + encodeURIComponent(clean_title));
      }

      var page = params.page || 1;
      url = Lampa.Utils.addUrlComponent(url, 'page=' + page);
      getFromCache(url, function (json, cached) {
        var items = [];
        if (json.items && json.items.length) items = json.items;else if (json.films && json.films.length) items = json.films;else if (json.releases && json.releases.length) items = json.releases;
        if (!cached && items.length) setCache(url, json);
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
      }, onerror);
    }

    function _getById(id) {
      var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
      var onerror = arguments.length > 3 ? arguments[3] : undefined;
      var url = 'api/v2.2/films/' + id;
      var film = getCache(url);

      if (film) {
        setTimeout(function () {
          oncomplite(convertElem(film));
        }, 10);
      } else {
        get(url, function (film) {
          if (film.kinopoiskId) {
            var type = !film.type || film.type === 'FILM' || film.type === 'VIDEO' ? 'movie' : 'tv';
            getCompliteIf(type == 'tv', 'api/v2.2/films/' + id + '/seasons', function (seasons) {
              film.seasons_obj = seasons;
              getComplite('api/v2.2/films/' + id + '/distributions', function (distributions) {
                film.distributions_obj = distributions;
                getComplite('/api/v1/staff?filmId=' + id, function (staff) {
                  film.staff_obj = staff;
                  getComplite('api/v2.1/films/' + id + '/sequels_and_prequels', function (sequels) {
                    film.sequels_obj = sequels;
                    getComplite('api/v2.2/films/' + id + '/similars', function (similars) {
                      film.similars_obj = similars;
                      setCache(url, film);
                      oncomplite(convertElem(film));
                    });
                  });
                });
              });
            });
          } else onerror();
        }, onerror);
      }
    }

    function getById(id) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
      var onerror = arguments.length > 3 ? arguments[3] : undefined;
      menu({}, function () {
        return _getById(id, params, oncomplite, onerror);
      });
    }

    function main$1() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var parts_limit = 5;
      var parts_data = [function (call) {
        getList('api/v2.2/films/collections?type=TOP_POPULAR_MOVIES', params, function (json) {
          json.title = 'Сейчас смотрят фильмы';
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films/collections?type=POPULAR_SERIES', params, function (json) {
          json.title = 'Сейчас смотрят сериалы';
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films/collections?type=TOP_250_MOVIES', params, function (json) {
          json.title = 'Топ фильмы';
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films/collections?type=TOP_250_TV_SHOWS', params, function (json) {
          json.title = 'Топ сериалы';
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films?order=NUM_VOTE&type=FILM', params, function (json) {
          json.title = 'Популярные фильмы';
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films?order=NUM_VOTE&type=TV_SERIES', params, function (json) {
          json.title = 'Популярные сериалы';
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films?order=NUM_VOTE&type=MINI_SERIES', params, function (json) {
          json.title = 'Популярные мини-сериалы';
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films?order=NUM_VOTE&type=TV_SHOW', params, function (json) {
          json.title = 'Популярные телешоу';
          call(json);
        }, call);
      }];

      function loadPart(partLoaded, partEmpty) {
        Lampa.Api.partNext(parts_data, parts_limit, partLoaded, partEmpty);
      }

      menu({}, function () {
        var rus_id = countries_map['Россия'];

        if (rus_id) {
          parts_data.splice(5, 0, function (call) {
            getList('api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=FILM', params, function (json) {
              json.title = 'Популярные российские фильмы';
              call(json);
            }, call);
          });
          parts_data.splice(7, 0, function (call) {
            getList('api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=TV_SERIES', params, function (json) {
              json.title = 'Популярные российские сериалы';
              call(json);
            }, call);
          });
          parts_data.splice(9, 0, function (call) {
            getList('api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=MINI_SERIES', params, function (json) {
              json.title = 'Популярные российские мини-сериалы';
              call(json);
            }, call);
          });
        }

        loadPart(oncomplite, onerror);
      });
      return loadPart;
    }

    function category() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var parts_limit = 5;
      var parts_data = [];

      if (['movie', 'tv'].indexOf(params.url) > -1 && !params.genres) {
        var books = Lampa.Favorite.continues(params.url);
        books.forEach(function (elem) {
          if (!elem.source) elem.source = 'tmdb';
        });
        books = books.filter(function (elem) {
          return [SOURCE_NAME, 'tmdb', 'cub'].indexOf(elem.source) !== -1;
        });
        var recomend = Lampa.Arrays.shuffle(Lampa.Recomends.get(params.url)).slice(0, 19);
        recomend.forEach(function (elem) {
          if (!elem.source) elem.source = 'tmdb';
        });
        recomend = recomend.filter(function (elem) {
          return [SOURCE_NAME, 'tmdb', 'cub'].indexOf(elem.source) !== -1;
        });
        parts_data = [function (call) {
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
      }

      function loadPart(partLoaded, partEmpty) {
        Lampa.Api.partNext(parts_data, parts_limit, partLoaded, partEmpty);
      }

      menu({}, function () {
        var url = 'api/v2.2/films?order=NUM_VOTE';
        var filter = '';
        if (params.url == 'movie') filter = '&type=FILM';else if (params.url == 'tv') filter = '&type=TV_SERIES';else if (params.url == 'anime') filter = '&genres=' + genres_map['аниме'];else if (params.url == 'cartoon') filter = '&genres=' + genres_map['мультфильм'];
        {
          var now = new Date();
          var yearFrom = now.getFullYear() - (now.getMonth() < 6);
          var yearTo = now.getFullYear();
          parts_data.push(function (call) {
            getList(url + filter + '&yearFrom=' + yearFrom + '&yearTo=' + yearTo, params, function (json) {
              json.title = 'За год';
              call(json);
            }, call);
          });
        }

        if (!startsWith(filter, '&type=')) {
          parts_data.push(function (call) {
            getList(url + filter + '&type=FILM', params, function (json) {
              json.title = 'Фильмы';
              call(json);
            }, call);
          });
          parts_data.push(function (call) {
            getList(url + filter + '&type=TV_SERIES', params, function (json) {
              json.title = 'Сериалы';
              call(json);
            }, call);
          });
          parts_data.push(function (call) {
            getList(url + filter + '&type=MINI_SERIES', params, function (json) {
              json.title = 'Мини-сериалы';
              call(json);
            }, call);
          });
          parts_data.push(function (call) {
            getList(url + filter + '&type=TV_SHOW', params, function (json) {
              json.title = 'Телешоу';
              call(json);
            }, call);
          });
        }

        if (!startsWith(filter, '&genres=')) {
          genres_list.forEach(function (g) {
            if (!g.hide && !g.separator) {
              parts_data.push(function (call) {
                getList(url + filter + '&genres=' + g.id, params, function (json) {
                  json.title = Lampa.Utils.capitalizeFirstLetter(g.title);
                  call(json);
                }, call);
              });
            }
          });
        }

        loadPart(oncomplite, onerror);
      });
      return loadPart;
    }

    function full() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var kinopoisk_id = '';

      if (params.card && params.card.source === SOURCE_NAME) {
        if (params.card.kinopoisk_id) {
          kinopoisk_id = params.card.kinopoisk_id;
        } else if (startsWith(params.card.id + '', SOURCE_NAME + '_')) {
          kinopoisk_id = (params.card.id + '').substring(SOURCE_NAME.length + 1);
          params.card.kinopoisk_id = kinopoisk_id;
        }
      }

      if (kinopoisk_id) {
        getById(kinopoisk_id, params, function (json) {
          var status = new Lampa.Status(4);
          status.onComplite = oncomplite;
          status.append('movie', json);
          status.append('persons', json && json.persons);
          status.append('collection', json && json.collection);
          status.append('simular', json && json.simular);
        }, onerror);
      } else onerror();
    }

    function list() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var method = params.url;

      if ((method === '' || method === 'movie' || method === 'tv' || method === 'genre') && params.genres) {
        method = 'api/v2.2/films?order=NUM_VOTE&genres=' + params.genres;
      }

      if (method === 'filter' && params.filter_url) {
        method = params.filter_url;
      }

      getList(method, params, oncomplite, onerror);
    }

    function search$1() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var title = decodeURIComponent(params.query || '');
      var status = new Lampa.Status(1);

      status.onComplite = function (data) {
        var items = [];

        if (data.query && data.query.results) {
          var tmp = data.query.results.filter(function (elem) {
            return containsTitle(elem.title, title) || containsTitle(elem.original_title, title);
          });

          if (tmp.length && tmp.length !== data.query.results.length) {
            data.query.results = tmp;
            data.query.more = true;
          }

          var movie = {};
          Lampa.Arrays.extend(movie, data.query);
          movie.results = data.query.results.filter(function (elem) {
            return elem.type === 'movie';
          });
          movie.title = Lampa.Lang.translate('menu_movies');
          movie.type = 'movie';
          if (movie.results.length) items.push(movie);
          var tv = {};
          Lampa.Arrays.extend(tv, data.query);
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
        title: SOURCE_TITLE,
        search: search$1,
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
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var status = new Lampa.Status(1);

      status.onComplite = function (data) {
        var result = {};

        if (data.query) {
          var p = data.query;
          result.person = {
            "id": p.personId,
            "name": p.nameRu || p.nameEn || '',
            "url": 'person',
            "img": p.posterUrl || '',
            "gender": p.sex === 'MALE' ? 2 : p.sex === 'FEMALE' ? 1 : 0,
            "birthday": p.birthday,
            "place_of_birth": p.birthplace,
            "deathday": p.death,
            "place_of_death": p.deathplace,
            "known_for_department": p.profession || '',
            "biography": (p.facts || []).join(' ')
          };
          var director_films = [];
          var director_map = {};
          var actor_films = [];
          var actor_map = {};

          if (p.films) {
            p.films.forEach(function (f) {
              if (f.professionKey === 'DIRECTOR' && !director_map[f.filmId]) {
                director_map[f.filmId] = true;
                director_films.push(convertElem(f));
              } else if (f.professionKey === 'ACTOR' && !actor_map[f.filmId]) {
                actor_map[f.filmId] = true;
                actor_films.push(convertElem(f));
              }
            });
          }

          var knownFor = [];

          if (director_films.length) {
            director_films.sort(function (a, b) {
              var res = b.vote_average - a.vote_average;
              if (res) return res;
              return a.id - b.id;
            });
            knownFor.push({
              "name": Lampa.Lang.translate('title_producer'),
              "credits": director_films
            });
          }

          if (actor_films.length) {
            actor_films.sort(function (a, b) {
              var res = b.vote_average - a.vote_average;
              if (res) return res;
              return a.id - b.id;
            });
            knownFor.push({
              "name": Lampa.Lang.translate(p.sex === 'FEMALE' ? 'title_actress' : 'title_actor'),
              "credits": actor_films
            });
          }

          result.credits = {
            "knownFor": knownFor
          };
        }

        oncomplite(result);
      };

      var url = 'api/v1/staff/' + params.id;
      getFromCache(url, function (json, cached) {
        if (!cached && json.personId) setCache(url, json);
        status.append('query', json);
      }, status.error.bind(status));
    }

    function kpFilters() {
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      if (genres_list.length) oncomplite(genres_list, countries_list, genres_map, countries_map);else {
        get('api/v2.2/films/filters', function (j) {
          if (j.genres) {
            var priority_order = ['семейный', 'детский', 'короткометражка', 'мультфильм', 'аниме'];
            var priority_list = [];
            var other_list = [];
            j.genres.forEach(function (g) {
              var list = priority_order.indexOf(g.genre) !== -1 ? priority_list : other_list;
              list.push({
                "id": g.id,
                "title": g.genre,
                "url": 'genre',
                "hide": g.genre === 'для взрослых',
                "separator": !g.genre
              });
              genres_map[g.genre] = g.id;
            });
            priority_list.sort(function (a, b) {
              return priority_order.indexOf(a.title) - priority_order.indexOf(b.title);
            });
            genres_list = priority_list.concat(other_list);
          }

          if (j.countries) {
            var _priority_order = ['Россия', 'СССР', 'США', 'Индия', 'Япония', 'Корея Южная', 'Китай', 'Гонконг', 'Тайвань', 'Великобритания', 'Австралия', 'Франция', 'Канада'];
            var _priority_list = [];
            var _other_list = [];
            j.countries.forEach(function (c) {
              var list = _priority_order.indexOf(c.country) !== -1 ? _priority_list : _other_list;
              list.push({
                "id": c.id,
                "title": c.country,
                "url": 'country',
                "hide": false,
                "separator": !c.country
              });
              countries_map[c.country] = c.id;
            });

            _priority_list.sort(function (a, b) {
              return _priority_order.indexOf(a.title) - _priority_order.indexOf(b.title);
            });

            countries_list = _priority_list.concat(_other_list);
          }

          oncomplite(genres_list, countries_list, genres_map, countries_map);
        }, function () {
          oncomplite([], [], {}, {});
        });
      }
    }

    function menu() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      kpFilters(params, function (menu_list) {
        oncomplite(menu_list);
      });
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

    var KP = {
      SOURCE_NAME: SOURCE_NAME,
      SOURCE_TITLE: SOURCE_TITLE,
      kpFilters: kpFilters,
      main: main$1,
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

    var data = {};
    var initialized = false;
    data.type = {
      title: '#{title_type}',
      items: [{
        title: '#{filter_any}'
      }, {
        selected: true,
        title: 'Фильмы',
        typeName: 'FILM'
      }, {
        title: 'Сериалы',
        typeName: 'TV_SERIES'
      }, {
        title: 'Мини-сериалы',
        typeName: 'MINI_SERIES'
      }, {
        title: 'Телешоу',
        typeName: 'TV_SHOW'
      }]
    };
    data.rating = {
      title: '#{title_rating}',
      items: [{
        selected: true,
        title: '#{filter_any}'
      }, {
        title: '#{filter_rating_from} 9',
        ratingFrom: 9,
        ratingTo: 10
      }, {
        title: '#{filter_rating_from} 8',
        ratingFrom: 8,
        ratingTo: 10
      }, {
        title: '#{filter_rating_from} 8 #{filter_rating_to} 9',
        ratingFrom: 8,
        ratingTo: 9
      }, {
        title: '#{filter_rating_from} 6',
        ratingFrom: 6,
        ratingTo: 10
      }, {
        title: '#{filter_rating_from} 6 #{filter_rating_to} 8',
        ratingFrom: 6,
        ratingTo: 8
      }, {
        title: '#{filter_rating_to} 6',
        ratingFrom: 0,
        ratingTo: 6
      }, {
        title: '#{filter_rating_to} 4',
        ratingFrom: 0,
        ratingTo: 4
      }, {
        title: '#{filter_rating_to} 2',
        ratingFrom: 0,
        ratingTo: 2
      }, {
        title: '#{filter_rating_to} 1',
        ratingFrom: 0,
        ratingTo: 1
      }]
    };
    data.sort = {
      title: '#{filter_sorted}',
      items: [{
        selected: true,
        title: 'Популярность',
        sortName: 'NUM_VOTE'
      }, {
        title: 'Рейтинг',
        sortName: 'RATING'
      }]
    };
    data.genre = {
      title: '#{title_genre}',
      items: [{
        selected: true,
        title: '#{filter_any}'
      }]
    };
    data.country = {
      title: '#{title_country}',
      items: [{
        selected: true,
        title: '#{filter_any}'
      }]
    };
    data.year = {
      title: '#{title_year}',
      items: [{
        selected: true,
        title: '#{filter_any}'
      }]
    };
    var now = new Date().getFullYear();
    var i = now - now % 10;

    for (var a = 0; a < 5; a++) {
      var y = now - a;
      data.year.items.push({
        title: y + '',
        yearFrom: y,
        yearTo: y
      });
    }

    if (i != now) {
      data.year.items.push({
        title: i + '-' + now,
        yearFrom: i,
        yearTo: now
      });
    }

    i -= 10;

    while (i >= 1900) {
      data.year.items.push({
        title: i + '-' + (i + 9),
        yearFrom: i,
        yearTo: i + 9
      });
      i -= 10;
    }
    /**
     * Главное меню фильтрации
     */


    function main() {
      for (var i in data) {
        selected(data[i]);
      }

      var items = [{
        title: Lampa.Lang.translate('search_start'),
        search: true
      }, data.type, data.rating, data.sort, data.genre, data.country, data.year];
      items.forEach(function (itm) {
        itm.title = Lampa.Lang.translate(itm.title);
        if (itm.subtitle) itm.subtitle = Lampa.Lang.translate(itm.subtitle);

        if (itm.items) {
          itm.items.forEach(function (inr) {
            inr.title = Lampa.Lang.translate(inr.title);
          });
        }
      });
      Lampa.Select.show({
        title: Lampa.Lang.translate('title_filter'),
        items: items,
        onBack: function onBack() {
          Lampa.Controller.toggle('content');
        },
        onSelect: function onSelect(a) {
          if (a.search) search();else submenu(a);
        }
      });
    }
    /**
     * Запрос для KP
     * @returns {string} - строка запроса
     */


    function getFilterUrl() {
      var url = 'api/v2.2/films?order=' + (data.sort.items.find(function (s) {
        return s.selected;
      }).sortName || 'NUM_VOTE');
      var typeName = data.type.items.find(function (s) {
        return s.selected;
      }).typeName;
      if (typeName) url += '&type=' + typeName;
      var genre = data.genre.items.find(function (s) {
        return s.selected;
      }).id;
      if (genre != null) url += '&genres=' + genre;
      var country = data.country.items.find(function (s) {
        return s.selected;
      }).id;
      if (country != null) url += '&countries=' + country;
      var ratingFrom = data.rating.items.find(function (s) {
        return s.selected;
      }).ratingFrom;
      if (ratingFrom != null) url += '&ratingFrom=' + ratingFrom;
      var ratingTo = data.rating.items.find(function (s) {
        return s.selected;
      }).ratingTo;
      if (ratingTo != null) url += '&ratingTo=' + ratingTo;
      var yearFrom = data.year.items.find(function (s) {
        return s.selected;
      }).yearFrom;
      if (yearFrom != null) url += '&yearFrom=' + yearFrom;
      var yearTo = data.year.items.find(function (s) {
        return s.selected;
      }).yearTo;
      if (yearTo != null) url += '&yearTo=' + yearTo;
      return url;
    }
    /**
     * Запуск поиска
     */


    function search() {
      Lampa.Controller.toggle('content');
      var source = Lampa.Storage.field('source');
      var activity = {
        url: 'filter',
        filter_url: getFilterUrl(),
        title: Lampa.Lang.translate('title_filter'),
        component: 'category_full',
        source: source,
        card_type: true,
        page: 1
      };
      var object = Lampa.Activity.active();
      if (object.component == 'category_full' && object.url == 'filter') Lampa.Activity.replace(activity, true);else Lampa.Activity.push(activity);
    }
    /**
     * Выбор элемента
     * @param {Array} where - массив элементов
     * @param {Object} a - выбранный элемент
     */


    function select(where, a) {
      where.forEach(function (element) {
        element.selected = false;
      });
      a.selected = true;
    }
    /**
     * Обновление подзаголовка
     * @param {Object} where - объект с массивом items
     */


    function selected(where) {
      var title = [];
      where.items.forEach(function (a) {
        if (a.selected || a.checked) title.push(a.title);
      });
      where.subtitle = title.length ? title.join(', ') : Lampa.Lang.translate('nochoice');
    }
    /**
     * Подменю
     * @param {Object} item - объект элемента
     */


    function submenu(item) {
      Lampa.Select.show({
        title: item.title,
        items: item.items,
        onBack: main,
        onSelect: function onSelect(a) {
          select(item.items, a);
          main();
        }
      });
    }
    /**
     * Запуск фильтра
     */


    function show(genres_list, countries_list) {
      if (!initialized) {
        initialized = true;
        genres_list.forEach(function (g) {
          if (!g.hide) {
            data.genre.items.push({
              title: g.title,
              id: g.id
            });
          }
        });
        countries_list.forEach(function (c) {
          if (!c.hide) {
            data.country.items.push({
              title: c.title,
              id: c.id
            });
          }
        });
      }

      main();
    }

    var KP_FILTER = {
      show: show
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
      name: KP.SOURCE_NAME,
      title: KP.SOURCE_TITLE
    }];

    function startPlugin() {
      window.kp_source_plugin = true;

      function addPlugin() {
        if (Lampa.Api.sources[KP.SOURCE_NAME]) {
          Lampa.Noty.show('Установлен плагин несовместимый с kp_source');
          return;
        }

        Lampa.Api.sources[KP.SOURCE_NAME] = KP;
        Object.defineProperty(Lampa.Api.sources, KP.SOURCE_NAME, {
          get: function get() {
            return KP;
          }
        });
        var sources = {};

        if (Lampa.Params.values && Lampa.Params.values['source']) {
          Lampa.Arrays.extend(sources, Lampa.Params.values['source']);
          sources[KP.SOURCE_NAME] = KP.SOURCE_TITLE;
        } else {
          ALL_SOURCES.forEach(function (s) {
            if (Lampa.Api.sources[s.name]) sources[s.name] = s.title;
          });
        }

        Lampa.Params.select('source', sources, 'tmdb');

        if (Lampa.Router) {
          Lampa.Listener.follow('menu', function (e) {
            if (e.type == 'action' && Lampa.Storage.field('source') == KP.SOURCE_NAME) {
              if (
              /*e.action == 'anime' ||*/
              e.action == 'cartoon') {
                Lampa.Router.call('category', {
                  url: e.action,
                  title: (e.action == 'anime' ? Lampa.Lang.translate('menu_anime') : Lampa.Lang.translate('menu_multmovie')) + ' - ' + KP.SOURCE_NAME.toUpperCase(),
                  source: KP.SOURCE_NAME
                });
                e.abort();
              }

              if (e.action == 'filter') {
                KP.kpFilters({}, function (genres_list, countries_list) {
                  KP_FILTER.show(genres_list, countries_list);
                });
                e.abort();
              }
            }
          });
        }
      }

      if (window.appready) addPlugin();else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type == 'ready') addPlugin();
        });
      }
    }

    if (!window.kp_source_plugin) startPlugin();

})();
