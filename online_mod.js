//31.08.2025 - Fix

(function () {
    'use strict';

    function startsWith(str, searchString) {
      return str.lastIndexOf(searchString, 0) === 0;
    }

    function endsWith(str, searchString) {
      var start = str.length - searchString.length;
      if (start < 0) return false;
      return str.indexOf(searchString, start) === start;
    }

    var myIp = '';
    var currentFanserialsHost = decodeSecret([89, 69, 64, 69, 67, 14, 26, 26, 93, 73, 87, 80, 90, 70, 85, 70, 92, 84, 92, 30, 95, 84, 64], atob('RnVja0Zhbg=='));

    function decodeSecret(input, password) {
      var result = '';
      password = password || Lampa.Storage.get('online_mod_secret_password', '') + '';

      if (input && password) {
        var hash = Lampa.Utils.hash(password);

        while (hash.length < input.length) {
          hash += hash;
        }

        var i = 0;

        while (i < input.length) {
          result += String.fromCharCode(input[i] ^ hash.charCodeAt(i));
          i++;
        }
      }

      return result;
    }

    function checkDebug() {
      var res = false;
      var origin = window.location.origin || '';
      decodeSecret([85, 77, 93, 87, 89, 71, 87, 30, 86, 89, 88, 88, 88, 81, 12, 70, 66, 80, 68, 89, 80, 24, 67, 68, 13, 92, 88, 90, 68, 88, 69, 92, 82, 24, 83, 90]).split(';').forEach(function (s) {
        res |= endsWith(origin, s);
      });
      return !res;
    }

    function isDebug() {
      return decodeSecret([83, 81, 83, 67, 83]) === 'debug' && checkDebug();
    }

    function isDebug2() {
      return decodeSecret([86, 81, 81, 71, 83]) === 'debug' || decodeSecret([92, 85, 91, 65, 84]) === 'debug';
    }

    function rezka2Mirror() {
      var url = Lampa.Storage.get('online_mod_rezka2_mirror', '') + '';
      if (!url) return 'https://kvk.zone';
      if (url.indexOf('://') == -1) url = 'https://' + url;
      if (url.charAt(url.length - 1) === '/') url = url.substring(0, url.length - 1);
      return url;
    }

    function kinobaseMirror() {
      var url = Lampa.Storage.get('online_mod_kinobase_mirror', '') + '';
      if (!url) return 'https://kinobase.org';
      if (url.indexOf('://') == -1) url = 'https://' + url;
      if (url.charAt(url.length - 1) === '/') url = url.substring(0, url.length - 1);
      return url;
    }

    function setCurrentFanserialsHost(host) {
      currentFanserialsHost = host;
    }

    function getCurrentFanserialsHost() {
      return currentFanserialsHost;
    }

    function fanserialsHost() {
      return currentFanserialsHost || decodeSecret([89, 69, 64, 69, 67, 14, 26, 26, 1, 86, 80, 95, 71, 80, 66, 93, 84, 89, 67, 30, 67, 68], atob('RnVja0Zhbg=='));
    }

    function fancdnHost() {
      return fanserialsHost();
    }

    function filmixHost$1() {
      return 'https://filmix.my';
    }

    function filmixToken(dev_id, token) {
      return '?user_dev_id=' + dev_id + '&user_dev_name=Xiaomi&user_dev_token=' + token + '&user_dev_vendor=Xiaomi&user_dev_os=14&user_dev_apk=2.2.0&app_lang=ru-rRU';
    }

    function filmixUserAgent() {
      return 'okhttp/3.10.0';
    }

    function baseUserAgent() {
      return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36';
    }

    function vcdnToken() {
      return atob("YXBpX3Rva2VuPQ==") + (isDebug() ? decodeSecret([81, 103, 70, 70, 92, 114, 65, 103, 1, 1, 78, 72, 124, 110, 83, 115, 126, 13, 114, 13, 102, 80, 83, 2, 112, 120, 127, 122, 2, 121, 98, 100]) : decodeSecret([0, 10, 1, 126, 69, 15, 11, 114, 119, 11, 77, 94, 89, 126, 82, 93, 110, 106, 72, 77, 101, 102, 2, 90, 107, 83, 88, 79, 113, 91, 3, 5], atob('RnVja0x1bWV4')));
    }

    function setMyIp(ip) {
      myIp = ip;
    }

    function getMyIp() {
      return myIp;
    }

    function checkMyIp$1(network, onComplite) {
      var ip = getMyIp();

      if (ip) {
        onComplite();
        return;
      }

      network.clear();
      network.timeout(10000);
      network.silent('https://api.ipify.org/?format=json', function (json) {
        if (json.ip) setMyIp(json.ip);
        onComplite();
      }, function (a, c) {
        network.clear();
        network.timeout(10000);
        network.silent(proxy('ip') + 'jsonip', function (json) {
          if (json.ip) setMyIp(json.ip);
          onComplite();
        }, function (a, c) {
          onComplite();
        });
      });
    }

    function proxy(name) {
      var ip = getMyIp() || '';
      var param_ip = Lampa.Storage.field('online_mod_proxy_find_ip') === true ? 'ip' + ip + '/' : '';
      var proxy1 = new Date().getHours() % 2 ? 'https://cors.nb557.workers.dev:8443/' : 'https://cors.fx666.workers.dev:8443/';
      var proxy2 = (window.location.protocol === 'https:' ? 'https://' : 'http://') + 'iqslgbok.deploy.cx/';
      var proxy3 = 'https://cors557.deno.dev/';
      var proxy_apn = '';
      var proxy_secret = '';
      var proxy_secret_ip = '';

      if (isDebug()) {
        proxy_apn = (window.location.protocol === 'https:' ? 'https://' : 'http://') + decodeSecret([64, 90, 72, 90, 92, 91, 87, 87, 23, 83, 81, 65, 90, 91, 78, 24, 83, 65, 24]);
        proxy_secret = decodeSecret([95, 64, 69, 70, 71, 13, 25, 31, 88, 71, 90, 28, 91, 86, 2, 3, 6, 23, 92, 91, 72, 83, 86, 25, 87, 64, 73, 24]);
        proxy_secret_ip = proxy_secret + (param_ip || 'ip/');
      }

      var proxy_other = Lampa.Storage.field('online_mod_proxy_other') === true;
      var proxy_other_url = proxy_other ? Lampa.Storage.field('online_mod_proxy_other_url') + '' : '';
      var user_proxy1 = (proxy_other_url || proxy1) + param_ip;
      var user_proxy2 = (proxy_other_url || proxy2) + param_ip;
      var user_proxy3 = (proxy_other_url || proxy3) + param_ip;
      if (name === 'filmix_site') return user_proxy2;
      if (name === 'filmix_abuse') return window.location.protocol === 'https:' ? 'https://cors.apn.monster/' : 'http://cors.cfhttp.top/';
      if (name === 'zetflix') return proxy_apn;
      if (name === 'allohacdn') return proxy_other ? proxy_secret : proxy_apn;
      if (name === 'cookie') return user_proxy1;
      if (name === 'cookie2') return user_proxy2;
      if (name === 'cookie3') return user_proxy3;
      if (name === 'ip') return proxy2;

      if (Lampa.Storage.field('online_mod_proxy_' + name) === true) {
        if (name === 'iframe') return user_proxy2;
        if (name === 'lumex') return proxy_other ? proxy_secret : proxy_apn;
        if (name === 'rezka') return user_proxy2;
        if (name === 'rezka2') return user_proxy2;
        if (name === 'kinobase') return proxy_apn;
        if (name === 'collaps') return proxy_other ? proxy_secret : proxy_apn;
        if (name === 'cdnmovies') return user_proxy2;
        if (name === 'filmix') return proxy_secret_ip || user_proxy1;
        if (name === 'videodb') return user_proxy2;
        if (name === 'fancdn') return user_proxy3;
        if (name === 'fancdn2') return proxy_secret || user_proxy3;
        if (name === 'fanserials') return user_proxy2;
        if (name === 'videoseed') return user_proxy1;
        if (name === 'vibix') return user_proxy2;
        if (name === 'redheadsound') return user_proxy2;
        if (name === 'anilibria') return user_proxy2;
        if (name === 'anilibria2') return user_proxy2;
        if (name === 'animelib') return proxy_secret;
        if (name === 'kodik') return user_proxy2;
        if (name === 'kinopub') return user_proxy2;
      }

      return '';
    }

    function parseURL(link) {
      var url = {
        href: link,
        protocol: '',
        host: '',
        origin: '',
        pathname: '',
        search: '',
        hash: ''
      };
      var pos = link.indexOf('#');

      if (pos !== -1) {
        url.hash = link.substring(pos);
        link = link.substring(0, pos);
      }

      pos = link.indexOf('?');

      if (pos !== -1) {
        url.search = link.substring(pos);
        link = link.substring(0, pos);
      }

      pos = link.indexOf(':');
      var path_pos = link.indexOf('/');

      if (pos !== -1 && (path_pos === -1 || path_pos > pos)) {
        url.protocol = link.substring(0, pos + 1);
        link = link.substring(pos + 1);
      }

      if (startsWith(link, '//')) {
        pos = link.indexOf('/', 2);

        if (pos !== -1) {
          url.host = link.substring(2, pos);
          link = link.substring(pos);
        } else {
          url.host = link.substring(2);
          link = '/';
        }

        url.origin = url.protocol + '//' + url.host;
      }

      url.pathname = link;
      return url;
    }

    function fixLink(link, referrer) {
      if (link) {
        if (!referrer || link.indexOf('://') !== -1) return link;
        var url = parseURL(referrer);
        if (startsWith(link, '//')) return url.protocol + link;
        if (startsWith(link, '/')) return url.origin + link;
        if (startsWith(link, '?')) return url.origin + url.pathname + link;
        if (startsWith(link, '#')) return url.origin + url.pathname + url.search + link;
        var base = url.origin + url.pathname;
        base = base.substring(0, base.lastIndexOf('/') + 1);
        return base + link;
      }

      return link;
    }

    function fixLinkProtocol(link, prefer_http, replace_protocol) {
      if (link) {
        if (startsWith(link, '//')) {
          return (prefer_http ? 'http:' : 'https:') + link;
        } else if (prefer_http && replace_protocol) {
          return link.replace('https://', 'http://');
        } else if (!prefer_http && replace_protocol === 'full') {
          return link.replace('http://', 'https://');
        }
      }

      return link;
    }

    function proxyLink(link, proxy, proxy_enc, enc) {
      if (link && proxy) {
        if (proxy_enc == null) proxy_enc = '';
        if (enc == null) enc = 'enc';

        if (enc === 'enc') {
          var pos = link.indexOf('/');
          if (pos !== -1 && link.charAt(pos + 1) === '/') pos++;
          var part1 = pos !== -1 ? link.substring(0, pos + 1) : '';
          var part2 = pos !== -1 ? link.substring(pos + 1) : link;
          return proxy + 'enc/' + encodeURIComponent(btoa(proxy_enc + part1)) + '/' + part2;
        }

        if (enc === 'enc1') {
          var _pos = link.lastIndexOf('/');

          var _part = _pos !== -1 ? link.substring(0, _pos + 1) : '';

          var _part2 = _pos !== -1 ? link.substring(_pos + 1) : link;

          return proxy + 'enc1/' + encodeURIComponent(btoa(proxy_enc + _part)) + '/' + _part2;
        }

        if (enc === 'enc2') {
          var posEnd = link.lastIndexOf('?');
          var posStart = link.lastIndexOf('://');
          if (posEnd === -1 || posEnd <= posStart) posEnd = link.length;
          if (posStart === -1) posStart = -3;
          var name = link.substring(posStart + 3, posEnd);
          posStart = name.lastIndexOf('/');
          name = posStart !== -1 ? name.substring(posStart + 1) : '';
          return proxy + 'enc2/' + encodeURIComponent(btoa(proxy_enc + link)) + '/' + name;
        }

        return proxy + proxy_enc + link;
      }

      return link;
    }

    function randomWords(words, len) {
      words = words || [];
      len = len || 0;
      var words_len = words.length;
      if (!words_len) return '';
      var str = '';

      for (var i = 0; i < len; i++) {
        str += words[Math.floor(Math.random() * words_len)];
      }

      return str;
    }

    function randomChars(chars, len) {
      return randomWords((chars || '').split(''), len);
    }

    function randomHex(len) {
      return randomChars('0123456789abcdef', len);
    }

    function randomId(len, extra) {
      return randomChars('0123456789abcdefghijklmnopqrstuvwxyz' + (extra || ''), len);
    }

    function randomId2(len, extra) {
      return randomChars('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' + (extra || ''), len);
    }

    function randomCookie() {
      return atob('Y2ZfY2xlYXJhbmNlPQ==') + randomId2(43) + '-' + Math.floor(Date.now() / 1000) + atob('LTEuMi4xLjEt') + randomId2(299, '_.');
    }

    function checkAndroidVersion(needVersion) {
      if (typeof AndroidJS !== 'undefined') {
        try {
          var current = AndroidJS.appVersion().split('-');
          var versionCode = current.pop();

          if (parseInt(versionCode, 10) >= needVersion) {
            return true;
          }
        } catch (e) {}
      }

      return false;
    }

    var Utils = {
      decodeSecret: decodeSecret,
      isDebug: isDebug,
      isDebug2: isDebug2,
      rezka2Mirror: rezka2Mirror,
      kinobaseMirror: kinobaseMirror,
      setCurrentFanserialsHost: setCurrentFanserialsHost,
      getCurrentFanserialsHost: getCurrentFanserialsHost,
      fanserialsHost: fanserialsHost,
      fancdnHost: fancdnHost,
      filmixHost: filmixHost$1,
      filmixToken: filmixToken,
      filmixUserAgent: filmixUserAgent,
      baseUserAgent: baseUserAgent,
      vcdnToken: vcdnToken,
      setMyIp: setMyIp,
      getMyIp: getMyIp,
      checkMyIp: checkMyIp$1,
      proxy: proxy,
      parseURL: parseURL,
      fixLink: fixLink,
      fixLinkProtocol: fixLinkProtocol,
      proxyLink: proxyLink,
      randomWords: randomWords,
      randomChars: randomChars,
      randomHex: randomHex,
      randomId: randomId,
      randomId2: randomId2,
      randomCookie: randomCookie,
      checkAndroidVersion: checkAndroidVersion
    };

    var network$1 = new Lampa.Reguest();
    var cache = {};
    var total_cnt = 0;
    var proxy_cnt = 0;
    var good_cnt = 0;
    var CACHE_SIZE = 100;
    var CACHE_TIME = 1000 * 60 * 60;

    function get(method, oncomplite, onerror) {
      var use_proxy = total_cnt >= 10 && good_cnt > total_cnt / 2;
      if (!use_proxy) total_cnt++;
      var kp_prox = 'https://cors.kp556.workers.dev:8443/';
      var url = 'https://kinopoiskapiunofficial.tech/';
      url += method;
      network$1.timeout(15000);
      network$1.silent((use_proxy ? kp_prox : '') + url, function (json) {
        oncomplite(json);
      }, function (a, c) {
        use_proxy = !use_proxy && (proxy_cnt < 10 || good_cnt > proxy_cnt / 2);

        if (use_proxy && (a.status == 429 || a.status == 0 && a.statusText !== 'timeout')) {
          proxy_cnt++;
          network$1.timeout(15000);
          network$1.silent(kp_prox + url, function (json) {
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
      network$1.clear();
    }

    var KP = {
      get: get,
      getComplite: getComplite,
      getCompliteIf: getCompliteIf,
      getCache: getCache,
      setCache: setCache,
      getFromCache: getFromCache,
      clear: clear
    };

    function lumex(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      extract.seasons = [];
      extract.season_num = [];
      extract.media = [];
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prefer_mp4 = Lampa.Storage.field('online_mod_prefer_mp4') === true;
      var prox = component.proxy('lumex');
      var host = atob('aHR0cHM6Ly9wLmx1bWV4LnNwYWNl');
      var ref = host + '/';
      var user_agent = Utils.baseUserAgent();
      var headers = Lampa.Platform.is('android') ? {
        'Origin': host,
        'Referer': ref,
        'User-Agent': user_agent,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site'
      } : {};
      var headers2 = Lampa.Platform.is('android') ? {
        'Origin': host,
        'Referer': ref,
        'User-Agent': user_agent,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Cookie': '',
        'x-csrf-token': ''
      } : {};
      var prox_enc = '';

      if (prox) {
        prox_enc += 'param/Origin=' + encodeURIComponent(host) + '/';
        prox_enc += 'param/Referer=' + encodeURIComponent(ref) + '/';
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
        prox_enc += 'param/Sec-Fetch-Dest=empty/';
        prox_enc += 'param/Sec-Fetch-Mode=cors/';
        prox_enc += 'param/Sec-Fetch-Site=same-site/';
      }

      var prox_enc2 = prox_enc;
      var embed = atob('aHR0cHM6Ly9hcGkubHVtZXguc3BhY2Uv');
      var suffix = atob('Y2xpZW50SWQ9Q1dmS1hMYzFhaklkJmRvbWFpbj1tb3ZpZWxhYi5vbmUmdXJsPW1vdmllbGFiLm9uZQ==');
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: '',
        voice_id: 0
      };

      function lumex_search(api, callback, error) {
        var error_check = function error_check(a, c) {
          if (a.status == 404 || a.status == 0 && a.statusText !== 'timeout') {
            if (callback) callback('');
          } else if (error) error(network.errorDecode(a, c));
        };

        var returnHeaders = true;
        var prox_enc_cookie = prox_enc;

        if (prox) {
          prox_enc_cookie += 'cookie_plus/param/Cookie=/';
          returnHeaders = false;
        }

        var success_check = function success_check(json) {
          var cookie = '';

          if (json && json.headers && json.body) {
            var cookieHeaders = json.headers['set-cookie'] || null;

            if (cookieHeaders && cookieHeaders.forEach) {
              var values = {};
              cookieHeaders.forEach(function (param) {
                var parts = param.split(';')[0].split('=');

                if (parts[0]) {
                  if (parts[1] === 'deleted') delete values[parts[0]];else values[parts[0]] = parts[1] || '';
                }
              });
              var cookies = [];

              for (var name in values) {
                cookies.push(name + '=' + values[name]);
              }

              cookie = cookies.join('; ');
            }

            json = typeof json.body === 'string' ? Lampa.Arrays.decodeJson(json.body, {}) : json.body;
          }

          callback(json, cookie);
        };

        network.clear();
        network.timeout(20000);
        network["native"](component.proxyLink(api, prox, prox_enc_cookie), success_check, error_check, false, {
          headers: headers,
          returnHeaders: returnHeaders
        });
      }
      /**
       * Начать поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */


      this.search = function (_object, kinopoisk_id, data) {
        object = _object;
        select_title = object.search || object.movie.title;
        var error = component.empty.bind(component);
        var found = false;
        var src = embed + 'content';

        if (data && data[0] && data[0].content_type && data[0].id) {
          found = true;
          src = Lampa.Utils.addUrlComponent(src, 'contentType=' + encodeURIComponent(data[0].content_type.replace(/_/g, '-')));
          src = Lampa.Utils.addUrlComponent(src, 'contentId=' + encodeURIComponent(data[0].id));
        } else {
          src = Lampa.Utils.addUrlComponent(src, 'contentType=short');
          src = Lampa.Utils.addUrlComponent(src, (+kinopoisk_id ? 'kpId=' : 'imdbId=') + encodeURIComponent(kinopoisk_id));
        }

        src = Lampa.Utils.addUrlComponent(src, suffix);
        lumex_search(src, function (json, cookie) {
          if (json) success(json, cookie);else if (!found && !object.clarification && object.movie.imdb_id && kinopoisk_id != object.movie.imdb_id) {
            var src2 = embed + 'content';
            src2 = Lampa.Utils.addUrlComponent(src2, 'contentType=short');
            src2 = Lampa.Utils.addUrlComponent(src2, 'imdbId=' + encodeURIComponent(object.movie.imdb_id));
            src2 = Lampa.Utils.addUrlComponent(src2, suffix);
            lumex_search(src2, function (json, cookie) {
              if (json) success(json, cookie);else component.emptyForQuery(select_title);
            }, error);
          } else component.emptyForQuery(select_title);
        }, error);
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: '',
          voice_id: 0
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;

        if (a.stype == 'voice') {
          choice.voice_name = filter_items.voice[b.index];
          choice.voice_id = filter_items.voice_info[b.index] && filter_items.voice_info[b.index].id;
        }

        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function success(json, cookie) {
        component.loading(false);

        if (json && json.player && json.player.media && json.player.media.length) {
          prox_enc2 = prox_enc;

          if (prox) {
            prox_enc2 += 'param/Cookie=' + encodeURIComponent(cookie) + '/';
            prox_enc2 += 'param/x-csrf-token=' + encodeURIComponent(json.meta || '') + '/';
          }

          if (Lampa.Platform.is('android')) {
            headers2['Cookie'] = cookie;
            headers2['x-csrf-token'] = json.meta || '';
          }

          var seasons = [];
          var season_num = [];
          var season_count = 0;
          json.player.media.forEach(function (media) {
            if (media.episodes) {
              season_count++;

              if (media.episodes.length) {
                seasons.push(media);
                season_num.push(media.season_id != null ? media.season_id : season_count);
              }
            } else if (media.media && media.episode_id != null && !season_count) {
              season_count++;
              seasons.push({
                season_id: 1,
                season_name: 'Сезон 1',
                episodes: json.player.media
              });
              season_num.push(1);
            }
          });
          extract = {
            seasons: seasons,
            season_num: season_num,
            media: json.player.media
          };
          filter();
          append(filtred());
        } else component.emptyForQuery(select_title);
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: extract.season_num.map(function (s) {
            return Lampa.Lang.translate('torrent_serial_season') + ' ' + s;
          }),
          season_num: extract.season_num,
          voice: [],
          voice_info: []
        };
        if (!filter_items.season[choice.season]) choice.season = 0;

        if (extract.season_num.length) {
          var season = extract.seasons[choice.season];

          if (season && season.episodes) {
            season.episodes.forEach(function (episode) {
              if (episode.media) {
                episode.media.forEach(function (voice) {
                  if (voice.translation_id != null && voice.translation_name != null) {
                    if (!filter_items.voice_info.some(function (v) {
                      return v.id == voice.translation_id;
                    })) {
                      filter_items.voice.push(voice.translation_name);
                      filter_items.voice_info.push({
                        id: voice.translation_id,
                        name: voice.translation_name
                      });
                    }
                  }
                });
              }
            });
          }
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = -1;

          if (choice.voice_id) {
            var voice = filter_items.voice_info.filter(function (v) {
              return v.id == choice.voice_id;
            })[0];
            if (voice) inx = filter_items.voice_info.indexOf(voice);
          }

          if (inx == -1) inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];

        if (filter_items.season_num.length) {
          var season = extract.seasons[choice.season];
          var season_num = extract.season_num[choice.season];
          var v = filter_items.voice_info[choice.voice];

          if (season && season.episodes && v) {
            var episode_count = 0;
            season.episodes.forEach(function (episode) {
              episode_count++;

              if (episode.media) {
                episode.media.forEach(function (voice) {
                  if (voice.translation_id == v.id) {
                    var episode_num = episode.episode_id != null ? episode.episode_id : episode_count;
                    filtred.push({
                      title: component.formatEpisodeTitle(season_num, episode_num),
                      quality: voice.max_quality ? voice.max_quality + 'p' : '360p ~ 1080p',
                      info: ' / ' + (voice.translation_name || v.name),
                      season: season_num,
                      episode: episode_count,
                      media: voice
                    });
                  }
                });
              }
            });
          }
        } else {
          extract.media.forEach(function (voice) {
            if (voice.translation_id != null && voice.translation_name != null) {
              filtred.push({
                title: voice.translation_name || select_title,
                quality: voice.max_quality ? voice.max_quality + 'p' : '360p ~ 1080p',
                info: '',
                media: voice
              });
            }
          });
        }

        return filtred;
      }
      /**
       * Получить потоки
       * @param {String} str
       * @returns array
       */


      function extractItems(str, url) {
        if (!str) return [];

        try {
          var items = component.parseM3U(str).map(function (item) {
            var link = item.link || '';
            if (prefer_mp4) link = link.replace(/(\.mp4):hls:manifest\.m3u8$/i, '$1');
            var quality = item.height;
            var alt_quality = link.match(/\b(\d\d\d+)\./);

            if (alt_quality) {
              var alt_height = parseInt(alt_quality[1]);
              if (alt_height > quality && alt_height <= 4320) quality = alt_height;
            }

            return {
              label: quality ? quality + 'p' : '360p ~ 1080p',
              quality: quality,
              file: component.proxyLink(component.fixLink(link, url), prox, prox_enc)
            };
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function parseStream(element, call, error, itemsExtractor, str, url) {
        var file = '';
        var quality = false;
        var items = itemsExtractor(str, url);

        if (items && items.length) {
          file = items[0].file;
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = item.file;
          });
        }

        if (file) {
          element.stream = file;
          element.qualitys = quality;
          call(element);
        } else error();
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStreamM3U(element, call, error, file) {
        file = file.replace(/\.mp4:hls:manifest/, '');
        var hls_file = file.replace(/\/\d\d\d+([^\/]*\.m3u8)$/, '/hls$1');
        network.clear();
        network.timeout(5000);
        network["native"](component.proxyLink(hls_file, prox, prox_enc), function (str) {
          parseStream(element, call, error, extractItems, str, hls_file);
        }, function (a, c) {
          if (file != hls_file) {
            network.clear();
            network.timeout(5000);
            network["native"](component.proxyLink(file, prox, prox_enc), function (str) {
              parseStream(element, call, error, extractItems, str, file);
            }, function (a, c) {
              error();
            }, false, {
              dataType: 'text'
            });
          } else error();
        }, false, {
          dataType: 'text'
        });
      }

      function parseSubs(tracks) {
        if (!(tracks && tracks.length)) return false;
        var subtitles = tracks.filter(function (t) {
          return t.kind === 'captions';
        }).map(function (item) {
          var links = item.src || '';
          var link = links.split(' or ').filter(function (link) {
            return link;
          })[0] || '';
          link = component.fixLinkProtocol(link, prefer_http);
          return {
            label: item.label,
            url: component.proxyLink(link, prox, prox_enc)
          };
        }).filter(function (s) {
          return s.url;
        });
        return subtitles.length ? subtitles : false;
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStream(element, call, error) {
        if (element.stream) return call(element);
        if (!element.media.playlist) return error();
        var url = component.fixLink(element.media.playlist, embed);
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(url, prox, prox_enc2), function (json) {
          var url = component.fixLinkProtocol(json && json.url || '', prefer_http);

          if (url) {
            element.subtitles = parseSubs(element.media.tracks);

            if (endsWith(url, '.m3u8')) {
              getStreamM3U(element, call, error, url);
              return;
            }

            element.stream = component.proxyLink(url, prox, prox_enc);
            element.qualitys = false;
            call(element);
          } else error();
        }, function (a, c) {
          error();
        }, {}, {
          headers: headers2
        });
      }
      /**
       * Добавить видео
       * @param {Array} items
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (element.loading) return;
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            element.loading = true;
            getStream(element, function (element) {
              element.loading = false;
              var first = {
                url: component.getDefaultQuality(element.qualitys, element.stream),
                quality: component.renameQualityMap(element.qualitys),
                subtitles: element.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };
              Lampa.Player.play(first);

              if (element.season && Lampa.Platform.version) {
                var playlist = [];
                items.forEach(function (elem) {
                  if (elem == element) {
                    playlist.push(first);
                  } else {
                    var cell = {
                      url: function url(call) {
                        getStream(elem, function (elem) {
                          cell.url = component.getDefaultQuality(elem.qualitys, elem.stream);
                          cell.quality = component.renameQualityMap(elem.qualitys);
                          cell.subtitles = elem.subtitles;
                          call();
                        }, function () {
                          cell.url = '';
                          call();
                        });
                      },
                      timeline: elem.timeline,
                      title: elem.title
                    };
                    playlist.push(cell);
                  }
                });
                Lampa.Player.playlist(playlist);
              } else {
                Lampa.Player.playlist([first]);
              }

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            }, function () {
              element.loading = false;
              Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
            });
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              getStream(element, function (element) {
                call({
                  file: element.stream,
                  quality: element.qualitys
                });
              }, function () {
                Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
              });
            }
          });
        });
        component.start(true);
      }
    }

    function lumex2(component, _object) {
      var network = new Lampa.Reguest();
      var extract = [];
      var object = _object;
      var select_title = '';
      var is_playlist = false;
      var embed = atob('aHR0cHM6Ly9hcGkubGFtcGEuc3RyZWFtL2x1bWV4Lw==');
      var api_suffix = '/' + encodeURIComponent(btoa(window.location.href));
      var cub_id = encodeURIComponent(btoa(Lampa.Storage.get('account', '{}').email || 'none'));
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };

      function lumex_api(api, callback, error) {
        var error_check = function error_check(a, c) {
          if (a.status == 404 || a.status == 500 || a.status == 0 && a.statusText !== 'timeout') {
            if (callback) callback('');
          } else if (error) error(network.errorDecode(a, c));
        };

        var success_check = function success_check(json) {
          callback(json);
        };

        network.clear();
        network.timeout(20000);
        network["native"](api, success_check, error_check);
      }
      /**
       * Начать поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */


      this.search = function (_object, kinopoisk_id, data) {
        object = _object;
        select_title = object.search || object.movie.title;
        var error = component.empty.bind(component);
        var src = embed + 'sId/' + encodeURIComponent(object.movie.id) + '/mod/';

        if (data && data[0] && data[0].content_type && data[0].id) {
          var imdb_id = data[0].imdb_id || 'null';
          var kp_id = data[0].kp_id || 'null';
          src += encodeURIComponent(kp_id) + '/' + encodeURIComponent(imdb_id);
        } else {
          var _imdb_id = (+kinopoisk_id ? !object.clarification && object.movie.imdb_id : kinopoisk_id) || 'null';

          var _kp_id = +kinopoisk_id ? kinopoisk_id : 'null';

          src += encodeURIComponent(_kp_id) + '/' + encodeURIComponent(_imdb_id);
        }

        var original_title = !object.clarification && (object.movie.original_title || object.movie.original_name) || '';
        var search_date = object.search_date || !object.clarification && (object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date) || '0000';
        var search_year = parseInt((search_date + '').slice(0, 4));
        component.checkMyIp(function () {
          var ip = Utils.getMyIp();

          if (!ip) {
            error();
            return;
          }

          var api = src + '/' + cub_id + api_suffix;
          api = Lampa.Utils.addUrlComponent(api, 'ip=' + encodeURIComponent(ip));
          api = Lampa.Utils.addUrlComponent(api, 'search=' + encodeURIComponent(select_title));
          api = Lampa.Utils.addUrlComponent(api, 'original_title=' + encodeURIComponent(original_title));
          api = Lampa.Utils.addUrlComponent(api, 'year=' + search_year);
          lumex_api(api, function (json) {
            if (json) success(json);else component.emptyForQuery(select_title);
          }, error);
        });
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: ''
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function success(json, cookie) {
        component.loading(false);

        if (json && json.folder && Lampa.Arrays.getKeys(json.folder).length) {
          if (json.folder.forEach) {
            extract = json.folder;
            is_playlist = false;
          } else {
            extract = [];
            is_playlist = true;

            for (var voice in json.folder) {
              var seasons = json.folder[voice];

              if (!seasons.forEach) {
                var _loop = function _loop(season_id) {
                  var episodes = seasons[season_id];

                  if (episodes.forEach) {
                    var s = extract.filter(function (s) {
                      return s.season_id === season_id;
                    })[0];

                    if (!s) {
                      s = {
                        season_id: season_id,
                        title: Lampa.Lang.translate('torrent_serial_season') + ' ' + season_id,
                        voices: []
                      };
                      extract.push(s);
                    }

                    s.voices.push({
                      title: voice,
                      episodes: episodes
                    });
                  }
                };

                for (var season_id in seasons) {
                  _loop(season_id);
                }
              }
            }

            extract.sort(function (a, b) {
              return a.season_id - b.season_id;
            });
          }

          filter();
          append(filtred());
        } else component.emptyForQuery(select_title);
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: is_playlist ? extract.map(function (s) {
            return s.title;
          }) : [],
          voice: []
        };
        if (!filter_items.season[choice.season]) choice.season = 0;

        if (is_playlist) {
          var season = extract[choice.season];

          if (season && season.voices) {
            season.voices.forEach(function (voice) {
              filter_items.voice.push(voice.title);
            });
          }
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];

        if (is_playlist) {
          var season = extract[choice.season];

          if (season && season.voices) {
            var voice_title = filter_items.voice[choice.voice];
            season.voices.forEach(function (voice) {
              if (voice.title == voice_title && voice.episodes) {
                voice.episodes.forEach(function (episode) {
                  filtred.push({
                    title: component.formatEpisodeTitle(episode.season, episode.episode),
                    quality: episode.quality || '360p ~ 1080p',
                    info: ' / ' + voice_title,
                    season: episode.season + '',
                    episode: episode.episode,
                    media: episode,
                    subtitles: parseSubs(episode.subtitles),
                    vast_url: episode.vast_url,
                    vast_msg: episode.vast_msg
                  });
                });
              }
            });
          }
        } else {
          extract.forEach(function (voice) {
            if (voice.url) {
              filtred.push({
                title: voice.title || select_title,
                quality: voice.quality || '360p ~ 1080p',
                info: '',
                media: voice,
                subtitles: parseSubs(voice.subtitles),
                vast_url: voice.vast_url,
                vast_msg: voice.vast_msg
              });
            }
          });
        }

        return filtred;
      }

      function parseSubs(tracks) {
        if (!(tracks && tracks.forEach)) return false;
        var subtitles = tracks.map(function (item) {
          return {
            label: item.label,
            url: item.url || ''
          };
        }).filter(function (s) {
          return s.url;
        });
        return subtitles.length ? subtitles : false;
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStream(element, call, error) {
        if (element.stream) return call(element);
        var ip = Utils.getMyIp();
        if (!element.media.url || !ip) return error();
        var api = element.media.url + '/' + encodeURIComponent(ip) + api_suffix;
        lumex_api(api, function (json) {
          if (json && json.url) {
            element.stream = json.url;
            element.qualitys = json.qualitys || false;
            call(element);
          } else error();
        }, error);
      }
      /**
       * Добавить видео
       * @param {Array} items
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (element.loading) return;
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            element.loading = true;
            getStream(element, function (element) {
              element.loading = false;
              var first = {
                url: component.getDefaultQuality(element.qualitys, element.stream),
                quality: component.renameQualityMap(element.qualitys),
                subtitles: element.subtitles,
                vast_url: element.vast_url,
                vast_msg: element.vast_msg,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };
              Lampa.Player.play(first);

              if (element.season && Lampa.Platform.version) {
                var playlist = [];
                items.forEach(function (elem) {
                  if (elem == element) {
                    playlist.push(first);
                  } else {
                    var cell = {
                      url: function url(call) {
                        getStream(elem, function (elem) {
                          cell.url = component.getDefaultQuality(elem.qualitys, elem.stream);
                          cell.quality = component.renameQualityMap(elem.qualitys);
                          cell.subtitles = elem.subtitles;
                          call();
                        }, function () {
                          cell.url = '';
                          call();
                        });
                      },
                      vast_url: elem.vast_url,
                      vast_msg: elem.vast_msg,
                      timeline: elem.timeline,
                      title: elem.title
                    };
                    playlist.push(cell);
                  }
                });
                Lampa.Player.playlist(playlist);
              } else {
                Lampa.Player.playlist([first]);
              }

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            }, function () {
              element.loading = false;
              Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
            });
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              getStream(element, function (element) {
                call({
                  file: element.stream,
                  quality: element.qualitys
                });
              }, function () {
                Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
              });
            }
          });
        });
        component.start(true);
      }
    }

    function rezka2(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prefer_mp4 = Lampa.Storage.field('online_mod_prefer_mp4') === true;
      var proxy_mirror = Lampa.Storage.field('online_mod_proxy_rezka2_mirror') === true;
      var prox = component.proxy('rezka2');
      var host = prox && !proxy_mirror ? 'https://rezka.ag' : Utils.rezka2Mirror();
      var ref = host + '/';
      var logged_in = !(prox || Lampa.Platform.is('android'));
      var user_agent = Utils.baseUserAgent();
      var headers = Lampa.Platform.is('android') ? {
        'Origin': host,
        'Referer': ref,
        'User-Agent': user_agent
      } : {};
      var prox_enc = '';

      if (prox) {
        prox_enc += 'param/Origin=' + encodeURIComponent(host) + '/';
        prox_enc += 'param/Referer=' + encodeURIComponent(ref) + '/';
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
      }

      var cookie = Lampa.Storage.get('online_mod_rezka2_cookie', '') + '';
      if (cookie.indexOf('PHPSESSID=') == -1) cookie = 'PHPSESSID=' + Utils.randomId(26) + (cookie ? '; ' + cookie : '');

      if (cookie) {
        if (Lampa.Platform.is('android')) {
          headers.Cookie = cookie;
        }

        if (prox) {
          prox_enc += 'param/Cookie=' + encodeURIComponent(cookie) + '/';
        }
      }

      var embed = ref;
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: '',
        season_id: ''
      };
      var error_message = '';

      function checkErrorForm(str) {
        var login_form = str.match(/<form id="check-form" class="check-form" method="post" action="\/ajax\/login\/">/);

        if (login_form) {
          error_message = Lampa.Lang.translate('online_mod_authorization_required') + ' HDrezka';
          return;
        }

        var error_form = str.match(/(<div class="error-code">[^<]*<div>[^<]*<\/div>[^<]*<\/div>)\s*(<div class="error-title">[^<]*<\/div>)/);

        if (error_form) {
          error_message = ($(error_form[1]).text().trim() || '') + ':\n' + ($(error_form[2]).text().trim() || '');
          return;
        }

        var verify_form = str.match(/<span>MIRROR<\/span>.*<button type="submit" onclick="\$\.cookie(\([^)]*\))/);

        if (verify_form) {
          error_message = Lampa.Lang.translate('online_mod_unsupported_mirror') + ' HDrezka';
          return;
        }

        if (startsWith(str, 'Fatal error:')) {
          error_message = str;
          return;
        }
      }
      /**
       * Поиск
       * @param {Object} _object
       */


      this.search = function (_object, kinopoisk_id, data) {
        var _this = this;

        object = _object;
        select_title = object.search || object.movie.title;
        if (this.wait_similars && data && data[0].is_similars) return getPage(data[0].link);
        error_message = '';
        var search_date = object.search_date || !object.clarification && (object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date) || '0000';
        var search_year = parseInt((search_date + '').slice(0, 4));
        var orig_titles = [];

        if (object.movie.alternative_titles && object.movie.alternative_titles.results) {
          orig_titles = object.movie.alternative_titles.results.map(function (t) {
            return t.title;
          });
        }

        if (object.movie.original_title) orig_titles.push(object.movie.original_title);
        if (object.movie.original_name) orig_titles.push(object.movie.original_name);
        var url = embed + 'engine/ajax/search.php';
        var more_url = embed + 'search/?do=search&subaction=search';

        var query_more = function query_more(query, page, data, callback) {
          var url = more_url + '&q=' + encodeURIComponent(query) + '&page=' + encodeURIComponent(page);
          network.clear();
          network.timeout(10000);
          network["native"](component.proxyLink(url, prox, prox_enc, prox_enc), function (str) {
            str = (str || '').replace(/\n/g, '');
            checkErrorForm(str);
            var links = str.match(/<div class="b-content__inline_item-link">\s*<a [^>]*>[^<]*<\/a>\s*<div>[^<]*<\/div>\s*<\/div>/g);
            var have_more = !!str.match(/<a [^>]*>\s*<span class="b-navigation__next\b/);

            if (links && links.length) {
              var items = links.map(function (l) {
                var li = $(l);
                var link = $('a', li);
                var info_div = $('div', li);
                var titl = link.text().trim() || '';
                var info = info_div.text().trim() || '';
                var orig_title = '';
                var year;
                var found = info.match(/^(\d{4})\b/);

                if (found) {
                  year = parseInt(found[1]);
                }

                return {
                  year: year,
                  title: titl,
                  orig_title: orig_title,
                  link: link.attr('href') || ''
                };
              });
              data = data.concat(items);
            }

            if (callback) callback(data, have_more);
          }, function (a, c) {
            component.empty(network.errorDecode(a, c));
          }, false, {
            dataType: 'text',
            withCredentials: logged_in,
            headers: headers
          });
        };

        var search_more = function search_more(params) {
          var items = params.items || [];
          var query = params.query || '';
          var page = params.page || 1;
          query_more(query, page, items, function (items, have_more) {
            if (items && items.length) {
              _this.wait_similars = true;
              items.forEach(function (c) {
                c.is_similars = true;
              });

              if (have_more) {
                component.similars(items, search_more, {
                  items: [],
                  query: query,
                  page: page + 1
                });
              } else {
                component.similars(items);
              }

              component.loading(false);
            } else if (error_message) component.empty(error_message);else component.emptyForQuery(select_title);
          });
        };

        var display = function display(links, have_more, query) {
          if (links && links.length && links.forEach) {
            var is_sure = false;
            var items = links.map(function (l) {
              var li = $(l);
              var link = $('a', li);
              var enty = $('.enty', link);
              var rating = $('.rating', link);
              var titl = enty.text().trim() || '';
              enty.remove();
              rating.remove();
              var alt_titl = link.text().trim() || '';
              var orig_title = '';
              var year;
              var found = alt_titl.match(/\((.*,\s*)?\b(\d{4})(\s*-\s*[\d.]*)?\)$/);

              if (found) {
                if (found[1]) {
                  var found_alt = found[1].match(/^([^а-яА-ЯёЁ]+),/);
                  if (found_alt) orig_title = found_alt[1].trim();
                }

                year = parseInt(found[2]);
              }

              return {
                year: year,
                title: titl,
                orig_title: orig_title,
                link: link.attr('href') || ''
              };
            });
            var cards = items;

            if (cards.length) {
              if (orig_titles.length) {
                var tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.orig_title, c.title], orig_titles);
                });

                if (tmp.length) {
                  cards = tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.title, c.orig_title], [select_title]);
                });

                if (_tmp.length) {
                  cards = _tmp;
                  is_sure = true;
                }
              }

              if (cards.length > 1 && search_year) {
                var _tmp2 = cards.filter(function (c) {
                  return c.year == search_year;
                });

                if (!_tmp2.length) _tmp2 = cards.filter(function (c) {
                  return c.year && c.year > search_year - 2 && c.year < search_year + 2;
                });
                if (_tmp2.length) cards = _tmp2;
              }
            }

            if (cards.length == 1 && is_sure) {
              if (search_year && cards[0].year) {
                is_sure = cards[0].year > search_year - 2 && cards[0].year < search_year + 2;
              }

              if (is_sure) {
                is_sure = false;

                if (orig_titles.length) {
                  is_sure |= component.equalAnyTitle([cards[0].orig_title, cards[0].title], orig_titles);
                }

                if (select_title) {
                  is_sure |= component.equalAnyTitle([cards[0].title, cards[0].orig_title], [select_title]);
                }
              }
            }

            if (cards.length == 1 && is_sure) getPage(cards[0].link);else if (items.length) {
              _this.wait_similars = true;
              items.forEach(function (c) {
                c.is_similars = true;
              });

              if (have_more) {
                component.similars(items, search_more, {
                  items: [],
                  query: query,
                  page: 1
                });
              } else {
                component.similars(items);
              }

              component.loading(false);
            } else component.emptyForQuery(select_title);
          } else if (error_message) component.empty(error_message);else component.emptyForQuery(select_title);
        };

        var query_search = function query_search(query, data, callback) {
          var postdata = 'q=' + encodeURIComponent(query);
          network.clear();
          network.timeout(10000);
          network["native"](component.proxyLink(url, prox, prox_enc), function (str) {
            str = (str || '').replace(/\n/g, '');
            checkErrorForm(str);
            var links = str.match(/<li><a href=.*?<\/li>/g);
            var have_more = str.indexOf('<a class="b-search__live_all"') !== -1;
            if (links && links.length) data = data.concat(links);
            if (callback) callback(data, have_more, query);
          }, function (a, c) {
            if (prox && a.status == 403 && (!a.responseText || a.responseText.indexOf('<div>105</div>') !== -1)) {
              Lampa.Storage.set('online_mod_proxy_rezka2', 'false');
            }

            if (a.status == 403 && a.responseText) {
              var str = (a.responseText || '').replace(/\n/g, '');
              checkErrorForm(str);
            }

            if (error_message) component.empty(error_message);else component.empty(network.errorDecode(a, c));
          }, postdata, {
            dataType: 'text',
            withCredentials: logged_in,
            headers: headers
          });
        };

        var query_title_search = function query_title_search() {
          query_search(component.cleanTitle(select_title), [], function (data, have_more, query) {
            if (data && data.length && data.forEach) display(data, have_more, query);else display([]);
          });
        };

        query_title_search();
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: '',
          season_id: ''
        };
        component.loading(true);
        getEpisodes(success);
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        if (a.stype == 'season') choice.season_id = filter_items.season_id[b.index];
        component.reset();
        component.loading(true);
        getEpisodes(success);
        component.saveChoice(choice);
        setTimeout(component.closeFilter, 10);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function getPage(url) {
        url = component.fixLink(url, ref);
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(url, prox, prox_enc), function (str) {
          extractData(str);

          if (extract.film_id) {
            getEpisodes(success);
          } else if (error_message) component.empty(error_message);else component.emptyForQuery(select_title);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        }, false, {
          dataType: 'text',
          withCredentials: logged_in,
          headers: headers
        });
      }

      function success() {
        component.loading(false);
        filter();
        append(filtred());
      }
      /**
       * Получить данные о фильме
       * @param {String} str
       */


      function extractData(str) {
        extract.voice = [];
        extract.season = [];
        extract.episode = [];
        extract.voice_data = {};
        extract.is_series = false;
        extract.film_id = '';
        extract.favs = '';
        str = (str || '').replace(/\n/g, '');
        checkErrorForm(str);
        var translation = str.match(/<h2>В переводе<\/h2>:<\/td>\s*(<td>.*?<\/td>)/);
        var cdnSeries = str.match(/\.initCDNSeriesEvents\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,/);
        var cdnMovie = str.match(/\.initCDNMoviesEvents\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,/);
        var devVoiceName;

        if (translation) {
          devVoiceName = $(translation[1]).text().trim();
        }

        if (!devVoiceName) devVoiceName = 'Оригинал';
        var defVoice, defSeason, defEpisode;

        if (cdnSeries) {
          extract.is_series = true;
          extract.film_id = cdnSeries[1];
          defVoice = {
            name: devVoiceName,
            id: cdnSeries[2]
          };
          defSeason = {
            name: 'Сезон ' + cdnSeries[3],
            id: cdnSeries[3]
          };
          defEpisode = {
            name: 'Серия ' + cdnSeries[4],
            season_id: cdnSeries[3],
            episode_id: cdnSeries[4]
          };
        } else if (cdnMovie) {
          extract.film_id = cdnMovie[1];
          defVoice = {
            name: devVoiceName,
            id: cdnMovie[2],
            is_camrip: cdnMovie[3],
            is_ads: cdnMovie[4],
            is_director: cdnMovie[5]
          };
        }

        var voices = str.match(/(<ul id="translators-list".*?<\/ul>)/);

        if (voices) {
          var select = $(voices[1]);
          $('.b-translator__item', select).each(function () {
            var title = ($(this).attr('title') || $(this).text() || '').trim();
            $('img', this).each(function () {
              var lang = ($(this).attr('title') || $(this).attr('alt') || '').trim();
              if (lang && title.indexOf(lang) == -1) title += ' (' + lang + ')';
            });
            extract.voice.push({
              name: title,
              id: $(this).attr('data-translator_id'),
              is_camrip: $(this).attr('data-camrip'),
              is_ads: $(this).attr('data-ads'),
              is_director: $(this).attr('data-director')
            });
          });
        }

        if (!extract.voice.length && defVoice) {
          extract.voice.push(defVoice);
        }

        if (extract.is_series) {
          var seasons = str.match(/(<ul id="simple-seasons-tabs".*?<\/ul>)/);

          if (seasons) {
            var _select = $(seasons[1]);

            $('.b-simple_season__item', _select).each(function () {
              extract.season.push({
                name: $(this).text(),
                id: $(this).attr('data-tab_id')
              });
            });
          }

          if (!extract.season.length && defSeason) {
            extract.season.push(defSeason);
          }

          var episodes = str.match(/(<div id="simple-episodes-tabs".*?<\/div>)/);

          if (episodes) {
            var _select2 = $(episodes[1]);

            $('.b-simple_episode__item', _select2).each(function () {
              extract.episode.push({
                name: $(this).text(),
                season_id: $(this).attr('data-season_id'),
                episode_id: $(this).attr('data-episode_id')
              });
            });
          }

          if (!extract.episode.length && defEpisode) {
            extract.episode.push(defEpisode);
          }
        }

        var favs = str.match(/<input type="hidden" id="ctrl_favs" value="([^"]*)"/);
        if (favs) extract.favs = favs[1];
        var blocked = str.match(/class="b-player__restricted__block_message"/);
        if (blocked) extract.blocked = true;
      }

      function getEpisodes(call) {
        if (extract.is_series) {
          filterVoice();

          if (extract.voice[choice.voice]) {
            var translator_id = extract.voice[choice.voice].id;
            var data = extract.voice_data[translator_id];

            if (data) {
              extract.season = data.season;
              extract.episode = data.episode;
            } else {
              var url = embed + 'ajax/get_cdn_series/?t=' + Date.now();
              var postdata = 'id=' + encodeURIComponent(extract.film_id);
              postdata += '&translator_id=' + encodeURIComponent(translator_id);
              postdata += '&favs=' + encodeURIComponent(extract.favs);
              postdata += '&action=get_episodes';
              network.clear();
              network.timeout(10000);
              network["native"](component.proxyLink(url, prox, prox_enc), function (json) {
                extractEpisodes(json, translator_id);
                call();
              }, function (a, c) {
                component.empty(network.errorDecode(a, c));
              }, postdata, {
                withCredentials: logged_in,
                headers: headers
              });
              return;
            }
          }
        }

        call();
      }

      function extractEpisodes(json, translator_id) {
        var data = {
          season: [],
          episode: []
        };

        if (json && json.seasons) {
          var select = $('<ul>' + json.seasons + '</ul>');
          $('.b-simple_season__item', select).each(function () {
            data.season.push({
              name: $(this).text(),
              id: $(this).attr('data-tab_id')
            });
          });
        }

        if (json && json.episodes) {
          var _select3 = $('<div>' + json.episodes + '</div>');

          $('.b-simple_episode__item', _select3).each(function () {
            data.episode.push({
              name: $(this).text(),
              translator_id: translator_id,
              season_id: $(this).attr('data-season_id'),
              episode_id: $(this).attr('data-episode_id')
            });
          });
        }

        extract.voice_data[translator_id] = data;
        extract.season = data.season;
        extract.episode = data.episode;
      }

      function filterVoice() {
        var voice = extract.is_series ? extract.voice.map(function (v) {
          return v.name;
        }) : [];
        if (!voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: extract.season.map(function (s) {
            return s.name;
          }),
          season_id: extract.season.map(function (s) {
            return s.id;
          }),
          voice: extract.is_series ? extract.voice.map(function (v) {
            return v.name;
          }) : []
        };
        if (!filter_items.season[choice.season]) choice.season = 0;
        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        if (choice.season_id) {
          var _inx = filter_items.season_id.indexOf(choice.season_id);

          if (_inx == -1) choice.season = 0;else if (_inx !== choice.season) {
            choice.season = _inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStream(element, call, error) {
        if (element.stream) return call(element);
        var url = embed + 'ajax/get_cdn_series/?t=' + Date.now();
        var postdata = 'id=' + encodeURIComponent(extract.film_id);

        if (extract.is_series) {
          postdata += '&translator_id=' + encodeURIComponent(element.media.translator_id);
          postdata += '&season=' + encodeURIComponent(element.media.season_id);
          postdata += '&episode=' + encodeURIComponent(element.media.episode_id);
          postdata += '&favs=' + encodeURIComponent(extract.favs);
          postdata += '&action=get_stream';
        } else {
          postdata += '&translator_id=' + encodeURIComponent(element.media.id);
          postdata += '&is_camrip=' + encodeURIComponent(element.media.is_camrip);
          postdata += '&is_ads=' + encodeURIComponent(element.media.is_ads);
          postdata += '&is_director=' + encodeURIComponent(element.media.is_director);
          postdata += '&favs=' + encodeURIComponent(extract.favs);
          postdata += '&action=get_movie';
        }

        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(url, prox, prox_enc), function (json) {
          if (json && json.url) {
            var video = decode(json.url),
                file = '',
                quality = false;
            var items = extractItems(video);

            if (items && items.length) {
              file = items[0].file;
              var premium_content = json.premium_content || false;
              var prev_file = '';
              quality = {};
              items.forEach(function (item) {
                if (item.label !== '1080p Ultra') {
                  if (prev_file !== '' && prev_file !== item.file) premium_content = false;
                  prev_file = item.file;
                }

                quality[item.label] = item.file;
              });

              if (premium_content) {
                error('Перевод доступен только с HDrezka Premium');
                return;
              }
            }

            if (file) {
              element.stream = file;
              element.qualitys = quality;
              element.subtitles = parseSubtitles(json.subtitle);
              call(element);
            } else error();
          } else error();
        }, function (a, c) {
          error();
        }, postdata, {
          withCredentials: logged_in,
          headers: headers
        });
      }

      function decode(data) {
        if (!startsWith(data, '#')) return data;

        var enc = function enc(str) {
          return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
          }));
        };

        var dec = function dec(str) {
          return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
        };

        var trashList = ['$$!!@$$@^!@#$$@', '@@@@@!##!^^^', '####^!!##!@@', '^^^!@##!!##', '$$#!!@#!@##'];
        var x = data.substring(2);
        trashList.forEach(function (trash) {
          x = x.replace('//_//' + enc(trash), '');
        });

        try {
          x = dec(x);
        } catch (e) {
          x = '';
        }

        return x;
      }
      /**
       * Получить потоки
       * @param {String} str
       * @returns array
       */


      function extractItems(str) {
        if (!str) return [];

        try {
          var items = component.parsePlaylist(str).map(function (item) {
            var int_quality = NaN;
            var quality = item.label.match(/(\d\d\d+)p/);

            if (quality) {
              int_quality = parseInt(quality[1]);
            } else {
              quality = item.label.match(/(\d+)K/);

              if (quality) {
                int_quality = parseInt(quality[1]) * 1000;
              }
            }

            var links;

            if (prefer_mp4) {
              links = item.links.filter(function (url) {
                return /\.mp4$/i.test(url);
              });
            } else {
              links = item.links.filter(function (url) {
                return /\.m3u8$/i.test(url);
              });
            }

            if (!links.length) links = item.links;
            var link = links[0] || '';
            link = component.fixLinkProtocol(link, prefer_http, 'full');
            return {
              label: item.label,
              quality: int_quality,
              file: component.proxyStream(link, 'rezka2')
            };
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }

      function parseSubtitles(str) {
        var subtitles = [];

        if (str) {
          subtitles = component.parsePlaylist(str).map(function (item) {
            var link = item.links[0] || '';
            link = component.fixLinkProtocol(link, prefer_http, 'full');
            return {
              label: item.label,
              url: component.processSubs(link)
            };
          });
        }

        return subtitles.length ? subtitles : false;
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];

        if (extract.is_series) {
          var season_name = filter_items.season[choice.season];
          var season_id;
          extract.season.forEach(function (season) {
            if (season.name == season_name) season_id = season.id;
          });
          var voice = filter_items.voice[choice.voice];
          extract.episode.forEach(function (episode) {
            if (episode.season_id == season_id) {
              filtred.push({
                title: component.formatEpisodeTitle(episode.season_id, null, episode.name),
                quality: '360p ~ 1080p',
                info: ' / ' + voice,
                season: parseInt(episode.season_id),
                episode: parseInt(episode.episode_id),
                media: episode
              });
            }
          });
        } else {
          extract.voice.forEach(function (voice) {
            filtred.push({
              title: voice.name || select_title,
              quality: '360p ~ 1080p',
              info: '',
              media: voice
            });
          });
        }

        return filtred;
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (element.loading) return;
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            element.loading = true;
            getStream(element, function (element) {
              element.loading = false;
              var first = {
                url: component.getDefaultQuality(element.qualitys, element.stream),
                quality: component.renameQualityMap(element.qualitys),
                subtitles: element.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };
              Lampa.Player.play(first);

              if (element.season && Lampa.Platform.version) {
                var playlist = [];
                items.forEach(function (elem) {
                  if (elem == element) {
                    playlist.push(first);
                  } else {
                    var cell = {
                      url: function url(call) {
                        getStream(elem, function (elem) {
                          cell.url = component.getDefaultQuality(elem.qualitys, elem.stream);
                          cell.quality = component.renameQualityMap(elem.qualitys);
                          cell.subtitles = elem.subtitles;
                          call();
                        }, function () {
                          cell.url = '';
                          call();
                        });
                      },
                      timeline: elem.timeline,
                      title: elem.title
                    };
                    playlist.push(cell);
                  }
                });
                Lampa.Player.playlist(playlist);
              } else {
                Lampa.Player.playlist([first]);
              }

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            }, function (error) {
              element.loading = false;
              Lampa.Noty.show(error || Lampa.Lang.translate(extract.blocked ? 'online_mod_blockedlink' : 'online_mod_nolink'));
            });
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              getStream(element, function (element) {
                call({
                  file: element.stream,
                  quality: element.qualitys
                });
              }, function (error) {
                Lampa.Noty.show(error || Lampa.Lang.translate(extract.blocked ? 'online_mod_blockedlink' : 'online_mod_nolink'));
              });
            }
          });
        });
        component.start(true);
      }
    }

    function kinobase(component, _object) {
      var network = new Lampa.Reguest();
      var extract = [];
      var object = _object;
      var select_title = '';
      var is_playlist = false;
      var quality_type = '';
      var translation = '';
      var prefer_mp4 = Lampa.Storage.field('online_mod_prefer_mp4') === true;
      var file_type = prefer_mp4 ? 'mp4' : 'hls';
      var prox = component.proxy('kinobase');
      var host = prox ? 'https://kinobase.org' : Utils.kinobaseMirror();
      var ref = host + '/';
      var embed = ref;
      var logged_in = !(prox || Lampa.Platform.is('android'));
      var user_agent = Utils.baseUserAgent();
      var check_cookie = Lampa.Storage.get('online_mod_kinobase_cookie', '') + '';
      var prox_enc_stream = '';
      var decrypt = Utils.decodeSecret([21, 65, 66, 83, 20, 68, 66, 66, 80, 84, 64, 19, 13, 20, 31, 80, 69, 87, 84, 64, 88, 89, 90, 31, 69, 83, 75, 94, 68, 69, 7, 24, 23, 69, 83, 75, 94, 68, 69, 4, 24, 23, 69, 68, 75, 27, 20, 97, 122, 117, 110, 115, 98, 102, 99, 109, 97, 115, 24, 23, 112, 121, 117, 114, 107, 101, 111, 100, 114, 26, 16, 76, 68, 81, 67, 26, 20, 65, 89, 84, 16, 76, 20, 71, 87, 70, 23, 68, 85, 74, 23, 9, 17, 109, 105, 12, 22, 70, 88, 69, 20, 65, 90, 85, 78, 83, 66, 25, 10, 20, 95, 67, 88, 91, 13, 16, 79, 86, 70, 17, 82, 91, 84, 67, 93, 92, 89, 64, 17, 11, 20, 31, 88, 85, 78, 23, 112, 126, 123, 100, 86, 68, 67, 92, 69, 29, 31, 70, 85, 69, 69, 85, 127, 69, 91, 92, 101, 64, 69, 95, 94, 94, 31, 22, 13, 94, 81, 86, 82, 14, 5, 24, 92, 84, 87, 80, 9, 10, 82, 86, 83, 77, 15, 10, 27, 85, 89, 84, 64, 9, 22, 29, 22, 22, 67, 83, 72, 77, 24, 92, 69, 91, 88, 21, 31, 11, 25, 65, 85, 67, 22, 68, 86, 67, 67, 92, 104, 64, 88, 91, 81, 23, 11, 16, 9, 12, 20, 71, 87, 70, 23, 80, 102, 86, 94, 80, 17, 11, 20, 81, 67, 94, 90, 67, 93, 94, 88, 28, 30, 77, 77, 2, 23, 66, 80, 68, 20, 81, 127, 94, 77, 23, 9, 17, 80, 65, 89, 85, 68, 80, 88, 90, 25, 31, 79, 23, 68, 85, 77, 66, 70, 95, 22, 5, 12, 22, 77, 2, 23, 66, 80, 68, 20, 111, 123, 124, 113, 67, 64, 65, 100, 81, 70, 67, 85, 74, 67, 20, 12, 22, 82, 66, 88, 83, 77, 94, 91, 95, 22, 108, 122, 122, 120, 77, 67, 68, 99, 83, 69, 66, 83, 67, 77, 31, 29, 74, 22, 64, 95, 95, 67, 23, 88, 68, 84, 88, 20, 10, 22, 86, 76, 89, 87, 69, 95, 91, 89, 30, 93, 21, 23, 65, 24, 77, 20, 69, 83, 67, 23, 71, 65, 66, 94, 28, 76, 22, 69, 75, 91, 14, 17, 67, 20, 74, 31, 11, 25, 74, 15, 17, 66, 92, 94, 69, 30, 74, 82, 90, 85, 22, 9, 23, 80, 69, 87, 84, 64, 88, 89, 90, 31, 31, 75, 68, 12, 20, 76, 13, 20, 65, 87, 66, 25, 103, 88, 80, 79, 81, 69, 92, 67, 25, 10, 20, 87, 67, 90, 84, 66, 89, 86, 89, 20, 97, 90, 85, 78, 83, 66, 83, 68, 28, 94, 70, 64, 30, 77, 16, 73, 91, 85, 72, 83, 70, 23, 11, 16, 86, 71, 64, 10, 22, 73, 12, 22, 70, 88, 69, 20, 83, 87, 95, 6, 4, 3, 25, 10, 20, 74, 22, 85, 93, 87, 72, 106, 82, 64, 68, 70, 14, 23, 18, 30, 88, 93, 85, 73, 101, 81, 67, 67, 64, 21, 23, 87, 94, 89, 95, 94, 83, 10, 25, 19, 26, 82, 89, 91, 92, 95, 85, 21, 23, 85, 91, 87, 76, 13, 22, 20, 23, 86, 94, 80, 78, 24, 23, 81, 85, 77, 13, 20, 21, 24, 83, 82, 66, 28, 25, 71, 91, 66, 66, 14, 23, 18, 30, 73, 88, 71, 69, 26, 20, 80, 83, 68, 106, 84, 70, 88, 70, 64, 13, 22, 20, 23, 80, 81, 69, 101, 87, 69, 95, 64, 77, 27, 20, 66, 83, 64, 99, 95, 93, 92, 88, 65, 69, 12, 20, 64, 95, 94, 93, 88, 67, 31, 69, 81, 67, 98, 89, 84, 82, 91, 68, 66, 24, 23, 85, 92, 92, 86, 70, 101, 95, 89, 82, 89, 69, 77, 13, 20, 70, 95, 90, 83, 89, 71, 23, 84, 88, 84, 87, 70, 99, 95, 93, 92, 88, 65, 69, 26, 20, 68, 83, 68, 112, 89, 64, 84, 68, 66, 86, 90, 10, 25, 64, 93, 95, 82, 91, 64, 24, 67, 92, 67, 125, 95, 66, 81, 69, 64, 81, 85, 27, 20, 82, 90, 81, 86, 68, 121, 87, 67, 81, 67, 64, 85, 91, 12, 16, 78, 94, 90, 85, 89, 67, 25, 85, 92, 92, 86, 70, 120, 88, 64, 82, 68, 70, 88, 91, 24, 17, 85, 91, 89, 69, 95, 85, 82, 14, 17, 65, 93, 89, 82, 95, 78, 25, 87, 94, 88, 71, 88, 90, 85, 21, 23, 100, 93, 87, 77, 82, 68, 90, 74, 13, 20, 70, 95, 90, 83, 89, 71, 23, 103, 88, 80, 79, 81, 69, 92, 67, 21, 23, 82, 95, 105, 93, 89, 95, 68, 3, 23, 16, 31, 80, 90, 25, 95, 94, 80, 67, 24, 17, 80, 90, 104, 68, 85, 88, 83, 77, 11, 22, 16, 25, 80, 94, 23, 69, 81, 80, 82, 77, 27, 22, 111, 3, 23, 22, 19, 22, 73, 12, 22, 68, 75, 78, 20, 74, 22, 64, 69, 79, 16, 66, 23, 16, 31, 87, 94, 86, 78, 99, 92, 67, 65, 65, 22, 9, 23, 18, 30, 90, 88, 91, 90, 95, 81, 23, 11, 16, 95, 97, 91, 88, 82, 15, 23, 18, 30, 88, 93, 85, 73, 22, 9, 23, 80, 69, 87, 84, 64, 88, 89, 90, 31, 69, 85, 77, 67, 93, 95, 81, 71, 30, 77, 16, 80, 81, 20, 25, 69, 81, 67, 66, 89, 87, 80, 71, 31, 91, 81, 67, 94, 95, 93, 23, 9, 12, 11, 20, 21, 126, 117, 120, 115, 22, 17, 74, 72, 23, 69, 85, 77, 67, 93, 95, 81, 71, 25, 66, 73, 73, 82, 20, 12, 11, 9, 23, 20, 120, 124, 118, 112, 19, 31, 79, 23, 95, 86, 25, 31, 71, 84, 66, 64, 94, 88, 87, 74, 25, 71, 68, 85, 87, 82, 69, 67, 16, 23, 71, 84, 66, 64, 94, 88, 87, 74, 25, 71, 68, 85, 87, 82, 69, 67, 17, 89, 65, 93, 90, 24, 23, 20, 67, 76, 84, 87, 84, 69, 71, 21, 26, 16, 66, 74, 29, 10, 22, 93, 81, 22, 24, 74, 82, 64, 69, 95, 90, 80, 69, 30, 90, 88, 89, 65, 90, 81, 67, 83, 25, 25, 68, 81, 69, 66, 93, 89, 81, 67, 23, 84, 91, 92, 70, 88, 82, 66, 85, 17, 76, 73, 29, 22, 22, 68, 67, 83, 90, 82, 71, 66, 20, 29, 12, 22, 77, 25, 82, 88, 66, 83, 20, 94, 80, 16, 17, 66, 71, 84, 68, 20, 17, 16, 16, 17, 24, 104, 30, 67, 71, 82, 68, 111, 93, 86, 64, 80, 25, 29, 25, 66, 85, 74, 67, 28, 66, 83, 64, 67, 95, 94, 94, 68, 26, 68, 68, 88, 30, 31, 75, 25, 94, 82, 17, 30, 71, 82, 66, 68, 80, 89, 83, 66, 24, 71, 66, 85, 83, 92, 68, 71, 24, 22, 71, 82, 66, 68, 80, 89, 83, 66, 24, 71, 66, 85, 83, 92, 68, 71, 25, 67, 71, 82, 68, 28, 25, 21, 71, 68, 85, 87, 82, 69, 67, 27, 27, 20, 74, 75, 29, 12, 22, 77, 25, 82, 88, 66, 83, 20, 94, 80, 16, 17, 65, 91, 85, 22, 18, 17, 22, 24, 22, 107, 27, 106, 104, 104, 24, 107, 26, 101, 24, 104, 85, 29, 27, 30, 24, 68, 92, 68, 64, 25, 69, 81, 67, 66, 89, 87, 80, 71, 31, 67, 70, 91, 31, 25, 66, 23, 93, 87, 22, 28, 68, 83, 68, 77, 94, 90, 86, 69, 26, 68, 67, 83, 90, 82, 71, 66, 31, 20, 68, 83, 68, 77, 94, 90, 86, 69, 26, 68, 67, 83, 90, 82, 71, 66, 30, 66, 88, 82, 28, 25, 21, 71, 68, 85, 87, 82, 69, 67, 27, 27, 20, 74, 75, 29, 12, 22, 77, 25, 82, 88, 66, 83, 20, 94, 80, 16, 17, 68, 81, 69, 66, 93, 89, 81, 67, 23, 66, 70, 93, 31, 20, 69, 83, 67, 23, 71, 65, 66, 94, 28, 76, 66, 73, 73, 82, 14, 17, 20, 85, 93, 87, 72, 27, 27, 20, 68, 68, 88, 13, 22, 67, 92, 67, 64, 88, 88, 83, 68, 24, 69, 75, 91, 24, 17, 70, 85, 69, 87, 93, 74, 13, 20, 66, 83, 64, 67, 95, 94, 94, 68, 26, 85, 87, 64, 86, 75, 25, 2, 23, 73, 10, 22, 16, 25, 81, 85, 77, 23, 9, 17, 80, 65, 89, 85, 68, 80, 88, 90, 25, 67, 70, 91, 26, 16, 93, 86, 64, 80, 31, 79, 23, 68, 85, 74, 25, 68, 68, 69, 92, 31, 77, 68, 64, 71, 81, 11, 22, 22, 80, 83, 68, 27, 27, 20, 68, 68, 88, 13, 22, 69, 75, 91, 24, 17, 70, 85, 69, 87, 93, 74, 13, 20, 85, 87, 64, 86, 75, 25, 2, 23, 73, 10, 22, 16, 25, 70, 95, 74, 67, 20, 12, 22, 82, 66, 88, 83, 77, 94, 91, 95, 30, 65, 69, 90, 28, 25, 83, 85, 69, 87, 29, 76, 22, 66, 92, 68, 26, 65, 67, 71, 95, 30, 75, 77, 78, 68, 84, 12, 20, 21, 70, 95, 74, 67, 22, 29, 22, 65, 69, 90, 10, 25, 66, 70, 93, 26, 20, 71, 87, 66, 88, 90, 71, 11, 22, 80, 86, 66, 81, 68, 30, 15, 17, 75, 15, 23, 18, 30, 94, 82, 64, 98, 85, 70, 94, 70, 68, 25, 10, 20, 87, 67, 90, 84, 66, 89, 86, 89, 28, 68, 68, 88, 30, 77, 16, 75, 82, 71, 31, 70, 65, 68, 94, 24, 66, 67, 77, 65, 83, 14, 23, 20, 87, 92, 67, 103, 82, 68, 93, 71, 66, 18, 21, 23, 65, 67, 90, 14, 23, 67, 66, 85, 27, 20, 65, 87, 70, 86, 91, 67, 3, 23, 79, 19, 105, 22, 13, 22, 116, 88, 67, 81, 31, 88, 91, 64, 30, 25, 68, 74, 29, 10, 22, 73, 12, 22, 71, 80, 89, 80, 94, 65, 26, 68, 83, 68, 109, 94, 89, 84, 89, 65, 67, 22, 13, 25, 64, 93, 95, 82, 91, 64, 24, 67, 92, 67, 125, 95, 66, 81, 69, 64, 81, 85, 23, 9, 17, 80, 125, 89, 66, 11, 25, 64, 93, 95, 82, 91, 64, 24, 83, 85, 82, 85, 67, 98, 93, 90, 83, 95, 76, 67, 20, 12, 22, 67, 94, 88, 84, 86, 64, 26, 82, 90, 81, 86, 68, 121, 87, 67, 81, 67, 64, 85, 91, 22, 13, 25, 81, 98, 94, 95, 80, 12, 22, 71, 80, 89, 80, 94, 65, 26, 84, 89, 94, 74, 88, 88, 84, 22, 9, 23, 77, 77, 2, 23, 67, 88, 88, 80, 88, 65, 30, 105, 91, 85, 72, 83, 70, 93, 69, 16, 4, 23, 100, 93, 87, 77, 82, 68, 90, 74, 12, 20, 21, 24, 82, 89, 24, 89, 87, 94, 64, 17, 11, 20, 81, 67, 94, 90, 67, 93, 94, 88, 28, 68, 26, 16, 90, 27, 20, 67, 31, 79, 23, 85, 16, 4, 23, 87, 17, 74, 72, 23, 82, 95, 90, 66, 89, 84, 88, 64, 12, 22, 66, 92, 67, 65, 67, 88, 20, 89, 83, 71, 25, 85, 85, 90, 7, 6, 4, 24, 86, 87, 104, 93, 95, 95, 64, 31, 69, 28, 25, 84, 24, 17, 68, 29, 12, 22, 77, 2, 23, 16, 31, 80, 90, 25, 68, 85, 88, 83, 77, 17, 11, 20, 81, 67, 94, 90, 67, 93, 94, 88, 28, 95, 31, 75, 25, 69, 81, 69, 67, 70, 89, 22, 88, 25, 17, 18, 17, 94, 28, 30, 13, 16, 68, 12, 20, 70, 95, 90, 83, 89, 71, 23, 103, 120, 112, 111, 113, 101, 105, 100, 96, 103, 113, 17, 11, 20, 103, 122, 113, 96, 114, 102, 110, 98, 109, 103, 115, 11, 25, 64, 93, 95, 82, 91, 64, 24, 118, 112, 123, 113, 110, 98, 109, 103, 115, 16, 4, 23, 114, 120, 122, 113, 104, 98, 105, 105, 114, 15, 17, 95, 82, 23, 30, 67, 90, 69, 93, 65, 66, 5, 30, 22, 24, 9, 27, 20, 84, 64, 85, 91, 31, 24, 74, 84, 70, 88, 70, 64, 6, 31, 11, 25, 94, 82, 17, 30, 71, 84, 68, 89, 73, 67, 6, 24, 22, 28, 7, 26, 16, 92, 65, 85, 93, 31, 28, 68, 85, 66, 80, 71, 64, 3, 31, 15, 23, 83, 70, 88, 91, 28, 66, 66, 70, 30, 13, 16, 68, 23, 82, 88, 88, 85, 91, 90, 73, 25, 76, 20, 21, 24, 85, 93, 87, 72, 106, 82, 64, 68, 70, 20, 10, 22, 82, 88, 92, 5, 3, 5, 26, 86, 92, 81, 65, 100, 81, 69, 67, 68, 12, 22, 20, 23, 84, 91, 94, 93, 93, 82, 22, 13, 25, 85, 85, 90, 7, 6, 4, 24, 83, 86, 88, 95, 88, 83, 15, 23, 18, 30, 88, 93, 85, 73, 22, 9, 23, 84, 81, 82, 6, 6, 2, 24, 85, 93, 87, 72, 2, 23, 16, 31, 81, 81, 67, 22, 13, 25, 85, 85, 90, 7, 6, 4, 24, 87, 92, 67, 15, 17, 18, 26, 71, 89, 67, 77, 23, 9, 17, 84, 85, 92, 7, 2, 10, 25, 68, 94, 69, 64, 12, 22, 20, 23, 80, 81, 69, 101, 87, 69, 95, 64, 77, 23, 9, 17, 84, 85, 92, 7, 2, 10, 25, 83, 84, 66, 103, 84, 68, 89, 73, 67, 15, 17, 65, 93, 89, 82, 95, 78, 25, 71, 84, 66, 96, 94, 91, 85, 86, 66, 64, 17, 11, 20, 85, 87, 91, 8, 5, 7, 31, 69, 81, 67, 98, 89, 84, 82, 91, 68, 66, 15, 23, 65, 89, 87, 83, 91, 70, 24, 87, 91, 83, 81, 75, 99, 93, 92, 83, 91, 66, 66, 16, 4, 23, 86, 80, 93, 5, 5, 5, 30, 90, 91, 81, 80, 68, 96, 94, 91, 85, 86, 66, 64, 10, 22, 67, 94, 88, 84, 86, 64, 26, 66, 83, 64, 126, 88, 68, 92, 69, 66, 80, 90, 20, 10, 22, 82, 88, 92, 5, 3, 5, 26, 68, 83, 68, 112, 89, 64, 84, 68, 66, 86, 90, 11, 25, 64, 93, 95, 82, 91, 64, 24, 83, 85, 82, 85, 67, 127, 90, 67, 83, 66, 79, 86, 88, 17, 11, 20, 85, 87, 91, 8, 5, 7, 31, 85, 88, 82, 87, 66, 112, 89, 64, 84, 68, 66, 86, 90, 11, 25, 64, 93, 95, 82, 91, 64, 24, 83, 86, 89, 71, 94, 90, 81, 23, 11, 16, 91, 86, 95, 0, 4, 7, 25, 85, 95, 87, 68, 91, 93, 83, 15, 23, 65, 89, 87, 83, 91, 70, 24, 100, 91, 87, 73, 92, 69, 94, 66, 22, 9, 23, 84, 81, 82, 6, 6, 2, 24, 100, 91, 87, 73, 92, 69, 94, 66, 13, 20, 19, 24, 86, 87, 25, 93, 95, 95, 64, 23, 11, 16, 91, 86, 95, 0, 4, 7, 25, 80, 94, 102, 94, 90, 88, 66, 15, 23, 18, 30, 95, 89, 26, 67, 83, 85, 83, 79, 16, 4, 23, 86, 80, 93, 5, 5, 5, 30, 75, 82, 85, 85, 79, 15, 23, 75, 16, 68, 23, 87, 80, 66, 87, 95, 22, 24, 92, 30, 79, 17, 75, 20, 65, 87, 66, 25, 71, 85, 67, 87, 89, 68, 22, 13, 25, 76, 73, 10, 22, 70, 82, 69, 30, 95, 88, 70, 116, 87, 87, 95, 30, 86, 76, 89, 87, 69, 95, 91, 89, 22, 24, 73, 30, 79, 17, 95, 82, 23, 30, 24, 22, 107, 27, 68, 69, 81, 69, 105, 84, 88, 67, 85, 30, 31, 26, 67, 83, 67, 77, 31, 68, 31, 67, 70, 91, 31, 25, 25, 71, 85, 67, 87, 89, 68, 24, 69, 74, 82, 70, 17, 11, 20, 71, 13, 16, 80, 81, 20, 25, 30, 27, 107, 25, 107, 103, 107, 27, 108, 28, 104, 24, 106, 84, 18, 24, 29, 31, 66, 81, 68, 66, 24, 73, 25, 65, 67, 90, 29, 30, 22, 64, 88, 69, 85, 92, 69, 26, 65, 89, 84, 25, 10, 20, 65, 13, 20, 74, 31, 11, 25, 71, 85, 67, 87, 89, 68, 24, 64, 85, 86, 77, 84, 68, 20, 10, 22, 64, 85, 86, 77, 84, 68, 15, 23, 68, 85, 77, 66, 70, 95, 22, 68, 86, 68, 81, 84, 68, 15, 17, 75, 29, 25, 85, 81, 85, 91, 28, 74, 75, 24]);

      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0
      };
      /**
       * Поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */

      this.search = function (_object, kinopoisk_id, data) {
        var _this = this;

        object = _object;
        select_title = object.search || object.movie.title;
        if (this.wait_similars && data && data[0].is_similars) return getPage(data[0].link);
        var url = embed + 'search?query=' + encodeURIComponent(component.cleanTitle(select_title));
        var cookie = check_cookie;
        var headers = Lampa.Platform.is('android') ? {
          'Origin': host,
          'Referer': ref,
          'User-Agent': user_agent,
          'Cookie': cookie
        } : {};
        var prox_enc_page = '';

        if (prox) {
          prox_enc_page += 'param/Origin=' + encodeURIComponent(host) + '/';
          prox_enc_page += 'param/Referer=' + encodeURIComponent(ref) + '/';
          prox_enc_page += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
          prox_enc_stream = prox_enc_page;
          prox_enc_page += 'param/Cookie=' + encodeURIComponent(cookie) + '/';
        }

        network.clear();
        network.timeout(1000 * 10);
        network["native"](component.proxyLink(url, prox, prox_enc_page), function (str) {
          str = (str || '').replace(/\n/g, '');
          var links = object.movie.number_of_seasons ? str.match(/<div class="title"><a href="\/(serial|tv_show)\/([^"]*)"[^>]*>(.*?)<\/a><\/div>/g) : str.match(/<div class="title"><a href="\/film\/([^"]*)"[^>]*>(.*?)<\/a><\/div>/g);
          var search_date = object.search_date || !object.clarification && (object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date) || '0000';
          var search_year = parseInt((search_date + '').slice(0, 4));

          if (links) {
            var is_sure = false;
            var items = links.map(function (l) {
              var div = $(l),
                  link = $('a', div),
                  titl = link.attr('title') || link.text() || '';
              var year;
              var found = titl.match(/^(.*)\((\d{4})\)$/);

              if (found) {
                year = parseInt(found[2]);
                titl = found[1].trim();
              }

              return {
                year: year,
                title: titl,
                link: link.attr('href') || ''
              };
            });
            var cards = items;

            if (cards.length) {
              if (select_title) {
                var tmp = cards.filter(function (c) {
                  return component.containsTitle(c.title, select_title);
                });

                if (tmp.length) {
                  cards = tmp;
                  is_sure = true;
                }
              }

              if (cards.length > 1 && search_year) {
                var _tmp = cards.filter(function (c) {
                  return c.year == search_year;
                });

                if (!_tmp.length) _tmp = cards.filter(function (c) {
                  return c.year && c.year > search_year - 2 && c.year < search_year + 2;
                });
                if (_tmp.length) cards = _tmp;
              }
            }

            if (cards.length == 1 && is_sure) {
              if (search_year && cards[0].year) {
                is_sure = cards[0].year > search_year - 2 && cards[0].year < search_year + 2;
              }

              if (is_sure) {
                is_sure = false;

                if (select_title) {
                  is_sure |= component.equalTitle(cards[0].title, select_title);
                }
              }
            }

            if (cards.length == 1 && is_sure) getPage(cards[0].link);else if (items.length) {
              _this.wait_similars = true;
              items.forEach(function (c) {
                c.is_similars = true;
              });
              component.similars(items);
              component.loading(false);
            } else component.emptyForQuery(select_title);
          } else if (str.indexOf('/recaptcha/api.js') !== -1 || str.indexOf('form action="/check?') !== -1) {
            if (prox) {
              component.empty(Lampa.Lang.translate('online_mod_captcha_proxy'));
            } else {
              component.empty(Lampa.Lang.translate('online_mod_captcha_address') + embed);
            }
          } else component.emptyForQuery(select_title);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        }, false, {
          dataType: 'text',
          withCredentials: logged_in,
          headers: headers
        });
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function filter() {
        filter_items = {
          season: [],
          voice: []
        };

        if (is_playlist) {
          extract.forEach(function (item) {
            if (item.playlist || item.folder) {
              filter_items.season.push(item.title || item.comment || '');
            }
          });
        }

        if (!filter_items.season[choice.season]) choice.season = 0;

        if (is_playlist) {
          extract.forEach(function (item, i) {
            var playlist = item.playlist || item.folder;

            if (playlist) {
              if (i == choice.season) {
                playlist.forEach(function (eps) {
                  if (eps.file) {
                    component.parsePlaylist(eps.file).forEach(function (el) {
                      if (el.voice && filter_items.voice.indexOf(el.voice) == -1) {
                        filter_items.voice.push(el.voice);
                      }
                    });
                  }
                });
              }
            } else if (item.file) {
              component.parsePlaylist(item.file).forEach(function (el) {
                if (el.voice && filter_items.voice.indexOf(el.voice) == -1) {
                  filter_items.voice.push(el.voice);
                }
              });
            }
          });
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;
        component.filter(filter_items, choice);
      }

      function filtred() {
        var filtred = [];

        if (is_playlist) {
          var playlist = extract;
          var season = object.movie.number_of_seasons && 1;

          if (extract[choice.season] && (extract[choice.season].playlist || extract[choice.season].folder)) {
            playlist = extract[choice.season].playlist || extract[choice.season].folder;
            season = parseInt(extract[choice.season].title || extract[choice.season].comment || '');
            if (isNaN(season)) season = 1;
          }

          playlist.forEach(function (eps, index) {
            var items = extractItems(eps.file, filter_items.voice[choice.voice]);

            if (items.length) {
              var title = eps.title || eps.comment || '';
              var alt_voice = title.match(/\d+ серия (.*)$/i);
              var info = items[0].voice || alt_voice && alt_voice[1].trim() || translation;
              if (info == title) info = '';

              if (season) {
                var episode = parseInt(title);
                if (isNaN(episode)) episode = index + 1;
                filtred.push({
                  title: component.formatEpisodeTitle(season, null, title),
                  quality: items[0].quality + 'p' + (quality_type ? ' - ' + quality_type : ''),
                  info: info ? ' / ' + info : '',
                  season: season,
                  episode: episode,
                  file: eps.file,
                  voice: items[0].voice,
                  subtitles: parseSubs(eps.subtitle)
                });
              } else {
                filtred.push({
                  title: title || select_title,
                  quality: items[0].quality + 'p' + (quality_type ? ' - ' + quality_type : ''),
                  info: info ? ' / ' + info : '',
                  file: eps.file,
                  voice: items[0].voice,
                  subtitles: parseSubs(eps.subtitle)
                });
              }
            }
          });
        } else {
          filtred = extract;
        }

        return filtred;
      }

      function parseSubs(str) {
        if (!str) return false;
        var subtitles = component.parsePlaylist(str).map(function (item) {
          var link = item.links[0] || '';
          return {
            label: item.label,
            url: component.processSubs(component.proxyLink(link, prox, prox_enc_stream))
          };
        });
        return subtitles.length ? subtitles : false;
      }
      /**
       * Получить данные о фильме
       * @param {String} str
       */


      function extractData(vod, page) {
        var quality_match = page.match(/<li><b>Качество:<\/b>([^<,]+)<\/li>/i);
        var translation_match = page.match(/<li><b>Перевод:<\/b>([^<,]+)<\/li>/i);
        quality_type = quality_match ? quality_match[1].trim() : '';
        translation = translation_match ? translation_match[1].trim() : '';
        var pl = vod && vod.file && Lampa.Arrays.decodeJson(vod.file, []) || [];

        if (pl.length) {
          extract = pl;
          is_playlist = true;
        } else if (vod && vod.file) {
          var file = vod.file;
          var found = [];
          var subtiles = parseSubs(vod.subtitle);

          if (file) {
            var voices = {};
            component.parsePlaylist(file).forEach(function (item) {
              var prev = voices[item.voice || ''];
              var quality_str = item.label.match(/(\d\d\d+)p/);
              var quality = quality_str ? parseInt(quality_str[1]) : NaN;

              if (!prev || quality > prev.quality) {
                voices[item.voice || ''] = {
                  quality: quality
                };
              }
            });

            for (var voice in voices) {
              var el = voices[voice];
              found.push({
                title: voice || translation || select_title,
                quality: el.quality + 'p' + (quality_type ? ' - ' + quality_type : ''),
                info: '',
                file: file,
                voice: voice,
                subtitles: subtiles
              });
            }
          }

          extract = found;
          is_playlist = false;
        } else component.emptyForQuery(select_title);
      }

      function getUrlWithParams(url, params) {
        url = url || '';
        url = component.fixLink(url, ref);

        if (params) {
          for (var name in params) {
            var value = params[name];
            url = Lampa.Utils.addUrlComponent(url, encodeURIComponent(name) + '=' + encodeURIComponent(value));
          }
        }

        return url;
      }

      function searchMovieUrl(str) {
        var regex = /<script src="([^"]*\/movie\.js\b[^"]*)"/g;
        var found;

        while ((found = regex.exec(str)) !== null) {
          var start = str.lastIndexOf('<!--', found.index);
          var end = str.lastIndexOf('-->', found.index);
          if (end >= start) return found[1];
        }

        return '';
      }

      function getPage(url) {
        url = component.fixLink(url, ref);
        var cookie = (check_cookie ? check_cookie + '; ' : '') + 'player_type=new; file_type=' + file_type;
        var headers = Lampa.Platform.is('android') ? {
          'Origin': host,
          'Referer': url,
          'User-Agent': user_agent,
          'Cookie': cookie
        } : {};
        var prox_enc_page = '';

        if (prox) {
          prox_enc_page += 'param/Origin=' + encodeURIComponent(host) + '/';
          prox_enc_page += 'param/Referer=' + encodeURIComponent(url) + '/';
          prox_enc_stream = prox_enc_page;
          prox_enc_page += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
          prox_enc_page += 'param/Cookie=' + encodeURIComponent(cookie) + '/';
        }

        network.clear();
        network.timeout(1000 * 10);
        network["native"](component.proxyLink(url, prox, prox_enc_page), function (str) {
          str = (str || '').replace(/\n/g, '');
          var MOVIE_ID = str.match(/var MOVIE_ID = (\d+);/);
          var PLAYER_CUID = str.match(/var PLAYER_CUID = "([^"]+)";/);
          var IDENTIFIER = str.match(/var IDENTIFIER = "([^"]+)";/);
          var IMAGES_URL_SCRIPT = str.match(/<script[^>]*>([^<]*var IMAGES_URL = [^<]*)<\/script>/);
          var MOVIE_ID_SCRIPT = str.match(/<script[^>]*>([^<]*var MOVIE_ID = [^<]*)<\/script>/);
          var MOVIE_URL = searchMovieUrl(str);

          if (MOVIE_ID && PLAYER_CUID && IDENTIFIER && MOVIE_ID_SCRIPT && MOVIE_URL) {
            var SCRIPTS = IMAGES_URL_SCRIPT ? IMAGES_URL_SCRIPT.index > MOVIE_ID_SCRIPT.index ? [MOVIE_ID_SCRIPT[1], IMAGES_URL_SCRIPT[1]] : [IMAGES_URL_SCRIPT[1], MOVIE_ID_SCRIPT[1]] : [MOVIE_ID_SCRIPT[1], ''];
            if (SCRIPTS[1] === SCRIPTS[0]) SCRIPTS[1] = '';
            var movie_url = component.fixLink(MOVIE_URL, ref);
            network.clear();
            network.timeout(1000 * 10);
            network["native"](component.proxyLink(movie_url, prox, prox_enc_page), function (script) {
              var params = {};

              try {
                params = (0, eval)(decrypt + [JSON.stringify(component.decodeHtml(SCRIPTS[0])), JSON.stringify(component.decodeHtml(SCRIPTS[1])), JSON.stringify(script || ''), JSON.stringify('new'), JSON.stringify(file_type)].join(',') + ');');
              } catch (e) {}

              var user_url = params.user && params.user.url;

              if (!user_url) {
                component.empty('No user_url');
                return;
              }

              var user_params = params.user && params.user.params || {};
              user_params['_'] = Date.now();
              user_url = getUrlWithParams(user_url || '/user_data', user_params);
              network.clear();
              network.timeout(1000 * 10);
              network["native"](component.proxyLink(user_url, prox, prox_enc_page), function (data) {
                if (data && !data.error) {
                  var _params = {};

                  try {
                    _params = (0, eval)(decrypt + [JSON.stringify(component.decodeHtml(SCRIPTS[0])), JSON.stringify(component.decodeHtml(SCRIPTS[1])), JSON.stringify(script), JSON.stringify('new'), JSON.stringify(file_type), JSON.stringify(data)].join(',') + ');');
                  } catch (e) {}

                  if (data.allow_watch != null && !data.allow_watch) {
                    Lampa.Noty.show(Lampa.Lang.translate('online_mod_blockedlink') + (data.client_country ? ': ' + data.client_country : ''));
                    component.emptyForQuery(select_title);
                    return;
                  } else if (!_params.vod) {
                    Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
                    component.emptyForQuery(select_title);
                    return;
                  }

                  var vod_url = _params.vod.url || '';

                  if (!vod_url) {
                    component.empty('No vod_url');
                    return;
                  }

                  var vod_params = _params.vod && _params.vod.params || {};
                  vod_params['_'] = Date.now();
                  vod_url = getUrlWithParams(vod_url || '/vod/' + MOVIE_ID[1], vod_params);
                  network.clear();
                  network.timeout(1000 * 10);
                  network["native"](component.proxyLink(vod_url, prox, prox_enc_page), function (files) {
                    component.loading(false);
                    var params = {};

                    try {
                      params = (0, eval)(decrypt + [JSON.stringify(component.decodeHtml(SCRIPTS[0])), JSON.stringify(component.decodeHtml(SCRIPTS[1])), JSON.stringify(script), JSON.stringify('new'), JSON.stringify(file_type), JSON.stringify(data), JSON.stringify(files)].join(',') + ');');
                    } catch (e) {}

                    extractData(params.player, str);
                    filter();
                    append(filtred());
                  }, function (a, c) {
                    component.empty(network.errorDecode(a, c));
                  }, false, {
                    dataType: 'text',
                    withCredentials: logged_in,
                    headers: headers
                  });
                } else if (data && data.error) {
                  if (prox) {
                    component.empty(Lampa.Lang.translate('online_mod_captcha_proxy'));
                  } else {
                    component.empty(Lampa.Lang.translate('online_mod_captcha_address') + embed);
                  }
                } else component.emptyForQuery(select_title);
              }, function (a, c) {
                component.empty(network.errorDecode(a, c));
              }, false, {
                dataType: 'text',
                withCredentials: logged_in,
                headers: headers
              });
            }, function (a, c) {
              component.empty(network.errorDecode(a, c));
            }, false, {
              dataType: 'text',
              withCredentials: logged_in,
              headers: headers
            });
          } else component.emptyForQuery(select_title);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        }, false, {
          dataType: 'text',
          withCredentials: logged_in,
          headers: headers
        });
      }
      /**
       * Получить потоки
       * @param {String} str
       * @param {String} voice
       * @returns array
       */


      function extractItems(str, voice) {
        if (!str) return [];

        try {
          var list = component.parsePlaylist(str);

          if (voice) {
            var tmp = list.filter(function (el) {
              return el.voice == voice;
            });

            if (tmp.length) {
              list = tmp;
            } else {
              list = list.filter(function (el) {
                return typeof el.voice === 'undefined';
              });
            }
          }

          var items = list.map(function (item) {
            var quality = item.label.match(/(\d\d\d+)p/);
            var file = item.links[0] || '';
            return {
              label: item.label,
              voice: item.voice,
              quality: quality ? parseInt(quality[1]) : NaN,
              file: component.proxyLink(file, prox, prox_enc_stream)
            };
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }

      function getStream(element) {
        var file = '',
            quality = false;
        var items = extractItems(element.file, element.voice);

        if (items && items.length) {
          file = items[0].file;
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = item.file;
          });
        }

        element.stream = file;
        element.qualitys = quality;
        return {
          file: file,
          quality: quality
        };
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.title, 'kinobase'].join('') : object.movie.original_title + element.quality + 'kinobase');
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            getStream(element);

            if (element.stream) {
              var playlist = [];
              var first = {
                url: component.getDefaultQuality(element.qualitys, element.stream),
                quality: component.renameQualityMap(element.qualitys),
                subtitles: element.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (element.season) {
                items.forEach(function (elem) {
                  getStream(elem);
                  playlist.push({
                    url: component.getDefaultQuality(elem.qualitys, elem.stream),
                    quality: component.renameQualityMap(elem.qualitys),
                    subtitles: elem.subtitles,
                    timeline: elem.timeline,
                    title: elem.title
                  });
                });
              } else {
                playlist.push(first);
              }

              if (playlist.length > 1) first.playlist = playlist;
              Lampa.Player.play(first);
              Lampa.Player.playlist(playlist);

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            } else Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              call(getStream(element));
            }
          });
        });
        component.start(true);
      }
    }

    function collaps(component, _object, prefer_dash) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true; //let prefer_dash  = Lampa.Storage.field('online_mod_prefer_dash') === true

      var lampa_player = Lampa.Storage.field('online_mod_collaps_lampa_player') === true;
      var prox = component.proxy('collaps');
      var base = 'api.atomics.ws';
      var host = 'https://' + base;
      var ref = host + '/';
      var user_agent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
      var embed = (prefer_http ? 'http:' : 'https:') + '//' + base + '/embed/';
      var embed2 = (prefer_http ? 'http:' : 'https:') + '//api.kinogram.best/embed/';
      var prox_enc = '';

      if (prox) {
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
      }

      var prox_enc_stream = prox_enc;

      if (prox) {
        prox_enc += 'ip/';
        prox_enc_stream += 'param/Origin=' + encodeURIComponent(host) + '/';
        prox_enc_stream += 'param/Referer=' + encodeURIComponent(ref) + '/';
      }

      var net_method = lampa_player ? 'silent' : 'native';
      var play_headers = !prox && !lampa_player ? {
        'User-Agent': user_agent,
        'Origin': host,
        'Referer': ref
      } : {};
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0
      };

      function collaps_api_search(api, callback, error) {
        network.clear();
        network.timeout(10000);
        network[net_method](component.proxyLink(embed + api, prox, prox_enc), function (str) {
          if (callback) callback(str || '');
        }, function (a, c) {
          if (a.status == 404 && (!a.responseText || a.responseText.indexOf('видео недоступно') !== -1)) {
            if (callback) callback('');
          } else {
            network.clear();
            network.timeout(10000);
            network[net_method](component.proxyLink(embed2 + api, prox, prox_enc), function (str) {
              if (callback) callback(str || '');
            }, function (a, c) {
              if (a.status == 404 && (!a.responseText || a.responseText.indexOf('видео недоступно') !== -1) || a.status == 0 && a.statusText !== 'timeout') {
                if (callback) callback('');
              } else if (error) error(network.errorDecode(a, c));
            }, false, {
              dataType: 'text',
              headers: play_headers
            });
          }
        }, false, {
          dataType: 'text',
          headers: play_headers
        });
      }
      /**
       * Поиск
       * @param {Object} _object
       */


      this.search = function (_object, kinopoisk_id) {
        object = _object;
        select_title = object.search || object.movie.title;
        var error = component.empty.bind(component);
        var api = (+kinopoisk_id ? 'kp/' : 'imdb/') + kinopoisk_id;
        collaps_api_search(api, function (str) {
          if (str) parse(str);else if (!object.clarification && object.movie.imdb_id && kinopoisk_id != object.movie.imdb_id) {
            collaps_api_search('imdb/' + object.movie.imdb_id, function (str) {
              if (str) parse(str);else component.emptyForQuery(select_title);
            }, error);
          } else component.emptyForQuery(select_title);
        }, error);
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function parse(str) {
        component.loading(false);
        str = (str || '').replace(/\n/g, '');
        var find = str.match(/makePlayer\(({.*?})\);/);
        var json;

        try {
          json = find && (0, eval)('"use strict"; (' + find[1] + ');');
        } catch (e) {}

        if (json) {
          extract = json;

          if (extract.playlist && extract.playlist.seasons) {
            extract.playlist.seasons.sort(function (a, b) {
              return a.season - b.season;
            });
          }

          filter();
          append(filtred());
        } else component.emptyForQuery(select_title);
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: [],
          voice: []
        };

        if (extract.playlist && extract.playlist.seasons) {
          extract.playlist.seasons.forEach(function (season) {
            filter_items.season.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + season.season);
          });
        }

        if (!filter_items.season[choice.season]) choice.season = 0;
        component.filter(filter_items, choice);
      }

      function fixUrl(url) {
        url = url || '';

        url = component.fixLinkProtocol(url, prefer_http, true);
        return url;
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];

        if (extract.playlist) {
          extract.playlist.seasons.forEach(function (season, i) {
            if (i == choice.season) {
              season.episodes.forEach(function (episode) {
                var audio_tracks = episode.audio.names.map(function (name) {
                  return {
                    language: name
                  };
                });
                var audio_infos = episode.audio.names.map(function (name, index) {
                  var order = episode.audio.order && episode.audio.order[index];
                  return {
                    name: name,
                    order: order != null ? order : 1000
                  };
                });
                audio_infos.sort(function (a, b) {
                  return a.order - b.order;
                });
                var audio_names = audio_infos.map(function (a) {
                  return a.name;
                }).filter(function (name) {
                  return name && name !== 'delete';
                });
                var file = fixUrl(prefer_dash && (episode.dasha || episode.dash) || episode.hls || '');
                filtred.push({
                  title: episode.title,
                  quality: '360p ~ ' + (prefer_dash ? '1080p' : '720p'),
                  info: audio_names.length ? ' / ' + component.uniqueNamesShortText(audio_names, 80) : '',
                  season: season.season,
                  episode: parseInt(episode.episode),
                  file: component.proxyLink(file, prox, prox_enc_stream),
                  subtitles: episode.cc ? episode.cc.map(function (c) {
                    var url = fixUrl(c.url || '');
                    return {
                      label: c.name,
                      url: component.processSubs(component.proxyLink(url, prox, prox_enc_stream))
                    };
                  }) : false,
                  audio_tracks: audio_tracks.length ? audio_tracks : false
                });
              });
            }
          });
        } else if (extract.source) {
          var max_quality = 0;
          extract.qualityByWidth && Lampa.Arrays.getKeys(extract.qualityByWidth).forEach(function (resolution) {
            var quality = extract.qualityByWidth[resolution] || 0;
            if (!prefer_dash && quality > 720) quality = 0;
            if (quality > max_quality) max_quality = quality;
          });
          var audio_tracks = extract.source.audio.names.map(function (name) {
            return {
              language: name
            };
          });
          var audio_infos = extract.source.audio.names.map(function (name, index) {
            var order = extract.source.audio.order && extract.source.audio.order[index];
            return {
              name: name,
              order: order != null ? order : 1000
            };
          });
          audio_infos.sort(function (a, b) {
            return a.order - b.order;
          });
          var audio_names = audio_infos.map(function (a) {
            return a.name;
          }).filter(function (name) {
            return name && name !== 'delete';
          });
          var file = fixUrl(prefer_dash && (extract.source.dasha || extract.source.dash) || extract.source.hls || '');
          filtred.push({
            title: extract.title || select_title,
            quality: max_quality ? max_quality + 'p' : '360p ~ ' + (prefer_dash ? '1080p' : '720p'),
            info: audio_names.length ? ' / ' + component.uniqueNamesShortText(audio_names, 80) : '',
            file: component.proxyLink(file, prox, prox_enc_stream),
            subtitles: extract.source.cc ? extract.source.cc.map(function (c) {
              var url = fixUrl(c.url || '');
              return {
                label: c.name,
                url: component.processSubs(component.proxyLink(url, prox, prox_enc_stream))
              };
            }) : false,
            audio_tracks: audio_tracks.length ? audio_tracks : false
          });
        }

        return filtred;
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        items.forEach(function (element) {
          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.title].join('') : object.movie.original_title + 'collaps');
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function (event, options) {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);

            if (element.file) {
              var playlist = [];
              var first = {
                url: component.getDefaultQuality(null, element.file),
                subtitles: element.subtitles,
                translate: {
                  tracks: element.audio_tracks
                },
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title),
                headers: play_headers
              };

              if (element.season) {
                items.forEach(function (elem) {
                  playlist.push({
                    url: component.getDefaultQuality(null, elem.file),
                    subtitles: elem.subtitles,
                    translate: {
                      tracks: elem.audio_tracks
                    },
                    timeline: elem.timeline,
                    title: elem.title,
                    headers: play_headers
                  });
                });
              } else {
                playlist.push(first);
              }

              if (playlist.length > 1) first.playlist = playlist;
              if (options && options.runas) Lampa.Player.runas(options.runas);else if (lampa_player) Lampa.Player.runas('lampa');
              Lampa.Player.play(first);
              Lampa.Player.playlist(playlist);

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            } else Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            file: function file(call) {
              call({
                file: element.file
              });
            }
          });
        });
        component.start(true);
      }
    }

    function cdnmovies(component, _object) {
      var network = new Lampa.Reguest();
      var extract = [];
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prefer_mp4 = Lampa.Storage.field('online_mod_prefer_mp4') === true;
      var prox = component.proxy('cdnmovies');
      var host = Utils.decodeSecret([95, 64, 69, 70, 71, 13, 25, 31, 79, 94, 80, 84, 89, 92, 83, 24, 95, 87, 91, 93, 95, 83]);
      var ref = host + '/';
      var user_agent = 'Mozilla/5.0 (Linux; Android 10; K; client) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.178 Mobile Safari/537.36';
      var headers = Lampa.Platform.is('android') ? {
        'Origin': host,
        'Referer': ref,
        'User-Agent': user_agent
      } : {};
      var prox_enc = '';

      if (prox) {
        prox_enc += 'param/Origin=' + encodeURIComponent(host) + '/';
        prox_enc += 'param/Referer=' + encodeURIComponent(ref) + '/';
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
        prox_enc += 'enc/aXAyNjA2OjQ3MDA6MzAzMTo6NjgxNTo0NmQ5Lw%3D%3D/';
      }

      var prox_stream = '';
      var embed = 'https://cdnmovies-stream.online/';
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };

      function cdn_api_search(api, callback, error) {
        var call_success = function call_success(str) {
          if (callback) callback(str || '');
        };

        var call_error = function call_error(a, c) {
          if ((a.status == 404 || a.status == 403) && (!a.responseText || a.responseText.indexOf('<title>Not Found</title>') !== -1 || a.responseText.indexOf('Не найдено!') !== -1 || a.responseText.indexOf('Контент не найден или недоступен в вашем регионе!') !== -1) || a.status == 0 && a.statusText !== 'timeout') {
            if (callback) callback('');
          } else if (error) error(network.errorDecode(a, c));
        };

        {
          var meta = $('head meta[name="referrer"]');
          var referrer = meta.attr('content') || 'never';
          meta.attr('content', 'origin');

          try {
            network.clear();
            network.timeout(10000);
            network["native"](component.proxyLink(embed + api, prox, prox_enc), call_success, call_error, false, {
              dataType: 'text',
              headers: headers
            });
          } finally {
            meta.attr('content', referrer);
          }
        }
      }
      /**
       * Начать поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */


      this.search = function (_object, kinopoisk_id) {
        object = _object;
        select_title = object.search || object.movie.title;

        var empty = function empty() {
          component.emptyForQuery(select_title);
        };

        var error = component.empty.bind(component);
        var api = (+kinopoisk_id ? 'kinopoisk/' : 'imdb/') + kinopoisk_id + '/iframe';
        cdn_api_search(api, function (str) {
          parse(str || '', function () {
            if (!object.clarification && object.movie.imdb_id && kinopoisk_id != object.movie.imdb_id) {
              cdn_api_search('imdb/' + object.movie.imdb_id + '/iframe', function (str) {
                parse(str || '', empty);
              }, error);
            } else empty();
          });
        }, error);
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: ''
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function parse(str, empty) {
        str = (str || '').replace(/\n/g, '');
        var find = str.match(/Playerjs\(({.*?})\);/);
        var json;

        try {
          json = find && (0, eval)('"use strict"; (function(){ return ' + find[1] + '; })();');
        } catch (e) {}

        var video;
        var player = json && json.file && decode(json.file);

        try {
          video = player && JSON.parse(player);
        } catch (e) {}

        if (video && video.forEach) {
          component.loading(false);
          extract = video;
          filter();
          append(filtred());
        } else empty();
      }

      function decode(data) {
        if (!startsWith(data, '#')) return data;

        var enc = function enc(str) {
          return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
          }));
        };

        var dec = function dec(str) {
          return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
        };

        var trashList = ['wNp2wBTNcPRQvTC0_CpxCsq_8T1u9Q', 'md-Od2G9RWOgSa5HoBSSbWrCyIqQyY', 'kzuOYQqB_QSOL-xzN_Kz3kkgkHhHit', '6-xQWMh7ertLp8t_M9huUDk1M0VrYJ', 'RyTwtf15_GLEsXxnpU4Ljjd0ReY-VH'];
        var x = data.substring(2);
        trashList.forEach(function (trash) {
          x = x.replace('//' + enc(trash), '');
        });

        try {
          x = dec(x);
        } catch (e) {
          x = '';
        }

        return x;
      }
      /**
       * Получить потоки
       * @param {String} str
       * @returns array
       */


      function extractItemsPlaylist(str, url) {
        if (!str) return [];

        try {
          var items = component.parsePlaylist(str).map(function (item) {
            var quality = item.label.match(/(\d\d\d+)p/);
            var link = item.links[0] || '';
            link = link.replace('/sundb.coldcdn.xyz/', '/sundb.nl/');
            link = component.fixLinkProtocol(link, prefer_http, true);
            if (prefer_mp4) link = link.replace(/(\.mp4):hls:manifest\.m3u8$/i, '$1');
            return {
              label: item.label,
              quality: quality ? parseInt(quality[1]) : NaN,
              file: component.proxyLink(link, prox_stream, '')
            };
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function parseStream(element, call, error, itemsExtractor, str, url) {
        var file = '';
        var quality = false;
        var items = itemsExtractor(str, url);

        if (items && items.length) {
          file = items[0].file;
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = item.file;
          });
        }

        if (file) {
          element.stream = file;
          element.qualitys = quality;
          call(element);
        } else error();
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStream(element, call, error) {
        if (element.stream) return call(element);
        var url = element.file || '';

        if (startsWith(url, '[')) {
          parseStream(element, call, error, extractItemsPlaylist, url, '');
          return;
        }

        url = url.replace('/sundb.coldcdn.xyz/', '/sundb.nl/');
        url = component.fixLinkProtocol(url, prefer_http, true);
        if (prefer_mp4) url = url.replace(/(\.mp4):hls:manifest\.m3u8$/i, '$1');

        if (url) {
          element.stream = component.proxyLink(url, prox_stream, '');
          element.qualitys = false;
          call(element);
        } else error();
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: [],
          voice: []
        };
        var season_objs = [];
        extract.forEach(function (s) {
          if (s.folder) {
            s.title = s.title || s.comment || '';
            s.season_num = parseInt(s.title.match(/\d+/));
            season_objs.push(s);
          }
        });
        season_objs.sort(function (a, b) {
          var cmp = a.season_num - b.season_num;
          if (cmp) return cmp;
          if (a.title > b.title) return 1;
          if (a.title < b.title) return -1;
          return 0;
        });
        filter_items.season = season_objs.map(function (s) {
          return s.title;
        });
        if (!filter_items.season[choice.season]) choice.season = 0;
        var s = season_objs[choice.season];

        if (s && s.folder) {
          s.folder.forEach(function (e) {
            if (e.folder) {
              e.folder.forEach(function (v) {
                var voice = v.title || v.comment || '';
                if (filter_items.voice.indexOf(voice) == -1) filter_items.voice.push(voice);
              });
            }
          });
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }

      function parseSubs(str) {
        if (!str) return false;
        var subtitles = component.parsePlaylist(str).map(function (item) {
          var link = item.links[0] || '';
          link = link.replace('/sundb.coldcdn.xyz/', '/sundb.nl/');
          link = component.fixLinkProtocol(link, prefer_http, true);
          return {
            label: item.label,
            url: component.processSubs(component.proxyLink(link, prox_stream, ''))
          };
        });
        return subtitles.length ? subtitles : false;
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];
        extract.forEach(function (data) {
          if (data.folder) {
            var s_title = data.title || data.comment || '';

            if (s_title == filter_items.season[choice.season]) {
              data.folder.forEach(function (e) {
                if (e.folder) {
                  var e_title = e.title || e.comment || '';
                  var found = false;
                  var found_broken = false;
                  e.folder.forEach(function (v) {
                    var voice = v.title || v.comment || '';

                    if (!found && voice == filter_items.voice[choice.voice] && v.file) {
                      if (v.file.indexOf('//sarnage.cc/') !== -1) {
                        found_broken = true;
                      } else {
                        found = true;
                        var episode_num = parseInt(e_title.match(/\d+/));
                        var season_num = parseInt(s_title.match(/\d+/));
                        filtred.push({
                          title: component.formatEpisodeTitle(season_num, episode_num),
                          quality: '360p ~ 1080p',
                          info: ' / ' + Lampa.Utils.shortText(voice, 50),
                          season: season_num,
                          episode: episode_num,
                          file: v.file,
                          subtitles: parseSubs(v.subtitle)
                        });
                      }
                    }
                  });

                  if (!found && found_broken) {
                    e.folder.forEach(function (v) {
                      var voice = v.title || v.comment || '';

                      if (!found && voice == filter_items.voice[choice.voice] && v.file) {
                        found = true;
                        var episode_num = parseInt(e_title.match(/\d+/));
                        var season_num = parseInt(s_title.match(/\d+/));
                        filtred.push({
                          title: component.formatEpisodeTitle(season_num, episode_num),
                          quality: '360p ~ 1080p',
                          info: ' / ' + Lampa.Utils.shortText(voice, 50),
                          season: season_num,
                          episode: episode_num,
                          file: v.file,
                          subtitles: parseSubs(v.subtitle)
                        });
                      }
                    });
                  }
                }
              });
            }
          } else {
            filtred.push({
              title: data.title || data.comment || select_title,
              quality: '360p ~ 1080p',
              info: '',
              file: data.file,
              subtitles: parseSubs(data.subtitle)
            });
          }
        });
        return filtred;
      }
      /**
       * Добавить видео
       * @param {Array} items
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (element.loading) return;
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            element.loading = true;
            getStream(element, function (element) {
              element.loading = false;
              var first = {
                url: component.getDefaultQuality(element.qualitys, element.stream),
                quality: component.renameQualityMap(element.qualitys),
                subtitles: element.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };
              Lampa.Player.play(first);

              if (element.season && Lampa.Platform.version) {
                var playlist = [];
                items.forEach(function (elem) {
                  if (elem == element) {
                    playlist.push(first);
                  } else {
                    var cell = {
                      url: function url(call) {
                        getStream(elem, function (elem) {
                          cell.url = component.getDefaultQuality(elem.qualitys, elem.stream);
                          cell.quality = component.renameQualityMap(elem.qualitys);
                          cell.subtitles = elem.subtitles;
                          call();
                        }, function () {
                          cell.url = '';
                          call();
                        });
                      },
                      timeline: elem.timeline,
                      title: elem.title
                    };
                    playlist.push(cell);
                  }
                });
                Lampa.Player.playlist(playlist);
              } else {
                Lampa.Player.playlist([first]);
              }

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            }, function () {
              element.loading = false;
              Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
            });
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              getStream(element, function (element) {
                call({
                  file: element.stream,
                  quality: element.qualitys
                });
              }, function () {
                Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
              });
            }
          });
        });
        component.start(true);
      }
    }

    function filmix(component, _object, _debug) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var debug = _debug;
      var prox = component.proxy('filmix');
      var prox2 = component.proxy('filmix_site');
      var prox3 = component.proxy('filmix_abuse');
      var headers = Lampa.Platform.is('android') ? {
        'User-Agent': Utils.filmixUserAgent()
      } : {};
      var prox_enc = '';

      if (prox) {
        prox_enc += 'param/User-Agent=' + encodeURIComponent(Utils.filmixUserAgent()) + '/';
      }

      var embed = 'http://filmixapp.cyou/api/v2/';
      var site = Utils.filmixHost() + '/';
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };
      var secret = '';
      var secret_url = '';

      function decodeSecretToken(callback) {
        {
          if (callback) callback();
          return;
        }
      }

      if (!window.mod_filmix) {
        window.mod_filmix = {
          max_qualitie: 480,
          is_max_qualitie: false
        };
      }

      var token = Lampa.Storage.get('filmix_token', '') + '';
      var dev_token = Utils.filmixToken(Utils.randomHex(16), token || 'aaaabbbbccccddddeeeeffffaaaabbbb');
      var abuse_token = prox3 ? Utils.filmixToken(Utils.randomHex(16), 'aaaabbbbccccddddeeeeffffaaaabbbb') : '';
      /**
       * Начать поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */

      this.search = function (_object, kinopoisk_id, data) {
        var _this = this;

        object = _object;
        select_title = object.search || object.movie.title;
        if (this.wait_similars && data && data[0].is_similars) return find(data[0].id);
        var search_date = object.search_date || !object.clarification && (object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date) || '0000';
        var search_year = parseInt((search_date + '').slice(0, 4));
        var orig_titles = [];

        if (object.movie.alternative_titles && object.movie.alternative_titles.results) {
          orig_titles = object.movie.alternative_titles.results.map(function (t) {
            return t.title;
          });
        }

        if (object.movie.original_title) orig_titles.push(object.movie.original_title);
        if (object.movie.original_name) orig_titles.push(object.movie.original_name);
        var clean_title = component.cleanTitle(select_title).replace(/\b(\d\d\d\d+)\b/g, '+$1');
        var object_date = object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date || '0000';
        var object_year = parseInt((object_date + '').slice(0, 4));

        if (object_year) {
          clean_title = clean_title.replace(new RegExp(' \\+(' + object_year + ')$'), ' $1');
        }

        var display = function display(json) {
          if (json && json.length && json.forEach) {
            var is_sure = false;
            json.forEach(function (c) {
              if (!c.orig_title) c.orig_title = c.original_title || c.original_name;
              if (!c.year && c.alt_name) c.year = parseInt(c.alt_name.split('-').pop());
            });
            var cards = json;

            if (cards.length) {
              if (orig_titles.length) {
                var tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.orig_title, c.title], orig_titles);
                });

                if (tmp.length) {
                  cards = tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.title, c.orig_title], [select_title]);
                });

                if (_tmp.length) {
                  cards = _tmp;
                  is_sure = true;
                }
              }

              if (cards.length > 1 && search_year) {
                var _tmp2 = cards.filter(function (c) {
                  return c.year == search_year;
                });

                if (!_tmp2.length) _tmp2 = cards.filter(function (c) {
                  return c.year && c.year > search_year - 2 && c.year < search_year + 2;
                });
                if (_tmp2.length) cards = _tmp2;
              }
            }

            if (cards.length == 1 && is_sure) {
              if (search_year && cards[0].year) {
                is_sure = cards[0].year > search_year - 2 && cards[0].year < search_year + 2;
              }

              if (is_sure) {
                is_sure = false;

                if (orig_titles.length) {
                  is_sure |= component.equalAnyTitle([cards[0].orig_title, cards[0].title], orig_titles);
                }

                if (select_title) {
                  is_sure |= component.equalAnyTitle([cards[0].title, cards[0].orig_title], [select_title]);
                }
              }
            }

            if (cards.length == 1 && is_sure) find(cards[0].id);else if (json.length) {
              _this.wait_similars = true;
              json.forEach(function (c) {
                c.is_similars = true;
                c.seasons_count = c.last_episode && c.last_episode.season;
                c.episodes_count = c.last_episode && c.last_episode.episode;
              });
              component.similars(json);
              component.loading(false);
            } else component.emptyForQuery(select_title);
          } else component.emptyForQuery(select_title);
        };

        var siteSearch = function siteSearch() {
          var url = site + 'api/v2/suggestions?search_word=' + encodeURIComponent(clean_title);
          network.clear();
          network.timeout(10000);
          network["native"](component.proxyLink(url, prox2), function (json) {
            display(json && json.posts || []);
          }, function (a, c) {
            component.empty(network.errorDecode(a, c));
          }, false, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
        };

        var apiSearch = function apiSearch(abuse) {
          var url = embed + 'search' + (abuse ? abuse_token : dev_token);
          url = Lampa.Utils.addUrlComponent(url, 'story=' + encodeURIComponent(clean_title));
          url = abuse ? component.proxyLink(url, prox3, '', '') : component.proxyLink(url, prox, prox_enc, 'enc2');
          network.clear();
          network.timeout(10000);
          network["native"](url, function (json) {
            if (json && json.length && json.forEach) display(json);else siteSearch();
          }, function (a, c) {
            if (!abuse && abuse_token) apiSearch(true);else siteSearch();
          }, false, {
            headers: headers
          });
        };

        decodeSecretToken(function () {
          return apiSearch();
        });
      };

      function find(filmix_id, abuse, abuse_error, low_quality) {
        if (!debug && !window.mod_filmix.is_max_qualitie) {
          window.mod_filmix.is_max_qualitie = true;
          token = Lampa.Storage.get('filmix_token', '') + '';
          dev_token = Utils.filmixToken(Utils.randomHex(16), token || 'aaaabbbbccccddddeeeeffffaaaabbbb');

          if (token) {
            var url = embed + 'user_profile' + dev_token;
            network.clear();
            network.timeout(10000);
            network["native"](component.proxyLink(url, prox, prox_enc, 'enc2'), function (found) {
              if (found && found.user_data) {
                window.mod_filmix.max_qualitie = 720;
                if (found.user_data.is_pro) window.mod_filmix.max_qualitie = 1080;
                if (found.user_data.is_pro_plus) window.mod_filmix.max_qualitie = 2160;
              }

              end_search();
            }, function (a, c) {
              end_search();
            }, false, {
              headers: headers
            });
          } else end_search();
        } else end_search();

        function end_search() {
          var url = embed + 'post/' + filmix_id + (abuse ? abuse_token : dev_token);
          url = abuse ? component.proxyLink(url, prox3, '', '') : component.proxyLink(url, prox, prox_enc, 'enc2');

          var not_found = function not_found(str) {
            if (abuse && abuse_error) success(abuse_error);else if (!abuse && abuse_token) find(filmix_id, true, null, true);else if (str) component.empty(str);else component.emptyForQuery(select_title);
          };

          network.clear();
          network.timeout(10000);
          network["native"](url, function (found) {
            var pl_links = found && found.player_links || {};

            if (pl_links.movie && Object.keys(pl_links.movie).length > 0 || pl_links.playlist && Object.keys(pl_links.playlist).length > 0) {
              if (!abuse && abuse_token && checkAbuse(found)) find(filmix_id, true, found);else success(found, low_quality);
            } else not_found();
          }, function (a, c) {
            not_found(network.errorDecode(a, c));
          }, false, {
            headers: headers
          });
        }
      }

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: ''
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };
      /**
       * Успешно, есть данные
       * @param {Object} json
       */


      function success(json, low_quality) {
        component.loading(false);
        extractData(json, low_quality);
        filter();
        append(filtred());
      }

      function checkAbuse(data) {
        var pl_links = data.player_links || {};

        if (pl_links.movie && Object.keys(pl_links.movie).length > 0) {

          for (var ID in pl_links.movie) {
            var file = pl_links.movie[ID];
            var stream_url = file.link || '';

            if (file.translation === 'Заблокировано правообладателем!' && stream_url.indexOf('/abuse_') !== -1) {
              var found = stream_url.match(/https?:\/\/[^\/]+(\/s\/[^\/]*\/)/);

              if (found) {
                {
                  secret = '$1' + found[1];
                  secret_url = '';
                }

                return true;
              }
            }
          }
        }

        return false;
      }
      /**
       * Получить информацию о фильме
       * @param {Arrays} data
       */


      function extractData(data, low_quality) {
        extract = {};
        var filmix_max_qualitie = low_quality ? 480 : debug ? 2160 : window.mod_filmix.max_qualitie;
        var pl_links = data.player_links || {};

        if (pl_links.playlist && Object.keys(pl_links.playlist).length > 0) {
          var seasons = [];
          var seas_num = 0;

          for (var season_id in pl_links.playlist) {
            var season = pl_links.playlist[season_id];
            var voices = [];
            ++seas_num;

            for (var voice_id in season) {
              var episodes = season[voice_id];
              var items = [];
              var epis_num = 0;

              for (var episode_id in episodes) {
                var file = episodes[episode_id];
                ++epis_num;
                var quality_eps = file.qualities.filter(function (qualitys) {
                  return !isNaN(qualitys) && qualitys <= filmix_max_qualitie;
                });
                quality_eps.sort(function (a, b) {
                  return b - a;
                });
                var max_quality = quality_eps[0];

                if (max_quality) {
                  var stream_url = file.link || '';
                  stream_url = component.fixLinkProtocol(stream_url, prefer_http, true);

                  if (secret) {
                    stream_url = stream_url.replace(/(https?:\/\/[^\/]+)\/s\/[^\/]*\//, secret);
                    if (secret_url) stream_url = stream_url.replace(/^https?:\/\//, secret_url);
                  }

                  var seas_id = parseInt(season_id);
                  var epis_id = parseInt(episode_id);

                  if (isNaN(seas_id) || isNaN(epis_id)) {
                    var s_e = stream_url.substring(stream_url.lastIndexOf('/'));
                    var str_s_e = s_e.match(/s(\d+)e(\d+)_%s\.mp4/i);

                    if (str_s_e) {
                      seas_id = parseInt(str_s_e[1]);
                      epis_id = parseInt(str_s_e[2]);
                    }
                  }

                  if (isNaN(seas_id)) seas_id = seas_num;
                  if (isNaN(epis_id)) epis_id = epis_num;
                  items.push({
                    season: seas_id,
                    episode: epis_id,
                    file: stream_url,
                    quality: max_quality,
                    qualities: quality_eps
                  });
                }
              }

              if (items.length) {
                voices.push({
                  id: voice_id,
                  items: items
                });
              }
            }

            if (voices.length) {
              seasons.push({
                id: season_id,
                title: Lampa.Lang.translate('torrent_serial_season') + ' ' + (isNaN(season_id) ? seas_num : season_id),
                voices: voices
              });
            }
          }

          extract.seasons = seasons;
        } else if (pl_links.movie && Object.keys(pl_links.movie).length > 0) {
          var movies = [];

          for (var ID in pl_links.movie) {
            var _file = pl_links.movie[ID];
            var _max_quality = filmix_max_qualitie;

            var _stream_url = _file.link || '';

            _stream_url = component.fixLinkProtocol(_stream_url, prefer_http, true);

            if (secret) {
              _stream_url = _stream_url.replace(/(https?:\/\/[^\/]+)\/s\/[^\/]*\//, secret);
              if (secret_url) _stream_url = _stream_url.replace(/^https?:\/\//, secret_url);
            }

            var _quality_eps = _stream_url.match(/\[([\d,]*)\]\.mp4/i);

            if (_quality_eps) {
              _quality_eps = _quality_eps[1].split(',').map(function (quality) {
                return parseInt(quality);
              }).filter(function (quality) {
                return !isNaN(quality) && quality <= filmix_max_qualitie;
              });

              _quality_eps.sort(function (a, b) {
                return b - a;
              });

              _max_quality = _quality_eps[0];
            }

            if (_max_quality) {
              var file_url = _stream_url.replace(/\[[\d,]*\](\.mp4)/i, '%s$1');

              movies.push({
                translation: _file.translation,
                file: file_url,
                quality: _max_quality,
                qualities: _quality_eps
              });
            }
          }

          extract.movies = movies;
        }
      }
      /**
       * Найти поток
       * @param {Object} element
       * @returns string
       */


      function getFile(element) {
        var media = element.media || {};
        var file = media.file;
        var quality = false;

        if (file) {
          quality = {};

          if (media.qualities) {
            media.qualities.forEach(function (q) {
              quality[q + 'p'] = file.replace(/%s(\.mp4)/i, q + '$1');
            });
            file = file.replace(/%s(\.mp4)/i, media.qualities[0] + '$1');
          }
        }

        return {
          file: file,
          quality: quality
        };
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: extract.seasons ? extract.seasons.map(function (s) {
            return s.title;
          }) : [],
          voice: []
        };
        if (!filter_items.season[choice.season]) choice.season = 0;

        if (extract.seasons && extract.seasons[choice.season]) {
          filter_items.voice = extract.seasons[choice.season].voices.map(function (v) {
            return v.id;
          });
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];

        if (extract.seasons) {
          var season = extract.seasons[choice.season] || {};
          var voices = season.voices || [];
          var voice = voices[choice.voice] || {};
          var voice_name = Lampa.Utils.shortText(filter_items.voice[choice.voice] || '', 50);
          var items = voice.items || [];
          items.forEach(function (media) {
            filtred.push({
              title: component.formatEpisodeTitle(media.season, media.episode),
              quality: media.quality + 'p',
              info: voice_name ? ' / ' + voice_name : '',
              season: media.season,
              episode: media.episode,
              media: media
            });
          });
        } else if (extract.movies) {
          extract.movies.forEach(function (media) {
            filtred.push({
              title: media.translation || select_title,
              quality: media.quality + 'p',
              info: '',
              media: media
            });
          });
        }

        return filtred;
      }
      /**
       * Добавить видео
       * @param {Array} items
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            var extra = getFile(element);

            if (extra.file) {
              var playlist = [];
              var first = {
                url: component.getDefaultQuality(extra.quality, extra.file),
                quality: component.renameQualityMap(extra.quality),
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (element.season) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: component.getDefaultQuality(ex.quality, ex.file),
                    quality: component.renameQualityMap(ex.quality),
                    timeline: elem.timeline,
                    title: elem.title
                  });
                });
              } else {
                playlist.push(first);
              }

              if (playlist.length > 1) first.playlist = playlist;
              Lampa.Player.play(first);
              Lampa.Player.playlist(playlist);

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            } else Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              call(getFile(element));
            }
          });
        });
        component.start(true);
      }
    }

    function zetflix(component, _object) {
      var network = new Lampa.Reguest();
      var extract = [];
      var object = _object;
      var select_title = '';
      var select_id = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prox = component.proxy('zetflix');
      var embed = (prefer_http ? 'http:' : 'https:') + '//hidxlglk.deploy.cx/lite/zetflix';
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };
      /**
       * Начать поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */

      this.search = function (_object, kinopoisk_id) {
        object = _object;
        select_id = kinopoisk_id;
        select_title = object.search || object.movie.title;

        if (isNaN(select_id)) {
          component.emptyForQuery(select_title);
          return;
        }

        extract = [];
        getEpisodes();
      };

      function getEpisodes() {
        var s = object.movie.number_of_seasons ? choice.season + 1 : 0;

        if (extract[s]) {
          component.loading(false);
          filter();
          append(filtred());
          return;
        }

        var url = Lampa.Utils.addUrlComponent(embed, 'kinopoisk_id=' + select_id);
        if (s) url = Lampa.Utils.addUrlComponent(url, 's=' + s);
        url = Lampa.Utils.addUrlComponent(url, 'orightml=true');

        var call_success = function call_success(str) {
          parse(str);
        };

        var call_error = function call_error(a, c) {
          component.empty(network.errorDecode(a, c));
        };

        {
          var meta = $('head meta[name="referrer"]');
          var referrer = meta.attr('content') || 'never';
          meta.attr('content', 'origin');

          try {
            network.clear();
            network.timeout(10000);
            network.silent(url, call_success, call_error, false, {
              dataType: 'text'
            });
          } finally {
            meta.attr('content', referrer);
          }
        }
      }

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: ''
        };
        component.loading(true);
        getEpisodes();
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        component.loading(true);
        getEpisodes();
        component.saveChoice(choice);
        setTimeout(component.closeFilter, 10);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };
      /**
       * Получить потоки
       * @param {String} str
       * @returns array
       */


      function extractItems(str) {
        if (!str) return [];

        try {
          var items = component.parsePlaylist(str).map(function (item) {
            var quality = item.label.match(/(\d\d\d+)p/);
            var link = item.links[0] || '';
            link = component.fixLinkProtocol(link, prefer_http, true);
            return {
              label: item.label,
              quality: quality ? parseInt(quality[1]) : NaN,
              file: component.proxyLink(link, prox)
            };
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }

      function parse(str) {
        component.loading(false);
        str = (str || '').replace(/\n/g, '');
        var find = str.match(/Playerjs\(({.*?})\);/);
        var json;

        try {
          json = find && (0, eval)('"use strict"; (function(){ var sign = function(){}; return ' + find[1] + '; })();');
        } catch (e) {}

        if (json && json.file) {
          var s = object.movie.number_of_seasons ? choice.season + 1 : 0;
          extract[s] = typeof json.file === 'string' ? [json] : json.file;
          extract[s].forEach(function (data) {
            if (data.folder) {
              data.folder.forEach(function (e) {
                e.media = {
                  items: extractItems(e.file)
                };
              });
            } else {
              data.media = {
                items: extractItems(data.file)
              };
            }
          });
          filter();
          append(filtred());
        } else component.emptyForQuery(select_title);
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: [],
          voice: []
        };

        if (object.movie.number_of_seasons) {
          for (var snum = 1; snum <= object.movie.number_of_seasons; snum++) {
            filter_items.season.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + snum);
          }
        }

        if (!filter_items.season[choice.season]) choice.season = 0;
        var extract_s = extract[object.movie.number_of_seasons ? choice.season + 1 : 0] || [];
        extract_s.forEach(function (v) {
          if (v.folder) {
            var voice = v.title || v.comment || '';
            if (filter_items.voice.indexOf(voice) == -1) filter_items.voice.push(voice);
          }
        });
        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];
        var extract_s = extract[object.movie.number_of_seasons ? choice.season + 1 : 0] || [];
        extract_s.forEach(function (data) {
          if (data.folder) {
            var voice = data.title || data.comment || '';

            if (voice == filter_items.voice[choice.voice]) {
              data.folder.forEach(function (e) {
                if (e.file) {
                  var e_title = e.title || e.comment || '';
                  var max_quality = e.media.items[0] || {};
                  var episode_num = parseInt(e_title.match(/\d+/));
                  var season_num = choice.season + 1;
                  filtred.push({
                    title: component.formatEpisodeTitle(season_num, episode_num),
                    quality: max_quality.label || '360p ~ 1080p',
                    info: ' / ' + Lampa.Utils.shortText(voice, 50),
                    season: season_num,
                    episode: episode_num,
                    media: e.media
                  });
                }
              });
            }

            filtred.sort(function (a, b) {
              return a.episode - b.episode;
            });
          } else if (data.file) {
            var max_quality = data.media.items[0] || {};
            filtred.push({
              title: data.title || data.comment || select_title,
              quality: max_quality.label || '360p ~ 1080p',
              info: '',
              media: data.media
            });
          }
        });
        return filtred;
      }
      /**
       * Найти поток
       * @param {Object} element
       * @returns string
       */


      function getFile(element) {
        var file = '';
        var quality = false;
        var items = element.media.items;

        if (items && items.length) {
          file = items[0].file;
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = item.file;
          });
        }

        return {
          file: file,
          quality: quality
        };
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            var extra = getFile(element);

            if (extra.file) {
              var playlist = [];
              var first = {
                url: component.getDefaultQuality(extra.quality, extra.file),
                quality: component.renameQualityMap(extra.quality),
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (element.season) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: component.getDefaultQuality(ex.quality, ex.file),
                    quality: component.renameQualityMap(ex.quality),
                    timeline: elem.timeline,
                    title: elem.title
                  });
                });
              } else {
                playlist.push(first);
              }

              if (playlist.length > 1) first.playlist = playlist;
              Lampa.Player.play(first);
              Lampa.Player.playlist(playlist);

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            } else Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              call(getFile(element));
            }
          });
        });
        component.start(true);
      }
    }

    function fancdn(component, _object) {
      var network = new Lampa.Reguest();
      var extract = [];
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prox = component.proxy('fancdn');
      var host = Utils.fanserialsHost();
      var ref = host + '/';
      var user_agent = Utils.baseUserAgent();
      var headers = Lampa.Platform.is('android') ? {
        'Origin': host,
        'Referer': ref,
        'User-Agent': user_agent
      } : {};
      var prox_enc = '';

      if (prox) {
        prox_enc += 'param/Origin=' + encodeURIComponent(host) + '/';
        prox_enc += 'param/Referer=' + encodeURIComponent(ref) + '/';
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
      }

      var host2 = Utils.fancdnHost();
      var ref2 = host2 + '/';
      var cookie2 = Utils.randomCookie();
      var headers2 = Lampa.Platform.is('android') ? {
        'Origin': host2,
        'Referer': ref2,
        'User-Agent': user_agent,
        'Cookie': cookie2
      } : {};
      var prox_enc2 = '';

      if (prox) {
        prox_enc2 += 'param/Origin=' + encodeURIComponent(host2) + '/';
        prox_enc2 += 'param/Referer=' + encodeURIComponent(ref2) + '/';
        prox_enc2 += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
        prox_enc2 += 'param/Cookie=' + encodeURIComponent(cookie2) + '/';
      }

      var cookie = Lampa.Storage.get('online_mod_fancdn_cookie', '') + '';
      var authorization_required = !cookie;
      if (cookie.indexOf('PHPSESSID=') == -1) cookie = 'PHPSESSID=' + Utils.randomHex(32) + (cookie ? '; ' + cookie : '');

      if (cookie) {
        if (Lampa.Platform.is('android')) {
          headers.Cookie = cookie;
        }

        if (prox) {
          prox_enc += 'param/Cookie=' + encodeURIComponent(cookie) + '/';
        }
      }

      var embed = ref;
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };
      /**
       * Начать поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */

      this.search = function (_object, kinopoisk_id, data) {
        var _this = this;

        object = _object;
        select_title = object.search || object.movie.title;
        if (this.wait_similars && data && data[0].is_similars) return getPage(data[0].link);
        var search_date = object.search_date || !object.clarification && (object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date) || '0000';
        var search_year = parseInt((search_date + '').slice(0, 4));
        var orig_titles = [];

        if (object.movie.alternative_titles && object.movie.alternative_titles.results) {
          orig_titles = object.movie.alternative_titles.results.map(function (t) {
            return t.title;
          });
        }

        if (object.movie.original_title) orig_titles.push(object.movie.original_title);
        if (object.movie.original_name) orig_titles.push(object.movie.original_name);

        var display = function display(links) {
          if (links && links.length && links.forEach) {
            var is_sure = false;
            var items = links.map(function (l) {
              var li = $(l + '</div>');
              var link = $('a', li);
              var orig_div = $('div.name-origin-search', li);
              var titl = link.text().trim() || '';
              var orig_title = orig_div.text().trim() || '';
              var year;
              var found = orig_title.match(/^(.*)\((\d{4}\s*)\)$/);

              if (found) {
                year = parseInt(found[2]);
                orig_title = found[1].trim();
              }

              return {
                year: year,
                title: titl,
                orig_title: orig_title,
                link: link.attr('href') || ''
              };
            });
            var cards = items;

            if (cards.length) {
              if (orig_titles.length) {
                var tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.orig_title, c.title], orig_titles);
                });

                if (tmp.length) {
                  cards = tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.title, c.orig_title], [select_title]);
                });

                if (_tmp.length) {
                  cards = _tmp;
                  is_sure = true;
                }
              }

              if (cards.length > 1 && search_year) {
                var _tmp2 = cards.filter(function (c) {
                  return c.year == search_year;
                });

                if (!_tmp2.length) _tmp2 = cards.filter(function (c) {
                  return c.year && c.year > search_year - 2 && c.year < search_year + 2;
                });
                if (_tmp2.length) cards = _tmp2;
              }
            }

            if (cards.length == 1 && is_sure) {
              if (search_year && cards[0].year) {
                is_sure = cards[0].year > search_year - 2 && cards[0].year < search_year + 2;
              }

              if (is_sure) {
                is_sure = false;

                if (orig_titles.length) {
                  is_sure |= component.equalAnyTitle([cards[0].orig_title, cards[0].title], orig_titles);
                }

                if (select_title) {
                  is_sure |= component.equalAnyTitle([cards[0].title, cards[0].orig_title], [select_title]);
                }
              }
            }

            if (cards.length == 1 && is_sure) getPage(cards[0].link);else if (items.length) {
              _this.wait_similars = true;
              items.forEach(function (c) {
                c.is_similars = true;
              });
              component.similars(items);
              component.loading(false);
            } else component.emptyForQuery(select_title);
          } else if (authorization_required) component.empty(Lampa.Lang.translate('online_mod_authorization_required') + ' FanSerials');else component.emptyForQuery(select_title);
        };

        var url = embed + 'index.php?do=search';
        var postdata = 'do=search&subaction=search&search_start=0&full_search=1&result_from=1&story=' + encodeURIComponent(select_title) + '&titleonly=3&searchuser=&replyless=0&replylimit=0&searchdate=0&beforeafter=after&sortby=title&resorder=asc&showposts=0&catlist%5B%5D=10';
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(url, prox, prox_enc), function (str) {
          str = (str || '').replace(/\n/g, '');
          var links = str.match(/<div class="item-search-header">\s*<h2>\s*<a [^>]*>[^<]*<\/a>\s*<\/h2>\s*<div class="name-origin-search">[^<]*<\/div>/g);
          display(links);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        }, postdata, {
          dataType: 'text',
          headers: headers
        });
      };

      function getPage(url) {
        url = component.fixLink(url, ref);
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(url, prox, prox_enc), function (str) {
          str = (str || '').replace(/\n/g, '');
          var player = str.match(/<iframe +id="iframe-player" +src=" *(https?:\/\/fancdn.net\/[^"]*)"/);

          if (player) {
            if (!(Lampa.Storage.get('online_mod_fancdn_token', '') + '')) {
              var pos = player[1].indexOf('?');

              if (pos !== -1) {
                var token = player[1].substring(pos + 1).split('&').filter(function (s) {
                  return startsWith(s, 'key=');
                }).join('&');
                Lampa.Storage.set('online_mod_fancdn_token', token);
              }
            }

            network.clear();
            network.timeout(10000);
            network["native"](component.proxyLink(player[1], prox, prox_enc2), function (str) {
              parse(str);
            }, function (a, c) {
              component.empty(network.errorDecode(a, c));
            }, false, {
              dataType: 'text',
              headers: headers2
            });
          } else if (authorization_required) component.empty(Lampa.Lang.translate('online_mod_authorization_required') + ' FanSerials');else component.emptyForQuery(select_title);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        }, false, {
          dataType: 'text',
          headers: headers
        });
      }

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: ''
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };
      /**
       * Получить потоки
       * @param {String} str
       * @returns array
       */


      function extractItems(str, url) {
        if (!str) return [];

        try {
          var items = component.parseM3U(str).map(function (item) {
            var link = item.link;
            var quality = item.height;
            var alt_quality = link.match(/\b(\d\d\d+)\./);

            if (alt_quality) {
              var alt_height = parseInt(alt_quality[1]);
              if (alt_height > quality && alt_height <= 4320) quality = alt_height;
            }

            return {
              label: quality ? quality + 'p' : '360p ~ 1080p',
              quality: quality,
              file: component.proxyStream(component.fixLink(link, url), 'fancdn')
            };
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }
      /**
       * Получить потоки
       * @param {String} str
       * @returns array
       */


      function extractItemsPlaylist(str, url) {
        if (!str) return [];

        try {
          var items = component.parsePlaylist(str).map(function (item) {
            var quality = item.label.match(/(\d\d\d+)p/);
            var link = item.links[0] || '';
            link = component.fixLinkProtocol(link, prefer_http, true);
            return {
              label: item.label,
              quality: quality ? parseInt(quality[1]) : NaN,
              file: component.proxyStream(link, 'fancdn')
            };
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function parseStream(element, call, error, itemsExtractor, str, url) {
        var file = '';
        var quality = false;
        var items = itemsExtractor(str, url);

        if (items && items.length) {
          file = items[0].file;
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = item.file;
          });
        }

        if (file) {
          element.stream = file;
          element.qualitys = quality;
          element.subtitles = parseSubs(element.media.subtitles, url);
          call(element);
        } else error();
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStreamM3U(element, call, error, file) {
        file = file.replace(/\.mp4:hls:manifest/, '');
        var hls_file = file.replace(/\/\d\d\d+([^\/]*\.m3u8)$/, '/hls$1');
        network.clear();
        network.timeout(5000);
        network["native"](component.proxyStream(hls_file, 'fancdn'), function (str) {
          parseStream(element, call, error, extractItems, str, hls_file);
        }, function (a, c) {
          if (file != hls_file) {
            network.clear();
            network.timeout(5000);
            network["native"](component.proxyStream(file, 'fancdn'), function (str) {
              parseStream(element, call, error, extractItems, str, file);
            }, function (a, c) {
              error();
            }, false, {
              dataType: 'text'
            });
          } else error();
        }, false, {
          dataType: 'text'
        });
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStream(element, call, error) {
        if (element.stream) return call(element);
        var url = element.media.file || '';

        if (startsWith(url, '[')) {
          parseStream(element, call, error, extractItemsPlaylist, url, '');
          return;
        }

        url = component.fixLinkProtocol(url, prefer_http, true);

        if (endsWith(url, '.m3u8')) {
          getStreamM3U(element, call, error, url);
          return;
        }

        if (url) {
          element.stream = component.proxyStream(url, 'fancdn');
          element.qualitys = false;
          element.subtitles = parseSubs(element.media.subtitles, url);
          call(element);
        } else error();
      }

      function parseSubs(str, url) {
        if (!str) return false;
        var subtitles = component.parsePlaylist(str).map(function (item) {
          var link = item.links[0] || '';
          link = component.fixLinkProtocol(link, prefer_http, true);
          return {
            label: item.label,
            url: component.proxyStreamSubs(component.fixLink(link, url), 'fancdn')
          };
        });
        return subtitles.length ? subtitles : false;
      }

      function parse(str) {
        component.loading(false);
        str = (str || '').replace(/\n/g, '');
        var find = str.match(/var playlist = (\[{.*?}\]);/);
        var json;

        try {
          json = find && (0, eval)('"use strict"; (function(){ return ' + find[1] + '; })();');
        } catch (e) {}

        if (json && json.forEach) {
          extract = json;
          filter();
          append(filtred());
        } else component.emptyForQuery(select_title);
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: [],
          season_num: [],
          voice: [],
          voice_info: []
        };
        extract.forEach(function (t) {
          if (t.folder) {
            for (var s_num in t.folder) {
              if (filter_items.season_num.indexOf(s_num) == -1) filter_items.season_num.push(s_num);
            }
          }
        });
        filter_items.season_num.sort(function (a, b) {
          return a - b;
        });
        filter_items.season_num.forEach(function (s_num) {
          filter_items.season.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + s_num);
        });
        if (!filter_items.season[choice.season]) choice.season = 0;

        if (filter_items.season[choice.season]) {
          var s_num = filter_items.season_num[choice.season];
          extract.forEach(function (t) {
            if (t.folder && t.folder[s_num]) {
              var v_id = t.id || '';

              if (!filter_items.voice_info.some(function (v) {
                return v.id == v_id;
              })) {
                filter_items.voice.push(t.title || t.comment || '');
                filter_items.voice_info.push({
                  id: v_id
                });
              }
            }
          });
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];
        extract.forEach(function (data) {
          if (data.folder) {
            var v_info = filter_items.voice_info[choice.voice];

            if (v_info && data.id == v_info.id) {
              var voice = filter_items.voice[choice.voice];
              var s_num = filter_items.season_num[choice.season];
              var s = data.folder[s_num] || {};

              if (s.folder) {
                for (var e_num in s.folder) {
                  var e = s.folder[e_num] || {};

                  if (e.file) {
                    filtred.push({
                      title: component.formatEpisodeTitle(s_num, e_num),
                      quality: '360p ~ 1080p',
                      info: ' / ' + Lampa.Utils.shortText(voice, 50),
                      season: parseInt(s_num),
                      episode: parseInt(e_num),
                      media: e
                    });
                  }
                }
              }
            }
          } else if (data.file) {
            filtred.push({
              title: data.title || data.comment || select_title,
              quality: '360p ~ 1080p',
              info: '',
              media: data
            });
          }
        });
        return filtred;
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (element.loading) return;
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            element.loading = true;
            getStream(element, function (element) {
              element.loading = false;
              var first = {
                url: component.getDefaultQuality(element.qualitys, element.stream),
                quality: component.renameQualityMap(element.qualitys),
                subtitles: element.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };
              Lampa.Player.play(first);

              if (element.season && Lampa.Platform.version) {
                var playlist = [];
                items.forEach(function (elem) {
                  if (elem == element) {
                    playlist.push(first);
                  } else {
                    var cell = {
                      url: function url(call) {
                        getStream(elem, function (elem) {
                          cell.url = component.getDefaultQuality(elem.qualitys, elem.stream);
                          cell.quality = component.renameQualityMap(elem.qualitys);
                          cell.subtitles = elem.subtitles;
                          call();
                        }, function () {
                          cell.url = '';
                          call();
                        });
                      },
                      timeline: elem.timeline,
                      title: elem.title
                    };
                    playlist.push(cell);
                  }
                });
                Lampa.Player.playlist(playlist);
              } else {
                Lampa.Player.playlist([first]);
              }

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            }, function () {
              element.loading = false;
              Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
            });
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              getStream(element, function (element) {
                call({
                  file: element.stream,
                  quality: element.qualitys
                });
              }, function () {
                Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
              });
            }
          });
        });
        component.start(true);
      }
    }

    function fancdn2(component, _object) {
      var network = new Lampa.Reguest();
      var extract = [];
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prox = component.proxy('fancdn2');
      var host = Utils.fancdnHost();
      var ref = host + '/';
      var user_agent = Utils.baseUserAgent();
      var cookie = Utils.randomCookie();
      var headers = Lampa.Platform.is('android') ? {
        'Origin': host,
        'Referer': ref,
        'User-Agent': user_agent,
        'Cookie': cookie
      } : {};
      var prox_enc = '';

      if (prox) {
        prox_enc += 'param/Origin=' + encodeURIComponent(host) + '/';
        prox_enc += 'param/Referer=' + encodeURIComponent(ref) + '/';
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
        prox_enc += 'param/Cookie=' + encodeURIComponent(cookie) + '/';
      }

      var embed = atob('aHR0cHM6Ly9mYW5jZG4ubmV0L2lmcmFtZS8=');
      var token = Lampa.Storage.get('online_mod_fancdn_token', '') + '';
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };

      function fancdn_api_search(api, callback, error) {
        var url = Lampa.Utils.addUrlComponent(embed, api);

        if (token) {
          url = Lampa.Utils.addUrlComponent(url, token);
        }

        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(url, prox, prox_enc), function (str) {
          if (str && str.indexOf('<title>Доступ ограничен</title>') !== -1) {
            if (error) error(Lampa.Lang.translate('online_mod_authorization_required') + ' FanSerials');
            return;
          }

          if (callback) callback(str || '');
        }, function (a, c) {
          if (error) error(network.errorDecode(a, c));
        }, false, {
          dataType: 'text',
          headers: headers
        });
      }
      /**
       * Начать поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */


      this.search = function (_object, kinopoisk_id) {
        object = _object;
        select_title = object.search || object.movie.title;

        var empty = function empty() {
          component.emptyForQuery(select_title);
        };

        var error = component.empty.bind(component);
        var api = (+kinopoisk_id ? 'kinopoisk=' : 'imdb_id=') + encodeURIComponent(kinopoisk_id);
        fancdn_api_search(api, function (str) {
          parse(str || '', function () {
            if (!object.clarification && object.movie.imdb_id && kinopoisk_id != object.movie.imdb_id) {
              fancdn_api_search('imdb_id=' + encodeURIComponent(object.movie.imdb_id), function (str) {
                parse(str || '', empty);
              }, error);
            } else empty();
          });
        }, error);
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: ''
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };
      /**
       * Получить потоки
       * @param {String} str
       * @returns array
       */


      function extractItems(str, url) {
        if (!str) return [];

        try {
          var items = component.parseM3U(str).map(function (item) {
            var link = item.link;
            var quality = item.height;
            var alt_quality = link.match(/\b(\d\d\d+)\./);

            if (alt_quality) {
              var alt_height = parseInt(alt_quality[1]);
              if (alt_height > quality && alt_height <= 4320) quality = alt_height;
            }

            return {
              label: quality ? quality + 'p' : '360p ~ 1080p',
              quality: quality,
              file: component.proxyStream(component.fixLink(link, url), 'fancdn')
            };
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }
      /**
       * Получить потоки
       * @param {String} str
       * @returns array
       */


      function extractItemsPlaylist(str, url) {
        if (!str) return [];

        try {
          var items = component.parsePlaylist(str).map(function (item) {
            var quality = item.label.match(/(\d\d\d+)p/);
            var link = item.links[0] || '';
            link = component.fixLinkProtocol(link, prefer_http, true);
            return {
              label: item.label,
              quality: quality ? parseInt(quality[1]) : NaN,
              file: component.proxyStream(link, 'fancdn')
            };
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function parseStream(element, call, error, itemsExtractor, str, url) {
        var file = '';
        var quality = false;
        var items = itemsExtractor(str, url);

        if (items && items.length) {
          file = items[0].file;
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = item.file;
          });
        }

        if (file) {
          element.stream = file;
          element.qualitys = quality;
          element.subtitles = parseSubs(element.media.subtitles, url);
          call(element);
        } else error();
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStreamM3U(element, call, error, file) {
        file = file.replace(/\.mp4:hls:manifest/, '');
        var hls_file = file.replace(/\/\d\d\d+([^\/]*\.m3u8)$/, '/hls$1');
        network.clear();
        network.timeout(5000);
        network["native"](component.proxyStream(hls_file, 'fancdn'), function (str) {
          parseStream(element, call, error, extractItems, str, hls_file);
        }, function (a, c) {
          if (file != hls_file) {
            network.clear();
            network.timeout(5000);
            network["native"](component.proxyStream(file, 'fancdn'), function (str) {
              parseStream(element, call, error, extractItems, str, file);
            }, function (a, c) {
              error();
            }, false, {
              dataType: 'text'
            });
          } else error();
        }, false, {
          dataType: 'text'
        });
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStream(element, call, error) {
        if (element.stream) return call(element);
        var url = element.media.file || '';

        if (startsWith(url, '[')) {
          parseStream(element, call, error, extractItemsPlaylist, url, '');
          return;
        }

        url = component.fixLinkProtocol(url, prefer_http, true);

        if (endsWith(url, '.m3u8')) {
          getStreamM3U(element, call, error, url);
          return;
        }

        if (url) {
          element.stream = component.proxyStream(url, 'fancdn');
          element.qualitys = false;
          element.subtitles = parseSubs(element.media.subtitles, url);
          call(element);
        } else error();
      }

      function parseSubs(str, url) {
        if (!str) return false;
        var subtitles = component.parsePlaylist(str).map(function (item) {
          var link = item.links[0] || '';
          link = component.fixLinkProtocol(link, prefer_http, true);
          return {
            label: item.label,
            url: component.proxyStreamSubs(component.fixLink(link, url), 'fancdn')
          };
        });
        return subtitles.length ? subtitles : false;
      }

      function parse(str, empty) {
        str = (str || '').replace(/\n/g, '');
        var find = str.match(/var playlist = (\[{.*?}\]);/);
        var json;

        try {
          json = find && (0, eval)('"use strict"; (function(){ return ' + find[1] + '; })();');
        } catch (e) {}

        if (json && json.forEach) {
          component.loading(false);
          extract = json;
          filter();
          append(filtred());
        } else empty();
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: [],
          season_num: [],
          voice: [],
          voice_info: []
        };
        extract.forEach(function (t) {
          if (t.folder) {
            for (var s_num in t.folder) {
              if (filter_items.season_num.indexOf(s_num) == -1) filter_items.season_num.push(s_num);
            }
          }
        });
        filter_items.season_num.sort(function (a, b) {
          return a - b;
        });
        filter_items.season_num.forEach(function (s_num) {
          filter_items.season.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + s_num);
        });
        if (!filter_items.season[choice.season]) choice.season = 0;

        if (filter_items.season[choice.season]) {
          var s_num = filter_items.season_num[choice.season];
          extract.forEach(function (t) {
            if (t.folder && t.folder[s_num]) {
              var v_id = t.id || '';

              if (!filter_items.voice_info.some(function (v) {
                return v.id == v_id;
              })) {
                filter_items.voice.push(t.title || t.comment || '');
                filter_items.voice_info.push({
                  id: v_id
                });
              }
            }
          });
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];
        extract.forEach(function (data) {
          if (data.folder) {
            var v_info = filter_items.voice_info[choice.voice];

            if (v_info && data.id == v_info.id) {
              var voice = filter_items.voice[choice.voice];
              var s_num = filter_items.season_num[choice.season];
              var s = data.folder[s_num] || {};

              if (s.folder) {
                for (var e_num in s.folder) {
                  var e = s.folder[e_num] || {};

                  if (e.file) {
                    filtred.push({
                      title: component.formatEpisodeTitle(s_num, e_num),
                      quality: '360p ~ 1080p',
                      info: ' / ' + Lampa.Utils.shortText(voice, 50),
                      season: parseInt(s_num),
                      episode: parseInt(e_num),
                      media: e
                    });
                  }
                }
              }
            }
          } else if (data.file) {
            filtred.push({
              title: data.title || data.comment || select_title,
              quality: '360p ~ 1080p',
              info: '',
              media: data
            });
          }
        });
        return filtred;
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (element.loading) return;
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            element.loading = true;
            getStream(element, function (element) {
              element.loading = false;
              var first = {
                url: component.getDefaultQuality(element.qualitys, element.stream),
                quality: component.renameQualityMap(element.qualitys),
                subtitles: element.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };
              Lampa.Player.play(first);

              if (element.season && Lampa.Platform.version) {
                var playlist = [];
                items.forEach(function (elem) {
                  if (elem == element) {
                    playlist.push(first);
                  } else {
                    var cell = {
                      url: function url(call) {
                        getStream(elem, function (elem) {
                          cell.url = component.getDefaultQuality(elem.qualitys, elem.stream);
                          cell.quality = component.renameQualityMap(elem.qualitys);
                          cell.subtitles = elem.subtitles;
                          call();
                        }, function () {
                          cell.url = '';
                          call();
                        });
                      },
                      timeline: elem.timeline,
                      title: elem.title
                    };
                    playlist.push(cell);
                  }
                });
                Lampa.Player.playlist(playlist);
              } else {
                Lampa.Player.playlist([first]);
              }

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            }, function () {
              element.loading = false;
              Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
            });
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              getStream(element, function (element) {
                call({
                  file: element.stream,
                  quality: element.qualitys
                });
              }, function () {
                Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
              });
            }
          });
        });
        component.start(true);
      }
    }

    function fanserials(component, _object) {
      var network = new Lampa.Reguest();
      var extract = [];
      var object = _object;
      var select_title = '';
      var select_id = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prox = component.proxy('fanserials');
      var host = Utils.fanserialsHost();
      var ref = host + '/';
      var user_agent = Utils.baseUserAgent();
      var headers = Lampa.Platform.is('android') ? {
        'Origin': host,
        'Referer': ref,
        'User-Agent': user_agent
      } : {};
      var prox_enc = '';

      if (prox) {
        prox_enc += 'param/Origin=' + encodeURIComponent(host) + '/';
        prox_enc += 'param/Referer=' + encodeURIComponent(ref) + '/';
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
      }

      var embed = (prefer_http ? 'http:' : 'https:') + '//playep.pro/gt/';
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };
      /**
       * Начать поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */

      this.search = function (_object, kinopoisk_id) {
        object = _object;
        select_id = kinopoisk_id;
        select_title = object.search || object.movie.title;

        if (isNaN(select_id)) {
          component.emptyForQuery(select_title);
          return;
        }

        var url = embed + select_id;
        url = Lampa.Utils.addUrlComponent(url, 'season=1');
        url = Lampa.Utils.addUrlComponent(url, 'episode=1');
        url = Lampa.Utils.addUrlComponent(url, 'alloff=true');
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(url, prox, prox_enc), function (str) {
          parse(str);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        }, false, {
          dataType: 'text',
          headers: headers
        });
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: ''
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };
      /**
       * Получить поток
       * @param {*} element
       */


      function parseStream(element, call, error, url, str) {
        var file = '';
        var quality = false;
        var subtitles = [];
        str = (str || '').replace(/\n/g, '');
        var find = str.match(/<div id="videoplayer[^>]*data-config=[^>]*>/);
        var player = find && $(find[0]);

        if (player) {
          var config = player.attr('data-config');
          var json;

          try {
            json = config && Lampa.Arrays.decodeJson(config, {});
          } catch (e) {}

          if (json && json.hls) {
            file = component.fixLink(json.hls, url);
          }

          ['data-original_subtitle', 'data-ru_subtitle', 'data-en_subtitle', 'data-ua_subtitle'].forEach(function (sub) {
            var link = player.attr(sub);

            if (link) {
              subtitles.push({
                label: sub.replace('data-', '').replace('_subtitle', ''),
                url: component.processSubs(component.fixLink(link, url))
              });
            }
          });
        }

        if (file) {
          element.stream = file;
          element.qualitys = quality;
          element.subtitles = subtitles.length ? subtitles : false;
          call(element);
        } else error();
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getBaseStream(element, call, error) {
        if (element.stream) return call(element);
        var url = embed + select_id;
        url = Lampa.Utils.addUrlComponent(url, 'season=' + element.media.season);
        url = Lampa.Utils.addUrlComponent(url, 'episode=' + element.media.episode);
        url = Lampa.Utils.addUrlComponent(url, 'voice=' + element.media.voice_id);
        url = Lampa.Utils.addUrlComponent(url, 'alloff=true');
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(url, prox, prox_enc), function (str) {
          parseStream(element, call, error, url, str);
        }, function (a, c) {
          error();
        }, false, {
          dataType: 'text',
          headers: headers
        });
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStream(element, call, error) {
        getBaseStream(element, function (element) {
          var file = element.stream || '';
          if (element.qualitys || element.parsed || !endsWith(file, '.m3u8')) return call(element);
          network.clear();
          network.timeout(10000);
          network["native"](file, function (str) {
            var items = extractQuality(str, file);
            items = items.filter(function (elem) {
              return elem.quality > 0;
            });

            if (items.length) {
              file = items[0].file;
              var quality = {};
              items.forEach(function (item) {
                if (!quality[item.label]) quality[item.label] = item.file;
              });
              element.stream = file;
              element.qualitys = quality;
            }

            element.parsed = true;
            call(element);
          }, function (a, c) {
            call(element);
          }, false, {
            dataType: 'text'
          });
        }, error);
      }

      function extractQuality(str, url) {
        if (!str) return [];

        try {
          var items = component.parseM3U(str).filter(function (item) {
            return item.xstream;
          }).map(function (item) {
            var link = item.link;
            var quality = item.height;
            if (quality > 1440 && quality <= 2160) quality = 2160;else if (quality > 1080 && quality <= 1440) quality = 1440;else if (quality > 720 && quality <= 1080) quality = 1080;else if (quality > 480 && quality <= 720) quality = 720;else if (quality > 360 && quality <= 480) quality = 480;else if (quality > 240 && quality <= 360) quality = 360;
            return {
              label: quality ? quality + 'p' : '360p ~ 1080p',
              quality: quality,
              bandwidth: item.bandwidth,
              codecs: item.codecs,
              file: component.fixLink(link, url)
            };
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.bandwidth > a.bandwidth) return 1;
            if (b.bandwidth < a.bandwidth) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }

      function parse(str) {
        component.loading(false);
        str = (str || '').replace(/\n/g, '');
        var find = str.match(/<div id="inputData"[^>]*>(\{.*?\})<\/div>/);
        var json;

        try {
          json = find && Lampa.Arrays.decodeJson(find[1], {});
        } catch (e) {}

        if (json) {
          extract = json;
          filter();
          append(filtred());
        } else component.emptyForQuery(select_title);
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: [],
          season_num: [],
          voice: [],
          voice_info: []
        };

        for (var s_num in extract) {
          if (filter_items.season_num.indexOf(s_num) == -1) filter_items.season_num.push(s_num);
        }

        filter_items.season_num.sort(function (a, b) {
          return a - b;
        });
        filter_items.season_num.forEach(function (s_num) {
          filter_items.season.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + s_num);
        });
        if (!filter_items.season[choice.season]) choice.season = 0;

        if (filter_items.season[choice.season]) {
          var _s_num = filter_items.season_num[choice.season];
          var episodes = extract[_s_num] || {};

          for (var e_num in episodes) {
            var translations = episodes[e_num] || [];
            translations.forEach(function (translation) {
              var v_id = translation.voice_id || '';

              if (!filter_items.voice_info.some(function (v) {
                return v.id == v_id;
              })) {
                filter_items.voice.push(translation.voice_name || '');
                filter_items.voice_info.push({
                  id: v_id
                });
              }
            });
          }
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];

        if (filter_items.season[choice.season] && filter_items.voice_info[choice.voice]) {
          (function () {
            var s_num = filter_items.season_num[choice.season];
            var v_id = filter_items.voice_info[choice.voice].id;
            var voice = filter_items.voice[choice.voice];
            var episodes = extract[s_num] || {};

            var _loop = function _loop(e_num) {
              var translations = episodes[e_num] || [];
              translations.forEach(function (translation) {
                if (translation.voice_id == v_id) {
                  filtred.push({
                    title: component.formatEpisodeTitle(s_num, e_num),
                    quality: '360p ~ 1080p',
                    info: ' / ' + Lampa.Utils.shortText(voice, 50),
                    season: s_num,
                    episode: e_num,
                    media: translation
                  });
                }
              });
            };

            for (var e_num in episodes) {
              _loop(e_num);
            }
          })();
        }

        return filtred;
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (element.loading) return;
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            element.loading = true;
            getStream(element, function (element) {
              element.loading = false;
              var first = {
                url: component.getDefaultQuality(element.qualitys, element.stream),
                quality: component.renameQualityMap(element.qualitys),
                subtitles: element.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };
              Lampa.Player.play(first);

              if (element.season && Lampa.Platform.version) {
                var playlist = [];
                items.forEach(function (elem) {
                  if (elem == element) {
                    playlist.push(first);
                  } else {
                    var cell = {
                      url: function url(call) {
                        getStream(elem, function (elem) {
                          cell.url = component.getDefaultQuality(elem.qualitys, elem.stream);
                          cell.quality = component.renameQualityMap(elem.qualitys);
                          cell.subtitles = elem.subtitles;
                          call();
                        }, function () {
                          cell.url = '';
                          call();
                        });
                      },
                      timeline: elem.timeline,
                      title: elem.title
                    };
                    playlist.push(cell);
                  }
                });
                Lampa.Player.playlist(playlist);
              } else {
                Lampa.Player.playlist([first]);
              }

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            }, function () {
              element.loading = false;
              Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
            });
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              getStream(element, function (element) {
                call({
                  file: element.stream,
                  quality: element.qualitys
                });
              }, function () {
                Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
              });
            }
          });
        });
        component.start(true);
      }
    }

    function videoseed(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prox = component.proxy('videoseed');
      var user_agent = Utils.baseUserAgent();
      var embed = atob('aHR0cHM6Ly90di0yLWtpbm9zZXJpYWwubmV0L2FwaV9wbGF5ZXIucGhw');
      var suffix = Utils.decodeSecret([69, 91, 92, 84, 89, 5, 1, 85, 83, 83, 6, 5, 14, 4, 84, 92, 4, 85, 84, 9, 87, 13, 3, 85, 2, 9, 83, 87, 80, 83, 80, 81, 83, 2, 14, 12, 7, 2], atob('U2Vla1Rva2Vu'));
      var headers = Lampa.Platform.is('android') ? {
        'User-Agent': user_agent
      } : {};
      var prox_enc = '';

      if (prox) {
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
      }

      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };
      /**
       * Начать поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */

      this.search = function (_object, kinopoisk_id) {
        object = _object;
        select_title = object.search || object.movie.title;

        if (isNaN(kinopoisk_id)) {
          component.emptyForQuery(select_title);
          return;
        }

        var empty = function empty() {
          component.emptyForQuery(select_title);
        };

        var error = component.empty.bind(component);
        var api = embed;
        api = Lampa.Utils.addUrlComponent(api, 'kp_id=' + encodeURIComponent(kinopoisk_id));
        api = Lampa.Utils.addUrlComponent(api, suffix);
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(api, prox, prox_enc, 'enc2'), function (str) {
          if (str && str !== 'NONE' && startsWith(str, 'http')) {
            var url = str;
            var pos = url.indexOf('?');

            if (pos !== -1) {
              url = url.substring(0, pos);
            }

            network.clear();
            network.timeout(10000);
            network["native"](component.proxyLink(url, prox, prox_enc), function (str) {
              parse(str || '', empty);
            }, function (a, c) {
              error(network.errorDecode(a, c));
            }, false, {
              dataType: 'text',
              headers: headers
            });
          } else empty();
        }, function (a, c) {
          error(network.errorDecode(a, c));
        }, false, {
          dataType: 'text',
          headers: headers
        });
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: ''
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function parse(str, empty) {
        str = (str || '').replace(/\n/g, '');
        var json;
        var find = str.match(/Playerjs\(({.*?})\);/);

        if (find) {
          try {
            json = find && (0, eval)('"use strict"; (function(){ var token = "", domain_name = ""; return ' + find[1] + '; })();');
          } catch (e) {}
        } else {
          find = str.match(/Playerjs\("([^"]*)"\);/);
          var player = find && decode(find[1]);

          try {
            json = player && JSON.parse(player);
          } catch (e) {}
        }

        if (json && json.file && typeof json.file === 'string') {
          json = {
            file: [json]
          };
        }

        if (json && json.file && json.file.forEach) {
          component.loading(false);
          extract = json;
          filter();
          append(filtred());
        } else empty();
      }

      function decode(data) {
        if (!startsWith(data, '#')) return data;

        var enc = function enc(str) {
          return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
          }));
        };

        var dec = function dec(str) {
          return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
        };

        var trashList = ['qVNP035fDl3hd05QZUkkYsRYC1glOVERZU0YGNvpepEFC', 'g8c71IUSaroqb636BTt7hlKNMA4oR718nyDbbiMm6PCEh', '3dNupT1rfIIIQgFh5Xhbk2i18Rfe4GN8Dq6IxL5saG9Y1', 'hxFNhEtJfd1WeZkns6d7DLvJ8vv8E88XenAtZ4UvDJeBV', '7r3aw2Eat03AiCGA260OBqg7qYmtPbG7aFY8T2b1GSNuL'];
        var x = data.substring(2);
        trashList.forEach(function (trash) {
          x = x.replace('|||' + enc(trash), '');
        });

        try {
          x = dec(x);
        } catch (e) {
          x = '';
        }

        return x;
      }

      function extractVoices(str) {
        var voices = {};
        var items = extractItems(str);
        items.forEach(function (item) {
          var prev = voices[item.voice || ''];
          var prev_items = prev && prev.items || [];
          prev_items.push(item);

          if (!prev || item.quality > prev.quality) {
            voices[item.voice || ''] = {
              quality: item.quality,
              items: prev_items
            };
          }
        });
        return voices;
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: [],
          voice: []
        };
        var season_objs = [];
        extract.file.forEach(function (s) {
          if (s.folder) {
            s.title = s.title || s.comment || '';
            s.season_num = parseInt(s.title.match(/\d+/));
            season_objs.push(s);
          }
        });
        season_objs.sort(function (a, b) {
          var cmp = a.season_num - b.season_num;
          if (cmp) return cmp;
          if (a.title > b.title) return 1;
          if (a.title < b.title) return -1;
          return 0;
        });
        filter_items.season = season_objs.map(function (s) {
          return s.title;
        });
        if (!filter_items.season[choice.season]) choice.season = 0;
        var s = season_objs[choice.season];

        if (s && s.folder) {
          s.folder.forEach(function (e) {
            if (e.folder) {
              e.folder.forEach(function (v) {
                var voice = v.title || v.comment || '';
                if (filter_items.voice.indexOf(voice) == -1) filter_items.voice.push(voice);
              });
            } else if (typeof e.file === 'string') {
              e.file_voices = extractVoices(e.file);

              for (var voice in e.file_voices) {
                if (voice && filter_items.voice.indexOf(voice) == -1) filter_items.voice.push(voice);
              }
            }
          });
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Получить потоки
       * @param {String} str
       * @param {String} voice
       * @returns array
       */


      function extractItems(str, voice) {
        if (!str) return [];

        try {
          if (!startsWith(str, '[')) str = '[]' + str;
          var list = component.parsePlaylist(str);
          list.forEach(function (el) {
            if (el.voice) el.voice = el.voice.trim();
          });

          if (voice) {
            var tmp = list.filter(function (el) {
              return el.voice == voice;
            });

            if (tmp.length) {
              list = tmp;
            } else {
              list = list.filter(function (el) {
                return typeof el.voice === 'undefined';
              });
            }
          }

          var items = list.map(function (item) {
            var quality = item.label.match(/(\d\d\d+)p/);
            var file = item.links[0] || '';
            return {
              label: item.label,
              quality: quality ? parseInt(quality[1]) : NaN,
              voice: item.voice,
              file: file
            };
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }

      function parseSubs(str) {
        if (!str) return false;
        var subtitles = component.parsePlaylist(str).map(function (item) {
          var link = item.links[0] || '';
          return {
            label: item.label,
            url: component.processSubs(link)
          };
        });
        return subtitles.length ? subtitles : false;
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];
        extract.file.forEach(function (data) {
          if (data.folder) {
            var s_title = data.title || data.comment || '';

            if (s_title == filter_items.season[choice.season]) {
              var season_num = parseInt(s_title.match(/\d+/));
              data.folder.forEach(function (e) {
                var e_title = e.title || e.comment || '';
                var episode_num = parseInt(e_title.match(/\d+/));
                e_title = e_title.replace(/\d+/, '').replace(/серия/i, '').trim();

                if (e.folder) {
                  e.folder.forEach(function (v) {
                    var voice = v.title || v.comment || '';

                    if (voice == filter_items.voice[choice.voice] && v.file) {
                      var items = extractItems(v.file);
                      filtred.push({
                        title: component.formatEpisodeTitle(season_num, episode_num, e_title),
                        quality: items[0] && items[0].quality ? items[0].quality + 'p' : '360p ~ 1080p',
                        info: ' / ' + Lampa.Utils.shortText(voice, 50),
                        season: season_num,
                        episode: episode_num,
                        media: items,
                        subtitles: parseSubs(v.subtitle)
                      });
                    }
                  });
                } else if (e.file_voices) {
                  var voice = filter_items.voice[choice.voice] || '';
                  var v = e.file_voices[voice];

                  if (!v) {
                    voice = '';
                    v = e.file_voices[voice];
                  }

                  if (v) {
                    filtred.push({
                      title: component.formatEpisodeTitle(season_num, episode_num, e_title),
                      quality: v.quality ? v.quality + 'p' : '360p ~ 1080p',
                      info: voice ? ' / ' + Lampa.Utils.shortText(voice, 50) : '',
                      season: season_num,
                      episode: episode_num,
                      media: v.items,
                      subtitles: parseSubs(e.subtitle)
                    });
                  }
                }
              });
            }
          } else {
            if (!data.file_voices && data.file && typeof data.file === 'string') {
              data.file_voices = extractVoices(data.file);
            }

            if (data.file_voices) {
              var subtitles = parseSubs(data.subtitle);

              for (var voice in data.file_voices) {
                var v = data.file_voices[voice];
                filtred.push({
                  title: voice || data.title || data.comment || select_title,
                  quality: v.quality ? v.quality + 'p' : '360p ~ 1080p',
                  info: '',
                  media: v.items,
                  subtitles: subtitles
                });
              }
            }
          }
        });
        return filtred;
      }
      /**
       * Найти поток
       * @param {Object} element
       * @returns string
       */


      function getFile(element) {
        var file = '';
        var quality = false;
        var items = element.media;

        if (items && items.length) {
          file = items[0].file;
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = item.file;
          });
        }

        return {
          file: file,
          quality: quality
        };
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        items.forEach(function (element) {
          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            var extra = getFile(element);

            if (extra.file) {
              var playlist = [];
              var first = {
                url: component.getDefaultQuality(extra.quality, extra.file),
                quality: component.renameQualityMap(extra.quality),
                subtitles: element.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (element.season) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: component.getDefaultQuality(ex.quality, ex.file),
                    quality: component.renameQualityMap(ex.quality),
                    subtitles: elem.subtitles,
                    timeline: elem.timeline,
                    title: elem.title
                  });
                });
              } else {
                playlist.push(first);
              }

              if (playlist.length > 1) first.playlist = playlist;
              Lampa.Player.play(first);
              Lampa.Player.playlist(playlist);

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            } else Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            file: function file(call) {
              call(getFile(element));
            }
          });
        });
        component.start(true);
      }
    }

    function vibix(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prox = component.proxy('vibix');
      var user_agent = Utils.baseUserAgent();
      var auth = Utils.decodeSecret([115, 83, 89, 70, 84, 74, 17, 6, 3, 8, 6, 74, 124, 108, 117, 91, 100, 97, 0, 8, 102, 4, 0, 95, 70, 127, 121, 4, 114, 117, 1, 89, 126, 94, 114, 12, 96, 83, 89, 102, 126, 0, 115, 96, 67, 73, 68, 7, 124, 69, 67, 5, 1, 87, 3, 93, 4, 82, 11, 85], atob('VmliaXhBdXRo'));
      var headers = Lampa.Platform.is('android') ? {
        'User-Agent': user_agent,
        'Authorization': auth
      } : {};
      var prox_enc = '';

      if (prox) {
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
        prox_enc += 'param/Authorization=' + encodeURIComponent(auth) + '/';
      }

      var embed = atob('aHR0cHM6Ly92aWJpeC5vcmcvYXBpL3YxL3B1Ymxpc2hlci92aWRlb3Mv');
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };

      function vibix_api_search(api, callback, error) {
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(embed + api, prox, prox_enc), function (json) {
          if (callback) callback(json);
        }, function (a, c) {
          if (a.status == 404 && (!a.responseText || a.responseText.indexOf('"Video not found"') !== -1)) {
            if (callback) callback('');
          } else if (error) error(network.errorDecode(a, c));
        }, false, {
          headers: headers
        });
      }
      /**
       * Начать поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */


      this.search = function (_object, kinopoisk_id) {
        object = _object;
        select_title = object.search || object.movie.title;

        var empty = function empty() {
          component.emptyForQuery(select_title);
        };

        var error = component.empty.bind(component);
        var api = (+kinopoisk_id ? 'kp/' : 'imdb/') + encodeURIComponent(kinopoisk_id);
        vibix_api_search(api, function (json) {
          getPage(json, function () {
            if (!object.clarification && object.movie.imdb_id && kinopoisk_id != object.movie.imdb_id) {
              vibix_api_search('imdb/' + encodeURIComponent(object.movie.imdb_id), function (json) {
                getPage(json, empty);
              }, error);
            } else empty();
          });
        }, error);
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: ''
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function getPage(json, empty) {
        if (!json || !json.iframe_url) {
          empty();
          return;
        }

        network.clear();
        network.timeout(10000);
        network["native"](json.iframe_url, function (str) {
          parse(str || '', empty);
        }, function (a, c) {
          empty();
        }, false, {
          dataType: 'text'
        });
      }

      function parse(str, empty) {
        str = (str || '').replace(/\n/g, '');
        var find = str.match(/Playerjs\(({.*?})\);/);
        var json;

        try {
          json = find && (0, eval)('"use strict"; (function(){ return ' + find[1] + '; })();');
        } catch (e) {}

        if (json && json.file && typeof json.file === 'string') {
          json = {
            file: [json]
          };
        }

        if (json && json.file && json.file.forEach) {
          component.loading(false);
          extract = json;
          filter();
          append(filtred());
        } else empty();
      }

      function extractVoices(str) {
        var voices = {};
        var items = extractItems(str);
        items.forEach(function (item) {
          var prev = voices[item.voice || ''];
          var prev_items = prev && prev.items || [];
          prev_items.push(item);

          if (!prev || item.quality > prev.quality) {
            voices[item.voice || ''] = {
              quality: item.quality,
              items: prev_items
            };
          }
        });
        return voices;
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: [],
          voice: []
        };
        var season_objs = [];
        extract.file.forEach(function (s) {
          if (s.folder) {
            s.title = s.title || s.comment || '';
            s.season_num = parseInt(s.title.match(/\d+/));
            season_objs.push(s);
          }
        });
        season_objs.sort(function (a, b) {
          var cmp = a.season_num - b.season_num;
          if (cmp) return cmp;
          if (a.title > b.title) return 1;
          if (a.title < b.title) return -1;
          return 0;
        });
        filter_items.season = season_objs.map(function (s) {
          return s.title;
        });
        if (!filter_items.season[choice.season]) choice.season = 0;
        var s = season_objs[choice.season];

        if (s && s.folder) {
          s.folder.forEach(function (e) {
            if (e.folder) {
              e.folder.forEach(function (v) {
                var voice = v.title || v.comment || '';
                if (filter_items.voice.indexOf(voice) == -1) filter_items.voice.push(voice);
              });
            } else if (typeof e.file === 'string') {
              e.file_voices = extractVoices(e.file);

              for (var voice in e.file_voices) {
                if (voice && filter_items.voice.indexOf(voice) == -1) filter_items.voice.push(voice);
              }
            }
          });
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Получить потоки
       * @param {String} str
       * @param {String} voice
       * @returns array
       */


      function extractItems(str, voice) {
        if (!str) return [];

        try {
          if (!startsWith(str, '[')) str = '[]' + str;
          var list = component.parsePlaylist(str);
          list.forEach(function (el) {
            if (el.voice) el.voice = el.voice.trim();
          });

          if (voice) {
            var tmp = list.filter(function (el) {
              return el.voice == voice;
            });

            if (tmp.length) {
              list = tmp;
            } else {
              list = list.filter(function (el) {
                return typeof el.voice === 'undefined';
              });
            }
          }

          var items = list.map(function (item) {
            var label = item.label;

            if (startsWith(label, 'MP4 ')) {
              label = label.substring('MP4 '.length).trim();
            }

            var quality = label.match(/(\d\d\d+)p/);
            var file = item.links[0] || '';
            return {
              label: label,
              quality: quality ? parseInt(quality[1]) : NaN,
              voice: item.voice,
              file: file
            };
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }

      function parseSubs(str) {
        if (!str) return false;
        var subtitles = component.parsePlaylist(str).map(function (item) {
          var link = item.links[0] || '';
          return {
            label: item.label,
            url: component.processSubs(link)
          };
        });
        return subtitles.length ? subtitles : false;
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];
        extract.file.forEach(function (data) {
          if (data.folder) {
            var s_title = data.title || data.comment || '';

            if (s_title == filter_items.season[choice.season]) {
              var season_num = parseInt(s_title.match(/\d+/));
              data.folder.forEach(function (e) {
                var e_title = e.title || e.comment || '';
                var episode_num = parseInt(e_title.match(/\d+/));
                e_title = e_title.replace(/\d+/, '').replace(/серия/i, '').trim();

                if (e.folder) {
                  e.folder.forEach(function (v) {
                    var voice = v.title || v.comment || '';

                    if (voice == filter_items.voice[choice.voice] && v.file) {
                      var items = extractItems(v.file);
                      filtred.push({
                        title: component.formatEpisodeTitle(season_num, episode_num, e_title),
                        quality: items[0] && items[0].quality ? items[0].quality + 'p' : '360p ~ 1080p',
                        info: ' / ' + Lampa.Utils.shortText(voice, 50),
                        season: season_num,
                        episode: episode_num,
                        media: items,
                        subtitles: parseSubs(v.subtitle)
                      });
                    }
                  });
                } else if (e.file_voices) {
                  var voice = filter_items.voice[choice.voice] || '';
                  var v = e.file_voices[voice];

                  if (!v) {
                    voice = '';
                    v = e.file_voices[voice];
                  }

                  if (v) {
                    filtred.push({
                      title: component.formatEpisodeTitle(season_num, episode_num, e_title),
                      quality: v.quality ? v.quality + 'p' : '360p ~ 1080p',
                      info: voice ? ' / ' + Lampa.Utils.shortText(voice, 50) : '',
                      season: season_num,
                      episode: episode_num,
                      media: v.items,
                      subtitles: parseSubs(e.subtitle)
                    });
                  }
                }
              });
            }
          } else {
            if (!data.file_voices && data.file && typeof data.file === 'string') {
              data.file_voices = extractVoices(data.file);
            }

            if (data.file_voices) {
              var subtitles = parseSubs(data.subtitle);

              for (var voice in data.file_voices) {
                var v = data.file_voices[voice];
                filtred.push({
                  title: voice || data.title || data.comment || select_title,
                  quality: v.quality ? v.quality + 'p' : '360p ~ 1080p',
                  info: '',
                  media: v.items,
                  subtitles: subtitles
                });
              }
            }
          }
        });
        return filtred;
      }
      /**
       * Найти поток
       * @param {Object} element
       * @returns string
       */


      function getFile(element) {
        var file = '';
        var quality = false;
        var items = element.media;

        if (items && items.length) {
          file = items[0].file;
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = item.file;
          });
        }

        return {
          file: file,
          quality: quality
        };
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        items.forEach(function (element) {
          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            var extra = getFile(element);

            if (extra.file) {
              var playlist = [];
              var first = {
                url: component.getDefaultQuality(extra.quality, extra.file),
                quality: component.renameQualityMap(extra.quality),
                subtitles: element.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (element.season) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: component.getDefaultQuality(ex.quality, ex.file),
                    quality: component.renameQualityMap(ex.quality),
                    subtitles: elem.subtitles,
                    timeline: elem.timeline,
                    title: elem.title
                  });
                });
              } else {
                playlist.push(first);
              }

              if (playlist.length > 1) first.playlist = playlist;
              Lampa.Player.play(first);
              Lampa.Player.playlist(playlist);

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            } else Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            file: function file(call) {
              call(getFile(element));
            }
          });
        });
        component.start(true);
      }
    }

    function alloha(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var av1_support = Lampa.Storage.field('online_mod_av1_support') === true;
      var prox = component.proxy('alloha');
      var prox2 = component.proxy('allohacdn');
      var user_agent = Utils.decodeSecret([122, 91, 75, 95, 88, 91, 87, 31, 12, 25, 4, 17, 30, 99, 94, 88, 84, 86, 64, 71, 17, 120, 96, 23, 7, 0, 23, 7, 15, 17, 97, 93, 89, 0, 4, 2, 23, 76, 7, 2, 29, 23, 119, 64, 73, 91, 81, 102, 83, 86, 124, 95, 68, 22, 2, 7, 6, 24, 7, 1, 22, 24, 114, 127, 96, 124, 122, 24, 23, 90, 89, 82, 82, 20, 118, 83, 87, 92, 89, 25, 25, 116, 92, 67, 89, 89, 82, 25, 1, 10, 0, 26, 1, 24, 4, 25, 6, 16, 106, 86, 82, 80, 68, 93, 24, 3, 3, 14, 25, 7, 7]);
      var headers2 = Lampa.Platform.is('android') ? {
        'User-Agent': user_agent
      } : {};
      var prox2_enc = '';

      if (prox2) {
        prox2_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
      }

      var token = Utils.decodeSecret([83, 7, 0, 1, 0, 3, 7, 3, 12, 14, 81, 4, 6, 1, 84, 5, 4, 10, 84, 6, 1, 0, 7, 82, 82, 83, 0, 0, 81, 6]);
      var embed = 'https://api.apbugall.org/?token=' + token;
      var decrypt = Utils.decodeSecret([31, 82, 68, 88, 87, 67, 95, 95, 87, 31, 71, 69, 68, 24, 23, 67, 66, 85, 27, 20, 69, 89, 95, 82, 88, 28, 25, 86, 66, 0, 31, 79, 23, 64, 81, 75, 23, 81, 73, 66, 70, 86, 85, 68, 25, 10, 20, 74, 75, 15, 23, 64, 81, 75, 23, 92, 94, 69, 64, 23, 11, 16, 76, 69, 88, 31, 91, 85, 67, 85, 88, 17, 24, 106, 25, 94, 64, 67, 70, 67, 6, 13, 104, 30, 106, 27, 108, 104, 108, 22, 106, 31, 24, 106, 27, 24, 31, 11, 25, 94, 82, 17, 30, 92, 88, 69, 68, 16, 76, 20, 84, 78, 64, 69, 87, 83, 77, 25, 68, 94, 69, 64, 83, 87, 68, 88, 23, 9, 17, 17, 64, 88, 93, 85, 87, 10, 19, 17, 29, 20, 82, 88, 83, 86, 83, 81, 100, 100, 125, 116, 89, 93, 73, 88, 90, 84, 88, 64, 31, 66, 95, 82, 82, 90, 24, 22, 31, 23, 30, 81, 79, 6, 20, 14, 22, 19, 17, 87, 70, 8, 10, 19, 17, 29, 20, 86, 64, 1, 25, 13, 20, 22, 17, 29, 23, 29, 16, 30, 17, 85, 68, 66, 91, 71, 90, 81, 64, 10, 4, 23, 87, 65, 83, 95, 95, 4, 17, 71, 68, 84, 64, 94, 66, 92, 92, 10, 19, 10, 22, 66, 86, 68, 16, 75, 82, 82, 84, 68, 81, 69, 22, 13, 25, 66, 70, 93, 13, 20, 65, 87, 66, 25, 66, 71, 84, 68, 107, 86, 81, 85, 87, 67, 20, 12, 22, 19, 122, 89, 74, 80, 91, 88, 80, 25, 1, 25, 6, 16, 17, 96, 93, 95, 82, 91, 64, 69, 16, 119, 99, 20, 0, 6, 26, 7, 13, 16, 110, 94, 90, 7, 2, 15, 23, 78, 6, 13, 30, 20, 112, 70, 68, 91, 83, 103, 92, 85, 127, 88, 66, 27, 2, 5, 7, 23, 4, 2, 17, 30, 127, 127, 98, 125, 117, 27, 20, 93, 95, 95, 82, 22, 119, 92, 84, 95, 94, 31, 20, 116, 94, 66, 86, 90, 81, 30, 7, 7, 0, 24, 0, 23, 7, 26, 1, 22, 103, 86, 80, 81, 75, 94, 27, 4, 5, 3, 25, 5, 6, 30, 12, 20, 71, 87, 70, 23, 87, 83, 90, 82, 68, 69, 69, 107, 94, 82, 16, 4, 23, 19, 1, 3, 82, 15, 6, 0, 13, 82, 4, 3, 83, 1, 2, 7, 6, 13, 1, 0, 6, 15, 7, 5, 85, 1, 90, 5, 0, 2, 4, 81, 86, 80, 0, 8, 5, 80, 87, 5, 7, 15, 6, 3, 95, 84, 5, 84, 82, 86, 84, 15, 82, 15, 15, 87, 80, 82, 4, 86, 14, 84, 0, 84, 0, 4, 17, 15, 23, 83, 72, 77, 69, 85, 82, 66, 26, 83, 89, 93, 88, 94, 90, 17, 11, 20, 95, 89, 67, 77, 108, 5, 108, 22, 31, 23, 17, 31, 30, 12, 20, 84, 78, 64, 69, 87, 83, 77, 25, 68, 67, 89, 76, 5, 22, 13, 25, 31, 19, 65, 87, 70, 86, 91, 31, 118, 69, 93, 86, 95, 90, 10, 17, 16, 18, 23, 81, 95, 85, 91, 83, 83, 101, 107, 126, 119, 94, 91, 68, 88, 88, 85, 87, 67, 28, 89, 89, 71, 67, 109, 1, 100, 30, 20, 26, 22, 19, 24, 17, 25, 25, 28, 20, 25, 17, 68, 86, 68, 81, 84, 24, 102, 84, 80, 81, 69, 83, 66, 4, 16, 20, 26, 22, 81, 89, 85, 95, 93, 82, 97, 99, 127, 119, 88, 91, 64, 86, 89, 81, 95, 66, 28, 69, 83, 86, 92, 69, 81, 67, 31, 20, 28, 22, 23, 22, 16, 29, 17, 29, 20, 31, 17, 64, 88, 69, 85, 92, 25, 97, 68, 83, 66, 20, 118, 83, 84, 88, 64, 10, 17, 16, 18, 23, 81, 95, 85, 91, 83, 83, 101, 107, 126, 119, 94, 91, 68, 88, 88, 85, 87, 67, 28, 68, 69, 81, 69, 105, 81, 94, 82, 90, 69, 31, 20, 28, 22, 23, 22, 16, 29, 17, 29, 20, 31, 17, 64, 88, 69, 85, 92, 25, 103, 82, 85, 29, 127, 82, 64, 82, 94, 25, 115, 83, 67, 77, 10, 81, 92, 70, 64, 78, 25, 23, 16, 23, 31, 17, 30, 19, 71, 87, 66, 88, 90, 27, 98, 83, 87, 26, 112, 85, 77, 84, 92, 28, 123, 91, 83, 83, 13, 90, 88, 70, 66, 25, 19, 30, 22, 27, 25, 31, 19, 65, 87, 70, 86, 91, 31, 106, 82, 87, 28, 112, 81, 67, 85, 88, 20, 100, 93, 69, 83, 9, 68, 87, 93, 92, 26, 91, 67, 95, 83, 94, 88, 31, 30, 30, 20, 26, 22, 28, 16, 70, 81, 75, 86, 89, 30, 110, 25, 101, 83, 65, 76, 82, 71, 69, 83, 80, 26, 97, 89, 77, 95, 9, 105, 123, 120, 127, 66, 68, 73, 101, 81, 64, 67, 81, 68, 66, 31, 30, 30, 15, 17, 83, 76, 67, 68, 81, 90, 67, 26, 89, 83, 85, 83, 83, 66, 74, 23, 9, 17, 122, 85, 90, 70, 81, 23, 103, 88, 80, 66, 82, 88, 68, 93, 23, 94, 71, 25, 17, 85, 89, 82, 66, 86, 94, 80, 22, 31, 20, 8, 22, 75, 25, 16, 123, 67, 95, 83, 94, 88, 23, 3, 23, 92, 94, 69, 64, 108, 7, 109, 21, 23, 19, 99, 83, 82, 82, 68, 85, 75, 16, 14, 17, 68, 81, 81, 83, 66, 92, 69, 24, 17, 17, 97, 68, 83, 66, 20, 118, 83, 84, 88, 64, 16, 12, 16, 76, 68, 81, 67, 105, 85, 80, 83, 94, 77, 27, 20, 22, 101, 81, 84, 27, 118, 92, 67, 87, 89, 27, 112, 82, 69, 68, 30, 13, 20, 22, 83, 89, 71, 66, 73, 30, 27, 20, 22, 101, 81, 84, 27, 118, 92, 67, 87, 89, 27, 121, 88, 82, 85, 30, 13, 20, 22, 85, 91, 69, 69, 23, 21, 23, 19, 98, 83, 87, 26, 112, 85, 77, 84, 92, 28, 101, 93, 67, 83, 23, 3, 23, 19, 66, 87, 89, 82, 27, 95, 75, 94, 83, 88, 88, 19, 27, 22, 23, 97, 26, 102, 84, 71, 65, 82, 69, 68, 92, 83, 25, 102, 95, 64, 95, 17, 10, 25, 16, 108, 124, 122, 124, 67, 66, 64, 107, 82, 69, 68, 83, 71, 67, 17, 16, 68, 23, 14, 17, 77, 73, 12, 22, 70, 88, 69, 20, 68, 69, 81, 69, 22, 13, 25, 68, 64, 67, 24, 89, 86, 66, 83, 81, 31, 27, 13, 91, 81, 67, 87, 16, 87, 86, 89, 84, 11, 22, 65, 95, 85, 78, 71, 91, 67, 66, 22, 25, 28, 12, 84, 82, 64, 80, 22, 90, 86, 91, 85, 4, 21, 111, 111, 20, 105, 29, 20, 30, 19, 23, 87, 94, 88, 64, 82, 88, 68, 4, 21, 28, 106, 104, 22, 106, 28, 25, 27, 24, 29, 10, 22, 93, 81, 22, 24, 76, 68, 81, 67, 31, 79, 23, 64, 81, 75, 23, 71, 17, 11, 20, 66, 69, 85, 75, 108, 5, 108, 24, 71, 91, 95, 83, 92, 31, 7, 29, 22, 25, 2, 31, 11, 25, 65, 85, 67, 22, 88, 23, 11, 16, 74, 25, 88, 84, 88, 83, 67, 94, 11, 25, 65, 85, 67, 22, 76, 23, 11, 16, 9, 12, 20, 87, 89, 70, 31, 64, 81, 75, 23, 93, 17, 11, 20, 7, 13, 16, 80, 23, 8, 17, 90, 15, 23, 95, 27, 18, 30, 20, 73, 22, 9, 23, 30, 72, 25, 28, 20, 66, 24, 87, 95, 87, 66, 122, 88, 80, 84, 119, 64, 31, 95, 25, 16, 23, 17, 17, 90, 15, 23, 64, 81, 75, 23, 85, 17, 11, 20, 89, 83, 71, 25, 118, 70, 67, 87, 77, 31, 90, 25, 2, 23, 82, 94, 68, 28, 65, 87, 66, 25, 94, 20, 12, 22, 4, 12, 22, 89, 25, 11, 20, 93, 13, 20, 94, 29, 27, 16, 23, 76, 17, 11, 20, 31, 7, 1, 9, 4, 1, 0, 3, 6, 3, 3, 16, 19, 23, 76, 17, 29, 20, 6, 4, 3, 13, 2, 29, 17, 19, 20, 91, 26, 16, 88, 108, 93, 108, 22, 9, 23, 78, 11, 25, 65, 85, 67, 22, 71, 86, 22, 13, 25, 68, 26, 66, 70, 88, 94, 66, 24, 30, 16, 29, 10, 22, 82, 88, 68, 24, 79, 86, 70, 17, 95, 20, 10, 22, 92, 25, 26, 20, 0, 13, 20, 94, 22, 14, 4, 23, 4, 10, 22, 93, 26, 27, 25, 25, 76, 20, 71, 87, 70, 23, 92, 16, 4, 23, 85, 106, 95, 105, 27, 22, 68, 25, 10, 20, 106, 69, 85, 108, 92, 109, 21, 23, 71, 80, 109, 93, 106, 107, 11, 25, 68, 85, 106, 95, 105, 23, 11, 16, 77, 108, 4, 108, 26, 20, 68, 87, 107, 83, 106, 20, 12, 22, 64, 108, 7, 109, 2, 23, 73, 17, 64, 85, 69, 22, 81, 90, 84, 81, 65, 66, 71, 104, 85, 95, 87, 67, 70, 94, 90, 71, 23, 11, 16, 74, 86, 26, 91, 89, 93, 89, 30, 23, 30, 30, 26, 66, 90, 93, 84, 83, 24, 11, 27, 20, 28, 4, 29, 23, 29, 16, 30, 75, 19, 17, 29, 20, 86, 85, 83, 92, 71, 64, 66, 105, 93, 83, 13, 16, 92, 79, 64, 67, 87, 87, 67, 24, 64, 75, 88, 76, 3, 22, 31, 10, 22, 23, 73, 86, 70, 80, 91, 27, 100, 68, 81, 82, 86, 25, 83, 89, 64, 26, 117, 95, 87, 67, 70, 94, 90, 71, 10, 17, 16, 18, 23, 81, 95, 85, 91, 83, 83, 101, 107, 126, 119, 94, 91, 68, 88, 88, 85, 87, 67, 28, 80, 85, 87, 82, 70, 68, 74, 104, 87, 94, 88, 64, 69, 89, 92, 74, 30, 20, 26, 22, 19, 24, 17, 11, 25, 94, 82, 17, 30, 120, 86, 91, 64, 88, 25, 100, 93, 87, 64, 81, 89, 66, 84, 25, 93, 66, 30, 19, 86, 88, 84, 75, 88, 93, 85, 17, 29, 30, 77, 16, 92, 79, 64, 67, 87, 87, 67, 24, 88, 92, 86, 80, 84, 68, 71, 108, 17, 99, 75, 86, 95, 80, 27, 86, 88, 66, 29, 122, 88, 90, 69, 68, 91, 91, 69, 23, 100, 23, 9, 17, 87, 87, 84, 83, 64, 77, 68, 107, 82, 89, 90, 67, 68, 95, 85, 68, 15, 17, 75, 20, 74, 22, 85, 65, 67, 70, 80, 85, 64, 25, 69, 68, 75, 82, 85, 92, 105, 68, 69, 89, 72, 11, 23, 9, 17, 30, 19, 71, 87, 66, 88, 90, 27, 126, 68, 93, 80, 95, 94, 4, 16, 20, 26, 22, 81, 89, 85, 95, 93, 82, 97, 99, 127, 119, 88, 91, 64, 86, 89, 81, 95, 66, 28, 95, 89, 67, 77, 108, 5, 108, 31, 20, 28, 22, 23, 22, 16, 29, 17, 29, 20, 31, 17, 64, 88, 69, 85, 92, 25, 102, 82, 80, 85, 75, 82, 70, 12, 17, 20, 28, 22, 85, 87, 84, 91, 85, 83, 97, 101, 127, 115, 86, 90, 68, 94, 88, 81, 89, 66, 24, 81, 88, 71, 69, 109, 5, 106, 22, 27, 25, 16, 27, 22, 31, 20, 28, 22, 23, 22, 16, 29, 17, 29, 20, 31, 17, 64, 88, 69, 85, 92, 25, 97, 68, 83, 66, 20, 118, 83, 84, 88, 64, 10, 17, 16, 18, 23, 81, 95, 85, 91, 83, 83, 101, 107, 126, 119, 94, 91, 68, 88, 88, 85, 87, 67, 28, 68, 69, 81, 69, 105, 81, 94, 82, 90, 69, 31, 20, 28, 22, 23, 22, 16, 29, 10, 22, 81, 79, 66, 66, 88, 84, 64, 31, 69, 64, 69, 83, 81, 84, 104, 92, 84, 87, 80, 82, 68, 67, 25, 10, 20, 125, 87, 89, 71, 87, 30, 105, 91, 85, 69, 80, 91, 69, 91, 30, 80, 68, 28, 22, 87, 90, 83, 68, 95, 80, 83, 19, 24, 22, 11, 23, 77, 16, 30, 120, 70, 88, 81, 93, 89, 17, 10, 25, 95, 91, 66, 66, 111, 6, 107, 28, 25, 16, 102, 84, 80, 81, 69, 83, 66, 30, 13, 20, 89, 89, 71, 67, 109, 1, 100, 23, 31, 17, 17, 27, 16, 26, 16, 30, 98, 71, 84, 68, 25, 118, 81, 85, 87, 67, 19, 11, 22, 65, 68, 83, 66, 102, 86, 83, 84, 88, 64, 23, 75, 16, 3, 23, 79, 76, 13, 20, 74, 22, 66, 92, 67, 65, 67, 88, 20, 82, 78, 68, 75, 86, 87, 69, 13, 20, 74, 31, 30, 90, 86, 88, 93, 30, 79, 74, 26]);
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };

      function alloha_api_search(api, callback, error) {
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(embed + '&' + api, prox, '', 'enc2'), function (json) {
          if (callback) callback(json);
        }, function (a, c) {
          if (error) error(network.errorDecode(a, c));
        });
      }
      /**
       * Начать поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */


      this.search = function (_object, kinopoisk_id) {
        object = _object;
        select_title = object.search || object.movie.title;
        var error = component.empty.bind(component);
        var api = (+kinopoisk_id ? 'kp=' : 'imdb=') + kinopoisk_id;
        alloha_api_search(api, function (json) {
          if (json && json.data && json.data.iframe) getPage(json.data);else if (!object.clarification && object.movie.imdb_id && kinopoisk_id != object.movie.imdb_id) {
            alloha_api_search('imdb=' + object.movie.imdb_id, function (json) {
              if (json && json.data && json.data.iframe) getPage(json.data);else component.emptyForQuery(select_title);
            }, error);
          } else component.emptyForQuery(select_title);
        }, error);
      };

      function getPage(data) {
        network.clear();
        network.timeout(20000);
        network["native"](component.proxyLink(data.iframe, prox2, prox2_enc, 'enc2'), function (str) {
          parse(str, data.iframe);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        }, false, {
          dataType: 'text',
          headers: headers2
        });
      }

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: ''
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function parseSubs(tracks) {
        if (!(tracks && tracks.length)) return false;
        var subtitles = tracks.filter(function (t) {
          return t.kind === 'captions';
        }).map(function (item) {
          var links = item.src || '';
          var link = links.split(' or ').filter(function (link) {
            return link;
          })[0] || '';
          return {
            label: item.label,
            url: component.processSubs(component.proxyLink(link, prox2, extract.stream_prox2))
          };
        });
        return subtitles.length ? subtitles : false;
      }

      function parse(str, url) {
        str = (str || '').replace(/\n/g, '');
        var fileList = str.match(/ fileList = JSON\.parse\('(\{.*\})'\);/);
        var pl = fileList && Lampa.Arrays.decodeJson(fileList[1], {});
        extract = {};

        try {
          extract = (0, eval)(decrypt + [JSON.stringify(str), JSON.stringify(url), JSON.stringify(token), JSON.stringify(av1_support)].join(',') + ');');
        } catch (e) {}

        extract.pl = {};

        if (pl && pl.all && Object.keys(pl.all).length) {
          extract.pl = pl;
          component.loading(false);
          filter();
          append(filtred());
        } else component.emptyForQuery(select_title);
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: [],
          season_num: [],
          voice: [],
          voice_info: []
        };

        if (extract.pl.type === 'serial') {
          for (var s_num in extract.pl.all) {
            if (filter_items.season_num.indexOf(s_num) == -1) filter_items.season_num.push(s_num);
          }
        }

        filter_items.season_num.sort(function (a, b) {
          return a - b;
        });
        filter_items.season_num.forEach(function (s_num) {
          filter_items.season.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + s_num);
        });
        if (!filter_items.season[choice.season]) choice.season = 0;

        if (filter_items.season[choice.season]) {
          var _s_num = filter_items.season_num[choice.season];
          var episodes = extract.pl.all[_s_num] || {};

          for (var e_num in episodes) {
            var translations = episodes[e_num] || {};

            var _loop = function _loop(v_id) {
              if (!filter_items.voice_info.some(function (v) {
                return v.id == v_id;
              })) {
                filter_items.voice.push(translations[v_id].translation);
                filter_items.voice_info.push({
                  id: v_id
                });
              }
            };

            for (var v_id in translations) {
              _loop(v_id);
            }
          }
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];

        if (extract.pl.type === 'serial') {
          if (filter_items.season[choice.season] && filter_items.voice_info[choice.voice]) {
            var s_num = filter_items.season_num[choice.season];
            var v_id = filter_items.voice_info[choice.voice].id;
            var voice = filter_items.voice[choice.voice];
            var episodes = extract.pl.all[s_num] || {};

            for (var e_num in episodes) {
              var translations = episodes[e_num] || {};

              if (translations[v_id]) {
                var media = translations[v_id];
                filtred.push({
                  title: component.formatEpisodeTitle(s_num, e_num),
                  quality: '360p ~ 1080p' + (media.quality ? ' / ' + media.quality : ''),
                  info: ' / ' + Lampa.Utils.shortText(voice, 50),
                  season: s_num,
                  episode: e_num,
                  media: media
                });
              }
            }
          }
        } else {
          for (var type in extract.pl.all) {
            var _translations = extract.pl.all[type] || {};

            for (var translation in _translations) {
              var qualities = _translations[translation] || {};

              for (var quality in qualities) {
                var _media = qualities[quality];
                filtred.push({
                  title: (_media.translation || select_title) + (_media.directors_cut ? ' (Режиссёрская версия)' : ''),
                  quality: '360p ~ 1080p' + (_media.quality ? ' / ' + _media.quality : ''),
                  info: '',
                  media: _media
                });
              }
            }
          }
        }

        return filtred;
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStream(element, call, error) {
        if (element.stream) return call(element);
        if (!(element.media.id && extract.domain)) return error();
        var postdata = extract.postdata;
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(extract.domain + 'api/movies/' + element.media.id, prox2, extract.prox2, 'enc2'), function (json) {
          if (json && json.hlsSource && json.hlsSource.length) {
            var file = '';
            var quality = false;
            var items = [];
            var hlsSource = json.hlsSource.filter(function (s) {
              return s["default"];
            })[0] || json.hlsSource[0] || {};

            if (hlsSource.quality) {
              for (var q_id in hlsSource.quality) {
                var links = hlsSource.quality[q_id] || '';
                var link = links.split(' or ').filter(function (link) {
                  return link;
                })[0] || '';

                if (link) {
                  items.push({
                    label: q_id + 'p',
                    quality: parseInt(q_id),
                    file: component.proxyLink(link, prox2, extract.stream_prox2)
                  });
                }
              }

              items.sort(function (a, b) {
                if (b.quality > a.quality) return 1;
                if (b.quality < a.quality) return -1;
                if (b.label > a.label) return 1;
                if (b.label < a.label) return -1;
                return 0;
              });

              if (!av1_support) {
                items = items.filter(function (item) {
                  return !(item.quality > 1080);
                });
              }
            }

            if (items && items.length) {
              file = items[0].file;

              if (items.length > 1) {
                quality = {};
                items.forEach(function (item) {
                  if (!quality[item.label]) quality[item.label] = item.file;
                });
              }
            }

            if (file) {
              element.stream = file;
              element.qualitys = quality;
              element.subtitles = parseSubs(json.tracks);
              call(element);
            } else error();
          } else error();
        }, function (a, c) {
          error();
        }, postdata, {
          headers: extract.headers
        });
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (element.loading) return;
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            element.loading = true;
            getStream(element, function (element) {
              element.loading = false;
              var first = {
                url: component.getDefaultQuality(element.qualitys, element.stream),
                quality: component.renameQualityMap(element.qualitys),
                subtitles: element.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };
              Lampa.Player.play(first);

              if (element.season && Lampa.Platform.version) {
                var playlist = [];
                items.forEach(function (elem) {
                  if (elem == element) {
                    playlist.push(first);
                  } else {
                    var cell = {
                      url: function url(call) {
                        getStream(elem, function (elem) {
                          cell.url = component.getDefaultQuality(elem.qualitys, elem.stream);
                          cell.quality = component.renameQualityMap(elem.qualitys);
                          cell.subtitles = elem.subtitles;
                          call();
                        }, function () {
                          cell.url = '';
                          call();
                        });
                      },
                      timeline: elem.timeline,
                      title: elem.title
                    };
                    playlist.push(cell);
                  }
                });
                Lampa.Player.playlist(playlist);
              } else {
                Lampa.Player.playlist([first]);
              }

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            }, function () {
              element.loading = false;
              Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
            });
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              getStream(element, function (element) {
                call({
                  file: element.stream,
                  quality: element.qualitys
                });
              }, function () {
                Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
              });
            }
          });
        });
        component.start(true);
      }
    }

    function redheadsound(component, _object, prefer_dash) {
      var network = new Lampa.Reguest();
      var extract = [];
      var object = _object;
      var select_title = '';
      var page_title = '';
      var prox = component.proxy('redheadsound');
      var host = 'https://redheadsound.studio';
      var ref = host + '/';
      var user_agent = Utils.baseUserAgent();
      var headers = Lampa.Platform.is('android') ? {
        'Origin': host,
        'Referer': ref,
        'User-Agent': user_agent
      } : {};
      var prox_enc = '';

      if (prox) {
        prox_enc += 'param/Origin=' + encodeURIComponent(host) + '/';
        prox_enc += 'param/Referer=' + encodeURIComponent(ref) + '/';
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
      }

      var embed = ref;
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0
      };
      /**
       * Поиск
       * @param {Object} _object
       */

      this.search = function (_object, kinopoisk_id, data) {
        var _this = this;

        object = _object;
        select_title = object.search || object.movie.title;
        if (this.wait_similars && data && data[0].is_similars) return getPage(data[0]);
        var search_date = object.search_date || !object.clarification && (object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date) || '0000';
        var search_year = parseInt((search_date + '').slice(0, 4));
        var orig_titles = [];

        if (object.movie.alternative_titles && object.movie.alternative_titles.results) {
          orig_titles = object.movie.alternative_titles.results.map(function (t) {
            return t.title;
          });
        }

        if (object.movie.original_title) orig_titles.push(object.movie.original_title);
        if (object.movie.original_name) orig_titles.push(object.movie.original_name);
        var url = embed + 'index.php?do=search';

        var display = function display(links) {
          if (links && links.length && links.forEach) {
            var is_sure = false;
            var items = links.map(function (l) {
              var article = $(l);
              var link = $('.card__title>a', article);
              var titl = link.text().trim() || '';
              var orig_span = $('.card__title>.pmovie__original-title', article);
              var orig_title = orig_span.text().trim() || '';
              var year_link = $('.card__desc span:contains("Год выпуска:")+a', article);
              var year = parseInt(year_link.text().trim() || '');
              return {
                year: year,
                title: titl,
                orig_title: orig_title,
                link: link.attr('href') || ''
              };
            });
            var cards = items;

            if (cards.length) {
              if (orig_titles.length) {
                var tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.orig_title, c.title], orig_titles);
                });

                if (tmp.length) {
                  cards = tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.title, c.orig_title], [select_title]);
                });

                if (_tmp.length) {
                  cards = _tmp;
                  is_sure = true;
                }
              }

              if (cards.length > 1 && search_year) {
                var _tmp2 = cards.filter(function (c) {
                  return c.year == search_year;
                });

                if (!_tmp2.length) _tmp2 = cards.filter(function (c) {
                  return c.year && c.year > search_year - 2 && c.year < search_year + 2;
                });
                if (_tmp2.length) cards = _tmp2;
              }
            }

            if (cards.length == 1 && is_sure) {
              if (search_year && cards[0].year) {
                is_sure = cards[0].year > search_year - 2 && cards[0].year < search_year + 2;
              }

              if (is_sure) {
                is_sure = false;

                if (orig_titles.length) {
                  is_sure |= component.equalAnyTitle([cards[0].orig_title, cards[0].title], orig_titles);
                }

                if (select_title) {
                  is_sure |= component.equalAnyTitle([cards[0].title, cards[0].orig_title], [select_title]);
                }
              }
            }

            if (cards.length == 1 && is_sure) getPage(cards[0]);else if (items.length) {
              _this.wait_similars = true;
              items.forEach(function (c) {
                c.is_similars = true;
              });
              component.similars(items);
              component.loading(false);
            } else component.emptyForQuery(select_title);
          } else component.emptyForQuery(select_title);
        };

        var query_search = function query_search(query, data, callback) {
          var postdata = 'do=search';
          postdata += '&subaction=search';
          postdata += '&search_start=0';
          postdata += '&full_search=0';
          postdata += '&result_from=1';
          postdata += '&story=' + encodeURIComponent(query);
          network.clear();
          network.timeout(10000);
          network["native"](component.proxyLink(url, prox), function (str) {
            str = (str || '').replace(/\n/g, '');
            var links = str.match(/<article class="card d-flex">.*?<\/article>/g);
            if (links && links.length) data = data.concat(links);
            if (callback) callback(data);
          }, function (a, c) {
            component.empty(network.errorDecode(a, c));
          }, postdata, {
            dataType: 'text'
          });
        };

        var query_title_search = function query_title_search() {
          query_search(component.cleanTitle(select_title), [], function (data) {
            if (data && data.length && data.forEach) display(data);else display([]);
          });
        };

        if (!object.clarification && (object.movie.imdb_id || +object.movie.kinopoisk_id)) {
          query_search('+' + (object.movie.imdb_id || +object.movie.kinopoisk_id), [], function (data) {
            if (data && data.length && data.forEach) display(data);else if (object.movie.imdb_id && +object.movie.kinopoisk_id) {
              query_search('+' + +object.movie.kinopoisk_id, [], function (data) {
                if (data && data.length && data.forEach) display(data);else query_title_search();
              });
            } else query_title_search();
          });
        } else query_title_search();
      };

      function getPage(card) {
        page_title = card.title || card.orig_title || select_title;
        var url = component.fixLink(card.link, ref);
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(url, prox), function (str) {
          str = (str || '').replace(/\n/g, '');
          var player = str.match(/<div [^>]*id="visearch"[^>]*>[^<]*<iframe data-src="((https?:\/\/embed\.new\.video[^"\/]*)\/[^"]*)"/);
          var player_link = player && player[1];

          if (!player_link) {
            var find = str.match(/\.create\('player',\s*({.*?})\s*\)/);
            var json;

            try {
              json = find && (0, eval)('"use strict"; (function(){ return ' + find[1] + '; })();');
            } catch (e) {}

            player_link = json && json.url;
          }

          if (player_link) {
            network.clear();
            network.timeout(10000);
            network["native"](component.proxyLink(player_link, prox, prox_enc), function (str) {
              parse(str);
            }, function (a, c) {
              component.empty(network.errorDecode(a, c));
            }, false, {
              dataType: 'text',
              headers: headers
            });
          } else component.emptyForQuery(select_title);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        }, false, {
          dataType: 'text'
        });
      }

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function parse(str, url) {
        component.loading(false);
        str = (str || '').replace(/\n/g, '');
        var find = str.match(/var playerOptions = ({.*?});/);
        var json;

        try {
          json = find && (0, eval)('"use strict"; (function(){ return ' + find[1] + '; })();');
        } catch (e) {}

        if (json && json.playlist && json.playlist.forEach) {
          extract = json.playlist;
          filter();
          append(filtred());
        } else component.emptyForQuery(select_title);
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: [],
          voice: []
        };
        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];
        extract.forEach(function (data) {
          var file = data.sources && (prefer_dash && data.sources.shakadash && data.sources.shakadash.src || data.sources.hls && data.sources.hls.src) || '';
          filtred.push({
            title: data.title || data.comment || select_title,
            quality: '360p ~ 1080p',
            info: '',
            file: file
          });
        });
        return filtred;
      }
      /**
       * Найти поток
       * @param {Object} element
       * @returns string
       */


      function getFile(element) {
        return {
          file: element.file,
          quality: false,
          subtitles: false
        };
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        items.forEach(function (element) {
          var hash = Lampa.Utils.hash(object.movie.original_title + page_title + element.title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(object.movie.original_title + page_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            var extra = getFile(element);

            if (extra.file) {
              var playlist = [];
              var first = {
                url: component.getDefaultQuality(extra.quality, extra.file),
                quality: component.renameQualityMap(extra.quality),
                subtitles: extra.subtitles,
                timeline: element.timeline,
                title: items.length > 1 ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (items.length > 1) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: component.getDefaultQuality(ex.quality, ex.file),
                    quality: component.renameQualityMap(ex.quality),
                    subtitles: ex.subtitles,
                    timeline: elem.timeline,
                    title: elem.title
                  });
                });
              } else {
                playlist.push(first);
              }

              if (playlist.length > 1) first.playlist = playlist;
              Lampa.Player.play(first);
              Lampa.Player.playlist(playlist);

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            } else Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            file: function file(call) {
              call(getFile(element));
            }
          });
        });
        component.start(true);
      }
    }

    function cdnvideohub(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prox = component.proxy('cdnvideohub');
      var embed = atob('aHR0cHM6Ly9wbGFwaS5jZG52aWRlb2h1Yi5jb20vYXBpL3YxL3BsYXllci9zdi8=');
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };
      /**
       * Начать поиск
       * @param {Object} _object
       * @param {String} kinopoisk_id
       */

      this.search = function (_object, kinopoisk_id) {
        object = _object;
        select_title = object.search || object.movie.title;

        if (isNaN(kinopoisk_id)) {
          component.emptyForQuery(select_title);
          return;
        }

        var url = Lampa.Utils.addUrlComponent(embed + atob('cGxheWxpc3Q/cHViPTEyJmFnZ3I9a3A='), 'id=' + kinopoisk_id);
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(url, prox), function (json) {
          parse(json);
        }, function (a, c) {
          if (a.status == 500 && !a.responseText || a.status == 0 && a.statusText !== 'timeout') {
            parse(null);
          } else component.empty(network.errorDecode(a, c));
        });
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: ''
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function parse(json) {
        component.loading(false);

        if (json && json.items && json.items.forEach) {
          var seasons = [];
          var items = json.items;
          items.sort(function (a, b) {
            var cmp = (a.season || 0) - (b.season || 0);
            if (cmp) return cmp;
            cmp = (a.episode || 0) - (b.episode || 0);
            if (cmp) return cmp;
            if ((a.voiceStudio || a.voiceType || '') > (b.voiceStudio || b.voiceType || '')) return 1;
            if ((a.voiceStudio || a.voiceType || '') < (b.voiceStudio || b.voiceType || '')) return -1;
            cmp = (a.vkId || 0) - (b.vkId || 0);
            return cmp;
          });
          items.forEach(function (data) {
            if (data.season != null) {
              var s = seasons.filter(function (s) {
                return s.id === data.season;
              })[0];

              if (!s) {
                s = {
                  id: data.season,
                  title: Lampa.Lang.translate('torrent_serial_season') + ' ' + data.season,
                  voices: []
                };
                seasons.push(s);
              }

              var voice = data.voiceStudio || data.voiceType || '';
              if (s.voices.indexOf(voice) == -1) s.voices.push(voice);
            }
          });
          extract = {
            title_name: json.title_name || select_title,
            items: items,
            seasons: seasons
          };
          filter();
          append(filtred());
        } else component.emptyForQuery(select_title);
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: extract.seasons.map(function (s) {
            return s.title;
          }),
          voice: []
        };
        if (!filter_items.season[choice.season]) choice.season = 0;
        var s = extract.seasons[choice.season];
        if (s) filter_items.voice = s.voices;
        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];

        if (extract.seasons.length) {
          var season_id = extract.seasons[choice.season] && extract.seasons[choice.season].id;
          extract.items.forEach(function (data) {
            var voice = data.voiceStudio || data.voiceType || '';

            if (data.season == season_id && voice == filter_items.voice[choice.voice]) {
              filtred.push({
                title: component.formatEpisodeTitle(season_id, data.episode),
                quality: '360p ~ 1080p',
                info: ' / ' + Lampa.Utils.shortText(voice, 50) + (data.vkId ? ' / id: ' + data.vkId : ''),
                data_id: data.vkId,
                season: '' + season_id,
                episode: data.episode,
                media: data
              });
            }
          });
        } else {
          extract.items.forEach(function (data) {
            filtred.push({
              title: data.voiceStudio || data.voiceType || extract.title_name,
              quality: '360p ~ 1080p',
              info: data.vkId ? ' / id: ' + data.vkId : '',
              data_id: data.vkId,
              media: data
            });
          });
        }

        return filtred;
      }
      /**
       * Получить потоки
       * @param {String} str
       * @returns array
       */


      function extractItems(sources) {
        if (!sources) return [];
        var items = [];
        /* 4K и 2K перепутаны */

        if (sources.mpeg2kUrl) {
          items.push({
            label: '4K',
            quality: 2160,
            file: sources.mpeg2kUrl
          });
        }

        if (sources.mpeg4kUrl) {
          items.push({
            label: '2K',
            quality: 1440,
            file: sources.mpeg4kUrl
          });
        }

        if (sources.mpegQhdUrl) {
          items.push({
            label: '1440p',
            quality: 1440,
            file: sources.mpegQhdUrl
          });
        }

        if (sources.mpegFullHdUrl) {
          items.push({
            label: '1080p',
            quality: 1080,
            file: sources.mpegFullHdUrl
          });
        }

        if (sources.mpegHighUrl) {
          items.push({
            label: '720p',
            quality: 720,
            file: sources.mpegHighUrl
          });
        }

        if (sources.mpegMediumUrl) {
          items.push({
            label: '480p',
            quality: 480,
            file: sources.mpegMediumUrl
          });
        }

        if (sources.mpegLowUrl) {
          items.push({
            label: '360p',
            quality: 360,
            file: sources.mpegLowUrl
          });
        }

        if (sources.mpegLowestUrl) {
          items.push({
            label: '240p',
            quality: 240,
            file: sources.mpegLowestUrl
          });
        }

        if (sources.mpegTinyUrl) {
          items.push({
            label: '144p',
            quality: 144,
            file: sources.mpegTinyUrl
          });
        }

        if (!items.length && sources.hlsUrl) {
          items.push({
            label: 'HLS',
            quality: NaN,
            file: sources.hlsUrl
          });
        }

        items.forEach(function (item) {
          item.file = component.fixLinkProtocol(item.file, prefer_http, true);
        });
        return items;
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStream(element, call, error) {
        if (element.stream) return call(element);
        if (!element.data_id) return error();
        var url = embed + 'video/' + element.data_id;
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(url, prox), function (json) {
          if (json && json.sources) {
            var file = '',
                quality = false;
            var items = extractItems(json.sources);

            if (items && items.length) {
              file = items[0].file;
              quality = {};
              items.forEach(function (item) {
                quality[item.label] = item.file;
              });
            }

            if (file) {
              element.stream = file;
              element.qualitys = quality;
              call(element);
            } else error();
          } else error();
        }, function (a, c) {
          error();
        });
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        items.forEach(function (element) {
          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.data_id);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (element.loading) return;
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            element.loading = true;
            getStream(element, function (element) {
              element.loading = false;
              var first = {
                url: component.getDefaultQuality(element.qualitys, element.stream),
                quality: component.renameQualityMap(element.qualitys),
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };
              Lampa.Player.play(first);

              if (element.season && Lampa.Platform.version) {
                var playlist = [];
                items.forEach(function (elem) {
                  if (elem == element) {
                    playlist.push(first);
                  } else {
                    var cell = {
                      url: function url(call) {
                        getStream(elem, function (elem) {
                          cell.url = component.getDefaultQuality(elem.qualitys, elem.stream);
                          cell.quality = component.renameQualityMap(elem.qualitys);
                          call();
                        }, function () {
                          cell.url = '';
                          call();
                        });
                      },
                      timeline: elem.timeline,
                      title: elem.title
                    };
                    playlist.push(cell);
                  }
                });
                Lampa.Player.playlist(playlist);
              } else {
                Lampa.Player.playlist([first]);
              }

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            }, function () {
              element.loading = false;
              Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
            });
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            file: function file(call) {
              getStream(element, function (element) {
                call({
                  file: element.stream,
                  quality: element.qualitys
                });
              }, function () {
                Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
              });
            }
          });
        });
        component.start(true);
      }
    }

    function anilibria(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prox = component.proxy('anilibria');
      var embed = 'https://api.anilibria.tv/v3/';
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0
      };
      /**
       * Поиск
       * @param {Object} _object
       */

      this.search = function (_object, kinopoisk_id, data) {
        var _this = this;

        object = _object;
        select_title = object.search || object.movie.title;
        if (this.wait_similars && data && data[0].is_similars) return getRelease(data[0]);
        var search_year = object.search_date;
        var orig_titles = [];

        if (object.movie.alternative_titles && object.movie.alternative_titles.results) {
          orig_titles = object.movie.alternative_titles.results.map(function (t) {
            return t.title;
          });
        }

        if (object.movie.original_title) orig_titles.push(object.movie.original_title);
        if (object.movie.original_name) orig_titles.push(object.movie.original_name);

        var display = function display(items) {
          if (items && items.length && items.forEach) {
            var is_sure = false;
            items.forEach(function (c) {
              c.ru_title = c.names && c.names.ru;
              c.en_title = c.names && c.names.en;
              c.alt_title = c.names && c.names.alternative;
              c.year = c.season && c.season.year && parseInt(c.season.year) || 0;
            });
            var cards = items;

            if (cards.length) {
              if (orig_titles.length) {
                var tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.en_title, c.ru_title, c.alt_title], orig_titles);
                });

                if (tmp.length) {
                  cards = tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.ru_title, c.en_title, c.alt_title], [select_title]);
                });

                if (_tmp.length) {
                  cards = _tmp;
                  is_sure = true;
                }
              }

              if (cards.length > 1 && search_year) {
                var _tmp2 = cards.filter(function (c) {
                  return c.year == search_year;
                });

                if (!_tmp2.length) _tmp2 = cards.filter(function (c) {
                  return c.year && c.year > search_year - 2 && c.year < search_year + 2;
                });
                if (_tmp2.length) cards = _tmp2;
              }
            }

            if (cards.length == 1 && is_sure) {
              if (search_year && cards[0].year) {
                is_sure = cards[0].year > search_year - 2 && cards[0].year < search_year + 2;
              }

              if (is_sure) {
                is_sure = false;

                if (orig_titles.length) {
                  is_sure |= component.equalAnyTitle([cards[0].en_title, cards[0].ru_title, cards[0].alt_title], orig_titles);
                }

                if (select_title) {
                  is_sure |= component.equalAnyTitle([cards[0].ru_title, cards[0].en_title, cards[0].alt_title], [select_title]);
                }
              }
            }

            if (cards.length == 1 && is_sure) {
              getRelease(cards[0]);
            } else {
              _this.wait_similars = true;
              items.forEach(function (c) {
                c.is_similars = true;

                if (!(c.type && c.type.string === 'MOVIE')) {
                  c.episodes_count = c.player && c.player.episodes && c.player.episodes.last;
                }
              });
              component.similars(items);
              component.loading(false);
            }
          } else component.emptyForQuery(select_title);
        };

        var url = embed + 'title/search';
        url = Lampa.Utils.addUrlComponent(url, 'filter=names,season,type,player');
        url = Lampa.Utils.addUrlComponent(url, 'limit=20');
        url = Lampa.Utils.addUrlComponent(url, 'search=' + encodeURIComponent(select_title));
        network.clear();
        network.timeout(1000 * 30);
        network.silent(component.proxyLink(url, prox), function (json) {
          display(json && json.list);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        });
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function getRelease(json) {
        if (json.player && json.player.host && json.player.list && Object.keys(json.player.list).length) {
          success(json);
        } else {
          component.emptyForQuery(select_title);
          Lampa.Noty.show(Lampa.Lang.translate('online_mod_blockedlink_copyright'));
        }
      }

      function success(json) {
        component.loading(false);
        extract = json;
        filter();
        append(filtred());
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: [],
          voice: []
        };
        component.filter(filter_items, choice);
      }
      /**
       * Получить потоки
       * @param {String} host
       * @param {Object} hls
       * @returns array
       */


      function extractItems(host, hls) {
        var items = [];

        if (hls) {
          if (hls.fhd) {
            items.push({
              label: '1080p',
              quality: 1080,
              file: host + hls.fhd
            });
          }

          if (hls.hd) {
            items.push({
              label: '720p',
              quality: 720,
              file: host + hls.hd
            });
          }

          if (hls.sd) {
            items.push({
              label: '480p',
              quality: 480,
              file: host + hls.sd
            });
          }
        }

        return items;
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];

        if (extract.player && extract.player.host && extract.player.list && Object.keys(extract.player.list).length) {
          var host = 'https://' + extract.player.host;

          if (extract.type && extract.type.string === 'MOVIE' && Object.keys(extract.player.list).length === 1) {
            for (var ID in extract.player.list) {
              var episode = extract.player.list[ID];
              var items = extractItems(host, episode.hls);
              filtred.push({
                title: extract.ru_title || extract.en_title || select_title,
                orig_title: extract.en_title || extract.ru_title || select_title,
                quality: items[0] ? items[0].label : '360p ~ 1080p',
                info: '',
                media: items
              });
            }
          } else {
            for (var _ID in extract.player.list) {
              var _episode = extract.player.list[_ID];

              var _items = extractItems(host, _episode.hls);

              filtred.push({
                title: component.formatEpisodeTitle(null, _episode.episode, _episode.name),
                orig_title: extract.en_title || extract.ru_title || select_title,
                quality: _items[0] ? _items[0].label : '360p ~ 1080p',
                info: '',
                season: 1,
                episode: _episode.episode,
                media: _items
              });
            }
          }
        }

        return filtred;
      }
      /**
       * Найти поток
       * @param {Object} element
       * @returns string
       */


      function getFile(element) {
        var file = '';
        var quality = false;
        var items = element.media;

        if (items && items.length) {
          file = items[0].file;
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = item.file;
          });
        }

        return {
          file: file,
          quality: quality
        };
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        items.forEach(function (element) {
          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.orig_title].join('') : object.movie.original_title + element.orig_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.orig_title].join('') : object.movie.original_title + element.orig_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            var extra = getFile(element);

            if (extra.file) {
              var playlist = [];
              var first = {
                url: component.getDefaultQuality(extra.quality, extra.file),
                quality: component.renameQualityMap(extra.quality),
                timeline: element.timeline,
                title: element.title
              };

              if (element.season) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: component.getDefaultQuality(ex.quality, ex.file),
                    quality: component.renameQualityMap(ex.quality),
                    timeline: elem.timeline,
                    title: elem.title
                  });
                });
              } else {
                playlist.push(first);
              }

              if (playlist.length > 1) first.playlist = playlist;
              Lampa.Player.play(first);
              Lampa.Player.playlist(playlist);

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            } else Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            file: function file(call) {
              call(getFile(element));
            }
          });
        });
        component.start(true);
      }
    }

    function anilibria2(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prox = component.proxy('anilibria2');
      var embed = 'https://api.anilibria.app/api/v1/';
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0
      };
      /**
       * Поиск
       * @param {Object} _object
       */

      this.search = function (_object, kinopoisk_id, data) {
        var _this = this;

        object = _object;
        select_title = object.search || object.movie.title;
        if (this.wait_similars && data && data[0].is_similars) return getRelease(data[0]);
        var search_year = object.search_date;
        var orig_titles = [];

        if (object.movie.alternative_titles && object.movie.alternative_titles.results) {
          orig_titles = object.movie.alternative_titles.results.map(function (t) {
            return t.title;
          });
        }

        if (object.movie.original_title) orig_titles.push(object.movie.original_title);
        if (object.movie.original_name) orig_titles.push(object.movie.original_name);

        var display = function display(items) {
          if (items && items.length && items.forEach) {
            var is_sure = false;
            items.forEach(function (c) {
              c.ru_title = c.name && c.name.main;
              c.en_title = c.name && c.name.english;
              c.alt_title = c.name && c.name.alternative;
            });
            var cards = items;

            if (cards.length) {
              if (orig_titles.length) {
                var tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.en_title, c.ru_title, c.alt_title], orig_titles);
                });

                if (tmp.length) {
                  cards = tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.ru_title, c.en_title, c.alt_title], [select_title]);
                });

                if (_tmp.length) {
                  cards = _tmp;
                  is_sure = true;
                }
              }

              if (cards.length > 1 && search_year) {
                var _tmp2 = cards.filter(function (c) {
                  return c.year == search_year;
                });

                if (!_tmp2.length) _tmp2 = cards.filter(function (c) {
                  return c.year && c.year > search_year - 2 && c.year < search_year + 2;
                });
                if (_tmp2.length) cards = _tmp2;
              }
            }

            if (cards.length == 1 && is_sure) {
              if (search_year && cards[0].year) {
                is_sure = cards[0].year > search_year - 2 && cards[0].year < search_year + 2;
              }

              if (is_sure) {
                is_sure = false;

                if (orig_titles.length) {
                  is_sure |= component.equalAnyTitle([cards[0].en_title, cards[0].ru_title, cards[0].alt_title], orig_titles);
                }

                if (select_title) {
                  is_sure |= component.equalAnyTitle([cards[0].ru_title, cards[0].en_title, cards[0].alt_title], [select_title]);
                }
              }
            }

            if (cards.length == 1 && is_sure) {
              getRelease(cards[0]);
            } else {
              _this.wait_similars = true;
              items.forEach(function (c) {
                c.is_similars = true;

                if (!(c.type && c.type.value === 'MOVIE')) {
                  c.episodes_count = c.episodes_total;
                }
              });
              component.similars(items);
              component.loading(false);
            }
          } else component.emptyForQuery(select_title);
        };

        var url = embed + 'app/search/releases';
        url = Lampa.Utils.addUrlComponent(url, 'query=' + encodeURIComponent(select_title));
        network.clear();
        network.timeout(1000 * 15);
        network.silent(component.proxyLink(url, prox), function (json) {
          display(json);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        });
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function getRelease(json) {
        var url = embed + 'anime/releases/' + json.id;
        network.clear();
        network.timeout(1000 * 15);
        network.silent(component.proxyLink(url, prox), function (json) {
          if (json && json.episodes && json.episodes.length) {
            json.ru_title = json.name && json.name.main;
            json.en_title = json.name && json.name.english;
            json.alt_title = json.name && json.name.alternative;
            success(json);
          } else component.emptyForQuery(select_title);

          if (json && json.is_blocked_by_copyrights) Lampa.Noty.show(Lampa.Lang.translate('online_mod_blockedlink_copyright'));else if (json && json.is_blocked_by_geo) Lampa.Noty.show(Lampa.Lang.translate('online_mod_blockedlink'));
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        });
      }

      function success(json) {
        component.loading(false);
        extract = json;
        filter();
        append(filtred());
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: [],
          voice: []
        };
        component.filter(filter_items, choice);
      }
      /**
       * Получить потоки
       * @param {String} host
       * @param {Object} hls
       * @returns array
       */


      function extractItems(episode) {
        var items = [];

        if (episode.hls_1080) {
          items.push({
            label: '1080p',
            quality: 1080,
            file: episode.hls_1080
          });
        }

        if (episode.hls_720) {
          items.push({
            label: '720p',
            quality: 720,
            file: episode.hls_720
          });
        }

        if (episode.hls_480) {
          items.push({
            label: '480p',
            quality: 480,
            file: episode.hls_480
          });
        }

        return items;
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];

        if (extract.episodes && extract.episodes.length) {
          if (extract.type && extract.type.value === 'MOVIE' && extract.episodes.length === 1) {
            extract.episodes.forEach(function (episode) {
              var items = extractItems(episode);
              filtred.push({
                title: extract.ru_title || extract.en_title || select_title,
                orig_title: extract.en_title || extract.ru_title || select_title,
                quality: items[0] ? items[0].label : '360p ~ 1080p',
                info: '',
                media: items
              });
            });
          } else {
            extract.episodes.forEach(function (episode) {
              var items = extractItems(episode);
              filtred.push({
                title: component.formatEpisodeTitle(null, episode.ordinal, episode.name),
                orig_title: extract.en_title || extract.ru_title || select_title,
                quality: items[0] ? items[0].label : '360p ~ 1080p',
                info: '',
                season: 1,
                episode: episode.ordinal,
                media: items
              });
            });
          }
        }

        return filtred;
      }
      /**
       * Найти поток
       * @param {Object} element
       * @returns string
       */


      function getFile(element) {
        var file = '';
        var quality = false;
        var items = element.media;

        if (items && items.length) {
          file = items[0].file;
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = item.file;
          });
        }

        return {
          file: file,
          quality: quality
        };
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        items.forEach(function (element) {
          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.orig_title].join('') : object.movie.original_title + element.orig_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.orig_title].join('') : object.movie.original_title + element.orig_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            var extra = getFile(element);

            if (extra.file) {
              var playlist = [];
              var first = {
                url: component.getDefaultQuality(extra.quality, extra.file),
                quality: component.renameQualityMap(extra.quality),
                timeline: element.timeline,
                title: element.title
              };

              if (element.season) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: component.getDefaultQuality(ex.quality, ex.file),
                    quality: component.renameQualityMap(ex.quality),
                    timeline: elem.timeline,
                    title: elem.title
                  });
                });
              } else {
                playlist.push(first);
              }

              if (playlist.length > 1) first.playlist = playlist;
              Lampa.Player.play(first);
              Lampa.Player.playlist(playlist);

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            } else Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            file: function file(call) {
              call(getFile(element));
            }
          });
        });
        component.start(true);
      }
    }

    function animelib(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prox = component.proxy('animelib');
      var host = 'https://anilib.me';
      var ref = host + '/';
      var user_agent = Utils.baseUserAgent();
      var embed = 'https://api2.mangalib.me/api/';
      var prox_enc = '';

      if (prox) {
        prox_enc += 'param/Origin=' + encodeURIComponent(host) + '/';
        prox_enc += 'param/Referer=' + encodeURIComponent(ref) + '/';
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
      }

      var servers = [{
        name: 'Основной',
        url: 'https://video1.anilib.me/.%D0%B0s/'
      }, {
        name: 'Резервный 1',
        url: 'https://video2.anilib.me/.%D0%B0s/'
      }, {
        name: 'Резервный 2',
        url: 'https://video3.anilib.me/.%D0%B0s/'
      }];
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: '',
        server: 0
      };
      /**
       * Поиск
       * @param {Object} _object
       */

      this.search = function (_object, kinopoisk_id, data) {
        var _this = this;

        object = _object;
        select_title = object.search || object.movie.title;
        if (this.wait_similars && data && data[0].is_similars) return getEpisodes(data[0]);
        var search_year = object.search_date;
        var orig_titles = [];

        if (object.movie.alternative_titles && object.movie.alternative_titles.results) {
          orig_titles = object.movie.alternative_titles.results.map(function (t) {
            return t.title;
          });
        }

        if (object.movie.original_title) orig_titles.push(object.movie.original_title);
        if (object.movie.original_name) orig_titles.push(object.movie.original_name);

        var display = function display(items) {
          if (items && items.length && items.forEach) {
            var is_sure = false;
            items.forEach(function (c) {
              c.orig_title = c.name;
              c.ru_title = c.rus_name;
              c.en_title = c.eng_name;
              var year = c.releaseDate || '0000';
              c.year = parseInt((year + '').slice(0, 4));
            });
            var cards = items;

            if (cards.length) {
              if (orig_titles.length) {
                var tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.orig_title, c.en_title, c.ru_title], orig_titles);
                });

                if (tmp.length) {
                  cards = tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.ru_title, c.en_title, c.orig_title], [select_title]);
                });

                if (_tmp.length) {
                  cards = _tmp;
                  is_sure = true;
                }
              }

              if (cards.length > 1 && search_year) {
                var _tmp2 = cards.filter(function (c) {
                  return c.year == search_year;
                });

                if (!_tmp2.length) _tmp2 = cards.filter(function (c) {
                  return c.year && c.year > search_year - 2 && c.year < search_year + 2;
                });
                if (_tmp2.length) cards = _tmp2;
              }
            }

            if (cards.length == 1 && is_sure) {
              if (search_year && cards[0].year) {
                is_sure = cards[0].year > search_year - 2 && cards[0].year < search_year + 2;
              }

              if (is_sure) {
                is_sure = false;

                if (orig_titles.length) {
                  is_sure |= component.equalAnyTitle([cards[0].orig_title, cards[0].en_title, cards[0].ru_title], orig_titles);
                }

                if (select_title) {
                  is_sure |= component.equalAnyTitle([cards[0].ru_title, cards[0].en_title, cards[0].orig_title], [select_title]);
                }
              }
            }

            if (cards.length == 1 && is_sure) {
              getEpisodes(cards[0]);
            } else {
              _this.wait_similars = true;
              items.forEach(function (c) {
                c.is_similars = true;
              });
              component.similars(items);
              component.loading(false);
            }
          } else component.emptyForQuery(select_title);
        };

        var url = embed + 'anime?fields[]=rate_avg&fields[]=rate&fields[]=releaseDate';
        url = Lampa.Utils.addUrlComponent(url, 'q=' + encodeURIComponent(select_title));
        network.clear();
        network.timeout(1000 * 15);
        network.silent(component.proxyLink(url, prox, prox_enc), function (json) {
          display(json && json.data);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        });
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: '',
          server: 0
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function getEpisodes(json) {
        var url = embed + 'episodes';
        url = Lampa.Utils.addUrlComponent(url, 'anime_id=' + encodeURIComponent(json.slug_url));
        network.clear();
        network.timeout(1000 * 15);
        network.silent(component.proxyLink(url, prox, prox_enc), function (episodes) {
          if (episodes && episodes.data && episodes.data.length) {
            json.episodes = episodes.data;
            getPlayers(json.episodes[0], function () {
              if (json.episodes[0].players && json.episodes[0].players.length) success(json);else component.emptyForQuery(select_title);
            });
          } else component.emptyForQuery(select_title);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        });
      }

      function getPlayers(episode, callback) {
        if (episode.players) {
          callback();
          return;
        }

        var url = embed + 'episodes/' + episode.id;
        network.clear();
        network.timeout(1000 * 15);
        network.silent(component.proxyLink(url, prox, prox_enc), function (json) {
          if (json && json.data && json.data.players) {
            episode.players = json.data.players.filter(function (p) {
              return p.player === 'Animelib';
            });
          }

          callback();
        }, function (a, c) {
          callback();
        });
      }

      function success(json) {
        component.loading(false);
        extract = json;
        extract.is_film = extract.episodes && extract.episodes.length === 1 && extract.type && ['Фильм', 'Неизвестный'].indexOf(extract.type.label) !== -1;
        filter();
        append(filtred());
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: [],
          voice: [],
          voice_info: [],
          server: servers.map(function (s) {
            return s.name;
          })
        };

        if (!extract.is_film) {
          extract.episodes.forEach(function (e) {
            if (e.players) {
              e.players.forEach(function (p) {
                if (p.team && !filter_items.voice_info.some(function (v) {
                  return v.id == p.team.id;
                })) {
                  filter_items.voice.push(p.team.name);
                  filter_items.voice_info.push(p.team);
                }
              });
            }
          });
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Получить потоки
       * @param {Object} player
       * @returns array
       */


      function extractItems(player) {
        try {
          var items = [];

          if (player && player.video && player.video.quality) {
            var server = servers[choice.server] || servers[0];
            items = player.video.quality.map(function (q) {
              return {
                label: q.quality ? q.quality + 'p' : '360p ~ 1080p',
                quality: q.quality,
                file: q.href ? component.proxyLink(server.url + q.href, prox, prox_enc) : ''
              };
            });
            items.sort(function (a, b) {
              if (b.quality > a.quality) return 1;
              if (b.quality < a.quality) return -1;
              if (b.label > a.label) return 1;
              if (b.label < a.label) return -1;
              return 0;
            });
          }

          return items;
        } catch (e) {}

        return [];
      }

      function extractSubs(player) {
        try {
          var subtitles = [];

          if (player && player.subtitles) {
            subtitles = player.subtitles.map(function (item) {
              return {
                label: item.format || item.filename || '',
                url: component.processSubs(item.src || '')
              };
            });
          }

          return subtitles.length ? subtitles : false;
        } catch (e) {}

        return false;
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];
        var server = servers[choice.server] || servers[0];

        if (extract.episodes) {
          if (extract.is_film) {
            extract.episodes.forEach(function (episode) {
              if (episode.players) {
                episode.players.forEach(function (player) {
                  var voice_name = player && player.team && player.team.name || '';
                  var voice_id = player && player.team && player.team.id || null;
                  var items = extractItems(player);
                  filtred.push({
                    title: voice_name || extract.ru_title || extract.en_title || extract.orig_title || select_title,
                    orig_title: extract.orig_title || extract.en_title || extract.ru_title || select_title,
                    quality: items[0] ? items[0].label : '???',
                    info: ' / ' + server.name,
                    media: {
                      episode: episode,
                      player: player,
                      voice_id: voice_id
                    }
                  });
                });
              }
            });
          } else {
            var voice_id = filter_items.voice_info[choice.voice] && filter_items.voice_info[choice.voice].id;
            extract.episodes.forEach(function (episode) {
              var player = null;

              if (episode.players && episode.players.length) {
                player = episode.players.filter(function (p) {
                  return p.team && p.team.id == voice_id;
                })[0] || episode.players[0];
              }

              var voice_name = player && player.team && player.team.name || '???';
              var items = extractItems(player);
              filtred.push({
                title: component.formatEpisodeTitle(null, episode.item_number, episode.name),
                orig_title: extract.orig_title || extract.en_title || extract.ru_title || select_title,
                quality: items[0] ? items[0].label : '???',
                info: ' / ' + voice_name + ' / ' + server.name,
                season: 1,
                episode: episode.item_number,
                media: {
                  episode: episode,
                  player: player,
                  voice_id: voice_id
                }
              });
            });
          }
        }

        return filtred;
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStream(element, call, error) {
        if (element.stream) return call(element);
        var episode = element.media.episode;
        var old_player = element.media.player;
        getPlayers(episode, function () {
          var player = element.media.player;

          if (!player) {
            var voice_id = element.media.voice_id;

            if (episode.players && episode.players.length) {
              player = episode.players.filter(function (p) {
                return p.team && p.team.id == voice_id;
              })[0] || episode.players[0];
            }
          }

          var items = extractItems(player);
          var file = '';
          var quality = false;

          if (items && items.length) {
            file = items[0].file;
            quality = {};
            items.forEach(function (item) {
              quality[item.label] = item.file;
            });
          }

          if (!old_player && player) {
            var voice_name = player && player.team && player.team.name || '???';
            var server = servers[choice.server] || servers[0];
            element.quality = items[0] ? items[0].label : '???';
            element.info = ' / ' + voice_name + ' / ' + server.name;
            var dst = element.template && element.template.find('.online__quality');

            if (dst && dst.length) {
              var src = Lampa.Template.get('online_mod', element).find('.online__quality');

              if (src && src.length) {
                if (Lampa.Timeline.details) {
                  src.append(Lampa.Timeline.details(element.timeline, ' / '));
                }

                dst[0].innerHTML = src[0].innerHTML;
              }
            }
          }

          if (file) {
            element.stream = file;
            element.qualitys = quality;
            element.subtitles = extractSubs(player);
            call(element);
          } else error();
        });
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.orig_title].join('') : object.movie.original_title + element.orig_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.orig_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.orig_title + element.title);
          element.timeline = view;
          element.template = item;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (element.loading) return;
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            element.loading = true;
            getStream(element, function (element) {
              element.loading = false;
              var first = {
                url: component.getDefaultQuality(element.qualitys, element.stream),
                quality: component.renameQualityMap(element.qualitys),
                subtitles: element.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };
              Lampa.Player.play(first);

              if (element.season && Lampa.Platform.version) {
                var playlist = [];
                items.forEach(function (elem) {
                  if (elem == element) {
                    playlist.push(first);
                  } else {
                    var cell = {
                      url: function url(call) {
                        getStream(elem, function (elem) {
                          cell.url = component.getDefaultQuality(elem.qualitys, elem.stream);
                          cell.quality = component.renameQualityMap(elem.qualitys);
                          cell.subtitles = elem.subtitles;
                          call();
                        }, function () {
                          cell.url = '';
                          call();
                        });
                      },
                      timeline: elem.timeline,
                      title: elem.title
                    };
                    playlist.push(cell);
                  }
                });
                Lampa.Player.playlist(playlist);
              } else {
                Lampa.Player.playlist([first]);
              }

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            }, function () {
              element.loading = false;
              Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
            });
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              getStream(element, function (element) {
                call({
                  file: element.stream,
                  quality: element.qualitys
                });
              }, function () {
                Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
              });
            }
          });
        });
        component.start(true);
      }
    }

    function kodik(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prefer_mp4 = false;
      var prox = component.proxy('kodik');
      var embed = 'https://kodikapi.com/search';
      var token = atob('NDVjNTM1NzhmMTFlY2ZiNzRlMzEyNjdiNjM0Y2M2YTg=');
      var last_player = '';
      var last_info = '';
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };

      function kodik_api_search(api, callback, error) {
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(embed + api, prox), function (json) {
          if (callback) callback(json);
        }, function (a, c) {
          if (error) error(network.errorDecode(a, c));
        });
      }
      /**
       * Поиск
       * @param {Object} _object
       */


      this.search = function (_object, kinopoisk_id, data) {
        var _this = this;

        object = _object;
        select_title = object.search || object.movie.title;
        if (this.wait_similars && data && data[0].is_similars) return success(data[0]);
        var search_year = object.search_date;
        var orig_titles = [];

        if (object.movie.alternative_titles && object.movie.alternative_titles.results) {
          orig_titles = object.movie.alternative_titles.results.map(function (t) {
            return t.title;
          });
        }

        if (object.movie.original_title) orig_titles.push(object.movie.original_title);
        if (object.movie.original_name) orig_titles.push(object.movie.original_name);

        var display = function display(results, empty) {
          if (results && results.length && results.forEach) {
            var is_sure = false;
            var is_imdb = false;
            var elements = {};
            results.forEach(function (c) {
              var id;
              if (c.shikimori_id) id = 'sm_' + c.shikimori_id;else if (c.worldart_link) id = 'wa_' + c.worldart_link;else if (c.kinopoisk_id) id = 'kp_' + c.kinopoisk_id;else if (c.imdb_id) id = 'im_' + c.imdb_id;else if (c.id) id = 'k_' + c.id;else id = '';
              if (!id) return;
              id += c.title;
              var list = elements[id] || [];
              list.push(c);
              elements[id] = list;
            });
            var items = [];

            for (var ID in elements) {
              var list = elements[ID];
              items.push({
                title: list[0].title,
                orig_title: list[0].title_orig,
                other_title: list[0].other_title,
                year: list[0].year,
                kinopoisk_id: list[0].kinopoisk_id,
                imdb_id: list[0].imdb_id,
                episodes_count: list[0].episodes_count,
                media: list[0]
              });
            }

            if (!object.clarification && (object.movie.imdb_id || +kinopoisk_id)) {
              var imdb_id = object.movie.imdb_id;
              var kp_id = +kinopoisk_id;
              var tmp = items.filter(function (c) {
                return imdb_id && c.imdb_id == imdb_id || kp_id && c.kinopoisk_id == kp_id;
              });

              if (tmp.length) {
                items = tmp;
                is_sure = true;
                is_imdb = true;
              }
            }

            var cards = items;

            if (cards.length) {
              if (orig_titles.length) {
                var _tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.orig_title, c.title, c.other_title], orig_titles);
                });

                if (_tmp.length) {
                  cards = _tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp2 = cards.filter(function (c) {
                  return component.containsAnyTitle([c.title, c.orig_title, c.other_title], [select_title]);
                });

                if (_tmp2.length) {
                  cards = _tmp2;
                  is_sure = true;
                }
              }

              if (!is_sure) cards = [];
              items = cards;

              if (cards.length > 1 && search_year) {
                var _tmp3 = cards.filter(function (c) {
                  return c.year == search_year;
                });

                if (!_tmp3.length) _tmp3 = cards.filter(function (c) {
                  return c.year && c.year > search_year - 2 && c.year < search_year + 2;
                });
                if (_tmp3.length) cards = _tmp3;
              }
            }

            if (cards.length == 1 && is_sure && !is_imdb) {
              if (search_year && cards[0].year) {
                is_sure = cards[0].year > search_year - 2 && cards[0].year < search_year + 2;
              }

              if (is_sure) {
                is_sure = false;

                if (orig_titles.length) {
                  is_sure |= component.equalAnyTitle([cards[0].orig_title, cards[0].title, cards[0].other_title], orig_titles);
                }

                if (select_title) {
                  is_sure |= component.equalAnyTitle([cards[0].title, cards[0].orig_title, cards[0].other_title], [select_title]);
                }
              }
            }

            if (cards.length == 1 && is_sure) {
              success(cards[0]);
            } else if (items.length) {
              _this.wait_similars = true;
              items.forEach(function (c) {
                c.is_similars = true;
              });
              component.similars(items);
              component.loading(false);
            } else empty();
          } else empty();
        };

        var kodik_search_by_title = function kodik_search_by_title(callback, error) {
          var params = Lampa.Utils.addUrlComponent('', 'token=' + token);
          params = Lampa.Utils.addUrlComponent(params, 'limit=100');
          params = Lampa.Utils.addUrlComponent(params, 'translation_type=voice');
          params = Lampa.Utils.addUrlComponent(params, 'title=' + encodeURIComponent(select_title));
          kodik_api_search(params, callback, error);
        };

        var kodik_search_by_title_part = function kodik_search_by_title_part(callback, error) {
          var params = Lampa.Utils.addUrlComponent('', 'token=' + token);
          params = Lampa.Utils.addUrlComponent(params, 'limit=100');
          params = Lampa.Utils.addUrlComponent(params, 'translation_type=voice');
          var words = component.cleanTitle(select_title || '').replace(/[\s—\-+]+/g, ' ').trim().split(' ');
          words.sort(function (a, b) {
            return b.length - a.length;
          });
          var title = words.splice(0, 1).join(' ');

          if (title !== select_title) {
            params = Lampa.Utils.addUrlComponent(params, 'title=' + encodeURIComponent(title));
            kodik_api_search(params, callback, error);
          } else callback({});
        };

        var kodik_search_by_id = function kodik_search_by_id(callback, error) {
          if (!object.clarification && (object.movie.imdb_id || +kinopoisk_id)) {
            var params = Lampa.Utils.addUrlComponent('', 'token=' + token);
            params = Lampa.Utils.addUrlComponent(params, 'limit=100');
            var kp_params = +kinopoisk_id ? Lampa.Utils.addUrlComponent(params, 'kinopoisk_id=' + encodeURIComponent(+kinopoisk_id)) : '';
            var imdb_params = object.movie.imdb_id ? Lampa.Utils.addUrlComponent(params, 'imdb_id=' + encodeURIComponent(object.movie.imdb_id)) : '';
            kodik_api_search(kp_params || imdb_params, function (json) {
              if (json.results && json.results.length) callback(json);else if (kp_params && imdb_params) {
                kodik_api_search(imdb_params, callback, error);
              } else callback({});
            }, error);
          } else callback({});
        };

        var error = component.empty.bind(component);
        kodik_search_by_id(function (json) {
          display(json && json.results, function () {
            kodik_search_by_title_part(function (json) {
              display(json && json.results, function () {
                kodik_search_by_title(function (json) {
                  display(json && json.results, function () {
                    component.emptyForQuery(select_title);
                  });
                }, error);
              });
            }, error);
          });
        }, error);
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: ''
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function success(json) {
        var media = json.media || {};
        var params = Lampa.Utils.addUrlComponent('', 'token=' + token);
        params = Lampa.Utils.addUrlComponent(params, 'limit=100');
        params = Lampa.Utils.addUrlComponent(params, 'with_episodes=true');
        if (media.shikimori_id) params = Lampa.Utils.addUrlComponent(params, 'shikimori_id=' + encodeURIComponent(media.shikimori_id));else if (media.worldart_link) params = Lampa.Utils.addUrlComponent(params, 'worldart_link=' + encodeURIComponent(media.worldart_link));else if (media.kinopoisk_id) params = Lampa.Utils.addUrlComponent(params, 'kinopoisk_id=' + encodeURIComponent(media.kinopoisk_id));else if (media.imdb_id) params = Lampa.Utils.addUrlComponent(params, 'imdb_id=' + encodeURIComponent(media.imdb_id));else if (media.id) params = Lampa.Utils.addUrlComponent(params, 'id=' + encodeURIComponent(media.id));else {
          component.emptyForQuery(select_title);
          return;
        }
        var error = component.empty.bind(component);
        kodik_api_search(params, function (json) {
          component.loading(false);
          extractData(json && json.results ? json.results.filter(function (c) {
            return c.title === media.title;
          }) : []);
          filter();
          append(filtred());
        }, error);
      }
      /**
       * Получить данные о фильме
       * @param {Array} items
       */


      function extractData(items) {
        var seasons = [];
        items.forEach(function (c) {
          if (c.seasons) {
            var _loop = function _loop(season_id) {
              var season = c.seasons[season_id];

              if (season) {
                if (!seasons.some(function (s) {
                  return s.id === season_id;
                })) {
                  seasons.push({
                    id: season_id,
                    title: Lampa.Lang.translate('torrent_serial_season') + ' ' + season_id + (season.title ? ' - ' + season.title : '')
                  });
                }
              }
            };

            for (var season_id in c.seasons) {
              _loop(season_id);
            }
          }
        });
        seasons.sort(function (a, b) {
          return a.id - b.id;
        });
        extract = {
          items: items,
          seasons: seasons
        };
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: extract.seasons.map(function (s) {
            return s.title;
          }),
          voice: [],
          voice_info: []
        };
        if (!filter_items.season[choice.season]) choice.season = 0;

        if (extract.seasons.length) {
          var season_id = extract.seasons[choice.season] && extract.seasons[choice.season].id;
          extract.items.forEach(function (c) {
            if (!(c.seasons && c.seasons[season_id])) return;

            if (c.translation && !filter_items.voice_info.some(function (v) {
              return v.id == c.translation.id;
            })) {
              filter_items.voice.push(c.translation.title);
              filter_items.voice_info.push(c.translation);
            }
          });
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];

        if (extract.seasons.length) {
          var season_id = extract.seasons[choice.season] && extract.seasons[choice.season].id;
          var voice_name = filter_items.voice[choice.voice];
          var voice_id = filter_items.voice_info[choice.voice] && filter_items.voice_info[choice.voice].id;
          var translation = extract.items.filter(function (c) {
            return c.seasons && c.seasons[season_id] && c.translation && c.translation.id == voice_id;
          })[0];

          if (translation) {
            var episodes = translation.seasons[season_id] && translation.seasons[season_id].episodes || {};

            for (var episode_id in episodes) {
              var link = episodes[episode_id];
              filtred.push({
                title: component.formatEpisodeTitle(season_id, episode_id),
                orig_title: translation.title_orig || translation.title || select_title,
                quality: translation.quality || '360p ~ 1080p',
                info: ' / ' + voice_name,
                season: '' + season_id,
                episode: parseInt(episode_id),
                link: link
              });
            }
          }
        } else {
          extract.items.forEach(function (c) {
            if (c.seasons) return;
            filtred.push({
              title: c.translation && c.translation.title || select_title,
              orig_title: c.title_orig || c.title || select_title,
              quality: c.quality || '360p ~ 1080p',
              info: '',
              link: c.link
            });
          });
        }

        return filtred;
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getStream(element, call, error) {
        if (element.stream) return call(element);
        if (!element.link) return error();
        var link_match = element.link.match(/^(\/\/[^\/]+)\/.*$/);
        var link_origin = (prefer_http ? 'http:' : 'https:') + (link_match ? link_match[1] : '//kodik.info');
        var url = component.fixLinkProtocol(element.link, prefer_http);
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(url, prox), function (str) {
          str = (str || '').replace(/\n/g, '');
          var urlParams = str.match(/\burlParams = '([^']+)'/);
          var type = str.match(/\bvideoInfo\.type = '([^']+)'/);
          var hash = str.match(/\bvideoInfo\.hash = '([^']+)'/);
          var id = str.match(/\bvideoInfo\.id = '([^']+)'/);
          var player = str.match(/<script [^>]*\bsrc="(\/assets\/js\/app\.player_single[^"]+)"/);
          var json;

          try {
            json = urlParams && urlParams[1] && JSON.parse(urlParams[1]);
          } catch (e) {}

          var postdata = '';

          if (json && type && hash && id) {
            postdata = 'd=' + json.d;
            postdata += '&d_sign=' + json.d_sign;
            postdata += '&pd=' + json.pd;
            postdata += '&pd_sign=' + json.pd_sign;
            postdata += '&ref=' + json.ref;
            postdata += '&ref_sign=' + json.ref_sign;
            postdata += '&bad_user=true';
            postdata += '&cdn_is_working=true';
            postdata += '&type=' + type[1];
            postdata += '&hash=' + hash[1];
            postdata += '&id=' + id[1];
            postdata += '&info=%7B%7D';
          }

          if (postdata && player) {
            var getLinks = function getLinks() {
              network.clear();
              network.timeout(10000);
              network["native"](component.proxyLink(last_info, prox), function (json) {
                if (json && json.links) {
                  var items = extractItems(json.links),
                      file = '',
                      quality = false;

                  if (items && items.length) {
                    file = items[0].file;
                    quality = {};
                    items.forEach(function (item) {
                      quality[item.label] = item.file;
                    });
                  }

                  if (file) {
                    element.stream = file;
                    element.qualitys = quality;
                    call(element);
                  } else error();
                } else error();
              }, function (a, c) {
                error();
              }, postdata);
            };

            var player_url = link_origin + player[1];

            if (player_url !== last_player) {
              network.clear();
              network.timeout(10000);
              network["native"](component.proxyLink(player_url, prox), function (str) {
                str = (str || '').replace(/\n/g, '');
                var info_match = str.match(/\$\.ajax\({type: *"POST", *url: *atob\("([^"]+)"\)/);
                var info;

                try {
                  info = info_match && atob(info_match[1]);
                } catch (e) {}

                if (info && startsWith(info, '/')) {
                  last_info = link_origin + info;
                  last_player = player_url;
                  getLinks();
                } else error();
              }, function (a, c) {
                error();
              }, false, {
                dataType: 'text'
              });
            } else getLinks();
          } else error();
        }, function (a, c) {
          error();
        }, false, {
          dataType: 'text'
        });
      }

      function extractItems(playlists) {
        try {
          var items = [];
          Object.keys(playlists).forEach(function (key) {
            var obj = playlists[key];
            var quality = parseInt(key);
            var link = decode(obj && obj[0] && obj[0].src || '');
            link = component.fixLinkProtocol(link, prefer_http, true);
            if (prefer_mp4) ;
            items.push({
              label: quality ? quality + 'p' : '360p ~ 1080p',
              quality: quality,
              file: component.proxyStream(link, 'kodik')
            });
          });
          items.sort(function (a, b) {
            if (b.quality > a.quality) return 1;
            if (b.quality < a.quality) return -1;
            if (b.label > a.label) return 1;
            if (b.label < a.label) return -1;
            return 0;
          });
          return items;
        } catch (e) {}

        return [];
      }

      function decode(str) {
        try {
          if (startsWith(str, 'http') || startsWith(str, '//')) return str;
          return atob(str.replace(/[a-zA-Z]/g, function (x) {
            return String.fromCharCode((x <= 'Z' ? 90 : 122) >= (x = x.charCodeAt(0) + 18) ? x : x - 26);
          }));
        } catch (e) {
          return '';
        }
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = filter_items.voice[choice.voice];
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.orig_title].join('') : object.movie.original_title + element.orig_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.orig_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.orig_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (element.loading) return;
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            element.loading = true;
            getStream(element, function (element) {
              element.loading = false;
              var first = {
                url: component.getDefaultQuality(element.qualitys, element.stream),
                quality: component.renameQualityMap(element.qualitys),
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };
              Lampa.Player.play(first);

              if (element.season && Lampa.Platform.version) {
                var playlist = [];
                items.forEach(function (elem) {
                  if (elem == element) {
                    playlist.push(first);
                  } else {
                    var cell = {
                      url: function url(call) {
                        getStream(elem, function (elem) {
                          cell.url = component.getDefaultQuality(elem.qualitys, elem.stream);
                          cell.quality = component.renameQualityMap(elem.qualitys);
                          call();
                        }, function () {
                          cell.url = '';
                          call();
                        });
                      },
                      timeline: elem.timeline,
                      title: elem.title
                    };
                    playlist.push(cell);
                  }
                });
                Lampa.Player.playlist(playlist);
              } else {
                Lampa.Player.playlist([first]);
              }

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            }, function () {
              element.loading = false;
              Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
            });
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              getStream(element, function (element) {
                call({
                  file: element.stream,
                  quality: element.qualitys
                });
              }, function () {
                Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
              });
            }
          });
        });
        component.start(true);
      }
    }

    function kinopub(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prox = component.proxy('kinopub');
      var embed = 'https://api.srvkp.com/v1/';
      var token = Utils.decodeSecret([67, 95, 84, 2, 68, 91, 64, 68, 13, 80, 80, 84, 0, 12, 67, 66, 0, 14, 81, 95, 92, 70, 65, 93, 15, 92, 87, 64, 6, 70, 7, 2]);
      var server = 'ru';
      var hls_type = 'hls';
      var replace_mask = /\/(pd|http|hls4|hls2|hls)\/[^\/]*/;
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };
      var secret = '';

      function decodeSecretToken(callback) {
        {
          if (callback) callback();
          return;
        }
      }

      function kinopub_api_search(api, callback, error) {
        network.clear();
        network.timeout(10000);
        network["native"](component.proxyLink(embed + api, prox), function (json) {
          if (callback) callback(json);
        }, function (a, c) {
          if (error) error(network.errorDecode(a, c));
        });
      }
      /**
       * Поиск
       * @param {Object} _object
       */


      this.search = function (_object, kinopoisk_id, data) {
        var _this = this;

        object = _object;
        select_title = object.search || object.movie.title;
        if (this.wait_similars && data && data[0].is_similars) return success(data[0]);
        var search_date = object.search_date || !object.clarification && (object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date) || '0000';
        var search_year = parseInt((search_date + '').slice(0, 4));
        var orig_titles = [];

        if (object.movie.alternative_titles && object.movie.alternative_titles.results) {
          orig_titles = object.movie.alternative_titles.results.map(function (t) {
            return t.title;
          });
        }

        if (object.movie.original_title) orig_titles.push(object.movie.original_title);
        if (object.movie.original_name) orig_titles.push(object.movie.original_name);

        var display = function display(items) {
          if (items && items.length && items.forEach) {
            var is_sure = false;
            var is_imdb = false;
            items.forEach(function (c) {
              var titles = (c.title || '').split(' / ');

              if (titles.length === 2) {
                c.full_title = c.title;
                c.title = titles[0].trim();
                c.orig_title = titles[1].trim();
              }
            });

            if (!object.clarification && (object.movie.imdb_id || +object.movie.kinopoisk_id)) {
              var imdb_id = object.movie.imdb_id && parseInt(object.movie.imdb_id.substring(2));
              var kp_id = +object.movie.kinopoisk_id;
              var tmp = items.filter(function (c) {
                return imdb_id && c.imdb == imdb_id || kp_id && c.kinopoisk == kp_id;
              });

              if (tmp.length) {
                items = tmp;
                is_sure = true;
                is_imdb = true;
              }
            }

            var cards = items;

            if (cards.length) {
              if (orig_titles.length) {
                var _tmp = cards.filter(function (c) {
                  return component.containsAnyTitle([c.orig_title, c.title, c.full_title], orig_titles);
                });

                if (_tmp.length) {
                  cards = _tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp2 = cards.filter(function (c) {
                  return component.containsAnyTitle([c.title, c.orig_title, c.full_title], [select_title]);
                });

                if (_tmp2.length) {
                  cards = _tmp2;
                  is_sure = true;
                }
              }

              if (cards.length > 1 && search_year) {
                var _tmp3 = cards.filter(function (c) {
                  return c.year == search_year;
                });

                if (!_tmp3.length) _tmp3 = cards.filter(function (c) {
                  return c.year && c.year > search_year - 2 && c.year < search_year + 2;
                });
                if (_tmp3.length) cards = _tmp3;
              }
            }

            if (cards.length == 1 && is_sure && !is_imdb) {
              if (search_year && cards[0].year) {
                is_sure = cards[0].year > search_year - 2 && cards[0].year < search_year + 2;
              }

              if (is_sure) {
                is_sure = false;

                if (orig_titles.length) {
                  is_sure |= component.equalAnyTitle([cards[0].orig_title, cards[0].title, cards[0].full_title], orig_titles);
                }

                if (select_title) {
                  is_sure |= component.equalAnyTitle([cards[0].title, cards[0].orig_title, cards[0].full_title], [select_title]);
                }
              }
            }

            if (cards.length == 1 && is_sure) {
              success(cards[0]);
            } else {
              _this.wait_similars = true;
              items.forEach(function (c) {
                c.is_similars = true;
              });
              component.similars(items);
              component.loading(false);
            }
          } else component.emptyForQuery(select_title);
        };

        var error = component.empty.bind(component);
        var params = Lampa.Utils.addUrlComponent('items/search', 'access_token=' + token);
        params = Lampa.Utils.addUrlComponent(params, 'perpage=100');
        params = Lampa.Utils.addUrlComponent(params, 'field=title');
        params = Lampa.Utils.addUrlComponent(params, 'q=' + encodeURIComponent(select_title));
        decodeSecretToken(function () {
          kinopub_api_search(params, function (json) {
            display(json && json.items);
          }, error);
        });
      };

      this.extendChoice = function (saved) {
        Lampa.Arrays.extend(choice, saved, true);
      };
      /**
       * Сброс фильтра
       */


      this.reset = function () {
        component.reset();
        choice = {
          season: 0,
          voice: 0,
          voice_name: ''
        };
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Применить фильтр
       * @param {*} type
       * @param {*} a
       * @param {*} b
       */


      this.filter = function (type, a, b) {
        choice[a.stype] = b.index;
        if (a.stype == 'voice') choice.voice_name = filter_items.voice[b.index];
        component.reset();
        filter();
        append(filtred());
        component.saveChoice(choice);
      };
      /**
       * Уничтожить
       */


      this.destroy = function () {
        network.clear();
        extract = null;
      };

      function success(item) {
        var params = Lampa.Utils.addUrlComponent('items/' + item.id, 'access_token=' + token);
        var error = component.empty.bind(component);
        kinopub_api_search(params, function (json) {
          if (json && json.item && (json.item.videos && json.item.videos.length || json.item.seasons && json.item.seasons.length)) {
            component.loading(false);
            extractData(json.item);
            filter();
            append(filtred());
          } else component.emptyForQuery(select_title);
        }, error);
      }
      /**
       * Получить информацию о фильме
       * @param {Object} item
       */


      function extractData(item) {
        extract = item;

        if (extract.seasons) {
          extract.seasons.forEach(function (season) {
            var episodes = season.episodes || [];
            episodes.forEach(function (episode) {
              episode.streams = extractFiles(episode);
            });
          });
        } else if (extract.videos) {
          extract.videos.forEach(function (video) {
            video.streams = extractFiles(video);
          });
        }
      }

      function extractFiles(media) {
        var items = [];
        var files = media.files || [];
        files.forEach(function (file) {
          var label = file.quality || file.h && file.h + 'p' || '360p ~ 1080p';

          if (file.url) {
            var subtitles = false;

            if (file.url.http && file.file) {
              var base = file.url.http.match(/^(.*)\/demo\/demo\.mp4(.*)$/);

              if (!base) {
                var pos = file.url.http.indexOf((startsWith(file.file, '/') ? '' : '/') + file.file);
                if (pos !== -1) base = [file.url.http, file.url.http.substring(0, pos)];
              }

              if (base) {
                var base_url = base[1];

                if (replace_mask && secret) {
                  base_url = base_url.replace(replace_mask, secret);
                }

                base_url = component.fixLinkProtocol(base_url, prefer_http, 'full');

                if (media.subtitles) {
                  subtitles = media.subtitles.map(function (sub) {
                    return {
                      label: sub.lang + (sub.forced ? ' - forced' : ''),
                      url: component.processSubs(sub.file ? base_url + '/subtitles' + (startsWith(sub.file, '/') ? '' : '/') + sub.file + '?loc=' + server : '')
                    };
                  });
                  if (!subtitles.length) subtitles = false;
                }

                items.push({
                  height: file.h,
                  quality_id: file.quality_id,
                  label: label,
                  codec: file.codec,
                  type: 'http',
                  params: base[2],
                  file: base_url + (startsWith(file.file, '/') ? '' : '/') + file.file,
                  subtitles: subtitles
                });
              }
            }

            if (file.url.hls4) {
              var _base = file.url.hls4.match(/^(.*)\/demo\.m3u8(.*)$/);

              if (!_base) {
                var _pos = file.url.hls4.indexOf('/' + media.id + '.m3u8');

                if (_pos !== -1) _base = [file.url.hls4, file.url.hls4.substring(0, _pos)];
              }

              if (_base) {
                var _base_url = _base[1];

                if (replace_mask && secret) {
                  _base_url = _base_url.replace(replace_mask, secret);
                }

                _base_url = component.fixLinkProtocol(_base_url, prefer_http, 'full');
                items.push({
                  height: file.h,
                  quality_id: file.quality_id,
                  label: label,
                  codec: file.codec,
                  type: 'hls4',
                  params: _base[2],
                  file: _base_url + '/' + media.id + '.m3u8',
                  subtitles: subtitles
                });
              }
            }

            if (file.url.hls2) {
              var _base2 = file.url.hls2.match(/^(.*)\/demo\.m3u8(.*)$/);

              if (!_base2) {
                var _pos2 = file.url.hls2.indexOf('/' + media.id + '.m3u8');

                if (_pos2 !== -1) _base2 = [file.url.hls2, file.url.hls2.substring(0, _pos2)];
              }

              if (_base2) {
                var _base_url2 = _base2[1];

                if (replace_mask && secret) {
                  _base_url2 = _base_url2.replace(replace_mask, secret);
                }

                _base_url2 = component.fixLinkProtocol(_base_url2, prefer_http, 'full');
                items.push({
                  height: file.h,
                  quality_id: file.quality_id,
                  label: label,
                  codec: file.codec,
                  type: 'hls2',
                  params: _base2[2],
                  file: _base_url2 + '/' + media.id + '.m3u8',
                  subtitles: subtitles
                });
              }
            }

            if (file.url.hls && file.file) {
              var _base3 = file.url.hls.match(/^(.*)\/demo\/master-v1a1\.m3u8(.*)$/);

              if (!_base3) {
                var _pos3 = file.url.hls.indexOf((startsWith(file.file, '/') ? '' : '/') + file.file);

                if (_pos3 !== -1) _base3 = [file.url.hls, file.url.hls.substring(0, _pos3)];
              }

              if (_base3) {
                var _base_url3 = _base3[1];

                if (replace_mask && secret) {
                  _base_url3 = _base_url3.replace(replace_mask, secret);
                }

                _base_url3 = component.fixLinkProtocol(_base_url3, prefer_http, 'full');
                items.push({
                  height: file.h,
                  quality_id: file.quality_id,
                  label: label,
                  codec: file.codec,
                  type: 'hls',
                  params: _base3[2],
                  file: _base_url3 + (startsWith(file.file, '/') ? '' : '/') + file.file,
                  subtitles: subtitles
                });
              }
            }
          }
        });
        items.sort(function (a, b) {
          var cmp = b.height - a.height;
          if (cmp) return cmp;
          cmp = b.quality_id - a.quality_id;
          if (cmp) return cmp;
          if (b.label > a.label) return 1;
          if (b.label < a.label) return -1;
          if (b.codec > a.codec) return 1;
          if (b.codec < a.codec) return -1;
          if (b.type > a.type) return 1;
          if (b.type < a.type) return -1;
          return 0;
        });
        return items;
      }

      function getVoiceName(audio, full) {
        var voice_name;

        if (full) {
          voice_name = [audio.type && audio.type.title, audio.author && audio.author.title].filter(function (name) {
            return name;
          }).join(' - ');
        } else {
          var type = audio.type && audio.type.title || '';
          voice_name = type === 'Оригинал' ? type : audio.author && audio.author.title || type;
        }

        if (voice_name) voice_name += audio.lang && audio.lang !== 'und' && audio.lang !== 'rus' ? ' (' + audio.lang + ')' : '';else voice_name = audio.lang || '';
        return voice_name;
      }

      function getVoiceChoice(audios, full) {
        var voice_info = filter_items.voice_info[choice.voice];

        if (voice_info) {
          var type = voice_info.type && voice_info.type.title || '';
          var author = !full && type === 'Оригинал' ? '' : voice_info.author && voice_info.author.title;
          var lang = voice_info.lang || '';

          if (author) {
            var tmp = audios.filter(function (audio) {
              return audio.author && audio.author.title === author;
            });
            if (tmp.length) audios = tmp;

            if (type && full) {
              tmp = tmp.filter(function (audio) {
                return audio.type && audio.type.title === type;
              });
              if (tmp.length) audios = tmp;
            }
          }

          if (lang) {
            var _tmp4 = audios.filter(function (audio) {
              return audio.lang === lang;
            });

            if (_tmp4.length) audios = _tmp4;
          }

          if (!author) {
            var _tmp5 = audios.filter(function (audio) {
              return !full && audio.type && audio.type.title === 'Оригинал' || !(audio.author && audio.author.title);
            });

            if (_tmp5.length) audios = _tmp5;

            if (type) {
              _tmp5 = _tmp5.filter(function (audio) {
                return audio.type && audio.type.title === type;
              });
              if (_tmp5.length) audios = _tmp5;
            }
          }
        }

        return audios.length == 1 ? audios[0] : null;
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: extract.seasons ? extract.seasons.map(function (season) {
            return Lampa.Lang.translate('torrent_serial_season') + ' ' + season.number + (season.title ? ' - ' + season.title : '');
          }) : [],
          voice: [],
          voice_info: []
        };
        if (!filter_items.season[choice.season]) choice.season = 0;

        if (extract.seasons || extract.videos && extract.videos.length > 1) {
          var episodes;

          if (extract.seasons) {
            var season = extract.seasons[choice.season];
            episodes = season && season.episodes || [];
          } else episodes = extract.videos;

          episodes.forEach(function (episode) {
            var audios = episode.audios || [];
            audios.forEach(function (audio) {
              var voice_name = getVoiceName(audio);

              if (voice_name && filter_items.voice.indexOf(voice_name) == -1) {
                filter_items.voice.push(voice_name);
                filter_items.voice_info.push(audio);
              }
            });
          });
        }

        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = filter_items.voice.indexOf(choice.voice_name);
          if (inx == -1) choice.voice = 0;else if (inx !== choice.voice) {
            choice.voice = inx;
          }
        }

        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];

        if (extract.seasons) {
          var season = extract.seasons[choice.season];
          var episodes = season && season.episodes || [];
          episodes.forEach(function (episode) {
            var audios = episode.audios || [];
            var audio = getVoiceChoice(audios);
            var voice_name;
            if (audio) voice_name = getVoiceName(audio);else {
              audio = {};
              var voice_names = audios.map(function (audio) {
                return getVoiceName(audio);
              }).filter(function (name) {
                return name;
              });
              voice_name = component.uniqueNamesShortText(voice_names, 80);
            }
            filtred.push({
              title: component.formatEpisodeTitle(season.number, episode.number, episode.title),
              orig_title: extract.title || select_title,
              quality: extract.quality ? extract.quality + 'p' : '360p ~ 1080p',
              info: voice_name ? ' / ' + voice_name : '',
              season: '' + season.number,
              episode: parseInt(episode.number),
              audio_index: audio.index,
              media: episode
            });
          });
        } else if (extract.videos && extract.videos.length > 1) {
          extract.videos.forEach(function (video, index) {
            var audios = video.audios || [];
            var audio = getVoiceChoice(audios);
            var voice_name;
            if (audio) voice_name = getVoiceName(audio);else {
              audio = {};
              var voice_names = audios.map(function (audio) {
                return getVoiceName(audio);
              }).filter(function (name) {
                return name;
              });
              voice_name = component.uniqueNamesShortText(voice_names, 80);
            }
            var episode_num = video.number != null ? video.number : index + 1;
            var title = episode_num + (video.title ? ' - ' + video.title : '');
            filtred.push({
              title: title,
              orig_title: extract.title || select_title,
              quality: extract.quality ? extract.quality + 'p' : '360p ~ 1080p',
              info: voice_name ? ' / ' + voice_name : '',
              season: 1,
              episode: parseInt(episode_num),
              audio_index: audio.index,
              media: video
            });
          });
        } else if (extract.videos) {
          extract.videos.forEach(function (video) {
            var audios = video.audios || [];

            if (!audios.length) {
              audios.push({});
            }

            audios.forEach(function (audio) {
              filtred.push({
                title: getVoiceName(audio, true) || video.title || select_title,
                orig_title: extract.title || select_title,
                quality: extract.quality ? extract.quality + 'p' : '360p ~ 1080p',
                info: audio.codec && audio.codec !== 'aac' ? ' / ' + audio.codec : '',
                audio_index: audio.index,
                media: video
              });
            });
          });
        }

        return filtred;
      }
      /**
       * Найти поток
       * @param {Object} element
       * @returns string
       */


      function getFile(element) {
        var file = '';
        var quality = false;
        var subtitles = false;
        var items = element.media.streams || [];
        items = items.filter(function (elem) {
          return elem.type === hls_type;
        });

        {
          var tmp = items.filter(function (elem) {
            return elem.codec === 'h265';
          });
          if (tmp.length) items = tmp;
        }

        {
          var _tmp6 = items.filter(function (elem) {
            return elem.codec === 'h264';
          });

          if (_tmp6.length) items = _tmp6;
        }

        if (items && items.length) {
          var file_end = items[0].type === 'hls' ? element.audio_index ? '/master-v1a' + element.audio_index + '.m3u8' : '/master.m3u8' : '';
          file_end += '?loc=' + server;
          file = items[0].file + file_end;
          subtitles = items[0].subtitles;

          if (items.some(function (item) {
            return item.file != items[0].file;
          })) {
            quality = {};
            items.forEach(function (item) {
              quality[item.label] = item.file + file_end;
            });
          }
        }

        return {
          file: file,
          quality: quality,
          subtitles: subtitles
        };
      }
      /**
       * Показать файлы
       */


      function append(items) {
        component.reset();
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        items.forEach(function (element) {
          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.orig_title].join('') : object.movie.original_title + element.orig_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.orig_title, filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.orig_title + element.title);
          element.timeline = view;
          item.append(Lampa.Timeline.render(view));

          if (Lampa.Timeline.details) {
            item.find('.online__quality').append(Lampa.Timeline.details(view, ' / '));
          }

          if (viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
          item.on('hover:enter', function () {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            var extra = getFile(element);

            if (extra.file) {
              var playlist = [];
              var first = {
                url: component.getDefaultQuality(extra.quality, extra.file),
                quality: component.renameQualityMap(extra.quality),
                subtitles: extra.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (element.season) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: component.getDefaultQuality(ex.quality, ex.file),
                    quality: component.renameQualityMap(ex.quality),
                    subtitles: ex.subtitles,
                    timeline: elem.timeline,
                    title: elem.title
                  });
                });
              } else {
                playlist.push(first);
              }

              if (playlist.length > 1) first.playlist = playlist;
              Lampa.Player.play(first);
              Lampa.Player.playlist(playlist);

              if (viewed.indexOf(hash_file) == -1) {
                viewed.push(hash_file);
                item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                Lampa.Storage.set('online_view', viewed);
              }
            } else Lampa.Noty.show(Lampa.Lang.translate('online_mod_nolink'));
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            file: function file(call) {
              call(getFile(element));
            }
          });
        });
        component.start(true);
      }
    }

    var proxyInitialized = {};
    var proxyWindow = {};
    var proxyCalls = {};
    var default_balanser = 'lumex2';

    function component(object) {
      var network = new Lampa.Reguest();
      var scroll = new Lampa.Scroll({
        mask: true,
        over: true
      });
      var files = new Lampa.Explorer(object);
      var filter = new Lampa.Filter(object);
      var balanser = Lampa.Storage.get('online_mod_balanser', default_balanser) + '';
      var last_bls = Lampa.Storage.field('online_mod_save_last_balanser') === true ? Lampa.Storage.cache('online_mod_last_balanser', 200, {}) : {};
      var use_stream_proxy = Lampa.Storage.field('online_mod_use_stream_proxy') === true;
      var rezka2_prx_ukr = '//' + (Lampa.Storage.field('online_mod_rezka2_prx_ukr') || 'prx.ukrtelcdn.net') + '/';
      var rezka2_fix_stream = Lampa.Storage.field('online_mod_rezka2_fix_stream') === true;
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var forcedQuality = '';
      var qualityFilter = {
        title: Lampa.Lang.translate('settings_player_quality'),
        subtitle: '',
        items: [],
        stype: 'quality'
      };
      var contextmenu_all = [];

      if (last_bls[object.movie.id]) {
        balanser = last_bls[object.movie.id];
      }

      this.proxy = function (name) {
        return Utils.proxy(name);
      };

      this.fixLink = function (link, referrer) {
        return Utils.fixLink(link, referrer);
      };

      this.fixLinkProtocol = function (link, prefer_http, replace_protocol) {
        return Utils.fixLinkProtocol(link, prefer_http, replace_protocol);
      };

      this.proxyLink = function (link, proxy, proxy_enc, enc) {
        return Utils.proxyLink(link, proxy, proxy_enc, enc);
      };

      this.proxyStream = function (url, name) {
        if (url && use_stream_proxy) {
          if (name === 'lumex') return url;

          if (name === 'rezka2') {
            return url.replace(/\/\/(stream\.voidboost\.(cc|top|link|club)|[^\/]*.ukrtelcdn.net|vdbmate.org|sambray.org|rumbegg.org|laptostack.org|frntroy.org|femeretes.org)\//, rezka2_prx_ukr);
          }

          return (prefer_http ? 'http://apn.cfhttp.top/' : 'https://apn.watch/') + url;
        }

        if (url && rezka2_fix_stream && name === 'rezka2') {
          return url.replace(/\/\/(stream\.voidboost\.(cc|top|link|club)|[^\/]*.ukrtelcdn.net)\//, '//femeretes.org/');
        }

        return url;
      };

      this.processSubs = function (url) {
        return url;
      };

      this.proxyStreamSubs = function (url, name) {
        if (name === 'lumex') return url;
        var srtUrl = this.processSubs(url);
        if (srtUrl !== url) return srtUrl;
        return this.proxyStream(url, name);
      };

      this.isDebug3 = function () {
        var res = false;
        var origin = window.location.origin || '';
        Utils.decodeSecret([65, 68, 92, 74, 91, 84, 25, 65, 65, 15, 93, 87, 88, 73, 95, 70, 95, 83, 28, 87, 82, 13, 87, 64, 90, 84, 90, 70, 83, 26, 94, 88, 89, 80, 88, 80], atob('cHJpc21pc2hl')).split(';').forEach(function (s) {
          res |= endsWith(origin, s);
        });
        return res;
      };

      this.checkMyIp = function (onComplite) {
        Utils.checkMyIp(network, onComplite);
      };

      var last;
      var extended;
      var selected_id;
      var filter_translate = {
        season: Lampa.Lang.translate('torrent_serial_season'),
        voice: Lampa.Lang.translate('torrent_parser_voice'),
        source: Lampa.Lang.translate('settings_rest_source')
      };
      var disable_dbg = !Utils.isDebug();
      var isAndroid = Lampa.Platform.is('android');
      isAndroid && Utils.checkAndroidVersion(339);
      var collapsBlocked = (!startsWith(window.location.protocol, 'http') || window.location.hostname.indexOf('lampa') !== -1) && disable_dbg;
      var all_sources = [{
        name: 'lumex',
        title: 'Lumex',
        source: new lumex(this, object),
        search: false,
        kp: false,
        imdb: true,
        disabled: disable_dbg
      }, {
        name: 'lumex2',
        title: 'Lumex (Ads)',
        source: new lumex2(this, object),
        search: false,
        kp: false,
        imdb: true,
        disabled: this.isDebug3()
      }, {
        name: 'rezka2',
        title: 'HDrezka',
        source: new rezka2(this, object),
        search: true,
        kp: false,
        imdb: false
      }, {
        name: 'kinobase',
        title: 'Kinobase',
        source: new kinobase(this, object),
        search: true,
        kp: false,
        imdb: false,
        disabled: disable_dbg
      }, {
        name: 'collaps',
        title: 'Collaps',
        source: new collaps(this, object, false),
        search: false,
        kp: true,
        imdb: true,
        disabled: collapsBlocked
      }, {
        name: 'collaps-dash',
        title: 'Collaps (DASH)',
        source: new collaps(this, object, true),
        search: false,
        kp: true,
        imdb: true,
        disabled: collapsBlocked
      }, {
        name: 'cdnmovies',
        title: 'CDNMovies',
        source: new cdnmovies(this, object),
        search: false,
        kp: true,
        imdb: true,
        disabled: disable_dbg
      }, {
        name: 'filmix',
        title: 'Filmix',
        source: new filmix(this, object),
        search: true,
        kp: false,
        imdb: false
      }, {
        name: 'zetflix',
        title: 'Zetflix',
        source: new zetflix(this, object),
        search: false,
        kp: true,
        imdb: false,
        disabled: disable_dbg
      }, {
        name: 'fancdn',
        title: 'FanCDN',
        source: new fancdn(this, object),
        search: true,
        kp: false,
        imdb: false,
        disabled: disable_dbg
      }, {
        name: 'fancdn2',
        title: 'FanCDN (ID)',
        source: new fancdn2(this, object),
        search: false,
        kp: true,
        imdb: true,
        disabled: disable_dbg
      }, {
        name: 'fanserials',
        title: 'FanSerials',
        source: new fanserials(this, object),
        search: false,
        kp: true,
        imdb: false,
        disabled: disable_dbg && !isAndroid
      }, {
        name: 'videoseed',
        title: 'VideoSeed',
        source: new videoseed(this, object),
        search: false,
        kp: true,
        imdb: true
      }, {
        name: 'vibix',
        title: 'Vibix',
        source: new vibix(this, object),
        search: false,
        kp: true,
        imdb: true
      }, {
        name: 'redheadsound',
        title: 'RedHeadSound',
        source: new redheadsound(this, object, false),
        search: true,
        kp: false,
        imdb: true
      }, {
        name: 'redheadsound-dash',
        title: 'RedHeadSound (DASH)',
        source: new redheadsound(this, object, true),
        search: true,
        kp: false,
        imdb: true,
        disabled: true
      }, {
        name: 'cdnvideohub',
        title: 'CDNVideoHub',
        source: new cdnvideohub(this, object),
        search: false,
        kp: true,
        imdb: false
      }, {
        name: 'anilibria',
        title: 'AniLibria',
        source: new anilibria(this, object),
        search: true,
        kp: false,
        imdb: false,
        disabled: true
      }, {
        name: 'anilibria2',
        title: 'AniLibria.top',
        source: new anilibria2(this, object),
        search: true,
        kp: false,
        imdb: false
      }, {
        name: 'animelib',
        title: 'AnimeLib',
        source: new animelib(this, object),
        search: true,
        kp: false,
        imdb: false,
        disabled: true
      }, {
        name: 'kodik',
        title: 'Kodik',
        source: new kodik(this, object),
        search: true,
        kp: true,
        imdb: true
      }, {
        name: 'alloha',
        title: 'Alloha',
        source: new alloha(this, object),
        search: false,
        kp: true,
        imdb: true,
        disabled: disable_dbg
      }, {
        name: 'kinopub',
        title: 'KinoPub',
        source: new kinopub(this, object),
        search: true,
        kp: false,
        imdb: true,
        disabled: true
      }];
      var obj_filter_sources = all_sources.filter(function (s) {
        return !s.disabled;
      });
      var filter_sources = obj_filter_sources.map(function (s) {
        return s.name;
      });
      var sources = {};
      obj_filter_sources.forEach(function (s) {
        sources[s.name] = s.source;
      });
      var search_sources = all_sources.filter(function (s) {
        return s.search;
      }).map(function (s) {
        return s.name;
      });
      var kp_sources = all_sources.filter(function (s) {
        return s.kp;
      }).map(function (s) {
        return s.name;
      });
      var imdb_sources = all_sources.filter(function (s) {
        return s.imdb;
      }).map(function (s) {
        return s.name;
      }); // шаловливые ручки

      if (filter_sources.indexOf(balanser) == -1) {
        balanser = default_balanser;

        if (filter_sources.indexOf(balanser) == -1) {
          balanser = filter_sources[0];
        }

        Lampa.Storage.set('online_mod_balanser', balanser);
      }

      scroll.body().addClass('torrent-list');
      scroll.minus(files.render().find('.explorer__files-head'));
      /**
       * Подготовка
       */

      this.create = function () {
        var _this = this;

        this.activity.loader(true);

        filter.onSearch = function (value) {
          Lampa.Activity.replace({
            search: value,
            search_date: '',
            clarification: true
          });
        };

        filter.onBack = function () {
          _this.start();
        };

        filter.onSelect = function (type, a, b) {
          if (type == 'filter') {
            if (a.reset) {
              if (extended) sources[balanser].reset();else _this.start();
            } else if (a.stype == 'source') {
              _this.changeBalanser(filter_sources[b.index]);
            } else if (a.stype == 'quality') {
              forcedQuality = b.title;

              _this.updateQualityFilter();
            } else {
              sources[balanser].filter(type, a, b);
            }
          } else if (type == 'sort') {
            _this.changeBalanser(a.source);
          }
        };

        filter.render().find('.filter--sort span').text(Lampa.Lang.translate('online_mod_balanser'));
        files.appendHead(filter.render());
        files.appendFiles(scroll.render());
        this.search();
        return this.render();
      };

      this.changeBalanser = function (balanser_name) {
        balanser = balanser_name;
        Lampa.Storage.set('online_mod_balanser', balanser);
        last_bls[object.movie.id] = balanser;

        if (Lampa.Storage.field('online_mod_save_last_balanser') === true) {
          Lampa.Storage.set('online_mod_last_balanser', last_bls);
        }

        this.search();
        setTimeout(this.closeFilter, 10);
      };

      this.updateQualityFilter = function () {
        var preferably = forcedQuality;

        if (!preferably) {
          preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
          if (preferably === '1080p') preferably = '1080p Ultra';
        }

        var items = ['2160p', '1440p', '1080p Ultra', '1080p', '720p', '480p'].map(function (quality, i) {
          return {
            title: quality,
            selected: quality === preferably,
            index: i
          };
        });
        qualityFilter.subtitle = preferably;
        qualityFilter.items = items;
        setTimeout(this.closeFilter, 10);
      };
      /**
       * Начать поиск
       */


      this.search = function () {
        this.activity.loader(true);
        this.filter({
          source: filter_sources
        }, {
          source: 0
        });
        this.reset();
        this.find();
      };

      this.cleanTitle = function (str) {
        return str.replace(/[\s.,:;’'`!?]+/g, ' ').trim();
      };

      this.kpCleanTitle = function (str) {
        return this.cleanTitle(str).replace(/^[ \/\\]+/, '').replace(/[ \/\\]+$/, '').replace(/\+( *[+\/\\])+/g, '+').replace(/([+\/\\] *)+\+/g, '+').replace(/( *[\/\\]+ *)+/g, '+');
      };

      this.normalizeTitle = function (str) {
        return this.cleanTitle(str.toLowerCase().replace(/[\-\u2010-\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D]+/g, '-').replace(/ё/g, 'е'));
      };

      this.equalTitle = function (t1, t2) {
        return typeof t1 === 'string' && typeof t2 === 'string' && this.normalizeTitle(t1) === this.normalizeTitle(t2);
      };

      this.containsTitle = function (str, title) {
        return typeof str === 'string' && typeof title === 'string' && this.normalizeTitle(str).indexOf(this.normalizeTitle(title)) !== -1;
      };

      this.equalAnyTitle = function (strings, titles) {
        var _this2 = this;

        return titles.some(function (title) {
          return title && strings.some(function (str) {
            return str && _this2.equalTitle(str, title);
          });
        });
      };

      this.containsAnyTitle = function (strings, titles) {
        var _this3 = this;

        return titles.some(function (title) {
          return title && strings.some(function (str) {
            return str && _this3.containsTitle(str, title);
          });
        });
      };

      this.uniqueNamesShortText = function (names, limit) {
        var unique = [];
        names.forEach(function (name) {
          if (name && unique.indexOf(name) == -1) unique.push(name);
        });

        if (limit && unique.length > 1) {
          var length = 0;
          var limit_index = -1;
          var last_index = unique.length - 1;
          unique.forEach(function (name, index) {
            length += name.length;
            if (limit_index == -1 && length > limit - (index == last_index ? 0 : 5)) limit_index = index;
            length += 2;
          });

          if (limit_index != -1) {
            unique = unique.splice(0, Math.max(limit_index, 1));
            unique.push('...');
          }
        }

        return unique.join(', ');
      };

      this.decodeHtml = function (html) {
        var text = document.createElement("textarea");
        text.innerHTML = html;
        return text.value;
      };

      this.vcdn_api_search = function (api, data, callback, error) {
        var prox = this.proxy('lumex');
        var url = 'https://portal.lumex.host/api/';
        network.clear();
        network.timeout(1000 * 20);
        network["native"](this.proxyLink(url + api, prox, '', 'enc2'), function (json) {
          if (json.data && json.data.length) data = data.concat(json.data);
          if (callback) callback(data);
        }, function (a, c) {
          if (a.status == 404 && a.responseJSON && a.responseJSON.result === false || a.status == 0 && a.statusText !== 'timeout') {
            if (callback) callback(data);
          } else if (error) error(network.errorDecode(a, c));
        });
      };

      this.kp_api_search = function (api, callback, error) {
        KP.clear();
        KP.getFromCache(api, function (json, cached) {
          var items = [];
          if (json.items && json.items.length) items = json.items;else if (json.films && json.films.length) items = json.films;
          if (!cached && items.length) KP.setCache(api, json);
          if (callback) callback(items);
        }, function (a, c) {
          if (error) error(network.errorDecode(a, c));
        });
      };

      this.find = function () {
        var _this4 = this;

        var query = object.search || object.movie.title;
        var search_date = object.search_date || !object.clarification && (object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date) || '0000';
        var search_year = parseInt((search_date + '').slice(0, 4));
        var orig_titles = [];

        if (object.movie.alternative_titles && object.movie.alternative_titles.results) {
          orig_titles = object.movie.alternative_titles.results.map(function (t) {
            return t.title;
          });
        }

        if (object.movie.original_title) orig_titles.push(object.movie.original_title);
        if (object.movie.original_name) orig_titles.push(object.movie.original_name);

        var display = function display(items) {
          if (items && items.length && items.forEach) {
            var is_sure = false;
            var is_imdb = false;
            items.forEach(function (c) {
              if (c.start_date === '1969-12-31') c.start_date = '';
              if (c.year === '1969-12-31') c.year = '';
              var year = c.start_date || c.year || '0000';
              c.tmp_year = parseInt((year + '').slice(0, 4));
            });

            if (!object.clarification && (object.movie.imdb_id || +object.movie.kinopoisk_id)) {
              var imdb_id = object.movie.imdb_id;
              var kp_id = +object.movie.kinopoisk_id;
              var tmp = items.filter(function (c) {
                return imdb_id && (c.imdb_id || c.imdbId) == imdb_id || kp_id && (c.kp_id || c.kinopoisk_id || c.kinopoiskId || c.filmId) == kp_id;
              });

              if (tmp.length) {
                items = tmp;
                is_sure = true;
                is_imdb = true;
              }
            }

            var cards = items;

            if (cards.length) {
              if (orig_titles.length) {
                var _tmp = cards.filter(function (c) {
                  return _this4.containsAnyTitle([c.orig_title || c.nameOriginal, c.en_title || c.nameEn, c.title || c.ru_title || c.nameRu], orig_titles);
                });

                if (_tmp.length) {
                  cards = _tmp;
                  is_sure = true;
                }
              }

              if (query) {
                var _tmp2 = cards.filter(function (c) {
                  return _this4.containsAnyTitle([c.title || c.ru_title || c.nameRu, c.en_title || c.nameEn, c.orig_title || c.nameOriginal], [query]);
                });

                if (_tmp2.length) {
                  cards = _tmp2;
                  is_sure = true;
                }
              }

              if (cards.length > 1 && search_year) {
                var _tmp3 = cards.filter(function (c) {
                  return c.tmp_year == search_year;
                });

                if (!_tmp3.length) _tmp3 = cards.filter(function (c) {
                  return c.tmp_year && c.tmp_year > search_year - 2 && c.tmp_year < search_year + 2;
                });
                if (_tmp3.length) cards = _tmp3;
              }
            }

            if (cards.length == 1 && is_sure && !is_imdb) {
              if (search_year && cards[0].tmp_year) {
                is_sure = cards[0].tmp_year > search_year - 2 && cards[0].tmp_year < search_year + 2;
              }

              if (is_sure) {
                is_sure = false;

                if (orig_titles.length) {
                  is_sure |= _this4.equalAnyTitle([cards[0].orig_title || cards[0].nameOriginal, cards[0].en_title || cards[0].nameEn, cards[0].title || cards[0].ru_title || cards[0].nameRu], orig_titles);
                }

                if (query) {
                  is_sure |= _this4.equalAnyTitle([cards[0].title || cards[0].ru_title || cards[0].nameRu, cards[0].en_title || cards[0].nameEn, cards[0].orig_title || cards[0].nameOriginal], [query]);
                }
              }
            }

            if (cards.length == 1 && is_sure) {
              _this4.extendChoice();

              sources[balanser].search(object, cards[0].kp_id || cards[0].kinopoisk_id || cards[0].kinopoiskId || cards[0].filmId || cards[0].imdb_id, cards);
            } else {
              items.forEach(function (c) {
                if (c.episodes) {
                  var season_count = 1;
                  c.episodes.forEach(function (episode) {
                    if (episode.season_num > season_count) {
                      season_count = episode.season_num;
                    }
                  });
                  c.seasons_count = season_count;
                  c.episodes_count = c.episodes.length;
                }
              });

              _this4.similars(items);

              _this4.loading(false);
            }
          } else _this4.emptyForQuery(query);
        };

        var vcdn_search_by_title = function vcdn_search_by_title(callback, error) {
          var params = Lampa.Utils.addUrlComponent('', Utils.vcdnToken());
          params = Lampa.Utils.addUrlComponent(params, 'query=' + encodeURIComponent(query));
          params = Lampa.Utils.addUrlComponent(params, 'field=title');

          _this4.vcdn_api_search('movies' + params, [], function (data) {
            _this4.vcdn_api_search('animes' + params, data, function (data) {
              _this4.vcdn_api_search('tv-series' + params, data, function (data) {
                _this4.vcdn_api_search('anime-tv-series' + params, data, function (data) {
                  _this4.vcdn_api_search('show-tv-series' + params, data, callback, error);
                }, error);
              }, error);
            }, error);
          }, error);
        };

        var vcdn_search_by_id = function vcdn_search_by_id(callback, error) {
          if (!object.clarification && (object.movie.imdb_id || +object.movie.kinopoisk_id)) {
            var params = Lampa.Utils.addUrlComponent('', Utils.vcdnToken());
            var imdb_params = object.movie.imdb_id ? Lampa.Utils.addUrlComponent(params, 'imdb_id=' + encodeURIComponent(object.movie.imdb_id)) : '';
            var kp_params = +object.movie.kinopoisk_id ? Lampa.Utils.addUrlComponent(params, 'kinopoisk_id=' + encodeURIComponent(+object.movie.kinopoisk_id)) : '';

            _this4.vcdn_api_search('short' + (imdb_params || kp_params), [], function (data) {
              if (data && data.length) callback(data);else if (imdb_params && kp_params) {
                _this4.vcdn_api_search('short' + kp_params, [], callback, error);
              } else callback([]);
            }, error);
          } else callback([]);
        };

        var vcdn_search = function vcdn_search(fallback) {
          var error = function error() {
            if (fallback) fallback();else display([]);
          };

          vcdn_search_by_id(function (data) {
            if (data && data.length && data.forEach) display(data);else vcdn_search_by_title(function (data) {
              if (data && data.length && data.forEach) display(data);else error();
            }, error);
          }, error);
        };

        var kp_search_by_title = function kp_search_by_title(callback, error) {
          var url = 'api/v2.1/films/search-by-keyword?keyword=' + encodeURIComponent(_this4.kpCleanTitle(query));

          _this4.kp_api_search(url, callback, error);
        };

        var kp_search_by_id = function kp_search_by_id(callback, error) {
          if (!object.clarification && object.movie.imdb_id) {
            var url = 'api/v2.2/films?imdbId=' + encodeURIComponent(object.movie.imdb_id);

            _this4.kp_api_search(url, callback, error);
          } else callback([]);
        };

        var kp_search = function kp_search(fallback) {
          var error = function error() {
            if (fallback) fallback();else display([]);
          };

          kp_search_by_id(function (data) {
            if (data && data.length && data.forEach) display(data);else kp_search_by_title(function (data) {
              if (data && data.length && data.forEach) display(data);else error();
            }, error);
          }, error);
        };

        var vcdn_search_imdb = function vcdn_search_imdb() {
          var error = function error() {
            if (imdb_sources.indexOf(balanser) >= 0) {
              _this4.extendChoice();

              sources[balanser].search(object, object.movie.imdb_id);
            } else if (search_sources.indexOf(balanser) >= 0) {
              _this4.extendChoice();

              sources[balanser].search(object);
            } else {
              var error2 = function error2() {
                display([]);
              };

              kp_search_by_title(function (data) {
                if (data && data.length && data.forEach) display(data);else error2();
              }, error2);
            }
          };

          vcdn_search_by_id(function (data) {
            if (data && data.length && data.forEach) display(data);else error();
          }, error);
        };

        var kp_search_imdb = function kp_search_imdb() {
          kp_search_by_id(function (data) {
            if (data && data.length && data.forEach) display(data);else vcdn_search_imdb();
          }, vcdn_search_imdb);
        };

        var letgo = function letgo() {
          if (!object.clarification && +object.movie.kinopoisk_id && kp_sources.indexOf(balanser) >= 0) {
            _this4.extendChoice();

            sources[balanser].search(object, +object.movie.kinopoisk_id);
          } else if (!object.clarification && object.movie.imdb_id && kp_sources.indexOf(balanser) >= 0) {
            kp_search_imdb();
          } else if (search_sources.indexOf(balanser) >= 0) {
            _this4.extendChoice();

            sources[balanser].search(object);
          } else {
            if (balanser == 'lumex' || balanser == 'lumex2') {
              var fallback = function fallback() {
                if (!object.clarification && (+object.movie.kinopoisk_id || object.movie.imdb_id)) {
                  _this4.extendChoice();

                  sources[balanser].search(object, +object.movie.kinopoisk_id || object.movie.imdb_id);
                } else if (Lampa.Storage.field('online_mod_skip_kp_search') !== true) kp_search();else display([]);
              };

              vcdn_search(fallback);
            } else kp_search(vcdn_search);
          }
        };

        if (!object.movie.imdb_id && (object.movie.source == 'tmdb' || object.movie.source == 'cub') && (imdb_sources.indexOf(balanser) >= 0 || kp_sources.indexOf(balanser) >= 0)) {
          var tmdburl = (object.movie.name ? 'tv' : 'movie') + '/' + object.movie.id + '/external_ids?api_key=4ef0d7355d9ffb5151e987764708ce96&language=ru';
          var baseurl = typeof Lampa.TMDB !== 'undefined' ? Lampa.TMDB.api(tmdburl) : 'http://api.themoviedb.org/3/' + tmdburl;
          network.clear();
          network.timeout(1000 * 15);
          network.silent(baseurl, function (ttid) {
            object.movie.imdb_id = ttid.imdb_id;
            letgo();
          }, function (a, c) {
            letgo();
          });
        } else {
          letgo();
        }
      };

      this.parsePlaylist = function (str) {
        var pl = [];

        try {
          if (startsWith(str, '[')) {
            str.substring(1).split(',[').forEach(function (item) {
              if (endsWith(item, ',')) item = item.substring(0, item.length - 1);
              var label_end = item.indexOf(']');

              if (label_end >= 0) {
                var label = item.substring(0, label_end);

                if (item.charAt(label_end + 1) === '{') {
                  item.substring(label_end + 2).split(';{').forEach(function (voice_item) {
                    if (endsWith(voice_item, ';')) voice_item = voice_item.substring(0, voice_item.length - 1);
                    var voice_end = voice_item.indexOf('}');

                    if (voice_end >= 0) {
                      var voice = voice_item.substring(0, voice_end);
                      pl.push({
                        label: label,
                        voice: voice,
                        links: voice_item.substring(voice_end + 1).split(' or ').filter(function (link) {
                          return link;
                        })
                      });
                    }
                  });
                } else {
                  pl.push({
                    label: label,
                    links: item.substring(label_end + 1).split(' or ').filter(function (link) {
                      return link;
                    })
                  });
                }
              }
            });
            pl = pl.filter(function (item) {
              return item.links.length;
            });
          }
        } catch (e) {}

        return pl;
      };

      this.parseM3U = function (str) {
        var pl = [];

        try {
          var xstream = false;
          var bandwidth = 0;
          var width = 0;
          var height = 0;
          var codecs = '';
          str.split('\n').forEach(function (line) {
            line = line.trim();

            if (startsWith(line, '#')) {
              if (startsWith(line, '#EXT-X-STREAM-INF')) {
                xstream = true;
                var BANDWIDTH = line.match(/\bBANDWIDTH=(\d+)\b/);

                if (BANDWIDTH) {
                  bandwidth = BANDWIDTH[1];
                }

                var RESOLUTION = line.match(/\bRESOLUTION=(\d+)x(\d+)\b/);

                if (RESOLUTION) {
                  width = parseInt(RESOLUTION[1]);
                  height = parseInt(RESOLUTION[2]);
                }

                var CODECS = line.match(/\bCODECS="([^"]+)"/);

                if (CODECS) {
                  codecs = CODECS[1];
                }
              }
            } else if (line.length) {
              pl.push({
                xstream: xstream,
                bandwidth: bandwidth,
                width: width,
                height: height,
                codecs: codecs,
                link: line
              });
              xstream = false;
              bandwidth = 0;
              width = 0;
              height = 0;
              codecs = '';
            }
          });
        } catch (e) {}

        return pl;
      };

      this.formatEpisodeTitle = function (s_num, e_num, name) {
        var title = '';
        var full = Lampa.Storage.field('online_mod_full_episode_title') === true;

        if (s_num != null && s_num !== '') {
          title = (full ? Lampa.Lang.translate('torrent_serial_season') + ' ' : 'S') + s_num + ' / ';
        }

        if (name == null || name === '') name = Lampa.Lang.translate('torrent_serial_episode') + ' ' + e_num;else if (e_num != null && e_num !== '') name = Lampa.Lang.translate('torrent_serial_episode') + ' ' + e_num + ' - ' + name;
        title += name;
        return title;
      };

      this.proxyUrlCall = function (proxy_url, method, url, timeout, post_data, call_success, call_fail, withCredentials) {
        proxy_url = this.proxy('iframe') + proxy_url;

        var process = function process() {
          if (proxyWindow[proxy_url]) {
            timeout = timeout || 60 * 1000;
            var message_id;

            try {
              message_id = crypto.getRandomValues(new Uint8Array(16)).toString();
            } catch (e) {}

            if (!message_id) message_id = Math.random().toString();
            proxyCalls[message_id] = {
              success: call_success,
              fail: call_fail
            };
            proxyWindow[proxy_url].postMessage({
              message: 'proxyMessage',
              message_id: message_id,
              method: method,
              url: url,
              timeout: timeout,
              post_data: post_data,
              withCredentials: withCredentials
            }, '*');
            setTimeout(function () {
              var call = proxyCalls[message_id];

              if (call) {
                delete proxyCalls[message_id];
                if (call.fail) call.fail({
                  status: 0,
                  statusText: 'timeout',
                  responseText: ''
                }, 'timeout');
              }
            }, timeout + 1000);
          } else {
            if (call_fail) call_fail({
              status: 0,
              statusText: 'abort',
              responseText: ''
            }, 'abort');
          }
        };

        if (!proxyInitialized[proxy_url]) {
          proxyInitialized[proxy_url] = true;
          var proxyOrigin = proxy_url.replace(/(https?:\/\/[^\/]+)\/.*/, '$1');
          var proxyIframe = document.createElement('iframe');
          proxyIframe.setAttribute('src', proxy_url);
          proxyIframe.setAttribute('width', '0');
          proxyIframe.setAttribute('height', '0');
          proxyIframe.setAttribute('tabindex', '-1');
          proxyIframe.setAttribute('title', 'empty');
          proxyIframe.setAttribute('style', 'display:none');
          proxyIframe.addEventListener('load', function () {
            proxyWindow[proxy_url] = proxyIframe.contentWindow;
            window.addEventListener('message', function (event) {
              var data = event.data;

              if (event.origin === proxyOrigin && data && data.message === 'proxyResponse' && data.message_id) {
                var call = proxyCalls[data.message_id];

                if (call) {
                  delete proxyCalls[data.message_id];

                  if (data.status === 200) {
                    if (call.success) call.success(data.responseText);
                  } else {
                    if (call.fail) call.fail({
                      status: data.status,
                      statusText: data.statusText,
                      responseText: data.responseText
                    });
                  }
                }
              }
            });
            if (process) process();
            process = null;
          });
          document.body.appendChild(proxyIframe);
          setTimeout(function () {
            if (process) process();
            process = null;
          }, 10000);
        } else {
          process();
        }
      };

      this.proxyCall = function (method, url, timeout, post_data, call_success, call_fail, withCredentials) {
        var proxy_url = (window.location.protocol === 'https:' ? 'https://' : 'http://') + 'nb557.surge.sh/proxy.html';
        this.proxyUrlCall(proxy_url, method, url, timeout, post_data, call_success, call_fail, withCredentials);
      };

      this.proxyCall2 = function (method, url, timeout, post_data, call_success, call_fail, withCredentials) {
        var proxy_url = (window.location.protocol === 'https:' ? 'https://' : 'http://') + 'lampa.stream/proxy.html';
        this.proxyUrlCall(proxy_url, method, url, timeout, post_data, call_success, call_fail, withCredentials);
      };

      this.proxyCall3 = function (method, url, timeout, post_data, call_success, call_fail, withCredentials) {
        var proxy_url = 'https://nb557.github.io/plugins/proxy.html';
        this.proxyUrlCall(proxy_url, method, url, timeout, post_data, call_success, call_fail, withCredentials);
      };

      this.extendChoice = function () {
        var data = Lampa.Storage.cache('online_mod_choice_' + balanser, 500, {});
        var save = data[selected_id || object.movie.id] || {};
        extended = true;
        sources[balanser].extendChoice(save);
      };

      this.saveChoice = function (choice) {
        var data = Lampa.Storage.cache('online_mod_choice_' + balanser, 500, {});
        data[selected_id || object.movie.id] = choice;
        Lampa.Storage.set('online_mod_choice_' + balanser, data);
      };
      /**
       * Есть похожие карточки
       * @param {Object} json
       */


      this.similars = function (json, search_more, more_params) {
        var _this5 = this;

        json.forEach(function (elem) {
          var title = elem.title || elem.ru_title || elem.nameRu || elem.en_title || elem.nameEn || elem.orig_title || elem.nameOriginal;
          var orig_title = elem.orig_title || elem.nameOriginal || elem.en_title || elem.nameEn;
          var year = elem.start_date || elem.year || '';
          var info = [];
          if (orig_title && orig_title != elem.title) info.push(orig_title);
          if (elem.seasons_count) info.push(Lampa.Lang.translate('online_mod_seasons_count') + ': ' + elem.seasons_count);
          if (elem.episodes_count) info.push(Lampa.Lang.translate('online_mod_episodes_count') + ': ' + elem.episodes_count);
          elem.title = title;
          elem.quality = year ? (year + '').slice(0, 4) : '----';
          elem.info = info.length ? ' / ' + info.join(' / ') : '';
          var item = Lampa.Template.get('online_mod_folder', elem);
          item.on('hover:enter', function () {
            _this5.activity.loader(true);

            _this5.reset();

            object.search = elem.title;
            object.search_date = year;
            selected_id = elem.id;

            _this5.extendChoice();

            sources[balanser].search(object, elem.kp_id || elem.kinopoisk_id || elem.kinopoiskId || elem.filmId || elem.imdb_id, [elem]);
          });

          _this5.append(item);
        });

        if (search_more) {
          var elem = {
            title: Lampa.Lang.translate('online_mod_show_more'),
            quality: '...',
            info: ''
          };
          var item = Lampa.Template.get('online_mod_folder', elem);
          item.on('hover:enter', function () {
            _this5.activity.loader(true);

            _this5.reset();

            search_more(more_params);
          });
          this.append(item);
        }
      };
      /**
       * Очистить список файлов
       */


      this.reset = function () {
        contextmenu_all = [];
        last = filter.render().find('.selector').eq(0)[0];
        scroll.render().find('.empty').remove();
        scroll.clear();
        scroll.reset();
      };

      this.inActivity = function () {
        var body = $('body');
        return !(body.hasClass('settings--open') || body.hasClass('menu--open') || body.hasClass('keyboard-input--visible') || body.hasClass('selectbox--open') || body.hasClass('search--open') || body.hasClass('ambience--enable') || $('div.modal').length);
      };
      /**
       * Загрузка
       */


      this.loading = function (status) {
        if (status) this.activity.loader(true);else {
          this.activity.loader(false);
          if (Lampa.Activity.active().activity === this.activity && this.inActivity()) this.activity.toggle();
        }
      };

      this.getDefaultQuality = function (qualityMap, defValue) {
        {
          var needHackHlsLink = function needHackHlsLink(link) {
            return link && endsWith(link, '.m3u8') && link.lastIndexOf('?') <= link.lastIndexOf('/');
          };

          if (qualityMap) {
            for (var ID in qualityMap) {
              if (needHackHlsLink(qualityMap[ID])) {
                qualityMap[ID] += '?';
              }
            }
          }

          if (needHackHlsLink(defValue)) {
            defValue += '?';
          }
        }

        if (qualityMap) {
          var preferably = forcedQuality;

          if (!preferably) {
            preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
            if (preferably === '1080p') preferably = '1080p Ultra';
          }

          var items = ['2160p', '4K', '1440p', '2K', '1080p Ultra', '1080p', '720p', '480p', '360p', '240p'];
          var idx = items.indexOf(preferably);

          if (idx !== -1) {
            for (var i = idx; i < items.length; i++) {
              var item = items[i];
              if (qualityMap[item]) return qualityMap[item];
            }

            for (var _i = idx - 1; _i >= 0; _i--) {
              var _item = items[_i];
              if (qualityMap[_item]) return qualityMap[_item];
            }
          }
        }

        return defValue;
      };

      this.renameQualityMap = function (qualityMap) {
        if (!qualityMap) return qualityMap;
        var renamed = {};

        for (var label in qualityMap) {
          renamed["\u200B" + label] = qualityMap[label];
        }

        return renamed;
      };
      /**
       * Построить фильтр
       */


      this.filter = function (filter_items, choice) {
        var select = [];

        var add = function add(type, title) {
          var need = Lampa.Storage.get('online_mod_filter', '{}');
          var items = filter_items[type];
          var subitems = [];
          var value = need[type];
          items.forEach(function (name, i) {
            subitems.push({
              title: name,
              selected: value == i,
              index: i
            });
          });
          select.push({
            title: title,
            subtitle: items[value],
            items: subitems,
            stype: type
          });
        };

        choice.source = filter_sources.indexOf(balanser);
        Lampa.Storage.set('online_mod_filter', choice);
        select.push({
          title: Lampa.Lang.translate('torrent_parser_reset'),
          reset: true
        });
        filter_items.source = obj_filter_sources.map(function (s) {
          return s.title;
        });
        add('source', Lampa.Lang.translate('online_mod_balanser'));
        if (filter_items.voice && filter_items.voice.length) add('voice', Lampa.Lang.translate('torrent_parser_voice'));
        if (filter_items.season && filter_items.season.length) add('season', Lampa.Lang.translate('torrent_serial_season'));
        if (filter_items.server && filter_items.server.length) add('server', Lampa.Lang.translate('online_mod_server'));
        this.updateQualityFilter();
        select.push(qualityFilter);
        filter.set('filter', select);
        filter.set('sort', obj_filter_sources.map(function (e) {
          return {
            source: e.name,
            title: e.title,
            selected: e.name === balanser
          };
        }));
        this.selected(filter_items);
      };
      /**
       * Закрыть фильтр
       */


      this.closeFilter = function () {
        if ($('body').hasClass('selectbox--open')) Lampa.Select.close();
      };
      /**
       * Показать что выбрано в фильтре
       */


      this.selected = function (filter_items) {
        var need = Lampa.Storage.get('online_mod_filter', '{}'),
            select = [];

        for (var i in need) {
          if (i !== 'source' && filter_translate[i] && filter_items[i] && filter_items[i].length > 1) {
            select.push(filter_translate[i] + ': ' + filter_items[i][need[i]]);
          }
        }

        var source_obj = obj_filter_sources.filter(function (e) {
          return e.name === balanser;
        })[0];
        filter.chosen('filter', select);
        filter.chosen('sort', [source_obj ? source_obj.title : balanser]);
      };
      /**
       * Добавить файл
       */


      this.append = function (item) {
        item.on('hover:focus', function (e) {
          last = e.target;
          scroll.update($(e.target), true);
        });
        scroll.append(item);
      };
      /**
       * Меню
       */


      this.contextmenu = function (params) {
        contextmenu_all.push(params);
        params.item.on('hover:long', function () {
          function selectQuality(title, callback) {
            return function (extra) {
              if (extra.quality) {
                var qual = [];

                for (var i in extra.quality) {
                  qual.push({
                    title: i,
                    file: extra.quality[i]
                  });
                }

                Lampa.Select.show({
                  title: title,
                  items: qual,
                  onBack: function onBack() {
                    Lampa.Controller.toggle(enabled);
                  },
                  onSelect: callback
                });
              } else callback(null, extra);
            };
          }

          var enabled = Lampa.Controller.enabled().name;
          var menu = [{
            title: Lampa.Lang.translate('torrent_parser_label_title'),
            mark: true
          }, {
            title: Lampa.Lang.translate('torrent_parser_label_cancel_title'),
            clearmark: true
          }, {
            title: Lampa.Lang.translate('online_mod_clearmark_all'),
            clearmark_all: true
          }, {
            title: Lampa.Lang.translate('time_reset'),
            timeclear: true
          }, {
            title: Lampa.Lang.translate('online_mod_timeclear_all'),
            timeclear_all: true
          }];

          if (Lampa.Platform.is('webos')) {
            menu.push({
              title: Lampa.Lang.translate('player_lauch') + ' - Webos',
              player: 'webos'
            });
          }

          if (Lampa.Platform.is('android')) {
            menu.push({
              title: Lampa.Lang.translate('player_lauch') + ' - Android',
              player: 'android'
            });
          }

          menu.push({
            title: Lampa.Lang.translate('player_lauch') + ' - Lampa',
            player: 'lampa'
          });

          if (params.file) {
            menu.push({
              title: Lampa.Lang.translate('copy_link'),
              copylink: true
            });
          }

          if (Lampa.Account.working() && params.element && typeof params.element.season !== 'undefined' && Lampa.Account.subscribeToTranslation) {
            menu.push({
              title: Lampa.Lang.translate('online_mod_voice_subscribe'),
              subscribe: true
            });
          }

          Lampa.Select.show({
            title: Lampa.Lang.translate('title_action'),
            items: menu,
            onBack: function onBack() {
              Lampa.Controller.toggle(enabled);
            },
            onSelect: function onSelect(a) {
              if (a.clearmark) {
                Lampa.Arrays.remove(params.viewed, params.hash_file);
                Lampa.Storage.set('online_view', params.viewed);
                params.item.find('.torrent-item__viewed').remove();
              }

              if (a.clearmark_all) {
                contextmenu_all.forEach(function (params) {
                  Lampa.Arrays.remove(params.viewed, params.hash_file);
                  Lampa.Storage.set('online_view', params.viewed);
                  params.item.find('.torrent-item__viewed').remove();
                });
              }

              if (a.mark) {
                if (params.viewed.indexOf(params.hash_file) == -1) {
                  params.viewed.push(params.hash_file);
                  params.item.append('<div class="torrent-item__viewed">' + Lampa.Template.get('icon_star', {}, true) + '</div>');
                  Lampa.Storage.set('online_view', params.viewed);
                }
              }

              if (a.timeclear) {
                params.view.percent = 0;
                params.view.time = 0;
                params.view.duration = 0;
                Lampa.Timeline.update(params.view);
              }

              if (a.timeclear_all) {
                contextmenu_all.forEach(function (params) {
                  params.view.percent = 0;
                  params.view.time = 0;
                  params.view.duration = 0;
                  Lampa.Timeline.update(params.view);
                });
              }

              Lampa.Controller.toggle(enabled);

              if (a.player) {
                Lampa.Player.runas(a.player);
                params.item.trigger('hover:enter', {
                  runas: a.player
                });
              }

              if (a.copylink) {
                params.file(selectQuality('Ссылки', function (b, extra) {
                  Lampa.Utils.copyTextToClipboard(b && b.file || extra && extra.file, function () {
                    Lampa.Noty.show(Lampa.Lang.translate('copy_secuses'));
                  }, function () {
                    Lampa.Noty.show(Lampa.Lang.translate('copy_error'));
                  });
                }));
              }

              if (a.subscribe) {
                Lampa.Account.subscribeToTranslation({
                  card: object.movie,
                  season: params.element.season,
                  episode: params.element.translate_episode_end,
                  voice: params.element.translate_voice
                }, function () {
                  Lampa.Noty.show(Lampa.Lang.translate('online_mod_voice_success'));
                }, function () {
                  Lampa.Noty.show(Lampa.Lang.translate('online_mod_voice_error'));
                });
              }
            }
          });
        }).on('hover:focus', function () {
          if (Lampa.Helper) Lampa.Helper.show('online_file', Lampa.Lang.translate('online_mod_file_helper'), params.item);
        });
      };
      /**
       * Показать пустой результат
       */


      this.empty = function (msg) {
        var empty = Lampa.Template.get('list_empty');
        if (msg) empty.find('.empty__descr').text(msg);
        scroll.append(empty);
        this.loading(false);
      };
      /**
       * Показать пустой результат по ключевому слову
       */


      this.emptyForQuery = function (query) {
        this.empty(Lampa.Lang.translate('online_mod_query_start') + ' (' + query + ') ' + Lampa.Lang.translate('online_mod_query_end'));
      };

      this.getLastEpisode = function (items) {
        var last_episode = 0;
        items.forEach(function (e) {
          if (typeof e.episode !== 'undefined') last_episode = Math.max(last_episode, parseInt(e.episode));
        });
        return last_episode;
      };
      /**
       * Начать навигацию по файлам
       */


      this.start = function (first_select) {
        if (Lampa.Activity.active().activity !== this.activity) return; //обязательно, иначе наблюдается баг, активность создается но не стартует, в то время как компонент загружается и стартует самого себя.

        if (first_select) {
          var last_views = scroll.render().find('.selector.online').find('.torrent-item__viewed').parent().last();
          if (object.movie.number_of_seasons && last_views.length) last = last_views.eq(0)[0];else last = scroll.render().find('.selector').eq(0)[0];
        }

        Lampa.Background.immediately(Lampa.Utils.cardImgBackground(object.movie));
        Lampa.Controller.add('content', {
          toggle: function toggle() {
            Lampa.Controller.collectionSet(scroll.render(), files.render());
            Lampa.Controller.collectionFocus(last || false, scroll.render());
          },
          up: function up() {
            if (Navigator.canmove('up')) {
              Navigator.move('up');
            } else Lampa.Controller.toggle('head');
          },
          down: function down() {
            Navigator.move('down');
          },
          right: function right() {
            if (Navigator.canmove('right')) Navigator.move('right');else filter.show(Lampa.Lang.translate('title_filter'), 'filter');
          },
          left: function left() {
            if (Navigator.canmove('left')) Navigator.move('left');else Lampa.Controller.toggle('menu');
          },
          back: this.back
        });
        if (this.inActivity()) Lampa.Controller.toggle('content');
      };

      this.render = function () {
        return files.render();
      };

      this.back = function () {
        Lampa.Activity.backward();
      };

      this.pause = function () {};

      this.stop = function () {};

      this.destroy = function () {
        network.clear();
        files.destroy();
        scroll.destroy();
        network = null;
        all_sources.forEach(function (s) {
          s.source.destroy();
        });
      };
    }

    var mod_version = '31.08.2025';
    console.log('App', 'start address:', window.location.href);
    var isMSX = !!(window.TVXHost || window.TVXManager);
    var isTizen = navigator.userAgent.toLowerCase().indexOf('tizen') !== -1;
    var isIFrame = window.parent !== window;
    var isLocal = !startsWith(window.location.protocol, 'http');
    var androidHeaders = Lampa.Platform.is('android') && Utils.checkAndroidVersion(339);
    var filmixHost = Utils.filmixHost();
    console.log('App', 'is MSX:', isMSX);
    console.log('App', 'is Tizen:', isTizen);
    console.log('App', 'is iframe:', isIFrame);
    console.log('App', 'is local:', isLocal);
    console.log('App', 'supports headers:', androidHeaders);

    if (!Utils.isDebug()) {
      Lampa.Storage.set('online_mod_proxy_rezka2', 'false');
      Lampa.Storage.set('online_mod_proxy_kinobase', 'false');
      Lampa.Storage.set('online_mod_proxy_collaps', 'false');
      Lampa.Storage.set('online_mod_proxy_cdnmovies', 'false');
      Lampa.Storage.set('online_mod_proxy_fancdn', 'false');
      Lampa.Storage.set('online_mod_proxy_fancdn2', 'false');
      Lampa.Storage.set('online_mod_proxy_fanserials', 'false');
      Lampa.Storage.set('online_mod_proxy_animelib', 'false');
    } else if (!Lampa.Platform.is('android')) {
      Lampa.Storage.set('online_mod_proxy_cdnmovies', 'true');
      Lampa.Storage.set('online_mod_proxy_fancdn', 'true');
      Lampa.Storage.set('online_mod_proxy_fancdn2', 'true');
      Lampa.Storage.set('online_mod_proxy_fanserials', 'true');
    }

    Lampa.Storage.set('online_mod_proxy_lumex', Lampa.Platform.is('android') ? 'false' : 'true');
    Lampa.Storage.set('online_mod_proxy_filmix', Lampa.Platform.is('android') ? 'false' : 'true');
    Lampa.Storage.set('online_mod_proxy_videoseed', Lampa.Platform.is('android') ? 'false' : 'true');
    Lampa.Storage.set('online_mod_proxy_vibix', Lampa.Platform.is('android') ? 'false' : 'true');
    Lampa.Storage.set('online_mod_proxy_redheadsound', Lampa.Platform.is('android') ? 'false' : 'true');
    Lampa.Storage.set('online_mod_proxy_videodb', 'false');
    Lampa.Storage.set('online_mod_proxy_zetflix', 'false');
    Lampa.Storage.set('online_mod_proxy_kinopub', 'true');
    Lampa.Storage.set('online_mod_proxy_alloha', 'false');
    Lampa.Storage.set('online_mod_proxy_hdvb', 'false');
    Lampa.Storage.set('online_mod_proxy_kp', 'false');
    Lampa.Params.trigger('online_mod_iframe_proxy', !isTizen || isLocal);
    Lampa.Params.trigger('online_mod_proxy_iframe', false);
    Lampa.Params.trigger('online_mod_use_stream_proxy', false);
    Lampa.Params.trigger('online_mod_proxy_find_ip', false);
    Lampa.Params.trigger('online_mod_proxy_other', false);
    Lampa.Params.trigger('online_mod_proxy_lumex', false);
    Lampa.Params.trigger('online_mod_proxy_rezka', false);
    Lampa.Params.trigger('online_mod_proxy_rezka2', false);
    Lampa.Params.trigger('online_mod_proxy_rezka2_mirror', false);
    Lampa.Params.trigger('online_mod_proxy_kinobase', false);
    Lampa.Params.trigger('online_mod_proxy_collaps', false);
    Lampa.Params.trigger('online_mod_proxy_cdnmovies', false);
    Lampa.Params.trigger('online_mod_proxy_filmix', false);
    Lampa.Params.trigger('online_mod_proxy_videodb', false);
    Lampa.Params.trigger('online_mod_proxy_zetflix', false);
    Lampa.Params.trigger('online_mod_proxy_fancdn', false);
    Lampa.Params.trigger('online_mod_proxy_fancdn2', false);
    Lampa.Params.trigger('online_mod_proxy_fanserials', false);
    Lampa.Params.trigger('online_mod_proxy_videoseed', false);
    Lampa.Params.trigger('online_mod_proxy_vibix', false);
    Lampa.Params.trigger('online_mod_proxy_redheadsound', false);
    Lampa.Params.trigger('online_mod_proxy_cdnvideohub', false);
    Lampa.Params.trigger('online_mod_proxy_anilibria', false);
    Lampa.Params.trigger('online_mod_proxy_anilibria2', false);
    Lampa.Params.trigger('online_mod_proxy_animelib', false);
    Lampa.Params.trigger('online_mod_proxy_kodik', false);
    Lampa.Params.trigger('online_mod_proxy_kinopub', false);
    Lampa.Params.trigger('online_mod_proxy_alloha', false);
    Lampa.Params.trigger('online_mod_proxy_hdvb', false);
    Lampa.Params.trigger('online_mod_proxy_kp', false);
    Lampa.Params.trigger('online_mod_skip_kp_search', false);
    Lampa.Params.trigger('online_mod_prefer_http', window.location.protocol !== 'https:');
    Lampa.Params.trigger('online_mod_prefer_mp4', true);
    Lampa.Params.trigger('online_mod_prefer_dash', false);
    Lampa.Params.trigger('online_mod_collaps_lampa_player', false);
    Lampa.Params.trigger('online_mod_full_episode_title', false);
    Lampa.Params.trigger('online_mod_av1_support', true);
    Lampa.Params.trigger('online_mod_save_last_balanser', false);
    Lampa.Params.trigger('online_mod_rezka2_fix_stream', false);
    Lampa.Params.select('online_mod_kinobase_mirror', '', '');
    Lampa.Params.select('online_mod_kinobase_cookie', '', '');
    Lampa.Params.select('online_mod_rezka2_mirror', '', '');
    Lampa.Params.select('online_mod_rezka2_name', '', '');
    Lampa.Params.select('online_mod_rezka2_password', '', '');
    Lampa.Params.select('online_mod_rezka2_cookie', '', '');
    Lampa.Params.select('online_mod_rezka2_prx_ukr', {
      'prx.ukrtelcdn.net': 'prx.ukrtelcdn.net',
      'prx-cogent.ukrtelcdn.net': 'prx-cogent.ukrtelcdn.net',
      'prx2-cogent.ukrtelcdn.net': 'prx2-cogent.ukrtelcdn.net',
      'prx3-cogent.ukrtelcdn.net': 'prx3-cogent.ukrtelcdn.net',
      'prx4-cogent.ukrtelcdn.net': 'prx4-cogent.ukrtelcdn.net',
      'prx-ams.ukrtelcdn.net': 'prx-ams.ukrtelcdn.net',
      'prx2-ams.ukrtelcdn.net': 'prx2-ams.ukrtelcdn.net'
    }, 'prx.ukrtelcdn.net');
    Lampa.Params.select('online_mod_fancdn_name', '', '');
    Lampa.Params.select('online_mod_fancdn_password', '', '');
    Lampa.Params.select('online_mod_fancdn_cookie', '', '');
    Lampa.Params.select('online_mod_fancdn_token', '', '');
    Lampa.Params.select('online_mod_proxy_other_url', '', '');
    Lampa.Params.select('online_mod_secret_password', '', '');

    if (window.location.protocol === 'https:') {
      Lampa.Storage.set('online_mod_prefer_http', 'false');
    }

    if (Lampa.Storage.get('online_mod_proxy_reset', '') != 6) {
      if (['collaps', 'collaps-dash'].indexOf(Lampa.Storage.get('online_mod_balanser', '') + '') !== -1) {
        Lampa.Storage.set('online_mod_balanser', '');
      }

      Lampa.Storage.set('online_mod_proxy_reset', '6');
    }

    if (!Lampa.Lang) {
      var lang_data = {};
      Lampa.Lang = {
        add: function add(data) {
          lang_data = data;
        },
        translate: function translate(key) {
          return lang_data[key] ? lang_data[key].ru : key;
        }
      };
    }

    Lampa.Lang.add({
      online_mod_watch: {
        ru: 'Смотреть онлайн',
        uk: 'Дивитися онлайн',
        be: 'Глядзець анлайн',
        en: 'Watch online',
        zh: '在线观看'
      },
      online_mod_nolink: {
        ru: 'Не удалось извлечь ссылку',
        uk: 'Неможливо отримати посилання',
        be: 'Не ўдалося атрымаць спасылку',
        en: 'Failed to fetch link',
        zh: '获取链接失败'
      },
      online_mod_blockedlink: {
        ru: 'К сожалению, это видео не доступно в вашем регионе',
        uk: 'На жаль, це відео не доступне у вашому регіоні',
        be: 'Нажаль, гэта відэа не даступна ў вашым рэгіёне',
        en: 'Sorry, this video is not available in your region',
        zh: '抱歉，您所在的地区无法观看该视频'
      },
      online_mod_blockedlink_copyright: {
        ru: 'К сожалению, это видео не доступно по запросу правообладателей',
        uk: 'На жаль, це відео не доступне за запитом правовласників',
        be: 'Нажаль, гэта відэа не даступна па запыце праваўладальнікаў',
        en: 'Sorry, this video is not available due to copyright holder request',
        zh: '抱歉，由于版权所有者的要求，该视频无法播放。'
      },
      online_mod_waitlink: {
        ru: 'Работаем над извлечением ссылки, подождите...',
        uk: 'Працюємо над отриманням посилання, зачекайте...',
        be: 'Працуем над выманнем спасылкі, пачакайце...',
        en: 'Working on extracting the link, please wait...',
        zh: '正在提取链接，请稍候...'
      },
      online_mod_captcha_address: {
        ru: 'Требуется пройти капчу по адресу: ',
        uk: 'Потрібно пройти капчу за адресою: ',
        be: 'Патрабуецца прайсці капчу па адрасе: ',
        en: 'It is required to pass the captcha at: ',
        zh: '您需要完成验证码： '
      },
      online_mod_captcha_proxy: {
        ru: 'Требуется пройти капчу. Попробуйте использовать зеркало вместо прокси',
        uk: 'Потрібно пройти капчу. Спробуйте використовувати дзеркало замість проксі',
        be: 'Патрабуецца прайсці капчу. Паспрабуйце выкарыстоўваць люстэрка замест проксі',
        en: 'It is required to pass the captcha. Try to use a mirror instead of a proxy',
        zh: '您需要通过验证码。 尝试使用镜子而不是代理'
      },
      online_mod_balanser: {
        ru: 'Балансер',
        uk: 'Балансер',
        be: 'Балансер',
        en: 'Balancer',
        zh: '平衡器'
      },
      online_mod_file_helper: {
        ru: 'Удерживайте клавишу "ОК" для вызова контекстного меню',
        uk: 'Утримуйте клавішу "ОК" для виклику контекстного меню',
        be: 'Утрымлівайце клавішу "ОК" для выкліку кантэкстнага меню',
        en: 'Hold the "OK" key to bring up the context menu',
        zh: '按住“确定”键调出上下文菜单'
      },
      online_mod_clearmark_all: {
        ru: 'Снять отметку у всех',
        uk: 'Зняти позначку у всіх',
        be: 'Зняць адзнаку ва ўсіх',
        en: 'Uncheck all',
        zh: '取消所有'
      },
      online_mod_timeclear_all: {
        ru: 'Сбросить тайм-код у всех',
        uk: 'Скинути тайм-код у всіх',
        be: 'Скінуць тайм-код ва ўсіх',
        en: 'Reset timecode for all',
        zh: '为所有人重置时间码'
      },
      online_mod_query_start: {
        ru: 'По запросу',
        uk: 'На запит',
        be: 'Па запыце',
        en: 'On request',
        zh: '根据要求'
      },
      online_mod_query_end: {
        ru: 'нет результатов',
        uk: 'немає результатів',
        be: 'няма вынікаў',
        en: 'no results',
        zh: '没有结果'
      },
      online_mod_title: {
        ru: 'Онлайн',
        uk: 'Онлайн',
        be: 'Анлайн',
        en: 'Online',
        zh: '在线的'
      },
      online_mod_title_full: {
        ru: 'Онлайн Мод',
        uk: 'Онлайн Мод',
        be: 'Анлайн Мод',
        en: 'Online Mod',
        zh: '在线的 Mod'
      },
      online_mod_use_stream_proxy: {
        ru: 'Проксировать видеопоток (Укр)',
        uk: 'Проксирувати відеопотік (Укр)',
        be: 'Праксіраваць відэаструмень (Укр)',
        en: 'Proxy video stream (Ukr)',
        zh: '代理视频流 （乌克兰）'
      },
      online_mod_proxy_find_ip: {
        ru: 'Передавать свой IP прокси',
        uk: 'Передавати свій IP проксі',
        be: 'Перадаваць свой IP проксі',
        en: 'Send your IP to proxy',
        zh: '将您的 IP 发送给代理'
      },
      online_mod_proxy_other: {
        ru: 'Использовать альтернативный прокси',
        uk: 'Використовувати альтернативний проксі',
        be: 'Выкарыстоўваць альтэрнатыўны проксі',
        en: 'Use an alternative proxy',
        zh: '使用备用代理'
      },
      online_mod_proxy_other_url: {
        ru: 'Альтернативный прокси',
        uk: 'Альтернативний проксі',
        be: 'Альтэрнатыўны проксі',
        en: 'Alternative proxy',
        zh: '备用代理'
      },
      online_mod_proxy_balanser: {
        ru: 'Проксировать',
        uk: 'Проксирувати',
        be: 'Праксіраваць',
        en: 'Proxy',
        zh: '代理'
      },
      online_mod_proxy_kp: {
        ru: 'Проксировать КиноПоиск',
        uk: 'Проксирувати КиноПоиск',
        be: 'Праксіраваць КиноПоиск',
        en: 'Proxy KinoPoisk',
        zh: '代理 KinoPoisk'
      },
      online_mod_skip_kp_search: {
        ru: 'Не искать в КиноПоиск',
        uk: 'Не шукати у КиноПоиск',
        be: 'Не шукаць у КиноПоиск',
        en: 'Skip search in KinoPoisk',
        zh: '在 KinoPoisk 中跳过搜索'
      },
      online_mod_iframe_proxy: {
        ru: 'Использовать iframe-прокси',
        uk: 'Використовувати iframe-проксі',
        be: 'Выкарыстоўваць iframe-проксі',
        en: 'Use iframe proxy',
        zh: '使用 iframe 代理'
      },
      online_mod_prefer_http: {
        ru: 'Предпочитать поток по HTTP',
        uk: 'Віддавати перевагу потіку по HTTP',
        be: 'Аддаваць перавагу патоку па HTTP',
        en: 'Prefer stream over HTTP',
        zh: '优先于 HTTP 流式传输'
      },
      online_mod_prefer_mp4: {
        ru: 'Предпочитать поток MP4',
        uk: 'Віддавати перевагу потіку MP4',
        be: 'Аддаваць перавагу патоку MP4',
        en: 'Prefer MP4 stream',
        zh: '更喜欢 MP4 流'
      },
      online_mod_prefer_dash: {
        ru: 'Предпочитать DASH вместо HLS',
        uk: 'Віддавати перевагу DASH замість HLS',
        be: 'Аддаваць перавагу DASH замест HLS',
        en: 'Prefer DASH over HLS',
        zh: '更喜欢 DASH 而不是 HLS'
      },
      online_mod_collaps_lampa_player: {
        ru: 'Collaps: Встроенный плеер',
        uk: 'Collaps: Вбудований плеєр',
        be: 'Collaps: Убудаваны плэер',
        en: 'Collaps: Lampa player',
        zh: 'Collaps： Lampa播放器'
      },
      online_mod_full_episode_title: {
        ru: 'Полный формат названия серии',
        uk: 'Повний формат назви серії',
        be: 'Поўны фармат назвы серыі',
        en: 'Full episode title format',
        zh: '完整剧集标题格式'
      },
      online_mod_av1_support: {
        ru: 'AV1 поддерживается',
        uk: 'AV1 підтримується',
        be: 'AV1 падтрымліваецца',
        en: 'AV1 supported',
        zh: 'AV1 支持'
      },
      online_mod_save_last_balanser: {
        ru: 'Сохранять историю балансеров',
        uk: 'Зберігати історію балансерів',
        be: 'Захоўваць гісторыю балансараў',
        en: 'Save history of balancers',
        zh: '保存平衡器的历史记录'
      },
      online_mod_clear_last_balanser: {
        ru: 'Очистить историю балансеров',
        uk: 'Очистити історію балансерів',
        be: 'Ачысціць гісторыю балансараў',
        en: 'Clear history of balancers',
        zh: '清除平衡器的历史记录'
      },
      online_mod_kinobase_mirror: {
        ru: 'Зеркало для Kinobase',
        uk: 'Дзеркало для Kinobase',
        be: 'Люстэрка для Kinobase',
        en: 'Mirror for Kinobase',
        zh: 'Kinobase的镜子'
      },
      online_mod_kinobase_cookie: {
        ru: 'Куки для Kinobase',
        uk: 'Кукі для Kinobase',
        be: 'Кукі для Kinobase',
        en: 'Cookie for Kinobase',
        zh: 'Kinobase 的 Cookie'
      },
      online_mod_rezka2_mirror: {
        ru: 'Зеркало для HDrezka',
        uk: 'Дзеркало для HDrezka',
        be: 'Люстэрка для HDrezka',
        en: 'Mirror for HDrezka',
        zh: 'HDrezka的镜子'
      },
      online_mod_proxy_rezka2_mirror: {
        ru: 'Проксировать зеркало HDrezka',
        uk: 'Проксирувати дзеркало HDrezka',
        be: 'Праксіраваць люстэрка HDrezka',
        en: 'Proxy HDrezka mirror',
        zh: '代理HDrezka镜子'
      },
      online_mod_rezka2_name: {
        ru: 'Логин или email для HDrezka',
        uk: 'Логін чи email для HDrezka',
        be: 'Лагін ці email для HDrezka',
        en: 'Login or email for HDrezka',
        zh: 'HDrezka的登录名或电子邮件'
      },
      online_mod_rezka2_password: {
        ru: 'Пароль для HDrezka',
        uk: 'Пароль для HDrezka',
        be: 'Пароль для HDrezka',
        en: 'Password for HDrezka',
        zh: 'HDrezka的密码'
      },
      online_mod_rezka2_login: {
        ru: 'Войти в HDrezka',
        uk: 'Увійти до HDrezka',
        be: 'Увайсці ў HDrezka',
        en: 'Log in to HDrezka',
        zh: '登录HDrezka'
      },
      online_mod_rezka2_logout: {
        ru: 'Выйти из HDrezka',
        uk: 'Вийти з HDrezka',
        be: 'Выйсці з HDrezka',
        en: 'Log out of HDrezka',
        zh: '注销HDrezka'
      },
      online_mod_rezka2_cookie: {
        ru: 'Куки для HDrezka',
        uk: 'Кукі для HDrezka',
        be: 'Кукі для HDrezka',
        en: 'Cookie for HDrezka',
        zh: 'HDrezka 的 Cookie'
      },
      online_mod_rezka2_fill_cookie: {
        ru: 'Заполнить куки для HDrezka',
        uk: 'Заповнити кукі для HDrezka',
        be: 'Запоўніць кукі для HDrezka',
        en: 'Fill cookie for HDrezka',
        zh: '为HDrezka填充Cookie'
      },
      online_mod_rezka2_fix_stream: {
        ru: 'Фикс видеопотока для HDrezka',
        uk: 'Фікс відеопотоку для HDrezka',
        be: 'Фікс відэаструменю для HDrezka',
        en: 'Fix video stream for HDrezka',
        zh: '修复 HDrezka 的视频流'
      },
      online_mod_rezka2_prx_ukr: {
        ru: 'Прокси-сервер для HDrezka (Укр)',
        uk: 'Проксі-сервер для HDrezka (Укр)',
        be: 'Проксі-сервер для HDrezka (Укр)',
        en: 'Proxy server for HDrezka (Ukr)',
        zh: 'HDrezka 的代理服务器 （乌克兰）'
      },
      online_mod_fancdn_name: {
        ru: 'Логин для FanSerials',
        uk: 'Логін для FanSerials',
        be: 'Лагін для FanSerials',
        en: 'Login for FanSerials',
        zh: 'FanSerials的登录名'
      },
      online_mod_fancdn_password: {
        ru: 'Пароль для FanSerials',
        uk: 'Пароль для FanSerials',
        be: 'Пароль для FanSerials',
        en: 'Password for FanSerials',
        zh: 'FanSerials的密码'
      },
      online_mod_fancdn_cookie: {
        ru: 'Куки для FanSerials',
        uk: 'Кукі для FanSerials',
        be: 'Кукі для FanSerials',
        en: 'Cookie for FanSerials',
        zh: 'FanSerials 的 Cookie'
      },
      online_mod_fancdn_fill_cookie: {
        ru: 'Заполнить куки для FanSerials',
        uk: 'Заповнити кукі для FanSerials',
        be: 'Запоўніць кукі для FanSerials',
        en: 'Fill cookie for FanSerials',
        zh: '为FanSerials填充Cookie'
      },
      online_mod_fancdn_token: {
        ru: 'Токен для FanCDN',
        uk: 'Токен для FanCDN',
        be: 'Токен для FanCDN',
        en: 'Token for FanCDN',
        zh: 'FanCDN 代币'
      },
      online_mod_authorization_required: {
        ru: 'Требуется авторизация',
        uk: 'Потрібна авторизація',
        be: 'Патрабуецца аўтарызацыя',
        en: 'Authorization required',
        zh: '需要授权'
      },
      online_mod_unsupported_mirror: {
        ru: 'Неподдерживаемое зеркало',
        uk: 'Непідтримуване дзеркало',
        be: 'Непадтрымоўванае люстэрка',
        en: 'Unsupported mirror',
        zh: '不支持的镜子'
      },
      online_mod_secret_password: {
        ru: 'Секретный пароль',
        uk: 'Секретний пароль',
        be: 'Сакрэтны пароль',
        en: 'Secret password',
        zh: '秘密密码'
      },
      online_mod_seasons_count: {
        ru: 'Сезонов',
        uk: 'Сезонів',
        be: 'Сезонаў',
        en: 'Seasons',
        zh: '季'
      },
      online_mod_episodes_count: {
        ru: 'Эпизодов',
        uk: 'Епізодів',
        be: 'Эпізодаў',
        en: 'Episodes',
        zh: '集'
      },
      online_mod_show_more: {
        ru: 'Показать ещё',
        uk: 'Показати ще',
        be: 'Паказаць яшчэ',
        en: 'Show more',
        zh: '展示更多'
      },
      online_mod_server: {
        ru: 'Сервер',
        uk: 'Сервер',
        be: 'Сервер',
        en: 'Server',
        zh: '服务器'
      },
      online_mod_filmix_param_add_title: {
        ru: 'Добавить ТОКЕН от Filmix',
        uk: 'Додати ТОКЕН від Filmix',
        be: 'Дадаць ТОКЕН ад Filmix',
        en: 'Add TOKEN from Filmix',
        zh: '从 Filmix 添加 TOKEN'
      },
      online_mod_filmix_param_add_descr: {
        ru: 'Добавьте ТОКЕН для подключения подписки',
        uk: 'Додайте ТОКЕН для підключення передплати',
        be: 'Дадайце ТОКЕН для падлучэння падпіскі',
        en: 'Add a TOKEN to connect a subscription',
        zh: '添加 TOKEN 以连接订阅'
      },
      online_mod_filmix_param_placeholder: {
        ru: 'Например: nxjekeb57385b..',
        uk: 'Наприклад: nxjekeb57385b..',
        be: 'Напрыклад: nxjekeb57385b..',
        en: 'For example: nxjekeb57385b..',
        zh: '例如： nxjekeb57385b..'
      },
      online_mod_filmix_param_add_device: {
        ru: 'Добавить устройство на Filmix',
        uk: 'Додати пристрій на Filmix',
        be: 'Дадаць прыладу на Filmix',
        en: 'Add Device to Filmix',
        zh: '将设备添加到 Filmix'
      },
      online_mod_filmix_modal_text: {
        ru: 'Введите его на странице ' + filmixHost + '/consoles в вашем авторизованном аккаунте!',
        uk: 'Введіть його на сторінці ' + filmixHost + '/consoles у вашому авторизованому обліковому записі!',
        be: 'Увядзіце яго на старонцы ' + filmixHost + '/consoles у вашым аўтарызаваным акаўнце!',
        en: 'Enter it at ' + filmixHost + '/consoles in your authorized account!',
        zh: '在您的授权帐户中的 ' + filmixHost + '/consoles 中输入！'
      },
      online_mod_filmix_modal_wait: {
        ru: 'Ожидаем код',
        uk: 'Очікуємо код',
        be: 'Чакаем код',
        en: 'Waiting for the code',
        zh: '等待代码'
      },
      online_mod_filmix_copy_secuses: {
        ru: 'Код скопирован в буфер обмена',
        uk: 'Код скопійовано в буфер обміну',
        be: 'Код скапіяваны ў буфер абмену',
        en: 'Code copied to clipboard',
        zh: '代码复制到剪贴板'
      },
      online_mod_filmix_copy_fail: {
        ru: 'Ошибка при копировании',
        uk: 'Помилка при копіюванні',
        be: 'Памылка пры капіяванні',
        en: 'Copy error',
        zh: '复制错误'
      },
      online_mod_filmix_nodevice: {
        ru: 'Устройство не авторизовано',
        uk: 'Пристрій не авторизований',
        be: 'Прылада не аўтарызавана',
        en: 'Device not authorized',
        zh: '设备未授权'
      },
      online_mod_filmix_status: {
        ru: 'Статус',
        uk: 'Статус',
        be: 'Статус',
        en: 'Status',
        zh: '状态'
      },
      online_mod_voice_subscribe: {
        ru: 'Подписаться на перевод',
        uk: 'Підписатися на переклад',
        be: 'Падпісацца на пераклад',
        en: 'Subscribe to translation',
        zh: '订阅翻译'
      },
      online_mod_voice_success: {
        ru: 'Вы успешно подписались',
        uk: 'Ви успішно підписалися',
        be: 'Вы паспяхова падпісаліся',
        en: 'You have successfully subscribed',
        zh: '您已成功订阅'
      },
      online_mod_voice_error: {
        ru: 'Возникла ошибка',
        uk: 'Виникла помилка',
        be: 'Узнікла памылка',
        en: 'An error has occurred',
        zh: '发生了错误'
      }
    });
    var network = new Lampa.Reguest();
    var online_loading = false;

    function resetTemplates() {
      Lampa.Template.add('online_mod', "<div class=\"online selector\">\n        <div class=\"online__body\">\n            <div style=\"position: absolute;left: 0;top: -0.3em;width: 2.4em;height: 2.4em\">\n                <svg style=\"height: 2.4em; width:  2.4em;\" viewBox=\"0 0 128 128\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <circle cx=\"64\" cy=\"64\" r=\"56\" stroke=\"white\" stroke-width=\"16\"/>\n                    <path d=\"M90.5 64.3827L50 87.7654L50 41L90.5 64.3827Z\" fill=\"white\"/>\n                </svg>\n            </div>\n            <div class=\"online__title\" style=\"padding-left: 2.1em;\">{title}</div>\n            <div class=\"online__quality\" style=\"padding-left: 3.4em;\">{quality}{info}</div>\n        </div>\n    </div>");
      Lampa.Template.add('online_mod_folder', "<div class=\"online selector\">\n        <div class=\"online__body\">\n            <div style=\"position: absolute;left: 0;top: -0.3em;width: 2.4em;height: 2.4em\">\n                <svg style=\"height: 2.4em; width:  2.4em;\" viewBox=\"0 0 128 112\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <rect y=\"20\" width=\"128\" height=\"92\" rx=\"13\" fill=\"white\"/>\n                    <path d=\"M29.9963 8H98.0037C96.0446 3.3021 91.4079 0 86 0H42C36.5921 0 31.9555 3.3021 29.9963 8Z\" fill=\"white\" fill-opacity=\"0.23\"/>\n                    <rect x=\"11\" y=\"8\" width=\"106\" height=\"76\" rx=\"13\" fill=\"white\" fill-opacity=\"0.51\"/>\n                </svg>\n            </div>\n            <div class=\"online__title\" style=\"padding-left: 2.1em;\">{title}</div>\n            <div class=\"online__quality\" style=\"padding-left: 3.4em;\">{quality}{info}</div>\n        </div>\n    </div>");
    }

    function checkMyIp(onComplite) {
      if (Lampa.Storage.field('online_mod_proxy_find_ip') !== true) {
        onComplite();
        return;
      }

      Utils.checkMyIp(network, onComplite);
    }

    function checkCurrentFanserialsHost(onComplite) {
      var host = Utils.getCurrentFanserialsHost();

      if (host || !Utils.isDebug()) {
        onComplite();
        return;
      }

      var prox = Utils.proxy('cookie');
      var prox_enc = '';
      var returnHeaders = androidHeaders;

      if (!prox && !returnHeaders) {
        onComplite();
        return;
      }

      var user_agent = Utils.baseUserAgent();
      var headers = Lampa.Platform.is('android') ? {
        'User-Agent': user_agent
      } : {};

      if (prox) {
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
        prox_enc += 'cookie_plus/param/Cookie=/head/';
        returnHeaders = false;
      }

      var url = Utils.fanserialsHost() + '/';
      network.clear();
      network.timeout(10000);
      network["native"](Utils.proxyLink(url, prox, prox_enc), function (json) {
        if (json && json.currentUrl) {
          var _url = Utils.parseURL(json.currentUrl);

          Utils.setCurrentFanserialsHost(_url.origin);
        }

        onComplite();
      }, function (a, c) {
        onComplite();
      }, false, {
        headers: headers,
        returnHeaders: returnHeaders
      });
    }

    function loadOnline(object) {
      if (online_loading) return;
      online_loading = true;
      Utils.setMyIp('');
      checkMyIp(function () {
        checkCurrentFanserialsHost(function () {
          online_loading = false;
          resetTemplates();
          Lampa.Component.add('online_mod', component);
          Lampa.Activity.push({
            url: '',
            title: Lampa.Lang.translate('online_mod_title_full'),
            component: 'online_mod',
            search: object.title,
            search_one: object.title,
            search_two: object.original_title,
            movie: object,
            page: 1
          });
        });
      });
    } // нужна заглушка, а то при страте лампы говорит пусто


    Lampa.Component.add('online_mod', component); //то же самое

    resetTemplates();
    var manifest = {
      type: 'video',
      version: mod_version,
      name: Lampa.Lang.translate('online_mod_title_full') + ' - ' + mod_version,
      description: Lampa.Lang.translate('online_mod_watch'),
      component: 'online_mod',
      onContextMenu: function onContextMenu(object) {
        return {
          name: Lampa.Lang.translate('online_mod_watch'),
          description: ''
        };
      },
      onContextLauch: function onContextLauch(object) {
        online_loading = false;
        loadOnline(object);
      }
    };
    Lampa.Manifest.plugins = manifest;
    var button = "<div class=\"full-start__button selector view--online_mod\" data-subtitle=\"online_mod " + mod_version + "\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:svgjs=\"http://svgjs.com/svgjs\" version=\"1.1\" width=\"512\" height=\"512\" x=\"0\" y=\"0\" viewBox=\"0 0 244 260\" style=\"enable-background:new 0 0 512 512\" xml:space=\"preserve\" class=\"\">\n    <g xmlns=\"http://www.w3.org/2000/svg\">\n        <path d=\"M242,88v170H10V88h41l-38,38h37.1l38-38h38.4l-38,38h38.4l38-38h38.3l-38,38H204L242,88L242,88z M228.9,2l8,37.7l0,0 L191.2,10L228.9,2z M160.6,56l-45.8-29.7l38-8.1l45.8,29.7L160.6,56z M84.5,72.1L38.8,42.4l38-8.1l45.8,29.7L84.5,72.1z M10,88 L2,50.2L47.8,80L10,88z\" fill=\"currentColor\"/>\n    </g></svg>\n\n    <span>#{online_mod_title}</span>\n    </div>";
    Lampa.Listener.follow('full', function (e) {
      if (e.type == 'complite') {
        var btn = $(Lampa.Lang.translate(button));
        online_loading = false;
        btn.on('hover:enter', function () {
          loadOnline(e.data.movie);
        });
        e.object.activity.render().find('.view--torrent').after(btn);
      }
    });

    if (Lampa.Storage.get('online_mod_use_stream_proxy', '') === '') {
      $.ajax({
        url: (window.location.protocol === 'https:' ? 'https://' : 'http://') + 'ipwho.is/?fields=ip,country_code',
        jsonp: 'callback',
        dataType: 'jsonp'
      }).done(function (json) {
        if (json && json.country_code) {
          Lampa.Storage.set('online_mod_use_stream_proxy', '' + (json.country_code === 'UA'));
        }
      });
    }

    if (Lampa.VPN && Lampa.VPN.region && (Utils.isDebug() || Utils.isDebug2())) {
      Lampa.VPN.region = function (call) {
        if (call) call('de');
      };
    } ///////FILMIX/////////


    var filmix_headers = Lampa.Platform.is('android') ? {
      'User-Agent': Utils.filmixUserAgent()
    } : {};
    var api_url = 'http://filmixapp.cyou/api/v2/';
    var dev_id = Utils.randomHex(16);
    var ping_auth;
    Lampa.Params.select('filmix_token', '', '');
    Lampa.Template.add('settings_filmix', "<div>\n    <div class=\"settings-param selector\" data-name=\"filmix_token\" data-type=\"input\" placeholder=\"#{online_mod_filmix_param_placeholder}\">\n        <div class=\"settings-param__name\">#{online_mod_filmix_param_add_title}</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">#{online_mod_filmix_param_add_descr}</div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"filmix_add\" data-static=\"true\">\n        <div class=\"settings-param__name\">#{online_mod_filmix_param_add_device}</div>\n    </div>\n</div>");
    Lampa.Storage.listener.follow('change', function (e) {
      if (e.name == 'filmix_token') {
        window.mod_filmix = {
          max_qualitie: 480,
          is_max_qualitie: false
        };
        if (e.value) checkPro(e.value);else {
          Lampa.Storage.set("filmix_status", {});
          showStatus();
        }
      }
    });

    function addSettingsFilmix() {
      if (Lampa.Settings.main && Lampa.Settings.main() && !Lampa.Settings.main().render().find('[data-component="filmix"]').length) {
        var field = $("<div class=\"settings-folder selector\" data-component=\"filmix\">\n            <div class=\"settings-folder__icon\">\n                <svg height=\"57\" viewBox=\"0 0 58 57\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M20 20.3735V45H26.8281V34.1262H36.724V26.9806H26.8281V24.3916C26.8281 21.5955 28.9062 19.835 31.1823 19.835H39V13H26.8281C23.6615 13 20 15.4854 20 20.3735Z\" fill=\"white\"/>\n                <rect x=\"2\" y=\"2\" width=\"54\" height=\"53\" rx=\"5\" stroke=\"white\" stroke-width=\"4\"/>\n                </svg>\n            </div>\n            <div class=\"settings-folder__name\">Filmix</div>\n        </div>");
        Lampa.Settings.main().render().find('[data-component="more"]').after(field);
        Lampa.Settings.main().update();
      }
    }

    if (window.appready) addSettingsFilmix();else {
      Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') addSettingsFilmix();
      });
    }
    Lampa.Settings.listener.follow('open', function (e) {
      if (e.name == 'filmix') {
        e.body.find('[data-name="filmix_add"]').unbind('hover:enter').on('hover:enter', function () {
          var user_code = '';
          var user_token = '';
          var filmix_prox = Utils.proxy('filmix');
          var filmix_prox_enc = '';

          if (filmix_prox) {
            filmix_prox_enc += 'param/User-Agent=' + encodeURIComponent(Utils.filmixUserAgent()) + '/';
          }

          var modal = $('<div><div class="broadcast__text">' + Lampa.Lang.translate('online_mod_filmix_modal_text') + '</div><div class="broadcast__device selector" style="text-align: center">' + Lampa.Lang.translate('online_mod_filmix_modal_wait') + '...</div><br><div class="broadcast__scan"><div></div></div></div></div>');
          Lampa.Modal.open({
            title: '',
            html: modal,
            onBack: function onBack() {
              Lampa.Modal.close();
              Lampa.Controller.toggle('settings_component');
              clearInterval(ping_auth);
            },
            onSelect: function onSelect() {
              Lampa.Utils.copyTextToClipboard(user_code, function () {
                Lampa.Noty.show(Lampa.Lang.translate('online_mod_filmix_copy_secuses'));
              }, function () {
                Lampa.Noty.show(Lampa.Lang.translate('online_mod_filmix_copy_fail'));
              });
            }
          });
          ping_auth = setInterval(function () {
            checkPro(user_token, function () {
              Lampa.Modal.close();
              clearInterval(ping_auth);
              Lampa.Storage.set("filmix_token", user_token);
              e.body.find('[data-name="filmix_token"] .settings-param__value').text(user_token);
              Lampa.Controller.toggle('settings_component');
            });
          }, 10000);
          network.clear();
          network.timeout(10000);
          network["native"](Utils.proxyLink(api_url + 'token_request' + Utils.filmixToken(dev_id, ''), filmix_prox, filmix_prox_enc, 'enc2'), function (found) {
            if (found && found.status == 'ok') {
              user_token = found.code;
              user_code = found.user_code;
              modal.find('.selector').text(user_code); //modal.find('.broadcast__scan').remove()
            } else {
              Lampa.Noty.show(found);
            }
          }, function (a, c) {
            Lampa.Noty.show(network.errorDecode(a, c));
          }, false, {
            headers: filmix_headers
          });
        });
        showStatus();
      }
    });

    function showStatus() {
      var status = Lampa.Storage.get("filmix_status", '{}');
      var info = Lampa.Lang.translate('online_mod_filmix_nodevice');

      if (status.login) {
        if (status.is_pro) info = status.login + ' - PRO ' + Lampa.Lang.translate('filter_rating_to') + ' - ' + status.pro_date;else if (status.is_pro_plus) info = status.login + ' - PRO_PLUS ' + Lampa.Lang.translate('filter_rating_to') + ' - ' + status.pro_date;else info = status.login + ' - NO PRO';
      }

      var field = $(Lampa.Lang.translate("\n        <div class=\"settings-param\" data-name=\"filmix_status\" data-static=\"true\">\n            <div class=\"settings-param__name\">#{online_mod_filmix_status}</div>\n            <div class=\"settings-param__value\">".concat(info, "</div>\n        </div>")));
      $('.settings [data-name="filmix_status"]').remove();
      $('.settings [data-name="filmix_add"]').after(field);
    }

    function checkPro(token, call) {
      var filmix_prox = Utils.proxy('filmix');
      var filmix_prox_enc = '';

      if (filmix_prox) {
        filmix_prox_enc += 'param/User-Agent=' + encodeURIComponent(Utils.filmixUserAgent()) + '/';
      }

      network.clear();
      network.timeout(8000);
      network["native"](Utils.proxyLink(api_url + 'user_profile' + Utils.filmixToken(dev_id, token), filmix_prox, filmix_prox_enc, 'enc2'), function (json) {
        if (json) {
          if (json.user_data) {
            Lampa.Storage.set("filmix_status", json.user_data);
            if (call) call();
          } else {
            Lampa.Storage.set("filmix_status", {});
          }

          showStatus();
        }
      }, function (a, c) {
        Lampa.Noty.show(network.errorDecode(a, c));
      }, false, {
        headers: filmix_headers
      });
    } ///////Rezka2/////////


    function rezka2Login(success, error) {
      var host = Utils.rezka2Mirror();
      var url = host + '/ajax/login/';
      var postdata = 'login_name=' + encodeURIComponent(Lampa.Storage.get('online_mod_rezka2_name', ''));
      postdata += '&login_password=' + encodeURIComponent(Lampa.Storage.get('online_mod_rezka2_password', ''));
      postdata += '&login_not_save=0';
      network.clear();
      network.timeout(8000);
      network.silent(url, function (json) {
        if (json && (json.success || json.message == 'Уже авторизован на сайте. Необходимо обновить страницу!')) {
          Lampa.Storage.set('online_mod_rezka2_status', 'true');
          network.clear();
          network.timeout(8000);
          network.silent(host + '/', function (str) {
            str = (str || '').replace(/\n/g, '');
            var error_form = str.match(/(<div class="error-code">[^<]*<div>[^<]*<\/div>[^<]*<\/div>)\s*(<div class="error-title">[^<]*<\/div>)/);

            if (error_form) {
              Lampa.Noty.show(error_form[0]);
              if (error) error();
              return;
            }

            var verify_form = str.match(/<span>MIRROR<\/span>.*<button type="submit" onclick="\$\.cookie(\([^)]*\))/);

            if (verify_form) {
              Lampa.Noty.show(Lampa.Lang.translate('online_mod_unsupported_mirror') + ' HDrezka');
              rezka2Logout(error, error);
              return;
            }

            if (success) success();
          }, function (a, c) {
            if (success) success();
          }, false, {
            dataType: 'text',
            withCredentials: true
          });
        } else {
          Lampa.Storage.set('online_mod_rezka2_status', 'false');
          if (json && json.message) Lampa.Noty.show(json.message);
          if (error) error();
        }
      }, function (a, c) {
        Lampa.Noty.show(network.errorDecode(a, c));
        if (error) error();
      }, postdata, {
        withCredentials: true
      });
    }

    function rezka2Logout(success, error) {
      var url = Utils.rezka2Mirror() + '/logout/';
      network.clear();
      network.timeout(8000);
      network.silent(url, function (str) {
        Lampa.Storage.set('online_mod_rezka2_status', 'false');
        if (success) success();
      }, function (a, c) {
        Lampa.Storage.set('online_mod_rezka2_status', 'false');
        Lampa.Noty.show(network.errorDecode(a, c));
        if (error) error();
      }, false, {
        dataType: 'text',
        withCredentials: true
      });
    }

    function rezka2FillCookie(success, error) {
      var prox = Utils.proxy('rezka2');
      var prox_enc = '';
      var returnHeaders = androidHeaders;
      var proxy_mirror = Lampa.Storage.field('online_mod_proxy_rezka2_mirror') === true;
      var host = prox && !proxy_mirror ? 'https://rezka.ag' : Utils.rezka2Mirror();
      if (!prox && !returnHeaders) prox = Utils.proxy('cookie');

      if (!prox && !returnHeaders) {
        if (error) error();
        return;
      }

      var user_agent = Utils.baseUserAgent();
      var headers = Lampa.Platform.is('android') ? {
        'User-Agent': user_agent
      } : {};

      if (prox) {
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
        prox_enc += 'cookie_plus/param/Cookie=/';
        returnHeaders = false;
      }

      var url = host + '/ajax/login/';
      var postdata = 'login_name=' + encodeURIComponent(Lampa.Storage.get('online_mod_rezka2_name', ''));
      postdata += '&login_password=' + encodeURIComponent(Lampa.Storage.get('online_mod_rezka2_password', ''));
      postdata += '&login_not_save=0';
      network.clear();
      network.timeout(8000);
      network["native"](Utils.proxyLink(url, prox, prox_enc), function (json) {
        var cookie = '';
        var values = {};
        var sid = '';
        var body = json && json.body || {};
        body = typeof body === 'string' ? Lampa.Arrays.decodeJson(body, {}) : body;

        if (!body.success) {
          if (body.message) Lampa.Noty.show(body.message);
          if (error) error();
          return;
        }

        var cookieHeaders = json && json.headers && json.headers['set-cookie'] || null;

        if (cookieHeaders && cookieHeaders.forEach) {
          cookieHeaders.forEach(function (param) {
            var parts = param.split(';')[0].split('=');

            if (parts[0]) {
              if (parts[1] === 'deleted') delete values[parts[0]];else values[parts[0]] = parts[1] || '';
            }
          });
          sid = values['PHPSESSID'];
          delete values['PHPSESSID'];
          var cookies = [];

          for (var name in values) {
            cookies.push(name + '=' + values[name]);
          }

          cookie = cookies.join('; ');
        }

        if (cookie) {
          Lampa.Storage.set('online_mod_rezka2_cookie', cookie);
          if (cookie.indexOf('PHPSESSID=') == -1) cookie = 'PHPSESSID=' + (sid || Utils.randomId(26)) + (cookie ? '; ' + cookie : '');
          var prox_enc2 = prox_enc;

          if (prox) {
            prox_enc2 += 'param/Cookie=' + encodeURIComponent(cookie) + '/';
          } else {
            headers['Cookie'] = cookie;
          }

          network.clear();
          network.timeout(8000);
          network["native"](Utils.proxyLink(host + '/', prox, prox_enc2), function (str) {
            var json = typeof str === 'string' ? Lampa.Arrays.decodeJson(str, {}) : str;
            var body = (json && json.body || '').replace(/\n/g, '');
            var error_form = body.match(/(<div class="error-code">[^<]*<div>[^<]*<\/div>[^<]*<\/div>)\s*(<div class="error-title">[^<]*<\/div>)/);

            if (error_form) {
              Lampa.Noty.show(error_form[0]);
              if (error) error();
              return;
            }

            var cookieHeaders = json && json.headers && json.headers['set-cookie'] || null;

            if (cookieHeaders && cookieHeaders.forEach) {
              cookieHeaders.forEach(function (param) {
                var parts = param.split(';')[0].split('=');

                if (parts[0]) {
                  if (parts[1] === 'deleted') delete values[parts[0]];else values[parts[0]] = parts[1] || '';
                }
              });
              sid = values['PHPSESSID'] || sid;
              delete values['PHPSESSID'];
              var _cookies = [];

              for (var _name in values) {
                _cookies.push(_name + '=' + values[_name]);
              }

              cookie = _cookies.join('; ');
              if (cookie) Lampa.Storage.set('online_mod_rezka2_cookie', cookie);
            }

            var verify_form = body.match(/<span>MIRROR<\/span>.*<button type="submit" onclick="\$\.cookie(\([^)]*\))/);

            if (verify_form) {
              var verify_cookie;

              try {
                verify_cookie = (0, eval)('"use strict"; (function(name, value){ return {name: name, value: value}; })' + verify_form[1] + ';');
              } catch (e) {}

              if (verify_cookie) {
                values[verify_cookie.name] = verify_cookie.value;
                var _cookies2 = [];

                for (var _name2 in values) {
                  _cookies2.push(_name2 + '=' + values[_name2]);
                }

                cookie = _cookies2.join('; ');
                if (cookie) Lampa.Storage.set('online_mod_rezka2_cookie', cookie);
                if (cookie.indexOf('PHPSESSID=') == -1) cookie = 'PHPSESSID=' + (sid || Utils.randomId(26)) + (cookie ? '; ' + cookie : '');
                var prox_enc3 = prox_enc;

                if (prox) {
                  prox_enc3 += 'param/Cookie=' + encodeURIComponent(cookie) + '/';
                } else {
                  headers['Cookie'] = cookie;
                }

                network.clear();
                network.timeout(8000);
                network["native"](Utils.proxyLink(host + '/', prox, prox_enc3), function (str) {
                  var json = typeof str === 'string' ? Lampa.Arrays.decodeJson(str, {}) : str;
                  var body = (json && json.body || '').replace(/\n/g, '');
                  var error_form = body.match(/(<div class="error-code">[^<]*<div>[^<]*<\/div>[^<]*<\/div>)\s*(<div class="error-title">[^<]*<\/div>)/);

                  if (error_form) {
                    Lampa.Noty.show(error_form[0]);
                    if (error) error();
                    return;
                  }

                  var verify_form = body.match(/<span>MIRROR<\/span>.*<button type="submit" onclick="\$\.cookie(\([^)]*\))/);

                  if (verify_form) {
                    Lampa.Storage.set('online_mod_rezka2_cookie', '');
                    Lampa.Noty.show(Lampa.Lang.translate('online_mod_unsupported_mirror') + ' HDrezka');
                    if (error) error();
                    return;
                  }

                  var cookieHeaders = json && json.headers && json.headers['set-cookie'] || null;

                  if (cookieHeaders && cookieHeaders.forEach) {
                    cookieHeaders.forEach(function (param) {
                      var parts = param.split(';')[0].split('=');

                      if (parts[0]) {
                        if (parts[1] === 'deleted') delete values[parts[0]];else values[parts[0]] = parts[1] || '';
                      }
                    });
                    sid = values['PHPSESSID'] || sid;
                    delete values['PHPSESSID'];
                    var _cookies3 = [];

                    for (var _name3 in values) {
                      _cookies3.push(_name3 + '=' + values[_name3]);
                    }

                    cookie = _cookies3.join('; ');
                    if (cookie) Lampa.Storage.set('online_mod_rezka2_cookie', cookie);
                  }

                  if (success) success();
                }, function (a, c) {
                  if (success) success();
                }, false, {
                  dataType: 'text',
                  headers: headers,
                  returnHeaders: returnHeaders
                });
                return;
              }
            }

            if (success) success();
          }, function (a, c) {
            if (success) success();
          }, false, {
            dataType: 'text',
            headers: headers,
            returnHeaders: returnHeaders
          });
        } else {
          if (error) error();
        }
      }, function (a, c) {
        Lampa.Noty.show(network.errorDecode(a, c));
        if (error) error();
      }, postdata, {
        headers: headers,
        returnHeaders: returnHeaders
      });
    }

    function fancdnFillCookie(success, error) {
      var prox = Utils.proxy('fancdn');
      var prox_enc = '';
      var returnHeaders = androidHeaders;

      if (!prox && !returnHeaders) {
        if (error) error();
        return;
      }

      var host = Utils.fanserialsHost();
      var user_agent = Utils.baseUserAgent();
      var headers = Lampa.Platform.is('android') ? {
        'User-Agent': user_agent
      } : {};

      if (prox) {
        prox_enc += 'param/User-Agent=' + encodeURIComponent(user_agent) + '/';
        prox_enc += 'cookie_plus/param/Cookie=/';
        returnHeaders = false;
      }

      var url = host + '/';
      var postdata = 'login_name=' + encodeURIComponent(Lampa.Storage.get('online_mod_fancdn_name', ''));
      postdata += '&login_password=' + encodeURIComponent(Lampa.Storage.get('online_mod_fancdn_password', ''));
      postdata += '&login=submit';
      network.clear();
      network.timeout(8000);
      network["native"](Utils.proxyLink(url, prox, prox_enc), function (str) {
        var cookie = '';
        var values = {};
        var sid = '';
        var json = typeof str === 'string' ? Lampa.Arrays.decodeJson(str, {}) : str;
        var body = (json && json.body || '').replace(/\n/g, '');
        var error_form = body.match(/(<div class="berrors-inner">[^<]*<b class="berrors-title">[^<]*<\/b>[^<]*<\/div>)/);

        if (error_form) {
          Lampa.Noty.show(error_form[0]);
          if (error) error();
          return;
        }

        var cookieHeaders = json && json.headers && json.headers['set-cookie'] || null;

        if (cookieHeaders && cookieHeaders.forEach) {
          cookieHeaders.forEach(function (param) {
            var parts = param.split(';')[0].split('=');

            if (parts[0]) {
              if (parts[1] === 'deleted') delete values[parts[0]];else values[parts[0]] = parts[1] || '';
            }
          });
          sid = values['PHPSESSID'];
          delete values['PHPSESSID'];
          var cookies = [];

          for (var name in values) {
            cookies.push(name + '=' + values[name]);
          }

          cookie = cookies.join('; ');
        }

        if (cookie) {
          Lampa.Storage.set('online_mod_fancdn_cookie', cookie);
          if (cookie.indexOf('PHPSESSID=') == -1) cookie = 'PHPSESSID=' + (sid || Utils.randomHex(32)) + (cookie ? '; ' + cookie : '');
          var prox_enc2 = prox_enc;

          if (prox) {
            prox_enc2 += 'param/Cookie=' + encodeURIComponent(cookie) + '/';
          } else {
            headers['Cookie'] = cookie;
          }

          network.clear();
          network.timeout(8000);
          network["native"](Utils.proxyLink(host + '/', prox, prox_enc2), function (str) {
            var json = typeof str === 'string' ? Lampa.Arrays.decodeJson(str, {}) : str;
            var body = (json && json.body || '').replace(/\n/g, '');
            var error_form = body.match(/(<div class="berrors-inner">[^<]*<b class="berrors-title">[^<]*<\/b>[^<]*<\/div>)/);

            if (error_form) {
              Lampa.Noty.show(error_form[0]);
              if (error) error();
              return;
            }

            var cookieHeaders = json && json.headers && json.headers['set-cookie'] || null;

            if (cookieHeaders && cookieHeaders.forEach) {
              cookieHeaders.forEach(function (param) {
                var parts = param.split(';')[0].split('=');

                if (parts[0]) {
                  if (parts[1] === 'deleted') delete values[parts[0]];else values[parts[0]] = parts[1] || '';
                }
              });
              delete values['PHPSESSID'];
              var _cookies4 = [];

              for (var _name4 in values) {
                _cookies4.push(_name4 + '=' + values[_name4]);
              }

              cookie = _cookies4.join('; ');
              if (cookie) Lampa.Storage.set('online_mod_fancdn_cookie', cookie);
            }

            if (success) success();
          }, function (a, c) {
            if (success) success();
          }, false, {
            dataType: 'text',
            headers: headers,
            returnHeaders: returnHeaders
          });
        } else {
          if (error) error();
        }
      }, function (a, c) {
        Lampa.Noty.show(network.errorDecode(a, c));
        if (error) error();
      }, postdata, {
        dataType: 'text',
        headers: headers,
        returnHeaders: returnHeaders
      });
    } ///////Онлайн Мод/////////


    var template = "<div>";

    {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_lumex\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} Lumex</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    }

    if (Utils.isDebug()) {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_rezka2\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} HDrezka</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_kinobase\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} Kinobase</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_collaps\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} Collaps</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_cdnmovies\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} CDNMovies</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_filmix\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} Filmix</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    }

    if (Utils.isDebug()) {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_fancdn\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} FanCDN</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_fancdn2\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} FanCDN (ID)</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_fanserials\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} FanSerials</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_videoseed\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} VideoSeed</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_vibix\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} Vibix</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_redheadsound\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} RedHeadSound</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    }

    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_anilibria\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} AniLibria</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_anilibria2\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} AniLibria.top</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";

    if (Utils.isDebug()) {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_animelib\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} AnimeLib</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    }

    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_kodik\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} Kodik</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_skip_kp_search\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_skip_kp_search}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_iframe_proxy\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_iframe_proxy}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_iframe\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} iframe</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_prefer_http\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_prefer_http}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_prefer_mp4\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_prefer_mp4}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";

    {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_collaps_lampa_player\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_collaps_lampa_player}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    }

    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_full_episode_title\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_full_episode_title}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_save_last_balanser\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_save_last_balanser}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_clear_last_balanser\" data-static=\"true\">\n        <div class=\"settings-param__name\">#{online_mod_clear_last_balanser}</div>\n        <div class=\"settings-param__status\"></div>\n    </div>";

    if (Utils.isDebug()) {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_kinobase_mirror\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_kinobase_mirror}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_kinobase_cookie\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_kinobase_cookie}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    }

    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_mirror\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_mirror}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";

    if (Utils.isDebug()) {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_rezka2_mirror\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_rezka2_mirror}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    }

    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_name\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_name}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_password\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_password}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";

    if (Lampa.Platform.is('android')) {
      Lampa.Storage.set("online_mod_rezka2_status", 'false');
    } else {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_login\" data-static=\"true\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_login}</div>\n        <div class=\"settings-param__status\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_logout\" data-static=\"true\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_logout}</div>\n        <div class=\"settings-param__status\"></div>\n    </div>";
    }

    if (Utils.isDebug() || Lampa.Platform.is('android')) {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_cookie\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_cookie}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_fill_cookie\" data-static=\"true\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_fill_cookie}</div>\n        <div class=\"settings-param__status\"></div>\n    </div>";
    }

    {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_fix_stream\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_fix_stream}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    }

    if (Utils.isDebug()) {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_fancdn_name\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_fancdn_name}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_fancdn_password\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_fancdn_password}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    }

    if (Utils.isDebug()) {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_fancdn_cookie\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_fancdn_cookie}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    }

    if (Utils.isDebug()) {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_fancdn_fill_cookie\" data-static=\"true\">\n        <div class=\"settings-param__name\">#{online_mod_fancdn_fill_cookie}</div>\n        <div class=\"settings-param__status\"></div>\n    </div>";
    }

    if (Utils.isDebug()) {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_fancdn_token\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_fancdn_token}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    }

    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_use_stream_proxy\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_use_stream_proxy}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_prx_ukr\" data-type=\"select\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_prx_ukr}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_find_ip\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_find_ip}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_other\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_other}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_other_url\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_other_url}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_secret_password\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_secret_password}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";

    if (Utils.isDebug()) {
      template += "\n    <div class=\"settings-param selector\" data-name=\"online_mod_av1_support\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_av1_support}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";
    }

    template += "\n</div>";
    Lampa.Template.add('settings_online_mod', template);

    function addSettingsOnlineMod() {
      if (Lampa.Settings.main && Lampa.Settings.main() && !Lampa.Settings.main().render().find('[data-component="online_mod"]').length) {
        var field = $(Lampa.Lang.translate("<div class=\"settings-folder selector\" data-component=\"online_mod\">\n            <div class=\"settings-folder__icon\">\n                <svg height=\"260\" viewBox=\"0 0 244 260\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M242,88v170H10V88h41l-38,38h37.1l38-38h38.4l-38,38h38.4l38-38h38.3l-38,38H204L242,88L242,88z M228.9,2l8,37.7l0,0 L191.2,10L228.9,2z M160.6,56l-45.8-29.7l38-8.1l45.8,29.7L160.6,56z M84.5,72.1L38.8,42.4l38-8.1l45.8,29.7L84.5,72.1z M10,88 L2,50.2L47.8,80L10,88z\" fill=\"white\"/>\n                </svg>\n            </div>\n            <div class=\"settings-folder__name\">#{online_mod_title_full}</div>\n        </div>"));
        Lampa.Settings.main().render().find('[data-component="more"]').after(field);
        Lampa.Settings.main().update();
      }
    }

    if (window.appready) addSettingsOnlineMod();else {
      Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') addSettingsOnlineMod();
      });
    }
    Lampa.Settings.listener.follow('open', function (e) {
      if (e.name == 'online_mod') {
        var clear_last_balanser = e.body.find('[data-name="online_mod_clear_last_balanser"]');
        clear_last_balanser.unbind('hover:enter').on('hover:enter', function () {
          Lampa.Storage.set('online_last_balanser', {});
          Lampa.Storage.set('online_balanser', '');
          Lampa.Storage.set('online_mod_last_balanser', {});
          Lampa.Storage.set('online_mod_balanser', '');
          $('.settings-param__status', clear_last_balanser).removeClass('active error wait').addClass('active');
        });
        var rezka2_login = e.body.find('[data-name="online_mod_rezka2_login"]');
        rezka2_login.unbind('hover:enter').on('hover:enter', function () {
          var rezka2_login_status = $('.settings-param__status', rezka2_login).removeClass('active error wait').addClass('wait');
          rezka2Login(function () {
            rezka2_login_status.removeClass('active error wait').addClass('active');
          }, function () {
            rezka2_login_status.removeClass('active error wait').addClass('error');
          });
        });
        var rezka2_logout = e.body.find('[data-name="online_mod_rezka2_logout"]');
        rezka2_logout.unbind('hover:enter').on('hover:enter', function () {
          var rezka2_logout_status = $('.settings-param__status', rezka2_logout).removeClass('active error wait').addClass('wait');
          rezka2Logout(function () {
            rezka2_logout_status.removeClass('active error wait').addClass('active');
          }, function () {
            rezka2_logout_status.removeClass('active error wait').addClass('error');
          });
        });
        var rezka2_fill_cookie = e.body.find('[data-name="online_mod_rezka2_fill_cookie"]');
        rezka2_fill_cookie.unbind('hover:enter').on('hover:enter', function () {
          var rezka2_fill_cookie_status = $('.settings-param__status', rezka2_fill_cookie).removeClass('active error wait').addClass('wait');
          rezka2FillCookie(function () {
            rezka2_fill_cookie_status.removeClass('active error wait').addClass('active');
            Lampa.Params.update(e.body.find('[data-name="online_mod_rezka2_cookie"]'), [], e.body);
          }, function () {
            rezka2_fill_cookie_status.removeClass('active error wait').addClass('error');
            Lampa.Params.update(e.body.find('[data-name="online_mod_rezka2_cookie"]'), [], e.body);
          });
        });
        var fancdn_fill_cookie = e.body.find('[data-name="online_mod_fancdn_fill_cookie"]');
        fancdn_fill_cookie.unbind('hover:enter').on('hover:enter', function () {
          var fancdn_fill_cookie_status = $('.settings-param__status', fancdn_fill_cookie).removeClass('active error wait').addClass('wait');
          fancdnFillCookie(function () {
            fancdn_fill_cookie_status.removeClass('active error wait').addClass('active');
            Lampa.Params.update(e.body.find('[data-name="online_mod_fancdn_cookie"]'), [], e.body);
          }, function () {
            fancdn_fill_cookie_status.removeClass('active error wait').addClass('error');
            Lampa.Params.update(e.body.find('[data-name="online_mod_fancdn_cookie"]'), [], e.body);
          });
        });
      }
    });

})();
