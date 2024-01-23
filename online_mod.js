//23.01.2024 - apn

(function () {
    'use strict';

    var myIp = '';

    var country = '';
    $.get('https://apn.monster/country',function(text){ country=text });
	
	function apn(uri) {
      if (country == 'UA') {
        if (uri.indexOf('stream.voidboost.cc') !== -1)
          return uri.replace('stream.voidboost.cc', 'prx-ams.ukrtelcdn.net');
        return 'https://apn.watch/'+uri;
	  }
      return uri;
    }

    function decodeSecret(input) {
      var result = '';
      var password = Lampa.Storage.get('online_mod_secret_password', '');

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

    function isDebug() {
      var secret = decodeSecret([92, 85, 91, 65, 84]);
      return secret === 'debug';
    }

    function rezka2Mirror() {
      var url = Lampa.Storage.get('online_mod_rezka2_mirror', '');
      if (!url) return 'https://hdrezka.ag';
      if (url.indexOf('://') == -1) url = 'https://' + url;
      if (url.charAt(url.length - 1) === '/') url = url.substring(0, url.length - 1);
      return url;
    }

    function kinobaseMirror() {
      var url = Lampa.Storage.get('online_mod_kinobase_mirror', '');
      if (!url) return 'https://kinobase.org';
      if (url.indexOf('://') == -1) url = 'https://' + url;
      if (url.charAt(url.length - 1) === '/') url = url.substring(0, url.length - 1);
      return url;
    }

    function setMyIp(ip) {
      myIp = ip;
    }

    function getMyIp() {
      return myIp;
    }

    function proxy(name) {
      var ip = getMyIp();
      var proxy1 = (window.location.protocol === 'https:' ? 'https://' : 'http://') + 'prox.lampa.stream/';
      var proxy2 = 'https://cors.nb557.workers.dev:8443/';
      var proxy3 = 'https://cors557.deno.dev/';
      var proxy_other = Lampa.Storage.field('online_mod_proxy_other') === true ? Lampa.Storage.field('online_mod_proxy_other_url') : '';
      var user_proxy2 = (proxy_other || proxy2) + (ip ? 'ip' + ip + '/' : '');
      var user_proxy3 = (proxy_other || proxy3) + (ip ? 'ip' + ip + '/' : '');
      var alt_proxy = Lampa.Storage.field('online_mod_proxy_other') === true ? user_proxy2 : proxy1;
      if (name === 'filmix') return window.location.protocol === 'https:' ? user_proxy2 : '';
      if (name === 'svetacdn') return '';
      if (name === 'allohacdn') return Lampa.Platform.is('android') ? '' : user_proxy3;

      if (Lampa.Storage.field('online_mod_proxy_' + name) === true) {
        if (name === 'rezka') return alt_proxy;
        if (name === 'rezka2') return alt_proxy;
        if (name === 'kinobase') return user_proxy3;
        if (name === 'cdnmovies') return user_proxy3;
        if (name === 'videodb') return user_proxy2;
        if (name === 'zetflix') return user_proxy2;
        if (name === 'redheadsound') return user_proxy2;
        if (name === 'anilibria') return alt_proxy;
        if (name === 'kodik') return user_proxy3;
        if (name === 'kinopub') return user_proxy2;
      }

      return '';
    }

    var Utils = {
      decodeSecret: decodeSecret,
      isDebug: isDebug,
      rezka2Mirror: rezka2Mirror,
      kinobaseMirror: kinobaseMirror,
      setMyIp: setMyIp,
      getMyIp: getMyIp,
      proxy: proxy
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

    function _typeof(obj) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof(obj);
    }

    function videocdn(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var results = [];
      var object = _object;
      var get_links_wait = false;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prefer_mp4 = Lampa.Storage.field('online_mod_prefer_mp4') === true;
      var prox = component.proxy('videocdn');
      var prox2 = component.proxy('svetacdn');
      var host = (prefer_http || prox ? 'http:' : 'https:') + '//videocdn.tv';
      var embed = prox + host + '/api/';
      var iframe_proxy = !prox && Lampa.Storage.field('online_mod_iframe_proxy') === true && Lampa.Storage.field('online_mod_alt_iframe_proxy') !== true && !window.location.protocol.startsWith('http');
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: '',
        voice_id: 0
      };
      /**
       * Начать поиск
       * @param {Object} _object 
       * @param {String} kinopoisk_id
       */

      this.search = function (_object, kinopoisk_id, data) {
        object = _object;
        var itm = data[0];
        select_title = itm.title || itm.ru_title || itm.en_title || itm.orig_title || object.movie.title;

        if (itm.episodes || itm.media) {
          success([itm]);
          return;
        }

        var url = embed;
        var type = itm.iframe_src.split('/').slice(-2)[0];
        if (type == 'movie') type = 'movies';
        if (type == 'anime') type = 'animes';
        url += type;
        url = Lampa.Utils.addUrlComponent(url, 'api_token=3i40G5TSECmLF77oAqnEgbx61ZWaOYaE');
        url = Lampa.Utils.addUrlComponent(url, 'query=' + (itm.imdb_id ? encodeURIComponent(itm.imdb_id) : itm.kp_id || itm.kinopoisk_id ? encodeURIComponent(itm.kp_id || itm.kinopoisk_id) : encodeURIComponent(select_title)));
        url = Lampa.Utils.addUrlComponent(url, 'field=' + (itm.imdb_id ? 'imdb_id' : itm.kp_id || itm.kinopoisk_id ? 'kinopoisk_id' : 'title'));
        network.clear();
        network.timeout(20000);
        network.silent(url, function (found) {
          var results = found.data.filter(function (elem) {
            return elem.id == itm.id;
          });
          if (results.length) success(results);else component.emptyForQuery(select_title);
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
        results = null;
        extract = null;
      };
      /**
       * Успешно, есть данные
       * @param {Object} json 
       */


      function success(json) {
        component.loading(false);
        results = json;
        extractData(json);
        filter();
        append(filtred());
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
            var quality = item.label.match(/(\d\d\d+)p/);
            var file = item.links[0] || '';
            if (file) file = (prefer_http ? 'http:' : 'https:') + file;
            if (prefer_mp4) file = file.replace(/(\.mp4):hls:manifest\.m3u8$/i, '$1');
            return {
              label: item.label,
              quality: quality ? parseInt(quality[1]) : NaN,
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
      /**
       * Получить информацию о фильме
       * @param {Arrays} results 
       */


      function extractData(results) {
        var movie = results.slice(0, 1)[0];
        extract = {};

        if (movie) {
          get_links_wait = true;
          var src = (window.location.protocol === 'https:' && !prox2 ? 'https:' : 'http:') + movie.iframe_src;

          var call_success = function call_success(raw) {
            get_links_wait = false;
            component.render().find('.broadcast__scan').remove();
            var math = raw.replace(/\n/g, '').match(/id="fs" value='([^']*)'/);

            if (math) {
              var json = Lampa.Arrays.decodeJson(component.decodeHtml(math[1]), {});

              for (var i in json) {
                if (0 === i - 0) {
                  continue;
                }

                extract[i] = {
                  json: _typeof(json[i]) === 'object' ? json[i] : Lampa.Arrays.decodeJson(json[i], {}),
                  items: extractItems(json[i])
                };

                for (var a in extract[i].json) {
                  var elem = extract[i].json[a];

                  if (elem.folder) {
                    for (var f in elem.folder) {
                      var folder = elem.folder[f];
                      folder.items = extractItems(folder.file);
                    }
                  } else elem.items = extractItems(elem.file);
                }
              }
            }
          };

          var call_fail = function call_fail() {
            get_links_wait = false;
            component.render().find('.broadcast__scan').remove();
          };

          if (iframe_proxy) {
            component.proxyCall('GET', src, 20000, null, call_success, call_fail);
          } else if (prox2 && window.location.protocol !== 'http:') {
            network.clear();
            network.timeout(20000);
            network.silent(prox2 + src, call_success, call_fail, false, {
              dataType: 'text'
            });
          } else {
            var meta = $('head meta[name="referrer"]');
            var referrer = meta.attr('content') || 'never';
            meta.attr('content', 'origin');

            try {
              network.clear();
              network.timeout(20000);
              network["native"](src, call_success, call_fail, false, {
                dataType: 'text',
                headers: Lampa.Platform.is('android') ? {
                  'Origin': host,
                  'Referer': host + '/'
                } : {}
              });
            } finally {
              meta.attr('content', referrer);
            }
          }
        }
      }
      /**
       * Найти поток
       * @param {Object} element 
       * @param {Int} max_quality
       * @returns string
       */


      function getFile(element, max_quality) {
        var translat = extract[element.translation];
        var id = element.season + '_' + element.episode;
        var file = '';
        var items = [];
        var quality = false;

        if (translat) {
          if (element.season) {
            for (var i in translat.json) {
              var elem = translat.json[i];

              if (elem.folder) {
                for (var f in elem.folder) {
                  var folder = elem.folder[f];

                  if (folder.id == id) {
                    items = folder.items;
                    break;
                  }
                }
              } else if (elem.id == id) {
                items = elem.items;
                break;
              }
            }
          } else {
            items = translat.items;
          }
        }

        if (items && items.length) {
          max_quality = parseInt(max_quality);

          if (max_quality) {
            items = items.filter(function (item) {
              return item.quality <= max_quality;
            });
          }

          if (items.length) {
            file = items[0].file;
            quality = {};
            items.forEach(function (item) {
              quality[item.label] = item.file;
            });
            var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
            if (quality[preferably]) file = quality[preferably];
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
          season: [],
          season_num: [],
          voice: [],
          voice_info: []
        };
        results.slice(0, 1).forEach(function (movie) {
          if (movie.episodes) {
            movie.episodes.forEach(function (episode) {
              if (filter_items.season_num.indexOf(episode.season_num) == -1) filter_items.season_num.push(episode.season_num);
            });
            if (!filter_items.season_num.length) filter_items.season_num.push(1);
            filter_items.season_num.sort(function (a, b) {
              return a - b;
            });
            filter_items.season_num.forEach(function (s) {
              filter_items.season.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + s);
            });
          }

          if (!filter_items.season[choice.season]) choice.season = 0;

          if (movie.episodes) {
            var season_num = filter_items.season_num[choice.season];
            movie.episodes.forEach(function (episode) {
              if (episode.season_num == season_num) {
                episode.media.forEach(function (media) {
                  if (!filter_items.voice_info.find(function (v) {
                    return v.id == media.translation.id;
                  })) {
                    filter_items.voice.push(media.translation.shorter_title || media.translation.short_title || media.translation.title);
                    filter_items.voice_info.push({
                      id: media.translation.id
                    });
                  }
                });
              }
            });
          }
        });
        if (!filter_items.season[choice.season]) choice.season = 0;
        if (!filter_items.voice[choice.voice]) choice.voice = 0;

        if (choice.voice_name) {
          var inx = -1;

          if (choice.voice_id) {
            var voice = filter_items.voice_info.find(function (v) {
              return v.id == choice.voice_id;
            });
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
        results.slice(0, 1).forEach(function (movie) {
          if (movie.episodes) {
            var season_num = filter_items.season_num[choice.season];
            movie.episodes.forEach(function (episode) {
              if (episode.season_num == season_num) {
                var temp = episode.media.filter(function (m) {
                  return filter_items.voice_info[choice.voice] && m.translation.id == filter_items.voice_info[choice.voice].id;
                });
                temp.sort(function (a, b) {
                  var cmp = b.max_quality - a.max_quality;
                  if (!cmp) return cmp;
                  return b.id - a.id;
                });
                temp.slice(0, 1).forEach(function (media) {
                  var num = parseInt(episode.num);
                  if (isNaN(num)) num = episode.num;
                  filtred.push({
                    title: 'S' + episode.season_num + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + num + ' - ' + (episode.title || episode.ru_title || episode.en_title || episode.orig_title),
                    quality: media.max_quality + 'p',
                    info: ' / ' + filter_items.voice[choice.voice],
                    season: episode.season_num,
                    episode: num,
                    max_quality: media.max_quality,
                    translation: media.translation_id
                  });
                });
              }
            });
            filtred.sort(function (a, b) {
              return a.episode - b.episode;
            });
          } else if (movie.media) {
            var temp = {};
            var translations = [];
            movie.media.forEach(function (element) {
              var old = temp[element.translation_id];

              if (old) {
                if (old.max_quality > element.max_quality) return;
                if (old.id > element.id) return;
              } else {
                translations.push(element.translation_id);
              }

              temp[element.translation_id] = element;
            });
            translations.forEach(function (translation_id) {
              var element = temp[translation_id];
              filtred.push({
                title: element.translation.title || element.translation.short_title || element.translation.shorter_title || select_title,
                quality: element.max_quality + 'p' + (element.source_quality ? ' - ' + element.source_quality.toUpperCase() : ''),
                info: '',
                max_quality: element.max_quality,
                translation: element.translation_id
              });
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
        if (get_links_wait) component.append($('<div class="broadcast__scan"><div></div></div>'));
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
            var extra = getFile(element, element.max_quality);

            if (extra.file) {
              var playlist = [];
              var first = {
                url: extra.file,
                quality: extra.quality,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (element.season) {
                items.forEach(function (elem) {
                  var ex = getFile(elem, elem.max_quality);
                  playlist.push({
                    url: ex.file,
                    quality: ex.quality,
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
            } else Lampa.Noty.show(Lampa.Lang.translate(get_links_wait ? 'online_mod_waitlink' : 'online_mod_nolink'));
          });
          component.append(item);
          component.contextmenu({
            item: item,
            view: view,
            viewed: viewed,
            hash_file: hash_file,
            element: element,
            file: function file(call) {
              call(getFile(element, element.max_quality));
            }
          });
        });
        component.start(true);
      }
    }

    function rezka(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var select_id = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prefer_mp4 = Lampa.Storage.field('online_mod_prefer_mp4') === true;
      var prox = component.proxy('rezka');
      var embed = prox + (prox ? 'http:' : 'https:') + '//voidboost.tv/';
      var iframe_proxy = !prox && Lampa.Storage.field('online_mod_iframe_proxy') === true && window.location.protocol.startsWith('http') && !Lampa.Platform.is('android');
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };
      /**
       * Поиск
       * @param {Object} _object 
       */

      this.search = function (_object, kinopoisk_id) {
        object = _object;
        select_id = kinopoisk_id;
        select_title = object.search || object.movie.title;

        if (!object.clarification && object.movie.imdb_id && select_id != object.movie.imdb_id) {
          select_id += ',' + object.movie.imdb_id;
        }

        getFirstTranlate(select_id, function (voice) {
          getFilm(select_id, voice);
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
        component.loading(true);
        getFirstTranlate(select_id, function (voice) {
          getFilm(select_id, voice);
        });
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
        var voice = extract.voice[choice.voice];
        choice.voice_id = voice.id;
        getFilm(select_id, voice);
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

      function getSeasons(voice, call) {
        var url = embed + 'serial/' + voice.token + '/iframe?h=gidonline.io';
        if (voice.d) url += '&d=' + encodeURIComponent(voice.d);
        network.clear();
        network.timeout(10000);
        network["native"](url, function (str) {
          extractData(str);
          call();
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        }, false, {
          dataType: 'text'
        });
      }

      function getChoiceVoice() {
        var res = extract.voice[0];

        if (choice.voice_id) {
          extract.voice.forEach(function (voice) {
            if (voice.id === choice.voice_id) res = voice;
          });
        } else if (choice.voice_name) {
          extract.voice.forEach(function (voice) {
            if (voice.name === choice.voice_name) res = voice;
          });
        }

        return res;
      }

      function getFirstTranlate(id, call) {
        network.clear();
        network.timeout(10000);
        network["native"](embed + 'embed/' + id, function (str) {
          extractData(str);

          if (extract.voice.length) {
            var voice = getChoiceVoice();
            choice.voice_id = voice.id;
            choice.voice_name = voice.name;
            call(voice);
          } else component.emptyForQuery(select_title);
        }, function (a, c) {
          if (a.status == 404 && a.responseText && a.responseText.indexOf('Видео не найдено') !== -1 || a.status == 0 && a.statusText !== 'timeout') {
            component.emptyForQuery(select_title);
          } else component.empty(network.errorDecode(a, c));
        }, false, {
          dataType: 'text'
        });
      }

      function getEmbed(url) {
        network.clear();
        network.timeout(10000);
        network["native"](url, function (str) {
          component.loading(false);
          extractData(str);
          filter();
          append();
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        }, false, {
          dataType: 'text'
        });
      }
      /**
       * Запросить фильм
       * @param {Int} id 
       * @param {String} voice 
       */


      function getFilm(id, voice) {
        var url = embed;

        if (voice && voice.token) {
          if (extract.season.length) {
            var ses = extract.season[Math.min(extract.season.length - 1, choice.season)].id;
            url += 'serial/' + voice.token + '/iframe?s=' + ses + '&h=gidonline.io';
            if (voice.d) url += '&d=' + encodeURIComponent(voice.d);
            return getSeasons(voice, function () {
              var check = extract.season.filter(function (s) {
                return s.id == ses;
              });

              if (!check.length) {
                choice.season = extract.season.length - 1;
                url = embed + 'serial/' + voice.token + '/iframe?s=' + extract.season[choice.season].id + '&h=gidonline.io';
                if (voice.d) url += '&d=' + encodeURIComponent(voice.d);
              }

              getEmbed(url);
            });
          } else {
            url += 'movie/' + voice.token + '/iframe?h=gidonline.io';
            if (voice.d) url += '&d=' + encodeURIComponent(voice.d);
            getEmbed(url);
          }
        } else {
          url += 'embed/' + id;
          getEmbed(url);
        }
      }
      /**
       * Построить фильтр
       */


      function filter() {
        filter_items = {
          season: extract.season.map(function (v) {
            return v.name;
          }),
          voice: extract.season.length ? extract.voice.map(function (v) {
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

        component.filter(filter_items, choice);
      }

      function parseSubtitles(str) {
        var subtitles = [];
        var subtitle = str.match("'subtitle': '(.*?)'");

        if (subtitle) {
          subtitles = component.parsePlaylist(subtitle[1]).map(function (item) {
            var link = item.links[0] || '';

            if (prefer_http) {
              link = link.replace('https://', 'http://');
            } else {
              link = link.replace('http://', 'https://');
            }

            return {
              label: item.label,
              url: link
            };
          });
        }

        return subtitles.length ? subtitles : false;
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
            var quality = item.label.match(/(\d\d\d+)p/);
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

            if (prefer_http) {
              link = link.replace('https://', 'http://');
            } else {
              link = link.replace('http://', 'https://');
            }

            return {
              label: item.label,
              quality: quality ? parseInt(quality[1]) : NaN,
              file: link
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


      function getStream(element, call, error) {
        if (element.stream) return call(element);
        var url = embed;

        if (element.season) {
          url += 'serial/' + element.voice.token + '/iframe?s=' + element.season + '&e=' + element.episode + '&h=gidonline.io';
        } else {
          url += 'movie/' + element.voice.token + '/iframe?h=gidonline.io';
        }

        if (element.voice.d) url += '&d=' + encodeURIComponent(element.voice.d);

        var call_success = function call_success(str) {
          var videos = str.match("'file': '(.*?)'");

          if (videos) {
            var video = decode(videos[1]),
                file = '',
                quality = false;
            var items = extractItems(video);

            if (items && items.length) {
              file = items[0].file;
              quality = {};
              items.forEach(function (item) {
                quality[item.label] = item.file;
              });
              var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
              if (quality[preferably]) file = quality[preferably];
            }

            if (file) {
              element.stream = file;
              element.qualitys = quality;
              element.subtitles = parseSubtitles(str);
              call(element);
            } else error();
          } else error();
        };

        if (iframe_proxy) {
          component.proxyCall('GET', url, 5000, null, call_success, error);
        } else {
          network.clear();
          network.timeout(5000);
          network["native"](url, call_success, error, false, {
            dataType: 'text'
          });
        }
      }

      function decode(data) {
        if (data.charAt(0) !== '#') return data;

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

        var trashList = ['$$$####!!!!!!!', '^^^^^^##@', '@!^^!@#@@$$$$$', '^^#@@!!@#!$', '@#!@@@##$$@@'];
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
       * Получить данные о фильме
       * @param {String} str 
       */


      function extractData(str) {
        extract.voice = [];
        extract.season = [];
        extract.episode = [];
        str = str.replace(/\n/g, '');
        var voices = str.match('<select name="translator"[^>]+>(.*?)</select>');
        var sesons = str.match('<select name="season"[^>]+>(.*?)</select>');
        var episod = str.match('<select name="episode"[^>]+>(.*?)</select>');

        if (sesons) {
          var select = $('<select>' + sesons[1] + '</select>');
          $('option', select).each(function () {
            extract.season.push({
              id: $(this).attr('value'),
              name: $(this).text()
            });
          });
        }

        if (voices) {
          var _select = $('<select>' + voices[1] + '</select>');

          $('option', _select).each(function () {
            var token = $(this).attr('data-token');

            if (token) {
              extract.voice.push({
                token: token,
                d: $(this).attr('data-d'),
                name: $(this).text(),
                id: $(this).val()
              });
            }
          });
        }

        if (episod) {
          var _select2 = $('<select>' + episod[1] + '</select>');

          $('option', _select2).each(function () {
            extract.episode.push({
              id: $(this).attr('value'),
              name: $(this).text()
            });
          });
        }
      }
      /**
       * Показать файлы
       */


      function append() {
        component.reset();
        var items = [];
        var viewed = Lampa.Storage.cache('online_view', 5000, []);

        if (extract.season.length) {
          var ses = extract.season[Math.min(extract.season.length - 1, choice.season)].id;
          var voice = getChoiceVoice();
          extract.episode.forEach(function (episode) {
            items.push({
              title: 'S' + ses + ' / ' + episode.name,
              quality: '360p ~ 1080p',
              info: ' / ' + voice.name,
              season: parseInt(ses),
              episode: parseInt(episode.id),
              voice: voice
            });
          });
        } else {
          extract.voice.forEach(function (voice) {
            items.push({
              title: voice.name || select_title,
              quality: '360p ~ 1080p',
              info: '',
              voice: voice
            });
          });
        }

        var last_episode = component.getLastEpisode(items);
        items.forEach(function (element) {
          if (element.season) {
            element.translate_episode_end = last_episode;
            element.translate_voice = element.voice.name;
          }

          var hash = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var view = Lampa.Timeline.view(hash);
          var item = Lampa.Template.get('online_mod', element);
          var hash_file = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.voice.name].join('') : object.movie.original_title + element.voice.name);
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
                url: element.stream,
                quality: element.qualitys,
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
                          cell.url = elem.stream;
                          cell.quality = elem.qualitys;
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

    function rezka2(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prefer_mp4 = Lampa.Storage.field('online_mod_prefer_mp4') === true;
      var proxy_mirror = Lampa.Storage.field('online_mod_proxy_rezka2_mirror') === true;
      var prox = component.proxy('rezka2');
      var host = prox && !proxy_mirror ? 'https://hdrezka.ag' : Utils.rezka2Mirror();
      var embed = prox + host + '/';
      var logged_in = Lampa.Storage.field('online_mod_rezka2_status') === true && !prox;
      var network_call = logged_in ? network.silent : network["native"];
      var headers = Lampa.Platform.is('android') && !logged_in ? {
        'Origin': host,
        'Referer': host + '/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
      } : {};
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };
      /**
       * Поиск
       * @param {Object} _object
       */

      this.search = function (_object, kinopoisk_id, data) {
        var _this = this;

        object = _object;
        select_title = object.search || object.movie.title;
        if (this.wait_similars && data && data[0].is_similars) return getPage(data[0].link);
        var search_date = object.search_date || !object.clarification && (object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date) || '0000';
        var search_year = parseInt((search_date + '').slice(0, 4));
        var orig = object.movie.original_title || object.movie.original_name;
        var url = embed + 'engine/ajax/search.php';

        var display = function display(links) {
          if (links && links.length) {
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
              if (orig) {
                var tmp = cards.filter(function (c) {
                  return component.containsTitle(c.orig_title, orig) || component.containsTitle(c.title, orig);
                });

                if (tmp.length) {
                  cards = tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp = cards.filter(function (c) {
                  return component.containsTitle(c.title, select_title) || component.containsTitle(c.orig_title, select_title);
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

                if (orig) {
                  is_sure |= component.equalTitle(cards[0].orig_title, orig) || component.equalTitle(cards[0].title, orig);
                }

                if (select_title) {
                  is_sure |= component.equalTitle(cards[0].title, select_title) || component.equalTitle(cards[0].orig_title, select_title);
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
          } else component.emptyForQuery(select_title);
        };

        var query_search = function query_search(query, data, callback) {
          var postdata = 'q=' + encodeURIComponent(query);
          network.clear();
          network.timeout(10000);
          network_call(url, function (str) {
            str = str.replace(/\n/g, '');
            var links = str.match(/<li><a href=.*?<\/li>/g);
            if (links && links.length) data = data.concat(links);
            if (callback) callback(data);
          }, function (a, c) {
            component.empty(network.errorDecode(a, c));
          }, postdata, {
            dataType: 'text',
            withCredentials: logged_in,
            headers: headers
          });
        };

        var query_title_search = function query_title_search() {
          query_search(component.cleanTitle(select_title), [], function (data) {
            if (data && data.length) display(data);else display([]);
          });
        };

        if (!object.clarification && (object.movie.imdb_id || +object.movie.kinopoisk_id)) {
          query_search('+' + (object.movie.imdb_id || +object.movie.kinopoisk_id), [], function (data) {
            if (data && data.length) display(data);else if (object.movie.imdb_id && +object.movie.kinopoisk_id) {
              query_search('+' + +object.movie.kinopoisk_id, [], function (data) {
                if (data && data.length) display(data);else query_title_search();
              });
            } else query_title_search();
          });
        } else query_title_search();
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
        url = url.indexOf('://') == -1 ? embed + (url.startsWith('/') ? url.substring(1) : url) : prox + url;
        network.clear();
        network.timeout(10000);
        network_call(url, function (str) {
          extractData(str);

          if (extract.film_id) {
            getEpisodes(success);
          } else component.emptyForQuery(select_title);
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
        str = str.replace(/\n/g, '');
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
              network_call(url, function (json) {
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

        if (json.seasons) {
          var select = $('<ul>' + json.seasons + '</ul>');
          $('.b-simple_season__item', select).each(function () {
            data.season.push({
              name: $(this).text(),
              id: $(this).attr('data-tab_id')
            });
          });
        }

        if (json.episodes) {
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
          season: extract.season.map(function (v) {
            return v.name;
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
        network_call(url, function (json) {
          if (json.url) {
            var video = decode(json.url),
                file = '',
                quality = false;
            var items = extractItems(video);

            if (items && items.length) {
              file = apn(items[0].file);
              quality = {};
              items.forEach(function (item) {
                quality[item.label] = apn(item.file);
              });
              var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
              if (quality[preferably]) file = quality[preferably];else if (preferably === '1440p' && quality['2K']) file = quality['2K'];else if (preferably === '2160p' && quality['4K']) file = quality['4K'];
            }

            if (file) {
              element.stream = file;
              element.qualitys = quality;
              element.subtitles = parseSubtitles(json.subtitle);
              call(element);
            } else error();
          } else error();
        }, error, postdata, {
          withCredentials: logged_in,
          headers: headers
        });
      }

      function decode(data) {
        if (data.charAt(0) !== '#') return data;

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

            if (prefer_http) {
              link = link.replace('https://', 'http://');
            } else {
              link = link.replace('http://', 'https://');
            }

            return {
              label: item.label,
              quality: int_quality,
              file: link
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

            if (prefer_http) {
              link = link.replace('https://', 'http://');
            } else {
              link = link.replace('http://', 'https://');
            }

            return {
              label: item.label,
              url: link
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
                title: 'S' + episode.season_id + ' / ' + episode.name,
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
                url: element.stream,
                quality: element.qualitys,
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
                          cell.url = elem.stream;
                          cell.quality = elem.qualitys;
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
              Lampa.Noty.show(Lampa.Lang.translate(extract.blocked ? 'online_mod_blockedlink' : 'online_mod_nolink'));
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
                Lampa.Noty.show(Lampa.Lang.translate(extract.blocked ? 'online_mod_blockedlink' : 'online_mod_nolink'));
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
      var prox = component.proxy('kinobase');
      var token = Lampa.Storage.field('online_mod_kinobase_token');
      var host = prox ? 'https://kinobase.org' : Utils.kinobaseMirror();
      var embed = prox + host + '/';
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
        var url = embed + "search?query=" + encodeURIComponent(component.cleanTitle(select_title));
        network.clear();
        network.timeout(1000 * 10);
        network["native"](url, function (str) {
          str = str.replace(/\n/g, '');
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
          withCredentials: !prox,
          headers: Lampa.Platform.is('android') ? {
            'Origin': host,
            'Referer': host + '/'
          } : {}
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
                  title: 'S' + season + ' / ' + title,
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
            url: link
          };
        });
        return subtitles.length ? subtitles : false;
      }
      /**
       * Получить данные о фильме
       * @param {String} str
       */


      function extractData(str, page) {
        var quality_match = page.match(/<li><b>Качество:<\/b>([^<,]+)<\/li>/i);
        var translation_match = page.match(/<li><b>Перевод:<\/b>([^<,]+)<\/li>/i);
        quality_type = quality_match ? quality_match[1].trim() : '';
        translation = translation_match ? translation_match[1].trim() : '';
        var vod = str.split('|');

        if (vod[0] == 'file') {
          var file = vod[1];
          var found = [];
          var subtiles = parseSubs(vod[2]);

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
        } else if (vod[0] == 'pl') {
          extract = Lampa.Arrays.decodeJson(vod[1], []);
          is_playlist = true;
        } else component.emptyForQuery(select_title);
      }

      function getUrlWithParams(url, params) {
        url = url || '';
        url = url.indexOf('://') == -1 ? host + '/' + (url.startsWith('/') ? url.substring(1) : url) : url;

        if (params) {
          for (var name in params) {
            var value = params[name];
            url = Lampa.Utils.addUrlComponent(url, encodeURIComponent(name) + "=" + encodeURIComponent(value));
          }
        }

        return url;
      }

      function getPage(url) {
        url = url.indexOf('://') == -1 ? host + '/' + (url.startsWith('/') ? url.substring(1) : url) : url;
        var cookie = 'csid=' + token + '; player_type=new; file_type=' + (prefer_mp4 ? "mp4" : "hls");
        var headers = Lampa.Platform.is('android') ? {
          'Origin': host,
          'Referer': url,
          'Cookie': cookie
        } : {};
        var page_prox = prox;

        if (page_prox) {
          page_prox += 'param?Origin=' + encodeURIComponent(host) + '/';
          page_prox += 'param?Referer=' + encodeURIComponent(url) + '/';
          page_prox += 'param?Cookie=' + encodeURIComponent(cookie) + '/';
        }

        network.clear();
        network.timeout(1000 * 10);
        network["native"](page_prox + url, function (str) {
          str = str.replace(/\n/g, '');
          var MOVIE_ID = str.match('var MOVIE_ID = (\\d+);');
          var PLAYER_CUID = str.match('var PLAYER_CUID = "([^"]+)";');
          var IDENTIFIER = str.match('var IDENTIFIER = "([^"]+)";');

          if (MOVIE_ID && PLAYER_CUID && IDENTIFIER) {
            var user_url = page_prox + getUrlWithParams('/user_data', {
              page: 'movie',
              movie_id: MOVIE_ID[1],
              cuid: PLAYER_CUID[1],
              '_': Date.now()
            });
            network.clear();
            network.timeout(1000 * 10);
            network["native"](user_url, function (data) {
              if (data && data.vod_hash != null && data.vod_time != null) {
                var vod_url = page_prox + getUrlWithParams('/vod/' + MOVIE_ID[1], {
                  'identifier': IDENTIFIER[1],
                  'player_type': 'new',
                  'file_type': prefer_mp4 ? "mp4" : "hls",
                  'st': data.vod_hash,
                  'e': data.vod_time,
                  '_': Date.now()
                });
                network.clear();
                network.timeout(1000 * 10);
                network["native"](vod_url, function (files) {
                  component.loading(false);
                  extractData(files, str);
                  filter();
                  append(filtred());
                }, function (a, c) {
                  component.empty(network.errorDecode(a, c));
                }, false, {
                  dataType: 'text',
                  withCredentials: !prox,
                  headers: headers
                });
              } else component.emptyForQuery(select_title);
            }, function (a, c) {
              component.empty(network.errorDecode(a, c));
            }, false, {
              withCredentials: !prox,
              headers: headers
            });
          } else component.emptyForQuery(select_title);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        }, false, {
          dataType: 'text',
          withCredentials: !prox,
          headers: Lampa.Platform.is('android') ? {
            'Origin': host,
            'Referer': host + '/'
          } : {}
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
          var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
          if (quality[preferably]) file = quality[preferably];
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
                url: element.stream,
                quality: element.qualitys,
                subtitles: element.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (element.season) {
                items.forEach(function (elem) {
                  getStream(elem);
                  playlist.push({
                    url: elem.stream,
                    quality: elem.qualitys,
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

    function collaps(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prefer_dash = Lampa.Storage.field('online_mod_prefer_dash') === true;
      var prox = component.proxy('collaps');
      var embed = prox + (prefer_http || prox ? 'http:' : 'https:') + '//api.lessornot.ws/embed/';
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0
      };

      function collaps_api_search(api, callback, error) {
        network.clear();
        network.timeout(10000);
        network.silent(embed + api, function (str) {
          if (callback) callback(str || '');
        }, function (a, c) {
          if (a.status == 404 && a.responseText && a.responseText.indexOf('видео недоступно') !== -1 || a.status == 0 && a.statusText !== 'timeout') {
            if (callback) callback('');
          } else if (error) error(network.errorDecode(a, c));
        }, false, {
          dataType: 'text'
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
        str = str.replace(/\n/g, '');
        var find = str.match('makePlayer\\(({.*?})\\);');
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
                var file = prefer_dash && episode.dash || episode.hls || '';
                if (prefer_http) file = file.replace('https://', 'http://');
                filtred.push({
                  title: episode.title,
                  quality: '360p ~ 1080p',
                  info: audio_names.length ? ' / ' + component.uniqueNamesShortText(audio_names, 80) : '',
                  season: season.season,
                  episode: parseInt(episode.episode),
                  file: file,
                  subtitles: episode.cc ? episode.cc.map(function (c) {
                    var url = c.url || '';
                    if (prefer_http) url = url.replace('https://', 'http://');
                    return {
                      label: c.name,
                      url: url
                    };
                  }) : false,
                  audio_tracks: audio_tracks.length ? audio_tracks : false
                });
              });
            }
          });
        } else if (extract.source) {
          var resolution = Lampa.Arrays.getKeys(extract.qualityByWidth).pop();
          var max_quality = extract.qualityByWidth ? extract.qualityByWidth[resolution] || 0 : 0;
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
          var file = prefer_dash && extract.source.dash || extract.source.hls || '';
          if (prefer_http) file = file.replace('https://', 'http://');
          filtred.push({
            title: extract.title || select_title,
            quality: max_quality ? max_quality + 'p' : '360p ~ 1080p',
            info: audio_names.length ? ' / ' + component.uniqueNamesShortText(audio_names, 80) : '',
            file: file,
            subtitles: extract.source.cc ? extract.source.cc.map(function (c) {
              var url = c.url || '';
              if (prefer_http) url = url.replace('https://', 'http://');
              return {
                label: c.name,
                url: url
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
          item.on('hover:enter', function () {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);

            if (element.file) {
              var playlist = [];
              var first = {
                url: element.file,
                subtitles: element.subtitles,
                translate: {
                  tracks: element.audio_tracks
                },
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (element.season) {
                items.forEach(function (elem) {
                  playlist.push({
                    url: elem.file,
                    subtitles: elem.subtitles,
                    translate: {
                      tracks: elem.audio_tracks
                    },
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
      var prefer_http = false;
      var prefer_mp4 = false;
      var prox = component.proxy('cdnmovies');
      var host = 'https://cdnmovies.net';
      var embed = prox + 'https://skinny-wilderness.cdnmovies-stream.online/';
      var iframe_proxy = !prox && Lampa.Storage.field('online_mod_iframe_proxy') === true && !window.location.protocol.startsWith('http');
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
          if ((a.status == 404 || a.status == 403) && a.responseText && (a.responseText.indexOf('<title>Not Found</title>') !== -1 || a.responseText.indexOf('Не найдено!') !== -1 || a.responseText.indexOf('Контент не найден или недоступен в вашем регионе!') !== -1) || a.status == 0 && a.statusText !== 'timeout') {
            if (callback) callback('');
          } else if (error) error(network.errorDecode(a, c));
        };

        if (iframe_proxy) {
          component.proxyCall2('GET', embed + api, 10000, null, call_success, call_error);
        } else {
          var meta = $('head meta[name="referrer"]');
          var referrer = meta.attr('content') || 'never';
          meta.attr('content', 'origin');

          try {
            network.clear();
            network.timeout(10000);
            network["native"](embed + api, call_success, call_error, false, {
              dataType: 'text',
              headers: Lampa.Platform.is('android') ? {
                'Origin': host,
                'Referer': host + '/'
              } : {}
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
        str = str.replace(/\n/g, '');
        var video;
        var app = str.match(/(<div id="app" data-page=[^>]*>)/);

        if (app) {
          var page = $(app[1] + '</div>').attr('data-page') || '';
          var json;

          try {
            json = page && JSON.parse(page);
          } catch (e) {}

          var player = json && json.props && json.props.player && decode(json.props.player);

          try {
            video = player && JSON.parse(player);
          } catch (e) {}
        }

        if (video) {
          component.loading(false);
          extract = video;
          filter();
          append(filtred());
        } else empty();
      }

      function decode(data) {
        if (data.charAt(0) !== '#') return data;

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
            if (prefer_http) ;
            if (prefer_mp4) ;
            return {
              label: item.label,
              quality: quality ? parseInt(quality[1]) : NaN,
              file: link
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
          var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
          if (quality[preferably]) file = quality[preferably];
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

        if (url.charAt(0) === '[') {
          parseStream(element, call, error, extractItemsPlaylist, url, '');
          return;
        }

        url = url.replace('/sundb.coldcdn.xyz/', '/sundb.nl/');

        if (url) {
          element.stream = url;
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
          return {
            label: item.label,
            url: link
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
                  e.folder.forEach(function (v) {
                    var voice = v.title || v.comment || '';

                    if (voice == filter_items.voice[choice.voice]) {
                      var episode_num = parseInt(e_title.match(/\d+/));
                      var season_num = parseInt(s_title.match(/\d+/));
                      filtred.push({
                        title: 'S' + season_num + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + episode_num,
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
                url: element.stream,
                quality: element.qualitys,
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
                          cell.url = elem.stream;
                          cell.quality = elem.qualitys;
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
      var embed = prox + 'http://filmixapp.cyou/api/v2/';
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
      var secret_part = '';
      var secret_timestamp = null;

      function decodeSecretToken(callback) {
        if (!debug) {
          if (callback) callback();
          return;
        }

        if (secret_part) secret = '$1/s/' + secret_part + Lampa.Utils.uid(3) + '/';
        var timestamp = new Date().getTime();
        var cache_timestamp = timestamp - 1000 * 60 * 10;

        if (secret && secret_timestamp && secret_timestamp > cache_timestamp) {
          if (callback) callback();
          return;
        }

        var url = Utils.decodeSecret([80, 68, 77, 68, 64, 3, 27, 31, 86, 79, 81, 23, 64, 92, 22, 64, 85, 89, 72, 31, 81, 85, 64, 81, 82, 89, 89, 81, 72, 23, 64, 75, 77]);

        if (!url.startsWith('http')) {
          if (callback) callback();
          return;
        }

        url = Lampa.Utils.addUrlComponent(url, 'v=' + Date.now());
        network.clear();
        network.timeout(10000);
        network.silent(url, function (str) {
          if (str) {
            secret_part = str;
            secret = '$1/s/' + secret_part + Lampa.Utils.uid(3) + '/';
            secret_url = '';
            secret_timestamp = timestamp;
          }

          if (callback) callback();
        }, function (a, c) {
          if (callback) callback();
        }, false, {
          dataType: 'text'
        });
      }

      if (!window.mod_filmix) {
        window.mod_filmix = {
          max_qualitie: 720,
          is_max_qualitie: false
        };
      }

      var dev_id = '1d07ba88e4b45d30';
      var token = Lampa.Storage.get('filmix_token', '');
      var dev_token = '?user_dev_apk=2.0.1&user_dev_id=' + dev_id + '&user_dev_name=Xiaomi&user_dev_os=12&user_dev_token=' + (token || 'aaaabbbbccccddddeeeeffffaaaabbbb') + '&user_dev_vendor=Xiaomi';
      var abuse_token = '?user_dev_apk=2.0.1&user_dev_id=' + '&user_dev_name=Xiaomi&user_dev_os=12&user_dev_token=' + atob('YmMxNzBkZTNiMmNhZmIwOTI4M2I5MzYwMTFmMDU0ZWQ=') + '&user_dev_vendor=Xiaomi';
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
        var orig = object.movie.original_title || object.movie.original_name;
        var clean_title = component.cleanTitle(select_title).replace(/\b(\d\d\d\d+)\b/g, '+$1');

        if (search_year) {
          clean_title = clean_title.replace(new RegExp(' \\+(' + search_year + ')$'), ' $1');
        }

        var url = embed + 'search' + dev_token;
        url = Lampa.Utils.addUrlComponent(url, 'story=' + encodeURIComponent(clean_title));
        decodeSecretToken(function () {
          network.clear();
          network.timeout(10000);
          network.silent(url, function (json) {
            var is_sure = false;
            json.forEach(function (c) {
              if (!c.year && c.alt_name) c.year = parseInt(c.alt_name.split('-').pop());
            });
            var cards = json;

            if (cards.length) {
              if (orig) {
                var tmp = cards.filter(function (c) {
                  return component.containsTitle(c.original_title, orig) || component.containsTitle(c.title, orig);
                });

                if (tmp.length) {
                  cards = tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp = cards.filter(function (c) {
                  return component.containsTitle(c.title, select_title) || component.containsTitle(c.original_title, select_title);
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

                if (orig) {
                  is_sure |= component.equalTitle(cards[0].original_title, orig) || component.equalTitle(cards[0].title, orig);
                }

                if (select_title) {
                  is_sure |= component.equalTitle(cards[0].title, select_title) || component.equalTitle(cards[0].original_title, select_title);
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
          }, function (a, c) {
            component.empty(network.errorDecode(a, c));
          });
        });
      };

      function find(filmix_id, abuse) {
        var url = embed;

        if (!debug && !window.mod_filmix.is_max_qualitie && token) {
          window.mod_filmix.is_max_qualitie = true;
          network.clear();
          network.timeout(10000);
          network.silent(url + 'user_profile' + dev_token, function (found) {
            if (found && found.user_data) {
              if (found.user_data.is_pro) window.mod_filmix.max_qualitie = 1080;
              if (found.user_data.is_pro_plus) window.mod_filmix.max_qualitie = 2160;
            }

            end_search(filmix_id);
          });
        } else end_search(filmix_id);

        function end_search(filmix_id) {
          network.clear();
          network.timeout(10000);
          network.silent(url + 'post/' + filmix_id + (abuse ? abuse_token : dev_token), function (found) {
            if (found && Object.keys(found).length) {
              if (!abuse && checkAbuse(found)) find(filmix_id, true);else success(found);
            } else component.emptyForQuery(select_title);
          }, function (a, c) {
            component.empty(network.errorDecode(a, c));
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


      function success(json) {
        component.loading(false);
        extractData(json);
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
                if (!secret_part) {
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


      function extractData(data) {
        extract = {};
        var filmix_max_qualitie = debug ? 2160 : window.mod_filmix.max_qualitie;
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
                  if (prefer_http) stream_url = stream_url.replace('https://', 'http://');

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

            if (prefer_http) _stream_url = _stream_url.replace('https://', 'http://');

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

          var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
          if (quality[preferably]) file = quality[preferably];
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
              title: 'S' + media.season + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + media.episode,
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
                url: extra.file,
                quality: extra.quality,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (element.season) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: ex.file,
                    quality: ex.quality,
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

    function videodb(component, _object) {
      var network = new Lampa.Reguest();
      var extract = [];
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prox = component.proxy('videodb');
      var host = (prefer_http || prox ? 'http:' : 'https:') + '//kinoplay1.site';
      var embed = prox + host + '/iplayer/videodb.php';
      var iframe_proxy = !prox && Lampa.Storage.field('online_mod_iframe_proxy') === true && !window.location.protocol.startsWith('http');
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

        var url = Lampa.Utils.addUrlComponent(embed, 'kp=' + kinopoisk_id);
        if (object.movie.number_of_seasons) url = Lampa.Utils.addUrlComponent(url, 'series=true');

        var call_success = function call_success(str) {
          parse(str);
        };

        var call_error = function call_error(a, c) {
          component.empty(network.errorDecode(a, c));
        };

        if (iframe_proxy) {
          component.proxyCall('GET', url, 10000, null, call_success, call_error);
        } else {
          var meta = $('head meta[name="referrer"]');
          var referrer = meta.attr('content') || 'never';
          meta.attr('content', 'origin');

          try {
            network.clear();
            network.timeout(10000);
            network["native"](url, call_success, call_error, false, {
              dataType: 'text',
              headers: Lampa.Platform.is('android') ? {
                'Origin': host,
                'Referer': host + '/'
              } : {}
            });
          } finally {
            meta.attr('content', referrer);
          }
        }
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


      function extractItems(str) {
        if (!str) return [];

        try {
          var items = component.parsePlaylist(str).map(function (item) {
            var quality = item.label.match(/(\d\d\d+)p/);
            var link = item.links[0] || '';
            if (prefer_http) link = link.replace('https://', 'http://');
            return {
              label: item.label,
              quality: quality ? parseInt(quality[1]) : NaN,
              file: link
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
        var subtitles = str.split(',').map(function (link) {
          if (prefer_http) link = link.replace('https://', 'http://');
          return {
            label: link.split('/').pop(),
            url: link
          };
        }).filter(function (s) {
          return s.url;
        });
        return subtitles.length ? subtitles : false;
      }

      function parse(str) {
        component.loading(false);
        str = str.replace(/\n/g, '');
        var find = str.match('var config = ({.*?});');
        var json;

        try {
          json = find && (0, eval)('"use strict"; (function(){ var sign = function(){}; return ' + find[1] + '; })();');
        } catch (e) {}

        if (json && json.file) {
          extract = typeof json.file === 'string' ? [json] : json.file;
          extract.forEach(function (data) {
            if (data.folder) {
              data.folder.forEach(function (e) {
                if (e.folder) {
                  e.folder.forEach(function (v) {
                    v.media = {
                      items: extractItems(v.file),
                      subtitles: parseSubs(v.subtitle)
                    };
                  });
                }
              });
            } else {
              data.media = {
                items: extractItems(data.file),
                subtitles: parseSubs(data.subtitle)
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
        extract.forEach(function (s) {
          if (s.folder) filter_items.season.push(s.title || s.comment || '');
        });
        if (!filter_items.season[choice.season]) choice.season = 0;
        var s = extract[choice.season];

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
                  e.folder.forEach(function (v) {
                    var voice = v.title || v.comment || '';

                    if (voice == filter_items.voice[choice.voice]) {
                      var max_quality = v.media.items[0] || {};
                      var episode_num = parseInt(e_title.match(/\d+/));
                      var season_num = parseInt(s_title.match(/\d+/));
                      filtred.push({
                        title: 'S' + season_num + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + episode_num,
                        quality: max_quality.label || '360p ~ 1080p',
                        info: ' / ' + Lampa.Utils.shortText(voice, 50),
                        season: season_num,
                        episode: episode_num,
                        media: v.media
                      });
                    }
                  });
                }
              });
            }
          } else {
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
          file = apn(items[0].file);
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = apn(item.file);
          });
          var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
          if (quality[preferably]) file = quality[preferably];
        }

        return {
          file: file,
          quality: quality,
          subtitles: element.media.subtitles
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
                url: extra.file,
                quality: extra.quality,
                subtitles: extra.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (element.season) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: ex.file,
                    quality: ex.quality,
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
      var host = (prefer_http || prox ? 'http:' : 'https:') + '//zeflix.online';
      var embed = prox + host + '/iplayer/videodb.php';
      var iframe_proxy = !prox && Lampa.Storage.field('online_mod_iframe_proxy') === true && !window.location.protocol.startsWith('http');
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

        var url = Lampa.Utils.addUrlComponent(embed, 'kp=' + select_id);
        if (s) url = Lampa.Utils.addUrlComponent(url, 'season=' + s);

        var call_success = function call_success(str) {
          parse(str);
        };

        var call_error = function call_error(a, c) {
          component.empty(network.errorDecode(a, c));
        };

        if (iframe_proxy) {
          component.proxyCall('GET', url, 10000, null, call_success, call_error);
        } else {
          var meta = $('head meta[name="referrer"]');
          var referrer = meta.attr('content') || 'never';
          meta.attr('content', 'origin');

          try {
            network.clear();
            network.timeout(10000);
            network["native"](url, call_success, call_error, false, {
              dataType: 'text',
              headers: Lampa.Platform.is('android') ? {
                'Origin': host,
                'Referer': host + '/'
              } : {}
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
            if (prefer_http) link = link.replace('https://', 'http://');
            return {
              label: item.label,
              quality: quality ? parseInt(quality[1]) : NaN,
              file: link
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
        str = str.replace(/\n/g, '');
        var find = str.match('Playerjs\\(({.*?})\\);');
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
                var e_title = e.title || e.comment || '';
                var max_quality = e.media.items[0] || {};
                var episode_num = parseInt(e_title.match(/\d+/));
                var season_num = choice.season + 1;
                filtred.push({
                  title: 'S' + season_num + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + episode_num,
                  quality: max_quality.label || '360p ~ 1080p',
                  info: ' / ' + Lampa.Utils.shortText(voice, 50),
                  season: season_num,
                  episode: episode_num,
                  media: e.media
                });
              });
            }

            filtred.sort(function (a, b) {
              return a.episode - b.episode;
            });
          } else {
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
          file = apn(items[0].file);
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = apn(item.file);
          });
          var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
          if (quality[preferably]) file = quality[preferably];
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
                url: extra.file,
                quality: extra.quality,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (element.season) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: ex.file,
                    quality: ex.quality,
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

    function CryptoJS() {
      /*globals globalThis, ArrayBuffer, Int8Array, Int16Array, Int32Array, Uint8Array, Uint8ClampedArray, Uint16Array, Uint32Array, Float32Array, Float64Array*/

      /**
       * CryptoJS core components.
       */
      var CryptoJS = CryptoJS || function (Math, undefined$1) {
        var crypto; // Native crypto from window (Browser)

        if (typeof window !== 'undefined' && window.crypto) {
          crypto = window.crypto;
        } // Native crypto in web worker (Browser)


        if (typeof self !== 'undefined' && self.crypto) {
          crypto = self.crypto;
        } // Native crypto from worker


        if (typeof globalThis !== 'undefined' && globalThis.crypto) {
          crypto = globalThis.crypto;
        } // Native (experimental IE 11) crypto from window (Browser)


        if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
          crypto = window.msCrypto;
        } // Native crypto from global (NodeJS)


        if (!crypto && typeof global !== 'undefined' && global.crypto) {
          crypto = global.crypto;
        } // Native crypto import via require (NodeJS)


        if (!crypto && typeof require === 'function') {
          try {
            crypto = require('crypto');
          } catch (err) {}
        }
        /*
         * Cryptographically secure pseudorandom number generator
         *
         * As Math.random() is cryptographically not safe to use
         */


        var cryptoSecureRandomInt = function cryptoSecureRandomInt() {
          if (crypto) {
            // Use getRandomValues method (Browser)
            if (typeof crypto.getRandomValues === 'function') {
              try {
                return crypto.getRandomValues(new Uint32Array(1))[0];
              } catch (err) {}
            } // Use randomBytes method (NodeJS)


            if (typeof crypto.randomBytes === 'function') {
              try {
                return crypto.randomBytes(4).readInt32LE();
              } catch (err) {}
            }
          }

          throw new Error('Native crypto module could not be used to get secure random number.');
        };
        /*
         * Local polyfill of Object.create
           */


        var create = Object.create || function () {
          function F() {}

          return function (obj) {
            var subtype;
            F.prototype = obj;
            subtype = new F();
            F.prototype = null;
            return subtype;
          };
        }();
        /**
         * CryptoJS namespace.
         */


        var C = {};
        /**
         * Library namespace.
         */

        var C_lib = C.lib = {};
        /**
         * Base object for prototypal inheritance.
         */

        var Base = C_lib.Base = function () {
          return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function extend(overrides) {
              // Spawn
              var subtype = create(this); // Augment

              if (overrides) {
                subtype.mixIn(overrides);
              } // Create default initializer


              if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
                subtype.init = function () {
                  subtype.$super.init.apply(this, arguments);
                };
              } // Initializer's prototype is the subtype object


              subtype.init.prototype = subtype; // Reference supertype

              subtype.$super = this;
              return subtype;
            },

            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function create() {
              var instance = this.extend();
              instance.init.apply(instance, arguments);
              return instance;
            },

            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function init() {},

            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function mixIn(properties) {
              for (var propertyName in properties) {
                if (properties.hasOwnProperty(propertyName)) {
                  this[propertyName] = properties[propertyName];
                }
              } // IE won't copy toString using the loop above


              if (properties.hasOwnProperty('toString')) {
                this.toString = properties.toString;
              }
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function clone() {
              return this.init.prototype.extend(this);
            }
          };
        }();
        /**
         * An array of 32-bit words.
         *
         * @property {Array} words The array of 32-bit words.
         * @property {number} sigBytes The number of significant bytes in this word array.
         */


        var WordArray = C_lib.WordArray = Base.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of 32-bit words.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.create();
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
           */
          init: function init(words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined$1) {
              this.sigBytes = sigBytes;
            } else {
              this.sigBytes = words.length * 4;
            }
          },

          /**
           * Converts this word array to a string.
           *
           * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
           *
           * @return {string} The stringified word array.
           *
           * @example
           *
           *     var string = wordArray + '';
           *     var string = wordArray.toString();
           *     var string = wordArray.toString(CryptoJS.enc.Utf8);
           */
          toString: function toString(encoder) {
            return (encoder || Hex).stringify(this);
          },

          /**
           * Concatenates a word array to this word array.
           *
           * @param {WordArray} wordArray The word array to append.
           *
           * @return {WordArray} This word array.
           *
           * @example
           *
           *     wordArray1.concat(wordArray2);
           */
          concat: function concat(wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes; // Clamp excess bits

            this.clamp(); // Concat

            if (thisSigBytes % 4) {
              // Copy one byte at a time
              for (var i = 0; i < thatSigBytes; i++) {
                var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
                thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
              }
            } else {
              // Copy one word at a time
              for (var j = 0; j < thatSigBytes; j += 4) {
                thisWords[thisSigBytes + j >>> 2] = thatWords[j >>> 2];
              }
            }

            this.sigBytes += thatSigBytes; // Chainable

            return this;
          },

          /**
           * Removes insignificant bits.
           *
           * @example
           *
           *     wordArray.clamp();
           */
          clamp: function clamp() {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes; // Clamp

            words[sigBytes >>> 2] &= 0xffffffff << 32 - sigBytes % 4 * 8;
            words.length = Math.ceil(sigBytes / 4);
          },

          /**
           * Creates a copy of this word array.
           *
           * @return {WordArray} The clone.
           *
           * @example
           *
           *     var clone = wordArray.clone();
           */
          clone: function clone() {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);
            return clone;
          },

          /**
           * Creates a word array filled with random bytes.
           *
           * @param {number} nBytes The number of random bytes to generate.
           *
           * @return {WordArray} The random word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.random(16);
           */
          random: function random(nBytes) {
            var words = [];

            for (var i = 0; i < nBytes; i += 4) {
              words.push(cryptoSecureRandomInt());
            }

            return new WordArray.init(words, nBytes);
          }
        });
        /**
         * Encoder namespace.
         */

        var C_enc = C.enc = {};
        /**
         * Hex encoding strategy.
         */

        var Hex = C_enc.Hex = {
          /**
           * Converts a word array to a hex string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The hex string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
           */
          stringify: function stringify(wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes; // Convert

            var hexChars = [];

            for (var i = 0; i < sigBytes; i++) {
              var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
              hexChars.push((bite >>> 4).toString(16));
              hexChars.push((bite & 0x0f).toString(16));
            }

            return hexChars.join('');
          },

          /**
           * Converts a hex string to a word array.
           *
           * @param {string} hexStr The hex string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
           */
          parse: function parse(hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length; // Convert

            var words = [];

            for (var i = 0; i < hexStrLength; i += 2) {
              words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
            }

            return new WordArray.init(words, hexStrLength / 2);
          }
        };
        /**
         * Latin1 encoding strategy.
         */

        var Latin1 = C_enc.Latin1 = {
          /**
           * Converts a word array to a Latin1 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Latin1 string.
           *
           * @static
           *
           * @example
           *
           *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
           */
          stringify: function stringify(wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes; // Convert

            var latin1Chars = [];

            for (var i = 0; i < sigBytes; i++) {
              var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
              latin1Chars.push(String.fromCharCode(bite));
            }

            return latin1Chars.join('');
          },

          /**
           * Converts a Latin1 string to a word array.
           *
           * @param {string} latin1Str The Latin1 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
           */
          parse: function parse(latin1Str) {
            // Shortcut
            var latin1StrLength = latin1Str.length; // Convert

            var words = [];

            for (var i = 0; i < latin1StrLength; i++) {
              words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << 24 - i % 4 * 8;
            }

            return new WordArray.init(words, latin1StrLength);
          }
        };
        /**
         * UTF-8 encoding strategy.
         */

        var Utf8 = C_enc.Utf8 = {
          /**
           * Converts a word array to a UTF-8 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-8 string.
           *
           * @static
           *
           * @example
           *
           *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
           */
          stringify: function stringify(wordArray) {
            try {
              return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
              throw new Error('Malformed UTF-8 data');
            }
          },

          /**
           * Converts a UTF-8 string to a word array.
           *
           * @param {string} utf8Str The UTF-8 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
           */
          parse: function parse(utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
          }
        };
        /**
         * Abstract buffered block algorithm template.
         *
         * The property blockSize must be implemented in a concrete subtype.
         *
         * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
         */

        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
          /**
           * Resets this block algorithm's data buffer to its initial state.
           *
           * @example
           *
           *     bufferedBlockAlgorithm.reset();
           */
          reset: function reset() {
            // Initial values
            this._data = new WordArray.init();
            this._nDataBytes = 0;
          },

          /**
           * Adds new data to this block algorithm's buffer.
           *
           * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
           *
           * @example
           *
           *     bufferedBlockAlgorithm._append('data');
           *     bufferedBlockAlgorithm._append(wordArray);
           */
          _append: function _append(data) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof data == 'string') {
              data = Utf8.parse(data);
            } // Append


            this._data.concat(data);

            this._nDataBytes += data.sigBytes;
          },

          /**
           * Processes available data blocks.
           *
           * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
           *
           * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
           *
           * @return {WordArray} The processed data.
           *
           * @example
           *
           *     var processedData = bufferedBlockAlgorithm._process();
           *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
           */
          _process: function _process(doFlush) {
            var processedWords; // Shortcuts

            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4; // Count blocks ready

            var nBlocksReady = dataSigBytes / blockSizeBytes;

            if (doFlush) {
              // Round up to include partial blocks
              nBlocksReady = Math.ceil(nBlocksReady);
            } else {
              // Round down to include only full blocks,
              // less the number of blocks that must remain in the buffer
              nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            } // Count words ready


            var nWordsReady = nBlocksReady * blockSize; // Count bytes ready

            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes); // Process blocks

            if (nWordsReady) {
              for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                // Perform concrete-algorithm logic
                this._doProcessBlock(dataWords, offset);
              } // Remove processed words


              processedWords = dataWords.splice(0, nWordsReady);
              data.sigBytes -= nBytesReady;
            } // Return processed words


            return new WordArray.init(processedWords, nBytesReady);
          },

          /**
           * Creates a copy of this object.
           *
           * @return {Object} The clone.
           *
           * @example
           *
           *     var clone = bufferedBlockAlgorithm.clone();
           */
          clone: function clone() {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();
            return clone;
          },
          _minBufferSize: 0
        });
        /**
         * Abstract hasher template.
         *
         * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
         */

        C_lib.Hasher = BufferedBlockAlgorithm.extend({
          /**
           * Configuration options.
           */
          cfg: Base.extend(),

          /**
           * Initializes a newly created hasher.
           *
           * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
           *
           * @example
           *
           *     var hasher = CryptoJS.algo.SHA256.create();
           */
          init: function init(cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg); // Set initial values

            this.reset();
          },

          /**
           * Resets this hasher to its initial state.
           *
           * @example
           *
           *     hasher.reset();
           */
          reset: function reset() {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this); // Perform concrete-hasher logic

            this._doReset();
          },

          /**
           * Updates this hasher with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {Hasher} This hasher.
           *
           * @example
           *
           *     hasher.update('message');
           *     hasher.update(wordArray);
           */
          update: function update(messageUpdate) {
            // Append
            this._append(messageUpdate); // Update the hash


            this._process(); // Chainable


            return this;
          },

          /**
           * Finalizes the hash computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The hash.
           *
           * @example
           *
           *     var hash = hasher.finalize();
           *     var hash = hasher.finalize('message');
           *     var hash = hasher.finalize(wordArray);
           */
          finalize: function finalize(messageUpdate) {
            // Final message update
            if (messageUpdate) {
              this._append(messageUpdate);
            } // Perform concrete-hasher logic


            var hash = this._doFinalize();

            return hash;
          },
          blockSize: 512 / 32,

          /**
           * Creates a shortcut function to a hasher's object interface.
           *
           * @param {Hasher} hasher The hasher to create a helper for.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
           */
          _createHelper: function _createHelper(hasher) {
            return function (message, cfg) {
              return new hasher.init(cfg).finalize(message);
            };
          },

          /**
           * Creates a shortcut function to the HMAC's object interface.
           *
           * @param {Hasher} hasher The hasher to use in this HMAC helper.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
           */
          _createHmacHelper: function _createHmacHelper(hasher) {
            return function (message, key) {
              return new C_algo.HMAC.init(hasher, key).finalize(message);
            };
          }
        });
        /**
         * Algorithm namespace.
         */

        var C_algo = C.algo = {};
        return C;
      }(Math);

      (function (undefined$1) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var X32WordArray = C_lib.WordArray;
        /**
         * x64 namespace.
         */

        var C_x64 = C.x64 = {};
        /**
         * A 64-bit word.
         */

        C_x64.Word = Base.extend({
          /**
           * Initializes a newly created 64-bit word.
           *
           * @param {number} high The high 32 bits.
           * @param {number} low The low 32 bits.
           *
           * @example
           *
           *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
           */
          init: function init(high, low) {
            this.high = high;
            this.low = low;
          }
          /**
           * Bitwise NOTs this word.
           *
           * @return {X64Word} A new x64-Word object after negating.
           *
           * @example
           *
           *     var negated = x64Word.not();
           */
          // not: function () {
          // var high = ~this.high;
          // var low = ~this.low;
          // return X64Word.create(high, low);
          // },

          /**
           * Bitwise ANDs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to AND with this word.
           *
           * @return {X64Word} A new x64-Word object after ANDing.
           *
           * @example
           *
           *     var anded = x64Word.and(anotherX64Word);
           */
          // and: function (word) {
          // var high = this.high & word.high;
          // var low = this.low & word.low;
          // return X64Word.create(high, low);
          // },

          /**
           * Bitwise ORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to OR with this word.
           *
           * @return {X64Word} A new x64-Word object after ORing.
           *
           * @example
           *
           *     var ored = x64Word.or(anotherX64Word);
           */
          // or: function (word) {
          // var high = this.high | word.high;
          // var low = this.low | word.low;
          // return X64Word.create(high, low);
          // },

          /**
           * Bitwise XORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to XOR with this word.
           *
           * @return {X64Word} A new x64-Word object after XORing.
           *
           * @example
           *
           *     var xored = x64Word.xor(anotherX64Word);
           */
          // xor: function (word) {
          // var high = this.high ^ word.high;
          // var low = this.low ^ word.low;
          // return X64Word.create(high, low);
          // },

          /**
           * Shifts this word n bits to the left.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftL(25);
           */
          // shiftL: function (n) {
          // if (n < 32) {
          // var high = (this.high << n) | (this.low >>> (32 - n));
          // var low = this.low << n;
          // } else {
          // var high = this.low << (n - 32);
          // var low = 0;
          // }
          // return X64Word.create(high, low);
          // },

          /**
           * Shifts this word n bits to the right.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftR(7);
           */
          // shiftR: function (n) {
          // if (n < 32) {
          // var low = (this.low >>> n) | (this.high << (32 - n));
          // var high = this.high >>> n;
          // } else {
          // var low = this.high >>> (n - 32);
          // var high = 0;
          // }
          // return X64Word.create(high, low);
          // },

          /**
           * Rotates this word n bits to the left.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotL(25);
           */
          // rotL: function (n) {
          // return this.shiftL(n).or(this.shiftR(64 - n));
          // },

          /**
           * Rotates this word n bits to the right.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotR(7);
           */
          // rotR: function (n) {
          // return this.shiftR(n).or(this.shiftL(64 - n));
          // },

          /**
           * Adds this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to add with this word.
           *
           * @return {X64Word} A new x64-Word object after adding.
           *
           * @example
           *
           *     var added = x64Word.add(anotherX64Word);
           */
          // add: function (word) {
          // var low = (this.low + word.low) | 0;
          // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
          // var high = (this.high + word.high + carry) | 0;
          // return X64Word.create(high, low);
          // }

        });
        /**
         * An array of 64-bit words.
         *
         * @property {Array} words The array of CryptoJS.x64.Word objects.
         * @property {number} sigBytes The number of significant bytes in this word array.
         */

        C_x64.WordArray = Base.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.x64.WordArray.create();
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ]);
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ], 10);
           */
          init: function init(words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined$1) {
              this.sigBytes = sigBytes;
            } else {
              this.sigBytes = words.length * 8;
            }
          },

          /**
           * Converts this 64-bit word array to a 32-bit word array.
           *
           * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
           *
           * @example
           *
           *     var x32WordArray = x64WordArray.toX32();
           */
          toX32: function toX32() {
            // Shortcuts
            var x64Words = this.words;
            var x64WordsLength = x64Words.length; // Convert

            var x32Words = [];

            for (var i = 0; i < x64WordsLength; i++) {
              var x64Word = x64Words[i];
              x32Words.push(x64Word.high);
              x32Words.push(x64Word.low);
            }

            return X32WordArray.create(x32Words, this.sigBytes);
          },

          /**
           * Creates a copy of this word array.
           *
           * @return {X64WordArray} The clone.
           *
           * @example
           *
           *     var clone = x64WordArray.clone();
           */
          clone: function clone() {
            var clone = Base.clone.call(this); // Clone "words" array

            var words = clone.words = this.words.slice(0); // Clone each X64Word object

            var wordsLength = words.length;

            for (var i = 0; i < wordsLength; i++) {
              words[i] = words[i].clone();
            }

            return clone;
          }
        });
      })();

      (function () {
        // Check if typed arrays are supported
        if (typeof ArrayBuffer != 'function') {
          return;
        } // Shortcuts


        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray; // Reference original init

        var superInit = WordArray.init; // Augment WordArray.init to handle typed arrays

        var subInit = WordArray.init = function (typedArray) {
          // Convert buffers to uint8
          if (typedArray instanceof ArrayBuffer) {
            typedArray = new Uint8Array(typedArray);
          } // Convert other array views to uint8


          if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) {
            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
          } // Handle Uint8Array


          if (typedArray instanceof Uint8Array) {
            // Shortcut
            var typedArrayByteLength = typedArray.byteLength; // Extract bytes

            var words = [];

            for (var i = 0; i < typedArrayByteLength; i++) {
              words[i >>> 2] |= typedArray[i] << 24 - i % 4 * 8;
            } // Initialize this word array


            superInit.call(this, words, typedArrayByteLength);
          } else {
            // Else call normal init
            superInit.apply(this, arguments);
          }
        };

        subInit.prototype = WordArray;
      })();

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;
        /**
         * UTF-16 BE encoding strategy.
         */

        C_enc.Utf16 = C_enc.Utf16BE = {
          /**
           * Converts a word array to a UTF-16 BE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 BE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
           */
          stringify: function stringify(wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes; // Convert

            var utf16Chars = [];

            for (var i = 0; i < sigBytes; i += 2) {
              var codePoint = words[i >>> 2] >>> 16 - i % 4 * 8 & 0xffff;
              utf16Chars.push(String.fromCharCode(codePoint));
            }

            return utf16Chars.join('');
          },

          /**
           * Converts a UTF-16 BE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 BE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
           */
          parse: function parse(utf16Str) {
            // Shortcut
            var utf16StrLength = utf16Str.length; // Convert

            var words = [];

            for (var i = 0; i < utf16StrLength; i++) {
              words[i >>> 1] |= utf16Str.charCodeAt(i) << 16 - i % 2 * 16;
            }

            return WordArray.create(words, utf16StrLength * 2);
          }
        };
        /**
         * UTF-16 LE encoding strategy.
         */

        C_enc.Utf16LE = {
          /**
           * Converts a word array to a UTF-16 LE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 LE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
           */
          stringify: function stringify(wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes; // Convert

            var utf16Chars = [];

            for (var i = 0; i < sigBytes; i += 2) {
              var codePoint = swapEndian(words[i >>> 2] >>> 16 - i % 4 * 8 & 0xffff);
              utf16Chars.push(String.fromCharCode(codePoint));
            }

            return utf16Chars.join('');
          },

          /**
           * Converts a UTF-16 LE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 LE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
           */
          parse: function parse(utf16Str) {
            // Shortcut
            var utf16StrLength = utf16Str.length; // Convert

            var words = [];

            for (var i = 0; i < utf16StrLength; i++) {
              words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << 16 - i % 2 * 16);
            }

            return WordArray.create(words, utf16StrLength * 2);
          }
        };

        function swapEndian(word) {
          return word << 8 & 0xff00ff00 | word >>> 8 & 0x00ff00ff;
        }
      })();

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;
        /**
         * Base64 encoding strategy.
         */

        C_enc.Base64 = {
          /**
           * Converts a word array to a Base64 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Base64 string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
           */
          stringify: function stringify(wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map; // Clamp excess bits

            wordArray.clamp(); // Convert

            var base64Chars = [];

            for (var i = 0; i < sigBytes; i += 3) {
              var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
              var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 0xff;
              var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 0xff;
              var triplet = byte1 << 16 | byte2 << 8 | byte3;

              for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 0x3f));
              }
            } // Add padding


            var paddingChar = map.charAt(64);

            if (paddingChar) {
              while (base64Chars.length % 4) {
                base64Chars.push(paddingChar);
              }
            }

            return base64Chars.join('');
          },

          /**
           * Converts a Base64 string to a word array.
           *
           * @param {string} base64Str The Base64 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
           */
          parse: function parse(base64Str) {
            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = this._map;
            var reverseMap = this._reverseMap;

            if (!reverseMap) {
              reverseMap = this._reverseMap = [];

              for (var j = 0; j < map.length; j++) {
                reverseMap[map.charCodeAt(j)] = j;
              }
            } // Ignore padding


            var paddingChar = map.charAt(64);

            if (paddingChar) {
              var paddingIndex = base64Str.indexOf(paddingChar);

              if (paddingIndex !== -1) {
                base64StrLength = paddingIndex;
              }
            } // Convert


            return parseLoop(base64Str, base64StrLength, reverseMap);
          },
          _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
        };

        function parseLoop(base64Str, base64StrLength, reverseMap) {
          var words = [];
          var nBytes = 0;

          for (var i = 0; i < base64StrLength; i++) {
            if (i % 4) {
              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2;
              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
              var bitsCombined = bits1 | bits2;
              words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
              nBytes++;
            }
          }

          return WordArray.create(words, nBytes);
        }
      })();

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_enc = C.enc;
        /**
         * Base64url encoding strategy.
         */

        C_enc.Base64url = {
          /**
           * Converts a word array to a Base64url string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {string} The Base64url string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
           */
          stringify: function stringify(wordArray) {
            var urlSafe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = urlSafe ? this._safe_map : this._map; // Clamp excess bits

            wordArray.clamp(); // Convert

            var base64Chars = [];

            for (var i = 0; i < sigBytes; i += 3) {
              var byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
              var byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 0xff;
              var byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 0xff;
              var triplet = byte1 << 16 | byte2 << 8 | byte3;

              for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 0x3f));
              }
            } // Add padding


            var paddingChar = map.charAt(64);

            if (paddingChar) {
              while (base64Chars.length % 4) {
                base64Chars.push(paddingChar);
              }
            }

            return base64Chars.join('');
          },

          /**
           * Converts a Base64url string to a word array.
           *
           * @param {string} base64Str The Base64url string.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
           */
          parse: function parse(base64Str) {
            var urlSafe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = urlSafe ? this._safe_map : this._map;
            var reverseMap = this._reverseMap;

            if (!reverseMap) {
              reverseMap = this._reverseMap = [];

              for (var j = 0; j < map.length; j++) {
                reverseMap[map.charCodeAt(j)] = j;
              }
            } // Ignore padding


            var paddingChar = map.charAt(64);

            if (paddingChar) {
              var paddingIndex = base64Str.indexOf(paddingChar);

              if (paddingIndex !== -1) {
                base64StrLength = paddingIndex;
              }
            } // Convert


            return parseLoop(base64Str, base64StrLength, reverseMap);
          },
          _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
          _safe_map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
        };

        function parseLoop(base64Str, base64StrLength, reverseMap) {
          var words = [];
          var nBytes = 0;

          for (var i = 0; i < base64StrLength; i++) {
            if (i % 4) {
              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << i % 4 * 2;
              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> 6 - i % 4 * 2;
              var bitsCombined = bits1 | bits2;
              words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
              nBytes++;
            }
          }

          return WordArray.create(words, nBytes);
        }
      })();

      (function (Math) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo; // Constants table

        var T = []; // Compute constants

        (function () {
          for (var i = 0; i < 64; i++) {
            T[i] = Math.abs(Math.sin(i + 1)) * 0x100000000 | 0;
          }
        })();
        /**
         * MD5 hash algorithm.
         */


        var MD5 = C_algo.MD5 = Hasher.extend({
          _doReset: function _doReset() {
            this._hash = new WordArray.init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
          },
          _doProcessBlock: function _doProcessBlock(M, offset) {
            // Swap endian
            for (var i = 0; i < 16; i++) {
              // Shortcuts
              var offset_i = offset + i;
              var M_offset_i = M[offset_i];
              M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 0x00ff00ff | (M_offset_i << 24 | M_offset_i >>> 8) & 0xff00ff00;
            } // Shortcuts


            var H = this._hash.words;
            var M_offset_0 = M[offset + 0];
            var M_offset_1 = M[offset + 1];
            var M_offset_2 = M[offset + 2];
            var M_offset_3 = M[offset + 3];
            var M_offset_4 = M[offset + 4];
            var M_offset_5 = M[offset + 5];
            var M_offset_6 = M[offset + 6];
            var M_offset_7 = M[offset + 7];
            var M_offset_8 = M[offset + 8];
            var M_offset_9 = M[offset + 9];
            var M_offset_10 = M[offset + 10];
            var M_offset_11 = M[offset + 11];
            var M_offset_12 = M[offset + 12];
            var M_offset_13 = M[offset + 13];
            var M_offset_14 = M[offset + 14];
            var M_offset_15 = M[offset + 15]; // Working varialbes

            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3]; // Computation

            a = FF(a, b, c, d, M_offset_0, 7, T[0]);
            d = FF(d, a, b, c, M_offset_1, 12, T[1]);
            c = FF(c, d, a, b, M_offset_2, 17, T[2]);
            b = FF(b, c, d, a, M_offset_3, 22, T[3]);
            a = FF(a, b, c, d, M_offset_4, 7, T[4]);
            d = FF(d, a, b, c, M_offset_5, 12, T[5]);
            c = FF(c, d, a, b, M_offset_6, 17, T[6]);
            b = FF(b, c, d, a, M_offset_7, 22, T[7]);
            a = FF(a, b, c, d, M_offset_8, 7, T[8]);
            d = FF(d, a, b, c, M_offset_9, 12, T[9]);
            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
            a = FF(a, b, c, d, M_offset_12, 7, T[12]);
            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
            b = FF(b, c, d, a, M_offset_15, 22, T[15]);
            a = GG(a, b, c, d, M_offset_1, 5, T[16]);
            d = GG(d, a, b, c, M_offset_6, 9, T[17]);
            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
            b = GG(b, c, d, a, M_offset_0, 20, T[19]);
            a = GG(a, b, c, d, M_offset_5, 5, T[20]);
            d = GG(d, a, b, c, M_offset_10, 9, T[21]);
            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
            b = GG(b, c, d, a, M_offset_4, 20, T[23]);
            a = GG(a, b, c, d, M_offset_9, 5, T[24]);
            d = GG(d, a, b, c, M_offset_14, 9, T[25]);
            c = GG(c, d, a, b, M_offset_3, 14, T[26]);
            b = GG(b, c, d, a, M_offset_8, 20, T[27]);
            a = GG(a, b, c, d, M_offset_13, 5, T[28]);
            d = GG(d, a, b, c, M_offset_2, 9, T[29]);
            c = GG(c, d, a, b, M_offset_7, 14, T[30]);
            b = GG(b, c, d, a, M_offset_12, 20, T[31]);
            a = HH(a, b, c, d, M_offset_5, 4, T[32]);
            d = HH(d, a, b, c, M_offset_8, 11, T[33]);
            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
            a = HH(a, b, c, d, M_offset_1, 4, T[36]);
            d = HH(d, a, b, c, M_offset_4, 11, T[37]);
            c = HH(c, d, a, b, M_offset_7, 16, T[38]);
            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
            a = HH(a, b, c, d, M_offset_13, 4, T[40]);
            d = HH(d, a, b, c, M_offset_0, 11, T[41]);
            c = HH(c, d, a, b, M_offset_3, 16, T[42]);
            b = HH(b, c, d, a, M_offset_6, 23, T[43]);
            a = HH(a, b, c, d, M_offset_9, 4, T[44]);
            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
            b = HH(b, c, d, a, M_offset_2, 23, T[47]);
            a = II(a, b, c, d, M_offset_0, 6, T[48]);
            d = II(d, a, b, c, M_offset_7, 10, T[49]);
            c = II(c, d, a, b, M_offset_14, 15, T[50]);
            b = II(b, c, d, a, M_offset_5, 21, T[51]);
            a = II(a, b, c, d, M_offset_12, 6, T[52]);
            d = II(d, a, b, c, M_offset_3, 10, T[53]);
            c = II(c, d, a, b, M_offset_10, 15, T[54]);
            b = II(b, c, d, a, M_offset_1, 21, T[55]);
            a = II(a, b, c, d, M_offset_8, 6, T[56]);
            d = II(d, a, b, c, M_offset_15, 10, T[57]);
            c = II(c, d, a, b, M_offset_6, 15, T[58]);
            b = II(b, c, d, a, M_offset_13, 21, T[59]);
            a = II(a, b, c, d, M_offset_4, 6, T[60]);
            d = II(d, a, b, c, M_offset_11, 10, T[61]);
            c = II(c, d, a, b, M_offset_2, 15, T[62]);
            b = II(b, c, d, a, M_offset_9, 21, T[63]); // Intermediate hash value

            H[0] = H[0] + a | 0;
            H[1] = H[1] + b | 0;
            H[2] = H[2] + c | 0;
            H[3] = H[3] + d | 0;
          },
          _doFinalize: function _doFinalize() {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8; // Add padding

            dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
            var nBitsTotalL = nBitsTotal;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 0x00ff00ff | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 0xff00ff00;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 0x00ff00ff | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 0xff00ff00;
            data.sigBytes = (dataWords.length + 1) * 4; // Hash final blocks

            this._process(); // Shortcuts


            var hash = this._hash;
            var H = hash.words; // Swap endian

            for (var i = 0; i < 4; i++) {
              // Shortcut
              var H_i = H[i];
              H[i] = (H_i << 8 | H_i >>> 24) & 0x00ff00ff | (H_i << 24 | H_i >>> 8) & 0xff00ff00;
            } // Return final computed hash


            return hash;
          },
          clone: function clone() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          }
        });

        function FF(a, b, c, d, x, s, t) {
          var n = a + (b & c | ~b & d) + x + t;
          return (n << s | n >>> 32 - s) + b;
        }

        function GG(a, b, c, d, x, s, t) {
          var n = a + (b & d | c & ~d) + x + t;
          return (n << s | n >>> 32 - s) + b;
        }

        function HH(a, b, c, d, x, s, t) {
          var n = a + (b ^ c ^ d) + x + t;
          return (n << s | n >>> 32 - s) + b;
        }

        function II(a, b, c, d, x, s, t) {
          var n = a + (c ^ (b | ~d)) + x + t;
          return (n << s | n >>> 32 - s) + b;
        }
        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.MD5('message');
         *     var hash = CryptoJS.MD5(wordArray);
         */


        C.MD5 = Hasher._createHelper(MD5);
        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacMD5(message, key);
         */

        C.HmacMD5 = Hasher._createHmacHelper(MD5);
      })(Math);

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo; // Reusable object

        var W = [];
        /**
         * SHA-1 hash algorithm.
         */

        var SHA1 = C_algo.SHA1 = Hasher.extend({
          _doReset: function _doReset() {
            this._hash = new WordArray.init([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
          },
          _doProcessBlock: function _doProcessBlock(M, offset) {
            // Shortcut
            var H = this._hash.words; // Working variables

            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4]; // Computation

            for (var i = 0; i < 80; i++) {
              if (i < 16) {
                W[i] = M[offset + i] | 0;
              } else {
                var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                W[i] = n << 1 | n >>> 31;
              }

              var t = (a << 5 | a >>> 27) + e + W[i];

              if (i < 20) {
                t += (b & c | ~b & d) + 0x5a827999;
              } else if (i < 40) {
                t += (b ^ c ^ d) + 0x6ed9eba1;
              } else if (i < 60) {
                t += (b & c | b & d | c & d) - 0x70e44324;
              } else
                /* if (i < 80) */
                {
                  t += (b ^ c ^ d) - 0x359d3e2a;
                }

              e = d;
              d = c;
              c = b << 30 | b >>> 2;
              b = a;
              a = t;
            } // Intermediate hash value


            H[0] = H[0] + a | 0;
            H[1] = H[1] + b | 0;
            H[2] = H[2] + c | 0;
            H[3] = H[3] + d | 0;
            H[4] = H[4] + e | 0;
          },
          _doFinalize: function _doFinalize() {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8; // Add padding

            dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4; // Hash final blocks

            this._process(); // Return final computed hash


            return this._hash;
          },
          clone: function clone() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          }
        });
        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.SHA1('message');
         *     var hash = CryptoJS.SHA1(wordArray);
         */

        C.SHA1 = Hasher._createHelper(SHA1);
        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacSHA1(message, key);
         */

        C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
      })();

      (function (Math) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo; // Initialization and round constants tables

        var H = [];
        var K = []; // Compute constants

        (function () {
          function isPrime(n) {
            var sqrtN = Math.sqrt(n);

            for (var factor = 2; factor <= sqrtN; factor++) {
              if (!(n % factor)) {
                return false;
              }
            }

            return true;
          }

          function getFractionalBits(n) {
            return (n - (n | 0)) * 0x100000000 | 0;
          }

          var n = 2;
          var nPrime = 0;

          while (nPrime < 64) {
            if (isPrime(n)) {
              if (nPrime < 8) {
                H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
              }

              K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
              nPrime++;
            }

            n++;
          }
        })(); // Reusable object


        var W = [];
        /**
         * SHA-256 hash algorithm.
         */

        var SHA256 = C_algo.SHA256 = Hasher.extend({
          _doReset: function _doReset() {
            this._hash = new WordArray.init(H.slice(0));
          },
          _doProcessBlock: function _doProcessBlock(M, offset) {
            // Shortcut
            var H = this._hash.words; // Working variables

            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            var f = H[5];
            var g = H[6];
            var h = H[7]; // Computation

            for (var i = 0; i < 64; i++) {
              if (i < 16) {
                W[i] = M[offset + i] | 0;
              } else {
                var gamma0x = W[i - 15];
                var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
                var gamma1x = W[i - 2];
                var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
                W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
              }

              var ch = e & f ^ ~e & g;
              var maj = a & b ^ a & c ^ b & c;
              var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
              var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
              var t1 = h + sigma1 + ch + K[i] + W[i];
              var t2 = sigma0 + maj;
              h = g;
              g = f;
              f = e;
              e = d + t1 | 0;
              d = c;
              c = b;
              b = a;
              a = t1 + t2 | 0;
            } // Intermediate hash value


            H[0] = H[0] + a | 0;
            H[1] = H[1] + b | 0;
            H[2] = H[2] + c | 0;
            H[3] = H[3] + d | 0;
            H[4] = H[4] + e | 0;
            H[5] = H[5] + f | 0;
            H[6] = H[6] + g | 0;
            H[7] = H[7] + h | 0;
          },
          _doFinalize: function _doFinalize() {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8; // Add padding

            dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4; // Hash final blocks

            this._process(); // Return final computed hash


            return this._hash;
          },
          clone: function clone() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          }
        });
        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.SHA256('message');
         *     var hash = CryptoJS.SHA256(wordArray);
         */

        C.SHA256 = Hasher._createHelper(SHA256);
        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacSHA256(message, key);
         */

        C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
      })(Math);

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var SHA256 = C_algo.SHA256;
        /**
         * SHA-224 hash algorithm.
         */

        var SHA224 = C_algo.SHA224 = SHA256.extend({
          _doReset: function _doReset() {
            this._hash = new WordArray.init([0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4]);
          },
          _doFinalize: function _doFinalize() {
            var hash = SHA256._doFinalize.call(this);

            hash.sigBytes -= 4;
            return hash;
          }
        });
        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.SHA224('message');
         *     var hash = CryptoJS.SHA224(wordArray);
         */

        C.SHA224 = SHA256._createHelper(SHA224);
        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacSHA224(message, key);
         */

        C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
      })();

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Hasher = C_lib.Hasher;
        var C_x64 = C.x64;
        var X64Word = C_x64.Word;
        var X64WordArray = C_x64.WordArray;
        var C_algo = C.algo;

        function X64Word_create() {
          return X64Word.create.apply(X64Word, arguments);
        } // Constants


        var K = [X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd), X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc), X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019), X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118), X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe), X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2), X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1), X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694), X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3), X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65), X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483), X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5), X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210), X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4), X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725), X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70), X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926), X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df), X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8), X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b), X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001), X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30), X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910), X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8), X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53), X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8), X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb), X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3), X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60), X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec), X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9), X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b), X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207), X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178), X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6), X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b), X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493), X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c), X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a), X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)]; // Reusable objects

        var W = [];

        (function () {
          for (var i = 0; i < 80; i++) {
            W[i] = X64Word_create();
          }
        })();
        /**
         * SHA-512 hash algorithm.
         */


        var SHA512 = C_algo.SHA512 = Hasher.extend({
          _doReset: function _doReset() {
            this._hash = new X64WordArray.init([new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b), new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1), new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f), new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)]);
          },
          _doProcessBlock: function _doProcessBlock(M, offset) {
            // Shortcuts
            var H = this._hash.words;
            var H0 = H[0];
            var H1 = H[1];
            var H2 = H[2];
            var H3 = H[3];
            var H4 = H[4];
            var H5 = H[5];
            var H6 = H[6];
            var H7 = H[7];
            var H0h = H0.high;
            var H0l = H0.low;
            var H1h = H1.high;
            var H1l = H1.low;
            var H2h = H2.high;
            var H2l = H2.low;
            var H3h = H3.high;
            var H3l = H3.low;
            var H4h = H4.high;
            var H4l = H4.low;
            var H5h = H5.high;
            var H5l = H5.low;
            var H6h = H6.high;
            var H6l = H6.low;
            var H7h = H7.high;
            var H7l = H7.low; // Working variables

            var ah = H0h;
            var al = H0l;
            var bh = H1h;
            var bl = H1l;
            var ch = H2h;
            var cl = H2l;
            var dh = H3h;
            var dl = H3l;
            var eh = H4h;
            var el = H4l;
            var fh = H5h;
            var fl = H5l;
            var gh = H6h;
            var gl = H6l;
            var hh = H7h;
            var hl = H7l; // Rounds

            for (var i = 0; i < 80; i++) {
              var Wil;
              var Wih; // Shortcut

              var Wi = W[i]; // Extend message

              if (i < 16) {
                Wih = Wi.high = M[offset + i * 2] | 0;
                Wil = Wi.low = M[offset + i * 2 + 1] | 0;
              } else {
                // Gamma0
                var gamma0x = W[i - 15];
                var gamma0xh = gamma0x.high;
                var gamma0xl = gamma0x.low;
                var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
                var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25); // Gamma1

                var gamma1x = W[i - 2];
                var gamma1xh = gamma1x.high;
                var gamma1xl = gamma1x.low;
                var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
                var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26); // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]

                var Wi7 = W[i - 7];
                var Wi7h = Wi7.high;
                var Wi7l = Wi7.low;
                var Wi16 = W[i - 16];
                var Wi16h = Wi16.high;
                var Wi16l = Wi16.low;
                Wil = gamma0l + Wi7l;
                Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
                Wil = Wil + gamma1l;
                Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
                Wil = Wil + Wi16l;
                Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);
                Wi.high = Wih;
                Wi.low = Wil;
              }

              var chh = eh & fh ^ ~eh & gh;
              var chl = el & fl ^ ~el & gl;
              var majh = ah & bh ^ ah & ch ^ bh & ch;
              var majl = al & bl ^ al & cl ^ bl & cl;
              var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
              var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
              var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
              var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9); // t1 = h + sigma1 + ch + K[i] + W[i]

              var Ki = K[i];
              var Kih = Ki.high;
              var Kil = Ki.low;
              var t1l = hl + sigma1l;
              var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
              var t1l = t1l + chl;
              var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
              var t1l = t1l + Kil;
              var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
              var t1l = t1l + Wil;
              var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0); // t2 = sigma0 + maj

              var t2l = sigma0l + majl;
              var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0); // Update working variables

              hh = gh;
              hl = gl;
              gh = fh;
              gl = fl;
              fh = eh;
              fl = el;
              el = dl + t1l | 0;
              eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
              dh = ch;
              dl = cl;
              ch = bh;
              cl = bl;
              bh = ah;
              bl = al;
              al = t1l + t2l | 0;
              ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
            } // Intermediate hash value


            H0l = H0.low = H0l + al;
            H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
            H1l = H1.low = H1l + bl;
            H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
            H2l = H2.low = H2l + cl;
            H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
            H3l = H3.low = H3l + dl;
            H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
            H4l = H4.low = H4l + el;
            H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
            H5l = H5.low = H5l + fl;
            H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
            H6l = H6.low = H6l + gl;
            H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
            H7l = H7.low = H7l + hl;
            H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
          },
          _doFinalize: function _doFinalize() {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8; // Add padding

            dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
            dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
            data.sigBytes = dataWords.length * 4; // Hash final blocks

            this._process(); // Convert hash to 32-bit word array before returning


            var hash = this._hash.toX32(); // Return final computed hash


            return hash;
          },
          clone: function clone() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          },
          blockSize: 1024 / 32
        });
        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.SHA512('message');
         *     var hash = CryptoJS.SHA512(wordArray);
         */

        C.SHA512 = Hasher._createHelper(SHA512);
        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacSHA512(message, key);
         */

        C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
      })();

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_x64 = C.x64;
        var X64Word = C_x64.Word;
        var X64WordArray = C_x64.WordArray;
        var C_algo = C.algo;
        var SHA512 = C_algo.SHA512;
        /**
         * SHA-384 hash algorithm.
         */

        var SHA384 = C_algo.SHA384 = SHA512.extend({
          _doReset: function _doReset() {
            this._hash = new X64WordArray.init([new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507), new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939), new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511), new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)]);
          },
          _doFinalize: function _doFinalize() {
            var hash = SHA512._doFinalize.call(this);

            hash.sigBytes -= 16;
            return hash;
          }
        });
        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.SHA384('message');
         *     var hash = CryptoJS.SHA384(wordArray);
         */

        C.SHA384 = SHA512._createHelper(SHA384);
        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacSHA384(message, key);
         */

        C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
      })();

      (function (Math) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_x64 = C.x64;
        var X64Word = C_x64.Word;
        var C_algo = C.algo; // Constants tables

        var RHO_OFFSETS = [];
        var PI_INDEXES = [];
        var ROUND_CONSTANTS = []; // Compute Constants

        (function () {
          // Compute rho offset constants
          var x = 1,
              y = 0;

          for (var t = 0; t < 24; t++) {
            RHO_OFFSETS[x + 5 * y] = (t + 1) * (t + 2) / 2 % 64;
            var newX = y % 5;
            var newY = (2 * x + 3 * y) % 5;
            x = newX;
            y = newY;
          } // Compute pi index constants


          for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 5; y++) {
              PI_INDEXES[x + 5 * y] = y + (2 * x + 3 * y) % 5 * 5;
            }
          } // Compute round constants


          var LFSR = 0x01;

          for (var i = 0; i < 24; i++) {
            var roundConstantMsw = 0;
            var roundConstantLsw = 0;

            for (var j = 0; j < 7; j++) {
              if (LFSR & 0x01) {
                var bitPosition = (1 << j) - 1;

                if (bitPosition < 32) {
                  roundConstantLsw ^= 1 << bitPosition;
                } else
                  /* if (bitPosition >= 32) */
                  {
                    roundConstantMsw ^= 1 << bitPosition - 32;
                  }
              } // Compute next LFSR


              if (LFSR & 0x80) {
                // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
                LFSR = LFSR << 1 ^ 0x71;
              } else {
                LFSR <<= 1;
              }
            }

            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
          }
        })(); // Reusable objects for temporary values


        var T = [];

        (function () {
          for (var i = 0; i < 25; i++) {
            T[i] = X64Word.create();
          }
        })();
        /**
         * SHA-3 hash algorithm.
         */


        var SHA3 = C_algo.SHA3 = Hasher.extend({
          /**
           * Configuration options.
           *
           * @property {number} outputLength
           *   The desired number of bits in the output hash.
           *   Only values permitted are: 224, 256, 384, 512.
           *   Default: 512
           */
          cfg: Hasher.cfg.extend({
            outputLength: 512
          }),
          _doReset: function _doReset() {
            var state = this._state = [];

            for (var i = 0; i < 25; i++) {
              state[i] = new X64Word.init();
            }

            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
          },
          _doProcessBlock: function _doProcessBlock(M, offset) {
            // Shortcuts
            var state = this._state;
            var nBlockSizeLanes = this.blockSize / 2; // Absorb

            for (var i = 0; i < nBlockSizeLanes; i++) {
              // Shortcuts
              var M2i = M[offset + 2 * i];
              var M2i1 = M[offset + 2 * i + 1]; // Swap endian

              M2i = (M2i << 8 | M2i >>> 24) & 0x00ff00ff | (M2i << 24 | M2i >>> 8) & 0xff00ff00;
              M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 0x00ff00ff | (M2i1 << 24 | M2i1 >>> 8) & 0xff00ff00; // Absorb message into state

              var lane = state[i];
              lane.high ^= M2i1;
              lane.low ^= M2i;
            } // Rounds


            for (var round = 0; round < 24; round++) {
              // Theta
              for (var x = 0; x < 5; x++) {
                // Mix column lanes
                var tMsw = 0,
                    tLsw = 0;

                for (var y = 0; y < 5; y++) {
                  var lane = state[x + 5 * y];
                  tMsw ^= lane.high;
                  tLsw ^= lane.low;
                } // Temporary values


                var Tx = T[x];
                Tx.high = tMsw;
                Tx.low = tLsw;
              }

              for (var x = 0; x < 5; x++) {
                // Shortcuts
                var Tx4 = T[(x + 4) % 5];
                var Tx1 = T[(x + 1) % 5];
                var Tx1Msw = Tx1.high;
                var Tx1Lsw = Tx1.low; // Mix surrounding columns

                var tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
                var tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);

                for (var y = 0; y < 5; y++) {
                  var lane = state[x + 5 * y];
                  lane.high ^= tMsw;
                  lane.low ^= tLsw;
                }
              } // Rho Pi


              for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
                var tMsw;
                var tLsw; // Shortcuts

                var lane = state[laneIndex];
                var laneMsw = lane.high;
                var laneLsw = lane.low;
                var rhoOffset = RHO_OFFSETS[laneIndex]; // Rotate lanes

                if (rhoOffset < 32) {
                  tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
                  tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
                } else
                  /* if (rhoOffset >= 32) */
                  {
                    tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
                    tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
                  } // Transpose lanes


                var TPiLane = T[PI_INDEXES[laneIndex]];
                TPiLane.high = tMsw;
                TPiLane.low = tLsw;
              } // Rho pi at x = y = 0


              var T0 = T[0];
              var state0 = state[0];
              T0.high = state0.high;
              T0.low = state0.low; // Chi

              for (var x = 0; x < 5; x++) {
                for (var y = 0; y < 5; y++) {
                  // Shortcuts
                  var laneIndex = x + 5 * y;
                  var lane = state[laneIndex];
                  var TLane = T[laneIndex];
                  var Tx1Lane = T[(x + 1) % 5 + 5 * y];
                  var Tx2Lane = T[(x + 2) % 5 + 5 * y]; // Mix rows

                  lane.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
                  lane.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
                }
              } // Iota


              var lane = state[0];
              var roundConstant = ROUND_CONSTANTS[round];
              lane.high ^= roundConstant.high;
              lane.low ^= roundConstant.low;
            }
          },
          _doFinalize: function _doFinalize() {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            var blockSizeBits = this.blockSize * 32; // Add padding

            dataWords[nBitsLeft >>> 5] |= 0x1 << 24 - nBitsLeft % 32;
            dataWords[(Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 0x80;
            data.sigBytes = dataWords.length * 4; // Hash final blocks

            this._process(); // Shortcuts


            var state = this._state;
            var outputLengthBytes = this.cfg.outputLength / 8;
            var outputLengthLanes = outputLengthBytes / 8; // Squeeze

            var hashWords = [];

            for (var i = 0; i < outputLengthLanes; i++) {
              // Shortcuts
              var lane = state[i];
              var laneMsw = lane.high;
              var laneLsw = lane.low; // Swap endian

              laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 0x00ff00ff | (laneMsw << 24 | laneMsw >>> 8) & 0xff00ff00;
              laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 0x00ff00ff | (laneLsw << 24 | laneLsw >>> 8) & 0xff00ff00; // Squeeze state to retrieve hash

              hashWords.push(laneLsw);
              hashWords.push(laneMsw);
            } // Return final computed hash


            return new WordArray.init(hashWords, outputLengthBytes);
          },
          clone: function clone() {
            var clone = Hasher.clone.call(this);

            var state = clone._state = this._state.slice(0);

            for (var i = 0; i < 25; i++) {
              state[i] = state[i].clone();
            }

            return clone;
          }
        });
        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.SHA3('message');
         *     var hash = CryptoJS.SHA3(wordArray);
         */

        C.SHA3 = Hasher._createHelper(SHA3);
        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacSHA3(message, key);
         */

        C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
      })(Math);
      /** @preserve
      (c) 2012 by Cédric Mesnil. All rights reserved.
      
      Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
      
          - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
          - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
      
      THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
      */


      (function (Math) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo; // Constants table

        var _zl = WordArray.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]);

        var _zr = WordArray.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]);

        var _sl = WordArray.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]);

        var _sr = WordArray.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]);

        var _hl = WordArray.create([0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);

        var _hr = WordArray.create([0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);
        /**
         * RIPEMD160 hash algorithm.
         */


        var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
          _doReset: function _doReset() {
            this._hash = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
          },
          _doProcessBlock: function _doProcessBlock(M, offset) {
            // Swap endian
            for (var i = 0; i < 16; i++) {
              // Shortcuts
              var offset_i = offset + i;
              var M_offset_i = M[offset_i]; // Swap

              M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 0x00ff00ff | (M_offset_i << 24 | M_offset_i >>> 8) & 0xff00ff00;
            } // Shortcut


            var H = this._hash.words;
            var hl = _hl.words;
            var hr = _hr.words;
            var zl = _zl.words;
            var zr = _zr.words;
            var sl = _sl.words;
            var sr = _sr.words; // Working variables

            var al, bl, cl, dl, el;
            var ar, br, cr, dr, er;
            ar = al = H[0];
            br = bl = H[1];
            cr = cl = H[2];
            dr = dl = H[3];
            er = el = H[4]; // Computation

            var t;

            for (var i = 0; i < 80; i += 1) {
              t = al + M[offset + zl[i]] | 0;

              if (i < 16) {
                t += f1(bl, cl, dl) + hl[0];
              } else if (i < 32) {
                t += f2(bl, cl, dl) + hl[1];
              } else if (i < 48) {
                t += f3(bl, cl, dl) + hl[2];
              } else if (i < 64) {
                t += f4(bl, cl, dl) + hl[3];
              } else {
                // if (i<80) {
                t += f5(bl, cl, dl) + hl[4];
              }

              t = t | 0;
              t = rotl(t, sl[i]);
              t = t + el | 0;
              al = el;
              el = dl;
              dl = rotl(cl, 10);
              cl = bl;
              bl = t;
              t = ar + M[offset + zr[i]] | 0;

              if (i < 16) {
                t += f5(br, cr, dr) + hr[0];
              } else if (i < 32) {
                t += f4(br, cr, dr) + hr[1];
              } else if (i < 48) {
                t += f3(br, cr, dr) + hr[2];
              } else if (i < 64) {
                t += f2(br, cr, dr) + hr[3];
              } else {
                // if (i<80) {
                t += f1(br, cr, dr) + hr[4];
              }

              t = t | 0;
              t = rotl(t, sr[i]);
              t = t + er | 0;
              ar = er;
              er = dr;
              dr = rotl(cr, 10);
              cr = br;
              br = t;
            } // Intermediate hash value


            t = H[1] + cl + dr | 0;
            H[1] = H[2] + dl + er | 0;
            H[2] = H[3] + el + ar | 0;
            H[3] = H[4] + al + br | 0;
            H[4] = H[0] + bl + cr | 0;
            H[0] = t;
          },
          _doFinalize: function _doFinalize() {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8; // Add padding

            dataWords[nBitsLeft >>> 5] |= 0x80 << 24 - nBitsLeft % 32;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 0x00ff00ff | (nBitsTotal << 24 | nBitsTotal >>> 8) & 0xff00ff00;
            data.sigBytes = (dataWords.length + 1) * 4; // Hash final blocks

            this._process(); // Shortcuts


            var hash = this._hash;
            var H = hash.words; // Swap endian

            for (var i = 0; i < 5; i++) {
              // Shortcut
              var H_i = H[i]; // Swap

              H[i] = (H_i << 8 | H_i >>> 24) & 0x00ff00ff | (H_i << 24 | H_i >>> 8) & 0xff00ff00;
            } // Return final computed hash


            return hash;
          },
          clone: function clone() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          }
        });

        function f1(x, y, z) {
          return x ^ y ^ z;
        }

        function f2(x, y, z) {
          return x & y | ~x & z;
        }

        function f3(x, y, z) {
          return (x | ~y) ^ z;
        }

        function f4(x, y, z) {
          return x & z | y & ~z;
        }

        function f5(x, y, z) {
          return x ^ (y | ~z);
        }

        function rotl(x, n) {
          return x << n | x >>> 32 - n;
        }
        /**
         * Shortcut function to the hasher's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         *
         * @return {WordArray} The hash.
         *
         * @static
         *
         * @example
         *
         *     var hash = CryptoJS.RIPEMD160('message');
         *     var hash = CryptoJS.RIPEMD160(wordArray);
         */


        C.RIPEMD160 = Hasher._createHelper(RIPEMD160);
        /**
         * Shortcut function to the HMAC's object interface.
         *
         * @param {WordArray|string} message The message to hash.
         * @param {WordArray|string} key The secret key.
         *
         * @return {WordArray} The HMAC.
         *
         * @static
         *
         * @example
         *
         *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
         */

        C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
      })();

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var C_enc = C.enc;
        var Utf8 = C_enc.Utf8;
        var C_algo = C.algo;
        /**
         * HMAC algorithm.
         */

        C_algo.HMAC = Base.extend({
          /**
           * Initializes a newly created HMAC.
           *
           * @param {Hasher} hasher The hash algorithm to use.
           * @param {WordArray|string} key The secret key.
           *
           * @example
           *
           *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
           */
          init: function init(hasher, key) {
            // Init hasher
            hasher = this._hasher = new hasher.init(); // Convert string to WordArray, else assume WordArray already

            if (typeof key == 'string') {
              key = Utf8.parse(key);
            } // Shortcuts


            var hasherBlockSize = hasher.blockSize;
            var hasherBlockSizeBytes = hasherBlockSize * 4; // Allow arbitrary length keys

            if (key.sigBytes > hasherBlockSizeBytes) {
              key = hasher.finalize(key);
            } // Clamp excess bits


            key.clamp(); // Clone key for inner and outer pads

            var oKey = this._oKey = key.clone();
            var iKey = this._iKey = key.clone(); // Shortcuts

            var oKeyWords = oKey.words;
            var iKeyWords = iKey.words; // XOR keys with pad constants

            for (var i = 0; i < hasherBlockSize; i++) {
              oKeyWords[i] ^= 0x5c5c5c5c;
              iKeyWords[i] ^= 0x36363636;
            }

            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes; // Set initial values

            this.reset();
          },

          /**
           * Resets this HMAC to its initial state.
           *
           * @example
           *
           *     hmacHasher.reset();
           */
          reset: function reset() {
            // Shortcut
            var hasher = this._hasher; // Reset

            hasher.reset();
            hasher.update(this._iKey);
          },

          /**
           * Updates this HMAC with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {HMAC} This HMAC instance.
           *
           * @example
           *
           *     hmacHasher.update('message');
           *     hmacHasher.update(wordArray);
           */
          update: function update(messageUpdate) {
            this._hasher.update(messageUpdate); // Chainable


            return this;
          },

          /**
           * Finalizes the HMAC computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The HMAC.
           *
           * @example
           *
           *     var hmac = hmacHasher.finalize();
           *     var hmac = hmacHasher.finalize('message');
           *     var hmac = hmacHasher.finalize(wordArray);
           */
          finalize: function finalize(messageUpdate) {
            // Shortcut
            var hasher = this._hasher; // Compute HMAC

            var innerHash = hasher.finalize(messageUpdate);
            hasher.reset();
            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
            return hmac;
          }
        });
      })();

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var SHA1 = C_algo.SHA1;
        var HMAC = C_algo.HMAC;
        /**
         * Password-Based Key Derivation Function 2 algorithm.
         */

        var PBKDF2 = C_algo.PBKDF2 = Base.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hasher to use. Default: SHA1
           * @property {number} iterations The number of iterations to perform. Default: 1
           */
          cfg: Base.extend({
            keySize: 128 / 32,
            hasher: SHA1,
            iterations: 1
          }),

          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.PBKDF2.create();
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
           */
          init: function init(cfg) {
            this.cfg = this.cfg.extend(cfg);
          },

          /**
           * Computes the Password-Based Key Derivation Function 2.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function compute(password, salt) {
            // Shortcut
            var cfg = this.cfg; // Init HMAC

            var hmac = HMAC.create(cfg.hasher, password); // Initial values

            var derivedKey = WordArray.create();
            var blockIndex = WordArray.create([0x00000001]); // Shortcuts

            var derivedKeyWords = derivedKey.words;
            var blockIndexWords = blockIndex.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations; // Generate key

            while (derivedKeyWords.length < keySize) {
              var block = hmac.update(salt).finalize(blockIndex);
              hmac.reset(); // Shortcuts

              var blockWords = block.words;
              var blockWordsLength = blockWords.length; // Iterations

              var intermediate = block;

              for (var i = 1; i < iterations; i++) {
                intermediate = hmac.finalize(intermediate);
                hmac.reset(); // Shortcut

                var intermediateWords = intermediate.words; // XOR intermediate with block

                for (var j = 0; j < blockWordsLength; j++) {
                  blockWords[j] ^= intermediateWords[j];
                }
              }

              derivedKey.concat(block);
              blockIndexWords[0]++;
            }

            derivedKey.sigBytes = keySize * 4;
            return derivedKey;
          }
        });
        /**
         * Computes the Password-Based Key Derivation Function 2.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         * @param {Object} cfg (Optional) The configuration options to use for this computation.
         *
         * @return {WordArray} The derived key.
         *
         * @static
         *
         * @example
         *
         *     var key = CryptoJS.PBKDF2(password, salt);
         *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
         *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
         */

        C.PBKDF2 = function (password, salt, cfg) {
          return PBKDF2.create(cfg).compute(password, salt);
        };
      })();

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var MD5 = C_algo.MD5;
        /**
         * This key derivation function is meant to conform with EVP_BytesToKey.
         * www.openssl.org/docs/crypto/EVP_BytesToKey.html
         */

        var EvpKDF = C_algo.EvpKDF = Base.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hash algorithm to use. Default: MD5
           * @property {number} iterations The number of iterations to perform. Default: 1
           */
          cfg: Base.extend({
            keySize: 128 / 32,
            hasher: MD5,
            iterations: 1
          }),

          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.EvpKDF.create();
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
           */
          init: function init(cfg) {
            this.cfg = this.cfg.extend(cfg);
          },

          /**
           * Derives a key from a password.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function compute(password, salt) {
            var block; // Shortcut

            var cfg = this.cfg; // Init hasher

            var hasher = cfg.hasher.create(); // Initial values

            var derivedKey = WordArray.create(); // Shortcuts

            var derivedKeyWords = derivedKey.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations; // Generate key

            while (derivedKeyWords.length < keySize) {
              if (block) {
                hasher.update(block);
              }

              block = hasher.update(password).finalize(salt);
              hasher.reset(); // Iterations

              for (var i = 1; i < iterations; i++) {
                block = hasher.finalize(block);
                hasher.reset();
              }

              derivedKey.concat(block);
            }

            derivedKey.sigBytes = keySize * 4;
            return derivedKey;
          }
        });
        /**
         * Derives a key from a password.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         * @param {Object} cfg (Optional) The configuration options to use for this computation.
         *
         * @return {WordArray} The derived key.
         *
         * @static
         *
         * @example
         *
         *     var key = CryptoJS.EvpKDF(password, salt);
         *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
         *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
         */

        C.EvpKDF = function (password, salt, cfg) {
          return EvpKDF.create(cfg).compute(password, salt);
        };
      })();
      /**
       * Cipher core components.
       */


      CryptoJS.lib.Cipher || function (undefined$1) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var Base = C_lib.Base;
        var WordArray = C_lib.WordArray;
        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
        var C_enc = C.enc;
        C_enc.Utf8;
        var Base64 = C_enc.Base64;
        var C_algo = C.algo;
        var EvpKDF = C_algo.EvpKDF;
        /**
         * Abstract base cipher template.
         *
         * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
         * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
         * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
         * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
         */

        var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
          /**
           * Configuration options.
           *
           * @property {WordArray} iv The IV to use for this operation.
           */
          cfg: Base.extend(),

          /**
           * Creates this cipher in encryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
           */
          createEncryptor: function createEncryptor(key, cfg) {
            return this.create(this._ENC_XFORM_MODE, key, cfg);
          },

          /**
           * Creates this cipher in decryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
           */
          createDecryptor: function createDecryptor(key, cfg) {
            return this.create(this._DEC_XFORM_MODE, key, cfg);
          },

          /**
           * Initializes a newly created cipher.
           *
           * @param {number} xformMode Either the encryption or decryption transormation mode constant.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
           */
          init: function init(xformMode, key, cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg); // Store transform mode and key

            this._xformMode = xformMode;
            this._key = key; // Set initial values

            this.reset();
          },

          /**
           * Resets this cipher to its initial state.
           *
           * @example
           *
           *     cipher.reset();
           */
          reset: function reset() {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this); // Perform concrete-cipher logic

            this._doReset();
          },

          /**
           * Adds data to be encrypted or decrypted.
           *
           * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
           *
           * @return {WordArray} The data after processing.
           *
           * @example
           *
           *     var encrypted = cipher.process('data');
           *     var encrypted = cipher.process(wordArray);
           */
          process: function process(dataUpdate) {
            // Append
            this._append(dataUpdate); // Process available blocks


            return this._process();
          },

          /**
           * Finalizes the encryption or decryption process.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
           *
           * @return {WordArray} The data after final processing.
           *
           * @example
           *
           *     var encrypted = cipher.finalize();
           *     var encrypted = cipher.finalize('data');
           *     var encrypted = cipher.finalize(wordArray);
           */
          finalize: function finalize(dataUpdate) {
            // Final data update
            if (dataUpdate) {
              this._append(dataUpdate);
            } // Perform concrete-cipher logic


            var finalProcessedData = this._doFinalize();

            return finalProcessedData;
          },
          keySize: 128 / 32,
          ivSize: 128 / 32,
          _ENC_XFORM_MODE: 1,
          _DEC_XFORM_MODE: 2,

          /**
           * Creates shortcut functions to a cipher's object interface.
           *
           * @param {Cipher} cipher The cipher to create a helper for.
           *
           * @return {Object} An object with encrypt and decrypt shortcut functions.
           *
           * @static
           *
           * @example
           *
           *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
           */
          _createHelper: function () {
            function selectCipherStrategy(key) {
              if (typeof key == 'string') {
                return PasswordBasedCipher;
              } else {
                return SerializableCipher;
              }
            }

            return function (cipher) {
              return {
                encrypt: function encrypt(message, key, cfg) {
                  return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                },
                decrypt: function decrypt(ciphertext, key, cfg) {
                  return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                }
              };
            };
          }()
        });
        /**
         * Abstract base stream cipher template.
         *
         * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
         */

        C_lib.StreamCipher = Cipher.extend({
          _doFinalize: function _doFinalize() {
            // Process partial blocks
            var finalProcessedBlocks = this._process(!!'flush');

            return finalProcessedBlocks;
          },
          blockSize: 1
        });
        /**
         * Mode namespace.
         */

        var C_mode = C.mode = {};
        /**
         * Abstract base block cipher mode template.
         */

        var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
          /**
           * Creates this mode for encryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
           */
          createEncryptor: function createEncryptor(cipher, iv) {
            return this.Encryptor.create(cipher, iv);
          },

          /**
           * Creates this mode for decryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
           */
          createDecryptor: function createDecryptor(cipher, iv) {
            return this.Decryptor.create(cipher, iv);
          },

          /**
           * Initializes a newly created mode.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
           */
          init: function init(cipher, iv) {
            this._cipher = cipher;
            this._iv = iv;
          }
        });
        /**
         * Cipher Block Chaining mode.
         */

        var CBC = C_mode.CBC = function () {
          /**
           * Abstract base CBC mode.
           */
          var CBC = BlockCipherMode.extend();
          /**
           * CBC encryptor.
           */

          CBC.Encryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function processBlock(words, offset) {
              // Shortcuts
              var cipher = this._cipher;
              var blockSize = cipher.blockSize; // XOR and encrypt

              xorBlock.call(this, words, offset, blockSize);
              cipher.encryptBlock(words, offset); // Remember this block to use with next block

              this._prevBlock = words.slice(offset, offset + blockSize);
            }
          });
          /**
           * CBC decryptor.
           */

          CBC.Decryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function processBlock(words, offset) {
              // Shortcuts
              var cipher = this._cipher;
              var blockSize = cipher.blockSize; // Remember this block to use with next block

              var thisBlock = words.slice(offset, offset + blockSize); // Decrypt and XOR

              cipher.decryptBlock(words, offset);
              xorBlock.call(this, words, offset, blockSize); // This block becomes the previous block

              this._prevBlock = thisBlock;
            }
          });

          function xorBlock(words, offset, blockSize) {
            var block; // Shortcut

            var iv = this._iv; // Choose mixing block

            if (iv) {
              block = iv; // Remove IV for subsequent blocks

              this._iv = undefined$1;
            } else {
              block = this._prevBlock;
            } // XOR blocks


            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= block[i];
            }
          }

          return CBC;
        }();
        /**
         * Padding namespace.
         */


        var C_pad = C.pad = {};
        /**
         * PKCS #5/7 padding strategy.
         */

        var Pkcs7 = C_pad.Pkcs7 = {
          /**
           * Pads data using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to pad.
           * @param {number} blockSize The multiple that the data should be padded to.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
           */
          pad: function pad(data, blockSize) {
            // Shortcut
            var blockSizeBytes = blockSize * 4; // Count padding bytes

            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes; // Create padding word

            var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes; // Create padding

            var paddingWords = [];

            for (var i = 0; i < nPaddingBytes; i += 4) {
              paddingWords.push(paddingWord);
            }

            var padding = WordArray.create(paddingWords, nPaddingBytes); // Add padding

            data.concat(padding);
          },

          /**
           * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to unpad.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.unpad(wordArray);
           */
          unpad: function unpad(data) {
            // Get number of padding bytes from last byte
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 0xff; // Remove padding

            data.sigBytes -= nPaddingBytes;
          }
        };
        /**
         * Abstract base block cipher template.
         *
         * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
         */

        C_lib.BlockCipher = Cipher.extend({
          /**
           * Configuration options.
           *
           * @property {Mode} mode The block mode to use. Default: CBC
           * @property {Padding} padding The padding strategy to use. Default: Pkcs7
           */
          cfg: Cipher.cfg.extend({
            mode: CBC,
            padding: Pkcs7
          }),
          reset: function reset() {
            var modeCreator; // Reset cipher

            Cipher.reset.call(this); // Shortcuts

            var cfg = this.cfg;
            var iv = cfg.iv;
            var mode = cfg.mode; // Reset block mode

            if (this._xformMode == this._ENC_XFORM_MODE) {
              modeCreator = mode.createEncryptor;
            } else
              /* if (this._xformMode == this._DEC_XFORM_MODE) */
              {
                modeCreator = mode.createDecryptor; // Keep at least one block in the buffer for unpadding

                this._minBufferSize = 1;
              }

            if (this._mode && this._mode.__creator == modeCreator) {
              this._mode.init(this, iv && iv.words);
            } else {
              this._mode = modeCreator.call(mode, this, iv && iv.words);
              this._mode.__creator = modeCreator;
            }
          },
          _doProcessBlock: function _doProcessBlock(words, offset) {
            this._mode.processBlock(words, offset);
          },
          _doFinalize: function _doFinalize() {
            var finalProcessedBlocks; // Shortcut

            var padding = this.cfg.padding; // Finalize

            if (this._xformMode == this._ENC_XFORM_MODE) {
              // Pad data
              padding.pad(this._data, this.blockSize); // Process final blocks

              finalProcessedBlocks = this._process(!!'flush');
            } else
              /* if (this._xformMode == this._DEC_XFORM_MODE) */
              {
                // Process final blocks
                finalProcessedBlocks = this._process(!!'flush'); // Unpad data

                padding.unpad(finalProcessedBlocks);
              }

            return finalProcessedBlocks;
          },
          blockSize: 128 / 32
        });
        /**
         * A collection of cipher parameters.
         *
         * @property {WordArray} ciphertext The raw ciphertext.
         * @property {WordArray} key The key to this ciphertext.
         * @property {WordArray} iv The IV used in the ciphering operation.
         * @property {WordArray} salt The salt used with a key derivation function.
         * @property {Cipher} algorithm The cipher algorithm.
         * @property {Mode} mode The block mode used in the ciphering operation.
         * @property {Padding} padding The padding scheme used in the ciphering operation.
         * @property {number} blockSize The block size of the cipher.
         * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
         */

        var CipherParams = C_lib.CipherParams = Base.extend({
          /**
           * Initializes a newly created cipher params object.
           *
           * @param {Object} cipherParams An object with any of the possible cipher parameters.
           *
           * @example
           *
           *     var cipherParams = CryptoJS.lib.CipherParams.create({
           *         ciphertext: ciphertextWordArray,
           *         key: keyWordArray,
           *         iv: ivWordArray,
           *         salt: saltWordArray,
           *         algorithm: CryptoJS.algo.AES,
           *         mode: CryptoJS.mode.CBC,
           *         padding: CryptoJS.pad.PKCS7,
           *         blockSize: 4,
           *         formatter: CryptoJS.format.OpenSSL
           *     });
           */
          init: function init(cipherParams) {
            this.mixIn(cipherParams);
          },

          /**
           * Converts this cipher params object to a string.
           *
           * @param {Format} formatter (Optional) The formatting strategy to use.
           *
           * @return {string} The stringified cipher params.
           *
           * @throws Error If neither the formatter nor the default formatter is set.
           *
           * @example
           *
           *     var string = cipherParams + '';
           *     var string = cipherParams.toString();
           *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
           */
          toString: function toString(formatter) {
            return (formatter || this.formatter).stringify(this);
          }
        });
        /**
         * Format namespace.
         */

        var C_format = C.format = {};
        /**
         * OpenSSL formatting strategy.
         */

        var OpenSSLFormatter = C_format.OpenSSL = {
          /**
           * Converts a cipher params object to an OpenSSL-compatible string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The OpenSSL-compatible string.
           *
           * @static
           *
           * @example
           *
           *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
           */
          stringify: function stringify(cipherParams) {
            var wordArray; // Shortcuts

            var ciphertext = cipherParams.ciphertext;
            var salt = cipherParams.salt; // Format

            if (salt) {
              wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
            } else {
              wordArray = ciphertext;
            }

            return wordArray.toString(Base64);
          },

          /**
           * Converts an OpenSSL-compatible string to a cipher params object.
           *
           * @param {string} openSSLStr The OpenSSL-compatible string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
           */
          parse: function parse(openSSLStr) {
            var salt; // Parse base64

            var ciphertext = Base64.parse(openSSLStr); // Shortcut

            var ciphertextWords = ciphertext.words; // Test for salt

            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
              // Extract salt
              salt = WordArray.create(ciphertextWords.slice(2, 4)); // Remove salt from ciphertext

              ciphertextWords.splice(0, 4);
              ciphertext.sigBytes -= 16;
            }

            return CipherParams.create({
              ciphertext: ciphertext,
              salt: salt
            });
          }
        };
        /**
         * A cipher wrapper that returns ciphertext as a serializable cipher params object.
         */

        var SerializableCipher = C_lib.SerializableCipher = Base.extend({
          /**
           * Configuration options.
           *
           * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
           */
          cfg: Base.extend({
            format: OpenSSLFormatter
          }),

          /**
           * Encrypts a message.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          encrypt: function encrypt(cipher, message, key, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg); // Encrypt

            var encryptor = cipher.createEncryptor(key, cfg);
            var ciphertext = encryptor.finalize(message); // Shortcut

            var cipherCfg = encryptor.cfg; // Create and return serializable cipher params

            return CipherParams.create({
              ciphertext: ciphertext,
              key: key,
              iv: cipherCfg.iv,
              algorithm: cipher,
              mode: cipherCfg.mode,
              padding: cipherCfg.padding,
              blockSize: cipher.blockSize,
              formatter: cfg.format
            });
          },

          /**
           * Decrypts serialized ciphertext.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          decrypt: function decrypt(cipher, ciphertext, key, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg); // Convert string to CipherParams

            ciphertext = this._parse(ciphertext, cfg.format); // Decrypt

            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
            return plaintext;
          },

          /**
           * Converts serialized ciphertext to CipherParams,
           * else assumed CipherParams already and returns ciphertext unchanged.
           *
           * @param {CipherParams|string} ciphertext The ciphertext.
           * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
           *
           * @return {CipherParams} The unserialized ciphertext.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
           */
          _parse: function _parse(ciphertext, format) {
            if (typeof ciphertext == 'string') {
              return format.parse(ciphertext, this);
            } else {
              return ciphertext;
            }
          }
        });
        /**
         * Key derivation function namespace.
         */

        var C_kdf = C.kdf = {};
        /**
         * OpenSSL key derivation function.
         */

        var OpenSSLKdf = C_kdf.OpenSSL = {
          /**
           * Derives a key and IV from a password.
           *
           * @param {string} password The password to derive from.
           * @param {number} keySize The size in words of the key to generate.
           * @param {number} ivSize The size in words of the IV to generate.
           * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
           *
           * @return {CipherParams} A cipher params object with the key, IV, and salt.
           *
           * @static
           *
           * @example
           *
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
           */
          execute: function execute(password, keySize, ivSize, salt) {
            // Generate random salt
            if (!salt) {
              salt = WordArray.random(64 / 8);
            } // Derive key and IV


            var key = EvpKDF.create({
              keySize: keySize + ivSize
            }).compute(password, salt); // Separate key and IV

            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
            key.sigBytes = keySize * 4; // Return params

            return CipherParams.create({
              key: key,
              iv: iv,
              salt: salt
            });
          }
        };
        /**
         * A serializable cipher wrapper that derives the key from a password,
         * and returns ciphertext as a serializable cipher params object.
         */

        var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
          /**
           * Configuration options.
           *
           * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
           */
          cfg: SerializableCipher.cfg.extend({
            kdf: OpenSSLKdf
          }),

          /**
           * Encrypts a message using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
           */
          encrypt: function encrypt(cipher, message, password, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg); // Derive key and other params

            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize); // Add IV to config

            cfg.iv = derivedParams.iv; // Encrypt

            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg); // Mix in derived params

            ciphertext.mixIn(derivedParams);
            return ciphertext;
          },

          /**
           * Decrypts serialized ciphertext using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
           */
          decrypt: function decrypt(cipher, ciphertext, password, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg); // Convert string to CipherParams

            ciphertext = this._parse(ciphertext, cfg.format); // Derive key and other params

            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt); // Add IV to config

            cfg.iv = derivedParams.iv; // Decrypt

            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
            return plaintext;
          }
        });
      }();
      /**
       * Cipher Feedback block mode.
       */

      CryptoJS.mode.CFB = function () {
        var CFB = CryptoJS.lib.BlockCipherMode.extend();
        CFB.Encryptor = CFB.extend({
          processBlock: function processBlock(words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher); // Remember this block to use with next block

            this._prevBlock = words.slice(offset, offset + blockSize);
          }
        });
        CFB.Decryptor = CFB.extend({
          processBlock: function processBlock(words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize; // Remember this block to use with next block

            var thisBlock = words.slice(offset, offset + blockSize);
            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher); // This block becomes the previous block

            this._prevBlock = thisBlock;
          }
        });

        function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
          var keystream; // Shortcut

          var iv = this._iv; // Generate keystream

          if (iv) {
            keystream = iv.slice(0); // Remove IV for subsequent blocks

            this._iv = undefined;
          } else {
            keystream = this._prevBlock;
          }

          cipher.encryptBlock(keystream, 0); // Encrypt

          for (var i = 0; i < blockSize; i++) {
            words[offset + i] ^= keystream[i];
          }
        }

        return CFB;
      }();
      /**
       * Counter block mode.
       */


      CryptoJS.mode.CTR = function () {
        var CTR = CryptoJS.lib.BlockCipherMode.extend();
        var Encryptor = CTR.Encryptor = CTR.extend({
          processBlock: function processBlock(words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var counter = this._counter; // Generate keystream

            if (iv) {
              counter = this._counter = iv.slice(0); // Remove IV for subsequent blocks

              this._iv = undefined;
            }

            var keystream = counter.slice(0);
            cipher.encryptBlock(keystream, 0); // Increment counter

            counter[blockSize - 1] = counter[blockSize - 1] + 1 | 0; // Encrypt

            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }
        });
        CTR.Decryptor = Encryptor;
        return CTR;
      }();
      /** @preserve
       * Counter block mode compatible with  Dr Brian Gladman fileenc.c
       * derived from CryptoJS.mode.CTR
       * Jan Hruby jhruby.web@gmail.com
       */


      CryptoJS.mode.CTRGladman = function () {
        var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

        function incWord(word) {
          if ((word >> 24 & 0xff) === 0xff) {
            //overflow
            var b1 = word >> 16 & 0xff;
            var b2 = word >> 8 & 0xff;
            var b3 = word & 0xff;

            if (b1 === 0xff) // overflow b1
              {
                b1 = 0;

                if (b2 === 0xff) {
                  b2 = 0;

                  if (b3 === 0xff) {
                    b3 = 0;
                  } else {
                    ++b3;
                  }
                } else {
                  ++b2;
                }
              } else {
              ++b1;
            }

            word = 0;
            word += b1 << 16;
            word += b2 << 8;
            word += b3;
          } else {
            word += 0x01 << 24;
          }

          return word;
        }

        function incCounter(counter) {
          if ((counter[0] = incWord(counter[0])) === 0) {
            // encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
            counter[1] = incWord(counter[1]);
          }

          return counter;
        }

        var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
          processBlock: function processBlock(words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var counter = this._counter; // Generate keystream

            if (iv) {
              counter = this._counter = iv.slice(0); // Remove IV for subsequent blocks

              this._iv = undefined;
            }

            incCounter(counter);
            var keystream = counter.slice(0);
            cipher.encryptBlock(keystream, 0); // Encrypt

            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }
        });
        CTRGladman.Decryptor = Encryptor;
        return CTRGladman;
      }();
      /**
       * Output Feedback block mode.
       */


      CryptoJS.mode.OFB = function () {
        var OFB = CryptoJS.lib.BlockCipherMode.extend();
        var Encryptor = OFB.Encryptor = OFB.extend({
          processBlock: function processBlock(words, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var keystream = this._keystream; // Generate keystream

            if (iv) {
              keystream = this._keystream = iv.slice(0); // Remove IV for subsequent blocks

              this._iv = undefined;
            }

            cipher.encryptBlock(keystream, 0); // Encrypt

            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }
        });
        OFB.Decryptor = Encryptor;
        return OFB;
      }();
      /**
       * Electronic Codebook block mode.
       */


      CryptoJS.mode.ECB = function () {
        var ECB = CryptoJS.lib.BlockCipherMode.extend();
        ECB.Encryptor = ECB.extend({
          processBlock: function processBlock(words, offset) {
            this._cipher.encryptBlock(words, offset);
          }
        });
        ECB.Decryptor = ECB.extend({
          processBlock: function processBlock(words, offset) {
            this._cipher.decryptBlock(words, offset);
          }
        });
        return ECB;
      }();
      /**
       * ANSI X.923 padding strategy.
       */


      CryptoJS.pad.AnsiX923 = {
        pad: function pad(data, blockSize) {
          // Shortcuts
          var dataSigBytes = data.sigBytes;
          var blockSizeBytes = blockSize * 4; // Count padding bytes

          var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes; // Compute last byte position

          var lastBytePos = dataSigBytes + nPaddingBytes - 1; // Pad

          data.clamp();
          data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
          data.sigBytes += nPaddingBytes;
        },
        unpad: function unpad(data) {
          // Get number of padding bytes from last byte
          var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 0xff; // Remove padding

          data.sigBytes -= nPaddingBytes;
        }
      };
      /**
       * ISO 10126 padding strategy.
       */

      CryptoJS.pad.Iso10126 = {
        pad: function pad(data, blockSize) {
          // Shortcut
          var blockSizeBytes = blockSize * 4; // Count padding bytes

          var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes; // Pad

          data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
        },
        unpad: function unpad(data) {
          // Get number of padding bytes from last byte
          var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 0xff; // Remove padding

          data.sigBytes -= nPaddingBytes;
        }
      };
      /**
       * ISO/IEC 9797-1 Padding Method 2.
       */

      CryptoJS.pad.Iso97971 = {
        pad: function pad(data, blockSize) {
          // Add 0x80 byte
          data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1)); // Zero pad the rest

          CryptoJS.pad.ZeroPadding.pad(data, blockSize);
        },
        unpad: function unpad(data) {
          // Remove zero padding
          CryptoJS.pad.ZeroPadding.unpad(data); // Remove one more byte -- the 0x80 byte

          data.sigBytes--;
        }
      };
      /**
       * Zero padding strategy.
       */

      CryptoJS.pad.ZeroPadding = {
        pad: function pad(data, blockSize) {
          // Shortcut
          var blockSizeBytes = blockSize * 4; // Pad

          data.clamp();
          data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
        },
        unpad: function unpad(data) {
          // Shortcut
          var dataWords = data.words; // Unpad

          var i = data.sigBytes - 1;

          for (var i = data.sigBytes - 1; i >= 0; i--) {
            if (dataWords[i >>> 2] >>> 24 - i % 4 * 8 & 0xff) {
              data.sigBytes = i + 1;
              break;
            }
          }
        }
      };
      /**
       * A noop padding strategy.
       */

      CryptoJS.pad.NoPadding = {
        pad: function pad() {},
        unpad: function unpad() {}
      };

      (function (undefined$1) {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var CipherParams = C_lib.CipherParams;
        var C_enc = C.enc;
        var Hex = C_enc.Hex;
        var C_format = C.format;
        C_format.Hex = {
          /**
           * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The hexadecimally encoded string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
           */
          stringify: function stringify(cipherParams) {
            return cipherParams.ciphertext.toString(Hex);
          },

          /**
           * Converts a hexadecimally encoded ciphertext string to a cipher params object.
           *
           * @param {string} input The hexadecimally encoded string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
           */
          parse: function parse(input) {
            var ciphertext = Hex.parse(input);
            return CipherParams.create({
              ciphertext: ciphertext
            });
          }
        };
      })();

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var BlockCipher = C_lib.BlockCipher;
        var C_algo = C.algo; // Lookup tables

        var SBOX = [];
        var INV_SBOX = [];
        var SUB_MIX_0 = [];
        var SUB_MIX_1 = [];
        var SUB_MIX_2 = [];
        var SUB_MIX_3 = [];
        var INV_SUB_MIX_0 = [];
        var INV_SUB_MIX_1 = [];
        var INV_SUB_MIX_2 = [];
        var INV_SUB_MIX_3 = []; // Compute lookup tables

        (function () {
          // Compute double table
          var d = [];

          for (var i = 0; i < 256; i++) {
            if (i < 128) {
              d[i] = i << 1;
            } else {
              d[i] = i << 1 ^ 0x11b;
            }
          } // Walk GF(2^8)


          var x = 0;
          var xi = 0;

          for (var i = 0; i < 256; i++) {
            // Compute sbox
            var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
            sx = sx >>> 8 ^ sx & 0xff ^ 0x63;
            SBOX[x] = sx;
            INV_SBOX[sx] = x; // Compute multiplication

            var x2 = d[x];
            var x4 = d[x2];
            var x8 = d[x4]; // Compute sub bytes, mix columns tables

            var t = d[sx] * 0x101 ^ sx * 0x1010100;
            SUB_MIX_0[x] = t << 24 | t >>> 8;
            SUB_MIX_1[x] = t << 16 | t >>> 16;
            SUB_MIX_2[x] = t << 8 | t >>> 24;
            SUB_MIX_3[x] = t; // Compute inv sub bytes, inv mix columns tables

            var t = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
            INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
            INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
            INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
            INV_SUB_MIX_3[sx] = t; // Compute next counter

            if (!x) {
              x = xi = 1;
            } else {
              x = x2 ^ d[d[d[x8 ^ x2]]];
              xi ^= d[d[xi]];
            }
          }
        })(); // Precomputed Rcon lookup


        var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
        /**
         * AES block cipher algorithm.
         */

        var AES = C_algo.AES = BlockCipher.extend({
          _doReset: function _doReset() {
            var t; // Skip reset of nRounds has been set before and key did not change

            if (this._nRounds && this._keyPriorReset === this._key) {
              return;
            } // Shortcuts


            var key = this._keyPriorReset = this._key;
            var keyWords = key.words;
            var keySize = key.sigBytes / 4; // Compute number of rounds

            var nRounds = this._nRounds = keySize + 6; // Compute number of key schedule rows

            var ksRows = (nRounds + 1) * 4; // Compute key schedule

            var keySchedule = this._keySchedule = [];

            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
              if (ksRow < keySize) {
                keySchedule[ksRow] = keyWords[ksRow];
              } else {
                t = keySchedule[ksRow - 1];

                if (!(ksRow % keySize)) {
                  // Rot word
                  t = t << 8 | t >>> 24; // Sub word

                  t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff]; // Mix Rcon

                  t ^= RCON[ksRow / keySize | 0] << 24;
                } else if (keySize > 6 && ksRow % keySize == 4) {
                  // Sub word
                  t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 0xff] << 16 | SBOX[t >>> 8 & 0xff] << 8 | SBOX[t & 0xff];
                }

                keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
              }
            } // Compute inv key schedule


            var invKeySchedule = this._invKeySchedule = [];

            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
              var ksRow = ksRows - invKsRow;

              if (invKsRow % 4) {
                var t = keySchedule[ksRow];
              } else {
                var t = keySchedule[ksRow - 4];
              }

              if (invKsRow < 4 || ksRow <= 4) {
                invKeySchedule[invKsRow] = t;
              } else {
                invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 0xff]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
              }
            }
          },
          encryptBlock: function encryptBlock(M, offset) {
            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
          },
          decryptBlock: function decryptBlock(M, offset) {
            // Swap 2nd and 4th rows
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;

            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX); // Inv swap 2nd and 4th rows


            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;
          },
          _doCryptBlock: function _doCryptBlock(M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
            // Shortcut
            var nRounds = this._nRounds; // Get input, add round key

            var s0 = M[offset] ^ keySchedule[0];
            var s1 = M[offset + 1] ^ keySchedule[1];
            var s2 = M[offset + 2] ^ keySchedule[2];
            var s3 = M[offset + 3] ^ keySchedule[3]; // Key schedule row counter

            var ksRow = 4; // Rounds

            for (var round = 1; round < nRounds; round++) {
              // Shift rows, sub bytes, mix columns, add round key
              var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[s1 >>> 16 & 0xff] ^ SUB_MIX_2[s2 >>> 8 & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
              var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[s2 >>> 16 & 0xff] ^ SUB_MIX_2[s3 >>> 8 & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
              var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[s3 >>> 16 & 0xff] ^ SUB_MIX_2[s0 >>> 8 & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
              var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[s0 >>> 16 & 0xff] ^ SUB_MIX_2[s1 >>> 8 & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++]; // Update state

              s0 = t0;
              s1 = t1;
              s2 = t2;
              s3 = t3;
            } // Shift rows, sub bytes, add round key


            var t0 = (SBOX[s0 >>> 24] << 24 | SBOX[s1 >>> 16 & 0xff] << 16 | SBOX[s2 >>> 8 & 0xff] << 8 | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
            var t1 = (SBOX[s1 >>> 24] << 24 | SBOX[s2 >>> 16 & 0xff] << 16 | SBOX[s3 >>> 8 & 0xff] << 8 | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
            var t2 = (SBOX[s2 >>> 24] << 24 | SBOX[s3 >>> 16 & 0xff] << 16 | SBOX[s0 >>> 8 & 0xff] << 8 | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
            var t3 = (SBOX[s3 >>> 24] << 24 | SBOX[s0 >>> 16 & 0xff] << 16 | SBOX[s1 >>> 8 & 0xff] << 8 | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++]; // Set output

            M[offset] = t0;
            M[offset + 1] = t1;
            M[offset + 2] = t2;
            M[offset + 3] = t3;
          },
          keySize: 256 / 32
        });
        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
         */

        C.AES = BlockCipher._createHelper(AES);
      })();

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var BlockCipher = C_lib.BlockCipher;
        var C_algo = C.algo; // Permuted Choice 1 constants

        var PC1 = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4]; // Permuted Choice 2 constants

        var PC2 = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32]; // Cumulative bit shift constants

        var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28]; // SBOXes and round permutation constants

        var SBOX_P = [{
          0x0: 0x808200,
          0x10000000: 0x8000,
          0x20000000: 0x808002,
          0x30000000: 0x2,
          0x40000000: 0x200,
          0x50000000: 0x808202,
          0x60000000: 0x800202,
          0x70000000: 0x800000,
          0x80000000: 0x202,
          0x90000000: 0x800200,
          0xa0000000: 0x8200,
          0xb0000000: 0x808000,
          0xc0000000: 0x8002,
          0xd0000000: 0x800002,
          0xe0000000: 0x0,
          0xf0000000: 0x8202,
          0x8000000: 0x0,
          0x18000000: 0x808202,
          0x28000000: 0x8202,
          0x38000000: 0x8000,
          0x48000000: 0x808200,
          0x58000000: 0x200,
          0x68000000: 0x808002,
          0x78000000: 0x2,
          0x88000000: 0x800200,
          0x98000000: 0x8200,
          0xa8000000: 0x808000,
          0xb8000000: 0x800202,
          0xc8000000: 0x800002,
          0xd8000000: 0x8002,
          0xe8000000: 0x202,
          0xf8000000: 0x800000,
          0x1: 0x8000,
          0x10000001: 0x2,
          0x20000001: 0x808200,
          0x30000001: 0x800000,
          0x40000001: 0x808002,
          0x50000001: 0x8200,
          0x60000001: 0x200,
          0x70000001: 0x800202,
          0x80000001: 0x808202,
          0x90000001: 0x808000,
          0xa0000001: 0x800002,
          0xb0000001: 0x8202,
          0xc0000001: 0x202,
          0xd0000001: 0x800200,
          0xe0000001: 0x8002,
          0xf0000001: 0x0,
          0x8000001: 0x808202,
          0x18000001: 0x808000,
          0x28000001: 0x800000,
          0x38000001: 0x200,
          0x48000001: 0x8000,
          0x58000001: 0x800002,
          0x68000001: 0x2,
          0x78000001: 0x8202,
          0x88000001: 0x8002,
          0x98000001: 0x800202,
          0xa8000001: 0x202,
          0xb8000001: 0x808200,
          0xc8000001: 0x800200,
          0xd8000001: 0x0,
          0xe8000001: 0x8200,
          0xf8000001: 0x808002
        }, {
          0x0: 0x40084010,
          0x1000000: 0x4000,
          0x2000000: 0x80000,
          0x3000000: 0x40080010,
          0x4000000: 0x40000010,
          0x5000000: 0x40084000,
          0x6000000: 0x40004000,
          0x7000000: 0x10,
          0x8000000: 0x84000,
          0x9000000: 0x40004010,
          0xa000000: 0x40000000,
          0xb000000: 0x84010,
          0xc000000: 0x80010,
          0xd000000: 0x0,
          0xe000000: 0x4010,
          0xf000000: 0x40080000,
          0x800000: 0x40004000,
          0x1800000: 0x84010,
          0x2800000: 0x10,
          0x3800000: 0x40004010,
          0x4800000: 0x40084010,
          0x5800000: 0x40000000,
          0x6800000: 0x80000,
          0x7800000: 0x40080010,
          0x8800000: 0x80010,
          0x9800000: 0x0,
          0xa800000: 0x4000,
          0xb800000: 0x40080000,
          0xc800000: 0x40000010,
          0xd800000: 0x84000,
          0xe800000: 0x40084000,
          0xf800000: 0x4010,
          0x10000000: 0x0,
          0x11000000: 0x40080010,
          0x12000000: 0x40004010,
          0x13000000: 0x40084000,
          0x14000000: 0x40080000,
          0x15000000: 0x10,
          0x16000000: 0x84010,
          0x17000000: 0x4000,
          0x18000000: 0x4010,
          0x19000000: 0x80000,
          0x1a000000: 0x80010,
          0x1b000000: 0x40000010,
          0x1c000000: 0x84000,
          0x1d000000: 0x40004000,
          0x1e000000: 0x40000000,
          0x1f000000: 0x40084010,
          0x10800000: 0x84010,
          0x11800000: 0x80000,
          0x12800000: 0x40080000,
          0x13800000: 0x4000,
          0x14800000: 0x40004000,
          0x15800000: 0x40084010,
          0x16800000: 0x10,
          0x17800000: 0x40000000,
          0x18800000: 0x40084000,
          0x19800000: 0x40000010,
          0x1a800000: 0x40004010,
          0x1b800000: 0x80010,
          0x1c800000: 0x0,
          0x1d800000: 0x4010,
          0x1e800000: 0x40080010,
          0x1f800000: 0x84000
        }, {
          0x0: 0x104,
          0x100000: 0x0,
          0x200000: 0x4000100,
          0x300000: 0x10104,
          0x400000: 0x10004,
          0x500000: 0x4000004,
          0x600000: 0x4010104,
          0x700000: 0x4010000,
          0x800000: 0x4000000,
          0x900000: 0x4010100,
          0xa00000: 0x10100,
          0xb00000: 0x4010004,
          0xc00000: 0x4000104,
          0xd00000: 0x10000,
          0xe00000: 0x4,
          0xf00000: 0x100,
          0x80000: 0x4010100,
          0x180000: 0x4010004,
          0x280000: 0x0,
          0x380000: 0x4000100,
          0x480000: 0x4000004,
          0x580000: 0x10000,
          0x680000: 0x10004,
          0x780000: 0x104,
          0x880000: 0x4,
          0x980000: 0x100,
          0xa80000: 0x4010000,
          0xb80000: 0x10104,
          0xc80000: 0x10100,
          0xd80000: 0x4000104,
          0xe80000: 0x4010104,
          0xf80000: 0x4000000,
          0x1000000: 0x4010100,
          0x1100000: 0x10004,
          0x1200000: 0x10000,
          0x1300000: 0x4000100,
          0x1400000: 0x100,
          0x1500000: 0x4010104,
          0x1600000: 0x4000004,
          0x1700000: 0x0,
          0x1800000: 0x4000104,
          0x1900000: 0x4000000,
          0x1a00000: 0x4,
          0x1b00000: 0x10100,
          0x1c00000: 0x4010000,
          0x1d00000: 0x104,
          0x1e00000: 0x10104,
          0x1f00000: 0x4010004,
          0x1080000: 0x4000000,
          0x1180000: 0x104,
          0x1280000: 0x4010100,
          0x1380000: 0x0,
          0x1480000: 0x10004,
          0x1580000: 0x4000100,
          0x1680000: 0x100,
          0x1780000: 0x4010004,
          0x1880000: 0x10000,
          0x1980000: 0x4010104,
          0x1a80000: 0x10104,
          0x1b80000: 0x4000004,
          0x1c80000: 0x4000104,
          0x1d80000: 0x4010000,
          0x1e80000: 0x4,
          0x1f80000: 0x10100
        }, {
          0x0: 0x80401000,
          0x10000: 0x80001040,
          0x20000: 0x401040,
          0x30000: 0x80400000,
          0x40000: 0x0,
          0x50000: 0x401000,
          0x60000: 0x80000040,
          0x70000: 0x400040,
          0x80000: 0x80000000,
          0x90000: 0x400000,
          0xa0000: 0x40,
          0xb0000: 0x80001000,
          0xc0000: 0x80400040,
          0xd0000: 0x1040,
          0xe0000: 0x1000,
          0xf0000: 0x80401040,
          0x8000: 0x80001040,
          0x18000: 0x40,
          0x28000: 0x80400040,
          0x38000: 0x80001000,
          0x48000: 0x401000,
          0x58000: 0x80401040,
          0x68000: 0x0,
          0x78000: 0x80400000,
          0x88000: 0x1000,
          0x98000: 0x80401000,
          0xa8000: 0x400000,
          0xb8000: 0x1040,
          0xc8000: 0x80000000,
          0xd8000: 0x400040,
          0xe8000: 0x401040,
          0xf8000: 0x80000040,
          0x100000: 0x400040,
          0x110000: 0x401000,
          0x120000: 0x80000040,
          0x130000: 0x0,
          0x140000: 0x1040,
          0x150000: 0x80400040,
          0x160000: 0x80401000,
          0x170000: 0x80001040,
          0x180000: 0x80401040,
          0x190000: 0x80000000,
          0x1a0000: 0x80400000,
          0x1b0000: 0x401040,
          0x1c0000: 0x80001000,
          0x1d0000: 0x400000,
          0x1e0000: 0x40,
          0x1f0000: 0x1000,
          0x108000: 0x80400000,
          0x118000: 0x80401040,
          0x128000: 0x0,
          0x138000: 0x401000,
          0x148000: 0x400040,
          0x158000: 0x80000000,
          0x168000: 0x80001040,
          0x178000: 0x40,
          0x188000: 0x80000040,
          0x198000: 0x1000,
          0x1a8000: 0x80001000,
          0x1b8000: 0x80400040,
          0x1c8000: 0x1040,
          0x1d8000: 0x80401000,
          0x1e8000: 0x400000,
          0x1f8000: 0x401040
        }, {
          0x0: 0x80,
          0x1000: 0x1040000,
          0x2000: 0x40000,
          0x3000: 0x20000000,
          0x4000: 0x20040080,
          0x5000: 0x1000080,
          0x6000: 0x21000080,
          0x7000: 0x40080,
          0x8000: 0x1000000,
          0x9000: 0x20040000,
          0xa000: 0x20000080,
          0xb000: 0x21040080,
          0xc000: 0x21040000,
          0xd000: 0x0,
          0xe000: 0x1040080,
          0xf000: 0x21000000,
          0x800: 0x1040080,
          0x1800: 0x21000080,
          0x2800: 0x80,
          0x3800: 0x1040000,
          0x4800: 0x40000,
          0x5800: 0x20040080,
          0x6800: 0x21040000,
          0x7800: 0x20000000,
          0x8800: 0x20040000,
          0x9800: 0x0,
          0xa800: 0x21040080,
          0xb800: 0x1000080,
          0xc800: 0x20000080,
          0xd800: 0x21000000,
          0xe800: 0x1000000,
          0xf800: 0x40080,
          0x10000: 0x40000,
          0x11000: 0x80,
          0x12000: 0x20000000,
          0x13000: 0x21000080,
          0x14000: 0x1000080,
          0x15000: 0x21040000,
          0x16000: 0x20040080,
          0x17000: 0x1000000,
          0x18000: 0x21040080,
          0x19000: 0x21000000,
          0x1a000: 0x1040000,
          0x1b000: 0x20040000,
          0x1c000: 0x40080,
          0x1d000: 0x20000080,
          0x1e000: 0x0,
          0x1f000: 0x1040080,
          0x10800: 0x21000080,
          0x11800: 0x1000000,
          0x12800: 0x1040000,
          0x13800: 0x20040080,
          0x14800: 0x20000000,
          0x15800: 0x1040080,
          0x16800: 0x80,
          0x17800: 0x21040000,
          0x18800: 0x40080,
          0x19800: 0x21040080,
          0x1a800: 0x0,
          0x1b800: 0x21000000,
          0x1c800: 0x1000080,
          0x1d800: 0x40000,
          0x1e800: 0x20040000,
          0x1f800: 0x20000080
        }, {
          0x0: 0x10000008,
          0x100: 0x2000,
          0x200: 0x10200000,
          0x300: 0x10202008,
          0x400: 0x10002000,
          0x500: 0x200000,
          0x600: 0x200008,
          0x700: 0x10000000,
          0x800: 0x0,
          0x900: 0x10002008,
          0xa00: 0x202000,
          0xb00: 0x8,
          0xc00: 0x10200008,
          0xd00: 0x202008,
          0xe00: 0x2008,
          0xf00: 0x10202000,
          0x80: 0x10200000,
          0x180: 0x10202008,
          0x280: 0x8,
          0x380: 0x200000,
          0x480: 0x202008,
          0x580: 0x10000008,
          0x680: 0x10002000,
          0x780: 0x2008,
          0x880: 0x200008,
          0x980: 0x2000,
          0xa80: 0x10002008,
          0xb80: 0x10200008,
          0xc80: 0x0,
          0xd80: 0x10202000,
          0xe80: 0x202000,
          0xf80: 0x10000000,
          0x1000: 0x10002000,
          0x1100: 0x10200008,
          0x1200: 0x10202008,
          0x1300: 0x2008,
          0x1400: 0x200000,
          0x1500: 0x10000000,
          0x1600: 0x10000008,
          0x1700: 0x202000,
          0x1800: 0x202008,
          0x1900: 0x0,
          0x1a00: 0x8,
          0x1b00: 0x10200000,
          0x1c00: 0x2000,
          0x1d00: 0x10002008,
          0x1e00: 0x10202000,
          0x1f00: 0x200008,
          0x1080: 0x8,
          0x1180: 0x202000,
          0x1280: 0x200000,
          0x1380: 0x10000008,
          0x1480: 0x10002000,
          0x1580: 0x2008,
          0x1680: 0x10202008,
          0x1780: 0x10200000,
          0x1880: 0x10202000,
          0x1980: 0x10200008,
          0x1a80: 0x2000,
          0x1b80: 0x202008,
          0x1c80: 0x200008,
          0x1d80: 0x0,
          0x1e80: 0x10000000,
          0x1f80: 0x10002008
        }, {
          0x0: 0x100000,
          0x10: 0x2000401,
          0x20: 0x400,
          0x30: 0x100401,
          0x40: 0x2100401,
          0x50: 0x0,
          0x60: 0x1,
          0x70: 0x2100001,
          0x80: 0x2000400,
          0x90: 0x100001,
          0xa0: 0x2000001,
          0xb0: 0x2100400,
          0xc0: 0x2100000,
          0xd0: 0x401,
          0xe0: 0x100400,
          0xf0: 0x2000000,
          0x8: 0x2100001,
          0x18: 0x0,
          0x28: 0x2000401,
          0x38: 0x2100400,
          0x48: 0x100000,
          0x58: 0x2000001,
          0x68: 0x2000000,
          0x78: 0x401,
          0x88: 0x100401,
          0x98: 0x2000400,
          0xa8: 0x2100000,
          0xb8: 0x100001,
          0xc8: 0x400,
          0xd8: 0x2100401,
          0xe8: 0x1,
          0xf8: 0x100400,
          0x100: 0x2000000,
          0x110: 0x100000,
          0x120: 0x2000401,
          0x130: 0x2100001,
          0x140: 0x100001,
          0x150: 0x2000400,
          0x160: 0x2100400,
          0x170: 0x100401,
          0x180: 0x401,
          0x190: 0x2100401,
          0x1a0: 0x100400,
          0x1b0: 0x1,
          0x1c0: 0x0,
          0x1d0: 0x2100000,
          0x1e0: 0x2000001,
          0x1f0: 0x400,
          0x108: 0x100400,
          0x118: 0x2000401,
          0x128: 0x2100001,
          0x138: 0x1,
          0x148: 0x2000000,
          0x158: 0x100000,
          0x168: 0x401,
          0x178: 0x2100400,
          0x188: 0x2000001,
          0x198: 0x2100000,
          0x1a8: 0x0,
          0x1b8: 0x2100401,
          0x1c8: 0x100401,
          0x1d8: 0x400,
          0x1e8: 0x2000400,
          0x1f8: 0x100001
        }, {
          0x0: 0x8000820,
          0x1: 0x20000,
          0x2: 0x8000000,
          0x3: 0x20,
          0x4: 0x20020,
          0x5: 0x8020820,
          0x6: 0x8020800,
          0x7: 0x800,
          0x8: 0x8020000,
          0x9: 0x8000800,
          0xa: 0x20800,
          0xb: 0x8020020,
          0xc: 0x820,
          0xd: 0x0,
          0xe: 0x8000020,
          0xf: 0x20820,
          0x80000000: 0x800,
          0x80000001: 0x8020820,
          0x80000002: 0x8000820,
          0x80000003: 0x8000000,
          0x80000004: 0x8020000,
          0x80000005: 0x20800,
          0x80000006: 0x20820,
          0x80000007: 0x20,
          0x80000008: 0x8000020,
          0x80000009: 0x820,
          0x8000000a: 0x20020,
          0x8000000b: 0x8020800,
          0x8000000c: 0x0,
          0x8000000d: 0x8020020,
          0x8000000e: 0x8000800,
          0x8000000f: 0x20000,
          0x10: 0x20820,
          0x11: 0x8020800,
          0x12: 0x20,
          0x13: 0x800,
          0x14: 0x8000800,
          0x15: 0x8000020,
          0x16: 0x8020020,
          0x17: 0x20000,
          0x18: 0x0,
          0x19: 0x20020,
          0x1a: 0x8020000,
          0x1b: 0x8000820,
          0x1c: 0x8020820,
          0x1d: 0x20800,
          0x1e: 0x820,
          0x1f: 0x8000000,
          0x80000010: 0x20000,
          0x80000011: 0x800,
          0x80000012: 0x8020020,
          0x80000013: 0x20820,
          0x80000014: 0x20,
          0x80000015: 0x8020000,
          0x80000016: 0x8000000,
          0x80000017: 0x8000820,
          0x80000018: 0x8020820,
          0x80000019: 0x8000020,
          0x8000001a: 0x8000800,
          0x8000001b: 0x0,
          0x8000001c: 0x20800,
          0x8000001d: 0x820,
          0x8000001e: 0x20020,
          0x8000001f: 0x8020800
        }]; // Masks that select the SBOX input

        var SBOX_MASK = [0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000, 0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f];
        /**
         * DES block cipher algorithm.
         */

        var DES = C_algo.DES = BlockCipher.extend({
          _doReset: function _doReset() {
            // Shortcuts
            var key = this._key;
            var keyWords = key.words; // Select 56 bits according to PC1

            var keyBits = [];

            for (var i = 0; i < 56; i++) {
              var keyBitPos = PC1[i] - 1;
              keyBits[i] = keyWords[keyBitPos >>> 5] >>> 31 - keyBitPos % 32 & 1;
            } // Assemble 16 subkeys


            var subKeys = this._subKeys = [];

            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
              // Create subkey
              var subKey = subKeys[nSubKey] = []; // Shortcut

              var bitShift = BIT_SHIFTS[nSubKey]; // Select 48 bits according to PC2

              for (var i = 0; i < 24; i++) {
                // Select from the left 28 key bits
                subKey[i / 6 | 0] |= keyBits[(PC2[i] - 1 + bitShift) % 28] << 31 - i % 6; // Select from the right 28 key bits

                subKey[4 + (i / 6 | 0)] |= keyBits[28 + (PC2[i + 24] - 1 + bitShift) % 28] << 31 - i % 6;
              } // Since each subkey is applied to an expanded 32-bit input,
              // the subkey can be broken into 8 values scaled to 32-bits,
              // which allows the key to be used without expansion


              subKey[0] = subKey[0] << 1 | subKey[0] >>> 31;

              for (var i = 1; i < 7; i++) {
                subKey[i] = subKey[i] >>> (i - 1) * 4 + 3;
              }

              subKey[7] = subKey[7] << 5 | subKey[7] >>> 27;
            } // Compute inverse subkeys


            var invSubKeys = this._invSubKeys = [];

            for (var i = 0; i < 16; i++) {
              invSubKeys[i] = subKeys[15 - i];
            }
          },
          encryptBlock: function encryptBlock(M, offset) {
            this._doCryptBlock(M, offset, this._subKeys);
          },
          decryptBlock: function decryptBlock(M, offset) {
            this._doCryptBlock(M, offset, this._invSubKeys);
          },
          _doCryptBlock: function _doCryptBlock(M, offset, subKeys) {
            // Get input
            this._lBlock = M[offset];
            this._rBlock = M[offset + 1]; // Initial permutation

            exchangeLR.call(this, 4, 0x0f0f0f0f);
            exchangeLR.call(this, 16, 0x0000ffff);
            exchangeRL.call(this, 2, 0x33333333);
            exchangeRL.call(this, 8, 0x00ff00ff);
            exchangeLR.call(this, 1, 0x55555555); // Rounds

            for (var round = 0; round < 16; round++) {
              // Shortcuts
              var subKey = subKeys[round];
              var lBlock = this._lBlock;
              var rBlock = this._rBlock; // Feistel function

              var f = 0;

              for (var i = 0; i < 8; i++) {
                f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
              }

              this._lBlock = rBlock;
              this._rBlock = lBlock ^ f;
            } // Undo swap from last round


            var t = this._lBlock;
            this._lBlock = this._rBlock;
            this._rBlock = t; // Final permutation

            exchangeLR.call(this, 1, 0x55555555);
            exchangeRL.call(this, 8, 0x00ff00ff);
            exchangeRL.call(this, 2, 0x33333333);
            exchangeLR.call(this, 16, 0x0000ffff);
            exchangeLR.call(this, 4, 0x0f0f0f0f); // Set output

            M[offset] = this._lBlock;
            M[offset + 1] = this._rBlock;
          },
          keySize: 64 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        }); // Swap bits across the left and right words

        function exchangeLR(offset, mask) {
          var t = (this._lBlock >>> offset ^ this._rBlock) & mask;
          this._rBlock ^= t;
          this._lBlock ^= t << offset;
        }

        function exchangeRL(offset, mask) {
          var t = (this._rBlock >>> offset ^ this._lBlock) & mask;
          this._lBlock ^= t;
          this._rBlock ^= t << offset;
        }
        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
         */


        C.DES = BlockCipher._createHelper(DES);
        /**
         * Triple-DES block cipher algorithm.
         */

        var TripleDES = C_algo.TripleDES = BlockCipher.extend({
          _doReset: function _doReset() {
            // Shortcuts
            var key = this._key;
            var keyWords = key.words; // Make sure the key length is valid (64, 128 or >= 192 bit)

            if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
              throw new Error('Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.');
            } // Extend the key according to the keying options defined in 3DES standard


            var key1 = keyWords.slice(0, 2);
            var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
            var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6); // Create DES instances

            this._des1 = DES.createEncryptor(WordArray.create(key1));
            this._des2 = DES.createEncryptor(WordArray.create(key2));
            this._des3 = DES.createEncryptor(WordArray.create(key3));
          },
          encryptBlock: function encryptBlock(M, offset) {
            this._des1.encryptBlock(M, offset);

            this._des2.decryptBlock(M, offset);

            this._des3.encryptBlock(M, offset);
          },
          decryptBlock: function decryptBlock(M, offset) {
            this._des3.decryptBlock(M, offset);

            this._des2.encryptBlock(M, offset);

            this._des1.decryptBlock(M, offset);
          },
          keySize: 192 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
         */

        C.TripleDES = BlockCipher._createHelper(TripleDES);
      })();

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var StreamCipher = C_lib.StreamCipher;
        var C_algo = C.algo;
        /**
         * RC4 stream cipher algorithm.
         */

        var RC4 = C_algo.RC4 = StreamCipher.extend({
          _doReset: function _doReset() {
            // Shortcuts
            var key = this._key;
            var keyWords = key.words;
            var keySigBytes = key.sigBytes; // Init sbox

            var S = this._S = [];

            for (var i = 0; i < 256; i++) {
              S[i] = i;
            } // Key setup


            for (var i = 0, j = 0; i < 256; i++) {
              var keyByteIndex = i % keySigBytes;
              var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 0xff;
              j = (j + S[i] + keyByte) % 256; // Swap

              var t = S[i];
              S[i] = S[j];
              S[j] = t;
            } // Counters


            this._i = this._j = 0;
          },
          _doProcessBlock: function _doProcessBlock(M, offset) {
            M[offset] ^= generateKeystreamWord.call(this);
          },
          keySize: 256 / 32,
          ivSize: 0
        });

        function generateKeystreamWord() {
          // Shortcuts
          var S = this._S;
          var i = this._i;
          var j = this._j; // Generate keystream word

          var keystreamWord = 0;

          for (var n = 0; n < 4; n++) {
            i = (i + 1) % 256;
            j = (j + S[i]) % 256; // Swap

            var t = S[i];
            S[i] = S[j];
            S[j] = t;
            keystreamWord |= S[(S[i] + S[j]) % 256] << 24 - n * 8;
          } // Update counters


          this._i = i;
          this._j = j;
          return keystreamWord;
        }
        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
         */


        C.RC4 = StreamCipher._createHelper(RC4);
        /**
         * Modified RC4 stream cipher algorithm.
         */

        var RC4Drop = C_algo.RC4Drop = RC4.extend({
          /**
           * Configuration options.
           *
           * @property {number} drop The number of keystream words to drop. Default 192
           */
          cfg: RC4.cfg.extend({
            drop: 192
          }),
          _doReset: function _doReset() {
            RC4._doReset.call(this); // Drop


            for (var i = this.cfg.drop; i > 0; i--) {
              generateKeystreamWord.call(this);
            }
          }
        });
        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
         */

        C.RC4Drop = StreamCipher._createHelper(RC4Drop);
      })();

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var StreamCipher = C_lib.StreamCipher;
        var C_algo = C.algo; // Reusable objects

        var S = [];
        var C_ = [];
        var G = [];
        /**
         * Rabbit stream cipher algorithm
         */

        var Rabbit = C_algo.Rabbit = StreamCipher.extend({
          _doReset: function _doReset() {
            // Shortcuts
            var K = this._key.words;
            var iv = this.cfg.iv; // Swap endian

            for (var i = 0; i < 4; i++) {
              K[i] = (K[i] << 8 | K[i] >>> 24) & 0x00ff00ff | (K[i] << 24 | K[i] >>> 8) & 0xff00ff00;
            } // Generate initial state values


            var X = this._X = [K[0], K[3] << 16 | K[2] >>> 16, K[1], K[0] << 16 | K[3] >>> 16, K[2], K[1] << 16 | K[0] >>> 16, K[3], K[2] << 16 | K[1] >>> 16]; // Generate initial counter values

            var C = this._C = [K[2] << 16 | K[2] >>> 16, K[0] & 0xffff0000 | K[1] & 0x0000ffff, K[3] << 16 | K[3] >>> 16, K[1] & 0xffff0000 | K[2] & 0x0000ffff, K[0] << 16 | K[0] >>> 16, K[2] & 0xffff0000 | K[3] & 0x0000ffff, K[1] << 16 | K[1] >>> 16, K[3] & 0xffff0000 | K[0] & 0x0000ffff]; // Carry bit

            this._b = 0; // Iterate the system four times

            for (var i = 0; i < 4; i++) {
              nextState.call(this);
            } // Modify the counters


            for (var i = 0; i < 8; i++) {
              C[i] ^= X[i + 4 & 7];
            } // IV setup


            if (iv) {
              // Shortcuts
              var IV = iv.words;
              var IV_0 = IV[0];
              var IV_1 = IV[1]; // Generate four subvectors

              var i0 = (IV_0 << 8 | IV_0 >>> 24) & 0x00ff00ff | (IV_0 << 24 | IV_0 >>> 8) & 0xff00ff00;
              var i2 = (IV_1 << 8 | IV_1 >>> 24) & 0x00ff00ff | (IV_1 << 24 | IV_1 >>> 8) & 0xff00ff00;
              var i1 = i0 >>> 16 | i2 & 0xffff0000;
              var i3 = i2 << 16 | i0 & 0x0000ffff; // Modify counter values

              C[0] ^= i0;
              C[1] ^= i1;
              C[2] ^= i2;
              C[3] ^= i3;
              C[4] ^= i0;
              C[5] ^= i1;
              C[6] ^= i2;
              C[7] ^= i3; // Iterate the system four times

              for (var i = 0; i < 4; i++) {
                nextState.call(this);
              }
            }
          },
          _doProcessBlock: function _doProcessBlock(M, offset) {
            // Shortcut
            var X = this._X; // Iterate the system

            nextState.call(this); // Generate four keystream words

            S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
            S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
            S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
            S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;

            for (var i = 0; i < 4; i++) {
              // Swap endian
              S[i] = (S[i] << 8 | S[i] >>> 24) & 0x00ff00ff | (S[i] << 24 | S[i] >>> 8) & 0xff00ff00; // Encrypt

              M[offset + i] ^= S[i];
            }
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });

        function nextState() {
          // Shortcuts
          var X = this._X;
          var C = this._C; // Save old counter values

          for (var i = 0; i < 8; i++) {
            C_[i] = C[i];
          } // Calculate new counter values


          C[0] = C[0] + 0x4d34d34d + this._b | 0;
          C[1] = C[1] + 0xd34d34d3 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
          C[2] = C[2] + 0x34d34d34 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
          C[3] = C[3] + 0x4d34d34d + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
          C[4] = C[4] + 0xd34d34d3 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
          C[5] = C[5] + 0x34d34d34 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
          C[6] = C[6] + 0x4d34d34d + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
          C[7] = C[7] + 0xd34d34d3 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
          this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0; // Calculate the g-values

          for (var i = 0; i < 8; i++) {
            var gx = X[i] + C[i]; // Construct high and low argument for squaring

            var ga = gx & 0xffff;
            var gb = gx >>> 16; // Calculate high and low result of squaring

            var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
            var gl = ((gx & 0xffff0000) * gx | 0) + ((gx & 0x0000ffff) * gx | 0); // High XOR low

            G[i] = gh ^ gl;
          } // Calculate new state values


          X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
          X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
          X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
          X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
          X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
          X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
          X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
          X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
        }
        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
         */


        C.Rabbit = StreamCipher._createHelper(Rabbit);
      })();

      (function () {
        // Shortcuts
        var C = CryptoJS;
        var C_lib = C.lib;
        var StreamCipher = C_lib.StreamCipher;
        var C_algo = C.algo; // Reusable objects

        var S = [];
        var C_ = [];
        var G = [];
        /**
         * Rabbit stream cipher algorithm.
         *
         * This is a legacy version that neglected to convert the key to little-endian.
         * This error doesn't affect the cipher's security,
         * but it does affect its compatibility with other implementations.
         */

        var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
          _doReset: function _doReset() {
            // Shortcuts
            var K = this._key.words;
            var iv = this.cfg.iv; // Generate initial state values

            var X = this._X = [K[0], K[3] << 16 | K[2] >>> 16, K[1], K[0] << 16 | K[3] >>> 16, K[2], K[1] << 16 | K[0] >>> 16, K[3], K[2] << 16 | K[1] >>> 16]; // Generate initial counter values

            var C = this._C = [K[2] << 16 | K[2] >>> 16, K[0] & 0xffff0000 | K[1] & 0x0000ffff, K[3] << 16 | K[3] >>> 16, K[1] & 0xffff0000 | K[2] & 0x0000ffff, K[0] << 16 | K[0] >>> 16, K[2] & 0xffff0000 | K[3] & 0x0000ffff, K[1] << 16 | K[1] >>> 16, K[3] & 0xffff0000 | K[0] & 0x0000ffff]; // Carry bit

            this._b = 0; // Iterate the system four times

            for (var i = 0; i < 4; i++) {
              nextState.call(this);
            } // Modify the counters


            for (var i = 0; i < 8; i++) {
              C[i] ^= X[i + 4 & 7];
            } // IV setup


            if (iv) {
              // Shortcuts
              var IV = iv.words;
              var IV_0 = IV[0];
              var IV_1 = IV[1]; // Generate four subvectors

              var i0 = (IV_0 << 8 | IV_0 >>> 24) & 0x00ff00ff | (IV_0 << 24 | IV_0 >>> 8) & 0xff00ff00;
              var i2 = (IV_1 << 8 | IV_1 >>> 24) & 0x00ff00ff | (IV_1 << 24 | IV_1 >>> 8) & 0xff00ff00;
              var i1 = i0 >>> 16 | i2 & 0xffff0000;
              var i3 = i2 << 16 | i0 & 0x0000ffff; // Modify counter values

              C[0] ^= i0;
              C[1] ^= i1;
              C[2] ^= i2;
              C[3] ^= i3;
              C[4] ^= i0;
              C[5] ^= i1;
              C[6] ^= i2;
              C[7] ^= i3; // Iterate the system four times

              for (var i = 0; i < 4; i++) {
                nextState.call(this);
              }
            }
          },
          _doProcessBlock: function _doProcessBlock(M, offset) {
            // Shortcut
            var X = this._X; // Iterate the system

            nextState.call(this); // Generate four keystream words

            S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
            S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
            S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
            S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;

            for (var i = 0; i < 4; i++) {
              // Swap endian
              S[i] = (S[i] << 8 | S[i] >>> 24) & 0x00ff00ff | (S[i] << 24 | S[i] >>> 8) & 0xff00ff00; // Encrypt

              M[offset + i] ^= S[i];
            }
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });

        function nextState() {
          // Shortcuts
          var X = this._X;
          var C = this._C; // Save old counter values

          for (var i = 0; i < 8; i++) {
            C_[i] = C[i];
          } // Calculate new counter values


          C[0] = C[0] + 0x4d34d34d + this._b | 0;
          C[1] = C[1] + 0xd34d34d3 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
          C[2] = C[2] + 0x34d34d34 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
          C[3] = C[3] + 0x4d34d34d + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
          C[4] = C[4] + 0xd34d34d3 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
          C[5] = C[5] + 0x34d34d34 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
          C[6] = C[6] + 0x4d34d34d + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
          C[7] = C[7] + 0xd34d34d3 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
          this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0; // Calculate the g-values

          for (var i = 0; i < 8; i++) {
            var gx = X[i] + C[i]; // Construct high and low argument for squaring

            var ga = gx & 0xffff;
            var gb = gx >>> 16; // Calculate high and low result of squaring

            var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
            var gl = ((gx & 0xffff0000) * gx | 0) + ((gx & 0x0000ffff) * gx | 0); // High XOR low

            G[i] = gh ^ gl;
          } // Calculate new state values


          X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
          X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
          X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
          X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
          X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
          X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
          X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
          X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
        }
        /**
         * Shortcut functions to the cipher's object interface.
         *
         * @example
         *
         *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
         *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
         */


        C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
      })();

      return CryptoJS;
    }

    function alloha(component, _object) {
      var cryptoJS = new CryptoJS();
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var av1_support = Lampa.Storage.field('online_mod_av1_support') === true;
      var prox = component.proxy('alloha');
      var prox2 = component.proxy('allohacdn');
      var token = 'd317441359e505c343c2063edc97e7';
      var embed = prox + 'https://api.apbugall.org/?token=' + token;
      var decrypt = Utils.decodeSecret([16, 86, 76, 90, 80, 77, 93, 95, 90, 16, 67, 77, 70, 31, 25, 65, 66, 88, 20, 16, 77, 91, 88, 92, 90, 25, 79, 24, 70, 88, 70, 19, 92, 76, 68, 70, 89, 83, 77, 20, 14, 25, 79, 77, 15, 24, 70, 88, 70, 19, 81, 91, 67, 64, 24, 13, 25, 65, 65, 85, 26, 93, 85, 76, 83, 81, 28, 28, 103, 28, 88, 64, 76, 64, 74, 11, 9, 101, 27, 108, 27, 99, 110, 101, 27, 110, 18, 29, 108, 27, 23, 25, 2, 20, 90, 95, 20, 24, 92, 87, 67, 77, 29, 72, 25, 66, 81, 70, 24, 89, 93, 107, 64, 72, 20, 13, 20, 75, 68, 75, 26, 94, 88, 64, 83, 92, 16, 31, 79, 85, 65, 25, 93, 84, 107, 75, 65, 25, 9, 19, 30, 28, 107, 106, 31, 109, 19, 29, 20, 2, 27, 25, 15, 24, 85, 65, 64, 65, 88, 87, 68, 26, 81, 84, 102, 71, 66, 25, 9, 16, 93, 92, 111, 74, 69, 19, 6, 20, 89, 80, 103, 67, 72, 111, 2, 100, 20, 10, 20, 31, 23, 2, 20, 86, 65, 64, 66, 85, 91, 68, 23, 68, 92, 74, 64, 84, 85, 76, 81, 25, 9, 19, 30, 18, 68, 91, 83, 85, 87, 9, 20, 25, 31, 16, 81, 86, 83, 86, 80, 86, 108, 102, 121, 119, 87, 93, 73, 91, 93, 92, 90, 68, 28, 76, 95, 82, 81, 93, 16, 20, 27, 20, 31, 22, 80, 80, 108, 74, 69, 13, 19, 24, 27, 25, 81, 93, 90, 91, 84, 81, 109, 98, 112, 119, 92, 84, 68, 95, 90, 93, 94, 77, 28, 86, 65, 64, 66, 85, 91, 68, 23, 93, 87, 102, 71, 65, 29, 3, 16, 79, 85, 65, 25, 70, 85, 82, 93, 66, 92, 70, 19, 4, 20, 85, 76, 76, 66, 88, 87, 71, 23, 93, 84, 107, 75, 65, 25, 11, 19, 117, 85, 93, 68, 89, 30, 108, 64, 90, 85, 71, 30, 85, 92, 84, 108, 70, 95, 122, 91, 93, 68, 87, 94, 92, 90, 71, 17, 65, 66, 88, 20, 16, 30, 65, 90, 93, 107, 65, 9, 31, 16, 18, 20, 86, 87, 87, 95, 80, 93, 101, 107, 125, 112, 86, 89, 64, 91, 86, 85, 87, 64, 27, 92, 76, 68, 70, 89, 83, 77, 26, 90, 93, 107, 67, 69, 17, 25, 25, 14, 19, 76, 70, 92, 15, 24, 85, 65, 64, 65, 88, 87, 68, 26, 92, 95, 84, 85, 90, 87, 20, 13, 20, 80, 95, 74, 64, 104, 8, 105, 16, 31, 24, 23, 22, 19, 8, 25, 81, 72, 64, 74, 81, 90, 64, 29, 73, 70, 95, 76, 10, 16, 4, 20, 27, 30, 68, 81, 70, 89, 93, 6, 123, 65, 80, 83, 89, 90, 5, 23, 25, 31, 19, 92, 90, 83, 91, 92, 85, 108, 102, 122, 122, 91, 93, 68, 87, 94, 92, 90, 71, 17, 92, 95, 71, 76, 107, 8, 105, 26, 25, 31, 16, 19, 23, 23, 16, 20, 24, 25, 28, 23, 68, 89, 66, 88, 89, 12, 107, 81, 86, 81, 74, 85, 75, 9, 20, 25, 31, 16, 81, 86, 83, 86, 80, 86, 108, 102, 121, 119, 87, 93, 73, 91, 93, 92, 90, 68, 28, 74, 85, 95, 81, 65, 92, 70, 25, 20, 19, 16, 30, 27, 20, 16, 15, 16, 81, 64, 68, 75, 85, 80, 77, 26, 88, 81, 89, 84, 92, 70, 64, 25, 9, 16, 120, 89, 93, 73, 85, 29, 105, 88, 81, 64, 94, 95, 75, 89, 29, 80, 71, 24, 19, 89, 94, 93, 70, 92, 80, 80, 23, 29, 24, 15, 25, 79, 19, 30, 123, 66, 93, 95, 89, 87, 19, 9, 25, 92, 95, 71, 76, 107, 8, 105, 31, 25, 19, 98, 81, 94, 85, 75, 81, 65, 30, 14, 16, 70, 93, 86, 92, 70, 86, 75, 20, 77, 20, 2, 16, 66, 73, 8, 25, 73, 16, 70, 93, 68, 76, 70, 93, 25, 81, 72, 64, 74, 81, 90, 64, 8, 25, 73, 25, 26, 91, 81, 85, 88, 27, 66, 73, 28]);
      var decrypt2 = Utils.decodeSecret([16, 86, 76, 90, 80, 77, 93, 95, 90, 16, 67, 90, 70, 90, 73, 64, 28, 20, 76, 95, 82, 81, 93, 21, 20, 89, 80, 17, 75, 25, 66, 82, 75, 20, 71, 93, 86, 84, 86, 67, 19, 4, 20, 75, 73, 20, 16, 29, 20, 14, 25, 79, 77, 15, 24, 70, 88, 70, 19, 97, 121, 124, 124, 76, 68, 73, 102, 86, 72, 65, 85, 71, 76, 16, 4, 20, 85, 76, 90, 83, 64, 81, 95, 87, 20, 107, 116, 120, 120, 64, 76, 64, 107, 81, 66, 76, 81, 67, 64, 16, 25, 66, 20, 71, 81, 93, 67, 26, 87, 64, 92, 90, 19, 4, 20, 86, 65, 86, 83, 77, 93, 92, 87, 28, 25, 79, 69, 11, 25, 64, 91, 80, 71, 30, 71, 93, 68, 107, 81, 66, 76, 81, 67, 64, 112, 85, 88, 80, 86, 75, 20, 13, 20, 94, 69, 87, 87, 71, 80, 91, 94, 28, 17, 75, 68, 15, 19, 77, 92, 89, 71, 22, 67, 92, 90, 87, 25, 9, 16, 82, 77, 94, 90, 64, 90, 86, 90, 24, 29, 67, 77, 2, 20, 78, 2, 20, 70, 85, 74, 16, 97, 112, 92, 84, 85, 89, 90, 106, 85, 72, 65, 86, 74, 64, 16, 9, 24, 104, 116, 120, 123, 77, 64, 64, 102, 93, 65, 76, 81, 64, 77, 15, 16, 64, 74, 73, 25, 79, 19, 92, 66, 81, 88, 16, 67, 90, 70, 90, 73, 64, 25, 15, 24, 77, 25, 87, 82, 77, 87, 88, 20, 16, 85, 16, 79, 78, 25, 70, 85, 64, 77, 66, 87, 20, 72, 25, 69, 69, 81, 74, 73, 3, 20, 17, 6, 87, 88, 65, 72, 81, 90, 92, 70, 73, 71, 13, 22, 24, 27, 25, 81, 93, 90, 91, 84, 81, 109, 98, 112, 119, 92, 84, 68, 95, 90, 93, 94, 77, 28, 73, 65, 66, 81, 71, 92, 81, 74, 80, 82, 74, 66, 81, 71, 92, 87, 88, 71, 85, 79, 80, 25, 24, 24, 64, 86, 71, 71, 93, 85, 68, 85, 2, 16, 27, 89, 70, 93, 93, 92, 85, 90, 81, 93, 83, 86, 64, 9, 18, 20, 19, 16, 92, 90, 80, 86, 80, 85, 97, 106, 121, 122, 91, 94, 73, 91, 94, 81, 86, 68, 17, 64, 92, 82, 81, 94, 29, 24, 27, 25, 22, 21, 87, 81, 71, 89, 77, 84, 80, 88, 82, 91, 85, 84, 9, 26, 16, 18, 20, 86, 87, 87, 95, 80, 93, 101, 107, 125, 112, 86, 89, 64, 91, 86, 85, 87, 64, 27, 80, 80, 25, 20, 19, 16, 27, 18, 92, 85, 80, 93, 65, 92, 89, 85, 85, 81, 88, 80, 13, 22, 24, 27, 25, 81, 93, 90, 91, 84, 81, 109, 98, 112, 119, 92, 84, 68, 95, 90, 93, 94, 77, 28, 70, 76, 69, 25, 24, 24, 70, 10, 14, 19, 74, 71, 28, 20, 78, 1, 3, 20, 64, 77, 86, 16, 73, 3, 16, 68, 29, 29, 90, 85, 92, 88, 16, 75, 68, 24]);
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };

      function alloha_api_search(api, callback, error) {
        network.clear();
        network.timeout(10000);
        network["native"](embed + '&' + api, function (json) {
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
          if (json.data && json.data.iframe) getPage(json.data);else if (!object.clarification && object.movie.imdb_id && kinopoisk_id != object.movie.imdb_id) {
            alloha_api_search('imdb=' + object.movie.imdb_id, function (json) {
              if (json.data && json.data.iframe) getPage(json.data);else component.emptyForQuery(select_title);
            }, error);
          } else component.emptyForQuery(select_title);
        }, error);
      };

      function getPage(data) {
        network.clear();
        network.timeout(10000);
        network["native"](prox + data.iframe, function (str) {
          parse(str, data.iframe);
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


      function extractItems(str) {
        if (!str) return [];

        try {
          var items = component.parsePlaylist(str).map(function (item) {
            var links = item.links;

            if (!av1_support) {
              var tmp = links.filter(function (link) {
                return !/(https?:\/\/[^\/]+)\/ha\//.test(link);
              });
              if (tmp.length) links = tmp;
            }

            var link = links[0] || '';
            return {
              label: item.voice,
              quality: NaN,
              file: link
            };
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
            url: link
          };
        });
        return subtitles.length ? subtitles : false;
      }

      function parse(str, url) {
        str = str.replace(/\n/g, '');
        var serial = str.match(/var serial = '(\{.*\})';/);
        var buttons = str.match(/<button\b[^>]*\bdata-id-file=.*?<\/button>/g);
        var id = str.match(/var id = (\d+);/);
        extract = {};

        try {
          extract = (0, eval)(decrypt + [JSON.stringify(str), JSON.stringify(url), JSON.stringify(token)].join(',') + ');');
        } catch (e) {}

        if (serial) {
          extract.serial = Lampa.Arrays.decodeJson(serial[1], {});
          component.loading(false);
          filter();
          append(filtred());
        } else if (buttons || id) {
          var translations;

          if (buttons) {
            translations = buttons.map(function (b) {
              var button = $(b);
              return {
                id: button.attr('data-id-file') || '',
                title: button.text() || ''
              };
            });
          } else {
            translations = [{
              id: id[1] || '',
              title: select_title
            }];
          }

          extract.translations = [];
          getTranslations(translations, function () {
            component.loading(false);
            filter();
            append(filtred());
          });
        } else component.emptyForQuery(select_title);
      }

      function getTranslations(translations, call) {
        if (translations && translations.length) {
          var t = translations.shift();
          var element = {
            media: t
          };
          getBaseStream(element, function (element) {
            if (element.voices) {
              element.voices.forEach(function (v) {
                extract.translations.push({
                  id: t.id,
                  title: (t.title !== select_title ? t.title + ' / ' : '') + v.label,
                  stream: v.file,
                  qualitys: false,
                  subtitles: element.subtitles
                });
              });
            } else {
              extract.translations.push({
                id: t.id,
                title: t.title,
                stream: element.stream,
                qualitys: element.qualitys,
                subtitles: element.subtitles
              });
            }

            getTranslations(translations, call);
          }, function () {
            extract.translations.push({
              id: t.id,
              title: t.title
            });
            getTranslations(translations, call);
          });
        } else call();
      }

      function decode(data, aes) {
        if (data.startsWith('#9')) return decodeAES(data.substring(2), aes);
        if (data.startsWith('#7')) return decodeTrash(data.substring(2));
        return data;
      }

      function decodeAES(data, aes) {
        var y = data.split('##');

        if (y.length == 3) {
          try {
            return JSON.parse(cryptoJS.AES.decrypt('{"ct":"' + y[0] + '","iv":"' + y[1] + '","s":"' + y[2] + '"}', aes, {
              format: {
                stringify: function stringify(cipherParams) {
                  var j = {
                    ct: cipherParams.ciphertext.toString(cryptoJS.enc.Base64)
                  };
                  if (cipherParams.iv) j.iv = cipherParams.iv.toString();
                  if (cipherParams.salt) j.s = cipherParams.salt.toString();
                  return JSON.stringify(j);
                },
                parse: function parse(jsonStr) {
                  var j = JSON.parse(jsonStr);
                  var cipherParams = cryptoJS.lib.CipherParams.create({
                    ciphertext: cryptoJS.enc.Base64.parse(j.ct)
                  });
                  if (j.iv) cipherParams.iv = cryptoJS.enc.Hex.parse(j.iv);
                  if (j.s) cipherParams.salt = cryptoJS.enc.Hex.parse(j.s);
                  return cipherParams;
                }
              }
            }).toString(cryptoJS.enc.Utf8));
          } catch (e) {}
        }

        return '';
      }

      function decodeTrash(data) {
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

        var trashList = [';!?^№>*^*`||^<*№||^*`^**|№*~][|>|', '|[>*№>^?[;||>|*<**№]||^<**|', '<`^*`*>|№**№]?[*;||>|*№;^*`№*>', '?;>)!(*;||>|*<^|*|^*`>?|(|*>||~][|>|*^*', '?|;^^|*>*>??>^|^<|>|?!*№(|;!?^№>'];
        var x = data;
        trashList.forEach(function (trash) {
          x = x.replace('##' + enc(trash), '');
        });

        try {
          x = dec(x);
        } catch (e) {
          x = '';
        }

        return x;
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

        if (extract.serial) {
          for (var s_num in extract.serial) {
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
          var episodes = extract.serial[_s_num] || {};

          for (var e_num in episodes) {
            var translations = episodes[e_num] || {};

            var _loop = function _loop(v_id) {
              if (!filter_items.voice_info.find(function (v) {
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

        if (extract.serial) {
          if (filter_items.season[choice.season] && filter_items.voice_info[choice.voice]) {
            var s_num = filter_items.season_num[choice.season];
            var v_id = filter_items.voice_info[choice.voice].id;
            var voice = filter_items.voice[choice.voice];
            var episodes = extract.serial[s_num] || {};

            for (var e_num in episodes) {
              var translations = episodes[e_num] || {};

              if (translations[v_id]) {
                filtred.push({
                  title: 'S' + s_num + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + e_num,
                  quality: '360p ~ 1080p',
                  info: ' / ' + Lampa.Utils.shortText(voice, 50),
                  season: s_num,
                  episode: e_num,
                  media: translations[v_id]
                });
              }
            }
          }
        } else if (extract.translations) {
          extract.translations.forEach(function (t) {
            filtred.push({
              title: t.title || select_title,
              quality: '360p ~ 1080p',
              info: '',
              media: t,
              stream: t.stream,
              qualitys: t.qualitys,
              subtitles: t.subtitles
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
        getBaseStream(element, function (element) {
          var file = element.stream || '';
          if (element.parsed || !file.endsWith('.m3u8')) return call(element);
          network.clear();
          network.timeout(10000);
          network["native"]((prox2 ? prox2 + extract.prox2 : prox) + file, function (str) {
            var items = extractQuality(str, file);
            items = items.filter(function (elem) {
              return elem.quality > 0;
            });
            var tmp = items.filter(function (elem) {
              return elem.codecs.indexOf('avc1') !== -1 && elem.codecs.indexOf('mp4a') !== -1;
            });
            if (tmp.length) items = tmp;

            if (items.length) {
              file = items[0].file;
              var quality = {};
              items.forEach(function (item) {
                if (!quality[item.label]) quality[item.label] = item.file;
              });
              var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
              if (quality[preferably]) file = quality[preferably];
              element.stream = file;
              element.qualitys = quality;
            }

            element.parsed = true;
            call(element);
          }, function (a, c) {
            call(element);
          }, false, {
            dataType: 'text',
            headers: extract.headers
          });
        }, error);
      }

      function extractQuality(str, url) {
        if (!str) return [];

        try {
          var base_url = url.substring(0, url.lastIndexOf('/'));
          var items = component.parseM3U(str).filter(function (item) {
            return item.xstream;
          }).map(function (item) {
            var link = item.link;
            var quality = item.height;
            if (quality > 1440 && quality <= 2160) quality = 2160;else if (quality > 1080 && quality <= 1440) quality = 1440;else if (quality > 720 && quality <= 1080) quality = 1080;else if (quality > 480 && quality <= 720) quality = 720;else if (quality > 360 && quality <= 480) quality = 480;else if (quality > 240 && quality <= 360) quality = 360;

            if (!quality) {
              var alt_quality = link.match(/\b(\d\d\d+)\b/);

              if (alt_quality) {
                var alt_height = parseInt(alt_quality[1]);
                if (alt_height > quality && alt_height <= 4320) quality = alt_height;
              }
            }

            return {
              label: quality ? quality + 'p' : '360p ~ 1080p',
              quality: quality,
              bandwidth: item.bandwidth,
              codecs: item.codecs,
              file: link.indexOf('://') == -1 ? base_url + '/' + (link.startsWith('/') ? link.substring(1) : link) : link
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
      /**
       * Получить поток
       * @param {*} element
       */


      function getBaseStream(element, call, error) {
        if (element.stream) return call(element);
        if (!(element.media.id && extract.domain)) return error();
        var postdata = 'player_ajax=1';
        postdata += '&id_file=' + encodeURIComponent(element.media.id);
        postdata += extract.postdata;
        network.clear();
        network.timeout(10000);
        network["native"]((prox2 ? prox2 + extract.prox2 : prox) + extract.domain, function (json) {
          if (json.url) {
            var decodeStream = function decodeStream(aes) {
              var file = decode(json.url, aes);

              if (element.params) {
                file = file.replace(/\{v3\}/g, element.params.v3);
                file = file.replace(/\{v1\}/g, element.params.v1);
              }

              if (file.charAt(0) === '{') {
                var items = extractItems('[]' + file);

                if (items && items.length) {
                  element.voices = items;
                  file = items[0].file;
                  var voices = {};
                  items.forEach(function (item) {
                    voices[item.label] = item.file;
                  });
                  if (voices[json.default_audio]) file = voices[json.default_audio];
                } else file = '';
              }

              if (file) {
                element.stream = file;
                element.qualitys = false;
                element.subtitles = false;
                var subtitle = decode(json.subtitle || '', aes);

                if (subtitle.endsWith('index.php')) {
                  network.clear();
                  network.timeout(10000);
                  network["native"]((prox2 ? prox2 + extract.prox2 : prox) + subtitle, function (str) {
                    element.subtitles = parseSubs(str);
                    call(element);
                  }, function (a, c) {
                    call(element);
                  }, false, {
                    dataType: 'text',
                    headers: extract.headers
                  });
                } else call(element);
              } else error();
            };

            var params = null;

            try {
              params = (0, eval)(decrypt2 + [JSON.stringify(json.tokenq), JSON.stringify(token), JSON.stringify(element.media.id)].join(',') + ');');
            } catch (e) {}

            element.params = params;

            if (params) {
              network.clear();
              network.timeout(10000);
              network["native"]((prox2 ? prox2 + extract.prox2 : prox) + extract.domain + params.query, decodeStream, function (a, c) {
                decodeStream('');
              }, params.postdata, {
                dataType: 'text',
                headers: extract.headers
              });
            } else decodeStream('');
          } else error();
        }, error, postdata, {
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
                url: element.stream,
                quality: element.qualitys,
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
                          cell.url = elem.stream;
                          cell.quality = elem.qualitys;
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

    function redheadsound(component, _object) {
      var network = new Lampa.Reguest();
      var extract = [];
      var object = _object;
      var select_title = '';
      var page_title = '';
      var prox = component.proxy('redheadsound');
      var embed = prox + 'https://redheadsound.studio/';
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
        var orig = object.movie.original_title || object.movie.original_name;
        var url = embed + 'index.php?do=search';

        var display = function display(links) {
          if (links && links.length) {
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
              if (orig) {
                var tmp = cards.filter(function (c) {
                  return component.containsTitle(c.orig_title, orig) || component.containsTitle(c.title, orig);
                });

                if (tmp.length) {
                  cards = tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp = cards.filter(function (c) {
                  return component.containsTitle(c.title, select_title) || component.containsTitle(c.orig_title, select_title);
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

                if (orig) {
                  is_sure |= component.equalTitle(cards[0].orig_title, orig) || component.equalTitle(cards[0].title, orig);
                }

                if (select_title) {
                  is_sure |= component.equalTitle(cards[0].title, select_title) || component.equalTitle(cards[0].orig_title, select_title);
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
          network["native"](url, function (str) {
            str = str.replace(/\n/g, '');
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
            if (data && data.length) display(data);else display([]);
          });
        };

        if (!object.clarification && (object.movie.imdb_id || +object.movie.kinopoisk_id)) {
          query_search('+' + (object.movie.imdb_id || +object.movie.kinopoisk_id), [], function (data) {
            if (data && data.length) display(data);else if (object.movie.imdb_id && +object.movie.kinopoisk_id) {
              query_search('+' + +object.movie.kinopoisk_id, [], function (data) {
                if (data && data.length) display(data);else query_title_search();
              });
            } else query_title_search();
          });
        } else query_title_search();
      };

      function getPage(card) {
        page_title = card.title || card.orig_title || select_title;
        var url = card.link;
        url = url.indexOf('://') == -1 ? embed + (url.startsWith('/') ? url.substring(1) : url) : prox + url;
        network.clear();
        network.timeout(10000);
        network["native"](url, function (str) {
          str = str.replace(/\n/g, '');
          var player = str.match(/<iframe data-src="((https?:\/\/redheadsound[^"\/]*)\/[^"]*)"/);

          if (player) {
            network.clear();
            network.timeout(10000);
            network["native"](prox + player[1], function (str) {
              parse(str, player[2]);
            }, function (a, c) {
              component.empty(network.errorDecode(a, c));
            }, false, {
              dataType: 'text'
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
      /**
       * Получить потоки
       * @param {String} str
       * @returns array
       */


      function extractItems(str, base_url) {
        if (!str) return [];

        try {
          var items = component.parsePlaylist(str).map(function (item) {
            var quality = item.label.match(/(\d\d\d+)p/);
            var link = item.links[0] || '';
            return {
              label: item.label,
              quality: quality ? parseInt(quality[1]) : NaN,
              file: link.indexOf('://') == -1 ? base_url + '/' + (link.startsWith('/') ? link.substring(1) : link) : link
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

      function parseSubs(str, base_url) {
        if (!str) return false;
        var subtitles = component.parsePlaylist(str).map(function (item) {
          var link = item.links[0] || '';
          return {
            label: item.label,
            url: link.indexOf('://') == -1 ? base_url + '/' + (link.startsWith('/') ? link.substring(1) : link) : link
          };
        });
        return subtitles.length ? subtitles : false;
      }

      function parse(str, base_url) {
        component.loading(false);
        str = str.replace(/\n/g, '');
        var find = str.match('Playerjs\\(({.*?})\\);');
        var json;

        try {
          json = find && (0, eval)('"use strict"; (function(){ return ' + find[1] + '; })();');
        } catch (e) {}

        if (json && json.file) {
          extract = typeof json.file === 'string' ? [json] : json.file;
          extract.forEach(function (data) {
            data.media = {
              items: extractItems(data.file, base_url),
              subtitles: parseSubs(data.subtitle, base_url)
            };
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
        component.filter(filter_items, choice);
      }
      /**
       * Отфильтровать файлы
       * @returns array
       */


      function filtred() {
        var filtred = [];
        extract.forEach(function (data) {
          var max_quality = data.media.items[0] || {};
          filtred.push({
            title: data.title || data.comment || select_title,
            quality: max_quality.label || '360p ~ 1080p',
            info: '',
            media: data.media
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
        var file = '';
        var quality = false;
        var items = element.media.items;

        if (items && items.length) {
          file = items[0].file;
          quality = {};
          items.forEach(function (item) {
            quality[item.label] = item.file;
          });
          var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
          if (quality[preferably]) file = quality[preferably];
        }

        return {
          file: file,
          quality: quality,
          subtitles: element.media.subtitles
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
                url: extra.file,
                quality: extra.quality,
                subtitles: extra.subtitles,
                timeline: element.timeline,
                title: items.length > 1 ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (items.length > 1) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: ex.file,
                    quality: ex.quality,
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

    function anilibria(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prox = component.proxy('anilibria');
      var embed = prox + (prefer_http || prox ? 'http:' : 'https:') + '//api.anilibria.tv/v3/';
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
        if (this.wait_similars && data && data[0].is_similars) return success(data[0]);
        var search_year = object.search_date;
        var orig = object.movie.original_title || object.movie.original_name;

        var display = function display(items) {
          if (items && items.length) {
            var is_sure = false;
            items.forEach(function (c) {
              c.ru_title = c.names && c.names.ru;
              c.en_title = c.names && c.names.en;
              c.alt_title = c.names && c.names.alternative;
              c.year = c.season && c.season.year && parseInt(c.season.year) || 0;
            });
            var cards = items;

            if (cards.length) {
              if (orig) {
                var tmp = cards.filter(function (c) {
                  return component.containsTitle(c.en_title, orig) || component.containsTitle(c.ru_title, orig) || component.containsTitle(c.alt_title, orig);
                });

                if (tmp.length) {
                  cards = tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp = cards.filter(function (c) {
                  return component.containsTitle(c.ru_title, select_title) || component.containsTitle(c.en_title, select_title) || component.containsTitle(c.alt_title, select_title);
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

                if (orig) {
                  is_sure |= component.equalTitle(cards[0].en_title, orig) || component.equalTitle(cards[0].ru_title, orig) || component.equalTitle(cards[0].alt_title, orig);
                }

                if (select_title) {
                  is_sure |= component.equalTitle(cards[0].ru_title, select_title) || component.equalTitle(cards[0].en_title, select_title) || component.equalTitle(cards[0].alt_title, select_title);
                }
              }
            }

            if (cards.length == 1 && is_sure) {
              success(cards[0]);
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
        network.timeout(1000 * 10);
        network["native"](url, function (json) {
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

        if (extract.player && extract.player.host && extract.player.list) {
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

              var title = Lampa.Lang.translate('torrent_serial_episode') + ' ' + _episode.episode;

              if (_episode.name) title += ' - ' + _episode.name;
              filtred.push({
                title: title,
                orig_title: extract.en_title || extract.ru_title || select_title,
                quality: _items[0] ? _items[0].label : '360p ~ 1080p',
                info: '',
                season: 1,
                episode: parseInt(_episode.episode),
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
          var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
          if (quality[preferably]) file = quality[preferably];
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
                url: extra.file,
                quality: extra.quality,
                timeline: element.timeline,
                title: element.title
              };

              if (element.season) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: ex.file,
                    quality: ex.quality,
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

    function kodik(component, _object) {
      var network = new Lampa.Reguest();
      var extract = {};
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prefer_mp4 = false;
      var prox = component.proxy('kodik');
      var embed = prox + (prefer_http || prox ? 'http:' : 'https:') + '//kodikapi.com/search';
      var gvi = prox + (prefer_http || prox ? 'http:' : 'https:') + '//kodik.biz/vdu';
      var token = 'b7cc4293ed475c4ad1fd599d114f4435';
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };

      function kodik_api_search(api, callback, error) {
        network.clear();
        network.timeout(10000);
        network["native"](embed + api, function (json) {
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
        var orig = object.movie.original_title || object.movie.original_name;

        var display = function display(results, empty) {
          if (results && results.length) {
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
              if (orig) {
                var _tmp = cards.filter(function (c) {
                  return component.containsTitle(c.orig_title, orig) || component.containsTitle(c.title, orig) || component.containsTitle(c.other_title, orig);
                });

                if (_tmp.length) {
                  cards = _tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp2 = cards.filter(function (c) {
                  return component.containsTitle(c.title, select_title) || component.containsTitle(c.orig_title, select_title) || component.containsTitle(c.other_title, select_title);
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

                if (orig) {
                  is_sure |= component.equalTitle(cards[0].orig_title, orig) || component.equalTitle(cards[0].title, orig) || component.equalTitle(cards[0].other_title, orig);
                }

                if (select_title) {
                  is_sure |= component.equalTitle(cards[0].title, select_title) || component.equalTitle(cards[0].orig_title, select_title) || component.equalTitle(cards[0].other_title, select_title);
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
          display(json.results, function () {
            kodik_search_by_title_part(function (json) {
              display(json.results, function () {
                kodik_search_by_title(function (json) {
                  display(json.results, function () {
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
          extractData(json.results ? json.results.filter(function (c) {
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
                if (!seasons.find(function (s) {
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

            if (c.translation && !filter_items.voice_info.find(function (v) {
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
          var translation = extract.items.find(function (c) {
            return c.seasons && c.seasons[season_id] && c.translation && c.translation.id == voice_id;
          });

          if (translation) {
            var episodes = translation.seasons[season_id] && translation.seasons[season_id].episodes || {};

            for (var episode_id in episodes) {
              var link = episodes[episode_id];
              var title = 'S' + season_id + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + episode_id;
              filtred.push({
                title: title,
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
        var url = prox + (prefer_http || prox ? 'http:' : 'https:') + element.link;
        network.clear();
        network.timeout(10000);
        network["native"](url, function (str) {
          str = str.replace(/\n/g, '');
          var urlParams = str.match(/\burlParams = '([^']+)'/);
          var type = str.match(/\bvideoInfo\.type = '([^']+)'/);
          var hash = str.match(/\bvideoInfo\.hash = '([^']+)'/);
          var id = str.match(/\bvideoInfo\.id = '([^']+)'/);
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
            postdata += '&bad_user=false';
            postdata += '&type=' + type[1];
            postdata += '&hash=' + hash[1];
            postdata += '&id=' + id[1];
            postdata += '&info=%7B%7D';
          }

          if (postdata) {
            network.clear();
            network.timeout(10000);
            network["native"](gvi, function (json) {
              if (json.links) {
                var items = extractItems(json.links),
                    file = '',
                    quality = false;

                if (items && items.length) {
                  file = apn(items[0].file);
                  quality = {};
                  items.forEach(function (item) {
                    quality[item.label] = apn(item.file);
                  });
                  var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
                  if (quality[preferably]) file = quality[preferably];
                }

                if (file) {
                  element.stream = file;
                  element.qualitys = quality;
                  call(element);
                } else error();
              } else error();
            }, error, postdata);
          } else error();
        }, error, false, {
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
            if (link.startsWith('//')) link = (prefer_http ? 'http:' : 'https:') + link;
            if (prefer_mp4) ;
            items.push({
              label: quality ? quality + 'p' : '360p ~ 1080p',
              quality: quality,
              file: link
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
          return atob(str.replace(/[a-z]/g, function (x) {
            return String.fromCharCode(x.charCodeAt(0) + (x > 'm' ? -13 : 13));
          }).replace(/[A-Z]/g, function (x) {
            return String.fromCharCode(x.charCodeAt(0) + (x > 'M' ? -13 : 13));
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
                url: element.stream,
                quality: element.qualitys,
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
                          cell.url = elem.stream;
                          cell.quality = elem.qualitys;
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
      var embed = prox + 'https://api.srvkp.com/v1/';
      var token = Utils.decodeSecret([76, 91, 92, 0, 67, 85, 66, 68, 0, 95, 84, 92, 2, 11, 77, 64, 0, 3, 94, 91, 84, 68, 70, 83, 13, 92, 90, 79, 2, 78, 5, 5]);
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
      var secret_part = '';
      var secret_timestamp = null;

      function decodeSecretToken(callback) {
        if (secret_part) secret = '/$1/' + secret_part;
        var timestamp = new Date().getTime();
        var cache_timestamp = timestamp - 1000 * 60 * 10;

        if (secret && secret_timestamp && secret_timestamp > cache_timestamp) {
          if (callback) callback();
          return;
        }

        var url = Utils.decodeSecret([80, 68, 77, 68, 64, 3, 27, 31, 86, 79, 81, 23, 64, 92, 22, 64, 85, 89, 72, 31, 82, 93, 93, 86, 68, 69, 86, 76, 91, 23, 64, 75, 77]);

        if (!url.startsWith('http')) {
          if (callback) callback();
          return;
        }

        url = Lampa.Utils.addUrlComponent(url, 'v=' + Date.now());
        network.clear();
        network.timeout(10000);
        network.silent(url, function (str) {
          if (str) {
            secret_part = str;
            secret = '/$1/' + secret_part;
            secret_timestamp = timestamp;
          }

          if (callback) callback();
        }, function (a, c) {
          if (callback) callback();
        }, false, {
          dataType: 'text'
        });
      }

      function kinopub_api_search(api, callback, error) {
        network.clear();
        network.timeout(10000);
        network["native"](api, function (json) {
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
        var orig = object.movie.original_title || object.movie.original_name;

        var display = function display(items) {
          if (items && items.length) {
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
              if (orig) {
                var _tmp = cards.filter(function (c) {
                  return component.containsTitle(c.orig_title, orig) || component.containsTitle(c.title, orig) || component.containsTitle(c.full_title, orig);
                });

                if (_tmp.length) {
                  cards = _tmp;
                  is_sure = true;
                }
              }

              if (select_title) {
                var _tmp2 = cards.filter(function (c) {
                  return component.containsTitle(c.title, select_title) || component.containsTitle(c.orig_title, select_title) || component.containsTitle(c.full_title, select_title);
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

                if (orig) {
                  is_sure |= component.equalTitle(cards[0].orig_title, orig) || component.equalTitle(cards[0].title, orig) || component.equalTitle(cards[0].full_title, orig);
                }

                if (select_title) {
                  is_sure |= component.equalTitle(cards[0].title, select_title) || component.equalTitle(cards[0].orig_title, select_title) || component.equalTitle(cards[0].full_title, select_title);
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
          kinopub_api_search(embed + params, function (json) {
            display(json.items);
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
        kinopub_api_search(embed + params, function (json) {
          if (json.item && (json.item.videos && json.item.videos.length || json.item.seasons && json.item.seasons.length)) {
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
                var pos = file.url.http.indexOf((file.file.startsWith('/') ? '' : '/') + file.file);
                if (pos !== -1) base = [file.url.http, file.url.http.substring(0, pos)];
              }

              if (base) {
                var base_url = base[1];

                if (replace_mask && secret) {
                  base_url = base_url.replace(replace_mask, secret);
                }

                if (prefer_http) {
                  base_url = base_url.replace('https://', 'http://');
                } else {
                  base_url = base_url.replace('http://', 'https://');
                }

                if (media.subtitles) {
                  subtitles = media.subtitles.map(function (sub) {
                    return {
                      label: sub.lang + (sub.forced ? ' - forced' : ''),
                      url: sub.file ? base_url + '/subtitles' + (sub.file.startsWith('/') ? '' : '/') + sub.file + '?loc=' + server : ''
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
                  file: base_url + (file.file.startsWith('/') ? '' : '/') + file.file,
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

                if (prefer_http) {
                  _base_url = _base_url.replace('https://', 'http://');
                } else {
                  _base_url = _base_url.replace('http://', 'https://');
                }

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

                if (prefer_http) {
                  _base_url2 = _base_url2.replace('https://', 'http://');
                } else {
                  _base_url2 = _base_url2.replace('http://', 'https://');
                }

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
                var _pos3 = file.url.hls.indexOf((file.file.startsWith('/') ? '' : '/') + file.file);

                if (_pos3 !== -1) _base3 = [file.url.hls, file.url.hls.substring(0, _pos3)];
              }

              if (_base3) {
                var _base_url3 = _base3[1];

                if (replace_mask && secret) {
                  _base_url3 = _base_url3.replace(replace_mask, secret);
                }

                if (prefer_http) {
                  _base_url3 = _base_url3.replace('https://', 'http://');
                } else {
                  _base_url3 = _base_url3.replace('http://', 'https://');
                }

                items.push({
                  height: file.h,
                  quality_id: file.quality_id,
                  label: label,
                  codec: file.codec,
                  type: 'hls',
                  params: _base3[2],
                  file: _base_url3 + (file.file.startsWith('/') ? '' : '/') + file.file,
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
            var title = 'S' + season.number + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + episode.number + (episode.title ? ' - ' + episode.title : '');
            filtred.push({
              title: title,
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
            var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
            if (quality[preferably]) file = quality[preferably];
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
                url: extra.file,
                quality: extra.quality,
                subtitles: extra.subtitles,
                timeline: element.timeline,
                title: element.season ? element.title : select_title + (element.title == select_title ? '' : ' / ' + element.title)
              };

              if (element.season) {
                items.forEach(function (elem) {
                  var ex = getFile(elem);
                  playlist.push({
                    url: ex.file,
                    quality: ex.quality,
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

    function hdvb(component, _object) {
      var network = new Lampa.Reguest();
      var extract = [];
      var backend = 'http://back.freebie.tom.ru/lampa/hdvburl?v=967';
      var object = _object;
      var select_title = '';
      var select_id = '';
      var balanser_id = '';
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        quality: 0
      };
      /**
       * Поиск
       * @param {Object} _object
       */

      this.search = function (_object, kinopoisk_id) {
        object = _object;
        select_id = kinopoisk_id;
        select_title = object.search || object.movie.title;
        var search_date = object.search_date || !object.clarification && (object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date) || '0000';
        var search_year = parseInt((search_date + '').slice(0, 4));

        if (isNaN(select_id)) {
          component.emptyForQuery(select_title);
          return;
        }

        var url = backend;
        url = Lampa.Utils.addUrlComponent(url, 'source=' + encodeURIComponent(object.movie.source));
        url = Lampa.Utils.addUrlComponent(url, 'id=' + object.movie.id);
        if (object.movie.imdb_id) url = Lampa.Utils.addUrlComponent(url, 'imdb_id=' + object.movie.imdb_id);
        url = Lampa.Utils.addUrlComponent(url, 'kinopoisk_id=' + select_id);
        url = Lampa.Utils.addUrlComponent(url, 'title=' + encodeURIComponent(select_title));
        if (object.movie.source == 'tmdb' || object.movie.source == 'cub') url = Lampa.Utils.addUrlComponent(url, 'serial=' + (object.movie.number_of_seasons ? 1 : 0));
        url = Lampa.Utils.addUrlComponent(url, 'year=' + search_year);
        network.clear();
        network.timeout(10000);
        network.silent(url, function (found) {
          if (found && found.result && found.action === 'done') {
            balanser_id = found.balanser_id || found.kpid;
            var results = (typeof found.data === "string" ? Lampa.Arrays.decodeJson(found.data, []) : found.data) || [];
            if (results.length) success(results);else component.emptyForQuery(select_title);
          } else {
            if (found && (found.error || found.text)) {
              component.empty(found.error || found.text);
            } else {
              component.emptyForQuery(select_title);
            }
          }
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


      function success(json) {
        component.loading(false);
        extractData(json);
        filter();
        append(filtred());
      }
      /**
       * Получить потоки
       * @param {String} str
       * @param {Int} max_quality
       * @returns string
       */


      function extractData(json) {
        extract = [];
        json.forEach(function (translation) {
          if (translation == null) return;

          if (translation.serial == 1) {
            var seasons = [];
            translation.playlists.forEach(function (season, keys) {
              if (season == null) return;
              var episodes = [];
              season.forEach(function (episode, keye) {
                if (episode == null) return;
                var link = translation.link;
                var max_quality = Object.keys(episode).slice(-1).pop();

                if (max_quality != null) {
                  link = episode[max_quality];
                }

                episodes[keye] = {
                  id: keys + '_' + keye,
                  season: keys,
                  episode: keye,
                  media: {
                    link: link,
                    playlists: episode
                  }
                };
              });
              seasons[keys] = episodes;
            });
            extract.push({
              seasons: seasons,
              file: translation.link,
              last_season: translation.last_season,
              quality: translation.quality,
              translation: translation.translation,
              translation_id: translation.translation_id,
              serial: translation.serial
            });
          } else if (translation.serial == 0) {
            var movie = translation.playlists;
            var link = translation.link;
            var max_quality = Object.keys(movie).slice(-1).pop();

            if (max_quality != null) {
              link = movie[max_quality];
            }

            extract.push({
              media: {
                link: link,
                playlists: movie
              },
              quality: translation.quality,
              translation: translation.translation,
              translation_id: translation.translation_id,
              serial: translation.serial
            });
          }
        });
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
          var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
          if (quality[preferably]) file = quality[preferably];
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
          season: [],
          voice: [],
          voice_info: []
        };
        var last_season = 0;
        extract.forEach(function (translation) {
          if (translation.serial == 1) {
            if (!last_season || translation.last_season > last_season) last_season = translation.last_season || 1;
          }
        });

        if (last_season) {
          var s = last_season;

          while (s--) {
            if (filter_items.season.indexOf(Lampa.Lang.translate('torrent_serial_season') + ' ' + (last_season - s)) == -1) filter_items.season.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + (last_season - s));
          }
        }

        if (!filter_items.season[choice.season]) choice.season = 0;
        extract.forEach(function (translation) {
          if (translation.serial == 1) {
            if (translation.seasons[choice.season + 1] && translation.seasons[choice.season + 1].length) {
              if (filter_items.voice.indexOf(translation.translation) == -1) {
                filter_items.voice.push(translation.translation);
                filter_items.voice_info.push({
                  id: translation.translation_id
                });
              }
            }
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
        extract.forEach(function (translation) {
          if (translation.serial == 1) {
            if (filter_items.voice_info[choice.voice] && translation.translation_id == filter_items.voice_info[choice.voice].id) {
              for (var keys in translation.seasons) {
                if (keys == choice.season + 1) {
                  translation.seasons[keys].forEach(function (episode) {
                    filtred.push({
                      title: 'S' + episode.season + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + episode.episode,
                      quality: '360p ~ 1080p' + (translation.quality ? ' - ' + translation.quality : ''),
                      info: ' / ' + filter_items.voice[choice.voice],
                      season: episode.season,
                      episode: episode.episode,
                      media: episode.media,
                      translation: translation
                    });
                  });
                }
              }
            }
          } else {
            filtred.push({
              title: Lampa.Utils.capitalizeFirstLetter(translation.translation) || select_title,
              quality: '360p ~ 1080p' + (translation.quality ? ' - ' + translation.quality : ''),
              info: '',
              media: translation.media,
              translation: translation
            });
          }
        });
        return filtred;
      }

      function extractItems(playlists) {
        try {
          var items = [];
          Object.keys(playlists).forEach(function (key) {
            var link = playlists[key];
            var quality = parseInt(key);
            items.push({
              label: quality ? quality + 'p' : '360p ~ 1080p',
              quality: quality,
              file: link
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

      function getStream(element, call, error) {
        if (element.media.items) {
          return call(getFile(element));
        }

        var link = element.media.link;

        if (!link) {
          error();
          return;
        }

        if (link.startsWith('http') && (link.substr(-5) === ".m3u8" || link.substr(-4) === ".mp4")) {
          element.media.items = extractItems(element.media.playlists);
          return call(getFile(element));
        }

        var url = backend;
        url = Lampa.Utils.addUrlComponent(url, 'source=' + encodeURIComponent(object.movie.source));
        url = Lampa.Utils.addUrlComponent(url, 'id=' + object.movie.id);
        url = Lampa.Utils.addUrlComponent(url, 'kinopoisk_id=' + select_id);
        if (select_id == 0) url = Lampa.Utils.addUrlComponent(url, 'filmId=' + balanser_id);
        url = Lampa.Utils.addUrlComponent(url, 'translation=' + element.translation.translation_id);
        if (element.season) url = Lampa.Utils.addUrlComponent(url, 'season=' + element.season);
        if (element.episode) url = Lampa.Utils.addUrlComponent(url, 'episode=' + element.episode);
        url = Lampa.Utils.addUrlComponent(url, 'link=' + link);
        network.clear();
        network.timeout(15000);
        network.silent(url, function (str) {
          if (!str || str == 'VideoNotFound' || str == 'error' || str == '10') {
            error(str);
            return;
          }

          var json;

          try {
            json = JSON.parse(str);
          } catch (e) {}

          if (!(json && json.playlists && Object.keys(json.playlists).length)) {
            error(json && json.error || !json && str || '');
            return;
          }

          var new_link = '';
          var max_quality = Object.keys(json.playlists).slice(-1).pop();

          if (max_quality != null) {
            new_link = json.playlists[max_quality];
          }

          element.media.link = new_link;
          element.media.playlists = json.playlists;

          if (new_link.startsWith('http') && (new_link.substr(-5) === ".m3u8" || new_link.substr(-4) === ".mp4")) {
            element.media.items = extractItems(element.media.playlists);
            return call(getFile(element));
          }

          error();
        }, function (a, c) {
          error(network.errorDecode(a, c));
        }, false, {
          dataType: 'text'
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
            getStream(element, function (extra) {
              element.loading = false;
              var first = {
                url: extra.file,
                quality: extra.quality,
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
                        getStream(elem, function (ex) {
                          cell.url = ex.file;
                          cell.quality = ex.quality;
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
              Lampa.Noty.show(error || Lampa.Lang.translate('online_mod_nolink'));
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
              getStream(element, function (extra) {
                call({
                  file: extra.file,
                  quality: extra.quality
                });
              }, function (error) {
                Lampa.Noty.show(error || Lampa.Lang.translate('online_mod_nolink'));
              });
            }
          });
        });
        component.start(true);
      }
    }

    var proxyInitialized = {};
    var proxyWindow = {};
    var proxyCalls = {};

    function component(object) {
      var network = new Lampa.Reguest();
      var scroll = new Lampa.Scroll({
        mask: true,
        over: true
      });
      var files = new Lampa.Files(object);
      var filter = new Lampa.Filter(object);
      var balanser = Lampa.Storage.get('online_mod_balanser', 'videocdn');
      var last_bls = Lampa.Storage.field('online_mod_save_last_balanser') === true ? Lampa.Storage.cache('online_mod_last_balanser', 200, {}) : {};
      var contextmenu_all = [];

      if (last_bls[object.movie.id]) {
        balanser = last_bls[object.movie.id];
      }

      this.proxy = function (name) {
        return Utils.proxy(name);
      };

      var sources = {
        videocdn: new videocdn(this, object),
        rezka: new rezka(this, object),
        rezka2: new rezka2(this, object),
        kinobase: new kinobase(this, object),
        collaps: new collaps(this, object),
        cdnmovies: new cdnmovies(this, object),
        filmix: new filmix(this, object),
        videodb: new videodb(this, object),
        zetflix: new zetflix(this, object),
        alloha: new alloha(this, object),
        redheadsound: new redheadsound(this, object),
        anilibria: new anilibria(this, object),
        kodik: new kodik(this, object),
        kinopub: new kinopub(this, object),
        filmix2: new filmix(this, object, true),
        hdvb: new hdvb(this, object)
      };
      var last;
      var last_filter;
      var extended;
      var selected_id;
      var filter_translate = {
        season: Lampa.Lang.translate('torrent_serial_season'),
        voice: Lampa.Lang.translate('torrent_parser_voice'),
        source: Lampa.Lang.translate('settings_rest_source')
      };
      var filter_sources = ['videocdn', 'rezka', 'rezka2', 'kinobase', 'collaps', 'cdnmovies', 'filmix', 'videodb', 'zetflix', 'redheadsound', 'anilibria', 'kodik'];

      if (Utils.isDebug()) {
        filter_sources.push('kinopub');
        filter_sources.push('filmix2');
        filter_sources.push('alloha');
        filter_sources.push('hdvb');
      } // шаловливые ручки


      if (filter_sources.indexOf(balanser) == -1) {
        balanser = 'videocdn';
        Lampa.Storage.set('online_mod_balanser', balanser);
      }

      scroll.body().addClass('torrent-list');

      function minus() {
        scroll.minus(window.innerWidth > 580 ? false : files.render().find('.files__left'));
      }

      window.addEventListener('resize', minus, false);
      minus();
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

        filter.render().find('.selector').on('hover:focus', function (e) {
          last_filter = e.target;
          scroll.update($(e.target), true);
        });

        filter.onSelect = function (type, a, b) {
          if (type == 'filter') {
            if (a.reset) {
              if (extended) sources[balanser].reset();else _this.start();
            } else {
              sources[balanser].filter(type, a, b);
            }
          } else if (type == 'sort') {
            balanser = a.source;
            Lampa.Storage.set('online_mod_balanser', balanser);
            last_bls[object.movie.id] = balanser;

            if (Lampa.Storage.field('online_mod_save_last_balanser') === true) {
              Lampa.Storage.set('online_mod_last_balanser', last_bls);
            }

            _this.search();

            setTimeout(Lampa.Select.close, 10);
          }
        };

        filter.render().find('.filter--sort span').text(Lampa.Lang.translate('online_mod_balanser'));
        filter.render();
        files.append(scroll.render());
        scroll.append(filter.render());
        this.search();
        return this.render();
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

      this.normalizeTitle = function (str) {
        return this.cleanTitle(str.toLowerCase().replace(/—/g, '-').replace(/ё/g, 'е'));
      };

      this.equalTitle = function (t1, t2) {
        return typeof t1 === 'string' && typeof t2 === 'string' && this.normalizeTitle(t1) === this.normalizeTitle(t2);
      };

      this.containsTitle = function (str, title) {
        return typeof str === 'string' && typeof title === 'string' && this.normalizeTitle(str).indexOf(this.normalizeTitle(title)) !== -1;
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
        var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
        var prox = this.proxy('videocdn');
        var url = prox + (prefer_http || prox ? 'http:' : 'https:') + '//videocdn.tv/api/';
        network.clear();
        network.timeout(1000 * 20);
        network.silent(url + api, function (json) {
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
        var _this2 = this;

        var query = object.search || object.movie.title;
        var search_date = object.search_date || !object.clarification && (object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date) || '0000';
        var search_year = parseInt((search_date + '').slice(0, 4));
        var orig = object.movie.original_title || object.movie.original_name;

        var display = function display(items) {
          if (items && items.length) {
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
              if (orig) {
                var _tmp = cards.filter(function (c) {
                  return _this2.containsTitle(c.orig_title || c.nameOriginal, orig) || _this2.containsTitle(c.en_title || c.nameEn, orig) || _this2.containsTitle(c.title || c.ru_title || c.nameRu, orig);
                });

                if (_tmp.length) {
                  cards = _tmp;
                  is_sure = true;
                }
              }

              if (query) {
                var _tmp2 = cards.filter(function (c) {
                  return _this2.containsTitle(c.title || c.ru_title || c.nameRu, query) || _this2.containsTitle(c.en_title || c.nameEn, query) || _this2.containsTitle(c.orig_title || c.nameOriginal, query);
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

                if (orig) {
                  is_sure |= _this2.equalTitle(cards[0].orig_title || cards[0].nameOriginal, orig) || _this2.equalTitle(cards[0].en_title || cards[0].nameEn, orig) || _this2.equalTitle(cards[0].title || cards[0].ru_title || cards[0].nameRu, orig);
                }

                if (query) {
                  is_sure |= _this2.equalTitle(cards[0].title || cards[0].ru_title || cards[0].nameRu, query) || _this2.equalTitle(cards[0].en_title || cards[0].nameEn, query) || _this2.equalTitle(cards[0].orig_title || cards[0].nameOriginal, query);
                }
              }
            }

            if (cards.length == 1 && is_sure) {
              _this2.extendChoice();

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

              _this2.similars(items);

              _this2.loading(false);
            }
          } else _this2.emptyForQuery(query);
        };

        var vcdn_search_by_title = function vcdn_search_by_title(callback, error) {
          var params = Lampa.Utils.addUrlComponent('', 'api_token=3i40G5TSECmLF77oAqnEgbx61ZWaOYaE');
          params = Lampa.Utils.addUrlComponent(params, 'query=' + encodeURIComponent(query));
          params = Lampa.Utils.addUrlComponent(params, 'field=title');

          _this2.vcdn_api_search('movies' + params, [], function (data) {
            _this2.vcdn_api_search('animes' + params, data, function (data) {
              _this2.vcdn_api_search('tv-series' + params, data, function (data) {
                _this2.vcdn_api_search('anime-tv-series' + params, data, function (data) {
                  _this2.vcdn_api_search('show-tv-series' + params, data, callback, error);
                }, error);
              }, error);
            }, error);
          }, error);
        };

        var vcdn_search_by_id = function vcdn_search_by_id(callback, error) {
          if (!object.clarification && (object.movie.imdb_id || +object.movie.kinopoisk_id)) {
            var params = Lampa.Utils.addUrlComponent('', 'api_token=3i40G5TSECmLF77oAqnEgbx61ZWaOYaE');
            var imdb_params = object.movie.imdb_id ? Lampa.Utils.addUrlComponent(params, 'imdb_id=' + encodeURIComponent(object.movie.imdb_id)) : '';
            var kp_params = +object.movie.kinopoisk_id ? Lampa.Utils.addUrlComponent(params, 'kinopoisk_id=' + encodeURIComponent(+object.movie.kinopoisk_id)) : '';

            _this2.vcdn_api_search('short' + (imdb_params || kp_params), [], function (data) {
              if (data && data.length) callback(data);else if (imdb_params && kp_params) {
                _this2.vcdn_api_search('short' + kp_params, [], callback, error);
              } else callback([]);
            }, error);
          } else callback([]);
        };

        var vcdn_search = function vcdn_search() {
          var error = _this2.empty.bind(_this2);

          vcdn_search_by_id(function (data) {
            if (data && data.length) display(data);else vcdn_search_by_title(function (data) {
              if (data && data.length) display(data);else display([]);
            }, error);
          }, error);
        };

        var kp_search_by_title = function kp_search_by_title(callback, error) {
          var url = 'api/v2.1/films/search-by-keyword?keyword=' + encodeURIComponent(_this2.cleanTitle(query));

          _this2.kp_api_search(url, callback, error);
        };

        var kp_search_by_id = function kp_search_by_id(callback, error) {
          if (!object.clarification && object.movie.imdb_id) {
            var url = 'api/v2.2/films?imdbId=' + encodeURIComponent(object.movie.imdb_id);

            _this2.kp_api_search(url, callback, error);
          } else callback([]);
        };

        var kp_search = function kp_search() {
          kp_search_by_id(function (data) {
            if (data && data.length) display(data);else kp_search_by_title(function (data) {
              if (data && data.length) display(data);else vcdn_search();
            }, vcdn_search);
          }, vcdn_search);
        };

        var vcdn_search_imdb = function vcdn_search_imdb() {
          var error = function error() {
            _this2.extendChoice();

            sources[balanser].search(object, object.movie.imdb_id);
          };

          vcdn_search_by_id(function (data) {
            if (data && data.length) display(data);else error();
          }, error);
        };

        var kp_search_imdb = function kp_search_imdb() {
          kp_search_by_id(function (data) {
            if (data && data.length) display(data);else vcdn_search_imdb();
          }, vcdn_search_imdb);
        };

        var letgo = function letgo() {
          if (!object.clarification && +object.movie.kinopoisk_id && ['rezka', 'collaps', 'cdnmovies', 'videodb', 'zetflix', 'alloha', 'kodik', 'hdvb'].indexOf(balanser) >= 0) {
            _this2.extendChoice();

            sources[balanser].search(object, +object.movie.kinopoisk_id);
          } else if (!object.clarification && object.movie.imdb_id && ['rezka', 'collaps', 'cdnmovies', 'videodb', 'zetflix', 'alloha', 'kodik', 'hdvb'].indexOf(balanser) >= 0) {
            if (Lampa.Storage.field('online_mod_skip_kp_search') === true) vcdn_search_imdb();else kp_search_imdb();
          } else if (['rezka2', 'kinobase', 'filmix', 'filmix2', 'redheadsound', 'anilibria', 'kodik', 'kinopub'].indexOf(balanser) >= 0) {
            _this2.extendChoice();

            sources[balanser].search(object);
          } else {
            if (balanser == 'videocdn' || Lampa.Storage.field('online_mod_skip_kp_search') === true) vcdn_search();else kp_search();
          }
        };

        if (!object.movie.imdb_id && (object.movie.source == 'tmdb' || object.movie.source == 'cub') && ['kinobase', 'filmix', 'filmix2', 'anilibria'].indexOf(balanser) == -1) {
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
          if (str.charAt(0) === '[') {
            str.substring(1).split(',[').forEach(function (item) {
              if (item.endsWith(',')) item = item.substring(0, item.length - 1);
              var label_end = item.indexOf(']');

              if (label_end >= 0) {
                var label = item.substring(0, label_end);

                if (item.charAt(label_end + 1) === '{') {
                  item.substring(label_end + 2).split(';{').forEach(function (voice_item) {
                    if (voice_item.endsWith(';')) voice_item = voice_item.substring(0, voice_item.length - 1);
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

            if (line.charAt(0) == '#') {
              if (line.startsWith('#EXT-X-STREAM-INF')) {
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

      this.proxyUrlCall = function (proxy_url, method, url, timeout, post_data, call_success, call_fail) {
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
              post_data: post_data
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

      this.proxyCall = function (method, url, timeout, post_data, call_success, call_fail) {
        var proxy_url = (window.location.protocol === 'https:' ? 'https://' : 'http://') + 'nb557.surge.sh/proxy.html';
        if (Lampa.Storage.field('online_mod_alt_iframe_proxy') === true) proxy_url = 'https://nb557.github.io/plugins/proxy.html';
        this.proxyUrlCall(proxy_url, method, url, timeout, post_data, call_success, call_fail);
      };

      this.proxyCall2 = function (method, url, timeout, post_data, call_success, call_fail) {
        var proxy_url = (window.location.protocol === 'https:' ? 'https://' : 'http://') + 'lampa.stream/proxy.html';
        this.proxyUrlCall(proxy_url, method, url, timeout, post_data, call_success, call_fail);
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


      this.similars = function (json) {
        var _this3 = this;

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
            _this3.activity.loader(true);

            _this3.reset();

            object.search = elem.title;
            object.search_date = year;
            selected_id = elem.id;

            _this3.extendChoice();

            sources[balanser].search(object, elem.kp_id || elem.kinopoisk_id || elem.kinopoiskId || elem.filmId || elem.imdb_id, [elem]);
          });

          _this3.append(item);
        });
      };
      /**
       * Очистить список файлов
       */


      this.reset = function () {
        contextmenu_all = [];
        last = false;
        scroll.render().find('.empty').remove();
        filter.render().detach();
        scroll.clear();
        scroll.append(filter.render());
      };
      /**
       * Загрузка
       */


      this.loading = function (status) {
        if (status) this.activity.loader(true);else {
          this.activity.loader(false);
          if (Lampa.Controller.enabled().name === 'content') this.activity.toggle();
        }
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

        filter_items.source = filter_sources;
        choice.source = filter_sources.indexOf(balanser);
        select.push({
          title: Lampa.Lang.translate('torrent_parser_reset'),
          reset: true
        });
        Lampa.Storage.set('online_mod_filter', choice);
        if (filter_items.voice && filter_items.voice.length) add('voice', Lampa.Lang.translate('torrent_parser_voice'));
        if (filter_items.season && filter_items.season.length) add('season', Lampa.Lang.translate('torrent_serial_season'));
        filter.set('filter', select);
        filter.set('sort', filter_sources.map(function (e) {
          return {
            title: e,
            source: e,
            selected: e == balanser
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
          if (filter_items[i] && filter_items[i].length) {
            if (i == 'voice') {
              select.push(filter_translate[i] + ': ' + filter_items[i][need[i]]);
            } else if (i !== 'source') {
              if (filter_items.season.length >= 1) {
                select.push(filter_translate.season + ': ' + filter_items[i][need[i]]);
              }
            }
          }
        }

        filter.chosen('filter', select);
        filter.chosen('sort', [balanser]);
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
                params.item.trigger('hover:enter');
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
          if (object.movie.number_of_seasons && last_views.length) last = last_views.eq(0)[0];else last = scroll.render().find('.selector').eq(3)[0];
        }

        Lampa.Background.immediately(Lampa.Utils.cardImgBackground(object.movie));
        Lampa.Controller.add('content', {
          toggle: function toggle() {
            Lampa.Controller.collectionSet(scroll.render(), files.render());
            Lampa.Controller.collectionFocus(last || false, scroll.render());
          },
          up: function up() {
            if (Navigator.canmove('up')) {
              if (scroll.render().find('.selector').slice(3).index(last) == 0 && last_filter) {
                Lampa.Controller.collectionFocus(last_filter, scroll.render());
              } else Navigator.move('up');
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
        Lampa.Controller.toggle('content');
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
        sources.videocdn.destroy();
        sources.rezka.destroy();
        sources.rezka2.destroy();
        sources.kinobase.destroy();
        sources.collaps.destroy();
        sources.cdnmovies.destroy();
        sources.filmix.destroy();
        sources.videodb.destroy();
        sources.zetflix.destroy();
        sources.alloha.destroy();
        sources.redheadsound.destroy();
        sources.anilibria.destroy();
        sources.kodik.destroy();
        sources.kinopub.destroy();
        sources.filmix2.destroy();
        sources.hdvb.destroy();
        window.removeEventListener('resize', minus);
      };
    }

    var mod_version = '23.01.2024';
    var isMSX = !!(window.TVXHost || window.TVXManager);
    var isTizen = navigator.userAgent.toLowerCase().indexOf('tizen') !== -1;
    var isIFrame = window.parent !== window;
    var isLocal = !window.location.protocol.startsWith('http');
    console.log('App', 'is MSX:', isMSX);
    console.log('App', 'is Tizen:', isTizen);
    console.log('App', 'is iframe:', isIFrame);
    console.log('App', 'is local:', isLocal);
    Lampa.Storage.set('online_mod_proxy_videocdn', 'false');
    Lampa.Storage.set('online_mod_proxy_kinobase', 'false');
    Lampa.Storage.set('online_mod_proxy_collaps', 'false');
    Lampa.Storage.set('online_mod_proxy_cdnmovies', 'false');
    Lampa.Storage.set('online_mod_proxy_kinopub', 'true');
    Lampa.Storage.set('online_mod_proxy_alloha', 'false');
    Lampa.Storage.set('online_mod_proxy_hdvb', 'false');
    Lampa.Storage.set('online_mod_proxy_kp', 'false');
    Lampa.Storage.set('online_mod_alt_iframe_proxy', 'false');
    Lampa.Params.trigger('online_mod_iframe_proxy', !isTizen || isLocal);
    Lampa.Params.trigger('online_mod_proxy_find_ip', false);
    Lampa.Params.trigger('online_mod_proxy_other', false);
    Lampa.Params.trigger('online_mod_proxy_videocdn', false);
    Lampa.Params.trigger('online_mod_proxy_rezka', false);
    Lampa.Params.trigger('online_mod_proxy_rezka2', false);
    Lampa.Params.trigger('online_mod_proxy_rezka2_mirror', false);
    Lampa.Params.trigger('online_mod_proxy_kinobase', false);
    Lampa.Params.trigger('online_mod_proxy_collaps', false);
    Lampa.Params.trigger('online_mod_proxy_cdnmovies', false);
    Lampa.Params.trigger('online_mod_proxy_videodb', false);
    Lampa.Params.trigger('online_mod_proxy_zetflix', false);
    Lampa.Params.trigger('online_mod_proxy_redheadsound', false);
    Lampa.Params.trigger('online_mod_proxy_anilibria', false);
    Lampa.Params.trigger('online_mod_proxy_kodik', false);
    Lampa.Params.trigger('online_mod_proxy_kinopub', false);
    Lampa.Params.trigger('online_mod_proxy_alloha', false);
    Lampa.Params.trigger('online_mod_proxy_hdvb', false);
    Lampa.Params.trigger('online_mod_proxy_kp', false);
    Lampa.Params.trigger('online_mod_skip_kp_search', false);
    Lampa.Params.trigger('online_mod_prefer_http', window.location.protocol !== 'https:');
    Lampa.Params.trigger('online_mod_prefer_mp4', true);
    Lampa.Params.trigger('online_mod_prefer_dash', false);
    Lampa.Params.trigger('online_mod_av1_support', true);
    Lampa.Params.trigger('online_mod_save_last_balanser', false);
    Lampa.Params.select('online_mod_kinobase_mirror', '', '');
    Lampa.Params.select('online_mod_kinobase_token', '', '');
    Lampa.Params.select('online_mod_rezka2_mirror', '', '');
    Lampa.Params.select('online_mod_rezka2_name', '', '');
    Lampa.Params.select('online_mod_rezka2_password', '', '');
    Lampa.Params.select('online_mod_proxy_other_url', '', '');
    Lampa.Params.select('online_mod_secret_password', '', '');

    if (window.location.protocol === 'https:') {
      Lampa.Storage.set('online_mod_prefer_http', 'false');
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
        ru: 'Зеркало для kinobase',
        uk: 'Дзеркало для kinobase',
        be: 'Люстэрка для kinobase',
        en: 'Mirror for kinobase',
        zh: 'kinobase的镜子'
      },
      online_mod_kinobase_token: {
        ru: 'ТОКЕН от kinobase',
        uk: 'ТОКЕН від kinobase',
        be: 'ТОКЕН ад kinobase',
        en: 'TOKEN from kinobase',
        zh: 'TOKEN 来自 kinobase'
      },
      online_mod_rezka2_mirror: {
        ru: 'Зеркало для rezka2',
        uk: 'Дзеркало для rezka2',
        be: 'Люстэрка для rezka2',
        en: 'Mirror for rezka2',
        zh: 'rezka2的镜子'
      },
      online_mod_proxy_rezka2_mirror: {
        ru: 'Проксировать зеркало rezka2',
        uk: 'Проксирувати дзеркало rezka2',
        be: 'Праксіраваць люстэрка rezka2',
        en: 'Proxy rezka2 mirror',
        zh: '代理rezka2镜子'
      },
      online_mod_rezka2_name: {
        ru: 'Логин или email для rezka2',
        uk: 'Логін чи email для rezka2',
        be: 'Лагін ці email для rezka2',
        en: 'Login or email for rezka2',
        zh: 'rezka2的登录或电子邮件'
      },
      online_mod_rezka2_password: {
        ru: 'Пароль для rezka2',
        uk: 'Пароль для rezka2',
        be: 'Пароль для rezka2',
        en: 'Password for rezka2',
        zh: 'rezka2的密码'
      },
      online_mod_rezka2_login: {
        ru: 'Войти в rezka2',
        uk: 'Увійти до rezka2',
        be: 'Увайсці ў rezka2',
        en: 'Log in to rezka2',
        zh: '登录rezka2'
      },
      online_mod_rezka2_logout: {
        ru: 'Выйти из rezka2',
        uk: 'Вийти з rezka2',
        be: 'Выйсці з rezka2',
        en: 'Log out of rezka2',
        zh: '注销rezka2'
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
        ru: 'Введите его на странице https://filmix.ac/consoles в вашем авторизованном аккаунте!',
        uk: 'Введіть його на сторінці https://filmix.ac/consoles у вашому авторизованому обліковому записі!',
        be: 'Увядзіце яго на старонцы https://filmix.ac/consoles у вашым аўтарызаваным акаўнце!',
        en: 'Enter it at https://filmix.ac/consoles in your authorized account!',
        zh: '在您的授权帐户中的 https://filmix.ac/consoles 中输入！'
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

    function loadOnline(object) {
      var onComplite = function onComplite() {
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
      };

      Utils.setMyIp('');

      if (Lampa.Storage.field('online_mod_proxy_find_ip') === true) {
        if (online_loading) return;
        online_loading = true;
        network.clear();
        network.timeout(10000);
        network.silent('https://api.ipify.org/?format=json', function (json) {
          if (json.ip) Utils.setMyIp(json.ip);
          onComplite();
        }, function (a, c) {
          onComplite();
        });
      } else onComplite();
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
    }); ///////FILMIX/////////

    var api_url = Utils.proxy('filmix') + 'http://filmixapp.cyou/api/v2/';
    var user_dev = '?user_dev_apk=2.0.1&user_dev_id=' + Lampa.Utils.uid(16) + '&user_dev_name=Xiaomi&user_dev_os=12&user_dev_vendor=Xiaomi&user_dev_token=';
    var ping_auth;
    Lampa.Params.select('filmix_token', '', '');
    Lampa.Template.add('settings_filmix', "<div>\n    <div class=\"settings-param selector\" data-name=\"filmix_token\" data-type=\"input\" placeholder=\"#{online_mod_filmix_param_placeholder}\">\n        <div class=\"settings-param__name\">#{online_mod_filmix_param_add_title}</div>\n        <div class=\"settings-param__value\"></div>\n        <div class=\"settings-param__descr\">#{online_mod_filmix_param_add_descr}</div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"filmix_add\" data-static=\"true\">\n        <div class=\"settings-param__name\">#{online_mod_filmix_param_add_device}</div>\n    </div>\n</div>");
    Lampa.Storage.listener.follow('change', function (e) {
      if (e.name == 'filmix_token') {
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
          network.quiet(api_url + 'token_request' + user_dev, function (found) {
            if (found.status == 'ok') {
              user_token = found.code;
              user_code = found.user_code;
              modal.find('.selector').text(user_code); //modal.find('.broadcast__scan').remove()
            } else {
              Lampa.Noty.show(found);
            }
          }, function (a, c) {
            Lampa.Noty.show(network.errorDecode(a, c));
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
      network.clear();
      network.timeout(8000);
      network.silent(api_url + 'user_profile' + user_dev + token, function (json) {
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
      });
    } ///////Rezka2/////////


    function rezka2Login(success, error) {
      var url = Utils.rezka2Mirror() + '/ajax/login/';
      var postdata = 'login_name=' + encodeURIComponent(Lampa.Storage.get('online_mod_rezka2_name', ''));
      postdata += '&login_password=' + encodeURIComponent(Lampa.Storage.get('online_mod_rezka2_password', ''));
      postdata += '&login_not_save=0';
      network.clear();
      network.timeout(8000);
      network.silent(url, function (json) {
        if (json && (json.success || json.message == 'Уже авторизован на сайте. Необходимо обновить страницу!')) {
          Lampa.Storage.set("online_mod_rezka2_status", 'true');
          if (success) success();
        } else {
          Lampa.Storage.set("online_mod_rezka2_status", 'false');
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
        Lampa.Storage.set("online_mod_rezka2_status", 'false');
        if (success) success();
      }, function (a, c) {
        Lampa.Noty.show(network.errorDecode(a, c));
        if (error) error();
      }, false, {
        dataType: 'text',
        withCredentials: true
      });
    } ///////Онлайн Мод/////////


    var template = "<div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_rezka\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} rezka</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_rezka2\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} rezka2</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_kinobase\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} kinobase</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_cdnmovies\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} cdnmovies</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_videodb\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} videodb</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_zetflix\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} zetflix</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_redheadsound\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} redheadsound</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_anilibria\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} anilibria</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_kodik\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} kodik</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_skip_kp_search\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_skip_kp_search}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_iframe_proxy\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_iframe_proxy}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_prefer_http\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_prefer_http}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_prefer_mp4\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_prefer_mp4}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_prefer_dash\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_prefer_dash}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_save_last_balanser\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_save_last_balanser}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_clear_last_balanser\" data-static=\"true\">\n        <div class=\"settings-param__name\">#{online_mod_clear_last_balanser}</div>\n        <div class=\"settings-param__status\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_kinobase_mirror\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_kinobase_mirror}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_kinobase_token\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_kinobase_token}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_mirror\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_mirror}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_rezka2_mirror\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_rezka2_mirror}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_name\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_name}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_password\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_password}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_login\" data-static=\"true\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_login}</div>\n        <div class=\"settings-param__status\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_logout\" data-static=\"true\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_logout}</div>\n        <div class=\"settings-param__status\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_find_ip\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_find_ip}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_other\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_other}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_other_url\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_other_url}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_secret_password\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_secret_password}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";

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
      }
    });

})();
