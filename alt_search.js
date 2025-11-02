(function () {
    'use strict';

    function startsWith(str, searchString) {
      return str.lastIndexOf(searchString, 0) === 0;
    }

    var network = new Lampa.Reguest();
    var cache = {};
    var CACHE_SIZE = 100;
    var CACHE_TIME = 1000 * 60 * 60;
    var SOURCE_NAME = atob('SU1EQg==');
    var SOURCE_TITLE = atob('SU1EQg==');
    var SEARCH_METHOD = atob('c3VnZ2VzdGlvbi90aXRsZXMveC8=');
    var SEARCH_SUFFIX = atob('Lmpzb24/aW5jbHVkZVZpZGVvcz0x');
    var prox = (window.location.protocol === 'https:' ? 'https://' : 'http://') + 'iqslgbok.deploy.cx/';
    var host = atob('aHR0cHM6Ly93d3cuaW1kYi5jb20=');
    var ref = host + '/';
    var user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36';
    var headers = Lampa.Platform.is('android') ? {
      'Origin': host,
      'Referer': ref,
      'User-Agent': user_agent
    } : {};

    if (Lampa.Platform.is('android') || !startsWith(window.location.protocol, 'http')) {
      prox = '';
    }

    var prox_enc = '';

    if (prox) {
      prox_enc += 'param/Origin=' + encodeURIComponent(host) + '/';
      prox_enc += 'param/Referer=' + encodeURIComponent(ref) + '/';
      prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
    }

    function get(method, oncomplite, onerror) {
      var url = atob('aHR0cHM6Ly92My5zZy5tZWRpYS1pbWRiLmNvbS8=');
      url += method;
      network.timeout(15000);
      network["native"](prox + prox_enc + url, function (json) {
        oncomplite(json);
      }, onerror, false, {
        headers: headers
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
      var type = !elem.qid || elem.qid === 'movie' || elem.qid === 'tvMovie' ? 'movie' : 'tv';
      var alt_id = elem.id || '';
      var title = elem.l || '';
      var original_title = elem.l || '';
      var result = {
        "source": SOURCE_NAME,
        "type": type,
        "adult": false,
        "id": SOURCE_NAME + '_' + alt_id,
        "title": title,
        "original_title": original_title,
        "overview": '',
        "img": elem.i && elem.i.imageUrl || '',
        "background_image": elem.i && elem.i.imageUrl || '',
        "genres": [],
        "production_companies": [],
        "production_countries": [],
        "vote_average": 0,
        "vote_count": 0,
        "kinopoisk_id": '',
        "kp_rating": 0,
        "imdb_id": alt_id,
        "imdb_rating": 0
      };
      var first_air_date = elem.y || '';

      if (type === 'tv') {
        result.name = title;
        result.original_name = original_title;
        result.first_air_date = first_air_date + '';
      } else {
        result.release_date = first_air_date + '';
      }

      if (type === 'tv') {
        result.number_of_seasons = 1;
        result.seasons = [];
        result.number_of_episodes = 0;
      }

      return result;
    }

    function cleanTitle(str) {
      return str.replace(/[\s.,:;’'`!?]+/g, ' ').trim();
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
        var clean_title = params.query && cleanTitle(decodeURIComponent(params.query));

        if (!clean_title) {
          onerror();
          return;
        }

        url += encodeURIComponent(clean_title) + SEARCH_SUFFIX;
      }

      getFromCache(url, function (json, cached) {
        var items = [];
        if (json && json.d && json.d.length) items = json.d;
        if (!cached && items.length) setCache(url, json);
        var results = items.map(function (elem) {
          return convertElem(elem);
        });
        results = results.filter(function (elem) {
          return !elem.adult;
        });
        var res = {
          "results": results,
          "url": method,
          "page": 1,
          "total_pages": 1,
          "total_results": 0,
          "more": 0
        };
        oncomplite(res);
      }, onerror);
    }

    function _getById(id) {
      var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
      var onerror = arguments.length > 3 ? arguments[3] : undefined;
      var url = SEARCH_METHOD + id + SEARCH_SUFFIX;
      var film = getCache(url);

      if (film) {
        setTimeout(function () {
          if (film && film.d && film.d[0] && film.d[0].id) {
            oncomplite(convertElem(film.d[0]));
          } else onerror();
        }, 10);
      } else {
        get(url, function (film) {
          if (film && film.d && film.d[0] && film.d[0].id) {
            oncomplite(convertElem(film.d[0]));
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

    function main() {
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var parts_limit = 0;
      var parts_data = [];

      function loadPart(partLoaded, partEmpty) {
        Lampa.Api.partNext(parts_data, parts_limit, partLoaded, partEmpty);
      }

      loadPart(oncomplite, onerror);
      return loadPart;
    }

    function category() {
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var parts_limit = 0;
      var parts_data = [];

      function loadPart(partLoaded, partEmpty) {
        Lampa.Api.partNext(parts_data, parts_limit, partLoaded, partEmpty);
      }

      loadPart(oncomplite, onerror);
      return loadPart;
    }

    function full() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var alt_id = '';

      if (params.card && params.card.source === SOURCE_NAME) {
        if (params.card.imdb_id) {
          alt_id = params.card.imdb_id;
        } else if (startsWith(params.card.id + '', SOURCE_NAME + '_')) {
          alt_id = (params.card.id + '').substring(SOURCE_NAME.length + 1);
          params.card.imdb_id = alt_id;
        }
      }

      if (alt_id) {
        getById(alt_id, params, function (json) {
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
      getList(method, params, oncomplite, onerror);
    }

    function search() {
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

      getList(SEARCH_METHOD, params, function (json) {
        status.append('query', json);
      }, status.error.bind(status));
    }

    function discovery() {
      return {
        title: SOURCE_TITLE,
        search: search,
        params: {
          align_left: true,
          object: {
            source: SOURCE_NAME
          }
        },
        onMore: function onMore(params) {
          Lampa.Activity.push({
            url: SEARCH_METHOD,
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
      oncomplite([]);
    }

    function menuCategory(params, oncomplite) {
      oncomplite([]);
    }

    function seasons(tv, from, oncomplite) {
      oncomplite({});
    }

    var ALT = {
      SOURCE_NAME: SOURCE_NAME,
      SOURCE_TITLE: SOURCE_TITLE,
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

    function startPlugin() {
      window.alt_source_plugin = true;

      function addPlugin() {
        if (Lampa.Api.sources[ALT.SOURCE_NAME]) {
          Lampa.Noty.show('Установлен плагин несовместимый с alt_search');
          return;
        }

        Lampa.Api.sources[ALT.SOURCE_NAME] = ALT;
        Object.defineProperty(Lampa.Api.sources, ALT.SOURCE_NAME, {
          get: function get() {
            return ALT;
          }
        });
      }

      if (window.appready) addPlugin();else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type == 'ready') addPlugin();
        });
      }
    }

    if (!window.alt_source_plugin) startPlugin();

})();
