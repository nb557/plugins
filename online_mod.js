//28.10.2023 - Do not use Lampa.Utils.protocol()

(function () {
    'use strict';

    var myIp = '';

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
      if (!url) return 'https://hdrezka.ag/';
      if (url.indexOf('://') == -1) url = 'https://' + url;
      if (url.charAt(url.length - 1) != '/') url += '/';
      return url;
    }

    function kinobaseMirror() {
      var url = Lampa.Storage.get('online_mod_kinobase_mirror', '');
      if (!url) return 'https://kinobase.org/';
      if (url.indexOf('://') == -1) url = 'https://' + url;
      if (url.charAt(url.length - 1) != '/') url += '/';
      return url;
    }

    function setMyIp(ip) {
      myIp = ip;
    }

    function getMyIp() {
      return myIp;
    }

    var Utils = {
      decodeSecret: decodeSecret,
      isDebug: isDebug,
      rezka2Mirror: rezka2Mirror,
      kinobaseMirror: kinobaseMirror,
      setMyIp: setMyIp,
      getMyIp: getMyIp
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
      var kp_prox = 'https://cors.kp556.workers.dev/';
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
      var embed = prox + (prefer_http || prox ? 'http:' : 'https:') + '//videocdn.tv/api/';
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
          var src = 'http:' + movie.iframe_src;

          var call_success = function call_success(raw) {
            get_links_wait = false;
            component.render().find('.broadcast__scan').remove();
            var math = raw.replace(/\n/g, '').match(/id="files" value="(.*?)"/);

            if (!math) {
              math = raw.replace(/\n/g, '').match(/id="files" value='(.*?)'/);
            }

            if (math) {
              var text = document.createElement("textarea");
              text.innerHTML = math[1];
              var json = Lampa.Arrays.decodeJson(text.value, {});

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
          } else if (window.location.protocol !== 'http:') {
            network.clear();
            network.timeout(20000);
            network.silent('https://cors.nb557.workers.dev/' + src, call_success, call_fail, false, {
              dataType: 'text'
            });
          } else {
            var meta = $('head meta[name="referrer"]');
            var referrer = meta.attr('content') || 'never';
            meta.attr('content', 'origin');

            try {
              network.clear();
              network.timeout(20000);
              network.silent(src, call_success, call_fail, false, {
                dataType: 'text'
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
      var prox = component.proxy('rezka2');
      var embed = prox ? prox + 'https://hdrezka.ag/' : Utils.rezka2Mirror();
      var logged_in = Lampa.Storage.field('online_mod_rezka2_status') === true && !prox;
      var network_call = logged_in ? network.silent : network["native"];
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
            withCredentials: logged_in
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
          withCredentials: logged_in
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
                withCredentials: logged_in
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
              element.subtitles = parseSubtitles(json.subtitle);
              call(element);
            } else error();
          } else error();
        }, error, postdata, {
          withCredentials: logged_in
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

    function kinobase(component, _object) {
      var network = new Lampa.Reguest();
      var extract = [];
      var object = _object;
      var select_title = '';
      var select_id = '';
      var is_playlist = false;
      var quality_type = '';
      var translation = '';
      var prefer_mp4 = Lampa.Storage.field('online_mod_prefer_mp4') === true;
      var prox = component.proxy('kinobase');
      var embed = prox ? prox + 'https://kinobase.org/' : Utils.kinobaseMirror();
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
          var links = object.movie.number_of_seasons ? str.match(/<a href="\/(serial|tv_show)\/([^"]*)" class="link"[^>]*>(.*?)<\/a>/g) : str.match(/<a href="\/film\/([^"]*)" class="link"[^>]*>(.*?)<\/a>/g);
          var search_date = object.search_date || !object.clarification && (object.movie.release_date || object.movie.first_air_date || object.movie.last_air_date) || '0000';
          var search_year = parseInt((search_date + '').slice(0, 4));

          if (links) {
            var is_sure = false;
            var items = links.map(function (l) {
              var link = $(l),
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
          dataType: 'text'
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

      function getPage(url) {
        url = url.indexOf('://') == -1 ? embed + (url.startsWith('/') ? url.substring(1) : url) : prox + url;
        network.clear();
        network.timeout(1000 * 10);
        network["native"](url, function (str) {
          str = str.replace(/\n/g, '');
          var MOVIE_ID = str.match('var MOVIE_ID = ([^;]+);');
          var IDENTIFIER = str.match('var IDENTIFIER = "([^"]+)"');
          var PLAYER_CUID = str.match('var PLAYER_CUID = "([^"]+)"');

          if (MOVIE_ID && IDENTIFIER && PLAYER_CUID) {
            select_id = MOVIE_ID[1];
            var identifier = IDENTIFIER[1];
            var player_cuid = PLAYER_CUID[1];
            var user_url = "user_data";
            user_url = Lampa.Utils.addUrlComponent(user_url, "page=movie");
            user_url = Lampa.Utils.addUrlComponent(user_url, "movie_id=" + select_id);
            user_url = Lampa.Utils.addUrlComponent(user_url, "cuid=" + player_cuid);
            user_url = Lampa.Utils.addUrlComponent(user_url, "device=DESKTOP");
            user_url = Lampa.Utils.addUrlComponent(user_url, "_=" + Date.now());
            var file_type = prefer_mp4 ? "mp4" : "hls";
            var player_url = "videoplayer.js";
            player_url = Lampa.Utils.addUrlComponent(player_url, "movie_id=" + select_id);
            player_url = Lampa.Utils.addUrlComponent(player_url, "IDENTIFIER=" + identifier);
            player_url = Lampa.Utils.addUrlComponent(player_url, "player_type=new");
            player_url = Lampa.Utils.addUrlComponent(player_url, "file_type=" + file_type);
            player_url = Lampa.Utils.addUrlComponent(player_url, "_=" + Math.floor(Date.now() / 1e3));
            network.clear();
            network.timeout(1000 * 10);
            network["native"](embed + user_url, function () {}, function () {}, false, {
              dataType: 'text',
              withCredentials: !prox
            });
            network.timeout(1000 * 10);
            network["native"](embed + player_url, function (vod_script) {
              var vod_data;

              try {
                var tmp = $.get;

                try {
                  vod_data = (0, eval)('"use strict"; (function() { var res = [], new_player = function() {}, init_player = new_player, $ = {}; $.get = function(u, p, f) { var pl = false; new_player = function() { pl = true; }; init_player = new_player; f && f("file|||Выкл."); res.push({ url: u, params: p, pl: pl }); }; var XMLHttpRequest = function XMLHttpRequest() { this.open = function(m, u) { res.push({ url: u }); }; this.send = function() {}; }; try { eval(' + JSON.stringify(vod_script) + '); } catch (e) {} return res; })();');
                } finally {
                  $.get = tmp;
                }
              } catch (e) {}

              var vod_url;

              if (vod_data) {
                vod_data.forEach(function (data) {
                  if (!data.pl) return;
                  var url = data.url || '';

                  if (data.params) {
                    for (var name in data.params) {
                      var value = encodeURIComponent(data.params[name]);
                      url = Lampa.Utils.addUrlComponent(url, name + "=" + value);
                    }
                  }

                  if (/^\/vod\/\d+\?/.test(url) && url.indexOf('=new') !== -1 && url.indexOf('=' + file_type) !== -1) {
                    vod_url = url.substring(1);
                  }
                });
              }

              if (vod_url) {
                network.clear();
                network.timeout(1000 * 10);
                network["native"](embed + vod_url, function (files) {
                  component.loading(false);
                  extractData(files, str);
                  filter();
                  append(filtred());
                }, function (a, c) {
                  component.empty(network.errorDecode(a, c));
                }, false, {
                  dataType: 'text',
                  withCredentials: !prox
                });
              } else component.empty(Lampa.Lang.translate('torrent_parser_no_hash'));
            }, function (a, c) {
              component.empty(network.errorDecode(a, c));
            }, false, {
              dataType: 'text',
              withCredentials: !prox
            });
          } else component.emptyForQuery(select_title);
        }, function (a, c) {
          component.empty(network.errorDecode(a, c));
        }, false, {
          dataType: 'text'
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
      var embed = prox + (prefer_http || prox ? 'http:' : 'https:') + '//api.framprox.ws/embed/';
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
      var embed = prox + 'https://skinny-wilderness.cdnmovies-stream.online/';
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };

      function cdn_api_search(api, callback, error) {
        var meta = $('head meta[name="referrer"]');
        var referrer = meta.attr('content') || 'never';
        meta.attr('content', 'origin');

        try {
          network.clear();
          network.timeout(10000);
          network.silent(embed + api, function (str) {
            if (callback) callback(str || '');
          }, function (a, c) {
            if ((a.status == 404 || a.status == 403) && a.responseText && (a.responseText.indexOf('<title>Not Found</title>') !== -1 || a.responseText.indexOf('Не найдено!') !== -1 || a.responseText.indexOf('Контент не найден или недоступен в вашем регионе!') !== -1) || a.status == 0 && a.statusText !== 'timeout') {
              if (callback) callback('');
            } else if (error) error(network.errorDecode(a, c));
          }, false, {
            dataType: 'text'
          });
        } finally {
          meta.attr('content', referrer);
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
        var find = str.match("Playerjs\\({.*?\\bfile:\\s*'([^']*)'");
        var video = find && decode(find[1]);
        var json;

        try {
          json = video && JSON.parse(video);
        } catch (e) {}

        if (json) {
          component.loading(false);
          extract = json;
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

        var trashList = ['-*frofpscprpamfpQ*45612.3256dfrgd', '54vjfhcgdbrydkcfkndz568436fred+*d', 'lvfycgndqcydrcgcfg+95147gfdgf-zd*', 'az+-erw*3457edgtjd-feqsptf/re*q*Y', 'df8vg69r9zxWdlyf+*fgx455g8fh9z-e*Q'];
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
      var embed = (window.location.protocol === 'https:' ? 'https://cors.nb557.workers.dev/' : '') + 'http://filmixapp.cyou/api/v2/';
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

        if (secret_part) secret = '.com/s/' + secret_part + Lampa.Utils.uid(3) + '/';
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
            secret = '.com/s/' + secret_part + Lampa.Utils.uid(3) + '/';
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

      if (!window.filmix) {
        window.filmix = {
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

        if (!debug && !window.filmix.is_max_qualitie && token) {
          window.filmix.is_max_qualitie = true;
          network.clear();
          network.timeout(10000);
          network.silent(url + 'user_profile' + dev_token, function (found) {
            if (found && found.user_data) {
              if (found.user_data.is_pro) window.filmix.max_qualitie = 1080;
              if (found.user_data.is_pro_plus) window.filmix.max_qualitie = 2160;
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
              var found = stream_url.match(/(\.com\/s\/[^\/]*\/)/);

              if (found) {
                if (!secret_part) {
                  secret = found[1];
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
        var filmix_max_qualitie = debug ? 2160 : window.filmix.max_qualitie;
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
                    stream_url = stream_url.replace(/\.com\/s\/[^\/]*\//, secret);
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
              _stream_url = _stream_url.replace(/\.com\/s\/[^\/]*\//, secret);
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
      var embed = prox + (prefer_http || prox ? 'http:' : 'https:') + '//kinoplay1.site/iplayer/videodb.php';
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
            network.silent(url, call_success, call_error, false, {
              dataType: 'text'
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
      var embed = prox + (prefer_http || prox ? 'http:' : 'https:') + '//zetfix.online/iplayer/videodb.php';
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
      var gvi = prox + (prefer_http || prox ? 'http:' : 'https:') + '//kodik.biz/gvi';
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
      var embed2 = Utils.decodeSecret([80, 68, 77, 68, 64, 3, 27, 31, 87, 87, 66, 74, 26, 81, 78, 85, 30, 67, 87, 66, 82, 81, 65, 74, 26, 84, 81, 78, 31, 82, 93, 93, 86, 68, 69, 86, 22, 81, 73, 68, 28, 79, 5, 31]);
      var server = 'ru';
      var hls_type = 'hls';
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };

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
        kinopub_api_search(embed + params, function (json) {
          display(json.items);
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

      function success(item) {
        var params = Lampa.Utils.addUrlComponent('items/' + item.id, 'access_token=' + token);
        var error = component.empty.bind(component);
        kinopub_api_search(embed2 + params, function (json) {
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

    function bazon(component, _object) {
      var network = new Lampa.Reguest();
      var extract = [];
      var object = _object;
      var select_title = '';
      var prefer_http = Lampa.Storage.field('online_mod_prefer_http') === true;
      var prox = component.proxy('bazon');
      var token = Utils.decodeSecret([12, 86, 15, 85, 87, 93, 80, 5, 7, 10, 7, 88, 87, 87, 93, 3, 6, 13, 14, 9, 90, 13, 4, 14, 13, 9, 1, 11, 5, 91, 5, 7]);
      var embed = (prefer_http ? 'http:' : 'https:') + '//bazon.cc/api/search?token=' + token;
      var filter_items = {};
      var choice = {
        season: 0,
        voice: 0,
        voice_name: ''
      };
      var lib = atob('KGZ1bmN0aW9uKCl7ICd1c2Ugc3RyaWN0JzsgZnVuY3Rpb24gYShnLCBjKXsgdmFyIGQgPSBnLnNwbGl0KCIuIiksIGEgPSBmOyAhKGRbMF0gaW4gYSkgJiYgYS5leGVjU2NyaXB0ICYmIGEuZXhlY1NjcmlwdCgidmFyICIgKyBkWzBdKTsgZm9yICh2YXIgaDsgZC5sZW5ndGggJiYgKGggPSBkLnNoaWZ0KCkpOykgZC5sZW5ndGggfHwgYyA9PT0gdm9pZCAwID8gYSA9IGFbaF0gPyBhW2hdIDogYVtoXSA9IHt9IDogYVtoXSA9IGM7IH0gZnVuY3Rpb24gaShpKXsgdmFyIGMsIGosIG8sIHEsIHIsIHQsIHUsIHYsIHcsIHksIHogPSBpLmxlbmd0aCwgZCA9IDAsIEEgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7IGZvciAodiA9IDA7IHYgPCB6OyArK3YpIGlbdl0gPiBkICYmIChkID0gaVt2XSksIGlbdl0gPCBBICYmIChBID0gaVt2XSk7IGZvciAoYyA9IDEgPDwgZCwgaiA9IG5ldyhrID8gVWludDMyQXJyYXkgOiBBcnJheSkoYyksIG8gPSAxLCBxID0gMCwgciA9IDI7IG8gPD0gZDspeyBmb3IgKHYgPSAwOyB2IDwgejsgKyt2KSBpZiAoaVt2XSA9PT0gbyl7IGZvciAodCA9IDAsIHUgPSBxLCB3ID0gMDsgdyA8IG87ICsrdykgdCA9IHQgPDwgMSB8IDEgJiB1LCB1ID4+PSAxOyBmb3IgKHkgPSBvIDw8IDE2IHwgdiwgdyA9IHQ7IHcgPCBjOyB3ICs9IHIpIGpbd10gPSB5OyArK3E7IH0gKysgbywgcSA8PD0gMSwgciA8PD0gMTsgfSByZXR1cm4gW2osIGQsIEFdOyB9IGZ1bmN0aW9uIGIoYSwgYil7IHN3aXRjaCAodGhpcy5nID0gW10sIHRoaXMuaCA9IDMyNzY4LCB0aGlzLmMgPSB0aGlzLmYgPSB0aGlzLmQgPSB0aGlzLmsgPSAwLCB0aGlzLmlucHV0ID0gayA/IG5ldyBVaW50OEFycmF5KGEpIDogYSwgdGhpcy5sID0gITEsIHRoaXMuaSA9IGcsIHRoaXMucCA9ICExLCAoYiB8fCAhKGIgPSB7fSkpICYmIChiLmluZGV4ICYmICh0aGlzLmQgPSBiLmluZGV4KSwgYi5idWZmZXJTaXplICYmICh0aGlzLmggPSBiLmJ1ZmZlclNpemUpLCBiLmJ1ZmZlclR5cGUgJiYgKHRoaXMuaSA9IGIuYnVmZmVyVHlwZSksIGIucmVzaXplICYmICh0aGlzLnAgPSBiLnJlc2l6ZSkpLCB0aGlzLmkpeyBjYXNlIGU6IHRoaXMuYSA9IDMyNzY4LCB0aGlzLmIgPSBuZXcoayA/IFVpbnQ4QXJyYXkgOiBBcnJheSkoMzI3NjggKyB0aGlzLmggKyAyNTgpOyBicmVhazsgY2FzZSBnOiB0aGlzLmEgPSAwLCB0aGlzLmIgPSBuZXcoayA/IFVpbnQ4QXJyYXkgOiBBcnJheSkodGhpcy5oKSwgdGhpcy5lID0gdGhpcy51LCB0aGlzLm0gPSB0aGlzLnIsIHRoaXMuaiA9IHRoaXMuczsgYnJlYWs7IGRlZmF1bHQ6IHRocm93IEVycm9yKCJpbnZhbGlkIGluZmxhdGUgbW9kZSIpOyB9IH0gZnVuY3Rpb24gaihpLCBjKXsgZm9yICh2YXIgZCwgaiA9IGkuZiwgayA9IGkuYywgbCA9IGkuaW5wdXQsIGUgPSBpLmQsIG0gPSBsLmxlbmd0aDsgayA8IGM7KXsgaWYgKGUgPj0gbSkgdGhyb3cgRXJyb3IoImlucHV0IGJ1ZmZlciBpcyBicm9rZW4iKTsgaiB8PSBsW2UrK10gPDwgaywgayArPSA4OyB9IHJldHVybiBkID0gaiAmICgxIDw8IGMpIC0gMSwgaS5mID0gaiA+Pj4gYywgaS5jID0gayAtIGMsIGkuZCA9IGUsIGQ7IH0gZnVuY3Rpb24gbShpLCBjKXsgZm9yICh2YXIgZCwgaiwgayA9IGkuZiwgbyA9IGkuYywgcCA9IGkuaW5wdXQsIGUgPSBpLmQsIHEgPSBwLmxlbmd0aCwgZyA9IGNbMF0sIGggPSBjWzFdOyBvIDwgaCAmJiAhKGUgPj0gcSk7KSBrIHw9IHBbZSsrXSA8PCBvLCBvICs9IDg7IGlmIChkID0gZ1trICYgKDEgPDwgaCkgLSAxXSwgaiA9IGQgPj4+IDE2LCBqID4gbykgdGhyb3cgRXJyb3IoImludmFsaWQgY29kZSBsZW5ndGg6ICIgKyBqKTsgcmV0dXJuIGkuZiA9IGsgPj4gaiwgaS5jID0gbyAtIGosIGkuZCA9IGUsIDY1NTM1ICYgZDsgfSB2YXIgbywgZiA9IHRoaXM7IHZhciBrID0gInVuZGVmaW5lZCIgIT0gdHlwZW9mIFVpbnQ4QXJyYXkgJiYgInVuZGVmaW5lZCIgIT0gdHlwZW9mIFVpbnQxNkFycmF5ICYmICJ1bmRlZmluZWQiICE9IHR5cGVvZiBVaW50MzJBcnJheSAmJiAidW5kZWZpbmVkIiAhPSB0eXBlb2YgRGF0YVZpZXc7IHZhciBlID0gMCwgZyA9IDE7IGIucHJvdG90eXBlLnQgPSBmdW5jdGlvbigpeyBmb3IgKDsgIXRoaXMubDspeyB2YXIgciA9IGoodGhpcywgMyk7IHN3aXRjaCAoMSAmIHIgJiYgKHRoaXMubCA9ICEwKSwgciA+Pj49IDEsIHIpeyBjYXNlIDA6IHZhciB0ID0gdGhpcy5pbnB1dCwgZCA9IHRoaXMuZCwgdSA9IHRoaXMuYiwgdyA9IHRoaXMuYSwgeSA9IHQubGVuZ3RoLCBmID0gbywgQyA9IG8sIEQgPSB1Lmxlbmd0aCwgRSA9IG87IGlmICh0aGlzLmMgPSB0aGlzLmYgPSAwLCBkICsgMSA+PSB5KSB0aHJvdyBFcnJvcigiaW52YWxpZCB1bmNvbXByZXNzZWQgYmxvY2sgaGVhZGVyOiBMRU4iKTsgaWYgKGYgPSB0W2QrK10gfCB0W2QrK10gPDwgOCwgZCArIDEgPj0geSkgdGhyb3cgRXJyb3IoImludmFsaWQgdW5jb21wcmVzc2VkIGJsb2NrIGhlYWRlcjogTkxFTiIpOyBpZiAoQyA9IHRbZCsrXSB8IHRbZCsrXSA8PCA4LCBmID09PSB+QykgdGhyb3cgRXJyb3IoImludmFsaWQgdW5jb21wcmVzc2VkIGJsb2NrIGhlYWRlcjogbGVuZ3RoIHZlcmlmeSIpOyBpZiAoZCArIGYgPiB0Lmxlbmd0aCkgdGhyb3cgRXJyb3IoImlucHV0IGJ1ZmZlciBpcyBicm9rZW4iKTsgc3dpdGNoICh0aGlzLmkpeyBjYXNlIDA6IGZvciAoOyB3ICsgZiA+IHUubGVuZ3RoOyl7IGlmIChFID0gRCAtIHcsIGYgLT0gRSwgaykgdS5zZXQodC5zdWJhcnJheShkLCBkICsgRSksIHcpLCB3ICs9IEUsIGQgKz0gRTsgZWxzZSBmb3IgKDsgRS0tOykgdVt3KytdID0gdFtkKytdOyB0aGlzLmEgPSB3LCB1ID0gdGhpcy5lKCksIHcgPSB0aGlzLmE7IH0gYnJlYWs7IGNhc2UgMTogZm9yICg7IHcgKyBmID4gdS5sZW5ndGg7KSB1ID0gdGhpcy5lKHsgbzogMiB9KTsgYnJlYWs7IGRlZmF1bHQ6IHRocm93IEVycm9yKCJpbnZhbGlkIGluZmxhdGUgbW9kZSIpOyB9IGlmIChrKSB1LnNldCh0LnN1YmFycmF5KGQsIGQgKyBmKSwgdyksIHcgKz0gZiwgZCArPSBmOyBlbHNlIGZvciAoOyBmLS07KSB1W3crK10gPSB0W2QrK107IHRoaXMuZCA9IGQsIHRoaXMuYSA9IHcsIHRoaXMuYiA9IHU7IGJyZWFrOyBjYXNlIDE6IHRoaXMuaihBLCBCKTsgYnJlYWs7IGNhc2UgMjogZm9yICh2YXIgRyA9IGoodGhpcywgNSkgKyAyNTcsIEggPSBqKHRoaXMsIDUpICsgMSwgcCA9IGoodGhpcywgNCkgKyA0LCBJID0gbmV3KGsgPyBVaW50OEFycmF5IDogQXJyYXkpKGwubGVuZ3RoKSwgeCA9IG8sIEogPSBvLCBLID0gbywgTCA9IG8sIE4gPSBvLCBPID0gbywgUCA9IG8sIFUgPSBvLCBWID0gbywgVSA9IDA7IFUgPCBwOyArK1UpIElbbFtVXV0gPSBqKHRoaXMsIDMpOyBpZiAoIWspIGZvciAoVSA9IHAsIHAgPSBJLmxlbmd0aDsgVSA8IHA7ICsrVSkgSVtsW1VdXSA9IDA7IGZvciAoeCA9IGkoSSksIEwgPSBuZXcoayA/IFVpbnQ4QXJyYXkgOiBBcnJheSkoRyArIEgpLCBVID0gMCwgViA9IEcgKyBIOyBVIDwgVjspIHN3aXRjaCAoTiA9IG0odGhpcywgeCksIE4peyBjYXNlIDE2OiBmb3IgKFAgPSAzICsgaih0aGlzLCAyKTsgUC0tOykgTFtVKytdID0gTzsgYnJlYWs7IGNhc2UgMTc6IGZvciAoUCA9IDMgKyBqKHRoaXMsIDMpOyBQLS07KSBMW1UrK10gPSAwOyBPID0gMDsgYnJlYWs7IGNhc2UgMTg6IGZvciAoUCA9IDExICsgaih0aGlzLCA3KTsgUC0tOykgTFtVKytdID0gMDsgTyA9IDA7IGJyZWFrOyBkZWZhdWx0OiBPID0gTFtVKytdID0gTjsgfSBKID0gayA/IGkoTC5zdWJhcnJheSgwLCBHKSkgOiBpKEwuc2xpY2UoMCwgRykpLCBLID0gayA/IGkoTC5zdWJhcnJheShHKSkgOiBpKEwuc2xpY2UoRykpLCB0aGlzLmooSiwgSyk7IGJyZWFrOyBkZWZhdWx0OiB0aHJvdyBFcnJvcigidW5rbm93biBCVFlQRTogIiArIHIpOyB9IH0gcmV0dXJuIHRoaXMubSgpOyB9OyB2YXIgYywgZCwgaCA9IFsxNiwgMTcsIDE4LCAwLCA4LCA3LCA5LCA2LCAxMCwgNSwgMTEsIDQsIDEyLCAzLCAxMywgMiwgMTQsIDEsIDE1XSwgbCA9IGsgPyBuZXcgVWludDE2QXJyYXkoaCkgOiBoLCBuID0gWzMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTMsIDE1LCAxNywgMTksIDIzLCAyNywgMzEsIDM1LCA0MywgNTEsIDU5LCA2NywgODMsIDk5LCAxMTUsIDEzMSwgMTYzLCAxOTUsIDIyNywgMjU4LCAyNTgsIDI1OF0sIHAgPSBrID8gbmV3IFVpbnQxNkFycmF5KG4pIDogbiwgcSA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAxLCAxLCAxLCAyLCAyLCAyLCAyLCAzLCAzLCAzLCAzLCA0LCA0LCA0LCA0LCA1LCA1LCA1LCA1LCAwLCAwLCAwXSwgciA9IGsgPyBuZXcgVWludDhBcnJheShxKSA6IHEsIHMgPSBbMSwgMiwgMywgNCwgNSwgNywgOSwgMTMsIDE3LCAyNSwgMzMsIDQ5LCA2NSwgOTcsIDEyOSwgMTkzLCAyNTcsIDM4NSwgNTEzLCA3NjksIDEwMjUsIDE1MzcsIDIwNDksIDMwNzMsIDQwOTcsIDYxNDUsIDgxOTMsIDEyMjg5LCAxNjM4NSwgMjQ1NzddLCB0ID0gayA/IG5ldyBVaW50MTZBcnJheShzKSA6IHMsIHUgPSBbMCwgMCwgMCwgMCwgMSwgMSwgMiwgMiwgMywgMywgNCwgNCwgNSwgNSwgNiwgNiwgNywgNywgOCwgOCwgOSwgOSwgMTAsIDEwLCAxMSwgMTEsIDEyLCAxMiwgMTMsIDEzXSwgdiA9IGsgPyBuZXcgVWludDhBcnJheSh1KSA6IHUsIHcgPSBuZXcoayA/IFVpbnQ4QXJyYXkgOiBBcnJheSkoMjg4KTsgZm9yIChjID0gMCwgZCA9IHcubGVuZ3RoOyBjIDwgZDsgKytjKSB3W2NdID0gMTQzID49IGMgPyA4IDogMjU1ID49IGMgPyA5IDogMjc5ID49IGMgPyA3IDogODsgdmFyIHgsIHksIEEgPSBpKHcpLCB6ID0gbmV3KGsgPyBVaW50OEFycmF5IDogQXJyYXkpKDMwKTsgZm9yICh4ID0gMCwgeSA9IHoubGVuZ3RoOyB4IDwgeTsgKyt4KSB6W3hdID0gNTsgdmFyIEIgPSBpKHopOyBiLnByb3RvdHlwZS5qID0gZnVuY3Rpb24oaSwgYyl7IHZhciBkID0gdGhpcy5iLCBrID0gdGhpcy5hOyB0aGlzLm4gPSBpOyBmb3IgKHZhciBuLCBvLCBxLCBzLCB1ID0gZC5sZW5ndGggLSAyNTg7IDI1NiAhPT0gKG4gPSBtKHRoaXMsIGkpKTspIGlmICgyNTYgPiBuKSBrID49IHUgJiYgKHRoaXMuYSA9IGssIGQgPSB0aGlzLmUoKSwgayA9IHRoaXMuYSksIGRbaysrXSA9IG47IGVsc2UgZm9yIChvID0gbiAtIDI1NywgcyA9IHBbb10sIDAgPCByW29dICYmIChzICs9IGoodGhpcywgcltvXSkpLCBuID0gbSh0aGlzLCBjKSwgcSA9IHRbbl0sIDAgPCB2W25dICYmIChxICs9IGoodGhpcywgdltuXSkpLCBrID49IHUgJiYgKHRoaXMuYSA9IGssIGQgPSB0aGlzLmUoKSwgayA9IHRoaXMuYSk7IHMtLTspIGRba10gPSBkW2srKyAtIHFdOyBmb3IgKDsgOCA8PSB0aGlzLmM7KSB0aGlzLmMgLT0gOCwgdGhpcy5kLS07IHRoaXMuYSA9IGs7IH0sIGIucHJvdG90eXBlLnMgPSBmdW5jdGlvbihpLCBjKXsgdmFyIGQgPSB0aGlzLmIsIGsgPSB0aGlzLmE7IHRoaXMubiA9IGk7IGZvciAodmFyIG4sIG8sIHEsIHMsIHUgPSBkLmxlbmd0aDsgMjU2ICE9PSAobiA9IG0odGhpcywgaSkpOykgaWYgKDI1NiA+IG4pIGsgPj0gdSAmJiAoZCA9IHRoaXMuZSgpLCB1ID0gZC5sZW5ndGgpLCBkW2srK10gPSBuOyBlbHNlIGZvciAobyA9IG4gLSAyNTcsIHMgPSBwW29dLCAwIDwgcltvXSAmJiAocyArPSBqKHRoaXMsIHJbb10pKSwgbiA9IG0odGhpcywgYyksIHEgPSB0W25dLCAwIDwgdltuXSAmJiAocSArPSBqKHRoaXMsIHZbbl0pKSwgayArIHMgPiB1ICYmIChkID0gdGhpcy5lKCksIHUgPSBkLmxlbmd0aCk7IHMtLTspIGRba10gPSBkW2srKyAtIHFdOyBmb3IgKDsgOCA8PSB0aGlzLmM7KSB0aGlzLmMgLT0gOCwgdGhpcy5kLS07IHRoaXMuYSA9IGs7IH0sIGIucHJvdG90eXBlLmUgPSBmdW5jdGlvbigpeyB2YXIgZiwgZywgaCA9IG5ldyhrID8gVWludDhBcnJheSA6IEFycmF5KSh0aGlzLmEgLSAzMjc2OCksIGMgPSB0aGlzLmEgLSAzMjc2OCwgZCA9IHRoaXMuYjsgaWYgKGspIGguc2V0KGQuc3ViYXJyYXkoMzI3NjgsIGgubGVuZ3RoKSk7IGVsc2UgZm9yIChmID0gMCwgZyA9IGgubGVuZ3RoOyBmIDwgZzsgKytmKSBoW2ZdID0gZFtmICsgMzI3NjhdOyBpZiAodGhpcy5nLnB1c2goaCksIHRoaXMuayArPSBoLmxlbmd0aCwgaykgZC5zZXQoZC5zdWJhcnJheShjLCBjICsgMzI3NjgpKTsgZWxzZSBmb3IgKGYgPSAwOyAzMjc2OCA+IGY7ICsrZikgZFtmXSA9IGRbYyArIGZdOyByZXR1cm4gdGhpcy5hID0gMzI3NjgsIGQ7IH0sIGIucHJvdG90eXBlLnUgPSBmdW5jdGlvbihpKXsgdmFyIGMsIGosIGwsIG0sIG4gPSAwIHwgdGhpcy5pbnB1dC5sZW5ndGggLyB0aGlzLmQgKyAxLCBvID0gdGhpcy5pbnB1dCwgZyA9IHRoaXMuYjsgcmV0dXJuIGkgJiYgKCJudW1iZXIiID09IHR5cGVvZiBpLm8gJiYgKG4gPSBpLm8pLCAibnVtYmVyIiA9PSB0eXBlb2YgaS5xICYmIChuICs9IGkucSkpLCAyID4gbiA/IChqID0gKG8ubGVuZ3RoIC0gdGhpcy5kKSAvIHRoaXMublsyXSwgbSA9IDAgfCAyNTggKiAoaiAvIDIpLCBsID0gbSA8IGcubGVuZ3RoID8gZy5sZW5ndGggKyBtIDogZy5sZW5ndGggPDwgMSkgOiBsID0gZy5sZW5ndGggKiBuLCBrID8gKGMgPSBuZXcgVWludDhBcnJheShsKSwgYy5zZXQoZykpIDogYyA9IGcsIHRoaXMuYiA9IGM7IH0sIGIucHJvdG90eXBlLm0gPSBmdW5jdGlvbigpeyB2YXIgaSwgaiwgbSwgbiwgbywgcCA9IDAsIHEgPSB0aGlzLmIsIGQgPSB0aGlzLmcsIGEgPSBuZXcoayA/IFVpbnQ4QXJyYXkgOiBBcnJheSkodGhpcy5rICsgKHRoaXMuYSAtIDMyNzY4KSk7IGlmICgwID09PSBkLmxlbmd0aCkgcmV0dXJuIGsgPyB0aGlzLmIuc3ViYXJyYXkoMzI3NjgsIHRoaXMuYSkgOiB0aGlzLmIuc2xpY2UoMzI3NjgsIHRoaXMuYSk7IGZvciAoaiA9IDAsIG0gPSBkLmxlbmd0aDsgaiA8IG07ICsraikgZm9yIChpID0gZFtqXSwgbiA9IDAsIG8gPSBpLmxlbmd0aDsgbiA8IG87ICsrbikgYVtwKytdID0gaVtuXTsgZm9yIChqID0gMzI3NjgsIG0gPSB0aGlzLmE7IGogPCBtOyArK2opIGFbcCsrXSA9IHFbal07IHJldHVybiB0aGlzLmcgPSBbXSwgdGhpcy5idWZmZXIgPSBhOyB9LCBiLnByb3RvdHlwZS5yID0gZnVuY3Rpb24oKXsgdmFyIGEsIGIgPSB0aGlzLmE7IHJldHVybiBrID8gdGhpcy5wID8gKGEgPSBuZXcgVWludDhBcnJheShiKSwgYS5zZXQodGhpcy5iLnN1YmFycmF5KDAsIGIpKSkgOiBhID0gdGhpcy5iLnN1YmFycmF5KDAsIGIpIDogKHRoaXMuYi5sZW5ndGggPiBiICYmICh0aGlzLmIubGVuZ3RoID0gYiksIGEgPSB0aGlzLmIpLCB0aGlzLmJ1ZmZlciA9IGE7IH0sIGEoIlpsaWIuUmF3SW5mbGF0ZSIsIGIpLCBhKCJabGliLlJhd0luZmxhdGUucHJvdG90eXBlLmRlY29tcHJlc3MiLCBiLnByb3RvdHlwZS50KTsgdmFyIEMsIEQsIEUsIEYsIEcgPSB7IEFEQVBUSVZFOiAxLCBCTE9DSzogMCB9OyBpZiAoT2JqZWN0LmtleXMpIEMgPSBPYmplY3Qua2V5cyhHKTsgZWxzZSBmb3IgKEQgaW4gQyA9IFtdLCBFID0gMCwgRykgQ1tFKytdID0gRDsgZm9yIChFID0gMCwgRiA9IEMubGVuZ3RoOyBFIDwgRjsgKytFKSBEID0gQ1tFXSwgYSgiWmxpYi5SYXdJbmZsYXRlLkJ1ZmZlclR5cGUuIiArIEQsIEdbRF0pOyB9KS5jYWxsKHRoaXMpOyBmdW5jdGlvbiBSKCl7IHZhciBuID0gWyJueWh5SyIsICJjYUh1aSIsICJoQ0NRQyIsICJ5b2pSaiIsICJVYmZuayIsICJGUHFqZSIsICJ1U1p4eiIsICJtVUdObCIsICJ5eGt0eSIsICJkS0JITyIsICJpVUlIeCIsICJ2Y0lxdSIsICJQaW5tbyIsICJBYVdYcyIsICJRbEhPZyIsICJhVnlJRSIsICJsVndXRyIsICJjSkNETSIsICJIWEVtVyIsICJaWENpeiIsICJiaVpxdyIsICJycEdIUiIsICJkcURzWiIsICJ4aGVkTyIsICJhWHFOayIsICJMdklRbSIsICJhRm9sRCIsICJNY3ZtTyIsICJvYWFwRCIsICJIVHh0VyIsICJlclhZZiIsICJpaEhoIiwgInBpZktsIiwgIlBOTlVlIiwgIkhTWWxCIiwgInZWb3hrIiwgIk1NaVNxIiwgIk9VeG5HIiwgIkFaRlBzIiwgIkpRU2xEIiwgIjRkY2xRaE4iLCAia1dIcUciLCAiTURXbVIiLCAiZ1doYlIiLCAicFBlbVoiLCAibHJTWFAiLCAiWEVrY04iLCAiRGlhTnUiLCAicXRXb2IiLCAiWEV6QmYiLCAiSHFiWVIiLCAiZ09NeXgiLCAiQXdXdVIiLCAiU1ZEUVYiLCAibnpDdXYiLCAiTU5mRE8iLCAiVFdjUmMiLCAiU2ZLb2QiLCAiZURET0IiLCAiR2xIakoiLCAieUxKbEQiLCAicHhFSloiLCAiSmF4U3UiLCAidkFZSEYiLCAiV2ZOUWIiLCAieEFmS1IiLCAidnBrUWwiLCAick1JQ2wiLCAiY29pem4iLCAiVVZNb2giLCAiVWxicE4iLCAic0tzV24iLCAiR05pR1ciLCAiemhzT1AiLCAiTUh5d00iLCAiVFdQWEIiLCAibEhKVEYiLCAialJPWmoiLCAiSFpOS2ciLCAic0N0UnoiLCAiSWF6T1oiLCAiU1FkS0kiLCAiQ0VqRGgiLCAiRURpWmciLCAiYlhBenAiLCAiUVdmeVIiLCAiZHlNSG8iLCAib094R3YiLCAiVGJpa3kiLCAiV1JlV0wiLCAibVdQV0MiLCAicW1YZVkiLCAiQkNGUHciLCAiaXRUWmUiLCAicG9qb3QiLCAiRnRJRmciLCAiVGpmdFgiLCAibElEcUkiLCAiaFV4dGEiLCAiY2pMeHoiLCAiRW12dmUiLCAicG1LYkYiLCAiQnpWbm8iLCAiUUhQWE8iLCAiSmxOT1giLCAiQkZYU2UiLCAiTWpLZm4iLCAiSVJrbXQiLCAiSmh4SUEiLCAiWXJLbngiLCAieHliRFMiLCAib3J0clMiLCAiWkFFSkQiLCAibk1RakkiLCAibHBodkwiLCAia2JWZ3UiLCAiY09qTEQiLCAiZ1REQksiLCAiaVJiU3oiLCAidHdVTUciLCAiZFNLWHciLCAiS3NYckYiLCAiQXR6UEkiLCAieG5aYlYiLCAiSWFDSWYiLCAiVkhYR1QiLCAiYWxlcEciLCAiZmNzS0YiLCAiVUhJYVAiLCAid1JwWGEiLCAiRG9jQWkiLCAicGd5UloiLCAibXlIaEkiLCAiZXpxR3oiLCAib2dtQk4iLCAidU16cmYiLCAiYVhpYXoiLCAiZmVnQloiLCAiT1d0QlkiLCAiR01YVVQiLCAieEVBeEgiLCAicmJ6RXUiLCAiZHJhSWIiLCAiaUh2dUoiLCAiS0JLdXYiLCAiYWlScGEiLCAiaXFMdmUiLCAieHNvclUiLCAibUxKU0giLCAiWUVHaGMiLCAiVnlNTFYiLCAicHd3ZWsiLCAieUZzS0EiLCAiWHVxQksiLCAiQkxIclciLCAib1Z0VVYiLCAiaUlna0MiLCAiR1lPUmUiLCAiTXl3WGUiLCAiWmxTc2oiLCAiSnRvc2QiLCAiV1pmdEEiLCAicEJnRG0iLCAic0dlUWMiLCAiVWh3eGgiLCAicHFtY0giLCAiR2ZUSkgiLCAiZEpZRVkiLCAiaEJPVUUiLCAiQnRBYUQiLCAiVUNMbEIiLCAidk9VTG0iLCAib3dKQmgiLCAidGdlbkciLCAidXdmU0siLCAiaE1TbGEiLCAiY29uc3QiLCAiSlRVWWoiLCAiTUJXSUciLCAiWXp6VmoiLCAiZnBXSVkiLCAiTm1IelAiLCAieVJtUnUiLCAianRRQ0IiLCAiTmZVUXIiLCAibHBjdlUiLCAiakhlTGIiLCAiVmJMV3AiLCAiUlpXUWoiLCAiaUV5YXkiLCAiS0ZucWwiLCAickVFUXAiLCAibERPaVYiLCAic1NPYlUiLCAiaUltblMiLCAia2VBZVIiLCAiTFFnTE0iLCAiQ09jZFIiLCAibFZIYWYiLCAiREhic3YiLCAiRnRUVFEiLCAiYVB2ekoiLCAic0VFRUsiLCAiT1JYWVciLCAibnNTR0IiLCAiVkZiWFYiLCAiVEJBV2EiLCAiWmlyREciLCAia3VDTHQiLCAiaUhTZU4iLCAieWNaaXQiLCAibFBUa1YiLCAiaGVzSkkiLCAiV0xPd08iLCAicEF5dEciLCAid2hGdmwiLCAiRVNXUnYiLCAiU2JMcWEiLCAicU92WVAiLCAiU216dG0iLCAiKCgoLisiLCAiS1VhWVkiLCAiYmt0YmEiLCAiMjFlcFJNQ3QiLCAieHlkSXYiLCAiQXJrZUUiLCAiQkFNS0EiLCAiaHRyWUkiLCAiUVFWenMiLCAiS3Flb1MiLCAic2hpZnQiLCAiZE1acWwiLCAia0Vmd2wiLCAiU3RyU3kiLCAia0poTk8iLCAiS3REdHgiLCAiYkNuQ1UiLCAiUmh4eGQiLCAiRXFrbXAiLCAidENrbksiLCAiZktaQmMiLCAiTG1VamMiLCAiTUptWE8iLCAiWFFMVGUiLCAiU21EU3giLCAib2tVTVEiLCAiVnRsRlYiLCAiUkRpZHciLCAiR1FRd3YiLCAiQmZEYUUiLCAicXhBd0YiLCAiSkp6YloiLCAiV3dpME4iLCAiYnZNRmQiLCAibFNUV0MiLCAibWtJQ0giLCAiTk9HYVIiLCAiRmtDUWwiLCAidGN2SHciLCAiR0t6enAiLCAiTkZYQUMiLCAiR0tNaXYiLCAiWEVicVUiLCAiV3p0dVEiLCAic0pseXgiLCAiQkp3YWoiLCAiZ01vY3EiLCAibkFmbGkiLCAiS0pUSVQiLCAiSlFjZmMiLCAicUlrYW0iLCAiVHdMYmciLCAidVNheWEiLCAiSlFwbGciLCAibGx4ZUwiLCAiamZVU0oiLCAiRXNvYW8iLCAiSEd6UHMiLCAiVHJBckUiLCAielhWd1QiLCAiUGdSRmciLCAiblpjRmsiLCAiVHlzdFMiLCAidEFtUWMiLCAiWndCRm0iLCAiSFdWeXYiLCAicFhGUXgiLCAiTlFITkMiLCAiZ0xma3EiLCAiVXRUSHIiLCAiWkRRaU0iLCAieFdHanQiLCAic2hrcGgiLCAiYXRVd0oiLCAiRkhGUlgiLCAiUEZTdGwiLCAiSmhuekMiLCAicUxjRXkiLCAiakJiZ2EiLCAiTllQUFAiLCAiem5CTnQiLCAiWFJGaFEiLCAiY1lVSE8iLCAiRlN1WFEiLCAiR2xIeXUiLCAiT2R1WG0iLCAiT2dUek0iLCAiY0tNS3QiLCAiSmROcFUiLCAic1VMZ1QiLCAiR3BiV3MiLCAiS0poZFEiLCAiYlhpb1kiLCAiUEJZakkiLCAic1NQR2wiLCAiS3FpcUgiLCAiVnZWcm0iLCAicGdpS1MiLCAiY2RWTWIiLCAiQXZUU1QiLCAiT01ZTW8iLCAib3JyVGwiLCAiY09UdUkiLCAiU3ZNengiLCAiUVRVeEYiLCAicEZKTFEiLCAiWW1JbXYiLCAiWGpwaHIiLCAiZGlaclYiLCAicHRPQ0oiLCAiWmZnaloiLCAiR1VQd0kiLCAiVFVWV1giLCAiVnJWRUMiLCAiTW9IdlYiLCAiT2ZPVm4iLCAieGJYTHoiLCAiREVMYVciLCAiUWVad2wiLCAiak1IdlUiLCAib0VJTnciLCAiVEFzZnYiLCAiYnpiZU8iLCAiV0tGSFYiLCAiUkpRS1YiLCAiUWJLTk0iLCAiaEdkYlAiLCAieVhYS3giLCAiRFJGenUiLCAiWXZsRG8iLCAiSUVodUEiLCAid2RzYUYiLCAiaEhSRmsiLCAiT2F6dXYiLCAib2JCSHYiLCAicmFTeUkiLCAiblpXSWEiLCAiZUZSb0kiLCAiUk9PeHAiLCAiWEFKZGUiLCAia253dEoiLCAiVFJUQnAiLCAiQ0JockkiLCAiY0lMYUkiLCAidUxyZmoiLCAib2lTbEYiLCAiSHBnQVIiLCAiSnBhbk0iLCAiRENqRG0iLCAiZGVOc1IiLCAiR1NRSXMiLCAiakdvanIiLCAidlllQmMiLCAiekRvc1ciLCAicnlRQXQiLCAiVXpjQXAiLCAiUmprblgiLCAiTGtsd3kiLCAiVlFKR2MiLCAiQVd2Q2ciLCAiUGFvclQiLCAibFVGVlkiLCAiR250ZlAiLCAiQkNvRlciLCAiZ1pxVnUiLCAiRHVIRE8iLCAiT2lWanYiLCAiREdVQkEiLCAiallzYWQiLCAiQWhtalQiLCAiTmNqV1oiLCAiRmNBUWQiLCAicWNtYkgiLCAiaHNtcVUiLCAiTHptUEMiLCAiTVp1eXkiLCAidldsSlAiLCAiVkNac3MiLCAiZEFIVHgiLCAiRUVzdVYiLCAickVLWEciLCAiYXFRcHAiLCAiWnh2U3QiLCAib0FvbWwiLCAiQURSUGQiLCAiYWVBR20iLCAiZ0RDd0MiLCAicGRRQkMiLCAicFByTFciLCAiQlpJVEEiLCAiS1JjR3ciLCAiR09Jd20iLCAiMzI4Mk1FZnhndiIsICJQTEhSRSIsICJoaXZWYyIsICJKSWxNViIsICJ0b1N0ciIsICJqaFRqaCIsICJOWlNFZiIsICJPb1RqbiIsICJUR213ViIsICJpUEZ3SSIsICJDb3NCdiIsICJodUJ6biIsICJBeXVyZiIsICJlQ05ISCIsICJnZ3ZNYiIsICJmRXhhcCIsICJKVkpIQyIsICJMaEhLQiIsICJ4Y3BVSyIsICJQektXUSIsICJPUkxVWSIsICJXVVlYayIsICJSVFR1ViIsICJKVEJyRiIsICJCUmNkTCIsICJUdUFUViIsICJLTURKbCIsICJzZWFyYyIsICJvb1BobCIsICJFbmV4byIsICJ1SEdQYyIsICJzdHV6USIsICJCQVZ2ZCIsICJHSEN2bSIsICJ2RlVBcyIsICJSZ1RhcSIsICJ4YWxmbyIsICJNWXFicCIsICIzNDdXeW1CU0YiLCAiUFNkeUMiLCAiT2pBbU4iLCAicER1TFEiLCAibFRPa2IiLCAieGtRSm4iLCAiSEhEdnAiLCAiUEFpalYiLCAiZVpmZ0kiLCAidlZwWXciLCAibGZseVkiLCAiYlBrRGUiLCAiRVhXWHgiLCAieVRXenUiLCAiTnFvZ04iLCAibmtKa3giLCAiWE9lb28iLCAiRWxNbGwiLCAia3BjaWMiLCAiSXlkbGYiLCAiY2NPelciLCAibFNkb24iLCAiWHlZYlgiLCAiZEhPT3AiLCAiaElEaVgiLCAiVWdjT0siLCAiSmFJUVMiLCAiWVF0ZVAiLCAicnZUaGgiLCAiZmRDWFQiLCAieVh6c1MiLCAiREJWeEMiLCAicGxIYUkiLCAiUG52bFgiLCAiUmVHS2siLCAia1JWaEgiLCAiZWJ1UFYiLCAiQlJSTGMiLCAiaFFEakMiLCAiU2dBV1QiLCAiVVBjQ0IiLCAiWVFCcFoiLCAiRHRLUmQiLCAiUHB6cGMiLCAiQ05oU28iLCAidGVRaU0iLCAiWERWbXYiLCAieGNpRnAiLCAiSVRDeksiLCAicktieU0iLCAiRFVZWlIiLCAib3ZzVW0iLCAiMTk4MjIiLCAiTHlaemciLCAiYXJZSWkiLCAiVVluaXQiLCAiY0N1RHEiLCAiWFVpeWEiLCAiVXhEVHkiLCAic0tFZ0giLCAiUGlHWHEiLCAia2ZLbXYiLCAiYnFMWG4iLCAiTVptbkYiLCAia0NTelIiLCAiVUJSb0giLCAielJaVVciLCAiU3RkUG0iLCAiRkt0SVoiLCAiSEZCYnQiLCAidE9wTnkiLCAibGVuZ3QiLCAiVXZpUlciLCAidlB4c0wiLCAiTkpabUciLCAiaWpmU04iLCAiUVBIYkUiLCAiQnZSRkwiLCAiaXFvSUQiLCAiUERBc1UiLCAiZVlPaVIiLCAieHV1QlQiLCAiZ0dmdWoiLCAiaXdJcXIiLCAiU01CaEIiLCAiSE5TS3giLCAibUVVY3giLCAidXh2RFYiLCAiaUhUVUMiLCAiUU1kem8iLCAiU3laQlMiLCAieGttcFciLCAiV3BtQ3AiLCAiRlJlcGciLCAiR1JYVnMiLCAiTm9nS1oiLCAicGZGRXEiLCAiVUFOQkIiLCAicWxTdkgiLCAiZ2NZWHUiLCAiYkJZa28iLCAia2ROb2IiLCAiUkxVaGEiLCAiSWlBcGMiLCAiQ1NleGciLCAiZ3FtU2MiLCAiY3JpQngiLCAienNVakciLCAiWVF6bFciLCAiTEV3VGciLCAiT2RTS3QiLCAiSFpIbFkiLCAiUWV2QWsiLCAibEJRT2ciLCAiTkR2QVIiLCAiTkZ1bksiLCAiUGREQXYiLCAiWkdZS3IiLCAibmdBbGMiLCAiSVBBY3QiLCAicHlZZ1kiLCAiUHpWZUciLCAiSnVNV3EiLCAiaVJDU0giLCAia3lZWXIiLCAidXp5eGMiLCAiWkRoQWYiLCAiWk1yWlgiLCAiUXJyQ08iLCAiTFZpb2IiLCAiR2ViQWYiLCAiZGdDdnoiLCAiVnNTRmciLCAiektsZWciLCAibHBqTEYiLCAianN4Y0IiLCAiaXNqY3AiLCAiTkl5c1EiLCAiTFRKS0kiLCAiRmZYdGgiLCAiZ1NkVkkiLCAiYUlISnkiLCAiR01qRFoiLCAiTWpwOFYiLCAiRmdoS08iLCAicFlBUFYiLCAibmVIYk8iLCAiYWFESlEiLCAibm1nd1ciLCAiRURReWUiLCAiV29pV0MiLCAiQmlieGIiLCAiUkFvbGYiLCAiNzIyOTEiLCAibmNLU0oiLCAiYVdHaHUiLCAiREtUSVUiLCAiaXBramciLCAiU0tnbmYiLCAieWxUY0QiLCAiSmV0VU8iLCAibU9TRFQiLCAiV0p4bkMiLCAibEVjcEkiLCAiOEhleUYiLCAicEVLZmMiLCAiaHZCa2wiLCAiYkJXU2wiLCAielp4WmMiLCAicUFyYlciLCAiT21YTmoiLCAicnZMRGwiLCAiYk9hRk4iLCAiSW1ubHkiLCAiWkZRaHoiLCAiWFhXSXAiLCAiU1hkVEoiLCAiV2ZqQU0iLCAibkt6eEUiLCAiTnhHQXQiLCAiTVZ4eVgiLCAiZ05uZW8iLCAiY3lJeXMiLCAiNzY3N28iLCAib2NYU08iLCAiSmFyQkgiLCAidUtwS0YiLCAiSEhZRm0iLCAiMjY4MTciLCAiWktrS2EiLCAiRGdtdlgiLCAicFZUUnEiLCAieHFWYk0iLCAiRnVDaGQiLCAicEp4SkoiLCAiTGFWaHYiLCAiamZLQ3giLCAia1dMUUoiLCAidGxGaHIiLCAiSktHRGIiLCAiQVBRYmYiLCAieWxHVGciLCAiT3NRWEYiLCAidEFVeVoiLCAiWlJNQ2YiLCAiZ3llalUiLCAiWlpKb1ciLCAiVE5UUkEiLCAiQmtPblciLCAiakxwSHUiLCAicVVaZXgiLCAiTkJGbnQiLCAidFBEZkQiLCAia2RZRFciLCAiek9JU0EiLCAiZnV5WmoiLCAiaGdQb2UiLCAiYklIS1QiLCAicHJjRFUiLCAiWWFubloiLCAiR3ZUZkEiLCAiWm1TSUYiLCAiWm1rTWwiLCAiRnVaRWwiLCAiSm1WdUciLCAiVnhmWWUiLCAibFNpSm8iLCAia2tqc1giLCAiT1lyY1ciLCAiWFVqc1oiLCAiSHFlcXoiLCAiRlh6eEoiLCAiaXpmQUEiLCAiYmlYTXciLCAib2psZngiLCAiRUF2SUQiLCAieFZQcVQiLCAiRWNGUEoiLCAiZ0FnVnkiLCAia0JEVmkiLCAiSnB0b3UiLCAiYlJsaUciLCAiaVdqR0ciLCAiemdaTmwiLCAiTEtNalMiLCAiaE9LTHMiLCAiV3pVcVEiLCAiYUtwbUQiLCAiQWp5S28iLCAiRUJZd0oiLCAibG9kd2oiLCAiR1pCc00iLCAiVUJSU20iLCAiY3BWS2UiLCAicmpMUHoiLCAiUld1IiwgImxUbVFDIiwgIkR1QkNnIiwgIlVaTklCIiwgInB4elJXIiwgIlZxV2tvIiwgImhVQUpUIiwgIld4T0lWIiwgIlpZemFnIiwgIlV1YjdVIiwgImFsWVJEIiwgInRvTUZhIiwgIkV0aWRrIiwgIlNEY2VSIiwgIllBbW5zIiwgIm92eHpqIiwgInwwfDQiLCAiUGhLenkiLCAiVUV3ZnYiLCAiQ2RYWU0iLCAic1llUGEiLCAiVG1lS3IiLCAiRUpybnciLCAicHZ6a2YiLCAiVW5sRlYiLCAiVGJKVFciLCAiWHFna3QiLCAiT0hkZEsiLCAiUHVPS1EiLCAiOWtMZkZsRCIsICJmR0lnciIsICJCVU9LcCIsICJLb2V2RiIsICJudkpwZSIsICJ3blhsTiIsICJFQndObyIsICJzaGdyVCIsICJUaU1JaiIsICJwa211WSIsICJBV01vbCIsICJkWnhZdSIsICJ6S3lQdSIsICJsTHFFRSIsICJDY3pqRCIsICJOZ3FnayIsICJRZk9LaSIsICJKWVZSUyIsICJqSHNlRCIsICJzcWN2UiIsICJBeFZDWCIsICJTRlVJbiIsICJjZ2hQciIsICJ2dFp3YiIsICJDdUNBVyIsICJqSXlFWiIsICJYc2RJRCIsICJBUEZUdSIsICJZU2V1RyIsICJhcUJGUSIsICJuZENBTiIsICJDa0t3TiIsICJLS21FSCIsICJ5TERpdyIsICJLb2xhUSIsICJTZUtEViIsICJSUUxNcSIsICJEdEVFcyIsICJ2emNjWSIsICJMVERzVyIsICJxZWprcyIsICJHYlpwdCIsICJ6WGVGSSIsICJIcW5QTyIsICJKUE5qQiIsICJjYVpMRyIsICJBWVV4SiIsICJIaU5vTiIsICJ4ZEVjdSIsICJNVVNrUCIsICJBcVl4SiIsICJlV0VEYyIsICJoYklCdyIsICJnVGZteCIsICJ6blVvSiIsICJJY0ttZCIsICJQdmZJVSIsICJWakFMTiIsICJQcHd5VCIsICJ3QWVQRiIsICJuVGlOWCIsICJ5SmlyTyIsICJPQlJibyIsICJ0Z1pWSCIsICJEZ3NQaSIsICJ4SEJFeiIsICJoWW9wUyIsICJQWXpoTSIsICJHcVd2WSIsICJlTkZPSCIsICJWS1dqVSIsICJEdWpXRiIsICJYa1liaCIsICJzSVByaiIsICJWUGhyciIsICJac3NNaSIsICJ2SVNtWCIsICJLcWV1eiIsICJFSmhrQSIsICJvb1hGUSIsICJ0ZWFRQiIsICJlUk1NeCIsICJPaU1paSIsICJzTkFHSCIsICJzY0xYUSIsICJNc0RScSIsICJ5cVVBdCIsICJhd2VtTiIsICJHT2dGRiIsICJiZ1hzQiIsICJrT1BMRCIsICJxSmZMbCIsICJRaW5wTSIsICJ4T3hRbSIsICJKRmhldSIsICJCY2JzbCIsICJRTFJTRyIsICJyZXhoQSIsICJpbHNrTiIsICJ1eGNRYyIsICJRbXY1IiwgIktKU3dIIiwgIklRREdoIiwgImdCVVZQIiwgInZ5YUdNIiwgImN5TVRFIiwgImtUYmF1IiwgInRYbnNkIiwgImdRZ1dZIiwgIktpeWlFIiwgImphUmt2IiwgIm5GbXdUIiwgImVpSkRxIiwgImJPR0l0IiwgIlFyTnRUIiwgInlGaEV2IiwgIkdBZ0tlIiwgInBzSE9YIiwgIjR8MXwzIiwgIlJRc3FvIiwgIllPaHBaIiwgImF6dEtuIiwgImF1cnVlIiwgImlmTmZOIiwgIkxOYVhVIiwgIkJSQWZJIiwgImNsV2RzIiwgIkVZVGJDIiwgIlJVcklSIiwgInF0ZUZnIiwgInF1bEhrIiwgIkF2dEN2IiwgInZMZ2hSIiwgIlVXbFNoIiwgInRGUXlmIiwgImZNdVVxIiwgIll2aGJpIiwgInJxZWFRIiwgInhidVNBIiwgImViYkZDIiwgIk9XUnNTIiwgIlpya05SIiwgImpFemJXIiwgImJhZVZnIiwgIlFKZmF1IiwgIkhSYXhRIiwgInJES0JZIiwgImZ0bHlQIiwgImFsZ3ZwIiwgInJpQ2d0IiwgIlp4QU9yIiwgIlpBZk5XIiwgInN2UGVmIiwgIm5QT095IiwgIklIZWxKIiwgIld3Y1lMIiwgIkxQSWZJIiwgImt5WHNEIiwgImJKUVlyIiwgIkpxTGFBIiwgIlVKeERpIiwgIkp1TldHIiwgImFKbk9TIiwgIk5Gc3lUIiwgImlLalFFIiwgInhXVWxBIiwgIlVJcW5BIiwgImZjdXVrIiwgIlZVQXdFIiwgIk9UWnlsIiwgInhxckxoIiwgIk1HVFFOIiwgIm9xeGx6IiwgIkRRU25hIiwgIkJ3ZXZ1IiwgImxaUG9TIiwgInVlcnZtIiwgIkpLTE1OIiwgIldYWUVpIiwgImNGdmZFIiwgIkZubVR0IiwgInZMZkFkIiwgIlJKWUZHIiwgIlpTeUdMIiwgIlJOSlRpIiwgIkxIT2JKIiwgIlhrb25jIiwgIkRvRVJzIiwgIldIVm11IiwgIlJ3WFBFIiwgInpCZlNRIiwgInFqaEplIiwgInFSWHJxIiwgInR6bmZHIiwgInpnbnl3IiwgInRZWENQIiwgIlJzZEpxIiwgImh2S2lLIiwgIkdlVFljIiwgImp5VGxCIiwgIm5xTnJyIiwgIkRhek9EIiwgInV5VUh2IiwgInNvVkNUIiwgImxBeWFaIiwgInNZV216IiwgIjQyNTcwIiwgIlh2SE9ZIiwgImRkUURsIiwgIndxYllvIiwgIkZUWXpXIiwgImF3Z0NOIiwgIkdvZXN2IiwgIlNSdm9nIiwgImRUR2VXIiwgIldOVlZ4IiwgIklFV3ZHIiwgIlZ3aXVzIiwgImF0QkVxIiwgIm92UFNFIiwgIlZTYVBrIiwgIkNRc1lCIiwgIklSRWVLIiwgImNuRGhKIiwgIllSWXhJIiwgInJDYWJIIiwgIkx6aXBoIiwgIlhIU3NLIiwgIklmZ1Z2IiwgIm15SnZYIiwgIm10eWtuIiwgIlJnS1ZnIiwgImN6Zm5VIiwgIm1NU2tlIiwgIkNHeUdEIiwgIk1iYVFoIiwgIlFFTW9MIiwgInl4bmRiIiwgInpnbnBXIiwgImJ1R0FZIiwgIkliSkhsIiwgIkd6cXBnIiwgInVSZnpnIiwgImZhV2liIiwgImJCYU9UIiwgInRzSW5uIiwgImh4dkhHIiwgIk1Kd3J1IiwgIlJPektiIiwgImRtdU1NIiwgIllVWVViIiwgImZLekVHIiwgInVZcmhEIiwgInZITE1PIiwgImdIYlZUIiwgImpRZ2FjIiwgIkdNR3l3IiwgImRuQ2xmIiwgIm5Qd1VsIiwgIldrR0lOIiwgIlVWUHVPIiwgIkR2ek9JIiwgImRLSHV5IiwgImlWYmRvIiwgIndibFZQIiwgInpRSWRLIiwgInFEY1hjIiwgIkpZeUZhIiwgIlBqYXlFIiwgIkphUFNtIiwgIktrVW9VIiwgIlpRZmx3IiwgInVmSkJpIiwgIktaRHpoIiwgIlJnaWtXIiwgIkNzY3FHIiwgIkh6S3BJIiwgIm94ZVdRIiwgInVGc1F3IiwgIklqVkxFIiwgIkRoRHdxIiwgImJrcWVZIiwgIlBMUE1hIiwgIlVrZUFpIiwgIm9KdXlRIiwgIm9kS2xRIiwgIllxWmh0IiwgImVWWVBvIiwgImtHdW1qIiwgImhPbXhoIiwgInhIWnFOIiwgIkRZZW9GIiwgIkxna2p0IiwgIllSb2NCIiwgIkhYamN4IiwgIm5QVFhJIiwgImhjVXN4IiwgInNwbGl0IiwgIkNxdnByIiwgIlJ4TnNwIiwgInFodW5pIiwgInBDa3RRIiwgImRBRUdsIiwgImNabEJzIiwgIlFHWkhhIiwgIlpSRUJHIiwgImJkb0hnIiwgImh1ZHBpIiwgImNXSUtUIiwgInZpa0NNIiwgIm1la0JiIiwgIk1HdXJFIiwgIlRaY0tlIiwgIlpDc2tCIiwgIkFTVyIsICJ6QUJDRCIsICJrbG1ubyIsICJNcFd5dyIsICJycmVzdCIsICJyS0J3VSIsICJvRENOYiIsICJwZ0htZyIsICJRbHlJaSIsICJWUVpoWCIsICJseENiVyIsICJQY1lWSSIsICJhc2dOSyIsICJlcFV3YyIsICJvRnFLeCIsICJaR0hTSCIsICJaZmFrSiIsICJubVRrYyIsICJPWFhLSSIsICJNSXVlSSIsICJDSVVaSCIsICJ1a2NobSIsICJmaE5zVSIsICJnU3ZnQyIsICJsemJiWSIsICJxUWdGSiIsICJLaGZBcCIsICJnWHJBcyIsICJRTFZJdiIsICJvTnhhbCIsICJ0Y0JZSCIsICJMWVhyQiIsICJlQkxnbiIsICJwZklmTiIsICJ1QklkYiIsICJwYVl6aCIsICJsR2FyRyIsICJhbHpoVSIsICIxNTNPSiIsICJDcE54dyIsICJtWW9qYyIsICJZVUpPaSIsICJwSGN4cyIsICJpbmciLCAiRGFUTVEiLCAiYWZNVUkiLCAib2JDUlgiLCAiaENDUVEiLCAibGhZQnEiLCAid0FPbHMiLCAiVHd1a1oiLCAiWk95YWMiLCAiRHVNb2wiLCAiQUdkbVIiLCAiUlBWeWIiLCAiT2ZVa0siLCAib0dTdkoiLCAiREdZa3EiLCAib2ZEUUQiLCAiUllYenkiLCAiVEhWekMiLCAielVoWUoiLCAiS1B0dFMiLCAiQXdHSFoiLCAieEptcXgiLCAieEJmSUgiLCAiekxWbnYiLCAidlVrb1IiLCAiaEVYWU0iLCAiZkJvcWUiLCAiaHhDTUoiLCAicU5rQmQiLCAiYWFwd3EiLCAiaXFUS2oiLCAiMTQ3Mzg5NFZQTkJqWCIsICJpbmRleCIsICJTWmhKQSIsICJaVGJpQyIsICIzfDJ8MSIsICJuZ21hZyIsICJQS3NFZiIsICJPc2ZYSSIsICJUWFhpZCIsICJsdG1zcyIsICJseGR3VCIsICJIb2RveSIsICJ1SkNvWCIsICJXVXBXSCIsICJjYUpQbiIsICJpRkFjeCIsICJoVGdFTCIsICJFSUllUiIsICJxTnZzTSIsICJlck1FayIsICJjRG9YUCIsICJiRXhGSiIsICJqWmVFeCIsICJwaVN2dCIsICJHRmJvdiIsICJSZEZFSCIsICJxWWx2QiIsICJObVhDYiIsICJLcmJCQyIsICJhdGdvYyIsICJnRUJjVCIsICJ6cWxicyIsICJKWHl0RiIsICJwZXdiRCIsICJGQm9LUSIsICJDQmRuciIsICJvWlJaSSIsICJReGFmRCIsICJrcENyeiIsICJJTlpHRSIsICJNWWtHdyIsICJtcHBoeCIsICJuZEJUeSIsICJQU1dldSIsICJ3UXpNaSIsICJnb2hnbSIsICJWbEVabyIsICJzcUNZayIsICJVU3h2cCIsICJNTGp5YyIsICJwRVNJYyIsICJVTUFsViIsICJVUVdEWSIsICJkVWxmWiIsICJNQVpaQSIsICJ5UXljViIsICJRTWd0eiIsICI4alpsVyIsICJYUlBVSiIsICJyeUdrVCIsICJUc0t0aCIsICJzZHl1TCIsICJYZFZVTSIsICJiTm5HaSIsICJBUGRxSCIsICJNdkRvUiIsICJDbUNZZCIsICJpbFd2ViIsICJpdkVPcyIsICJ0WlhmaSIsICJOanhPWCIsICJFRm5jcyIsICJ5cWZTTCIsICJNc2tCRCIsICJQU09ObiIsICJ5ZnhUWiIsICJIZ0F2dCIsICJjT0FvdiIsICJxVUNMTSIsICJFSVhjaSIsICJrUHV0QiIsICJUekRlUCIsICJHc2RUYyIsICJrc3VvTSIsICJ0aVZHYSIsICJaQ3N2aCIsICJhcnZWTSIsICJUam5pWSIsICJOZXFZRyIsICJtRGtPYiIsICJvUUVtRiIsICJnVHlnQSIsICJRd01BaCIsICJrb3JZbyIsICJRb3ZKbyIsICJZaEtiZiIsICJBQ2FhTiIsICI1NllBRyIsICJmQnVQZCIsICJHUlJLaCIsICJOTHV0QiIsICJ1RmV1TSIsICJDZU9ndyIsICJJQXJ5aiIsICJZZUlqTiIsICJVaXhZTiIsICJYaVNIeiIsICJCS1ZKTyIsICJHRW1NcyIsICJHU0dwZCIsICJ5WnpjYyIsICJwRXRZbyIsICJhYmNkZSIsICJXTmRpRiIsICJIdFdZRiIsICJSTlpOUSIsICJzVlZiZCIsICJweXVheCIsICJhRmdVWCIsICJUYlB2QyIsICJOdVFacSIsICJtcnFtdSIsICJORWdKSiIsICJuZ3ZBUyIsICJxUFBpdCIsICJjS09LRCIsICJMT2JkSiIsICJRS0dJQyIsICJscVZwRSIsICJ8MnwzIiwgInhad1N3IiwgIktyZHpzIiwgIklKUkpUIiwgIld6bGZlIiwgIk1XWWd2IiwgIldxUGRhIiwgInJ2RU1HIiwgIkpiZENsIiwgInRSUUNqIiwgInpKb2lQIiwgIkZQZ2xXIiwgIlJURVpZIiwgImJQb2pxIiwgIk5QV1dOIiwgIndvS0F2IiwgIkZXVEpOIiwgIm9ISFpHIiwgIk9BVUluIiwgIlJ0T3R2IiwgIkxqZVFsIiwgInVDRWlXIiwgImdKRW50IiwgImdJZUtyIiwgIldHSkJwIiwgIm5WSW5JIiwgIkRFUnVKIiwgIll3bHpHIiwgIlpqa2VNIiwgIkFpVHpVIiwgIkZ1VkxVIiwgIk5sRGRxIiwgIklCaVRVIiwgIndvR2FNIiwgIk1aVU94IiwgIkpLZ0RjIiwgInVlamFpIiwgIm1qRUF1IiwgIm9reGtLIiwgIkFVTUZ4IiwgIkpRdm5lIiwgImlKZEpCIiwgIlhnVFlwIiwgIlBqb2pLIiwgIklQdWFHIiwgIkNOa21MIiwgInZTUnJNIiwgInNZYWpvIiwgImhxQmZUIiwgIkVadVpOIiwgIklud0dVIiwgInB1WkRrIiwgIkpIdUttIiwgImRla0lzIiwgIkhRZmtSIiwgIkF4bnFvIiwgIlpMbEhNIiwgIkN0V2pFIiwgIkVoVGZBIiwgIk54aURaIiwgInlSb25uIiwgInlVT011IiwgImNTUXNqIiwgIkptZlJoIiwgIlRrTEd1IiwgIlJLbndFIiwgIktNRHBRIiwgIkJnSVlJIiwgIlRHb0xSIiwgInlTY21YIiwgInZtS3hNIiwgIkxzclJlIiwgIlFPa1Z6IiwgIk9pRlBXIiwgIkxzU0V3IiwgIkFkeGdKIiwgInZJT0JBIiwgIkthTGp4IiwgIkhDenBBIiwgImhoTXhRIiwgIlpoYnFqIiwgIk1LU1BSIiwgIlVHd3BhIiwgImtrR1J1IiwgIkJGa0NGIiwgImZOVGxOIiwgIk5nTnNEIiwgIlZOUEpLIiwgIlp0cVFWIiwgIklmSXJWIiwgImhlZnpUIiwgIkFrenZ2IiwgIkxZWEJFIiwgIk5Hb2RvIiwgIk9DUFpSIiwgIkR1d25XIiwgImtBQWxxIiwgInZyRWV6IiwgIktTYldtIiwgIkRzcnVoIiwgImtsYSIsICJ0YmxKTyIsICJLeEd0TCIsICJ4WGtGRiIsICJ4cGtHTCIsICJLbVdwcyIsICJJWFVLUiIsICJmeEdLRCIsICJ0RHZSRiIsICJNc1V2TyIsICJJbnRUZiIsICJlWWpldyIsICJ1TWJ6cSIsICJJRVlMTCIsICJ6eURTaiIsICJCQ1V4TiIsICJTek9ScSIsICJtcndMRSIsICJ3RXpNVSIsICJBZmZVTSIsICJ5Tm5qdyIsICJ4bHhhbyIsICJIV2hVWCIsICJacVlIdCIsICJ2eENVRiIsICJES1dRdCIsICJEU0luZyIsICJwYVVRViIsICJIV1RwWCIsICJUdHVJSCIsICIwfDF8NCIsICJuVWxRSiIsICJOQ0JjRCIsICJpakpWUyIsICJVYVJ1UiIsICJUZUhHeSIsICJMaFRwQiIsICJZeEttTSIsICJiTWVZSiIsICJUbW5zSyIsICJlVGRaQSIsICJDQ2Z4cSIsICJ5RmFqcSIsICJzSWlqdyIsICJ3a1h3WSIsICJlZmtKcyIsICJDeWlqaiIsICJTdU9wSSIsICJwU2FwQyIsICJSeXJFVSIsICJjYXFDYSIsICJHQmVOWiIsICJDd3ZuZSIsICJkYW51ZiIsICIxNzEzNTUyUENkYmRZIiwgIkJwdmVjIiwgIlVCaWRmIiwgIklDR1NiIiwgIk9Ha29HIiwgInJTTmJuIiwgIlpxSU5zIiwgIkxTY3JWIiwgIkN1TkxuIiwgImhCSGRoIiwgImdzT0l0IiwgIm53V1VSIiwgInBObXRXIiwgInNMZVhtIiwgImlUcnZrIiwgImJEa2ZhIiwgIkFMRGhiIiwgIkJlQ01uIiwgIkFKWElYIiwgIlRjVG1jIiwgInBvdm55IiwgIkVGR0hJIiwgIml3VEV1IiwgIlJsallVIiwgIlNWR05WIiwgInVWcWJhIiwgImJSWkhzIiwgIkl2d21VIiwgIlpoQkRUIiwgIkhHSUtLIiwgIk5SV29ZIiwgInJ2RVZKIiwgImVRTEdqIiwgInNmQUxKIiwgIlJMUmhOIiwgImp1UmpoIiwgIkhCRGhZIiwgImNoYXJBIiwgImxOUnppIiwgImVWRWlIIiwgIjU0dmN0IiwgImx4UkxZIiwgImVlVVpjIiwgInFDaHZIIiwgImtkcGVPIiwgInF5dkVzIiwgInJEamtDIiwgInNpbkp3IiwgIm55ZkVrIiwgIkdUVHBrIiwgIk1HV3pGIiwgImNpZWZaIiwgImN6S0hGIiwgIldha25jIiwgIklraHBHIiwgIlJudWJSIiwgIkNvRFZGIiwgIml2bldmIiwgImlhTXdsIiwgIkhmR3VkIiwgInJTckJhIiwgImVLSHVlIiwgIk52UXFmIiwgIk54VlJjIiwgIlNwTXVBIiwgIlFNREVuIiwgIkRxbWVnIiwgIm1wTmZWIiwgIlZxYlR0IiwgIlBiT3lxIiwgIjhXS3VsIiwgInl1cm53IiwgIlFHWFdaIiwgImJhaVlWIiwgIm5kbGViIiwgIk9oamdPIiwgImZiU1VGIiwgIlZKcG9lIiwgIktEU0JPIiwgImtXalVCIiwgIlFUUk9NIiwgIjgxMzAwNzhFRExNRlYiLCAiUmZ6S3EiLCAiR3ZmcGgiLCAiU2tqUXgiLCAibVdocmIiLCAicFdkZkMiLCAiSWtzQlgiLCAiYU5CWUoiLCAiUkVKeVkiLCAidGtqU0kiLCAiTEt3eWIiLCAibEdNSVEiLCAiTVljbk8iLCAia3l2VUgiLCAiSFF3bW8iLCAiVVZuc0kiLCAia1d2ZGIiLCAiYWNSVkMiLCAiREpqY2QiLCAicXhDcksiLCAiTHJiZ0siLCAiZ1FmSnQiLCAieVNvU1ciLCAiTUtnTHIiLCAia3pmQ3MiLCAiSm10RE4iLCAidnhJZmoiLCAiWElEZE0iLCAiRE5zaW4iLCAiQWZQZnYiLCAiTXlKbFIiLCAiZExXWGUiLCAiaFRDRlgiLCAidFl5WUEiLCAiQ3lZWGciLCAiR3BlZ3EiLCAidld0ZWkiLCAiSkJyaVQiLCAiWUhRQkIiLCAiVnBYZVIiLCAiVktkblAiLCAicWxXRUMiLCAieEhDaU0iLCAiR2Ntb0oiLCAiZEpvVkQiLCAiVFNYdE4iLCAiaGZnZWwiLCAiZXJpVlciLCAid3dGanYiLCAiY1dJRUEiLCAid3ZtSGkiLCAidHdtdGkiLCAiSkhqWFoiLCAiZlV2SWgiLCAiaklHZUwiLCAiRGxwSmciLCAiVFNKam0iLCAiaUFERW4iLCAiaENzSk8iLCAiQXhYaVIiLCAiZHFJTVQiLCAiT0ZJRFkiLCAiamVKRlMiLCAiTkVJZFEiLCAiT3dsWnUiLCAiamtuVW0iLCAiQnhCVXciLCAibnJ0S1giLCAiaWRiY1MiLCAiQW9EdEEiLCAicHZKV2oiLCAiZFp6QnQiLCAibWRVcWEiLCAiUFZZSEsiLCAiVHh4WG8iLCAiQVlwZ24iLCAiQUVQS2kiLCAiVHlzb0giLCAicEVEWGgiLCAiVWdWd0MiLCAiZ2xPS3MiLCAiU0RtSHkiLCAiSlNPcWwiLCAiakVMcEsiLCAiRGFFV00iLCAidnhRcnciLCAiUGlKcVciLCAiVmdXSk0iLCAicEllRGsiLCAid3dIZW4iLCAibWVBeWciLCAicEVKck0iLCAicmFNdWwiLCAiYXNmT3YiLCAiTWR4YmQiLCAibm9WTXciLCAiQ1hRcnkiLCAiVXNUTVEiLCAiY3ZuSHgiLCAid3NOYloiLCAib2pEc1giLCAid3FEWFgiLCAiVXd5WVciLCAiMzQ1NjciLCAia0dwamQiLCAiQ1p3QXMiLCAiTkJWd1UiLCAidFNYbVoiLCAiZkxoQVIiLCAiZ0J5RXUiLCAiWGxsS2ciLCAieFhtVnkiLCAibEtpc0giLCAib1dzTHYiLCAid05xZnIiLCAiTmNOT20iLCAiS3lOc3giLCAiY1lGY00iLCAib1FxRXoiLCAiQnVuTmQiLCAiYnBUS2oiLCAiYm1yWUgiLCAiT2doUlciLCAic3ZJTlYiLCAiSW9QbmgiLCAiS0VjS3AiLCAiT21zSW8iLCAidGJVSU4iLCAiaFFiRWsiLCAiTnFTZFkiLCAiQXR0dVgiLCAiS1d6S2IiLCAiYnhFSGwiLCAiZ3dZS2IiLCAiRFNua3IiLCAiWmRNWUsiLCAiZldwcUEiLCAiWlNPVm0iLCAidERTZVgiLCAialZYTnciLCAiZlFOU08iLCAiWnhyV3oiLCAiUGlWb2YiLCAiaFVTUUQiLCAiUXJCRlAiLCAiRnJFcUsiLCAieExVZmEiLCAiWXBHSm0iLCAiWVNCblUiLCAia0d3ZEUiLCAiYmRDeFYiLCAicXpDcksiLCAicEVwSEYiLCAibmZjakwiLCAiY09IU3AiLCAiR2VHWnkiLCAiaXJpYW4iLCAiUXh4RUYiLCAiUkJ1SmgiLCAiTG1leVkiLCAiTklTVm4iLCAiVWdRQWUiLCAiZnNqRWYiLCAiOEZkYkciLCAidFNEWU8iLCAibEh0WW8iLCAibWtrQXEiLCAiempMUXkiLCAiY05YZ2wiLCAiTG9MU24iLCAiZVNlcm8iLCAiVGlNcmwiLCAiaktqalIiLCAiRm9VYW8iLCAiaGtzcGIiLCAibXhIQVciLCAieHBjZmwiLCAic0VISnoiLCAidWdQZ1YiLCAiQ2VaTkwiLCAiSklpalQiLCAiVVZwWnMiLCAidURxV2YiLCAidVREcFAiLCAiRG5aQkIiLCAidFVNZVAiLCAiZmdoaWoiLCAidU9qTkgiLCAiUWp6cVYiLCAiWUFxYWwiLCAicFdBUEMiLCAid2xUTXciLCAidER2ZkIiLCAidGl3UmoiLCAiY1haamsiLCAiWVowMTIiLCAibGprUlMiLCAibVZyc2giLCAiakREcUgiLCAiQWtXQXciLCAiZGRKcG4iLCAiT0VRT2giLCAic2VyUkYiLCAiQUJZUUIiLCAiVW5GbXkiLCAiWUhSSGsiLCAiVlp5dW8iLCAieHRUZ28iLCAiaGFyenMiLCAiYVJjRlEiLCAidnFwZXciLCAiVnJRWmciLCAiZVZ4bHoiLCAiYk9ESXMiLCAiRkVvS1YiLCAiRlJEWGciLCAiS1FUR2MiLCAiWlJqeUkiLCAidERYT1UiLCAiclFNYmMiLCAiWlNzckgiLCAickdTUEEiLCAiSU55aUgiLCAiS1Z6ZmUiLCAibFFreUkiLCAiY3ZjZ2wiLCAiZGxXRU0iLCAiYklpQ2MiLCAiYnFnSWciLCAiT0JUZHkiLCAibVVYVEEiLCAiZGFESU0iLCAiQm5wVmoiLCAibHJ6dmciLCAiZ2pyQmkiLCAiUHZ3enciLCAiUXNRdWkiLCAiT2dBYWciLCAiRVJsTUQiLCAidW1FbGYiLCAicHNXY1kiLCAiRlR6WmgiLCAiaFRCa1AiLCAiZnJsa1IiLCAiY09YelQiLCAiZ3VjbWgiLCAiWGJMUkUiLCAiSE1YZHYiLCAiVVNyeUMiLCAiSkZodW0iLCAiY1FNcE8iLCAibEZwdEMiLCAiTnJFZlkiLCAiQmhBcU0iLCAiUkxFU3IiLCAiWG9vc1EiLCAiY2pwZ3YiLCAiRklpRkIiLCAiR2VaTkQiLCAibWZhd1YiLCAiVEtoV1AiLCAiZmVIWGIiLCAidnVQb0UiLCAiYmN4aU4iLCAiYWRLakIiLCAiNlFXbE4iLCAiQnNLZ1ciLCAiTUxlb00iLCAiRFBWa0ciLCAieEJ6eWgiLCAic0t1YUgiLCAiU3llcUwiLCAiZEtvUVEiLCAiRHdJVmciLCAiVEpiY0giLCAidFNmdXkiLCAiZ1hsdHEiLCAiaUxwaEMiLCAiTFJNSG8iLCAiVkdBbFciLCAiUE9vZU4iLCAibGxtcWMiLCAiVUtCemMiLCAieVJEV2oiLCAibWpVWE4iLCAicUJtQ2siLCAieGxIWVEiLCAiWUhKeXQiLCAiUFZWd1ciLCAiREJHWUQiLCAidUNLYmIiLCAiR05SQ2QiLCAiWkJwYUYiLCAiRWtEcXgiLCAiS0htZ1AiLCAibWVLYmMiLCAiVHNRcFgiLCAiUkNCTlMiLCAiTER0a0MiLCAiVk5IaFMiLCAiYnRZdVUiLCAibVFVc3AiLCAiZUV4VXEiLCAiZldhaksiLCAiUHR1QVkiLCAiS3lCZlMiLCAiQWhsVVoiLCAiWm50Q3giLCAiS2ZWaUQiLCAiRUNDd1kiLCAiUFpUd1MiLCAiVnRuQ0MiLCAiTGVkTWMiLCAiRWxRZXAiLCAifDJ8MCIsICJuYlF4ZiIsICJUWUdTbSIsICJlSE1aeiIsICJnVlVUVyIsICJZVmN0ZyIsICJhZ0VjZiIsICJtR25IVSIsICJ6VWlQbiIsICJRb3lJSyIsICJOdkFRVSIsICJJSlFXQyIsICJSQW9waiIsICJMQnhtVSIsICJkcmNjSyIsICJ4ZG1rbSIsICJVVmhRWiIsICJyV0JzcyIsICJuSkxndCIsICJuTkFDbCIsICJTZ3Z6WiIsICJsWFlqRCIsICJVT1NQcyIsICJ1SGJkYiIsICJydVJBcyIsICJUYlFhaSIsICJlaHl1SyIsICJ2SFZxQSIsICIyOTQxNyIsICJldGthWCIsICJxYU1oTCIsICJ6RG5VVSIsICJ6VmxybSIsICJGTnhhYiIsICJJVElnRyIsICJOVWhKZiIsICJWWGlFdCIsICJyZkpucyIsICJPb0ljciIsICJiS0dZaCIsICJrSHJFTCIsICJtWFhjUiIsICJhdnJRYSIsICJlYXlEciIsICJZcktMcSIsICJ4VmRiTiIsICJTYXJlUSIsICJ3Q3BhbCIsICJod3JUTSIsICJESGR1QiIsICJPY3l4TCIsICJIT09jUSIsICJ5RHFUViIsICJlYkp3TCIsICJKWUx0eSIsICJHRG9qUCIsICJ4UGtZUCIsICJCamFJbCIsICJvWWpCeCIsICIwTGpTUSIsICJwS0tUUiIsICJZdGZVVSIsICJUV2NNcyIsICJYZllnSCIsICJCdGtvUiIsICJUSlRFTyIsICJLVWpPaiIsICJxalFrbSIsICJiZmVPYSIsICJWcEFZSiIsICJGQVlObSIsICJnSVhNUCIsICJHSnJNUiIsICJqTFdrQiIsICJBUXB2UyIsICJhem9UVCIsICJCcnRVaCIsICJ3c1hoUCIsICJSRG5PTCIsICJqYlFYSyIsICJiclVqQyIsICJ5a2RYTyIsICJlc3daSSIsICJWTnRUeCIsICJpSU5OQSIsICJOeXBtRSIsICJQanl2TiIsICJyZUxpSiIsICJ5dWRpTCIsICJlTWNKYiIsICJKT3Z5eCIsICJRd3RJbCIsICJxT25zUCIsICJRS1dOSiIsICJ1SXBwQyIsICJzZkRndyIsICJnWE1aaSIsICJTc2JvZCIsICJqQ09XaiIsICJ2SXVBSCIsICJZc0VidyIsICJ2QVFwQSIsICJRYkdTWCIsICJXdGlXUyIsICJLV2V6RSIsICJFa3RDRiIsICJvcGhKaSIsICJMTW55aSIsICJicGZzWSIsICJrQlppSyIsICJqa3J6SCIsICJJcURMRyIsICJ6REZvSSIsICJ3dkxycSIsICJIbGlhSSIsICJvTnVpViIsICJWTXBQVCIsICJPcHpycSIsICJQc3JidCIsICJDbEZjcCIsICJFeWxDTCIsICJwZkJQdiIsICJpZmxlYSIsICJ0aXNaTSIsICJLQlZMYSIsICJWZ0tyayIsICJSRkVJeSIsICJaT2NrdiIsICJVa2pabiIsICJkaEZFYSIsICJPSklESSIsICIyOTYzNiIsICJ3aWNRdSIsICJKQ0Z3YSIsICJzVU9adyIsICJ4cUx1QSIsICJCVVRycSIsICJvaXNKciIsICJMemVTaSIsICJZRnVKdCIsICJLUXlueSIsICI4WWthYyIsICJzRllWRiIsICJTRllocSIsICI0MkRteiIsICJickhlZyIsICJSbmhTRiIsICJZZXFXeiIsICJEaW5SWSIsICJtbk1ISCIsICJyUVpqVyIsICJUWHNyTiIsICJpb0NGZyIsICJES053SiIsICIyMzExMTBNY2J3UlMiLCAiUWJhWE0iLCAieElaSlYiLCAiT1RZaHkiLCAiZEhSeUIiLCAid1VhbEYiLCAicXFtU1oiLCAicXNTRGgiLCAiQ3Z2am0iLCAiWnZyeWUiLCAiTElxT2EiLCAiUEljTEwiLCAiZllyWUYiLCAiT2ZnbXUiLCAiQmR5SlIiLCAiZ0FSUFUiLCAiT3RHZkUiLCAibXN1R3oiLCAibmdjZnQiLCAiWUVRWEUiLCAiMTIzMDMiLCAiZXVhTEgiLCAiVXV5b2IiLCAiUW1FV2kiLCAieVJSdlQiLCAicFhEemUiLCAiYWFiWkgiLCAib2ZRSUMiLCAiclBMSmkiLCAiQnpWWVgiLCAiUVpGUnAiLCAialJqWEciLCAiUUtoTWQiLCAiWXdsSUwiLCAiZW1TTlYiLCAiRkJCeGIiLCAiVllzRXYiLCAiSUhOUXMiLCAiTHNxZEsiLCAiU0VrTG4iLCAiWWxPd2wiLCAiUUdhSUkiLCAiU1laSlAiLCAiaFNFcGsiLCAiZ2VVZWYiLCAiamxBRUgiLCAiZnVVaFkiLCAiRWpMSnkiLCAick1XUWUiLCAidHpxWEsiLCAiUmd0V2QiLCAiZ3BteUEiLCAieUJIZm0iLCAicEliZFIiLCAiSGJQZ0IiLCAicXdYaUEiLCAiTUFPd0UiLCAibHp0UmIiLCAidUNRckoiLCAiSlBIZWUiLCAicG1QWG8iLCAiWFNtSHIiLCAieUdMbVMiLCAieU5sdU8iLCAiQ2dUVFMiLCAiV2VyVm0iLCAiYnpkSGIiLCAiTm95WE4iLCAicVVXdkwiLCAid1drbm0iLCAiaXZEZm0iLCAiU3VxUEciLCAiVWJUeU0iLCAidmNIdlkiLCAiUERMcGYiLCAiU25BRFYiLCAiU2V3cVUiLCAiQ2NTUkQiLCAiT3ppakoiLCAiR0ZMUWYiLCAiYkpJQm4iLCAiUGNFQ0wiLCAiSW1nTHciLCAiTXJKVGkiLCAiZmVlTWkiLCAiRkx2b3oiLCAiQkVsdUUiLCAiYW5UWXgiLCAiR21YckMiLCAic3NhYU0iLCAiZ0J1TFEiLCAiYWliaGEiLCAiZ2ZCYWEiLCAiS21HQnQiLCAicVZKZG8iLCAibW10cFkiLCAiUlR1ZkMiLCAiSHpWYVgiLCAicWJwQ1YiLCAiT1BRUlMiLCAiWlREV2kiLCAiekpra2QiLCAibmh1UHMiLCAiRmhhY0siLCAiYnVIdmciLCAiQm5yZ2UiLCAiZVFCSkgiLCAiT3B5UHoiLCAidXZ3eHkiLCAiamxQekciLCAiRmFKVXoiLCAiQ0h0VmciLCAiMTgyNDciLCAiUWhwWFUiLCAiT2lGVGUiLCAic0Z2RUMiLCAiaWxiRUYiLCAiYVVVZ0YiLCAiQVZUYWEiLCAiaE1pb1UiLCAiVlNHQnUiLCAiRUtheUwiLCAidlhDR1QiLCAiamx2SmYiLCAibmx3elIiLCAiZnViclUiLCAiQWZnVngiLCAiTE5SR2ciLCAia1BUSnciLCAicHRKZU8iLCAienZlaWUiLCAiT1V4WnYiLCAidVNaaVMiLCAidWxRcE8iLCAiVmRkT3kiLCAidHdyWmMiLCAiTWJnSnEiLCAiVk54c2oiLCAiTFRBdXQiLCAiUHVVdXUiLCAiTkV5ZlEiLCAieUdrTmgiLCAiY2ZuSlUiLCAicW1WRm8iLCAiaklKdW8iLCAiQVdZQU8iLCAiZW5veE8iLCAiSk1ncGoiLCAiRG1wY0siLCAiZE5ldXgiLCAiUnljSk4iLCAiVm14aXIiLCAiU2ZDZm4iLCAiR255enkiLCAieWFYVlAiLCAieFlyWksiLCAiSHFkT0YiLCAiaWJQdGwiLCAiMTAyOTc2OEpYRGNXYyIsICJLQWpVayIsICJTdkl3bCIsICJlbE1GayIsICJ2Q0d2ZiIsICJZb3hlTSIsICJHSlFXRyIsICJueEdrcyIsICJtdllyZSIsICJab0hhYSIsICJOTFNxQSIsICIyNDI2MSIsICJSRm92bCIsICJPVXpjWSIsICJSSVVEaSIsICJPTGZJVyIsICJVemthaiIsICJIZGJ2UiIsICJaUXhLSyIsICJ4dHhmViIsICJxV2FURSIsICJIWHRVSyIsICJZWEpJUiIsICJrd3VrRCIsICJJdWpJWCIsICJoZnVDVSIsICJlbVVsaSIsICJaUENZaSIsICJyWWVqZCIsICJPZUxSQyIsICJWSXRmTyIsICJIeVd0UiIsICJzaXhHWSIsICJsQ1dwTiIsICJqY1BYYyIsICJYa1dFcCIsICJsbmlzTCIsICJnQ2h1USIsICJDVUZ3biIsICJmS29zeSIsICJ0UmN6YiIsICJlZnp3QiIsICJnREVSUiIsICJaZXdMeCIsICJoWGRIcCIsICJETmZkRCIsICIyODI2NjY1RExLQ2lYIiwgIkdWYmxkIiwgImtPY0dXIiwgImRLcG92IiwgImVuWVBkIiwgImltVk1HIiwgIlhuYUpyIiwgIk5BWUJ1IiwgIk5SVEdEIiwgImtPc2lPIiwgIkRzeWpwIiwgIkludmh6IiwgIlhYQVFlIiwgInFuRFFuIiwgIlB1dWJlIiwgIlVEaFdBIiwgImxDbmRWIiwgIllhY3hUIiwgImhOV2xPIiwgIkpYeWlBIiwgIlNibnR3IiwgIkNPSEN3IiwgIllremRYIiwgIm9tbkNYIiwgImt6TVdlIiwgInRqcUxJIiwgImpmRkFRIiwgImtsRWZHIiwgIklxTkZ5IiwgIlRkWnh0IiwgIlF2enVVIiwgIlZsVGF1IiwgIkxwbExIIiwgIlpvdEJ6IiwgIlJ3QmR3IiwgIklRcVpTIiwgIkVDd2tDIiwgImxUVkNmIiwgInloTnZFIiwgImdEalNWIiwgImlEamlHIiwgIjhScmhJIiwgInpUSEpGIiwgIndIeEpuIiwgIkxVTHhNIiwgIm5CRHpWIiwgIml4bHhPIiwgIlFiRGZtIiwgInBxcnN0IiwgIlRwWnhuIiwgImFnTGtFIiwgIndRa0xsIiwgInRtRkRnIiwgIllJRU5wIiwgIndQTnR4IiwgInNCaENBIiwgImFQbkROIiwgIkxwa0t3IiwgIlB0VGZhIiwgIm50QlZ6IiwgImVXWWZFIiwgIm1nb2ZRIiwgInJ3QndwIiwgIklYdlFwIiwgIndrRXdMIiwgImZEa0N2IiwgIkZnR2FzIiwgInBCZlFLIiwgIk1iRGpRIiwgIkVSSk5PIiwgImVGTGRXIiwgInhpb1RjIiwgIm50THNjIiwgIk9YV0VrIiwgImhzZmNRIiwgIjIwNjQ5IiwgImpiWk1iIiwgInh4UGhPIiwgIm1DU1lBIiwgIm9Hb2JEIiwgIkFyS1duIiwgInROTU9QIiwgImtqVHFoIiwgInVTeGxJIiwgImhwZ1dpIiwgImJ4TVdGIiwgIkRjcGZPIiwgImpFVGptIiwgImpJYnZPIiwgInNMdW1XIiwgImpnSmptIiwgInVEQlFuIiwgIlBpS0tCIiwgIkhORFduIiwgInJ1Y3RvIiwgIllDdEdxIiwgIm5JbURMIiwgIlRtdFF4IiwgIlpva2hTIiwgIm9QZkRVIiwgImNYbHNyIiwgInVjb1NmIiwgIktOYmluIiwgIikrKSspIiwgIjYwYmhQIiwgIkVkeXRNIiwgIlppeGtSIiwgImt6RmZHIiwgIkpNVHBjIiwgInJzZmlUIiwgIkVhY1hwIiwgIklIeFJVIiwgInRuWWpRIiwgIkJCV25BIiwgIk5MVHNOIiwgIkJ2WGFXIiwgIldzd0VTIiwgImd1ZWpNIiwgInBqWGl2IiwgIktndnVWIiwgInZTdXhnIiwgImhydFNkIiwgIjk4Nzg4IiwgImVNRFpDIiwgInVFenVLIiwgImlMUmhKIiwgIkxtUE5pIiwgIlhXbWR3IiwgIlh3cVdqIiwgImdOUVN2IiwgInFkTVJNIiwgImtUd0lLIiwgImhvZGxZIiwgInlvamJWIiwgIk9BdEh6IiwgIkdqRE9CIiwgImFqaU5QIiwgIlRtelNBIiwgImp2THJPIiwgImJ4UVFwIiwgIlFISkFjIiwgIlBCemloIiwgImdQbUlrIiwgIm9XYldYIiwgInZkSkxRIiwgImhMVlFSIiwgInlzT0V5IiwgIkJNQk9JIiwgIkxrWFJ0IiwgIkNEWUFaIiwgIkZua3VCIiwgInZqckRPIiwgImdpTmRyIiwgImF3UmNGIiwgIkxFbWFWIiwgIlRFWlRZIiwgIlZzY3FJIiwgIlNKRktHIiwgInh3cVJqIiwgImR1SnpnIiwgIkhJTlBsIiwgIkl2aUpZIiwgIlpjeUJZIiwgImZWSkZVIiwgIlZNbnJOIiwgIkhYam1VIiwgImh6UmdzIiwgIll1cE5HIiwgImtlTU1YIiwgIm90Z2tVIiwgIm9FSW9OIiwgInVzclRTIiwgInBXZU5rIiwgIlJ5RG9BIiwgInd2akVxIiwgIm1mV1pWIiwgIlltd2pKIiwgInphbVhiIiwgInhzUUxlIiwgIkNDSktGIiwgImRTd0x5IiwgImV2RHl3IiwgIlhqZW9tIiwgIlVEUFhxIiwgIk5NZFdKIiwgImdFVG9VIiwgIm5waHVZIiwgImlna2V0IiwgIm55R3lvIiwgIkNyWU55IiwgIm1Ba1FtIiwgIkdRZ29aIiwgIk5NRHJwIiwgIkVQbXVvIiwgIkV6SVJ1IiwgIkZ3TGlVIiwgIkJwbUtJIiwgIjV1TWNhIiwgIlhneE94IiwgImFYSnRIIiwgImZnRGJvIiwgIlpZSGVmIiwgIkRvbFZDIiwgInViVWNTIiwgIktLTUNaIiwgIklsWHlkIiwgIndjeVltIiwgIlhqc2dlIiwgImphTEtVIiwgIlhoVU1XIiwgIkZaVlhOIiwgInpOd2JnIiwgImFYaU9xIiwgIkxhR1ZOIiwgIkxIeE5lIiwgInpuakd6IiwgIlNFQkd1IiwgIk1vT1J4IiwgIldOelVKIiwgIkpiS1B1IiwgIktpdWdVIiwgImdDdnl5IiwgImp4WWl3IiwgIm94ekdUIiwgIlpzbGp2IiwgIkZNUUllIiwgIkxXR3dQIiwgIkV0ayIsICJDZUlCeSIsICJidk5abCIsICJ1R2h4eiIsICJneEFUSiIsICJjeVJPbCIsICJwdXNoIiwgInhGZUtVIiwgInVVZWlDIiwgIlFNcGRyIiwgIndxUnd0IiwgInRLcEtlIiwgIlBhU2RmIiwgInZ2RE9SIiwgIk9NVHVWIiwgIkNTUVRSIiwgInlFeXZLIiwgIkpDaGdlIiwgIlVIdE1jIiwgIkhQRktxIiwgImxxRXJjIiwgIkpkREp3IiwgImxUZmxiIiwgIlZoaUFjIiwgIm50Y3J6IiwgImVZUkpjIiwgIlV1S2ZYIiwgIkthclJiIiwgIllUWERVIiwgIm9UVWdKIiwgIm9ydmtwIiwgIlBDZ3ZLIiwgIlJNUGxBIiwgImhmc3Z1IiwgIkFVekp4IiwgIm16cUN1IiwgIlBnSmVwIiwgInptV3huIiwgInphRUlVIiwgIkNSS1Z2IiwgIm9rbFp0IiwgImZTS1dmIiwgIldZdmtJIiwgInhJZ2hLIiwgImNCTE5hIiwgIkp4eXphIiwgIlNLQ2dWIiwgInlQSWNhIiwgIlBlRnJSIiwgIkREd3ZGIiwgImR3SHF4IiwgIlFQTGF1IiwgInhHRFFRIiwgIkFpeXN6IiwgIlBCWnJLIiwgIlN5SWZrIiwgImhmek1VIiwgIkNTSmJ4IiwgInZPb1BiIiwgImxOcGpiIiwgIlB6Q1JhIiwgImpaUWdnIiwgIlNiamVTIiwgIjM1SGhKIiwgIm5qRU5CIiwgImdLU0t3IiwgIktJU0lzIiwgInh0b3RDIiwgImRmaWplIiwgInlkb0NmIiwgIk5qdnpmIiwgInZ5UmFkIiwgIlRvS3JSIiwgInhwcGRvIiwgIkRlcmx5IiwgInpBUE5DIiwgInJ6UWViIiwgIm9lcGRCIiwgInpTU0xpIiwgIlFaTHJRIiwgImlTeWt6IiwgInZlbGdiIiwgInhWcWREIiwgImxXaVB6IiwgImVLRXpOIiwgImVaQ01YIiwgImhzdGxoIiwgIkZyZWZ1IiwgIkxQYUlrIiwgImFwcGx5IiwgInlRUlBCIiwgIkxOektPIiwgIndjU1BpIiwgIlRzeGlrIiwgImlpRU9RIiwgIkVIUmRRIiwgInd0YmpuIiwgInR1YXVjIiwgImlCTE5GIiwgIm53T0FYIiwgIjVNQ0hRIiwgIlBIWWlmIiwgInpXcE11IiwgIktISHFkIiwgIlhnWW1rIiwgImZqekdaIiwgIlZMdEtHIiwgIkNtWEVUIiwgIkxTYnhTIiwgIk55b2VuIiwgIk5ZU0ZQIiwgIm52aEhnIiwgIktwZlRSIiwgIlpzcUR2IiwgIm9aaUpDIiwgInpqVGRsIiwgInY3VHoyIiwgIllISUxNIiwgInlzTFRaIiwgIkV3bHlZIiwgImxWVERtIiwgIm9ueGNLIiwgIm52WlVRIiwgIlhjcEJOIiwgImhyaUpSIiwgIkVYUE9xIiwgIlFHRGN6IiwgIlloZ2NaIiwgIlVCdXdiIiwgIkxtRXB4IiwgIml5Q0ZIIiwgImFWTmRpIiwgInhXdlFaIiwgIlZEdmZlIiwgIkNBbmNQIiwgImJDd25oIiwgIll1aFhBIiwgIm1Hb1J6IiwgImFnekJPIiwgIkdlTHZkIiwgIm1XcHlNIiwgIlVqTUR3IiwgImF1YWVMIiwgImxlUVZVIiwgIndRQnlDIiwgImFEbWJhIiwgIlVITXNoIiwgIlJuQlZYIiwgImZVRGdmIiwgImx3UWJaIiwgIlZEYlBlIiwgIkNjSGRKIiwgImREZ3hEIiwgIk5zeCIsICJ3Q05QSiIsICJDY3VGdiIsICJIYXJjZyIsICJZa25oTCIsICJxU3ZkbyIsICJIaGVPYiIsICJGYmliSyIsICJPRnJsQyIsICJEV2NudiIsICJQb2ZBZSIsICJaRmJBcSIsICJ0ZW9lSSIsICJqdGF4SiIsICJXUndLUiIsICJKbU12aCIsICJKYWd3bSIsICJLaGhDcyIsICJKWm5mTSIsICJuQk9hViIsICJtUnhEcCIsICJNaVppUSIsICJYaUJrVyIsICJ4Y1lhbyIsICJQVlpVWiIsICJNSUpxTyIsICJObnhVYiIsICJhcUVpeiIsICJyRFNwdiIsICJjd0ZBViIsICJRRGZ5dSIsICJCVFlHcCIsICJUbUVvWSIsICJzYVRCdiIsICJqUXhPeCIsICJJa2dZaSIsICJVdkpaZiIsICJ3S3ZLQSIsICJVYWpQUSIsICJrSHRhSCIsICJEVU1ZcyIsICJmV0FUeCIsICJMQm1mUSIsICJIcFZqeiIsICJNc0hnYiIsICJ1b1VHRCIsICJDRXBsQSIsICJSdURzaiIsICJYbXdnTCIsICJqUkF2ViIsICJIU3NLYiIsICJkUWdXZCIsICJCQmxXciIsICJlaUJVVSIsICJWbGpJaiIsICJoUVZuRSIsICJlY0ZyQiIsICJEakNVUiIsICJDT21aYyIsICJ5QXR4VSIsICJ6bVV6ViIsICJGZEN5WSIsICJGTnNBcyIsICJsRmlwSSIsICJRWWhzbSIsICJDdFRteCIsICJ5R0pJYyIsICJLWFhOaiIsICJTdmd0YiIsICJvS2lHdCIsICJVaUdweCIsICJaZ3RUSiIsICJyYWZMUSIsICJ1bmZXVCIsICJzREtHUCIsICJZUEZuUSIsICJEQnJZQiIsICJoVE94RyIsICJHc2lxUSIsICJpQUpuSiIsICJQVm1qUyIsICJuYlhvZSIsICJLUXRZZCIsICJSdXROQiIsICJ5Z1RSViIsICJKYXN6WCIsICJBa05VayIsICJVc2FhRCIsICJyaUFEdyIsICJHT3RvZSIsICJLaWVoYiIsICJwUldPTCIsICJab0VVWiIsICJOeUJ3YiIsICJJYVR4TCIsICJPZXFySSIsICJ5a3lOQyIsICJWdkxJRCIsICJRd09pRSIsICJ0V3VXViIsICJnS2hmaiIsICJ6V2FrYSIsICJzdFpyYiIsICJsRGtWSSIsICJOZk5FVCIsICJVRmtBRyIsICJ3RHV1biIsICJwSUJicyIsICJIakxLUCIsICJqU1FCdSIsICJzY3JKQiIsICJBQVdOQiIsICJvZ3R0ViIsICJ2WFJORSIsICJ3aHBqQiIsICJGeVZOayIsICJRUGhNTSIsICJBeGliRyIsICJESmZBRCIsICJGa1dTYiIsICJGU1FHSiIsICJBRFpoTCIsICIxbGNlViIsICJvaGFLZSIsICJ2YVlwdyIsICJCcXpRRCIsICJEZ1htSCIsICJsU2Z6SCIsICJhelNnVyIsICJaaWJwRCIsICJma090WSIsICJEVUN5SiIsICJtQ0FDVyIsICJwblZhdiIsICJXZkd0WCIsICJmYWptZyIsICJNRHBDRyIsICJSbGtuVyIsICI3MTgwNSIsICJYWHJHdCIsICJ3eHRvaiIsICJqZWxlUyIsICI0NTcyMiIsICJ2RXFGaSIsICJwcmVBaCIsICJGQU9JcSIsICJ3R0ZhZCIsICJranVnUyIsICJHdWpQeCIsICJMSmVKUCJdOyByZXR1cm4gKFIgPSBmdW5jdGlvbiBSKCl7IHJldHVybiBuOyB9KSgpOyB9ISBmdW5jdGlvbigpeyBmdW5jdGlvbiBuKG4sIHIpeyByZXR1cm4gdShyIC0gMTczLCBuKTsgfSBmdW5jdGlvbiByKG4sIHIsIHQpeyByZXR1cm4gdShyIC0gODUxLCB0KTsgfSBmb3IgKHZhciB0ID0gUigpOzspIHRyeSB7IGlmICgzMjkzNTQgPT0gLXBhcnNlSW50KHIoMCwgMTY3NiwgMTcwNykpICogKC1wYXJzZUludCh1KDc4NywgMTYzKSkgLyAyKSArIC1wYXJzZUludChyKDAsIDIzNDgsIDMwNjEpKSAvIDMgKyBwYXJzZUludCh1KDMxMDMsIDM1NzcpKSAvIDQgKiAoLXBhcnNlSW50KG4oMjk1MywgMjcwNikpIC8gNSkgKyAtcGFyc2VJbnQodSgxNzgwLCAxMTI4KSkgLyA2ICsgLXBhcnNlSW50KHUoNTk4LCAzMjIpKSAvIDcgKiAoLXBhcnNlSW50KHIoMCwgMzMzOCwgMzAyMCkpIC8gOCkgKyBwYXJzZUludCh1KDExMDksIC0zMjEpKSAvIDkgKiAoLXBhcnNlSW50KHIoMCwgMzE4MCwgMzk3MikpIC8gMTApICsgcGFyc2VJbnQobigxNzQ0LCAyMDM0KSkgLyAxMSkgYnJlYWs7IHQucHVzaCh0LnNoaWZ0KCkpOyB9IGNhdGNoIChuKXsgdC5wdXNoKHQuc2hpZnQoKSk7IH0gfSgpOyB2YXIgbSA9IGZ1bmN0aW9uKCl7IGZ1bmN0aW9uIGEobiwgciwgdCwgZSwgaSl7IHJldHVybiB1KGkgLSAtNzI5LCByKTsgfSB2YXIgdiA9IHsgV3FQZGE6IGZ1bmN0aW9uIFdxUGRhKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgQmR5SlI6IGZ1bmN0aW9uIEJkeUpSKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIEhIRHZwOiBmdW5jdGlvbiBISER2cChuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIE5FeWZROiB1KDI4MDAsIDIxMTgpLCBrb3JZbzogZnVuY3Rpb24ga29yWW8obiwgdSl7IHJldHVybiBuICE9PSB1OyB9LCBzTHVtVzogdSgxMDY4LCAtMzk2KSwgY0JMTmE6IHUoMjYxMSwgMTczMCksIFBvZkFlOiB1KDExMDUsIDg2NyksIEdZT1JlOiB1KDEzMzQsIDExMzYpIH07IHZhciBwID0gITA7IGZ1bmN0aW9uIHMobiwgciwgdCwgZSl7IHJldHVybiB1KGUgLSAzODIsIHQpOyB9IGZ1bmN0aW9uIGwobiwgciwgdCl7IHJldHVybiB1KG4gLSAtNDMxLCB0KTsgfSByZXR1cm4gZnVuY3Rpb24odCwgZSl7IGZ1bmN0aW9uIGkobiwgcil7IHJldHVybiB1KG4gLSAtMzA5IC0gMTAwLCByKTsgfSB2YXIgZiA9IHsgY0pDRE06IGZ1bmN0aW9uIGNKQ0RNKG4sIHIsIHQpeyByZXR1cm4gdlt1KDE2MzIsIDYwNSldKG4sIHIsIHQpOyB9LCBHbVhyQzogZnVuY3Rpb24gR21YckMobiwgcil7IHJldHVybiB2W3UoMjM0MywgMjQ3OSldKG4sIHIpOyB9LCBpQkxORjogZnVuY3Rpb24gaUJMTkYobiwgciwgdCl7IHJldHVybiB2W3UoMTYzMiwgMjkwNyldKG4sIHIsIHQpOyB9LCBmdGx5UDogZnVuY3Rpb24gZnRseVAobiwgcil7IHJldHVybiB2W3UoODMxLCA3NjYpXShuLCByKTsgfSwgc1llUGE6IHZbaSgyMjYwLCAzMzcxKV0sIEtndnVWOiBmdW5jdGlvbiBLZ3Z1VihuLCB1KXsgcmV0dXJuIHZbaSgxNjYzIC0gMjgyLCA5OTUpXShuLCB1KTsgfSwgeEhacU46IHZbcigyOTg0LCAwLCAwLCAzMzIxKV0sIHZTUnJNOiB2W24oMzE1NCwgMCwgMjEyNildIH07IGZ1bmN0aW9uIG4obiwgdSwgcil7IHJldHVybiBzKDAsIDAsIHIsIG4gLSAtMzIpOyB9IGZ1bmN0aW9uIHIobiwgdSwgciwgdCl7IHJldHVybiBsKHQgLSAxMTMwLCAwLCBuKTsgfSBmdW5jdGlvbiBjKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gcygwLCAwLCBlLCByIC0gLTc4Myk7IH0gaWYgKHZbYygwLCAwLCA0MzAsIDAsIC02MjApXSh2W2koMjcxNCwgMTcyMSldLCB2W3IoMTk4LCAwLCAwLCAxMjMxKV0pKSByZXR1cm4gZlthKDAsIDMyNTcsIDAsIDAsIDMyNzEgLSA5MjApXShlLCBmLCBvKTsgdmFyIG8gPSBwID8gZnVuY3Rpb24oKXsgZnVuY3Rpb24gbihuLCB1LCByKXsgcmV0dXJuIGkociAtIDkxMCwgbik7IH0gZnVuY3Rpb24gdShuLCB1KXsgcmV0dXJuIGkobiAtIDQ5MiwgdSk7IH0gaWYgKCFmW24oMjY5MSwgMCwgMTk1NyldKGZbbigxODU3LCAwLCAxODAxKV0sIGZbbig3ODEsIDAsIDE4MDEpXSkpIHJldHVybiBmW3UoMzE0MSwgMjM4MCldKGUsIGZbdSgyNzAwLCAyOTIzKV0oZiwgMjkpLCBvKTsgaWYgKGUpeyBpZiAoZltjKDAsIDAsIDIyNTEsIDAsIDI5MzEpXShmW3UoMTY4MiwgMTU2NCldLCBmW24oMjI3OCwgMCwgMjM3MyldKSl7IHZhciByID0gZVt1KDMxMzIsIDQyMDcpXSh0LCBhcmd1bWVudHMpOyByZXR1cm4gZSA9IG51bGwsIHI7IH0gcmV0dXJuIGZbYygwLCAwLCAyMTc4IC0gMTYyLCAwLCAzMjQ5KV0odCwgZSk7IH0gfSA6IGZ1bmN0aW9uKCl7fTsgcmV0dXJuIHAgPSAhMSwgbzsgfTsgfSgpLCBwID0gbSh0aGlzLCBmdW5jdGlvbigpeyBmdW5jdGlvbiBuKG4sIHIsIHQsIGUpeyByZXR1cm4gdShuIC0gLTY1MiwgZSk7IH0gdmFyIHIgPSB7fTsgZnVuY3Rpb24gdChuLCByKXsgcmV0dXJuIHUociAtIC05MzgsIG4pOyB9IHJbdSgyMzMyLCAxMzE2KV0gPSB1KDU5NSwgMTcwNikgKyB1KDI2MzYsIDIwODQpICsgIiskIjsgcmV0dXJuIHBbbigxMzksIDAsIDAsIDE0MjMpICsgdCgxNTg1LCA1MjgpXSgpW24oMTYyLCAwLCAwLCAxNDI3KSArICJoIl0oclt1KDIzMzIsIDI2MjcpXSlbdSg3OTEsIDE3MzUpICsgbig4MTQsIDAsIDAsIC01MDQpXSgpW3UoNTUxLCAxODAzKSArIHQoMTU5NSwgMTY4OSkgKyAiciJdKHApW3QoLTkwNiwgLTEyNCkgKyAiaCJdKHJbdCgxMzg0LCAxMzk0KV0pOyB9KTsgZnVuY3Rpb24gdShuLCByKXsgdmFyIHQgPSBSKCk7IHJldHVybiAodSA9IGZ1bmN0aW9uIHUobiwgX3UpeyByZXR1cm4gdFtuIC09IDQ4OV07IH0pKG4sIHIpOyB9IGZ1bmN0aW9uIGRlY3J5cHQocil7IGZ1bmN0aW9uIFIobiwgciwgdCwgZSwgaSl7IHJldHVybiB1KGUgLSAtOTUxLCBpKTsgfSB2YXIgUyA9IHsgeEZlS1U6IGZ1bmN0aW9uIHhGZUtVKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgZ0J1TFE6IGZ1bmN0aW9uIGdCdUxRKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgWlFmbHc6IHUoMTg3OCwgMjI0NiksIEtKVElUOiBmdW5jdGlvbiBLSlRJVChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIE9YWEtJOiBmdW5jdGlvbiBPWFhLSShuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIEVkeXRNOiB1KDgyMSwgNjM5KSwgeEFmS1I6IGZ1bmN0aW9uIHhBZktSKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIFN5SWZrOiBmdW5jdGlvbiBTeUlmayhuLCB1KXsgcmV0dXJuIG4gIT09IHU7IH0sIGFQdnpKOiB1KDMwNjUsIDQzMTEpLCBoaE14UTogZnVuY3Rpb24gaGhNeFEobiwgdSwgciwgdCl7IHJldHVybiBuKHUsIHIsIHQpOyB9LCBDZFhZTTogZnVuY3Rpb24gQ2RYWU0obiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBuKHUsIHIsIHQsIGUsIGkpOyB9LCBBdHpQSTogZnVuY3Rpb24gQXR6UEkobiwgdSl7IHJldHVybiBuIC0gdTsgfSwgdWdQZ1Y6IGZ1bmN0aW9uIHVnUGdWKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgaE9LTHM6IHUoMzA2MSwgMzk5NyksIElQQWN0OiB1KDU1MywgMTIyMiksIERnWG1IOiBmdW5jdGlvbiBEZ1htSChuKXsgcmV0dXJuIG4oKTsgfSwgUklVRGk6IGZ1bmN0aW9uIFJJVURpKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgakdvanI6IHUoMTMyMCwgMjc5KSwgRGluUlk6IGZ1bmN0aW9uIERpblJZKG4sIHUpeyByZXR1cm4gbiA9PSB1OyB9LCBvZ21CTjogZnVuY3Rpb24gb2dtQk4obiwgdSl7IHJldHVybiBuICsgdTsgfSwgeW9qUmo6IGZ1bmN0aW9uIHlvalJqKG4sIHUpeyByZXR1cm4gbiArIHU7IH0sIFpTc3JIOiBmdW5jdGlvbiBaU3NySChuLCB1KXsgcmV0dXJuIG4gKyB1OyB9LCBteEhBVzogZnVuY3Rpb24gbXhIQVcobiwgdSl7IHJldHVybiBuICogdTsgfSwgdVVlaUM6IGZ1bmN0aW9uIHVVZWlDKG4sIHUpeyByZXR1cm4gbih1KTsgfSwgRUVzdVY6IGZ1bmN0aW9uIEVFc3VWKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgb3Z4emo6IGZ1bmN0aW9uIG92eHpqKG4sIHUpeyByZXR1cm4gbiAvIHU7IH0sIG5OQUNsOiBmdW5jdGlvbiBuTkFDbChuLCB1KXsgcmV0dXJuIG4odSk7IH0sIERXY252OiBmdW5jdGlvbiBEV2NudihuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIHd0YmpuOiBmdW5jdGlvbiB3dGJqbihuLCB1KXsgcmV0dXJuIG4gLyB1OyB9LCBocnRTZDogZnVuY3Rpb24gaHJ0U2QobiwgdSl7IHJldHVybiBuKHUpOyB9LCBmS1pCYzogZnVuY3Rpb24gZktaQmMobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBiemJlTzogZnVuY3Rpb24gYnpiZU8obiwgdSl7IHJldHVybiBuIC8gdTsgfSwgUUxSU0c6IGZ1bmN0aW9uIFFMUlNHKG4sIHUpeyByZXR1cm4gbih1KTsgfSwgelFJZEs6IGZ1bmN0aW9uIHpRSWRLKG4sIHUpeyByZXR1cm4gbih1KTsgfSwgVUNMbEI6IGZ1bmN0aW9uIFVDTGxCKG4sIHUpeyByZXR1cm4gbiAvIHU7IH0sIFNKRktHOiBmdW5jdGlvbiBTSkZLRyhuLCB1KXsgcmV0dXJuIG4gLyB1OyB9LCBJdmlKWTogZnVuY3Rpb24gSXZpSlkobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBweHpSVzogZnVuY3Rpb24gcHh6UlcobiwgdSl7IHJldHVybiBuIC8gdTsgfSwgUUpmYXU6IGZ1bmN0aW9uIFFKZmF1KG4sIHUpeyByZXR1cm4gbih1KTsgfSwgTVdZZ3Y6IGZ1bmN0aW9uIE1XWWd2KG4sIHUpeyByZXR1cm4gbiAqIHU7IH0sIGN5TVRFOiBmdW5jdGlvbiBjeU1URShuLCB1KXsgcmV0dXJuIG4gLyB1OyB9LCBEZ3NQaTogZnVuY3Rpb24gRGdzUGkobiwgdSl7IHJldHVybiBuKHUpOyB9LCBrT2NHVzogZnVuY3Rpb24ga09jR1cobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBMV0d3UDogZnVuY3Rpb24gTFdHd1AobiwgdSl7IHJldHVybiBuKHUpOyB9LCB6cWxiczogdSg2MjAsIC0xNTMwKSwgS0poZFE6IHUoMTU4NiwgMjgxNiksIFltd2pKOiB1KDYzOCwgMTA4OCksIExvTFNuOiBmdW5jdGlvbiBMb0xTbihuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIFZwWGVSOiBmdW5jdGlvbiBWcFhlUihuLCB1KXsgcmV0dXJuIG4gIT09IHU7IH0sIGxDbmRWOiB1KDExODQsIC01NjUpLCBsRnB0QzogZnVuY3Rpb24gbEZwdEMobil7IHJldHVybiBuKCk7IH0sIExOYVhVOiBmdW5jdGlvbiBMTmFYVShuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIG5qRU5COiB1KDI3MTksIDMxNzIpLCBkZ0N2ejogdSgxMzUwLCAxMjQwKSwgYWdMa0U6IGZ1bmN0aW9uIGFnTGtFKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbih1LCByLCB0LCBlKTsgfSwgc3RacmI6IGZ1bmN0aW9uIHN0WnJiKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgVkZiWFY6IGZ1bmN0aW9uIFZGYlhWKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgTFREc1c6IGZ1bmN0aW9uIExURHNXKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgT0ZybEM6IGZ1bmN0aW9uIE9GcmxDKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgTUtTUFI6IGZ1bmN0aW9uIE1LU1BSKG4sIHUpeyByZXR1cm4gbiAhPT0gdTsgfSwgWGhVTVc6IHUoNzgwLCAxMjEpLCBaUmp5STogdSgxODcyLCAzNTA3KSwgUFZWd1c6IGZ1bmN0aW9uIFBWVndXKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgcmJ6RXU6IHUoMTQxMSwgNzgpLCBKWUx0eTogZnVuY3Rpb24gSllMdHkobiwgdSl7IHJldHVybiBuID09PSB1OyB9LCBUQkFXYTogdSgzMDMzLCAxNzg2KSwgTHNTRXc6IGZ1bmN0aW9uIExzU0V3KG4sIHUpeyByZXR1cm4gbih1KTsgfSwgTFRKS0k6IGZ1bmN0aW9uIExUSktJKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIGlkYmNTOiB1KDcyMywgMjMxKSwgVktkblA6IHUoMTg4OCwgNDAzOCksIGlsc2tOOiBmdW5jdGlvbiBpbHNrTihuLCB1KXsgcmV0dXJuIG4gLyB1OyB9LCBFSnJudzogZnVuY3Rpb24gRUpybncobiwgdSl7IHJldHVybiBuID09PSB1OyB9LCBDdUNBVzogdSgxNzYwLCAzMDU5KSwgaE1pb1U6IHUoMjQ3NSwgMTQyNyksIHZpa0NNOiBmdW5jdGlvbiB2aWtDTShuLCB1KXsgcmV0dXJuIG4odSk7IH0sIG1zdUd6OiB1KDE3MDEsIDM1MCksIGpiWk1iOiB1KDMwMTAsIDUxMjgpLCBCdGtvUjogZnVuY3Rpb24gQnRrb1IobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBuKHUsIHIsIHQsIGUsIGkpOyB9LCBPaUZUZTogZnVuY3Rpb24gT2lGVGUobiwgdSl7IHJldHVybiBuID09PSB1OyB9LCBPaUZQVzogdSgyMzk1LCA4MjcpLCBNc1V2TzogZnVuY3Rpb24gTXNVdk8obiwgdSl7IHJldHVybiBuIC0gdTsgfSwgeUF0eFU6IGZ1bmN0aW9uIHlBdHhVKG4sIHUpeyByZXR1cm4gbiAhPT0gdTsgfSwgRmRDeVk6IHUoMjgwMSwgMjg2OSksIFhIU3NLOiBmdW5jdGlvbiBYSFNzSyhuLCB1KXsgcmV0dXJuIG4odSk7IH0sIGFLcG1EOiBmdW5jdGlvbiBhS3BtRChuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIEJMSHJXOiB1KDEzODUsIDI4MTYpLCBqSWJ2TzogZnVuY3Rpb24gaklidk8obiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBvcXhsejogZnVuY3Rpb24gb3F4bHoobiwgdSl7IHJldHVybiBuIC8gdTsgfSwgalJBdlY6IHUoMTg0OCwgMTY1MiksIGt6TVdlOiB1KDIwMzEsIDIyMjkpLCBPc2ZYSTogZnVuY3Rpb24gT3NmWEkobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCB6UlpVVzogdSgyNDc0LCAzNzMyKSwgZ1BtSWs6IHUoMTg4MywgMTYyNiksIGt6ZkNzOiBmdW5jdGlvbiBremZDcyhuLCB1KXsgcmV0dXJuIG4odSk7IH0sIGhiSUJ3OiBmdW5jdGlvbiBoYklCdyhuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIHVGZXVNOiB1KDExNjUsIC00MDEpLCBvcnJUbDogdSgyMDA2LCAyMjU5KSwgY2FKUG46IGZ1bmN0aW9uIGNhSlBuKG4sIHUpeyByZXR1cm4gbiAqIHU7IH0sIE1aVU94OiB1KDIyMDAsIDM1NjMpLCBodWRwaTogdSgyNjI2LCA2MzEpLCBPbXNJbzogZnVuY3Rpb24gT21zSW8obiwgdSl7IHJldHVybiBuKHUpOyB9LCBnQnlFdTogdSgyNTU1LCAyNDQ0KSwgRXNvYW86IHUoMTg3MCwgMjE1MyksIGdKRW50OiB1KDI3NTYsIDQ1NTApLCBzZkFMSjogZnVuY3Rpb24gc2ZBTEoobiwgdSl7IHJldHVybiBuKHUpOyB9LCBTUWRLSTogdSgzMDUzLCAxMDI2KSwgWmN5Qlk6IHUoMjU1OSwgMjE2NSksIEJaSVRBOiB1KDE2NjQsIDI3NzIpLCB2SExNTzogdSgyMTc3LCAzNzMwKSwgemdueXc6IHUoODkwLCAxOTgxKSwgYXRVd0o6IHUoMTM5MywgMjIxMSksIEFpeXN6OiBmdW5jdGlvbiBBaXlzeihuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIFpHWUtyOiB1KDE1MzYsIDEyNjQpLCBIR0lLSzogdSg3MzAsIDg4NCksIEpYeXRGOiB1KDExNjMsIDI0OTUpLCBBVU1GeDogdSg4NTMsIDIyOTgpLCBaeHZTdDogZnVuY3Rpb24gWnh2U3Qobil7IHJldHVybiBuKCk7IH0sIE5PR2FSOiBmdW5jdGlvbiBOT0dhUihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIG4odSwgciwgdCwgZSk7IH0sIEhDenBBOiB1KDMwMTgsIDQ5ODgpLCBlV0VEYzogdSgxODQ2LCAzNzUpLCBqTUh2VTogZnVuY3Rpb24gak1IdlUobiwgdSl7IHJldHVybiBuID09PSB1OyB9LCBjSUxhSTogdSgyMDgzLCA0MTc0KSwgSFNzS2I6IHUoMTg4NywgMjAyNCksIFlISUxNOiBmdW5jdGlvbiBZSElMTShuLCB1KXsgcmV0dXJuIG4gPT0gdTsgfSwgdHdVTUc6IGZ1bmN0aW9uIHR3VU1HKG4sIHUpeyByZXR1cm4gbiArIHU7IH0sIENPY2RSOiBmdW5jdGlvbiBDT2NkUihuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIEVLYXlMOiBmdW5jdGlvbiBFS2F5TChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIGlTeWt6OiBmdW5jdGlvbiBpU3lreihuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCBnc09JdDogdSg4NTQsIDgwOSksIHVFenVLOiB1KDE2NDQsIDMxNjApLCBjWmxCczogZnVuY3Rpb24gY1psQnMobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBwRHVMUTogdSgyMTU4LCAyMzgxKSwgS3lOc3g6IHUoMTMyNywgMTc3OCksIGhyaUpSOiBmdW5jdGlvbiBocmlKUihuLCB1KXsgcmV0dXJuIG4odSk7IH0sIEtNREpsOiBmdW5jdGlvbiBLTURKbChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIGF6dEtuOiB1KDE5ODAsIDIyNDUpLCBrV3ZkYjogdSgyMzA0LCAxOTQ3KSwgWnJrTlI6IHUoNTc3LCAyMzQpLCBZRUdoYzogZnVuY3Rpb24gWUVHaGMobiwgdSl7IHJldHVybiBuICogdTsgfSwgeFhtVnk6IHUoMzE0OCwgMjU5NCksIHlObHVPOiBmdW5jdGlvbiB5Tmx1TyhuLCB1KXsgcmV0dXJuIG4gLyB1OyB9LCB5VFd6dTogZnVuY3Rpb24geVRXenUobiwgdSl7IHJldHVybiBuID09PSB1OyB9LCBSZUdLazogdSgxNjgwLCAyMTA1KSwgTXNrQkQ6IHUoMjQ0MCwgMzY2OCksIFVFd2Z2OiBmdW5jdGlvbiBVRXdmdihuLCB1KXsgcmV0dXJuIG4gLyB1OyB9LCBRc1F1aTogdSg1OTUsIDEwMzYpICsgdSgyNjM2LCAyNTMwKSArICIrJCIsIHJlTGlKOiB1KDkzOSwgMTM3NyksIE5RSE5DOiB1KDc4OSwgNDQpLCBIcWRPRjogdSg4OTgsIDI3NTEpLCBZdXBORzogZnVuY3Rpb24gWXVwTkcobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBuKHUsIHIsIHQsIGUsIGkpOyB9LCB5VU9NdTogdSg4MzQsIDIzOTUpLCBCUkFmSTogdSgxNDM4LCAxMjMzKSwgbFZURG06IGZ1bmN0aW9uIGxWVERtKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgWHVxQks6IGZ1bmN0aW9uIFh1cUJLKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIFNFa0xuOiB1KDMxMTYsIDQ5OTYpLCB4WndTdzogZnVuY3Rpb24geFp3U3cobiwgdSl7IHJldHVybiBuID09PSB1OyB9LCBQQlpySzogdSgyODkxLCAyOTI3KSwgYnhRUXA6IHUoNzU3LCA1NTMpLCBlRXhVcTogZnVuY3Rpb24gZUV4VXEobiwgdSl7IHJldHVybiBuID09PSB1OyB9LCBVbkZteTogdSgyMjA2LCAxODI1KSwgZmhOc1U6IGZ1bmN0aW9uIGZoTnNVKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgcmFmTFE6IHUoMTY1MSwgNzUyKSwgaFRCa1A6IGZ1bmN0aW9uIGhUQmtQKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbih1LCByLCB0LCBlKTsgfSwgQUpYSVg6IGZ1bmN0aW9uIEFKWElYKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgV2tHSU46IGZ1bmN0aW9uIFdrR0lOKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIHNKbHl4OiBmdW5jdGlvbiBzSmx5eChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIHhxTHVBOiBmdW5jdGlvbiB4cUx1QShuLCB1LCByLCB0KXsgcmV0dXJuIG4odSwgciwgdCk7IH0sIFdaZnRBOiBmdW5jdGlvbiBXWmZ0QShuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIG5xTnJyOiBmdW5jdGlvbiBucU5ycihuLCB1LCByLCB0KXsgcmV0dXJuIG4odSwgciwgdCk7IH0sIHNZYWpvOiBmdW5jdGlvbiBzWWFqbyhuLCB1LCByLCB0KXsgcmV0dXJuIG4odSwgciwgdCk7IH0sIHdScFhhOiB1KDk3MywgMjM4KSwgUGlWb2Y6IGZ1bmN0aW9uIFBpVm9mKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgR3ZUZkE6IGZ1bmN0aW9uIEd2VGZBKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgQ09IQ3c6IGZ1bmN0aW9uIENPSEN3KG4sIHUsIHIsIHQpeyByZXR1cm4gbih1LCByLCB0KTsgfSwgRURReWU6IGZ1bmN0aW9uIEVEUXllKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgUXZ6dVU6IGZ1bmN0aW9uIFF2enVVKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgc3NhYU06IGZ1bmN0aW9uIHNzYWFNKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgeGNZYW86IGZ1bmN0aW9uIHhjWWFvKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbih1LCByLCB0LCBlKTsgfSwgY1dJS1Q6IGZ1bmN0aW9uIGNXSUtUKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgTnFvZ046IGZ1bmN0aW9uIE5xb2dOKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgZ29oZ206IGZ1bmN0aW9uIGdvaGdtKG4sIHUsIHIsIHQpeyByZXR1cm4gbih1LCByLCB0KTsgfSwgZlV2SWg6IGZ1bmN0aW9uIGZVdkloKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgR2JacHQ6IGZ1bmN0aW9uIEdiWnB0KG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgbFRWQ2Y6IGZ1bmN0aW9uIGxUVkNmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbih1LCByLCB0LCBlKTsgfSwgR3ZmcGg6IGZ1bmN0aW9uIEd2ZnBoKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgUndCZHc6IGZ1bmN0aW9uIFJ3QmR3KG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgUVRST006IGZ1bmN0aW9uIFFUUk9NKG4sIHUsIHIsIHQpeyByZXR1cm4gbih1LCByLCB0KTsgfSwgaGZnZWw6IGZ1bmN0aW9uIGhmZ2VsKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgSklsTVY6IGZ1bmN0aW9uIEpJbE1WKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgT1V4WnY6IGZ1bmN0aW9uIE9VeFp2KG4sIHUsIHIsIHQpeyByZXR1cm4gbih1LCByLCB0KTsgfSwgYk9hRk46IGZ1bmN0aW9uIGJPYUZOKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgUkJ1Smg6IGZ1bmN0aW9uIFJCdUpoKG4sIHUsIHIsIHQpeyByZXR1cm4gbih1LCByLCB0KTsgfSwgb0hIWkc6IGZ1bmN0aW9uIG9ISFpHKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgd2tFd0w6IHUoMjI1NSwgMzUyMCksIGtqVHFoOiBmdW5jdGlvbiBralRxaChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIG4odSwgciwgdCwgZSk7IH0sIFJsallVOiBmdW5jdGlvbiBSbGpZVShuLCB1LCByLCB0KXsgcmV0dXJuIG4odSwgciwgdCk7IH0sIEtzWHJGOiBmdW5jdGlvbiBLc1hyRihuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIERnbXZYOiB1KDE3MzYsIDE4NDEpLCBiWEF6cDogZnVuY3Rpb24gYlhBenAobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBBRVBLaTogZnVuY3Rpb24gQUVQS2kobiwgdSl7IHJldHVybiBuIC0gdTsgfSwgRUJ3Tm86IGZ1bmN0aW9uIEVCd05vKG4sIHUpeyByZXR1cm4gbiAvIHU7IH0sIEpUVVlqOiB1KDkzNiwgMTEwNyksIGRxSU1UOiBmdW5jdGlvbiBkcUlNVChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIHBld2JEOiBmdW5jdGlvbiBwZXdiRChuLCB1KXsgcmV0dXJuIG4gIT09IHU7IH0sIHZlbGdiOiB1KDEwMzAsIDkzMSksIExtUE5pOiB1KDE5NjgsIDM1MTgpLCBMWVhCRTogdSgyMTg3LCAxMzcyKSwgSElOUGw6IHUoOTc3LCAxMzQxKSwgYXRnb2M6IGZ1bmN0aW9uIGF0Z29jKG4sIHUpeyByZXR1cm4gbiAhPT0gdTsgfSwgWm9raFM6IHUoMTE2NCwgMTI4MyksIGVITVp6OiBmdW5jdGlvbiBlSE1aeihuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIEpkTnBVOiBmdW5jdGlvbiBKZE5wVShuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIG5LenhFOiB1KDExNDQsIDIzMDgpLCBVdFRIcjogdSgxMTg3LCAxMjI2KSwgbmtKa3g6IGZ1bmN0aW9uIG5rSmt4KG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIEpiZENsOiBmdW5jdGlvbiBKYmRDbChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIEdFbU1zOiB1KDEzNTMsIDE1NDApLCBPZUxSQzogdSgxNDQ4LCAxNjYzKSwgZlVEZ2Y6IHUoMjMzMSwgODM2KSwgVnZWcm06IGZ1bmN0aW9uIFZ2VnJtKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIHRlYVFCOiB1KDY5MywgMTg5MyksIFFldkFrOiB1KDE5ODIsIDE5ODUpLCBUdHVJSDogZnVuY3Rpb24gVHR1SUgobiwgdSl7IHJldHVybiBuKHUpOyB9LCB3UUJ5QzogdSgxNzQ3LCAzMDI5KSwgS05iaW46IHUoNTQ3LCA2NjcpLCBqdkxyTzogZnVuY3Rpb24ganZMck8obiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBOQlZ3VTogZnVuY3Rpb24gTkJWd1UobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBxSWthbTogdSgyOTEyLCAyNjk1KSwgZ1doYlI6IHUoMTY0OSwgMjc4NCksIEdueXp5OiB1KDI5ODksIDI5MjQpLCBMZWRNYzogdSgxNDgwLCAxMTQwKSwgWGd4T3g6IHUoMjcyNywgMTc2MyksIGRhbnVmOiB1KDE1MDEsIDE5NjYpICsgdSgxMDk2LCAyMDA3KSwgSUVXdkc6IGZ1bmN0aW9uIElFV3ZHKG4sIHUpeyByZXR1cm4gbiAlIHU7IH0sIGplbGVTOiBmdW5jdGlvbiBqZWxlUyhuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCBKUXZuZTogdSgxMjM3LCA1MDIpLCBiUGtEZTogdSgyNzk2LCAzMjc3KSwgc2ZEZ3c6IHUoMTAyNSwgMzAwOSksIFVWUHVPOiBmdW5jdGlvbiBVVlB1TyhuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCBxRGNYYzogdSgxMDE3LCAtOTIpLCBvS2lHdDogZnVuY3Rpb24gb0tpR3QobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBJdndtVTogZnVuY3Rpb24gSXZ3bVUobiwgdSl7IHJldHVybiBuICsgdTsgfSwgSUhlbEo6IGZ1bmN0aW9uIElIZWxKKG4sIHUsIHIsIHQpeyByZXR1cm4gbih1LCByLCB0KTsgfSwgZnNqRWY6IHUoOTMxLCAxODc3KSwgT0xmSVc6IGZ1bmN0aW9uIE9MZklXKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgVkNac3M6IHUoMTI2NCwgLTUwKSwgZ01vY3E6IHUoMTQ5MCwgMjY1MiksIFpudEN4OiB1KDMwMjgsIDI2NzkpLCBaU3lHTDogZnVuY3Rpb24gWlN5R0wobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBuKHUsIHIsIHQsIGUsIGkpOyB9LCBvb1BobDogdSg2NjEsIC0zODkpLCBub1ZNdzogZnVuY3Rpb24gbm9WTXcobiwgdSwgciwgdCl7IHJldHVybiBuKHUsIHIsIHQpOyB9LCBLcWV1ejogZnVuY3Rpb24gS3FldXoobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBuKHUsIHIsIHQsIGUsIGkpOyB9LCBpSmRKQjogZnVuY3Rpb24gaUpkSkIobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBuKHUsIHIsIHQsIGUsIGkpOyB9LCBvRENOYjogZnVuY3Rpb24gb0RDTmIobiwgdSl7IHJldHVybiBuIC0gdTsgfSwgaHdyVE06IGZ1bmN0aW9uIGh3clRNKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgZnJsa1I6IHUoNTU1LCAyODQpLCBncG15QTogdSg1MDAsIDE2NDkpLCBVZ1FBZTogZnVuY3Rpb24gVWdRQWUobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBDQW5jUDogZnVuY3Rpb24gQ0FuY1AobiwgdSl7IHJldHVybiBuICsgdTsgfSwgRXdseVk6IHUoMTU4MywgMjc1MCksIGVLSHVlOiB1KDI0MzMsIDMyMjkpLCBFbXZ2ZTogZnVuY3Rpb24gRW12dmUobiwgdSl7IHJldHVybiBuID09PSB1OyB9LCBjT1h6VDogdSgxMTI0LCA0MTkpLCBMSXFPYTogZnVuY3Rpb24gTElxT2EobiwgdSl7IHJldHVybiBuKHUpOyB9LCBoc21xVTogdSgxNTI1LCAyMDA0KSwgVFNKam06IHUoMjI5NSwgMTI3MSksIFRyQXJFOiB1KDIyMTcsIDI5OTgpLCB3Y1NQaTogdSg2MTQsIC0xNTI0KSwgcHJjRFU6IGZ1bmN0aW9uIHByY0RVKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIGdPTXl4OiBmdW5jdGlvbiBnT015eChuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIE1HVFFOOiB1KDU2MywgODU1KSwgcGdIbWc6IHUoNzEzLCA5NTYpLCBKWXlGYTogZnVuY3Rpb24gSll5RmEobiwgdSl7IHJldHVybiBuIC0gdTsgfSwgQ3NjcUc6IGZ1bmN0aW9uIENzY3FHKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgd0V6TVU6IGZ1bmN0aW9uIHdFek1VKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgYktHWWg6IGZ1bmN0aW9uIGJLR1loKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIFpta01sOiB1KDIxNTksIDExMDkpLCBKS2dEYzogdSgxMTU3LCAyMTE2KSwgYW5UWXg6IHUoMjk0MywgMTg2NCksIFZTYVBrOiBmdW5jdGlvbiBWU2FQayhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIHJwR0hSOiBmdW5jdGlvbiBycEdIUihuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCBuZGxlYjogZnVuY3Rpb24gbmRsZWIobiwgdSl7IHJldHVybiBuIC0gdTsgfSwgc2NySkI6IGZ1bmN0aW9uIHNjckpCKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgV3hPSVY6IGZ1bmN0aW9uIFd4T0lWKG4sIHUpeyByZXR1cm4gbiAhPT0gdTsgfSwgem1VelY6IHUoMjc5NCwgNjY1KSwgb2d0dFY6IHUoMTIzMiwgMjg5NiksIHZPVUxtOiBmdW5jdGlvbiB2T1VMbShuLCB1LCByLCB0KXsgcmV0dXJuIG4odSwgciwgdCk7IH0sIFVWbnNJOiBmdW5jdGlvbiBVVm5zSShuLCB1KXsgcmV0dXJuIG4gIT09IHU7IH0sIGNsV2RzOiB1KDkxMCwgMTg0OSksIFlSb2NCOiBmdW5jdGlvbiBZUm9jQihuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCB1U1ppUzogdSgyNDMyLCAxNjgyKSwgUndYUEU6IGZ1bmN0aW9uIFJ3WFBFKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgZ1REQks6IHUoMTQ5NiwgMjU3MiksIGVtU05WOiBmdW5jdGlvbiBlbVNOVihuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCBOY2pXWjogZnVuY3Rpb24gTmNqV1oobiwgdSl7IHJldHVybiBuICE9PSB1OyB9LCB6bmpHejogdSgyNTkyLCAyODc0KSwgTWJnSnE6IHUoMTcxNSwgNTI5KSwgQlJjZEw6IGZ1bmN0aW9uIEJSY2RMKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgYXNnTks6IHUoMjQyMCwgMTQ3NiksIEhpTm9OOiB1KDEyODgsIDEzMTkpLCBYanBocjogZnVuY3Rpb24gWGpwaHIobiwgdSl7IHJldHVybiBuID09PSB1OyB9LCBnVHlnQTogdSgxODY0LCAyNzgxKSwgWWhnY1o6IHUoMjQ0MiwgNjYyKSwgQmVDTW46IHUoMjgzNSwgMzI1NCksIFNZWkpQOiB1KDIyNzgsIDI0NjIpLCBZb3hlTTogZnVuY3Rpb24gWW94ZU0obiwgdSl7IHJldHVybiBuIC0gdTsgfSwgd1VhbEY6IGZ1bmN0aW9uIHdVYWxGKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgb2psZng6IGZ1bmN0aW9uIG9qbGZ4KG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIHRVTWVQOiBmdW5jdGlvbiB0VU1lUChuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIHJHU1BBOiB1KDIxODEsIDE1OTApLCBSTlpOUTogZnVuY3Rpb24gUk5aTlEobiwgdSl7IHJldHVybiBuID09PSB1OyB9LCBRYkRmbTogdSgyMzIyLCAzMTc4KSwgSlZKSEM6IHUoMTQyNiwgMTEzMSksIFhzZElEOiBmdW5jdGlvbiBYc2RJRChuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIHNVTGdUOiB1KDIxOTcsIDI3NDEpLCBOUldvWTogdSg0OTEsIDExOTIpLCBpamZTTjogZnVuY3Rpb24gaWpmU04obil7IHJldHVybiBuKCk7IH0sIHVTWnh6OiBmdW5jdGlvbiB1U1p4eihuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIG9kS2xROiB1KDE0NjUsIC03NDApLCBQS3NFZjogdSgyMDc2LCAyOTg1KSwgUGlHWHE6IGZ1bmN0aW9uIFBpR1hxKG4sIHUpeyByZXR1cm4gbiAvIHU7IH0sIFRwWnhuOiBmdW5jdGlvbiBUcFp4bihuLCB1KXsgcmV0dXJuIG4gIT09IHU7IH0sIFRpTUlqOiB1KDI3MTcsIDIxNDQpLCBudkpwZTogZnVuY3Rpb24gbnZKcGUobiwgdSl7IHJldHVybiBuIC0gdTsgfSwgZGFESU06IGZ1bmN0aW9uIGRhRElNKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgeXNMVFo6IHUoMzE0MywgMzU5MyksIExFbWFWOiBmdW5jdGlvbiBMRW1hVihuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIExwa0t3OiB1KDEyMjAsIC0zNiksIGdJWE1QOiB1KDYxNywgLTExODUpLCBoUWJFazogZnVuY3Rpb24gaFFiRWsobiwgdSl7IHJldHVybiBuIC0gdTsgfSwgcHNIT1g6IHUoMjg1NCwgMjU3MyksIGJ2TUZkOiBmdW5jdGlvbiBidk1GZChuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIGlMcGhDOiB1KDE5NzMsIDE3NjcpLCBLQlZMYTogdSgxNDU2LCAxMDQ0KSwgTVp1eXk6IGZ1bmN0aW9uIE1adXl5KG4sIHUpeyByZXR1cm4gbiAhPT0gdTsgfSwgRUlYY2k6IHUoMzEyMCwgNDA2OCksIHVJcHBDOiB1KDIyMTAsIDI5MjQpLCB1REJRbjogZnVuY3Rpb24gdURCUW4obiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBxQm1DazogZnVuY3Rpb24gcUJtQ2sobiwgdSl7IHJldHVybiBuIC0gdTsgfSwgaFhkSHA6IHUoMTM3MSwgMTc4MyksIGpSalhHOiB1KDI3MzYsIDIyNTYpLCB0d210aTogdSgyMDgwLCAyNDc2KSwgUHB3eVQ6IGZ1bmN0aW9uIFBwd3lUKG4sIHUpeyByZXR1cm4gbiAhPT0gdTsgfSwgcUxjRXk6IHUoMzE1NywgMzEwNCksIGVtVWxpOiB1KDE3NDEsIDY1NSksIGN2Y2dsOiB1KDc1NiwgLTEwMTYpLCBHT2dGRjogdSgxMDI5LCAtNTExKSwgdGxGaHI6IHUoMTM2NSwgMTk5MiksIG5ndkFTOiB1KDgyMCwgMjQ0OSksIEtYWE5qOiB1KDE4OTksIDMyMTQpLCBEdXduVzogZnVuY3Rpb24gRHV3blcobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBuKHUsIHIsIHQsIGUsIGkpOyB9LCBYdkhPWTogdSg3NjAsIDIxMjYpLCBKQ0Z3YTogZnVuY3Rpb24gSkNGd2EobiwgdSl7IHJldHVybiBuID09IHU7IH0sIHFxbVNaOiB1KDExOTIsIDUxOSksIHVSZnpnOiB1KDExNzAsIDIzMjkpLCBLV2V6RTogZnVuY3Rpb24gS1dlekUobiwgdSl7IHJldHVybiBuIC0gdTsgfSwgY2NPelc6IHUoMTA0NiwgMTY4KSwgTHZJUW06IGZ1bmN0aW9uIEx2SVFtKG4sIHUsIHIsIHQpeyByZXR1cm4gbih1LCByLCB0KTsgfSwgU0VCR3U6IHUoMTQ4MiwgMTY1MiksIHRPcE55OiB1KDI2OTcsIDI2ODgpLCBOTFNxQTogdSgzMTYxLCAyNzE0KSwgUEljTEw6IHUoMTcyOCwgOTMxKSwgdWxRcE86IHUoMTUyMSwgMTY5MCksIFdvaVdDOiBmdW5jdGlvbiBXb2lXQyhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIEFCWVFCOiB1KDEzNzAsIDIwNTUpLCB2ckVlejogdSgyMTEzLCAyNjUzKSwgcXhDcks6IGZ1bmN0aW9uIHF4Q3JLKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIFlUWERVOiB1KDI0NjgsIDEzNzcpLCB4dHhmVjogdSgxNDczLCAxMjk0KSwgVWtlQWk6IHUoMTk3MSwgMjMyMSksIHlGaEV2OiB1KDE0MTUsIDIzNjQpLCBpVHJ2azogZnVuY3Rpb24gaVRydmsobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBuKHUsIHIsIHQsIGUsIGkpOyB9LCBoYXJ6czogdSgyMTQ0LCAxNTgwKSwgeHhQaE86IHUoNTI2LCAxMjE2KSwgcldCc3M6IHUoMjY3NCwgMjk0MCksIGlmbGVhOiB1KDMxNDAsIDIxMDEpLCBBdlRTVDogdSgyMzQ3LCAzMjExKSwgY1lGY006IGZ1bmN0aW9uIGNZRmNNKG4sIHUsIHIsIHQpeyByZXR1cm4gbih1LCByLCB0KTsgfSwgQXhWQ1g6IHUoMTMxMywgLTE0NSksIGNmbkpVOiBmdW5jdGlvbiBjZm5KVShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIG4odSwgciwgdCwgZSk7IH0sIG9qRHNYOiBmdW5jdGlvbiBvakRzWChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIG4odSwgciwgdCwgZSk7IH0sIFdMT3dPOiBmdW5jdGlvbiBXTE93TyhuLCB1LCByLCB0KXsgcmV0dXJuIG4odSwgciwgdCk7IH0sIEVoVGZBOiB1KDcwOSwgMjcpLCBQZUZyUjogdSgyMTcxLCAxNDg0KSwgclFaalc6IGZ1bmN0aW9uIHJRWmpXKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIFJNUGxBOiBmdW5jdGlvbiBSTVBsQShuLCB1KXsgcmV0dXJuIG4gIT09IHU7IH0sIGxWd1dHOiB1KDk4NywgLTIyNCksIGlQRndJOiB1KDUzMywgLTU2NCksIEJjYnNsOiBmdW5jdGlvbiBCY2JzbChuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCB5b2piVjogZnVuY3Rpb24geW9qYlYobiwgdSl7IHJldHVybiBuID09PSB1OyB9LCBtakVBdTogdSgyNzUyLCAzNDM4KSwgTFBJZkk6IGZ1bmN0aW9uIExQSWZJKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbih1LCByLCB0LCBlKTsgfSwgaHNmY1E6IGZ1bmN0aW9uIGhzZmNRKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgZWNGckI6IGZ1bmN0aW9uIGVjRnJCKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgWG5hSnI6IGZ1bmN0aW9uIFhuYUpyKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgR2VUWWM6IGZ1bmN0aW9uIEdlVFljKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbih1LCByLCB0LCBlKTsgfSwgempMUXk6IGZ1bmN0aW9uIHpqTFF5KG4sIHUsIHIsIHQpeyByZXR1cm4gbih1LCByLCB0KTsgfSwgR0t6enA6IGZ1bmN0aW9uIEdLenpwKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgeFlyWks6IGZ1bmN0aW9uIHhZclpLKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgdVREcFA6IGZ1bmN0aW9uIHVURHBQKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgdnBrUWw6IGZ1bmN0aW9uIHZwa1FsKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgTFlYckI6IGZ1bmN0aW9uIExZWHJCKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgVHNRcFg6IGZ1bmN0aW9uIFRzUXBYKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgRHNydWg6IGZ1bmN0aW9uIERzcnVoKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgRUlJZVI6IGZ1bmN0aW9uIEVJSWVSKG4sIHUpeyByZXR1cm4gbiArIHU7IH0sIGx4Q2JXOiBmdW5jdGlvbiBseENiVyhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIEZNUUllOiBmdW5jdGlvbiBGTVFJZShuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIFJLbndFOiBmdW5jdGlvbiBSS253RShuLCB1KXsgcmV0dXJuIG4gKyB1OyB9LCBCZ0lZSTogZnVuY3Rpb24gQmdJWUkobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBPYXp1djogZnVuY3Rpb24gT2F6dXYobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBmZ0RibzogZnVuY3Rpb24gZmdEYm8obiwgdSl7IHJldHVybiBuICsgdTsgfSwgcmZKbnM6IGZ1bmN0aW9uIHJmSm5zKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgWkFFSkQ6IGZ1bmN0aW9uIFpBRUpEKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgRUhSZFE6IGZ1bmN0aW9uIEVIUmRRKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgSmFyQkg6IGZ1bmN0aW9uIEphckJIKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgaWdrZXQ6IGZ1bmN0aW9uIGlna2V0KG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgbW10cFk6IGZ1bmN0aW9uIG1tdHBZKG4sIHUpeyByZXR1cm4gbiArIHU7IH0sIHljWml0OiBmdW5jdGlvbiB5Y1ppdChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIFN1cVBHOiBmdW5jdGlvbiBTdXFQRyhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIHdBT2xzOiBmdW5jdGlvbiB3QU9scyhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIHpLbGVnOiBmdW5jdGlvbiB6S2xlZyhuLCB1KXsgcmV0dXJuIG4gKyB1OyB9LCBPRklEWTogZnVuY3Rpb24gT0ZJRFkobiwgdSl7IHJldHVybiBuICsgdTsgfSwgSFJheFE6IGZ1bmN0aW9uIEhSYXhRKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgcEF5dEc6IGZ1bmN0aW9uIHBBeXRHKG4sIHUpeyByZXR1cm4gbiArIHU7IH0sIEhRd21vOiBmdW5jdGlvbiBIUXdtbyhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIE9NWU1vOiBmdW5jdGlvbiBPTVlNbyhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIG1MSlNIOiBmdW5jdGlvbiBtTEpTSChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIEJxelFEOiBmdW5jdGlvbiBCcXpRRChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIHBmRkVxOiBmdW5jdGlvbiBwZkZFcShuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIGVyTUVrOiBmdW5jdGlvbiBlck1FayhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIGpnSmptOiB1KDk4MiwgNTAyKSwgTXNEUnE6IHUoMjEwMCwgMTkxMCksIElSRWVLOiBmdW5jdGlvbiBJUkVlSyhuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCBUc0t0aDogZnVuY3Rpb24gVHNLdGgobiwgdSl7IHJldHVybiBuICE9PSB1OyB9LCBBR2RtUjogdSgxNTAwLCAxMTEwKSwgZVlqZXc6IHUoMjkyOSwgNDE4MCksIFJFSnlZOiBmdW5jdGlvbiBSRUp5WShuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIG53V1VSOiBmdW5jdGlvbiBud1dVUihuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIFBWWUhLOiB1KDIzODEsIDIwMTkpLCBLaXVnVTogZnVuY3Rpb24gS2l1Z1UobiwgdSl7IHJldHVybiBuICE9PSB1OyB9LCBKUE5qQjogdSgxNjg4LCAyMDI5KSwgcWxTdkg6IHUoMTczOSwgMjAwOSksIGpaUWdnOiBmdW5jdGlvbiBqWlFnZyhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIGt6RmZHOiB1KDMwNDAsIDQxNDkpLCBOZ05zRDogdSgyODIwLCAyNzUyKSwgYmdYc0I6IGZ1bmN0aW9uIGJnWHNCKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgYkpJQm46IGZ1bmN0aW9uIGJKSUJuKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgU0tnbmY6IHUoMjAxNywgMzE3MCksIHZxcGV3OiB1KDIxNDIsIDE2NTgpLCBYZ1RZcDogZnVuY3Rpb24gWGdUWXAobiwgdSl7IHJldHVybiBuICsgdTsgfSwgZE1acWw6IGZ1bmN0aW9uIGRNWnFsKG4sIHUpeyByZXR1cm4gbiAhPT0gdTsgfSwgQ3Z2am06IHUoMjcwMywgMjM5NiksIHJ2RVZKOiB1KDc3MywgOTYzKSwgWnZyeWU6IGZ1bmN0aW9uIFp2cnllKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgd0NwYWw6IHUoMTk4MywgMTY5MiksIFVzVE1ROiB1KDg4NywgMjkzKSwgdUtwS0Y6IGZ1bmN0aW9uIHVLcEtGKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgaXhseE86IHUoMTg0NCwgMjYxMCksIEF0dHVYOiB1KDE5OTcsIDE1MjApLCBOQkZudDogdSgxMzQxLCA2ODUpLCBRd01BaDogdSg2OTcsIDEwNTkpLCBWUGhycjogZnVuY3Rpb24gVlBocnIobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBuKHUsIHIsIHQsIGUsIGkpOyB9LCByS2J5TTogZnVuY3Rpb24gcktieU0obiwgdSl7IHJldHVybiBuICE9PSB1OyB9LCBGQkJ4YjogdSgyMjQwLCAxNzI4KSwgTURwQ0c6IGZ1bmN0aW9uIE1EcENHKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgamVKRlM6IGZ1bmN0aW9uIGplSkZTKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgdkNHdmY6IGZ1bmN0aW9uIHZDR3ZmKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgY0tPS0Q6IGZ1bmN0aW9uIGNLT0tEKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbih1LCByLCB0LCBlKTsgfSwgcEV0WW86IGZ1bmN0aW9uIHBFdFlvKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgd25YbE46IGZ1bmN0aW9uIHduWGxOKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIFZnV0pNOiBmdW5jdGlvbiBWZ1dKTShuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIG4odSwgciwgdCwgZSwgaSk7IH0sIG5nbWFnOiBmdW5jdGlvbiBuZ21hZyhuLCB1LCByLCB0LCBlKXsgcmV0dXJuIG4odSwgciwgdCwgZSk7IH0sIGdjWVh1OiBmdW5jdGlvbiBnY1lYdShuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIG4odSwgciwgdCwgZSwgaSk7IH0sIGtud3RKOiBmdW5jdGlvbiBrbnd0SihuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIHFkTVJNOiB1KDI5OTgsIDE3OTApLCBPaU1paTogZnVuY3Rpb24gT2lNaWkobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBrQkRWaTogZnVuY3Rpb24ga0JEVmkobiwgdSl7IHJldHVybiBuIC0gdTsgfSwgQXhYaVI6IGZ1bmN0aW9uIEF4WGlSKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgblpXSWE6IHUoMjI4MywgMTk0NSksIE5FSWRROiBmdW5jdGlvbiBORUlkUShuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIFVTcnlDOiBmdW5jdGlvbiBVU3J5QyhuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCBodktpSzogZnVuY3Rpb24gaHZLaUsobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBuKHUsIHIsIHQsIGUsIGkpOyB9LCBiaVhNdzogZnVuY3Rpb24gYmlYTXcobiwgdSl7IHJldHVybiBuID09PSB1OyB9LCBRTFZJdjogdSgyNDU5LCAxODMwKSwgcHFtY0g6IHUoMTkxNSwgMTA3OSksIEFaRlBzOiBmdW5jdGlvbiBBWkZQcyhuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCBFUG11bzogZnVuY3Rpb24gRVBtdW8obiwgdSl7IHJldHVybiBuICE9PSB1OyB9LCB5Tm5qdzogdSgzMDQxLCA0MzkxKSwgUU1ERW46IHUoOTI5LCAxNzEyKSwgQ1NKYng6IGZ1bmN0aW9uIENTSmJ4KG4sIHUpeyByZXR1cm4gbiAhPT0gdTsgfSwgWUVRWEU6IGZ1bmN0aW9uIFlFUVhFKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgbUNBQ1c6IGZ1bmN0aW9uIG1DQUNXKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgRXRpZGs6IHUoMTYzMywgMTM3OSksIE9zUVhGOiB1KDE4NTcsIDI1OTgpLCBhRmdVWDogZnVuY3Rpb24gYUZnVVgobil7IHJldHVybiBuKCk7IH0sIFBTZHlDOiB1KDEyMjcsIDY0NCkgKyB1KDIxNzUsIDIxMjkpLCBuekN1djogZnVuY3Rpb24gbnpDdXYobiwgdSl7IHJldHVybiBuICUgdTsgfSwgT1dSc1M6IHUoMjIwOSwgMTY4NCksIFhtd2dMOiB1KDE2MjksIDE2MDcpLCBORWdKSjogdSgzMDQ3LCAzNDY0KSwgUFl6aE06IGZ1bmN0aW9uIFBZemhNKG4sIHUpeyByZXR1cm4gbiAhPT0gdTsgfSwgcW5EUW46IHUoMTY5MiwgMTM5NiksIGZXQVR4OiB1KDI4MzYsIDQyMTYpLCBRTWR6bzogZnVuY3Rpb24gUU1kem8obiwgdSl7IHJldHVybiBuICE9PSB1OyB9LCBRb3lJSzogdSgxMjQ3LCAyMzk4KSwgWVF6bFc6IHUoMjA5NSwgMTYwKSwgcndCd3A6IHUoMTY0NiwgMTU4MSksIE1Kd3J1OiBmdW5jdGlvbiBNSndydShuLCB1KXsgcmV0dXJuIG4gKyB1OyB9LCB2bUt4TTogdSgxODMwLCAxMzYyKSwgUE5OVWU6IHUoMTEzNCwgLTM2NSksIFBnUkZnOiBmdW5jdGlvbiBQZ1JGZyhuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCBPUkxVWTogdSgyNzk4LCAyMzI2KSwgWFVqc1o6IHUoMTY1OSwgMTUzMSksIFNaaEpBOiBmdW5jdGlvbiBTWmhKQShuLCB1KXsgcmV0dXJuIG4odSk7IH0sIFhXbWR3OiBmdW5jdGlvbiBYV21kdyhuLCB1KXsgcmV0dXJuIG4gIT09IHU7IH0sIExOektPOiB1KDUwOCwgLTMwOCksIEpGaHVtOiB1KDIyMDUsIDMxNTUpLCB1U3hsSTogdSg2MTEsIDE3MCksIGpjUFhjOiB1KDExNzgsIDQzNSksIHlGYWpxOiBmdW5jdGlvbiB5RmFqcShuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCBYa29uYzogdSg1ODcsIDg4NSksIEhxblBPOiBmdW5jdGlvbiBIcW5QTyhuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIG4odSwgciwgdCwgZSwgaSk7IH0sIHBuVmF2OiBmdW5jdGlvbiBwblZhdihuLCB1KXsgcmV0dXJuIG4gLyB1OyB9LCBLV3pLYjogZnVuY3Rpb24gS1d6S2IobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBOWVNGUDogZnVuY3Rpb24gTllTRlAobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBsamtSUzogZnVuY3Rpb24gbGprUlMobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBVQnV3YjogZnVuY3Rpb24gVUJ1d2IobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBDY1NSRDogZnVuY3Rpb24gQ2NTUkQobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBzb1ZDVDogZnVuY3Rpb24gc29WQ1QobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBlclhZZjogZnVuY3Rpb24gZXJYWWYobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBjeVJPbDogZnVuY3Rpb24gY3lST2wobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBSamtuWDogZnVuY3Rpb24gUmprblgobiwgdSwgciwgdCwgZSl7IHJldHVybiBuKHUsIHIsIHQsIGUpOyB9LCBaQ3NrQjogZnVuY3Rpb24gWkNza0IobiwgdSwgciwgdCwgZSl7IHJldHVybiBuKHUsIHIsIHQsIGUpOyB9LCBwUGVtWjogZnVuY3Rpb24gcFBlbVoobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBBQ2FhTjogZnVuY3Rpb24gQUNhYU4obiwgdSwgciwgdCwgZSl7IHJldHVybiBuKHUsIHIsIHQsIGUpOyB9LCBnQlVWUDogZnVuY3Rpb24gZ0JVVlAobiwgdSwgciwgdCwgZSl7IHJldHVybiBuKHUsIHIsIHQsIGUpOyB9LCB0Z1pWSDogZnVuY3Rpb24gdGdaVkgobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCB5bFRjRDogZnVuY3Rpb24geWxUY0QobiwgdSl7IHJldHVybiBuICE9PSB1OyB9LCByRUVRcDogdSg5MTIsIDI2NTMpLCBCbnJnZTogdSgyMzA1LCAxNDI0KSwgaUFERW46IGZ1bmN0aW9uIGlBREVuKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIHNLdWFIOiB1KDE4MzYsIDM0KSwgTUFPd0U6IHUoNTEwLCAyMTAyKSwgRm9VYW86IHUoNzgxLCAxMjE2KSwgUG52bFg6IHUoMTAxMiwgNzg3KSwgb1lqQng6IHUoMzE0NiwgNDg1MyksIGphTEtVOiB1KDMxNTYsIDM1NDApLCBmZUhYYjogdSgzMDQyLCAyODUwKSwgY2pMeHo6IHUoMjE1NSwgMTcxOCksIFlBbW5zOiB1KDE5MDgsIDkxOCksIFZkZE95OiB1KDI3MjEsIDM0ODkpLCB3dkxycTogdSgyMjU5LCAxNjQxKSwgSnVNV3E6IHUoOTQwLCAxNDQ0KSwgcVdhVEU6IHUoOTkxLCAyMzQ1KSwgbGx4ZUw6IHUoMTQ1MywgMTA1MyksIGN6S0hGOiB1KDEwMzQsIDEyNDIpLCB5cVVBdDogdSgyNDc4LCAyMDY2KSwgcUFyYlc6IHUoODYyLCA4NTgpLCBtV3B5TTogdSgxNTA5LCAyMDQ0KSwgQ2xGY3A6IHUoNjEzLCAtMTY1OSksIFNiTHFhOiB1KDEyNzUsIC0xMyksIGVidVBWOiB1KDEyNTIsIDQzMiksIGVzd1pJOiB1KDMwNzQsIDk2NCksIFFiR1NYOiB1KDMxMDQsIDUwOTkpLCBHc2RUYzogdSg2MTAsIDE0NDQpLCBNTWlTcTogdSg4NDIsIDM4MyksIHVIR1BjOiB1KDE1NTQsIDExNjIpLCB0YlVJTjogdSgyNDk4LCAzNjQ1KSArIHUoMTgyMCwgMjE3MykgKyB1KDI3NjAsIDQzNzYpLCBpd1RFdTogdSgxMTA0LCA5MDQpLCBDcllOeTogdSgxMzQ4LCA2MDEpLCBzQmhDQTogdSgyNjU1LCAxMzk4KSwgamtyekg6IHUoMzE0NSwgMjQwNiksIFl3bElMOiB1KDI0NjQsIDMxMzEpLCBWSXRmTzogdSg1NTEsIC05NzkpLCBRd3RJbDogdSgyODY0LCAzMjA0KSwgbU1Ta2U6IHUoNzU5LCAxNjMxKSwgWGlCa1c6IHUoMjUxOSwgODE3KSwgSXVqSVg6IHUoMTIwMiwgMTk1MiksIHNGWVZGOiB1KDE5NTksIDYxNyksIFFNZ3R6OiB1KDUzOCwgNzI5KSwgZnVVaFk6IHUoMjAzNSwgMzMyMyksIHpXcE11OiB1KDMwNTUsIDQxOTcpLCBhZEtqQjogdSg4NDksIDE4OSksIEhxZXF6OiB1KDk4OSwgMTQ0OSksIHNDdFJ6OiB1KDk2MiwgLTU4NSksIHB4RUpaOiB1KDY2OSwgMTM0MCksIEF2dEN2OiB1KDIxNDAsIDE2NDcpLCBMS01qUzogdSgyNjM2LCAyMTAxKSwgaE9teGg6IHUoOTc4LCAxMjI3KSArIHUoMjYzNywgMjQzNikgKyB1KDEwODAsIC0xNDMpLCBKZERKdzogdSg1MTMsIDYpLCBQaUpxVzogdSgxNTQ4LCAxNzkxKSwgcHl1YXg6IHUoODI3LCA2NTcpLCBKaG56QzogdSgxOTM2LCAtMTQ0KSwgVWtqWm46IHUoMjYwMSwgMjgzMSksIGxET2lWOiB1KDMwNjIsIDM5MjcpLCBSVEVaWTogdSgyMDU5LCAxODkwKSwgV3N3RVM6IHUoMTI2MiwgMTIyOSksIHhXR2p0OiB1KDE3ODcsIDM3NzkpLCBIT09jUTogdSgxMDEzLCAtMTg3KSArIHUoMjgyMywgNDQzOSkgKyB1KDE0MjMsIDc1MyksIGRyYUliOiB1KDE2NTMsIDE1ODUpLCB0RHZSRjogdSgyNTM4LCAyMjQ2KSwgem5CTnQ6IHUoMjc2NiwgNDA2MyksIElIeFJVOiB1KDEzNjYsIDEzODgpLCBkaVpyVjogdSgyODYwLCAzMDI2KSwgRFNua3I6IHUoMjg3NiwgMjI2MiksIFdOelVKOiB1KDEyODcsIDEwNzEpLCBicFRLajogdSgyNDQ3LCAyMDU1KSwgbElEcUk6IHUoMTYzNiwgNzk4KSwgQ0lVWkg6IHUoNjg3LCAxNDYyKSwgWGtXRXA6IHUoMTUxOSwgMTA0KSwgS29ldkY6IHUoMjYwOCwgMjU1NCkgKyB1KDIzMTksIDQ0MTgpICsgdSgyOTEzLCAzNTc3KSwgcXNTRGg6IHUoMjc3MSwgMjQ0NyksIElQdWFHOiB1KDE0OTUsIDM1MjApLCBrQ1N6UjogdSgxNzkyLCAzMzMxKSwgR2Ntb0o6IHUoNzA1LCA2KSwgRmFKVXo6IHUoMzE1OSwgMjI3OCksIFFRVnpzOiB1KDIxMjYsIDE4MjEpLCBnTlFTdjogdSgyNDU1LCAyMzMwKSwgY2doUHI6IHUoMTMxOSwgMTE2NyksIHdRa0xsOiB1KDIxNjUsIDI4MTcpLCBmS29zeTogdSgyOTMwLCAxNjU5KSwgWkFmTlc6IHUoMjk0MSwgNDE4OCksIEtSY0d3OiB1KDEwNzcsIC0zMDYpLCBoZnpNVTogdSg5ODYsIDE2MjIpLCBzaW5KdzogdSgxODkyLCAyMTk0KSwgaENzSk86IHUoMTI5MywgMjI3NiksIEdxV3ZZOiB1KDI3MDEsIDI4NzEpLCBZdmxEbzogdSg3NjIsIC0zNTQpLCBDZUlCeTogdSgxNTk0LCAxNDg0KSwgQ2N1RnY6IHUoMjEzNiwgMjA5MiksIHZYQ0dUOiB1KDMxNTEsIDMyNjgpLCBBeGliRzogdSgyNDQxLCAzMjQ3KSwgbWRVcWE6IHUoMTcxMSwgMjAxNSksIFhmWWdIOiB1KDUyMiwgLTcxMSksIHZ0WndiOiB1KDE0MTAsIDE4MjApLCBBWVV4SjogdSgxNTY3LCAxMjc0KSwgcVJYcnE6IHUoMjAxMywgMzAyNCksIFpQQ1lpOiB1KDEyODQsIDE1NiksIEtVYVlZOiB1KDIwMzgsIDEwNjIpLCBEVUN5SjogdSgyODgyLCAzNzE0KSwgU0ZVSW46IHUoMjY4NiwgMzE1NSksIEZ1Q2hkOiB1KDI4NDksIDQyNDkpLCBOSVNWbjogdSgxNjcxLCAyNTQ4KSwgbWtJQ0g6IHUoMTQ2MywgNDg5KSwgbmx3elI6IHUoNjI3LCA3NDEpLCBTek9ScTogdSg3MDAsIDI2MDcpLCBlWVJKYzogdSgxNjk4LCAyNTg2KSwgVHVBVFY6IHUoMjk2NCwgMzAzMiksIEhoZU9iOiB1KDE0MzEsIDE4NzUpLCBERVJ1SjogdSgzMDM1LCA3NTYpICsgIlplIiwgY0N1RHE6IHUoMTIwOCwgMzYzKSwgS0VjS3A6IHUoMjg1NywgNDg2MCksIHZqckRPOiB1KDIzMzAsIDY1KSwgcXRlRmc6IHUoMTQ2MCwgNDU5KSwgbXZZcmU6IHUoNjcwLCAyMDYpLCBMU2J4UzogdSgxNDY3LCAxMzcxKSwgd0h4Sm46IHUoMTc3NSwgMTcxOSksIHRGUXlmOiB1KDYwNSwgLTQwMiksIGxOUnppOiB1KDEyMDEsIC03NyksIGVpQlVVOiB1KDg3NywgMjIzKSwgVnJWRUM6IHUoMTAyMCwgLTExMTgpLCBocUJmVDogdSgyNjI3LCAyODI0KSwgSkJyaVQ6IHUoMTQ2OCwgMTIxNyksIFpvdEJ6OiB1KDE0NzQsIDUyNyksIEpldFVPOiB1KDExMDMsIDE0MjQpLCBUbUVvWTogdSgxNTY4LCAxNDYwKSwgaHRyWUk6IHUoMzExOCwgMjkxNyksIFJ5RG9BOiB1KDEwMzEsIDk4OSksIFBjRUNMOiB1KDI0OTQsIDMxMDMpLCB5WHpzUzogdSgyNzIzLCAyNjc1KSwgRmdoS086IHUoMTgzNywgOTA3KSwgS0hIcWQ6IHUoMjMxMSwgNzk2KSwgUnVEc2o6IHUoNjA3LCAxOTkwKSwgaXZFT3M6IHUoMTE3NCwgMjUwOSksIEJBTUtBOiB1KDE4OTcsIDc4NyksIEFpVHpVOiB1KDE3ODUsIDIyNTgpLCBZcktMcTogdSgxNDA3LCAxOTI0KSwgZVJNTXg6IHUoMTYyOCwgMTE2NSksIFVnVndDOiB1KDIxODYsIDIyNTcpLCBEc3lqcDogdSgyNTY0LCAzMDQ0KSwgU3ZndGI6IHUoMTk3OSwgNjQwKSwgWmRNWUs6IHUoMTY4MywgMTMzNCksIFloS2JmOiB1KDk2NywgMjkyNSksIEVBdklEOiB1KDcxMCwgMjU0MSksIHFqaEplOiB1KDYxMiwgLTYwKSwgZmFqbWc6IHUoMjcyOSwgMzA5NCksIElFaHVBOiB1KDMwMTYsIDI3MTcpLCBKWVZSUzogdSgyMzk3LCAzNzE4KSwgWXhLbU06IHUoMTAwOCwgMTEwNSksIHBCZlFLOiB1KDU3MywgLTEzMDMpLCBVYmZuazogdSgxMDg5LCAyMDcxKSwgR2ViQWY6IHUoNzM2LCAyMjUxKSwgR3BiV3M6IHUoNzU0LCAyMjQ1KSwgcXhBd0Y6IHUoMjM0OSwgNDE3MiksIHFtVkZvOiB1KDMwMDMsIDM1NTYpLCBzaGtwaDogdSgxNDkzLCA2NjcpLCBad0JGbTogdSgzMDg5LCAyODQzKSwgaUlna0M6IHUoMjIyNywgMjc4MyksIE55QndiOiB1KDEyNDIsIDU0KSwgeHBjZmw6IHUoMjU3NCwgMTU0MyksIE5KWm1HOiB1KDIzMTIsIDIyMzEpLCBoZWZ6VDogdSgxMzcyLCAzMjI4KSwgYURtYmE6IHUoMjg5OCwgNDMwNyksIEhCRGhZOiB1KDkyMCwgNjY3KSwgUUtXTko6IHUoODYzLCAyMTMzKSwgYlBvanE6IHUoMjM1NSwgMzI5NyksIGl5Q0ZIOiB1KDI5ODYsIDMxMzcpLCBsb2R3ajogdSgxNjU4LCAyMDA4KSwgZGVOc1I6IHUoMjAzMiwgMTU3MSksIGhnUG9lOiB1KDIzNjksIDMyMzIpLCBhSm5PUzogdSgzMDUxLCAyOTIwKSArIHUoMTg1MCwgMTY5NikgKyAiVnMiLCBxQ2h2SDogdSgyNjUxLCAyNTA0KSwgeGNwVUs6IHUoMjIwMywgMjgwMykgKyB1KDIyMzQsIDI0OTQpICsgImNaIiwgQnhCVXc6IHUoNTE1LCAyMjU5KSwgZWZ6d0I6IHUoMTQ2NiwgMTQxNSksIG1VWFRBOiB1KDIzMTYsIDMzMjEpLCBtZUtiYzogdSgyNDQ2LCAzMTUxKSwgcEJnRG06IHUoODA0LCAyMTMwKSwgT2R1WG06IHUoMjkxMSwgMzY2OCksIGFyWUlpOiB1KDI3MzAsIDMwNzMpICsgIlNzIiwgUXdPaUU6IHUoMjU2MCwgMTM5MSksIEptZlJoOiB1KDE1MTMsIDEwMzgpLCBVaXhZTjogdSgxMjI4LCAxNzU4KSwgS0ZucWw6IHUoNTk1LCA4ODUpLCB6SmtrZDogdSg2MzcsIDcxNyksIHFTdmRvOiB1KDEzMTAsIDM0NzUpLCBLS21FSDogdSgyNjY5LCA0NTQwKSwgSktHRGI6IHUoMjQwNywgNzkwKSwgblB3VWw6IHUoOTY4LCAtMjE3KSwgRE5mZEQ6IHUoMjE4OCwgMzEzKSwgUUdaSGE6IHUoMjA3MiwgNTAzKSwgbnRMc2M6IHUoMzA1MiwgNDI2NiksIHpXYWthOiB1KDIxODIsIDM0MTIpLCBNQVpaQTogdSgxNzg2LCA2NTEpLCB5Um1SdTogdSgxNTgwLCAxMzc5KSwgQ2tLd046IHUoNjc3LCAxMTY0KSwgSHBWano6IHUoMTgzNSwgNzM0KSwgU1J2b2c6IHUoODQ2LCAxMTYyKSwgUVRVeEY6IHUoMjk1MCwgMjgyNiksIG1mV1pWOiB1KDE2MjEsIDM1NjEpLCBsVGZsYjogdSg4ODYsIDEyNDMpLCB1U2F5YTogdSg3ODIsIC04NzgpLCBkZFFEbDogdSgyMTg5LCAxMDc5KSwgSFdUcFg6IHUoMTk5MCwgMzc5NSksIFVWcFpzOiB1KDE1MDYsIDI1MjQpLCB4WGtGRjogdSgyMzA2LCAyMTUxKSArIHUoMjAyNCwgOTA3KSArICJuRyIsIGhMVlFSOiB1KDI5NzAsIDM4NDIpLCBOeW9lbjogdSgxMjk0LCAyNTQ0KSwgQ1FzWUI6IHUoMTM1NCwgMzY2KSwgQktWSk86IHUoMzAwOCwgMjI3MyksIEJDb0ZXOiB1KDE0MzIsIDUxMiksIEhaTktnOiB1KDE0NjEsIDI2MDkpICsgdSgzMDk0LCA1MTQxKSwgaFNFcGs6IHUoMTc3MCwgMTg4OCksIGxyU1hQOiB1KDY5OCwgMTA1OCksIERpYU51OiB1KDE3NzIsIDI4ODApLCBHVFRwazogdSgzMDAxLCAxNTc1KSwgVGNUbWM6IHUoMjE5MCwgOTk4KSwgSWlBcGM6IHUoMTIwOSwgMTgzMyksIGdmQmFhOiB1KDI3MDcsIDQ0NDEpLCBEU0luZzogdSgxNzI2LCAyMTU3KSwgbk1Rakk6IHUoODE0LCAyNTMyKSwgVUd3cGE6IHUoODA2LCAxMzgpLCB5c09FeTogdSgxODQ5LCA3NjkpLCBsVE9rYjogdSgxMDkwLCAxMzYwKSwgb0dTdko6IHUoMjc4OSwgMTY3NyksIFpLa0thOiB1KDEzMTUsIDE0MzUpLCBwdEplTzogdSgyOTkyLCAyNzE2KSwgbW5NSEg6IHUoNTY4LCAzOTUpLCBtRVVjeDogdSg5NjUsIDMyNSksIEROc2luOiB1KDg4OCwgLTEwMTYpLCBJYVR4TDogdSgyOTE3LCAyNjk1KSwgSGFyY2c6IHUoMjMzMywgMTU3OSksIEdlWk5EOiB1KDc5MSwgODYzKSwgR2VHWnk6IHUoMTYyMywgNzM2KSwgVHpEZVA6IHUoMTAzMiwgMjMwOSksIGlSQ1NIOiB1KDIxMjksIDM0NTMpLCBRbEhPZzogdSgxMDYyLCAxNTA1KSwgb0ZxS3g6IHUoMjI2NCwgMzM2MyksIEFEUlBkOiB1KDgyMywgMjQ2NyksIHlSb25uOiBmdW5jdGlvbiB5Um9ubihuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIENSS1Z2OiB1KDE4OTQsIDI1NzEpLCBscGpMRjogZnVuY3Rpb24gbHBqTEYobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBWd2l1czogdSgyNDExLCAxNzQwKSwgaWFNd2w6IGZ1bmN0aW9uIGlhTXdsKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgVWJUeU06IHUoMzE2OSwgMzU3NSksIFJnS1ZnOiB1KDk5NSwgMjcxMyksIGlxb0lEOiBmdW5jdGlvbiBpcW9JRChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIFl6elZqOiBmdW5jdGlvbiBZenpWaihuLCB1KXsgcmV0dXJuIG4gIT09IHU7IH0sIHloTnZFOiBmdW5jdGlvbiB5aE52RShuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCBaUkVCRzogZnVuY3Rpb24gWlJFQkcobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBOWlNFZjogZnVuY3Rpb24gTlpTRWYobiwgdSl7IHJldHVybiBuIC0gdTsgfSwgcFZUUnE6IGZ1bmN0aW9uIHBWVFJxKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgSXFORnk6IHUoMjYyOCwgMjg3NCksIGZRTlNPOiBmdW5jdGlvbiBmUU5TTyhuKXsgcmV0dXJuIG4oKTsgfSwgYXpvVFQ6IGZ1bmN0aW9uIGF6b1RUKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIGVheURyOiB1KDc1MywgOTY2KSwga0FBbHE6IHUoNjMyLCAxMTIpLCBHc2lxUTogdSgyNjY4LCAxMjYzKSwgSnFMYUE6IHUoMTgyOCwgMTI2MCksIE9NVHVWOiB1KDE4ODYsIDc5MSksIEJNQk9JOiB1KDYwOCwgLTE0MDcpLCBtcE5mVjogdSgxNDcxLCAyMzY1KSwgeWZ4VFo6IGZ1bmN0aW9uIHlmeFRaKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgZXVhTEg6IGZ1bmN0aW9uIGV1YUxIKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgeHFyTGg6IHUoMjA2MiwgMjA1OCksIG16cUN1OiB1KDIzMDIsIDE3NzcpLCByU3JCYTogZnVuY3Rpb24gclNyQmEobiwgdSl7IHJldHVybiBuKHUpOyB9LCBGRW9LVjogdSgxNzAzLCAxMDM1KSwgaGZzdnU6IHUoMTY4NSwgMTgyOSksIHpWbHJtOiB1KDI5MDcsIDM1MzEpLCBQT29lTjogZnVuY3Rpb24gUE9vZU4obiwgdSwgciwgdCl7IHJldHVybiBuKHUsIHIsIHQpOyB9LCBPQ1BaUjogZnVuY3Rpb24gT0NQWlIobiwgdSwgciwgdCwgZSl7IHJldHVybiBuKHUsIHIsIHQsIGUpOyB9LCBUYlB2QzogZnVuY3Rpb24gVGJQdkMobiwgdSl7IHJldHVybiBuICsgdTsgfSwgRVNXUnY6IGZ1bmN0aW9uIEVTV1J2KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbih1LCByLCB0LCBlKTsgfSwgeFdVbEE6IGZ1bmN0aW9uIHhXVWxBKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgd05xZnI6IGZ1bmN0aW9uIHdOcWZyKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIGVGTGRXOiBmdW5jdGlvbiBlRkxkVyhuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIHZBUXBBOiB1KDMxMTEsIDQ1NjMpLCBqS2pqUjogdSgyMzA5LCAxNDMyKSwgTXJKVGk6IGZ1bmN0aW9uIE1ySlRpKG4sIHUpeyByZXR1cm4gbiArIHU7IH0sIHh5YkRTOiBmdW5jdGlvbiB4eWJEUyhuLCB1KXsgcmV0dXJuIG4gKyB1OyB9LCBYWFdJcDogZnVuY3Rpb24gWFhXSXAobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCB3cURYWDogZnVuY3Rpb24gd3FEWFgobiwgdSl7IHJldHVybiBuICogdTsgfSwgYkV4Rko6IGZ1bmN0aW9uIGJFeEZKKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgS1pEemg6IHUoMjI3MiwgMzM3NCksIEpheFN1OiB1KDIwNTgsIDE1NTYpLCBBV01vbDogdSgyMjQzLCAxNTE5KSwgZ1RmbXg6IHUoMTExMCwgMTA0MSksIGxTaUpvOiBmdW5jdGlvbiBsU2lKbyhuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIExwbExIOiB1KDE0NDYsIDIxNTUpLCBwbUtiRjogdSgzMDA5LCAxNTkwKSwgb3ZQU0U6IGZ1bmN0aW9uIG92UFNFKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgWlREV2k6IHUoMjI0MSwgMTg4NyksIE9CVGR5OiB1KDIyOTAsIDIwODUpLCBac3FEdjogZnVuY3Rpb24gWnNxRHYobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBhV0dodTogZnVuY3Rpb24gYVdHaHUobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBQU1dldTogdSgyOTQ4LCAyODA2KSwgQkVsdUU6IGZ1bmN0aW9uIEJFbHVFKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgcmFNdWw6IGZ1bmN0aW9uIHJhTXVsKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgYXVydWU6IHUoMjM3MCwgODc2KSwgamxBRUg6IGZ1bmN0aW9uIGpsQUVIKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgUVpGUnA6IGZ1bmN0aW9uIFFaRlJwKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgUGNZVkk6IHUoMjgyMiwgMTc0MiksIHhrbXBXOiB1KDc3OCwgMTE0KSwgcXdYaUE6IGZ1bmN0aW9uIHF3WGlBKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIG1la0JiOiBmdW5jdGlvbiBtZWtCYihuLCB1KXsgcmV0dXJuIG4gPT09IHU7IH0sIFZOUEpLOiB1KDI2OTksIDM5MjUpLCBsemJiWTogdSgyMDA5LCAzMzExKSwgaXZEZm06IGZ1bmN0aW9uIGl2RGZtKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgVk5IaFM6IGZ1bmN0aW9uIFZOSGhTKG4sIHUsIHIsIHQpeyByZXR1cm4gbih1LCByLCB0KTsgfSwgZkJ1UGQ6IGZ1bmN0aW9uIGZCdVBkKG4sIHUpeyByZXR1cm4gbiAtIHU7IH0sIFJ5Y0pOOiBmdW5jdGlvbiBSeWNKTihuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIG4odSwgciwgdCwgZSwgaSk7IH0sIHdpY1F1OiB1KDI5MzksIDI2MjUpLCBhYURKUTogdSgxNzg4LCA3NjYpLCBOQ0JjRDogdSgxOTMxLCAyOTU0KSwga1JWaEg6IGZ1bmN0aW9uIGtSVmhIKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgeEJmSUg6IGZ1bmN0aW9uIHhCZklIKG4sIHUpeyByZXR1cm4gbiA9PT0gdTsgfSwgc0lpanc6IHUoMTgyNiwgMjE1NCksIGF3ZW1OOiBmdW5jdGlvbiBhd2VtTihuLCB1KXsgcmV0dXJuIG4gLSB1OyB9LCB0RFNlWDogZnVuY3Rpb24gdERTZVgobiwgdSl7IHJldHVybiBuICsgdTsgfSwgV05WVng6IGZ1bmN0aW9uIFdOVlZ4KG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgTURXbVI6IGZ1bmN0aW9uIE1EV21SKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgYmFpWVY6IGZ1bmN0aW9uIGJhaVlWKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgVWlHcHg6IGZ1bmN0aW9uIFVpR3B4KG4sIHUpeyByZXR1cm4gbiArIHU7IH0sIHNkeXVMOiBmdW5jdGlvbiBzZHl1TChuLCB1KXsgcmV0dXJuIG4gKyB1OyB9LCBWTnhzajogZnVuY3Rpb24gVk54c2oobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBaaXJERzogZnVuY3Rpb24gWmlyREcobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBvcnZrcDogZnVuY3Rpb24gb3J2a3AobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBIU1lsQjogZnVuY3Rpb24gSFNZbEIobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBGa1dTYjogZnVuY3Rpb24gRmtXU2IobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBPZ1R6TTogZnVuY3Rpb24gT2dUek0obiwgdSl7IHJldHVybiBuICsgdTsgfSwgTUl1ZUk6IGZ1bmN0aW9uIE1JdWVJKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgWUhSSGs6IGZ1bmN0aW9uIFlIUkhrKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgVVluaXQ6IGZ1bmN0aW9uIFVZbml0KG4sIHUpeyByZXR1cm4gbiArIHU7IH0sIGhIUkZrOiBmdW5jdGlvbiBoSFJGayhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIHRtRkRnOiBmdW5jdGlvbiB0bUZEZyhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIFBEQXNVOiBmdW5jdGlvbiBQREFzVShuLCB1KXsgcmV0dXJuIG4gKyB1OyB9LCBWTnRUeDogZnVuY3Rpb24gVk50VHgobiwgdSwgcil7IHJldHVybiBuKHUsIHIpOyB9LCBYaVNIejogZnVuY3Rpb24gWGlTSHoobiwgdSl7IHJldHVybiBuICsgdTsgfSwgWVBGblE6IGZ1bmN0aW9uIFlQRm5RKG4sIHUpeyByZXR1cm4gbiArIHU7IH0sIGdpTmRyOiBmdW5jdGlvbiBnaU5kcihuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIFpZemFnOiBmdW5jdGlvbiBaWXphZyhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIHRibEpPOiBmdW5jdGlvbiB0YmxKTyhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIHV5VUh2OiBmdW5jdGlvbiB1eVVIdihuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIFNLQ2dWOiBmdW5jdGlvbiBTS0NnVihuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIEthclJiOiBmdW5jdGlvbiBLYXJSYihuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIHdocGpCOiBmdW5jdGlvbiB3aHBqQihuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIHFicENWOiBmdW5jdGlvbiBxYnBDVihuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIGhNU2xhOiBmdW5jdGlvbiBoTVNsYShuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIFVTeHZwOiBmdW5jdGlvbiBVU3h2cChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIEtWemZlOiBmdW5jdGlvbiBLVnpmZShuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIFVaTklCOiBmdW5jdGlvbiBVWk5JQihuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIG5UaU5YOiBmdW5jdGlvbiBuVGlOWChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIFVzYWFEOiBmdW5jdGlvbiBVc2FhRChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIHBFRFhoOiBmdW5jdGlvbiBwRURYaChuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIG9jWFNPOiBmdW5jdGlvbiBvY1hTTyhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIGZjdXVrOiBmdW5jdGlvbiBmY3V1ayhuLCB1LCByKXsgcmV0dXJuIG4odSwgcik7IH0sIFJQVnliOiB1KDE2MDksIDc2NSkgKyB1KDIwNDcsIDE2NzUpICsgdSgxNDI1LCAxMzc4KSArIHUoMjU4MSwgMjYwNCkgKyB1KDI0MzcsIDM5ODIpICsgdSgxNDI0LCAzMDQpICsgdSgxODAxLCAxNjIxKSArIHUoMTI4NiwgMzI2OCkgKyB1KDI0MjgsIDIyOTUpICsgdSg3MDcsIDc2OSkgKyB1KDIwNTYsIDIyMTApICsgdSgxOTY0LCA0NTkpICsgIjg5IiwgZ1FnV1k6IGZ1bmN0aW9uIGdRZ1dZKG4sIHUsIHIpeyByZXR1cm4gbih1LCByKTsgfSwgVEVaVFk6IGZ1bmN0aW9uIFRFWlRZKG4peyByZXR1cm4gbigpOyB9LCB5TERpdzogZnVuY3Rpb24geUxEaXcobiwgdSl7IHJldHVybiBuICsgdTsgfSwgalFnYWM6IGZ1bmN0aW9uIGpRZ2FjKG4sIHUpeyByZXR1cm4gbiArIHU7IH0sIGtCWmlLOiBmdW5jdGlvbiBrQlppSyhuLCB1KXsgcmV0dXJuIG4gKyB1OyB9LCB1ZWphaTogZnVuY3Rpb24gdWVqYWkobiwgdSl7IHJldHVybiBuICsgdTsgfSwgQURaaEw6IGZ1bmN0aW9uIEFEWmhMKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgc3FDWWs6IGZ1bmN0aW9uIHNxQ1lrKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgREpmQUQ6IGZ1bmN0aW9uIERKZkFEKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gbih1LCByLCB0LCBlLCBpKTsgfSwgREhkdUI6IGZ1bmN0aW9uIERIZHVCKG4sIHUpeyByZXR1cm4gbiA8IHU7IH0sIHFOdnNNOiBmdW5jdGlvbiBxTnZzTShuLCB1KXsgcmV0dXJuIG4gIT09IHU7IH0sIHVlcnZtOiB1KDE3NTYsIDE1MjkpICsgdSgxNjI2LCAyMjg1KSwgS3BmVFI6IGZ1bmN0aW9uIEtwZlRSKG4sIHUpeyByZXR1cm4gbiAlIHU7IH0sIFBoS3p5OiBmdW5jdGlvbiBQaEt6eShuLCB1KXsgcmV0dXJuIG4gKyB1OyB9LCBxSmZMbDogZnVuY3Rpb24gcUpmTGwobiwgdSl7IHJldHVybiBuIC0gdTsgfSwgcU5rQmQ6IGZ1bmN0aW9uIHFOa0JkKG4sIHUpeyByZXR1cm4gbih1KTsgfSwgT2dBYWc6IGZ1bmN0aW9uIE9nQWFnKG4sIHUpeyByZXR1cm4gbih1KTsgfSwgS0FqVWs6IGZ1bmN0aW9uIEtBalVrKG4sIHUpeyByZXR1cm4gbih1KTsgfSwgb3ZzVW06IGZ1bmN0aW9uIG92c1VtKG4sIHUpeyByZXR1cm4gbih1KTsgfSB9LCBFID0gU1t1KDE0NzcsIDEwNDcpXTsgZnVuY3Rpb24gYihuLCByLCB0KXsgcmV0dXJuIHUobiAtIDgzNSwgdCk7IH0gciA9IFNbdSgyMzM5LCAyNTY2KV0oYXRvYiwgcik7IHZhciBIID0gIiI7IGZ1bmN0aW9uIE8obiwgciwgdCwgZSwgaSl7IGZ1bmN0aW9uIGYobiwgdSwgcil7IHJldHVybiB5KDAsIDAsIDAsIHIsIG4gLSAtMTYpOyB9IGZ1bmN0aW9uIGMobiwgdSwgcil7IHJldHVybiBiKHIgLSA5NiwgMCwgdSk7IH0gZnVuY3Rpb24gbyhuLCB1LCByLCB0LCBlKXsgcmV0dXJuIE4oMCwgMCwgMCwgdSwgZSAtIDc2KTsgfSBmdW5jdGlvbiBhKG4sIHUsIHIsIHQpeyByZXR1cm4geSgwLCAwLCAwLCByLCB0IC0gNDMxKTsgfSBpZiAoU1tjKDAsIDM4MzAsIDM3NDYpXShTW2EoLTE4NSwgODI4LCA4NTgsIDYyMyldLCBTW2MoMCwgMjU4OCwgMTUwNyldKSkgcmV0dXJuIFNbbygzNzkwLCA0MDkzLCAyOTUwLCAwLCAzNTA4KV0oRSwgX0wsIEgpOyB2YXIgdiA9IHsgaVZiZG86IGZ1bmN0aW9uIGlWYmRvKG4sIHUsIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIsIHQpeyByZXR1cm4gYygwLCByLCB0IC0gLTY0OCk7IH0gcmV0dXJuIFNbZigzNDAxIC0gMTM4MiwgKGUgPSA0MjE0KSAtIDIyOSwgZSldKFNbbygxMTgxIC0gMjk1LCA3OTQsIDIwMjcgLSAxNTMsIDAsIDE4OTMgLSAtMjI4KV0sIFNbdCgwLCAwLCAyMDIzLCAxNjYzKV0pID8gU1t0KDAsIDAsIDIyMTMsIDkyNildKG4sIHUsIHIpIDogUzsgdmFyIGU7IH0sIEtIbWdQOiBmdW5jdGlvbiBLSG1nUChuLCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIG8obiAtIDM2NiwgbiwgciAtIDEsIDAsIGUgLSAtMTQ2NSk7IH0gdmFyIGUgPSB7IHhwa0dMOiBmdW5jdGlvbiB4cGtHTChuLCByLCB0KXsgcmV0dXJuIFNbdSgyNzY3LCAyNjM0KV0obiwgciwgdCk7IH0gfTsgcmV0dXJuIFNbYygwLCAzMzAsIDExOTIgLSAtMTE4MCldKFNbdCgxNjkzLCAwLCA3NTIsIDAsIDE5MTQpXSwgU1t0KDE2MDgsIDAsIDIxNzQsIDAsIDE5MTQpXSkgPyBTW3QoMzU0NiwgMCwgMzcxNSwgMCwgMjQwNCldKG4sIHIpIDogZVthKDMyNjUgLSAyMzMsIDY4MSAtIDM3OCwgMTYyNywgMTk2MyAtIDE4NildKEUsIF9MLCBIKTsgfSB9OyByZXR1cm4gdltTW28oMjI4NCwgMTUyMywgMTM5MCwgMCwgMTM4NCldKF9MLCA1MzEsIDQ0NSldKHEsIHZbU1tSKDAsIDAsIDAsIDIxMjAgLSAzMDQsIDExMzMpXShfTCwgNjE1LCA0NDUpXShpLCAtODA0KSwgdCk7IH0hIGZ1bmN0aW9uKCl7IGZ1bmN0aW9uIG4obiwgdSwgciwgdCwgZSl7IHJldHVybiBZKG4sIGUgLSAtNDU3KTsgfSBmdW5jdGlvbiByKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gTigwLCAwLCAwLCBlLCByIC0gLTE2MjcpOyB9IGZ1bmN0aW9uIHQobiwgdSwgcil7IHJldHVybiBOKDAsIDAsIDAsIHIsIG4gLSAxMzYpOyB9IHZhciBlID0geyBQelZlRzogZnVuY3Rpb24gUHpWZUcobiwgcil7IHJldHVybiBTW3UoMTQ0MSwgMTY0MyldKG4sIHIpOyB9IH07IGZ1bmN0aW9uIGkobiwgdSwgciwgdCwgZSl7IHJldHVybiBZKGUsIHQgLSAtNTAzKTsgfSBmdW5jdGlvbiBmKG4sIHUsIHIpeyByZXR1cm4gUigwLCAwLCAwLCBuIC0gMzY4LCByKTsgfSBpZiAoU1tyKDAsIDAsIDEwNzcsIDAsIDEyOTYpXShTW2koMCwgMCwgMCwgNjA3LCA0NjEpXSwgU1tpKDAsIDAsIDAsIDQ4MSwgMzQxKV0pKSByZXR1cm4gX0wgPSB3W0dbU1t0KDI1MDYsIDAsIDEzOTMpXSh6LCAyNzcsIDAsIDE4OCldKFAsIDQxOCwgNjA2KV0oeiwgYXJndW1lbnRzKSwgcSA9IG51bGw7IGZvciAodmFyIGMgPSBTW2YoMjQ1NiwgMCwgM2UzKV0oX2QpOzspIHRyeSB7IGlmICghU1t0KDMzMDIsIDAsIDI2MDApXShTW3IoMCwgMCwgLTIxNiwgMCwgLTEyNzIpXSwgU1tpKDAsIDAsIDAsIDI4MywgNzg4KV0pKSByZXR1cm4gZVtyKDAsIDAsIC0xNiwgMCwgLTUyNCldKF9kLCBFKTsgaWYgKFNbdCgzMTI0LCAwLCAyOTU2KV0oNTkwOTQ5LCBTW2koMCwgMCwgMCwgNDYsIDQzKV0oU1tmKC03NCwgMCwgLTEyOSldKFNbbigtMzY2LCAwLCAwLCAwLCA5MildKFNbdCgxMzEwLCAwLCAxMTgyKV0oU1tmKDI0ODMsIDAsIDMyMDMpXShTW3QoMjg4MiwgMCwgMzEzNyldKFNbbigxMzAxLCAwLCAwLCAwLCAxNjE5KV0oLVNbZigyMTg1LCAwLCAyMTU5KV0ocGFyc2VJbnQsIFNbcigwLCAwLCAtMTg4LCAwLCAxMTM2KV0oX0wsIDQ3OSwgMTA0MykpLCBTW2YoNTEyLCAwLCAtMjU2KV0oLVNbcigwLCAwLCAxMjMyLCAwLCA1OTYpXShwYXJzZUludCwgU1tyKDAsIDAsIDE5NjAsIDAsIDI3NzApXShfTCwgNTQwLCA4MjgpKSwgMikpLCBTW2YoMjI3MywgMCwgMzI2NyldKFNbaSgwLCAwLCAwLCAyMTkxLCAyNTIwKV0ocGFyc2VJbnQsIFNbdCgxNDE2LCAwLCAyNzAyKV0oX0wsIDQ0MCwgNzIxKSksIDMpKSwgU1tyKDAsIDAsIDEwNzQsIDAsIDE2NTgpXShTW24oNjY0LCAwLCAwLCAwLCAzMDApXShTW2koMCwgMCwgMCwgNzQyLCAtMTA5KV0ocGFyc2VJbnQsIFNbaSgwLCAwLCAwLCAyMzA0LCAxMjUyKV0oX0wsIDU3NSwgMTI0NSkpLCA0KSwgU1tyKDAsIDAsIC0yNDUsIDAsIC04OTUpXSgtU1t0KDIxNzUsIDAsIDEwOTcpXShwYXJzZUludCwgU1tuKDI5MiwgMCwgMCwgMCwgMjI2KV0oX0wsIDU0OSwgNjkyKSksIDUpKSksIFNbdCgxMzQ2LCAwLCAyMjE2KV0oU1t0KDIxNzUsIDAsIDEzNjQpXShwYXJzZUludCwgU1tpKDAsIDAsIDAsIDE1MiwgMTM5MSldKF9MLCAzOTcsIC0zODApKSwgNikpLCBTW2YoMjEwNywgMCwgMjQ4NSldKC1TW3QoMzU2OSwgMCwgMjc1MSldKHBhcnNlSW50LCBTW2koMCwgMCwgMCwgMjIzMSwgMzIxMildKF9MLCA0MjgsIDU4NikpLCA3KSksIFNbbig3MzAsIDAsIDAsIDAsIDY2NyldKC1TW24oODYzLCAwLCAwLCAwLCA4MzYpXShwYXJzZUludCwgU1tpKDAsIDAsIDAsIDIzMDQsIDE4NjMpXShfTCwgNDE4LCA2NzEpKSwgOCkpLCBTW2koMCwgMCwgMCwgMTE2OCwgMjM4MCldKFNbaSgwLCAwLCAwLCA3NTEsIDIwNTApXShTW2koMCwgMCwgMCwgNzEwLCAxMDQxKV0ocGFyc2VJbnQsIFNbbigyMTEwLCAwLCAwLCAwLCAyMTE4KV0oX0wsIDU4MSwgMTE4MikpLCA5KSwgU1t0KDM0OTEsIDAsIDI3ODMpXShTW2YoMjE3NiwgMCwgMTQwNyldKHBhcnNlSW50LCBTW3QoMTU3NSwgMCwgOTg0KV0oX0wsIDU0MiwgMTE2NSkpLCAxMCkpKSkpIGJyZWFrOyBjW2YoMjE4MywgMCwgMjY0MCldKGNbdCgxNDA2LCAwLCAxODI3KV0oKSk7IH0gY2F0Y2ggKG4peyBpZiAoU1tyKDAsIDAsIDE4NTMsIDAsIDg5NCldKFNbaSgwLCAwLCAwLCAxMDY1LCAyNTYpXSwgU1tmKDk0NSwgMCwgMTM2OSldKSkgcmV0dXJuIFNbdCgxOTAwLCAwLCA2MzQpXShFLCAwLCAwLCAwLCBfTCwgU1tpKDAsIDAsIDAsIDM0LCAtOTY5KV0oSCwgLTUyMykpOyBjW3QoMzU2NywgMCwgNDc5NyldKGNbdCgxNDA2LCAwLCA3ODcpXSgpKTsgfSB9KCksIGZ1bmN0aW9uKCl7IHZhciBzID0geyBCaWJ4YjogZnVuY3Rpb24gQmlieGIobiwgciwgdCl7IHJldHVybiBTW3UoMjAzMCwgMzA0NyldKG4sIHIsIHQpOyB9LCBDbUNZZDogZnVuY3Rpb24gQ21DWWQobiwgcil7IHJldHVybiBTW3UoMjQxOSwgMTc2MildKG4sIHIpOyB9LCBRZk9LaTogU1tKKDQxNDQsIDQ3MzgpXSwgR05SQ2Q6IFNbSSgyODk2LCAyNzg1LCAxNzgxLCAyNTcwKV0sIG1mYXdWOiBmdW5jdGlvbiBtZmF3VihuLCB1KXsgcmV0dXJuIFNbSSgociA9IDE4NDQpIC0gLTkyLCAxNDU3IC0gMzY2LCByIC0gMTc4LCAxOTE3KV0obiwgdSk7IHZhciByOyB9LCB4Qnp5aDogU1tKKDE3ODQsIDI1MTYpXSwgcGttdVk6IFNbSigyMzYyLCAyMjE2KV0sIEpabmZNOiBmdW5jdGlvbiBKWm5mTShuLCB1KXsgcmV0dXJuIFNbSSgxNjMyIC0gLTEwMTIsIDI3ODAgLSAyMTIsIChyID0gMjA3MCkgLSA0MDUsIHIpXShuLCB1KTsgdmFyIHI7IH0sIGVXWWZFOiBmdW5jdGlvbiBlV1lmRShuLCB1KXsgcmV0dXJuIFNbZyhyID0gNjQ4LCAodCA9IDEzMTQpIC0gMTEsIDAsIDAsIHIpXShuLCB1KTsgdmFyIHIsIHQ7IH0sIGtIdGFIOiBmdW5jdGlvbiBrSHRhSChuLCB1KXsgcmV0dXJuIFNbRCgwLCAyMTU1LCAwLCAyMDA4KV0obiwgdSk7IH0sIEdvZXN2OiBTW0ooMjMwMywgMzQ0OSldLCB0b01GYTogU1tEKDAsIDEzODIsIDAsIDM5NSldLCBJZmdWdjogZnVuY3Rpb24gSWZnVnYobiwgdSl7IHJldHVybiBTW0koKHQgPSAzODEwKSAtIDc5NiwgKHIgPSAzNDU1KSAtIDMzMiwgdCAtIDQ4NiwgcildKG4sIHUpOyB2YXIgciwgdDsgfSwgSnh5emE6IFNbbygwLCA5NzYsIDEwNzIpXSwgQ1p3QXM6IFNbbygwLCAxODQzLCAyNTA1KV0sIE54VlJjOiBTW0QoMCwgMjI0MywgMCwgMzI5OCldLCBNc0hnYjogU1tJKDE4NjYsIDk5MSwgNTQwLCA4NjApXSwgU25BRFY6IGZ1bmN0aW9uIFNuQURWKG4peyByZXR1cm4gU1tvKDAsICh1ID0gLTE4MikgLSAtOTkzLCAyNDQpXShuKTsgdmFyIHU7IH0sIFZsaklqOiBmdW5jdGlvbiBWbGpJaihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFNbZygwLCAxNDAyIC0gODg2LCAwLCBpID0gMzUzLCBpKV0obiwgdSwgciwgdCwgZSk7IHZhciBpOyB9LCBkWnpCdDogU1tKKDI3MDQsIDI2NDcpXSwgZ0toZmo6IFNbSSgxMzYxLCA1MzQsIDI2MDQsIDIyNjgpXSwgU2FyZVE6IGZ1bmN0aW9uIFNhcmVRKG4sIHUpeyByZXR1cm4gU1tKKDMxODAgLSAtNjM1LCByID0gMjA4MCldKG4sIHUpOyB2YXIgcjsgfSwgYnFnSWc6IGZ1bmN0aW9uIGJxZ0lnKG4sIHUpeyByZXR1cm4gU1tKKChyID0gMTYxKSAtIC0xNTUzLCA3MDApXShuLCB1KTsgdmFyIHI7IH0sIGxYWWpEOiBTW28oMCwgNzcyLCAyMjIpXSwgVHdMYmc6IFNbSigzOTYzLCAzMzQ2KV0sIHJ2TERsOiBmdW5jdGlvbiBydkxEbChuLCB1KXsgcmV0dXJuIFNbSigociA9IDI2MzUpIC0gLTEyNDIsIDI3MTEpXShuLCB1KTsgdmFyIHI7IH0sIGdEalNWOiBmdW5jdGlvbiBnRGpTVihuLCB1KXsgcmV0dXJuIFNbSigxNjcgLSAtMTMyNywgciA9IDUxMyldKG4sIHUpOyB2YXIgcjsgfSwgd3dGanY6IGZ1bmN0aW9uIHd3Rmp2KG4sIHUsIHIpeyByZXR1cm4gU1tEKHQgPSAzMzQsIHQgLSAtMTE1NCwgMCwgMTA1MCldKG4sIHUsIHIpOyB2YXIgdDsgfSwgS21XcHM6IGZ1bmN0aW9uIEttV3BzKG4sIHUsIHIpeyByZXR1cm4gU1tJKChlID0gMTk4KSAtIC01NzUsIDk1MyAtIDQ2MywgKHQgPSAxNDM1KSAtIDEwNiwgdCldKG4sIHUsIHIpOyB2YXIgdCwgZTsgfSwgdHpxWEs6IGZ1bmN0aW9uIHR6cVhLKG4sIHUsIHIpeyByZXR1cm4gU1tvKDAsIDI0ODQsIDEzOTIpXShuLCB1LCByKTsgfSwgWFFMVGU6IGZ1bmN0aW9uIFhRTFRlKG4sIHUpeyByZXR1cm4gU1tEKHIgPSAyMDg4LCByIC0gLTE0NjYsIDAsIHQgPSAyMjA0KV0obiwgdSk7IHZhciByLCB0OyB9LCBDRXBsQTogZnVuY3Rpb24gQ0VwbEEobiwgdSl7IHJldHVybiBTW0ooKHIgPSAxMTY1KSAtIC01NDksIHQgPSA1OTkpXShuLCB1KTsgdmFyIHIsIHQ7IH0sIHJFS1hHOiBTW2coMCwgMTY3NSwgMCwgMCwgMjc4NildLCBrdUNMdDogU1tvKDAsIDI2OTEsIDMyODgpXSwgTG1leVk6IGZ1bmN0aW9uIExtZXlZKG4sIHUsIHIpeyByZXR1cm4gU1tnKHQgPSAxMDAzLCB0IC0gLTI5NCwgMCwgZSA9IDE5NzcsIGUpXShuLCB1LCByKTsgdmFyIHQsIGU7IH0sIExOUkdnOiBmdW5jdGlvbiBMTlJHZyhuLCB1KXsgcmV0dXJuIFNbSigociA9IDExMjEpIC0gLTE2MTQsIHQgPSAxNjEwKV0obiwgdSk7IHZhciByLCB0OyB9LCBOZk5FVDogZnVuY3Rpb24gTmZORVQobiwgdSl7IHJldHVybiBTW0QociA9IDI2NjgsIHIgLSAtMTAxOCwgMCwgNDAwOCldKG4sIHUpOyB2YXIgcjsgfSwgQ1VGd246IFNbRCgwLCAxNTQyLCAwLCAzNDApXSwgUk96S2I6IFNbSSgyMTc4LCAzMzQ0LCAxNjUyLCAyMDc3KV0sIHZFcUZpOiBmdW5jdGlvbiB2RXFGaShuLCB1KXsgcmV0dXJuIFNbRCgwLCAociA9IDMzNTMpIC0gLTI0NSwgMCwgdCA9IDM4MzQpXShuLCB1KTsgdmFyIHIsIHQ7IH0sIHJzZmlUOiBmdW5jdGlvbiByc2ZpVChuLCB1LCByKXsgcmV0dXJuIFNbRCgwLCAxMDczIC0gLTQ1NCwgdCA9IDIxNzksIHQpXShuLCB1LCByKTsgdmFyIHQ7IH0sIGVRTEdqOiBmdW5jdGlvbiBlUUxHaihuLCB1KXsgcmV0dXJuIFNbRCgwLCAociA9IDkwMykgLSAtMzA4LCAwLCB0ID0gMTQzNildKG4sIHUpOyB2YXIgciwgdDsgfSwgVmJMV3A6IFNbRCgwLCAxOTQ0LCAwLCAxMTY1KV0sIHpVaFlKOiBTW28oMCwgMTkxMSwgMzA1NSldLCBSZ3RXZDogZnVuY3Rpb24gUmd0V2Qobil7IHJldHVybiBTW0QodSA9IDM4MTcsIDM5NDkgLSAxOTYsIDAsIHUpXShuKTsgdmFyIHU7IH0sIHdQTnR4OiBTW0QoMCwgMTk2NCwgMCwgMjE3MCldLCBRTXBkcjogZnVuY3Rpb24gUU1wZHIobiwgdSl7IHJldHVybiBTW0QoMCwgMjc1IC0gLTk2MywgMCwgciA9IDcwNCldKG4sIHUpOyB2YXIgcjsgfSwgU216dG06IGZ1bmN0aW9uIFNtenRtKG4sIHUpeyByZXR1cm4gU1tnKHIgPSAzMDAxLCByIC0gMjc2LCAwLCAwLCAzNjE5KV0obiwgdSk7IHZhciByOyB9LCB0aXdSajogU1tnKDAsIDE4NTcsIDAsIDAsIDI2ODIpXSwgSFdWeXY6IGZ1bmN0aW9uIEhXVnl2KG4sIHUpeyByZXR1cm4gU1tEKHIgPSAyMTE3LCAyMjIzIC0gLTg4MywgMCwgcildKG4sIHUpOyB2YXIgcjsgfSwgaVVJSHg6IGZ1bmN0aW9uIGlVSUh4KG4sIHUsIHIpeyByZXR1cm4gU1tJKC0xNjMgLSAtOTM2LCAtOTMxIC0gMTMzLCAodCA9IDM5MikgLSAzNjksIHQpXShuLCB1LCByKTsgdmFyIHQ7IH0sIGZXYWpLOiBmdW5jdGlvbiBmV2FqSyhuLCB1KXsgcmV0dXJuIFNbZygwLCA2OTAgLSAtMzMsIHIgPSAxNjYsIDAsIHIpXShuLCB1KTsgdmFyIHI7IH0sIHZBWUhGOiBTW0QoMCwgMTU3MywgMCwgMjc3OCldLCBBa1dBdzogU1tvKDAsIDE2MDQsIDMxMCldLCB2SXVBSDogZnVuY3Rpb24gdkl1QUgobiwgdSl7IHJldHVybiBTW0ooKHIgPSAxNzI3KSAtIC0zNzEsIDI3MTMpXShuLCB1KTsgdmFyIHI7IH0sIEpRU2xEOiBmdW5jdGlvbiBKUVNsRChuLCB1LCByKXsgcmV0dXJuIFNbSigodCA9IDMyOTEpIC0gLTYzMSwgNDUxNCldKG4sIHUsIHIpOyB2YXIgdDsgfSwgT2ZVa0s6IFNbbygwLCAyMTMxLCAxODYzKV0sIEZubVR0OiBTW0ooMzI2MiwgMjY4MCldLCBEbXBjSzogZnVuY3Rpb24gRG1wY0sobiwgdSl7IHJldHVybiBTW0ooMTQxNyAtIC03NywgciA9IDg2MSldKG4sIHUpOyB2YXIgcjsgfSwgUW1FV2k6IGZ1bmN0aW9uIFFtRVdpKG4sIHUpeyByZXR1cm4gU1tJKChyID0gMjc1NykgLSAtMjU5LCAzODcxIC0gNDc4LCByIC0gNDY5LCAyNjI2KV0obiwgdSk7IHZhciByOyB9LCBlRlJvSTogU1tEKDAsIDEzNzYsIDAsIDYxMildLCBGTnNBczogU1tKKDM0ODUsIDQ3NzMpXSwgR1NHcGQ6IGZ1bmN0aW9uIEdTR3BkKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gU1tJKChmID0gMjc3NikgLSAtMTI1LCBmIC0gNDM3LCAzNzgwIC0gNDQ1LCAyOTM4KV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmOyB9LCBLcWlxSDogZnVuY3Rpb24gS3FpcUgobiwgdSl7IHJldHVybiBTW0ooKHIgPSAyNDE1KSAtIC0zMjAsIDE4MDMpXShuLCB1KTsgdmFyIHI7IH0sIGhjVXN4OiBmdW5jdGlvbiBoY1VzeChuLCB1KXsgcmV0dXJuIFNbSigxMzExIC0gLTg1MCwgciA9IDMyNCldKG4sIHUpOyB2YXIgcjsgfSwgb1pSWkk6IFNbRCgwLCAyNDAxLCAwLCAxOTg5KV0sIGxyenZnOiBTW0ooMjIzNCwgMTQ5NyldLCBxekNySzogZnVuY3Rpb24gcXpDcksobiwgdSwgcil7IHJldHVybiBTW0ooKHQgPSAzNzgxKSAtIC05OSwgZSA9IDMyNDgpXShuLCB1LCByKTsgdmFyIHQsIGU7IH0sIExNbnlpOiBmdW5jdGlvbiBMTW55aShuLCB1KXsgcmV0dXJuIFNbbyhyID0gMTIwLCByIC0gLTQ0MiwgdCA9IC0xMTcyKV0obiwgdSk7IHZhciByLCB0OyB9LCBaUXhLSzogZnVuY3Rpb24gWlF4S0sobiwgdSl7IHJldHVybiBTW0ooKHIgPSA1OTcpIC0gLTE0NzUsIC0xMjQpXShuLCB1KTsgdmFyIHI7IH0sIHJ5R2tUOiBTW28oMCwgMjQwMiwgMzM3MSldLCBpSW1uUzogZnVuY3Rpb24gaUltblMobiwgdSl7IHJldHVybiBTW0ooMTk4MSAtIC02NDYsIHIgPSAyNzE3KV0obiwgdSk7IHZhciByOyB9LCBSTFVoYTogU1tnKDAsIDI2OTksIDAsIDAsIDE2NTUpXSwgdEFVeVo6IFNbRCgwLCAzMzg2LCAwLCAzNTY2KV0sIFZnS3JrOiBmdW5jdGlvbiBWZ0tyayhuLCB1LCByKXsgcmV0dXJuIFNbbygwLCA2MDYsIDE1OTQpXShuLCB1LCByKTsgfSwgRG9FUnM6IGZ1bmN0aW9uIERvRVJzKG4sIHUsIHIpeyByZXR1cm4gU1tEKHQgPSA5MTgsIDU4MCAtIC05NDcsIDAsIHQpXShuLCB1LCByKTsgdmFyIHQ7IH0sIEF4bnFvOiBmdW5jdGlvbiBBeG5xbyhuLCB1KXsgcmV0dXJuIFNbSSgxNzgwIC0gLTU4NCwgNzAyIC0gMzk4LCAxOTAzIC0gMzAzLCByID0gNTU4KV0obiwgdSk7IHZhciByOyB9LCBqSGVMYjogU1tJKDIyNjYsIDMyNTcsIDE5NjAsIDIxNTcpXSwgbHFFcmM6IGZ1bmN0aW9uIGxxRXJjKG4sIHUsIHIsIHQpeyByZXR1cm4gU1tnKDAsIDIzNTQgLSA3NjQsIGUgPSAzMDY5LCAwLCBlKV0obiwgdSwgciwgdCk7IHZhciBlOyB9LCBrZUFlUjogZnVuY3Rpb24ga2VBZVIobiwgdSwgcil7IHJldHVybiBTW0koKHQgPSAxNjY4KSAtIDU1LCB0IC0gMTU4LCAoZSA9IDEyMTkpIC0gMjI1LCBlKV0obiwgdSwgcik7IHZhciB0LCBlOyB9LCBaaXhrUjogZnVuY3Rpb24gWml4a1IobiwgdSl7IHJldHVybiBTW28oMCwgMTQ3OSwgMzQ4NyldKG4sIHUpOyB9LCBhTkJZSjogZnVuY3Rpb24gYU5CWUoobiwgdSl7IHJldHVybiBTW2cociA9IDEyMjksIHIgLSAyNDIsIHQgPSAyMDc0LCAwLCB0KV0obiwgdSk7IHZhciByLCB0OyB9LCBOY05PbTogU1tKKDM5ODUsIDM0MzQpXSwgbmJYb2U6IGZ1bmN0aW9uIG5iWG9lKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gU1tJKDIzMTEgLSA3LCAyNjE4IC0gMzYxLCAzMDg0IC0gNDA4LCBpID0gMzA3MCldKG4sIHUsIHIsIHQsIGUpOyB2YXIgaTsgfSwgd0NOUEo6IGZ1bmN0aW9uIHdDTlBKKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gU1tnKDAsIDIwODkgLSA0MDYsIDAsIGYgPSAxMTMyLCBmKV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmOyB9LCBES1RJVTogZnVuY3Rpb24gREtUSVUobiwgdSwgciwgdCl7IHJldHVybiBTW2coMCwgKGUgPSAxODUyKSAtIDI2MiwgMCwgaSA9IDIyNzgsIGkpXShuLCB1LCByLCB0KTsgdmFyIGUsIGk7IH0sIENEWUFaOiBmdW5jdGlvbiBDRFlBWihuLCB1KXsgcmV0dXJuIFNbbygwLCAociA9IDIyNDIpIC0gODQwLCAxMzU1KV0obiwgdSk7IHZhciByOyB9LCBJQXJ5ajogZnVuY3Rpb24gSUFyeWoobiwgdSwgcil7IHJldHVybiBTW2codCA9IDg5NywgMTM5IC0gLTM4NSwgMCwgMCwgdCldKG4sIHUsIHIpOyB2YXIgdDsgfSwgc3ZJTlY6IGZ1bmN0aW9uIHN2SU5WKG4sIHUpeyByZXR1cm4gU1tJKChyID0gMTQ1MCkgLSAyODYsIHIgLSAyNjksIDY4NSAtIDM1LCAxNjQyKV0obiwgdSk7IHZhciByOyB9LCBVVk1vaDogZnVuY3Rpb24gVVZNb2gobiwgdSwgcil7IHJldHVybiBTW0ooMTYzOSwgMTYxKV0obiwgdSwgcik7IH0sIFJsa25XOiBmdW5jdGlvbiBSbGtuVyhuLCB1LCByLCB0KXsgcmV0dXJuIFNbSigoaSA9IDI0NzcpIC0gLTgzMywgZSA9IDI0ODMpXShuLCB1LCByLCB0KTsgdmFyIGUsIGk7IH0sIHhMVWZhOiBmdW5jdGlvbiB4TFVmYShuLCB1LCByKXsgcmV0dXJuIFNbSSgodCA9IC0yNDgpIC0gLTk4NSwgMjkyIC0gNjEsIHQgLSA0MzgsIGUgPSAtMzc4KV0obiwgdSwgcik7IHZhciB0LCBlOyB9LCBrVHdJSzogZnVuY3Rpb24ga1R3SUsobiwgdSl7IHJldHVybiBTW28oMCwgMTc2OSwgMjY3NCldKG4sIHUpOyB9IH07IGZ1bmN0aW9uIG8obiwgdSwgcil7IHJldHVybiBiKHUgLSAtODAxLCAwLCByKTsgfSBmdW5jdGlvbiBsKG4sIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSih1IC0gLTE4MzAsIHQpOyB9IHZhciBlLCBpID0geyBuZENBTjogZnVuY3Rpb24gbmRDQU4obiwgciwgdCl7IHJldHVybiBzW3UoOTc2LCAzNjMpXShuLCByLCB0KTsgfSB9OyByZXR1cm4gc1t0KDAsIDczMywgLTExLCAxODgxLCAxNTcwKV0oc1t0KDAsIDI5NSwgLTI3MiwgMTMwNCwgLTg1KV0sIHNbdCgwLCAxMzIyLCAzNSwgMTc4NSwgMTg4OCldKSA/IF9MW2lbbygwLCA1MTAgLSAtNjYzLCAtMjQwKV0oSCwgNTMzLCA5ODEpXShPLCBDKSA6IHNbZyhlID0gMTA2NSwgMTE3MCAtIDMwOSwgMCwgMCwgZSldKF9MLCBzW28oMCwgMTU4MyAtIC01NzEsIDE5NjcpXShyLCAtMzcwKSwgbik7IH0gZnVuY3Rpb24gSyhuLCByLCB0KXsgZnVuY3Rpb24gZShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEooZSAtIC01NDUsIG4pOyB9IHZhciBpLCBmID0geyBMemVTaTogZnVuY3Rpb24gTHplU2kobiwgcil7IHJldHVybiBTW3UoMzEyOCwgMjY4MSldKG4sIHIpOyB9IH07IHJldHVybiBTW2UoMzg0NCwgMCwgMzQ3NSwgMjE3NywgMjg3NCldKFNbZSgyNDUwLCAwLCAxMCwgMTg5LCAxMTQxKV0sIFNbbygwLCAyOTcwIC0gMjI3LCAxOTE5KV0pID8gZltlKDMzNDEsIDAsIDMwMDgsIDQwODYsIDI3NjgpXShuLCBFKSA6IFNbZSgxMTc5LCAwLCAyMjY5LCAzNjk0LCAyNDg1KV0oX0wsIFNbRCgwLCAzMDczIC0gLTc2OSwgMCwgaSA9IDI1NDkpXShuLCAtNzIyKSwgdCk7IH0gZnVuY3Rpb24gRChuLCB1LCByLCB0KXsgcmV0dXJuIFIoMCwgMCwgMCwgdSAtIDE2NjUsIHQpOyB9IHZhciBRID0geyBZbE93bDogZnVuY3Rpb24gWWxPd2wobil7IGZ1bmN0aW9uIHUobiwgdSwgciwgdCl7IHJldHVybiBnKDAsIHUgLSA3OCwgMCwgMCwgbik7IH0gZnVuY3Rpb24gcihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEoociAtIC01OTEsIHUpOyB9IHJldHVybiBTW3IoMCwgMTA3MiwgMjMwOSwgMzYxOCwgMTA3OSldKFNbcigwLCAyMDI5LCAyOTU4LCAyNDM3LCAzMjAwKV0sIFNbdSgzNDk0LCAyNTEyLCAyMTgxLCAxMjc3KV0pID8gX0xbc1t1KC0zMDgsIDkzOSwgMTUwLCA4KV0oSCwgNDYyLCAxMzQ0KV0oTywgQykgOiBTW0QoMCwgMzA0MiAtIDIxNiwgMCwgMjAxNCldKG4pOyB9LCBVbmxGVjogZnVuY3Rpb24gVW5sRlYobiwgdSl7IGZ1bmN0aW9uIHIobiwgdSwgciwgdCwgZSl7IHJldHVybiBJKHQgLSA1NTcsIHUgLSAzMzEsIHIgLSAxNDMsIGUpOyB9IGZ1bmN0aW9uIHQobiwgdSwgciwgdCwgZSl7IHJldHVybiBJKHUgLSAtMTExOSwgdSAtIDI0OCwgciAtIDQ1MCwgdCk7IH0gcmV0dXJuIHNbcigwLCAzMzk5LCAyODE0LCAyMzIxLCAzMDQwKV0oc1t0KDAsIDEyMTIsIC04MywgNzU5LCA4NSldLCBzW3IoMCwgODkzLCAxMjIyLCAxODc2LCAyNzI2KV0pID8gc1t0KDAsIDU4LCAtOTc5LCAtOTE4LCAtMTYyKV0oRSwgX0wsIEgpIDogc1tnKDAsIChlID0gMzI4OSkgLSA0NzMsIDAsIGkgPSA0Mzc1LCBpKV0obiwgdSk7IHZhciBlLCBpOyB9LCBvaXNKcjogU1tKKDE2NDMsIDIwNzcpXShfTCwgNDcwLCA2OTcpLCByaUFEdzogZnVuY3Rpb24gcmlBRHcobiwgciwgdCl7IHZhciBlID0geyBHT3RvZTogZnVuY3Rpb24gR090b2Uobiwgcil7IHJldHVybiBzW3UoMjU5MywgMjgzMCldKG4sIHIpOyB9IH07IGZ1bmN0aW9uIGkobiwgdSwgciwgdCl7IHJldHVybiBEKDAsIHIgLSAtMTA2LCAwLCB0KTsgfSBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSihyIC0gLTEzNjksIG4pOyB9IHJldHVybiBzW2koMCwgMCwgMzU2MCwgMzM0MCldKHNbaSgwLCAwLCAxOTI5LCAyMDY4KV0sIHNbaSgwLCAwLCAxNjk5LCAxNTcwKV0pID8gZVtmKDE4ODAsIDAsIDI2MzMsIDMyMTksIDM1NzEpXShuLCBFKSA6IHNbZigxNTE3LCAwLCA2MDcsIDEwNjksIC03MTApXShuLCByLCB0KTsgfSwgWmlicEQ6IGZ1bmN0aW9uIFppYnBEKG4sIHIpeyB2YXIgdCA9IHsgY1FNcE86IGZ1bmN0aW9uIGNRTXBPKG4sIHIsIHQpeyByZXR1cm4gU1t1KDEyMzMsIDEyOTcpXShuLCByLCB0KTsgfSwgb094R3Y6IGZ1bmN0aW9uIG9PeEd2KG4sIHIpeyByZXR1cm4gU1t1KDMxMjgsIDI1MzgpXShuLCByKTsgfSB9OyBmdW5jdGlvbiBlKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSSh1IC0gNDQ5LCB1IC0gMzM3LCByIC0gNDk0LCBuKTsgfSBmdW5jdGlvbiBpKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSShuIC0gLTc3NCwgdSAtIDIwNSwgciAtIDI3OCwgcik7IH0gcmV0dXJuIFNbaSgxOTI4LCAxODI5LCAyODYwLCAwLCAxMjE1KV0oU1tpKDIyNTEsIDE4OTgsIDMwNDgsIDAsIDI5ODgpXSwgU1tlKDIzMDksIDE2MDYsIDE3MTksIDAsIDEyMjIpXSkgPyB0W28oMCwgMjI5NyAtIDE1MiwgMjQwNildKEUsIHRbaSgyNTc3LCAxODk2LCAxNjgzLCAwLCAyOTc2KV0oX0wsIC02OTEpLCBIKSA6IFNbZSg4OTgsIDExNDcsIDE5ODcsIDAsIDIzNTgpXShuLCByKTsgfSwgbU9TRFQ6IGZ1bmN0aW9uIG1PU0RUKG4sIHIpeyB2YXIgdCwgZSwgaSA9IHsgWVF0ZVA6IGZ1bmN0aW9uIFlRdGVQKG4sIHIsIHQpeyByZXR1cm4gc1t1KDk3NiwgMzA1OCldKG4sIHIsIHQpOyB9IH07IGZ1bmN0aW9uIGYobiwgdSwgciwgdCwgZSl7IHJldHVybiBKKHIgLSAtMTU2NiwgdSk7IH0gcmV0dXJuIHNbZigwLCA3OTEsIDc3MSwgLTMzMywgMTI5NyldKHNbZigwLCAxNzkzLCAyMjM5LCAzMjE0LCAxNTc5KV0sIHNbZygwLCAoZSA9IDE3ODcpIC0gLTY0LCAwLCAwLCAxOTEzKV0pID8gaVtnKDAsICh0ID0gMTY0NSkgLSA5MDgsIDAsIDAsIDE3NDgpXShFLCBfTCwgSCkgOiBzW28oMCwgMjIxNCAtIDYwLCAyMjk3KV0obiwgcik7IH0sIFJudWJSOiBmdW5jdGlvbiBSbnViUihuKXsgZnVuY3Rpb24gdShuLCB1KXsgcmV0dXJuIG8oMCwgdSAtIC05NDcsIG4pOyB9IHJldHVybiBzW3UoLTQ2OCwgNjUwKV0oc1t1KDEyODAsIDkzMCldLCBzW3UoMjgwMywgMjA0NCldKSA/IHNbSig4ODUgLSAtMTA5MSwgdCA9IDE3NTIpXShFLCBzW28oMCwgMTU2NCAtIC01OTAsIDI5MDUpXShfTCwgLTg5MSksIEgpIDogc1tnKHIgPSAyNzY4LCAxOTAwIC0gLTM4OSwgMCwgMCwgcildKG4pOyB2YXIgciwgdDsgfSwgYlhpb1k6IGZ1bmN0aW9uIGJYaW9ZKG4sIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIsIHQpeyByZXR1cm4gZygwLCB1IC0gMjE5LCAwLCAwLCB0KTsgfSB2YXIgZSwgaSwgZiA9IHsgVnlNTFY6IGZ1bmN0aW9uIFZ5TUxWKG4sIHIsIHQsIGUsIGkpeyByZXR1cm4gc1t1KDI5NjcsIDMyNzIpXShuLCByLCB0LCBlLCBpKTsgfSwgWXVoWEE6IGZ1bmN0aW9uIFl1aFhBKG4sIHIpeyByZXR1cm4gc1t1KDIxMjAsIDMxNzEpXShuLCByKTsgfSB9OyBmdW5jdGlvbiBjKG4sIHUsIHIsIHQpeyByZXR1cm4gRCgwLCBuIC0gMTQ4LCAwLCB0KTsgfSBpZiAoc1tJKChpID0gNjE1KSAtIC0xMTQ5LCAoZSA9IDE0NzkpIC0gMjk1LCBpIC0gNjIsIGUpXShzW2MoMjc5NCwgMCwgMCwgMjMzMCldLCBzW2MoMzg3NSwgMCwgMCwgMjk0NildKSl7IGYgPSBPW0NbZlt0KC01MjAsIDYyOSwgMTYzNCwgLTIxNCldKF9MLCAyMTgsIDAsIDAsIGZbRCgwLCAzNzYyIC0gMTUyLCAwLCAzNTYzKV0oZltjKDM3NTgsIDAsIDAsIDMzODUpXSgxNzIsIC04MSksIC0xMTgwKSldKHcsIDQxOCwgNjA2KV0oRywgYXJndW1lbnRzKTsgcmV0dXJuIHogPSBudWxsLCBmOyB9IHJldHVybiBzW3QoMjE0MiwgMjMyNSwgMTE5OCwgMzQxMildKG4sIHIpOyB9LCBzaXhHWTogU1tnKDAsIDExOTQsIDAsIDAsIDYwMildKEssIC0zMzUsIDAsIC0zNTMpLCB3a1h3WTogZnVuY3Rpb24gd2tYd1kobiwgdSl7IGZ1bmN0aW9uIHIobiwgdSwgciwgdCwgZSl7IHJldHVybiBKKHUgLSAtMTQ0LCBlKTsgfSByZXR1cm4gc1tyKDAsIDI5NDUsIDE4NjksIDMzODIsIDI5NTMpXShzW3IoMCwgMzA1MiwgMzY4NSwgMjc0MSwgMzc2NCldLCBzW0QoMCwgLTkgLSAtMTM2OSwgMCwgNzgxKV0pID8gc1tKKChlID0gMTM5NikgLSAtNTgwLCB0ID0gNjYxKV0oRSwgc1tvKDAsIDEyMTUgLSAtOTM5LCAxMzc3KV0oX0wsIDQ4NiksIEgpIDogc1tyKDAsIDE4NTIsIDExMDYsIDI2OTQsIDkyNildKG4sIHUpOyB2YXIgdCwgZTsgfSwga3N1b006IGZ1bmN0aW9uIGtzdW9NKG4sIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSShuIC0gNzQyLCB1IC0gMzA1LCByIC0gMTMzLCByKTsgfSBmdW5jdGlvbiBlKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSSh1IC0gMzk2LCB1IC0gMTkzLCByIC0gMzQzLCB0KTsgfSB2YXIgaSA9IHsgRFFTbmE6IGZ1bmN0aW9uIERRU25hKG4sIHIsIHQsIGUsIGkpeyByZXR1cm4gU1t1KDI1ODMsIDI2NTkpXShuLCByLCB0LCBlLCBpKTsgfSwga2RwZU86IGZ1bmN0aW9uIGtkcGVPKG4sIHIsIHQsIGUsIGkpeyByZXR1cm4gU1t1KDI1ODMsIDExMDMpXShuLCByLCB0LCBlLCBpKTsgfSwgRm5rdUI6IGZ1bmN0aW9uIEZua3VCKG4sIHIsIHQsIGUsIGksIGYpeyByZXR1cm4gU1t1KDEwOTksIC01OCldKG4sIHIsIHQsIGUsIGksIGYpOyB9LCBiQldTbDogZnVuY3Rpb24gYkJXU2wobiwgciwgdCwgZSwgaSwgZil7IHJldHVybiBTW3UoMzAxNSwgMzUxMyldKG4sIHIsIHQsIGUsIGksIGYpOyB9LCBaZ3RUSjogZnVuY3Rpb24gWmd0VEoobiwgciwgdCwgZSl7IHJldHVybiBTW3UoMTcwNSwgMTUxOCldKG4sIHIsIHQsIGUpOyB9LCBVeERUeTogZnVuY3Rpb24gVXhEVHkobiwgciwgdCwgZSwgaSl7IHJldHVybiBTW3UoMjU4MywgMzIwNyldKG4sIHIsIHQsIGUsIGkpOyB9LCB1b1VHRDogZnVuY3Rpb24gdW9VR0QobiwgciwgdCwgZSwgaSwgZil7IHJldHVybiBTW3UoNTgwLCAtMzUwKV0obiwgciwgdCwgZSwgaSwgZik7IH0sIHlTY21YOiBmdW5jdGlvbiB5U2NtWChuLCByLCB0LCBlKXsgcmV0dXJuIFNbdSgxNzA1LCA0ODMpXShuLCByLCB0LCBlKTsgfSwgZWZrSnM6IGZ1bmN0aW9uIGVma0pzKG4sIHIsIHQsIGUsIGksIGYpeyByZXR1cm4gU1t1KDExNDgsIDY1MildKG4sIHIsIHQsIGUsIGksIGYpOyB9LCBOTURycDogZnVuY3Rpb24gTk1EcnAobiwgciwgdCwgZSwgaSwgZil7IHJldHVybiBTW3UoMzAxNSwgNDI1NCldKG4sIHIsIHQsIGUsIGksIGYpOyB9LCBrR3BqZDogZnVuY3Rpb24ga0dwamQobiwgciwgdCwgZSwgaSwgZil7IHJldHVybiBTW3UoNTgwLCAtMTIzKV0obiwgciwgdCwgZSwgaSwgZik7IH0sIG52aEhnOiBmdW5jdGlvbiBudmhIZyhuLCByLCB0LCBlLCBpLCBmKXsgcmV0dXJuIFNbdSgxMDk5LCAyMDE2KV0obiwgciwgdCwgZSwgaSwgZik7IH0sIFJGb3ZsOiBmdW5jdGlvbiBSRm92bChuLCByLCB0LCBlLCBpKXsgcmV0dXJuIFNbdSgyNTgzLCAxMjAyKV0obiwgciwgdCwgZSwgaSk7IH0sIHBJZURrOiBmdW5jdGlvbiBwSWVEayhuLCByLCB0LCBlLCBpKXsgcmV0dXJuIFNbdSgyNTgzLCAxOTgwKV0obiwgciwgdCwgZSwgaSk7IH0sIFBhb3JUOiBmdW5jdGlvbiBQYW9yVChuLCByLCB0LCBlLCBpLCBmKXsgcmV0dXJuIFNbdSgyOTIxLCA4MzApXShuLCByLCB0LCBlLCBpLCBmKTsgfSB9OyBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gZygwLCByIC0gNzcsIDAsIDAsIGUpOyB9IGZ1bmN0aW9uIGMobiwgdSl7IHJldHVybiBEKDAsIG4gLSAtMTY4MSwgMCwgdSk7IH0gZnVuY3Rpb24gbyhuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEoodCAtIC03OTEsIG4pOyB9IGlmIChTW2YoMTUzMywgMCwgMTY2OSwgMzgyLCAyMjg0KV0oU1tmKDI2MzcsIDAsIDI3MDQsIDI0NTMsIDEzNjYpXSwgU1tlKDAsIDI2NzUsIDIyMDAsIDMyOTcsIDM2OTYpXSkpIHJldHVybiBTW2YoMjE0LCAwLCA0NzEsIC00NTcsIC03NildKG4sIHIpOyB2YXIgYSA9IFtVW2lbZSgwLCAxODc5LCA3NTcsIDU4MCwgMTU1NCldKHAwLCAwLCAtOTgsIDAsIC0zMyldLCAodm9pZCAwKVtpW2UoMCwgMjQyMSwgMzA2MCwgMjA2NCwgMjkzNildKHAyLCAwLCAxMzE5LCAxMjYxLCAxMjY0KV0sIHAzW2lbZigyNDYwLCAwLCAyNjQ1LCAyNDU5LCAyNDcyKV0ocDQsIDAsIDAsIDAsIDExMjQsIDEwNDApXSwgcDVbaVtjKDI1LCAtNzI1KV0ocDYsIDAsIDc0MSwgNzI5LCA3MzgsIDc0NildLCBwN1tpW2UoMCwgMzU4MSwgNDM1MiwgNDAyNCwgMzI0NildKHA4LCA0OSwgMCwgNzkpXSwgcDlbaVtmKDE2NTcsIDAsIDg0NSwgODc4LCAxNjMzKV0ocHAsIDAsIC04NywgMCwgLTUyKV0sIHBtW2lbYyg4NTcsIDc4KV0ocFIsIDAsIDEyMDcsIDExNDUsIDExMjcpXSwgcHVbaVt0KDM5MDEsIDMxMTksIDQ4ODcsIDAsIDMzOTEpXShwUCwgMCwgMCwgMCwgOTA3LCA5MzkpXSwgcHhbaVtmKDI4NDQsIDAsIDE2NTcsIDI0ODksIDI3OTcpXShwbiwgLTIyLCAwLCAtNzUpXSwgcGdbaVtjKDgwNCwgMTIwKV0ocGEsIDAsIDAsIDAsIDkxMCwgOTY2KV0sIHBJW2lbYygtODQsIC0zOSldKHBBLCAwLCA4OCwgMCwgNTUpXSwgcHpbaVt0KDM2NjgsIDI5MTEsIDM5OTUsIDAsIDM2NDMpXShwdCwgMCwgMCwgMCwgODU3LCA4ODcpXSwgcEtbaVtlKDAsIDIyOTIsIDMwMzksIDI3MzEsIDk4NSldKHBELCAtMTU4LCAwLCAtNjgpXSwgcFZbaVtvKDIyMDAsIDAsIDI0NzIsIDIxNzQsIDM0MTgpXShwQiwgMCwgODgxLCA4ODAsIDc5NywgNzY5KV0sIHBiW2lbbygyNjY3LCAwLCAxMTI2LCAxOTgwLCAzMjg1KV0ocHksIDAsIDY5OSwgNzk3LCA3MjgsIDc2MCldLCBwR1tpW2MoMTkwNCwgNjkyKV0ocFosIDAsIDAsIDAsIDEwMjIsIDEwNTIpXSwgcGhbaVt0KDM0NDIsIDQxMDAsIDM3MTYsIDAsIDM3MDYpXShwWSwgMCwgMTM1OCwgMTI0MCwgMTI0MCldLCBwRVtpW3QoMjc2NywgMjg1MCwgMTgwNCwgMCwgMjY5MyldKHBpLCAwLCAxMDUwLCAxMTI0LCAxMjIxKV0sIHBPW2lbdCgzODE0LCAzMjIwLCAzODkwLCAwLCA1MDU4KV0ocGwsIDAsIDAsIDAsIDk5MCwgOTEwKV0sIHBVW2lbdCgyODkyLCA0MTQ1LCAzODYxLCAwLCAzNjY1KV0ocGssIDAsIDEzMjUsIDEyOTMsIDEyMDkpXSwgcENbaVtjKDIwMTcsIDE0NzYpXShwVCwgMjEsIDAsIC04NCldLCBwcVtpW3QoMTY5OCwgMTM3NiwgMTIyNCwgMCwgMWUzKV0ocFEsIDAsIDc1OCwgNzY3LCA1NzYsIDY1MildLCBwZltpW3QoMTgyNiwgMjk5MiwgMTczOCwgMCwgMjAzNCldKHBlLCAwLCAxMTE2LCAxMjI2LCAxMTkzKV1dOyByZXR1cm4gKHBTID0gZnVuY3Rpb24gcFMoKXsgcmV0dXJuIGE7IH0pKCk7IH0sIEt0RHR4OiBmdW5jdGlvbiBLdER0eChuLCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEkodCAtIC05MzYsIHUgLSAyNDcsIHIgLSA0MjIsIHIpOyB9IGZ1bmN0aW9uIGUobiwgdSwgciwgdCl7IHJldHVybiBEKDAsIG4gLSAtMTQzNCwgMCwgdCk7IH0gdmFyIGkgPSB7IE5sRGRxOiBmdW5jdGlvbiBObERkcShuLCByLCB0KXsgcmV0dXJuIFNbdSgyMTQ5LCA0MTM2KV0obiwgciwgdCk7IH0gfTsgcmV0dXJuIFNbbygwLCAxODY3IC0gLTY3LCA4NzYpXShTW2UoLTIwNCwgMCwgMCwgLTEyNTcpXSwgU1t0KDAsIC01NjgsIDQzNSwgLTIxOSwgLTI0MCldKSA/IGlbdCgwLCAxNzEyLCAxMTM5LCA5MjIsIDY1NCldKEUsIF9MLCBIKSA6IFNbZSgxMzYxLCAwLCAwLCAxMTEpXShuLCByKTsgfSwgQVZUYWE6IGZ1bmN0aW9uIEFWVGFhKG4sIHUpeyBmdW5jdGlvbiByKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSihuIC0gLTgwLCB1KTsgfSByZXR1cm4gU1tEKDAsIDI5NDMsIDAsIDM3ODQpXShTW28oMCwgLTMyNiAtIC05NDEsIDI1OCldLCBTW3IoMTUwMSwgMjc5MSwgNDE2LCA3MDAsIDQyNyldKSA/IFNbcigyNjIwLCAzNzg5LCAyMDk3LCAxODQ3LCAxODgwKV0obiwgdSkgOiBzW3IoMzQ5MiwgNDQ3NiwgMjk5NCwgMjk5MSwgMzQxMSldKG4sIEUpOyB9LCBueEdrczogZnVuY3Rpb24gbnhHa3MobiwgciwgdCl7IHZhciBlLCBpID0geyBjbkRoSjogZnVuY3Rpb24gY25EaEoobiwgciwgdCl7IHJldHVybiBzW3UoMjM3OCwgNzA1KV0obiwgciwgdCk7IH0sIFBpbm1vOiBmdW5jdGlvbiBQaW5tbyhuLCByKXsgcmV0dXJuIHNbdSg2MTgsIC02NTQpXShuLCByKTsgfSB9OyBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSShuIC0gMzQwLCB1IC0gMjYsIHIgLSAyOTIsIHUpOyB9IGlmIChzW0ooMzUzMiAtIC00MjcsIGUgPSA0NTc2KV0oc1tmKDEzMTYsIDE2NzksIDE4NiwgMCwgODU5KV0sIHNbZigxMTI0LCAyMTM1LCAyNDU4LCAwLCAtOTEpXSkpeyB2YXIgYyA9IHsgaVZiZG86IGZ1bmN0aW9uIGlWYmRvKG4sIHUsIHIpeyByZXR1cm4gaVtnKHQgPSAzNjYsICh0ID0gdCAtIC0xMjExKSAtIDM2MCwgZSA9IDEyMzIsIDAsIGUpXShuLCB1LCByKTsgdmFyIHQsIGU7IH0sIEtIbWdQOiBmdW5jdGlvbiBLSG1nUChuLCB1KXsgcmV0dXJuIGlbZigodCA9IDM3ODkpIC0gMTczLCByID0gMjk2MywgciAtIDE0MSwgMCwgdCAtIDg2KV0obiwgdSk7IHZhciByLCB0OyB9IH07IHJldHVybiBjW3NbZigyNDUwLCAzNjQ5LCAyMTc1LCAwLCAzNTkzKV0oSCwgNTMxLCA0NDUpXShPLCBjW3NbRCgwLCA3NDcgLSAtMTY5OCwgMCwgMTUzKV0oQywgNjE1LCA0NDUpXSh0LCAtODA0KSwgdyk7IH0gcmV0dXJuIHNbbygwLCA5OTkgLSAtNzY2LCAxMjkyKV0obiwgciwgdCk7IH0sIHBkUUJDOiBmdW5jdGlvbiBwZFFCQyhuLCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEoociAtIC0xNDEzLCB1KTsgfSB2YXIgZSwgaSwgZiwgYyA9IHsgbWtrQXE6IGZ1bmN0aW9uIG1ra0FxKG4sIHIsIHQpeyByZXR1cm4gU1t1KDIwMzAsIDM3NTIpXShuLCByLCB0KTsgfSwgb1ppSkM6IGZ1bmN0aW9uIG9aaUpDKG4sIHIpeyByZXR1cm4gU1t1KDk2MywgMjA5OSldKG4sIHIpOyB9IH07IHJldHVybiBTW3QoMCwgMzI0LCAxMjk0LCAxNDksIDM0KV0oU1t0KDAsIDY2MCwgMTUxNiwgMjc3OCwgMjU3MildLCBTW3QoMCwgMjY2LCAxNDg4LCAyNDg1LCAyMzk4KV0pID8gU1tJKChmID0gMTIwNykgLSAtMjAxLCAxNTIwIC0gMjY2LCBmIC0gMjUwLCAyMDMpXShuLCByKSA6IGNbZygwLCAoZSA9IDIxMTEpIC0gMTk5LCAwLCBpID0gMjkzMCwgaSldKEUsIGNbbygwLCAyNTEwIC0gLTM5OCwgMjExMSldKF9MLCA5NjgpLCBIKTsgfSwgVlFaaFg6IGZ1bmN0aW9uIFZRWmhYKG4sIHUpeyBmdW5jdGlvbiByKG4sIHUpeyByZXR1cm4gbygwLCB1IC0gNTM5LCBuKTsgfSBmdW5jdGlvbiBlKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSShlIC0gLTY3MiwgdSAtIDM0MywgciAtIDIwOCwgcik7IH0gZnVuY3Rpb24gdChuLCB1LCByLCB0KXsgcmV0dXJuIEQoMCwgdCAtIC05MjMsIDAsIHUpOyB9IGlmIChTW3QoMCwgLTE1NywgMCwgODkzKV0oU1tlKDAsIDUzLCAxNTE0LCAwLCA2NjIpXSwgU1tyKDM3OTQsIDMwMjEpXSkpeyB2YXIgaSA9IHsga2tqc1g6IGZ1bmN0aW9uIGtranNYKG4sIHUsIHIpeyByZXR1cm4gc1tlKDAsICh0ID0gMzY0NykgLSAxOTQsIHQsIDAsIDI4NDMgLSAxMjk0KV0obiwgdSwgcik7IHZhciB0OyB9LCBRUGhNTTogZnVuY3Rpb24gUVBoTU0obiwgdSl7IHJldHVybiBzW3QoMCwgMTczOSwgMCwgMjA1OCAtIC0xODkpXShuLCB1KTsgfSB9LCBmID0geyBSeXJFVTogZnVuY3Rpb24gUnlyRVUobiwgdSwgcil7IHJldHVybiBpW3QoMCwgMTE3MiwgMCwgMTM1NCAtIDUxMSldKG4sIHUsIHIpOyB9LCBYZ1ltazogZnVuY3Rpb24gWGdZbWsobiwgdSl7IHJldHVybiBpW3IoNDEwMSwgMjc4OCAtIC04MTQpXShuLCB1KTsgfSB9OyByZXR1cm4gZltzW3QoMCwgMTcwMCwgMCwgMTgxMSldKEgsIDQ4NiwgODA5KV0oTywgZltzW28oMCwgMjAzMCAtIC0yNCwgMTIxOSldKEMsIDQwNCwgNTk1KV0oX0wsIC0xMzkpLCB3KTsgfSByZXR1cm4gU1tvKDAsIDE2MDMgLSAxNTEsIDE5MjcpXShuLCB1KTsgfSwgQ2NIZEo6IGZ1bmN0aW9uIENjSGRKKG4sIHIsIHQpeyB2YXIgZSA9IHsgc2NMWFE6IGZ1bmN0aW9uIHNjTFhRKG4sIHIpeyByZXR1cm4gU1t1KDE5MDAsIDI2NjcpXShuLCByKTsgfSB9OyBmdW5jdGlvbiBpKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSihuIC0gLTE1MTYsIHQpOyB9IGZ1bmN0aW9uIGYobiwgdSwgciwgdCwgZSl7IHJldHVybiBvKDAsIGUgLSAtOTMwLCByKTsgfSByZXR1cm4gU1tpKDU4NiwgMCwgMTAzOSwgMTAyNSwgLTU2MyldKFNbaSgxODMwLCAwLCAxMDY0LCAxMTY2LCA3NzYpXSwgU1tpKDIwOTMsIDAsIDI1NTIsIDMwNTQsIDIyNDApXSkgPyBlW2YoMCwgMCwgLTE5MCwgMCwgMjk3KV0obiwgRSkgOiBTW2YoMCwgMCwgMjEsIDAsIC0yODEpXShuLCByLCB0KTsgfSwgYWx6aFU6IGZ1bmN0aW9uIGFsemhVKG4sIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSShyIC0gNzk4LCB1IC0gMTAsIHIgLSA0NjAsIG4pOyB9IGZ1bmN0aW9uIGUobiwgdSwgcil7IHJldHVybiBEKDAsIG4gLSAtMTA4OSwgMCwgcik7IH0gdmFyIGksIGYgPSB7IEpRcGxnOiBmdW5jdGlvbiBKUXBsZyhuLCByKXsgcmV0dXJuIHNbdSgzMDE3LCAzNjA5KV0obiwgcik7IH0gfTsgcmV0dXJuIHNbZSgyNTg0LCAwLCAzNDYyKV0oc1tlKDIxNTAsIDAsIDE5NDMpXSwgc1t0KDE0NDAsIDIwMjksIDIzNTYsIDAsIDIyNDcpXSkgPyBmW0ooLTE3IC0gLTE2NjUsIGkgPSAxMjQ5KV0obiwgRSkgOiBzW3QoNDkwMCwgMzAyNSwgNDA1NSwgMCwgNDQzNCldKG4sIHIpOyB9LCBueUd5bzogZnVuY3Rpb24gbnlHeW8obiwgciwgdCl7IGZ1bmN0aW9uIGUobiwgdSwgciwgdCl7IHJldHVybiBnKDAsIHQgLSAtNTUzLCAwLCAwLCByKTsgfSB2YXIgaSwgZiA9IHsgaFVBSlQ6IGZ1bmN0aW9uIGhVQUpUKG4sIHIsIHQpeyByZXR1cm4gc1t1KDI2NDIsIDIyNzYpXShuLCByLCB0KTsgfSwgdkhWcUE6IGZ1bmN0aW9uIHZIVnFBKG4sIHIpeyByZXR1cm4gc1t1KDE4MTIsIDI4OTIpXShuLCByKTsgfSB9OyBmdW5jdGlvbiBjKG4sIHUsIHIpeyByZXR1cm4gbygwLCByIC0gMTQ3LCB1KTsgfSByZXR1cm4gc1tJKChpID0gMjA1NSkgLSAtMTE2MywgMTY1MiAtIDExMSwgaSAtIDMzNCwgMzAwNildKHNbYygwLCA1MTEsIDc0MyldLCBzW2coMCwgMTM2OSwgMCwgMCwgMTEzMCldKSA/IHNbZSg3NTYsIDAsIDIzNzMsIDE5NzQpXShuLCByLCB0KSA6IGZbYygwLCAxMDE5LCAxMjY3KV0oRSwgZltlKDIzNDEsIDAsIDIwMDMsIDE1MzQpXShfTCwgLTIwNSksIEgpOyB9LCBWR0FsVzogZnVuY3Rpb24gVkdBbFcobiwgdSl7IGZ1bmN0aW9uIHIobiwgdSwgciwgdCwgZSl7IHJldHVybiBEKDAsIGUgLSAtMTYxNCwgMCwgdSk7IH0gaWYgKHNbcigwLCAxNjUwLCAwLCAwLCAyMTE3KV0oc1tJKChmID0gMjMzNikgLSAtNDUyLCAoaSA9IDIxNzIpIC0gMTA4LCAzMjQwIC0gNDY3LCBpKV0sIHNbcigwLCAxNDg5LCAwLCAwLCAxNjg3KV0pKXsgdmFyIHQgPSBzW2coMCwgMjI2NCwgMCwgMCwgMTUxMildKF9MKTsgcmV0dXJuIChIID0gZnVuY3Rpb24gSChuLCB1KXsgcmV0dXJuIHRbbiAtPSAzODRdOyB9KShPLCBDKTsgfSByZXR1cm4gc1tnKGUgPSAzMTQwLCAzNjU5IC0gMTAwNSwgMCwgMCwgZSldKG4sIHUpOyB2YXIgZSwgaSwgZjsgfSwgTWJEalE6IGZ1bmN0aW9uIE1iRGpRKG4sIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbygwLCBlIC0gNjQ0LCB1KTsgfSBmdW5jdGlvbiBlKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSihuIC0gLTEyMTAsIHQpOyB9IHZhciBpLCBmID0geyBra0dSdTogZnVuY3Rpb24ga2tHUnUobiwgciwgdCwgZSwgaSwgZil7IHJldHVybiBTW3UoMjIzOSwgMTczMCldKG4sIHIsIHQsIGUsIGksIGYpOyB9LCBsQ1dwTjogZnVuY3Rpb24gbENXcE4obiwgcil7IHJldHVybiBTW3UoOTYzLCAtOTU2KV0obiwgcik7IH0gfTsgcmV0dXJuIFNbZSgyMjMzLCAwLCAxOTA3LCAzNDY2LCAxOTA1KV0oU1tlKDE0ODksIDAsIDQyNSwgMjc5NywgMjc1MildLCBTW2UoMTQ4OSwgMCwgMjE2OCwgMTkwMSwgODUyKV0pID8gU1t0KDAsIDEzNDIsIDAsIDAsIDIwOTYpXShuLCByKSA6IGZbSSgoaSA9IDE0MjMpIC0gLTQ4NywgMjEyNCAtIDI0OSwgMTIyNyAtIDMzNiwgNzUwKV0oRSwgMCwgMCwgMCwgX0wsIGZbdCgwLCAyNjY5LCAwLCAwLCAzMTk4KV0oSCwgLTk1NykpOyB9LCB3dmpFcTogZnVuY3Rpb24gd3ZqRXEobiwgdSl7IGZ1bmN0aW9uIHIobiwgdSwgciwgdCl7IHJldHVybiBvKDAsIHIgLSAtODAwLCB0KTsgfSByZXR1cm4gc1tyKDAsIDAsIDc5NywgLTQ1MSldKHNbcigwLCAwLCAxMjg4LCA1NTUpXSwgc1tvKDAsIDE5OTAgLSAtOTgsIDI2NjkpXSkgPyBzW3IoMCwgMCwgLTEwNiwgODQxKV0obiwgdSkgOiBzW0koKHQgPSAyMjMwKSAtIC0zNDksIHQgLSAzMzIsIDIwNjUgLSAyMjcsIGUgPSAyODQ4KV0oRSwgc1tKKDE1OTQsIDczMildKF9MLCAtNzIyKSwgSCk7IHZhciB0LCBlOyB9LCBhYWJaSDogZnVuY3Rpb24gYWFiWkgobiwgdSl7IGZ1bmN0aW9uIHIobiwgdSwgciwgdCwgZSl7IHJldHVybiBnKDAsIGUgLSAtMjc2LCAwLCAwLCBuKTsgfSByZXR1cm4gc1tyKDU4NCwgMCwgMjgyMiwgMTg5NSwgMTc3MyldKHNbRCgwLCAzODQwLCAwLCAzMjIyKV0sIHNbSSgxNjYzIC0gLTU5OCwgKHQgPSAxMjY0KSAtIDQxMywgMjc5NSAtIDM4NiwgdCldKSA/IHNbcigzMDEyLCAwLCAzNjU3LCAzMTAyLCAyNjgyKV0oRSwgX0wsIEgpIDogc1tyKDEyMjUsIDAsIDEzNDEsIDMwNzAsIDE4ODMpXShuLCB1KTsgdmFyIHQ7IH0sIHNHZVFjOiBmdW5jdGlvbiBzR2VRYyhuLCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEkobiAtIC00NjAsIHUgLSAyMTIsIHIgLSA0MDIsIHQpOyB9IGZ1bmN0aW9uIGUobiwgdSl7IHJldHVybiBvKDAsIG4gLSAtNzUzLCB1KTsgfSB2YXIgaSA9IHsgbmh1UHM6IGZ1bmN0aW9uIG5odVBzKG4sIHIsIHQsIGUsIGksIGYpeyByZXR1cm4gU1t1KDI5MjEsIDE4NTApXShuLCByLCB0LCBlLCBpLCBmKTsgfSwgd3FiWW86IGZ1bmN0aW9uIHdxYllvKG4sIHIpeyByZXR1cm4gU1t1KDE3MzUsIDIwNDYpXShuLCByKTsgfSB9OyByZXR1cm4gU1tEKDAsIDM2ODYsIDAsIDE5MTIpXShTW3QoMjcxNSwgMjc3MSwgMjAyNSwgMjIyNCwgMjU4MildLCBTW3QoMjcxNSwgMzY4MywgMjk3NiwgMjcyNSwgMTQyOCldKSA/IGlbdCgyMTcyLCAyNzM4LCAxNDQyLCAzMjU0LCAxOTUyKV0oRSwgMCwgMCwgaVtlKDU5OSwgMTc5NCldKF9MLCA2MjMpLCAwLCBIKSA6IFNbZSg2MTcsIDE1NDgpXShuLCByKTsgfSwgcGpYaXY6IGZ1bmN0aW9uIHBqWGl2KG4sIHUsIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSShuIC0gLTEwODMsIHUgLSAyMTAsIHIgLSAyNTcsIHUpOyB9IGZ1bmN0aW9uIGUobiwgdSwgciwgdCwgZSl7IHJldHVybiBJKGUgLSAtNTQxLCB1IC0gNDEsIHIgLSAyMzEsIHIpOyB9IHJldHVybiBTW3QoMTkwLCAxMDIwLCAxMDA4LCAwLCAtODUzKV0oU1t0KC0zNTMsIC02NDgsIC0xNTc4LCAwLCAtMTE5NyldLCBTW3QoLTM1MywgLTE0OTAsIC0xMjQ5LCAwLCAtODQzKV0pID8gU1tvKDAsIDE3MTAgLSAtOTQ1LCAxNTQzKV0obiwgdSwgcikgOiBzW2UoMCwgNDA0MywgMjMyOCwgMCwgMjc2MildKEUsIHNbdCgtMjY0LCA5MTIsIDg3OCwgMCwgLTQ1MyldKHNbZSgwLCAxMzY0LCA4NzEsIDAsIDI1NCldKF9MLCA0OTYpLCAtMzE5KSwgSCk7IH0sIHBFcEhGOiBmdW5jdGlvbiBwRXBIRihuLCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGcoMCwgbiAtIDI5NywgMCwgMCwgZSk7IH0gdmFyIGUgPSB7IE5mVVFyOiBmdW5jdGlvbiBOZlVRcihuLCByKXsgcmV0dXJuIFNbdSgxMjgxLCA1NTUpXShuLCByKTsgfSB9OyBmdW5jdGlvbiBpKG4sIHUsIHIsIHQpeyByZXR1cm4gRCgwLCB0IC0gLTI1MywgMCwgdSk7IH0gcmV0dXJuIFNbdCgyMDgyLCAwLCAzMzcyLCAyNTY1LCAxNDk3KV0oU1t0KDMxNDQsIDAsIDM0MjQsIDM4ODYsIDE5NDIpXSwgU1t0KDI3MzksIDAsIDE0MTksIDIyNzEsIDE3OTgpXSkgPyBTW2koMCwgMjQ2NSwgMCwgMTU1NildKG4sIHIpIDogZVtpKDAsIC0xNDMsIDAsIDEwMjApXShuLCBFKTsgfSwgb1RVZ0o6IGZ1bmN0aW9uIG9UVWdKKG4sIHIpeyB2YXIgdCwgZSwgaSwgZiwgYyA9IHsgRHRFRXM6IGZ1bmN0aW9uIER0RUVzKG4sIHIsIHQpeyByZXR1cm4gU1t1KDE1MDQsIDIxNTYpXShuLCByLCB0KTsgfSB9OyBmdW5jdGlvbiBvKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gZygwLCB1IC0gLTI1NSwgMCwgMCwgZSk7IH0gcmV0dXJuIFNbSigxMTkzIC0gLTE3MDcsIGYgPSA2MTEpXShTW28oLTIyMCwgNTIxLCAyNTQsIC0yNzEsIDkyMyldLCBTW28oMjkyNCwgMjMwNSwgMTQ3NiwgMTg3OCwgOTYzKV0pID8gU1tKKDIyNzggLSAtNjA3LCBpID0gMzE4MildKG4sIHIpIDogX0xbY1tnKDAsIChlID0gMTQ2NykgLSA0MzYsIHQgPSA0OTUsIDAsIHQpXShILCA2MDksIDEzODYpXShPLCBDKTsgfSwgTE9iZEo6IGZ1bmN0aW9uIExPYmRKKG4sIHIpeyB2YXIgdCA9IHsgQWtOVWs6IGZ1bmN0aW9uIEFrTlVrKG4sIHIsIHQsIGUsIGksIGYpeyByZXR1cm4gU1t1KDExNDgsIC0yNjIpXShuLCByLCB0LCBlLCBpLCBmKTsgfSwganRRQ0I6IGZ1bmN0aW9uIGp0UUNCKG4sIHIpeyByZXR1cm4gU1t1KDE3MzUsIDE0MSldKG4sIHIpOyB9IH07IGZ1bmN0aW9uIGUobiwgdSl7IHJldHVybiBvKDAsIHUgLSAtNTA4LCBuKTsgfSBmdW5jdGlvbiBpKG4sIHUsIHIsIHQpeyByZXR1cm4gRCgwLCB0IC0gOTMsIDAsIHUpOyB9IHJldHVybiBTW2koMCwgMTgwOSwgMCwgMTk2OCldKFNbZSgxODExLCAxMTI0KV0sIFNbaSgwLCAyMzE3LCAwLCAxNTAzKV0pID8gX0xbdFtlKDM1MTIsIDI1MjUpXShILCAwLCAxMjAzLCAwLCB0W2koMCwgMzE5LCAwLCAxMzY1KV0oMTIwMywgMTIxMCksIDEyNjEpXShPLCBDKSA6IFNbaSgwLCAxMjk0LCAwLCAyMzE4KV0obiwgcik7IH0sIGhUZ0VMOiBmdW5jdGlvbiBoVGdFTCh1LCByKXsgdmFyIHQgPSB7fTsgZnVuY3Rpb24gZShuLCB1LCByLCB0KXsgcmV0dXJuIG8oMCwgdCAtIDgyNiwgbik7IH0gZnVuY3Rpb24gaShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIG8oMCwgdCAtIDg5MywgZSk7IH0gZnVuY3Rpb24gZihuLCB1KXsgcmV0dXJuIEQoMCwgbiAtIC05OSwgMCwgdSk7IH0gZnVuY3Rpb24gYyhuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEoodSAtIC0xNTYxLCB0KTsgfSB0W2YoMTQ4MiwgMjQyNCldID0gc1tjKDAsIDkxNywgNDE2LCAzNzIsIDE2NjYpXTsgcmV0dXJuIHNbaSgwLCAwLCAwLCAyNDkwLCAzMzA5KV0oc1tpKDAsIDAsIDAsIDIyMTYsIDM0MzcpXSwgc1tmKDE5MDQsIDIxOTIpXSkgPyBzW2UoMTYwNCwgMCwgMCwgMTUyMCldKHUsIHIpIDogbltjKDAsIDIzMCwgLTIzOCwgNTkwLCAtNzU2KSArIGUoMTQ3MCwgMCwgMCwgMjMyNildKClbZSgyMTMyLCAwLCAwLCAxNjc0KSArICJoIl0odlNuZHNPW2YoMTQ4MiwgMjc0NCldKVtjKDAsIDIzMCwgNDI4LCAtMjU4LCAtMTEzKSArIGUoMzI3OSwgMCwgMCwgMjMyNildKClbaSgwLCAwLCAwLCAxNDc4LCA5MzApICsgYygwLCAyMDY2LCAzMTc0LCAyNzQxLCAzMzc5KSArICJyIl0oRSlbZSgyODQ3LCAwLCAwLCAxNjc0KSArICJoIl0odlNuZHNPW2YoMTQ4MiwgMjA1OSldKTsgfSwgUWx5SWk6IGZ1bmN0aW9uIFFseUlpKG4sIHUsIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIpeyByZXR1cm4gRCgwLCByIC0gLTEyMTAsIDAsIHUpOyB9IGZ1bmN0aW9uIGUobiwgdSwgciwgdCwgZSl7IHJldHVybiBJKHIgLSAtMTUsIHUgLSA1OSwgciAtIDQ3NCwgdCk7IH0gcmV0dXJuIFNbdCgwLCAyMTAyLCAxNDA0KV0oU1tvKDAsIDE4OTAgLSAxOTYsIDI4ODkpXSwgU1t0KDAsIDUwNSwgOTIwKV0pID8gU1tlKDAsIDI3NTYsIDI4MDcsIDI2MDcsIDM0MzkpXShuLCB1LCByKSA6IHNbZSgwLCAyNjU1LCAyNDYwLCAyNTY3LCAyODQ1KV0obiwgRSk7IH0sIEhIWUZtOiBmdW5jdGlvbiBISFlGbShuLCByKXsgZnVuY3Rpb24gdChuLCB1KXsgcmV0dXJuIG8oMCwgdSAtIDcwNywgbik7IH0gZnVuY3Rpb24gZShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGcoMCwgZSAtIDExMDQsIDAsIDAsIHIpOyB9IHZhciBpID0geyB0RFhPVTogZnVuY3Rpb24gdERYT1Uobiwgcil7IHJldHVybiBTW3UoMTk4NywgMTU0NyldKG4sIHIpOyB9IH07IHJldHVybiBTW3QoODY3LCAxOTAyKV0oU1tlKDI4ODQsIDAsIDQwNzYsIDM2NTQsIDI5NTkpXSwgU1t0KDMzNiwgMTM5MildKSA/IGlbZSg0MTQwLCAwLCA0MDk3LCAzMjAzLCAzMDY4KV0obiwgRSkgOiBTW3QoMjQzNCwgMzU5NyldKG4sIHIpOyB9LCBGSEZSWDogZnVuY3Rpb24gRkhGUlgobiwgdSl7IGZ1bmN0aW9uIHIobiwgdSwgciwgdCwgZSl7IHJldHVybiBKKHQgLSAtMTI5OCwgdSk7IH0gZnVuY3Rpb24gdChuLCB1LCByKXsgcmV0dXJuIG8oMCwgbiAtIC03NjMsIHIpOyB9IHJldHVybiBTW3QoMTcxNCwgMCwgMjEwOSldKFNbdCg5MTksIDAsIC00MTIpXSwgU1tyKDAsIDI1ODQsIDIyNzksIDEzNTAsIDI2NzQpXSkgPyBTW3IoMCwgMjc3NCwgMTU3NCwgMTUxNSwgMTE2OCldKG4sIHUpIDogc1tEKDAsIDE2MDggLSAtMTU4MywgMCwgMjIxNyldKG4sIEUpOyB9LCBEUFZrRzogZnVuY3Rpb24gRFBWa0cobiwgdSl7IGZ1bmN0aW9uIHIobiwgdSwgciwgdCwgZSl7IHJldHVybiBJKGUgLSAtOTEyLCB1IC0gMjg1LCByIC0gMTE4LCBuKTsgfSByZXR1cm4gc1tJKChpID0gMzIyMSkgLSA2NjgsIDMyMTYgLSA4MCwgMjIxMyAtIDI5MSwgMzMxOCldKHNbSSgoZSA9IDY2NSkgLSAtMjY4LCAodCA9IDEyNTEpIC0gMjg3LCA4ODMgLSA4NiwgdCldLCBzW28oMCwgMzAwOSwgMzU5MSldKSA/IHNbcigyNDkzLCAyMTg1LCAxNzAyLCAwLCAxNDUzKV0obiwgdSkgOiBzW3IoMzE5MSwgMjA2OCwgMjQ5OCwgMCwgMjM2MildKEUsIF9MLCBIKTsgdmFyIHQsIGUsIGk7IH0sIENOa21MOiBTW28oMCwgMTcwNywgMjIyNyldKEssIC0xOTcsIDAsIC04MCksIE1OZkRPOiBTW0ooMzYyMSwgMjc3NSldKF9MLCA0NjQsIDczMSkgfTsgZnVuY3Rpb24gSShuLCB1LCByLCB0KXsgcmV0dXJuIE4oMCwgMCwgMCwgdCwgbiAtIC00NjQpOyB9IGZ1bmN0aW9uIEoobiwgdSl7IHJldHVybiBSKDAsIDAsIDAsIG4gLSAxOTUxLCB1KTsgfSBmdW5jdGlvbiBVKG4sIHIsIHQsIGUpeyB2YXIgaSwgZiA9IHsganhZaXc6IGZ1bmN0aW9uIGp4WWl3KG4sIHIsIHQsIGUsIGksIGYpeyByZXR1cm4gc1t1KDE2MDYsIDExMDIpXShuLCByLCB0LCBlLCBpLCBmKTsgfSwgeXFmU0w6IGZ1bmN0aW9uIHlxZlNMKG4sIHIpeyByZXR1cm4gc1t1KDY5MCwgMTc5MSldKG4sIHIpOyB9IH07IGZ1bmN0aW9uIGMobiwgdSwgciwgdCwgZSl7IHJldHVybiBnKDAsIGUgLSAzMDgsIDAsIDAsIG4pOyB9IHJldHVybiBzW2MoMTk2MywgMCwgMjIyMSwgMTM1OCwgMTU5OCldKHNbYygyMTY0LCAwLCAxODk4LCAyOTk5LCAxNzI2KV0sIHNbYygzMDkyLCAwLCAyMDk2LCAyMDU5LCAyMjg3KV0pID8gZltjKDIwNTAsIDAsIDI4NDEsIDM0MTEsIDI5NDgpXShFLCBfTCwgMCwgMCwgMCwgZltvKDAsIDExMzYgLSAtNDY3LCA0NDgpXShILCAxNDE0KSkgOiBzW0koMjgzNSAtIDYyMiwgMjM5MSAtIDM5LCAzOTA3IC0gMzk0LCAyMjMxKV0oX0wsIHNbZygwLCAoaSA9IDE2MjMpIC0gLTU0NCwgMCwgMCwgMTY1OSldKG4sIC05NTkpLCBlKTsgfSBmdW5jdGlvbiByKG4sIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSShlIC0gLTUzNSwgdSAtIDI5NiwgciAtIDE0OSwgbik7IH0gZnVuY3Rpb24gaShuLCB1LCByLCB0KXsgcmV0dXJuIGcoMCwgciAtIC00ODcsIDAsIDAsIHQpOyB9IGZ1bmN0aW9uIG8obiwgdSwgcil7IHJldHVybiBJKG4gLSAtMjg5LCB1IC0gNTAwLCByIC0gMzMwLCB1KTsgfSBmdW5jdGlvbiBhKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSihlIC0gLTQ3OSwgdCk7IH0gZnVuY3Rpb24gZShuLCB1LCByLCB0KXsgcmV0dXJuIEQoMCwgciAtIC0xMjI1LCAwLCB0KTsgfSB2YXIgdiA9IHsgTnZRcWY6IGZ1bmN0aW9uIE52UXFmKG4sIHIsIHQpeyByZXR1cm4gc1t1KDEyOTYsIDE1MjYpXShuLCByLCB0KTsgfSwgZWVVWmM6IGZ1bmN0aW9uIGVlVVpjKG4sIHIpeyByZXR1cm4gc1t1KDE2ODEsIDIzOTYpXShuLCByKTsgfSwgcEVKck06IHNbYSgwLCAwLCAwLCAxNzEzLCAxMDgyKV0sIFJkRkVIOiBmdW5jdGlvbiBSZEZFSChuLCB1LCByLCB0KXsgcmV0dXJuIHNbYSgwLCAwLCAwLCAyMDQxLCAyOTAyIC0gLTM5OSldKG4sIHUsIHIsIHQpOyB9LCBTRGNlUjogZnVuY3Rpb24gU0RjZVIobiwgdSl7IHJldHVybiBzW2EoMCwgMCwgMCwgMTM0MSwgMjYwMiAtIC0zOSldKG4sIHUpOyB9LCBtalVYTjogZnVuY3Rpb24gbWpVWE4obiwgdSwgcil7IHJldHVybiBzW2EoMCwgMCwgMCwgLTMzLCAyMTIgLSAtODc5KV0obiwgdSwgcik7IH0sIFpEUWlNOiBmdW5jdGlvbiBaRFFpTShuLCB1KXsgcmV0dXJuIHNbYSgwLCAwLCAwLCA5NzUsIDMxNjApXShuLCB1KTsgfSB9OyBpZiAoc1thKDAsIDAsIDAsIDMxNzQsIDIzODkpXShzW28oMTg4OCwgMjU1MywgMjg1MyldLCBzW3QoMTA0MSwgMTIxNywgMTY5MiwgMCwgMTY0MildKSl7IHZhciBmID0gZnVuY3Rpb24gZihuLCByLCB0LCBlLCBpKXsgdmFyIGYgPSB7IEVsUWVwOiBmdW5jdGlvbiBFbFFlcChuLCByLCB0KXsgcmV0dXJuIHZbdSgxODQyLCAtNzMpXShuLCByLCB0KTsgfSB9OyBmdW5jdGlvbiBjKG4sIHUsIHIsIHQpeyByZXR1cm4gYSgwLCAwLCAwLCB0LCBuIC0gLTE1MCk7IH0gcmV0dXJuIHZbYygyMTkzLCAwLCAwLCAyNjY1KV0odltjKDIzMjMsIDAsIDAsIDMwMDMpXSwgdlthKDAsIDAsIDAsIDQxMTcsIDI4NDEgLSAzNjgpXSkgPyB2W2MoMTg5MywgMCwgMCwgMjI0NildKEssIHZbbygxMDA1LCAxNDQxLCAtMzI5KV0oaSwgODQ2KSwgMCwgdCkgOiBmW2MoMjU0NSwgMCwgMCwgMjM1NSldKEUsIGksIEgpOyB9OyB2YXIgYyA9IHsgWnFJTnM6IGZ1bmN0aW9uIFpxSU5zKG4peyBmdW5jdGlvbiB1KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbyh0IC0gNTk5LCBlLCByIC0gNDUwKTsgfSByZXR1cm4gc1t1KDAsIDAsIDE5NTgsIDMwMTYsIDI5OTMpXShzW3UoMCwgMCwgMjYyNCwgMjA2NywgMjYyOSldLCBzW3UoMCwgMCwgMzI3NiwgMjA2NywgMTYzNyldKSA/IFFbc1thKDAsIDAsIDAsIDIzMjcsIDI2ODYgLSAtNDc3KV0oX0wsIDUzOSwgMzgpXShuKSA6IHZbaSgxOTQ0IC0gMjc1LCAwLCAyODcyIC0gMTMyOSwgMjEyMSldKEUsIF9MLCBIKTsgfSB9OyBpZiAoUVtzW2UoMCwgMCwgMjQ4MywgMTUzOCldKFUsIHNbaSgzMDkyLCAwLCAxODU0LCAyMjc1KV0oMzM2LCA4OTcpLCAwLCAwLCA0MTkpXShRW3NbYSgwLCAwLCAwLCA0MDYxLCAzNDM1KV0oZiwgMCwgMCwgNzIxLCAwLCA2NTQpXSwgUVtzW2UoMCwgMCwgNDcwLCAtMTA1KV0oSywgc1tvKDI1OTQsIDIxNDgsIDIxMTgpXSgxNDk3LCAxNjg5KSwgMCwgMTQ4NildKSkgcmV0dXJuIFFbc1thKDAsIDAsIDAsIDE0NTMsIDIxMjcpXShmLCAwLCAwLCA3NDUsIDAsIDcwOSldKHEsIFFbc1tpKDI3MSwgMCwgOTk4LCAxMzM0KV0obCwgNjcwLCBzW28oMTg5NiwgNjUyLCAxNTUzKV0oNzMzLCA0ODkpKV0obiwgNTc2KSwgcik7IHZhciBwID0gY1tzW3QoNzY1LCAyMTYzLCAxMTEyLCAwLCAxMjcyKV0oZiwgMCwgMCwgNjU0LCAwLCA2ODcpXShyKTsgcmV0dXJuIChjID0gZnVuY3Rpb24gYyhuLCB1KXsgZnVuY3Rpb24gcihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGkobiAtIDMyNCwgMCwgciAtIC01OSwgZSk7IH0gZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGkobiAtIDEzMiwgMCwgciAtIDExMTgsIGUpOyB9IHJldHVybiBzW3IoNjYzLCAwLCAtOTIsIDAsIDEwNzQpXShzW3IoMzksIDAsIDI2NiwgMCwgLTgzNSldLCBzW3QoOTY3LCAwLCAxNTQ0LCAwLCAyMjIpXSkgPyB2W3QoMTkxMywgMCwgMTE4MSwgMCwgOTMxKV0obiwgRSkgOiBwW24gLT0gNDA0XTsgfSkodW4sIHApOyB9IHJldHVybiBzW2UoMCwgMCwgMTc4OSwgMTUxNyldKEUsIHNbbygyMDMyLCAzMjgzLCAzMTM3KV0oX0wsIDgzNyksIEgpOyB9IGZ1bmN0aW9uIGcobiwgdSwgciwgdCwgZSl7IHJldHVybiBiKHUgLSAtOTUwLCAwLCBlKTsgfSBmb3IgKHZhciB0ID0gUVtTW0koMjM1MCwgMjAyOCwgMjA1NSwgMjIwNildKF9MLCA1NjYsIDgwOSldKG5uKTs7KSB0cnkgeyBpZiAoU1tnKDAsIDE1MTIsIDAsIDAsIDE1MTQpXShTW0QoMCwgMTIxOCwgMCwgMjM4KV0sIFNbZygwLCAzODksIDAsIDAsIC01MzYpXSkpeyBpZiAoUVtTW0ooMzAwMywgMjA2MildKF9MLCA0MzgsIDU2NildKFFbU1tJKDI5NjgsIDMzNTIsIDMxMTUsIDI3NjQpXShfTCwgNDA2LCA2NDYpXSwgUVtTW28oMCwgMTA3OSwgODQ0KV0obCwgLTU5LCAzNildKSkgcmV0dXJuIFFbU1tEKDAsIDMyNjgsIDAsIDM3ODMpXShLLCAtMTM3LCAwLCAtMjM2KV0oUCwgUVtTW2coMCwgMTM4OSwgMCwgMCwgMTU4KV0oX0wsIDQ1MywgNDc2KV0oRiwgLTcwMyksIFcpOyBpZiAoUVtTW0QoMCwgMTY4OCwgMCwgMzc1KV0oX0wsIDU4MiwgODI2KV0oMTA3MTY1LCBRW1NbZygwLCAyNDQ4LCAwLCAwLCAxODU4KV0obCwgMjc1LCAxOTQpXShRW1NbSigxNjMxLCAxMzYwKV0oVSwgLTM5NSwgMCwgMCwgLTI4NSldKFFbU1tJKDIzNTAsIDM0ODEsIDE1MTIsIDEwNjYpXShfTCwgNTY0LCA2MjIpXShRW1NbZygwLCAyMDM0LCAwLCAwLCAyNzc3KV0oX0wsIDU2NCwgODgzKV0oUVtTW0koMjYxOSwgMzQ4MywgMzg3NywgMzQyNCldKF9MLCAzOTQsIDU3MSldKFFbU1tvKDAsIDIzNDQsIDMyMzMpXShLLCAtMzI4LCAwLCAtMzc0KV0oLVFbU1tvKDAsIDI5NzAsIDI3ODIpXShVLCAtNTIzLCAwLCAwLCAtNTI2KV0ocGFyc2VJbnQsIFFbU1tKKDI0MTcsIDI0NDUpXShfTCwgNDk4LCA3NzgpXShxLCA0MTksIDI3MikpLCBRW1NbRCgwLCAzMjY4LCAwLCAyNzMyKV0oSywgLTE1MSwgMCwgLTIzMildKFFbU1tnKDAsIDcyNCwgMCwgMCwgMTE0MCldKGwsIDEyNywgMjEwKV0ocGFyc2VJbnQsIFFbU1tnKDAsIDE0MjcsIDAsIDAsIDIyOTgpXShLLCAtMTc0LCAwLCAtMjg0KV0ocSwgNDIxLCAyNTUpKSwgMikpLCBRW1NbSSgyMTE1LCAyNzA4LCAyNTg1LCAyMzM0KV0oX0wsIDU3MSwgNTk1KV0oUVtTW28oMCwgMjU4OCwgMzA5OSldKEssIC0yMzksIDAsIC0yMzUpXShwYXJzZUludCwgUVtTW28oMCwgMjEzNywgMTg1OSldKFUsIC0zNDIsIDAsIDAsIC0yOTApXShyLCA5OTIsIDEwMDQpKSwgMykpLCBRW1NbSigzOTIyLCA0NDI0KV0oX0wsIDQxNiwgNzIwKV0oUVtTW28oMCwgMTE4NCwgMTEpXShfTCwgNTcxLCA4MjkpXShRW1NbSigzNTcwLCAzMTA1KV0oVSwgLTUzNiwgMCwgMCwgLTUzMyldKHBhcnNlSW50LCBRW1NbSSgyNzcxLCAzNjI1LCAxODM0LCAzNDQwKV0oVSwgLTM3NCwgMCwgMCwgLTI5OSldKHIsIDk4OSwgMWUzKSksIDQpLCBRW1NbRCgwLCAyNTc3LCAwLCAyNTg1KV0obCwgMjc0LCAyMTgpXSgtUVtTW0koMjc2OCwgMzY2MCwgMzI0OSwgMjQ1NSldKGwsIDk2LCA1MyldKHBhcnNlSW50LCBRW1NbRCgwLCAyNTc0LCAwLCAyMjA1KV0oSywgLTEzNywgMCwgLTIzKV0ocSwgNDE3LCA3ODgpKSwgNSkpKSwgUVtTW28oMCwgMTk0MSwgMTg1MSldKF9MLCA1MzUsIDcyOSldKFFbU1tJKDk5MSwgMjI5LCAtMzQsIDc4NyldKGwsIC01OCwgMzkpXShwYXJzZUludCwgUVtTW2coMCwgMTExOCwgMCwgMCwgMTQ3OSldKF9MLCA1NDEsIDgxMyldKHEsIDQxMCwgOTI1KSksIDYpKSwgUVtTW0koMjIwNCwgOTUzLCAyNTUyLCAxMDc3KV0oX0wsIDQ2NiwgNTY1KV0oUVtTW28oMCwgMjQ5NCwgMjI5MildKEssIC0xMjgsIDAsIC0xNDYpXShwYXJzZUludCwgUVtTW28oMCwgMTA3OSwgMTM0KV0oX0wsIDU0OCwgODM5KV0ocSwgNDI1LCAyNjIpKSwgNykpLCBRW1NbSigxNjQzLCAxNDgyKV0obCwgMTkyLCAyMzMpXShRW1NbRCgwLCAzMTY0LCAwLCAyNDY4KV0oX0wsIDU1MSwgOTIwKV0oUVtTW0koMTE5OCwgMTQxMSwgMjUsIDE5NDgpXShsLCAzNywgMzkpXShwYXJzZUludCwgUVtTW28oMCwgMjA1MywgMTM2NSldKEssIC0yNDQsIDAsIC0yNzcpXShxLCA0MjYsIDIwMikpLCA4KSwgUVtTW0koMjczNiwgMjkxOCwgMTY3MSwgMzgyMildKF9MLCA2MTEsIDk2MSldKC1RW1NbSSg3MzcsIDk1LCAxODAsIDExNDkpXShfTCwgNDE1LCA1NDcpXShwYXJzZUludCwgUVtTW0QoMCwgMjcxNywgMCwgMjAxOCldKF9MLCA1NDEsIDkzMCldKHIsIDFlMywgMTAwNCkpLCA5KSkpKSkgYnJlYWs7IHRbU1tnKDAsIDI4MjEsIDAsIDAsIDI4NTQpXShVLCAtNTI4LCAwLCAwLCAtNDExKV0odFtTW0koMjk2OCwgMTc4OSwgNDE0OSwgMjgwNCldKF9MLCA0ODcsIDgxMildKCkpOyB9IGVsc2UgeyBpZiAoX1tzW0ooMTk4MSwgNjY5KV0obm4sIC0xMTcsIDAsIC03MSldKHVuW3NbSSgzMzMzLCAzODczLCAzNDgyLCAzMjA4KV0odW4sIDI2LCAxMDIpXSwgT1tzW0QoMCwgMzY4MSwgMCwgNDI4NyldKGUsIC00NjMsIDAsIDAsIC00OTYpXSkpIHJldHVybiBybltzW2coMCwgMjkzNSwgMCwgMCwgMjExNildKHRuLCAtMTM3LCAwLCAtMTEwKV0oJCwgZW5bc1tKKDMzNzgsIDQzMDYpXShmbiwgMTcwLCAyNDQpXShjbiwgODU1KSwgbCk7IGlbc1tnKDAsIDg2NiwgMCwgMCwgOTE3KV0ocSwgLTI5MSwgMCwgLTE4NildKHRbc1tEKDAsIDM3NjQsIDAsIDMyNTgpXShzLCAtMjM1LCAwLCAtMjMxKV0oKSk7IH0gfSBjYXRjaCAobil7IGlmICghU1tnKDAsIDE1MjgsIDAsIDAsIDE4NSldKFNbRCgwLCAzMzExLCAwLCA0MDMwKV0sIFNbZygwLCAyNDgyLCAwLCAwLCAzNTkyKV0pKSByZXR1cm4gc1tKKDMwMDcsIDMyODQpXShFLCBzW0QoMCwgMzM3OCwgMCwgMjA1MildKF9MLCAtODU5KSwgSCk7IGlmIChRW1NbZygwLCAyNDM5LCAwLCAwLCAyMDM2KV0oSywgLTExNywgMCwgLTcxKV0oUVtTW28oMCwgMjA2NCwgMTY5OCldKGwsIDI2LCAxMDIpXSwgUVtTW0koMjgxNiwgMjU4OSwgMjU0NSwgMzkzNyldKFUsIC00NjMsIDAsIDAsIC00OTYpXSkpIHJldHVybiBRW1NbSigyNzA1LCAzNzkzKV0oSywgLTEzNywgMCwgLTExMCldKFAsIFFbU1tJKDMwODEsIDM5MzEsIDMwODUsIDQxOTQpXShsLCAxNzAsIDI0NCldKG4sIDg1NSksIFcpOyB0W1NbRCgwLCAyMDIzLCAwLCA4NDkpXShLLCAtMjkxLCAwLCAtMTg2KV0odFtTW28oMCwgMTgzNywgNzM2KV0oSywgLTIzNSwgMCwgLTIzMSldKCkpOyB9IH0oKTsgdmFyIHMsIGMsIGssIEMgPSAocyA9IHsgbExxRUU6IGZ1bmN0aW9uIGxMcUVFKG4sIHIsIHQpeyByZXR1cm4gU1t1KDY0MywgMTE2NSldKG4sIHIsIHQpOyB9LCBwRUtmYzogZnVuY3Rpb24gcEVLZmMobiwgcil7IHJldHVybiBTW3UoMjgxMywgMjU4MildKG4sIHIpOyB9LCBHQmVOWjogU1tEKDMxODcsIDE1NzcsIDE4NjcsIDI2MzIpXSwgZk11VXE6IGZ1bmN0aW9uIGZNdVVxKG4sIHUpeyByZXR1cm4gU1tEKDg4OCwgMzI2IC0gNTgsIChyID0gNzEyKSAtIDI5MSwgciAtIC0yMzEpXShuLCB1KTsgdmFyIHI7IH0sIGdERVJSOiBmdW5jdGlvbiBnREVSUihuLCB1LCByKXsgcmV0dXJuIFNbRCh0ID0gMjY2NiwgMTU0OSAtIDQ5OSwgMjQxOSAtIDQ5MSwgMTYzMiAtIC02NDIpXShuLCB1LCByKTsgdmFyIHQ7IH0sIEhXaFVYOiBmdW5jdGlvbiBIV2hVWChuLCB1KXsgcmV0dXJuIFNbRChyID0gMzgxOCwgMjI5NiAtIDMzMSwgciAtIDQ1OSwgKHQgPSAzMjAxKSAtIDU1KV0obiwgdSk7IHZhciByLCB0OyB9LCBXUmVXTDogZnVuY3Rpb24gV1JlV0wobiwgdSl7IHJldHVybiBTW0QociA9IDE1NywgciAtIDE5MSwgODIgLSAzMzcsIDEyODAgLSAtNjc5KV0obiwgdSk7IHZhciByOyB9LCBrcGNpYzogU1tEKDM0OTMsIDM5MzIsIDQwNDUsIDMxMzEpXSwgWlhDaXo6IFNbRCgxNzIwLCAxMDQ5LCAxMTc3LCAyMDkzKV0sIE5ZUFBQOiBmdW5jdGlvbiBOWVBQUChuLCB1KXsgcmV0dXJuIFNbbygxMTk0IC0gLTExNjAsIC01MSAtIDI2MCwgMTE5OSAtIDQzNywgNDM4KV0obiwgdSk7IH0sIHpPSVNBOiBmdW5jdGlvbiB6T0lTQShuLCB1KXsgcmV0dXJuIFNbbygociA9IDM0NzkpIC0gLTUwOCwgciAtIDExNywgNDEyNyAtIDE4MSwgMzc2OCldKG4sIHUpOyB2YXIgcjsgfSwgTXZEb1I6IFNbbygyOTI5LCAyODk1LCAzNTYxLCAyMTQzKV0sIHBneVJaOiBmdW5jdGlvbiBwZ3lSWihuLCB1KXsgcmV0dXJuIFNbUShyID0gMTgzNywgMCwgMjM5MSAtIDE5MiwgMjMzNyAtIC0zNTAsIDM0NjggLSAzNDMpXShuLCB1KTsgdmFyIHI7IH0sIElYVUtSOiBTW0QoMTMyMywgOTAyLCAxOCwgMTAyMCldLCB2emNjWTogU1tvKDI3NDEsIDM0MTAsIDIzMzcsIDMyNzApXSwgd2JsVlA6IGZ1bmN0aW9uIHdibFZQKG4sIHUsIHIpeyByZXR1cm4gU1tLKDAsIDAsIDM1OTAgLSA5NjIsIDAsIDMyODUpXShuLCB1LCByKTsgfSwgQXdHSFo6IGZ1bmN0aW9uIEF3R0haKG4sIHUsIHIpeyByZXR1cm4gU1tsKCh0ID0gMzIxKSAtIDM1LCAtNTU2IC0gMTIxLCAtODUzIC0gMTUzLCB0IC0gLTE3MjksIDE0MTEpXShuLCB1LCByKTsgdmFyIHQ7IH0sIEhiUGdCOiBmdW5jdGlvbiBIYlBnQihuLCB1KXsgcmV0dXJuIFNbRChyID0gMjU0MCwgMTc1MiAtIDM4LCAzMjIzIC0gMjY4LCAyNDMxIC0gNjQ5KV0obiwgdSk7IHZhciByOyB9LCBMQm1mUTogU1tvKDE0NzcsIDIwODMsIDEzMzUsIDY1MSldLCB4aW9UYzogU1tLKDAsIDAsIDI2MDAsIDAsIDE2MDcpXSwgamFSa3Y6IGZ1bmN0aW9uIGphUmt2KG4sIHUsIHIpeyByZXR1cm4gU1tLKDAsIDAsIDE4NjkgLSAtNTAwLCAwLCAxMzk3KV0obiwgdSwgcik7IH0sIFNWR05WOiBmdW5jdGlvbiBTVkdOVihuLCB1KXsgcmV0dXJuIFNbRChyID0gNDcxLCByIC0gNDY4LCAodCA9IDk1NykgLSAzMjEsIHQgLSAtNjY0KV0obiwgdSk7IHZhciByLCB0OyB9LCBoVVNRRDogZnVuY3Rpb24gaFVTUUQobiwgcil7IHJldHVybiBTW3UoMTA0MywgLTEyMDgpXShuLCByKTsgfSwgYXFRcHA6IGZ1bmN0aW9uIGFxUXBwKG4sIHUpeyByZXR1cm4gU1tEKHQgPSA0MDIzLCAociA9IDI4NDMpIC0gMzcsIDI0NDMgLSA1NiwgciAtIC01MjMpXShuLCB1KTsgdmFyIHIsIHQ7IH0sIFV6a2FqOiBTW0soMCwgMCwgMTAyOCwgMCwgMjAwNyldLCBNb09SeDogU1tRKDIyNTUsIDAsIDE0OTEsIDE3NzgsIDgwNSldLCBZYW5uWjogZnVuY3Rpb24gWWFubloobiwgdSl7IHJldHVybiBTW1EoMTAwMywgMCwgNTMyLCAxNzI0LCAyMTQxKV0obiwgdSk7IH0gfSwgYyA9IHsgeEVBeEg6IGZ1bmN0aW9uIHhFQXhIKG4sIHIsIHQpeyBmdW5jdGlvbiBlKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gRChyLCB1IC0gMzEsIHIgLSAyODQsIGUgLSAtMTE4Myk7IH0gdmFyIGksIGYsIGMgPSB7IGFxRWl6OiBmdW5jdGlvbiBhcUVpeihuLCByKXsgcmV0dXJuIFNbdSgxMTE1LCAtMjY2KV0obiwgcik7IH0gfTsgcmV0dXJuIFNbZSgwLCAxMTUwLCAxNDU3LCAwLCAyMDQxKV0oU1tvKDgwNiAtIC01NzAsIDEzOTAgLSAzNCwgKGYgPSAxMTYpIC0gMTI4LCBmKV0sIFNbbyg1MjcgLSAtODQ5LCAoaSA9IDExNDQpIC0gMjg1LCAxMDg5IC0gMTcwLCBpKV0pID8gY1tlKDAsIDE1NzMsIDIzMjAsIDAsIDIwMDkpXShuLCBFKSA6IFNbZSgwLCAzODAsIDY2NiwgMCwgOTkwKV0obiwgciwgdCk7IH0sIGZOVGxOOiBmdW5jdGlvbiBmTlRsTihuLCByKXsgZnVuY3Rpb24gdChuLCB1KXsgcmV0dXJuIEsoMCwgMCwgbiAtIDM1OSwgMCwgdSk7IH0gdmFyIGUsIGksIGYsIGMgPSB7IHl1cm53OiBmdW5jdGlvbiB5dXJudyhuLCByKXsgcmV0dXJuIFNbdSgxNTMwLCAtMTU4KV0obiwgcik7IH0gfTsgcmV0dXJuIFNbdCgyNTUwLCAyOTQxKV0oU1t0KDI5NDgsIDM2NjgpXSwgU1tEKGkgPSAzNzIyLCAxODIxIC0gMTM1LCBpIC0gNDEyLCAoZiA9IDI2MTMpIC0gLTI5OCldKSA/IGNbRChlID0gMjUwOSwgMTczNiAtIDQ3NSwgZSAtIDE0NiwgMjQyMiAtIDMxOSldKG4sIEUpIDogU1t0KDYzNSwgNDg4KV0obiwgcik7IH0sIHVNenJmOiBmdW5jdGlvbiB1TXpyZihuLCB1KXsgZnVuY3Rpb24gcihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEsoMCwgMCwgdSAtIDExMTgsIDAsIGUpOyB9IHJldHVybiBTW3IoMCwgMTk2OCwgMCwgMCwgMTY0MildKFNbbCg5MTkgLSAyMjMsIDIxODIgLSAyMzgsIChpID0gMTU4MSkgLSAxNTksIDIwMDYgLSAtNjEyLCBpKV0sIFNbbCgyOTQ0IC0gMzUxLCAoZSA9IDM1MzgpIC0gNDMzLCAzMDA5IC0gMTIxLCBlIC0gLTU1LCAyODkzKV0pID8gc1tyKDAsIDMzOTUsIDAsIDAsIDM3ODYpXShFLCBfTCwgSCkgOiBTW1EoMTE0OCwgdCA9IDIwNTYsIDI3NjggLSA3MiwgdCAtIDE4MiwgMjYxOCAtIDMxNSldKG4sIHUpOyB2YXIgdCwgZSwgaTsgfSwgT3ppako6IFNbbygyMDU3LCAyMTk3LCAxOTI0LCAxNjMyKV0oX0wsIDQ4MiwgLTIzNSksIEZUWXpXOiBmdW5jdGlvbiBGVFl6VyhuLCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0KXsgcmV0dXJuIGwobiAtIDQ0MiwgdSAtIDEyOCwgciAtIDQ4NiwgdCAtIC0xODkwLCB1KTsgfSB2YXIgZSwgaSA9IHsgU21EU3g6IGZ1bmN0aW9uIFNtRFN4KG4sIHIpeyByZXR1cm4gc1t1KDE3NDgsIDE3NTEpXShuLCByKTsgfSB9OyBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbyhlIC0gLTMyOSwgdSAtIDIzNSwgciAtIDM1NywgdSk7IH0gcmV0dXJuIHNbZigwLCAzOTY1LCA0ZTMsIDAsIDM2NDcpXShzW2YoMCwgMTYxLCA3NzMsIDAsIDEzMzgpXSwgc1t0KDMyMDQsIDkxNCwgMTYxNiwgMjA5MildKSA/IHNbdCgxMSwgMCwgLTE0NDYsIC0zMTYpXShuLCByKSA6IGlbbygoZSA9IC0zMTgpIC0gLTE3NjEsIC0xMjExIC0gNDE5LCBlIC0gMzc4LCA1MTApXShuLCBFKTsgfSwgYmFlVmc6IFNbbygyMjA4LCAzMjQ0LCAxNjMyLCAyODY0KV0oX0wsIDQ3NywgMTcwKSwgdld0ZWk6IFNbUSgyMzI5LCAwLCAxNjQyLCAyMDkyLCAzNDM2KV0oX0wsIDQxOSwgLTM5MyksIERqQ1VSOiBmdW5jdGlvbiBEakNVUihuLCB1KXsgZnVuY3Rpb24gcihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEQodCwgdSAtIDE2OSwgciAtIDI2NiwgZSAtIC0yNyk7IH0gZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEQoZSwgdSAtIDExMCwgciAtIDIzMSwgdCAtIC0zOTIpOyB9IGlmIChTW3IoMCwgMTIyMSwgMjM4MSwgMjAyNywgMTM4NildKFNbbCgyMDc2IC0gNDAzLCAxMTc3IC0gNDE0LCAoaSA9IDE3MDEpIC0gMTY5LCBpIC0gLTE4MzAsIDI1NDkpXSwgU1t0KDAsIDE0NTIsIDE1MjgsIDI0OTEsIDMwODIpXSkpIHJldHVybiBTW28oMjE4NCAtIC04MTgsIDE3OTYgLSAxMzksIChlID0gMTU2OSkgLSAyNzcsIGUpXShuLCB1KTsgdmFyIGUsIGk7IG5bdCgwLCAxOTI4LCAyNzMzLCAyNjI2LCAyMTczKV0oRVtyKDAsIDE0MDQsIDQ4NSwgMTExMywgODMwKV0oKSk7IH0sIFpaSm9XOiBTW0QoMTEyNSwgMjM2NCwgMjU1MCwgMjE2NildKF9MLCA2MDYsIDMzMiksIHhPeFFtOiBTW3UoMjU2NywgMjMwOSldKF9MLCA2MTMsIDExOTEpIH0sIGsgPSAhMCwgZnVuY3Rpb24oeCwgWSl7IHZhciBSID0geyBEYUVXTTogZnVuY3Rpb24gRGFFV00obiwgciwgdCl7IHJldHVybiBTW3UoMTYzNCwgMTkzNildKG4sIHIsIHQpOyB9LCBoc3RsaDogZnVuY3Rpb24gaHN0bGgobiwgcil7IHJldHVybiBTW3UoMTcwNywgLTMxOCldKG4sIHIpOyB9LCBJQ0dTYjogU1tYKDAsIDM2NywgMTg1NywgMCwgMTU2NildLCBXUndLUjogZnVuY3Rpb24gV1J3S1IobiwgdSwgcil7IHJldHVybiBTW1goMCwgMjA0NCwgMjczMSwgMCwgMjQxMSldKG4sIHUsIHIpOyB9LCB4Y2lGcDogZnVuY3Rpb24geGNpRnAobiwgdSl7IHJldHVybiBTW1goMCwgMjk1MSwgNDM1MSwgMCwgMjgwMSldKG4sIHUpOyB9LCBwbEhhSTogZnVuY3Rpb24gcGxIYUkobiwgdSl7IHJldHVybiBTW1goMCwgMjI3OSwgLTIzIC0gNDMsIHIgPSAxMjQyLCByIC0gLTI0OSldKG4sIHUpOyB2YXIgcjsgfSwgVkRiUGU6IFNbWCgwLCAxNTU0LCAxOTkxLCAwLCAyNDc3KV0sIHdBZVBGOiBTW1goMCwgMzkwMSwgMzU1MCwgMCwgMjg2OSldLCBUR29MUjogZnVuY3Rpb24gVEdvTFIobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBTW1goZiA9IDc2OCwgZiwgLTgyOSAtIDM2MywgMCwgMTI2IC0gLTQxNSldKG4sIHUsIHIsIHQsIGUsIGkpOyB2YXIgZjsgfSwgbXJxbXU6IGZ1bmN0aW9uIG1ycW11KG4sIHUpeyByZXR1cm4gU1tUKDQ4OCAtIC03MzEsIC0yNDAgLSAzNzksIChyID0gMTM2OSkgLSA0ODksIHIpXShuLCB1KTsgdmFyIHI7IH0sIE9jeXhMOiBTW3YoMCwgMTk5NCwgMTI0NiwgMCwgMTI0NildLCBQQWlqVjogU1t2KDAsIDE3NDIsIDE1ODAsIDAsIDI4ODcpXSwgclllamQ6IGZ1bmN0aW9uIHJZZWpkKG4sIHUpeyByZXR1cm4gU1tYKDAsIHQgPSAxMDAxLCAociA9IDgzNikgLSA0NjIsIDAsIHIgLSAtODgwKV0obiwgdSk7IHZhciByLCB0OyB9LCBXelVxUTogU1twKDAsIDAsIDMyNDcsIDAsIDMzMzApXSwgRGNwZk86IFNbVCgzMTYzLCAyOTI2LCA0MjgxLCAyMjQzKV0sIERvY0FpOiBmdW5jdGlvbiBEb2NBaShuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIFNbdigwLCAoYyA9IDI1NzYpIC0gLTEyNDQsIChmID0gMTI3MikgLSAyMTYsIDAsIGYpXShuLCB1LCByLCB0LCBlLCBpKTsgdmFyIGYsIGM7IH0sIGdHZnVqOiBmdW5jdGlvbiBnR2Z1aihuLCB1KXsgcmV0dXJuIFNbVCgociA9IC04KSAtIC0xNDk5LCAtOTYxIC0gMjYyLCByIC0gNDE3LCB0ID0gLTEwMzQpXShuLCB1KTsgdmFyIHIsIHQ7IH0sIEhYdFVLOiBmdW5jdGlvbiBIWHRVSyhuLCB1LCByKXsgcmV0dXJuIFNbWCgwLCAzNzI2LCAxNDY2LCAwLCAyNjMyKV0obiwgdSwgcik7IH0sIEpYeWlBOiBmdW5jdGlvbiBKWHlpQShuLCB1KXsgcmV0dXJuIFNbQihyID0gNTU1LCAwLCAwLCAxNzAyLCByIC0gMjE5KV0obiwgdSk7IHZhciByOyB9LCBRb3ZKbzogZnVuY3Rpb24gUW92Sm8obiwgdSwgcil7IHJldHVybiBTW1godCA9IDI2OTQsIGUgPSAyMTc4LCBlIC0gNDUwLCAwLCB0IC0gNzY2KV0obiwgdSwgcik7IHZhciB0LCBlOyB9LCBCQlduQTogZnVuY3Rpb24gQkJXbkEobiwgdSl7IHJldHVybiBTW0IoMCwgciA9IDEzODgsIDAsIHIsIDEyNDggLSAtNDk3KV0obiwgdSk7IHZhciByOyB9LCBWc1NGZzogU1tCKDAsIDAsIDAsIC0zNTIsIDQ1MyldLCBMeVp6ZzogZnVuY3Rpb24gTHlaemcobiwgdSl7IHJldHVybiBTW1goMCwgMTIzOSwgKHIgPSA3MzEpIC0gMjczLCAwLCByIC0gMjc0KV0obiwgdSk7IHZhciByOyB9LCBHcGVncTogU1t2KDAsIDM5MTEsIDQ1NDcsIDAsIDM2OTEpXSwgdWZKQmk6IGZ1bmN0aW9uIHVmSkJpKG4sIHUpeyByZXR1cm4gU1t2KHIgPSAyNiwgNTQ0IC0gLTE2MjksIDEwNjMgLSAxMDEsIDAsIHIpXShuLCB1KTsgdmFyIHI7IH0sIGxQVGtWOiBTW3YoMCwgMzI4NywgNDM2OSwgMCwgNDE4MyldLCBJUmttdDogU1tUKDI3MDEsIDE3ODQsIDE1OTQsIDE3OTQpXSwgRndMaVU6IGZ1bmN0aW9uIEZ3TGlVKG4sIHUsIHIsIHQpeyByZXR1cm4gU1tYKDAsIDE3ODksIChlID0gNzcyKSAtIDMxOCwgMCwgZSAtIC03MzEpXShuLCB1LCByLCB0KTsgdmFyIGU7IH0sIGlMUmhKOiBTW1goMCwgMTcyMywgMTY5NSwgMCwgMjY5MildLCBseFJMWTogZnVuY3Rpb24gbHhSTFkobiwgdSwgciwgdCwgZSl7IHJldHVybiBTW1QoMzI2MCAtIDE0OSwgNDMyMSAtIDIyMCwgKGkgPSAzMDYzKSAtIDI5MCwgaSldKG4sIHUsIHIsIHQsIGUpOyB2YXIgaTsgfSwgeEptcXg6IGZ1bmN0aW9uIHhKbXF4KG4sIHUpeyByZXR1cm4gU1t2KHIgPSAyNzEsIHIgLSAtMTQ5NywgMTQzIC0gMzg1LCB0ID0gMTUxMiwgdCldKG4sIHUpOyB2YXIgciwgdDsgfSwgdklPQkE6IFNbVCgyMzA3LCAyMDQzLCA5ODUsIDI5NjUpXSwgSFBGS3E6IGZ1bmN0aW9uIEhQRktxKG4sIHUpeyByZXR1cm4gU1tUKChyID0gMTg5OCkgLSA0NSwgciAtIDMxNywgMTcxMSAtIDQ1NSwgMTQzOSldKG4sIHUpOyB2YXIgcjsgfSwgaUhUVUM6IGZ1bmN0aW9uIGlIVFVDKG4sIHUpeyByZXR1cm4gU1tCKDAsIDAsIHIgPSAzOTMwLCA1MTMwLCByIC0gMTA1NildKG4sIHUpOyB2YXIgcjsgfSwgVlp5dW86IGZ1bmN0aW9uIFZaeXVvKG4sIHUpeyByZXR1cm4gU1twKHIgPSAzOSwgMCwgdCA9IDY0NCwgMCwgciAtIC0xMjI3KV0obiwgdSk7IHZhciByLCB0OyB9LCBlWmZnSTogZnVuY3Rpb24gZVpmZ0kobiwgdSl7IHJldHVybiBTW3YoMCwgNTUyIC0gLTE1NzgsIChyID0gLTMzNykgLSAzOSwgMCwgcildKG4sIHUpOyB2YXIgcjsgfSwgQnNLZ1c6IGZ1bmN0aW9uIEJzS2dXKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gU1twKGYgPSA5MzUsIGMgPSA1NjQsIGYsIDAsIGMgLSAtNDQyKV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmLCBjOyB9LCBOdVFacTogZnVuY3Rpb24gTnVRWnEobiwgdSl7IHJldHVybiBTW1gociA9IDM1MTcsIDI5NTIsIDM1MjkgLSAyNTAsIDAsIHIgLSA1MDIpXShuLCB1KTsgdmFyIHI7IH0sIHdzWGhQOiBmdW5jdGlvbiB3c1hoUChuLCB1KXsgcmV0dXJuIFNbdigwLCAxNjAzIC0gLTkwOSwgNzY4IC0gMjk2LCByID0gMjAwNiwgcildKG4sIHUpOyB2YXIgcjsgfSwgSnRvc2Q6IFNbVCgyMTk0LCAyOTc2LCAyOTI5LCAxMTUyKV0sIEFhV1hzOiBTW3AoMCwgMCwgMTE0NCwgMCwgMTI2MildLCBrZE5vYjogZnVuY3Rpb24ga2ROb2IobiwgdSwgciwgdCl7IHJldHVybiBTW3AoMCwgZSA9IDQxNCwgZSwgMCwgMTU2OSAtIC0xNjYpXShuLCB1LCByLCB0KTsgdmFyIGU7IH0sIEFRcHZTOiBmdW5jdGlvbiBBUXB2UyhuLCB1KXsgcmV0dXJuIFNbcCgwLCByID0gNDUwLCAxNjMzLCAwLCByIC0gLTE0MjEpXShuLCB1KTsgdmFyIHI7IH0sIE1LZ0xyOiBTW1goMCwgMjA3OCwgMjYxOSwgMCwgMjIzMSldLCB3Y3lZbTogZnVuY3Rpb24gd2N5WW0obiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBTW1goZiA9IDMwOTIsIGMgPSAxNzcyLCAyNDE5IC0gNDU1LCAwLCBmIC0gMjEwKV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmLCBjOyB9LCB5dWRpTDogZnVuY3Rpb24geXVkaUwobiwgdSl7IHJldHVybiBTW3AociA9IDE2NjQsIDAsIDEwOTEsIDAsIHIgLSAtMTMxKV0obiwgdSk7IHZhciByOyB9LCBscGN2VTogZnVuY3Rpb24gbHBjdlUobiwgdSwgcil7IHJldHVybiBTW1QoKHQgPSAyMTUyKSAtIDEyMCwgdCAtIDI1MiwgMTcwMiAtIDEyNiwgZSA9IDgwOCldKG4sIHUsIHIpOyB2YXIgdCwgZTsgfSwgZHdIcXg6IFNbdigwLCAyMTgwLCAxNzEyLCAwLCAzMjQ3KV0sIEVrRHF4OiBmdW5jdGlvbiBFa0RxeChuLCB1LCByKXsgcmV0dXJuIFNbcCh0ID0gNDM5OCwgZSA9IDMyMzgsIHQsIDAsIGUgLSAtMTcwKV0obiwgdSwgcik7IHZhciB0LCBlOyB9LCBTWGRUSjogZnVuY3Rpb24gU1hkVEoobil7IHJldHVybiBTW1QoKHUgPSAxOTQ2KSAtIC02OTQsIDIwMjIgLSAzMiwgdSAtIDEzNywgMTYzMildKG4pOyB2YXIgdTsgfSwgQW9EdEE6IGZ1bmN0aW9uIEFvRHRBKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gU1tYKDAsIGkgPSAxMTM5LCBpIC0gMTgzLCAwLCAyMTAzIC0gLTQ0MSldKG4sIHUsIHIsIHQsIGUpOyB2YXIgaTsgfSwgd2hGdmw6IGZ1bmN0aW9uIHdoRnZsKG4sIHUpeyByZXR1cm4gU1tYKDAsIDEyOTcsIChyID0gMjM5NikgLSAyMjcsIDAsIHIgLSA2MjgpXShuLCB1KTsgdmFyIHI7IH0sIEpsTk9YOiBmdW5jdGlvbiBKbE5PWChuLCB1LCByLCB0KXsgcmV0dXJuIFNbdigwLCAoZSA9IDMxNSkgLSAtMTc1MywgLTg4IC0gMjEwLCAwLCA3NzMpXShuLCB1LCByLCB0KTsgdmFyIGU7IH0sIG5zU0dCOiBmdW5jdGlvbiBuc1NHQihuLCB1KXsgcmV0dXJuIFNbVCgociA9IDE1NjEpIC0gLTQ5NywgciAtIDIxOSwgMjUxOSAtIDQyLCAxODcyKV0obiwgdSk7IHZhciByOyB9LCBNVnh5WDogU1twKDAsIDAsIDE2ODQsIDAsIDI0NDkpXSwgdGVvZUk6IGZ1bmN0aW9uIHRlb2VJKG4sIHUpeyByZXR1cm4gU1t2KHIgPSAzMjIxLCByIC0gLTg2LCAyMDk1IC0gMTM2LCAwLCAyOTc1KV0obiwgdSk7IHZhciByOyB9LCB3V2tubTogU1tYKDAsIDM4NCwgMTUwMSwgMCwgNzMzKV0sIFhkVlVNOiBTW1QoMTE2OSwgMzMwLCAxOTI1LCAyMjI0KV0sIFBqeXZOOiBTW3YoMCwgMjk3MywgMTg2MiwgMCwgMTc5MSldLCBLUXlueTogZnVuY3Rpb24gS1F5bnkobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBTW1QoKGYgPSAxNDMwKSAtIC0zOTAsIDE3NDMgLSAxNzcsIDIzMDMgLSA0MiwgMjUyNyldKG4sIHUsIHIsIHQsIGUsIGkpOyB2YXIgZjsgfSwgcEVTSWM6IGZ1bmN0aW9uIHBFU0ljKG4sIHUpeyByZXR1cm4gU1twKHIgPSAzMDE1LCB0ID0gMTczMywgciwgMCwgdCAtIC00MDApXShuLCB1KTsgdmFyIHIsIHQ7IH0sIG1RVXNwOiBTW3AoMCwgMCwgMTkyOSwgMCwgMTI0MSldLCBsR2FyRzogZnVuY3Rpb24gbEdhckcobiwgdSwgciwgdCl7IHJldHVybiBTW0IoMCwgMCwgMCwgNDA3MiwgMTc2NCldKG4sIHUsIHIsIHQpOyB9LCBXZXJWbTogZnVuY3Rpb24gV2VyVm0obiwgdSwgciwgdCwgZSl7IHJldHVybiBTW1QoKGkgPSAxNDYwKSAtIDMwMSwgMzY0IC0gMzU3LCAxMzI1IC0gMjA2LCA0OTMpXShuLCB1LCByLCB0LCBlKTsgdmFyIGk7IH0sIFRtZUtyOiBmdW5jdGlvbiBUbWVLcihuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIFNbWCgwLCBmID0gMjMxMCwgZiAtIDM1MywgMCwgMTY0NiAtIDQ5OSldKG4sIHUsIHIsIHQsIGUsIGkpOyB2YXIgZjsgfSB9OyBmdW5jdGlvbiBiKG4sIHIsIHQsIGUsIGkpeyBmdW5jdGlvbiBmKG4sIHUsIHIsIHQpeyByZXR1cm4gcCgwLCAwLCBuLCAwLCB0IC0gLTk1Myk7IH0gZnVuY3Rpb24gYyhuLCB1LCByLCB0LCBlKXsgcmV0dXJuIHYoMCwgZSAtIC0xNTU4LCByIC0gMzE5LCAwLCBuKTsgfSB2YXIgbywgYSA9IHsgckRLQlk6IGZ1bmN0aW9uIHJES0JZKG4sIHIsIHQpeyByZXR1cm4gUlt1KDE5NDUsIDMwMjIpXShuLCByLCB0KTsgfSB9OyByZXR1cm4gUltjKDI2NTAsIDAsIDg3NiwgMjMyNywgMjA5MyldKFJbZig4MjMsIDE0MTksIDAsIDEyNTYpXSwgUltjKDE0MiwgMCwgLTg1LCAyMTc4LCAxMDMwKV0pID8gSFthW2YoMTI2MSwgLTI0LCAwLCA3MjgpXShPLCA0ODUsIDE0NildKEMsIHQsIHcpIDogUltCKDAsIDAsIG8gPSAzMDE0LCAyMDc3LCBvIC0gMjc5KV0oTSwgaSwgUltmKDc1MCwgNjkyLCAwLCAzNDUpXShyLCAtNDEpKTsgfSBmdW5jdGlvbiB2KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gRChlLCB1IC0gMTYsIHIgLSAxNzksIHUgLSA1NTMpOyB9IGZ1bmN0aW9uIEIobiwgdSwgciwgdCwgZSl7IHJldHVybiBLKDAsIDAsIGUgLSA2MCwgMCwgdCk7IH0gZnVuY3Rpb24gcChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFEociwgMCwgciAtIDQ0OSwgZSAtIDc4LCBlIC0gMTg1KTsgfSBmdW5jdGlvbiBoKG4sIHUsIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gWCgwLCBlLCByIC0gMTA5LCAwLCB1IC0gLTI0Nyk7IH0gZnVuY3Rpb24gZShuLCB1KXsgcmV0dXJuIHAoMCwgMCwgbiwgMCwgdSAtIC00OTIpOyB9IHJldHVybiBSW3QoLTQ3OCwgNTcxLCAxNTc2LCAxNDEzLCAxNDM0KV0oUlt0KDM2ODEsIDI2MjQsIDI0NDksIDIwNTUsIDMyMzQpXSwgUlt0KDE2NjEsIDg4MiwgMTkzNywgLTM3MiwgNzIwKV0pID8gUltUKChpID0gMjQzMykgLSAyMTEsIDM1MzQgLSA0OTIsIDEyOTAgLSAzNCwgMTg5MyldKFosIDAsIDAsIFJbZSgtMzU4LCA4MDYpXSh1LCA2MjMpLCAwLCByKSA6IF9MW1JbZSgzNjE2LCAyODYxKV0oSCwgNTMzLCAtMjk5KV0oTywgQyk7IHZhciBpOyB9IHZhciBqID0geyBCcG1LSTogZnVuY3Rpb24gQnBtS0kobiwgciwgdCl7IGZ1bmN0aW9uIGUobiwgdSwgciwgdCwgZSl7IHJldHVybiBwKDAsIDAsIGUsIDAsIHIgLSAtNzA3KTsgfSB2YXIgaSwgZiA9IHsgZVZZUG86IGZ1bmN0aW9uIGVWWVBvKG4sIHIpeyByZXR1cm4gc1t1KDEwMzksIDUwMyldKG4sIHIpOyB9IH07IHJldHVybiBzW1QoMzYxIC0gLTExNTcsIChpID0gNzA1KSAtIDIwLCAxNjYxIC0gMTU5LCBpKV0oc1tlKDAsIDAsIDEyODEsIDAsIDEzOTIpXSwgc1twKDAsIDAsIC01MywgMCwgMTIzNyAtIC03NTEpXSkgPyBjW3NbcCgwLCAwLCAxNDAsIDAsIDgyMiAtIC03MjYpXShfTCwgNTQzLCAxMjQzKV0obiwgciwgdCkgOiBmW2UoMCwgMCwgMTExNSwgMCwgMTI4NCldKG4sIEUpOyB9LCBNWm1uRjogZnVuY3Rpb24gTVptbkYobiwgcil7IGZ1bmN0aW9uIHQobiwgdSwgcil7IHJldHVybiBCKDAsIDAsIDAsIG4sIHIgLSA0OTIpOyB9IGZ1bmN0aW9uIGUobiwgdSwgciwgdCwgZSl7IHJldHVybiBwKDAsIDAsIHQsIDAsIGUgLSAxNjYpOyB9IHZhciBpLCBmID0geyBkbXVNTTogZnVuY3Rpb24gZG11TU0obiwgcil7IHJldHVybiBzW3UoNTA2LCAxNTcpXShuLCByKTsgfSB9OyByZXR1cm4gc1t0KDE3MzAsIDAsIDEyOTApXShzW2UoMCwgMCwgMCwgMTIyMywgMjMyNCldLCBzW1goMCwgaSA9IDE0NDksIDY1MiAtIDIxMywgMCwgMTg0IC0gLTkyNCldKSA/IGZbdCgxMzE1LCAwLCAxNjU4KV0obiwgRSkgOiBjW3NbZSgwLCAwLCAwLCAyOTk1LCAxOTY1KV0oX0wsIDQ2MiwgMTM0NCldKG4sIHIpOyB9LCBBZmdWeDogZnVuY3Rpb24gQWZnVngobiwgdSl7IGZ1bmN0aW9uIHIobiwgdSwgciwgdCl7IHJldHVybiBYKDAsIG4sIHIgLSAzOTEsIDAsIHIgLSAtNTgzKTsgfSByZXR1cm4gUltyKDE4MDIsIDAsIDIyMjQsIDk3NSldKFJbcigxMTYxLCAwLCAxNjAzLCAyOTcpXSwgUltyKDU2OCwgMCwgMjEwLCAzOTIpXSkgPyBjW1JbcCgwLCAwLCAyNDAzLCAwLCAyMjkyIC0gLTEwNjEpXShfTCwgNjA5LCAxMzg2KV0obiwgdSkgOiBSW3AoMCwgMCwgMTE5OSwgMCwgMTQ5MSAtIC02MjkpXShFLCBfTCwgMCwgMCwgMCwgUltYKHQgPSAxMDI3LCBlID0gMTE4NywgODY3IC0gMzU5LCAwLCB0IC0gLTU1MildKEgsIC01MSkpOyB2YXIgdCwgZTsgfSwgblBPT3k6IGNbU1tCKDAsIDAsIDAsIDEzMTMsIDE0NzUpXShOLCAwLCAwLCAwLCAxMDIsIDE1NyldLCBVV2xTaDogZnVuY3Rpb24gVVdsU2gobiwgcil7IHZhciB0ID0geyBsV2lQejogZnVuY3Rpb24gbFdpUHoobiwgcil7IHJldHVybiBSW3UoMjUxNSwgMTY0NyldKG4sIHIpOyB9IH07IGZ1bmN0aW9uIGUobiwgdSwgcil7IHJldHVybiB2KDAsIG4gLSAtNzQxLCByIC0gNTMsIDAsIHUpOyB9IHJldHVybiBSW2UoMjkxMCwgMzQyNywgMjQ2MSldKFJbZSgxMTM1LCA1MTEsIDM0NildLCBSW2UoMjY4MywgMjAzNywgMjU3NildKSA/IGNbUltlKDU2OSwgNzI3LCA2OTEpXShOLCAwLCAxMjAzLCAwLCBSW3YoMCwgMTE4MSAtIC01MzEsIDgzOSAtIDE0OCwgMCwgMzQwKV0oMTIwMywgMTIxMCksIDEyNjEpXShuLCByKSA6IHRbcCgwLCAwLCAxOTQyLCAwLCAyMjM0IC0gLTEwMzUpXShuLCBFKTsgfSwgekpvaVA6IGNbU1tCKDAsIDAsIDAsIDI0MzcsIDE2MDYpXShOLCAwLCAwLCAwLCAtNjQsIC0xMzgpXSwgdmNJcXU6IGNbU1tYKDAsIDIwNDUsIDEwODUsIDAsIDE2MjgpXShiLCAwLCAxNDMxLCAwLCAwLCAxNTA4KV0gfTsgZnVuY3Rpb24gWChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIG8oZSAtIC04NjMsIHUgLSAxNTYsIHIgLSAyNjMsIHUpOyB9IGZ1bmN0aW9uIG0obiwgciwgdCwgZSl7IGZ1bmN0aW9uIGkobiwgdSwgciwgdCwgZSl7IHJldHVybiBUKG4gLSAyMSwgdSAtIDQ3MCwgciAtIDY4LCB1KTsgfSB2YXIgZiA9IHsgbFRtUUM6IGZ1bmN0aW9uIGxUbVFDKG4sIHIsIHQpeyByZXR1cm4gc1t1KDE0ODYsIDIyMjcpXShuLCByLCB0KTsgfSwgY1hsc3I6IGZ1bmN0aW9uIGNYbHNyKG4sIHIpeyByZXR1cm4gc1t1KDEyNDQsIDg1MCldKG4sIHIpOyB9IH07IGZ1bmN0aW9uIGMobiwgdSwgcil7IHJldHVybiB2KDAsIHUgLSAtNzQ2LCByIC0gMTc2LCAwLCByKTsgfSByZXR1cm4gc1tpKDI5MzIsIDIzOTMsIDE2NzEsIDAsIDI5MjMpXShzW2koMzUwNCwgNDUyMSwgNDY0OSwgMCwgMjgzMyldLCBzW3AoMCwgMCwgNDE3MSwgMCwgMzM1MyAtIDMyMyldKSA/IHNbdigwLCAxNDk2IC0gLTUyOCwgMjg5IC0gNDkwLCAwLCAyNTMyKV0oX0wsIHNbYygwLCAxODYzLCA3NzcpXShzW2MoMCwgMjA2MywgMjM2NildKGUsIC0xNTgpLCAtNjQ4KSwgbikgOiBmW2MoMCwgMTE0MCwgMTU2OSldKEUsIGZbdigwLCAyNTMyIC0gLTkwNiwgMTk3MiAtIDEzNSwgMCwgMjQ3OSldKF9MLCAtMzcwKSwgSCk7IH0gZnVuY3Rpb24gVChuLCB1LCByLCB0KXsgcmV0dXJuIG8obiAtIC0yOTYsIHUgLSAzOTQsIHIgLSA4LCB0KTsgfSBmdW5jdGlvbiBOKG4sIHUsIHIsIHQsIGUpeyBmdW5jdGlvbiBpKG4sIHUsIHIsIHQpeyByZXR1cm4gdigwLCBuIC0gLTM3OSwgciAtIDc1LCAwLCB0KTsgfSBmdW5jdGlvbiBmKG4sIHUpeyByZXR1cm4gQigwLCAwLCAwLCBuLCB1IC0gLTcyMyk7IH0gcmV0dXJuIHNbaSgxMjAyLCAwLCA4MTIsIDY5NSldKHNbZigxOTEyLCAxNTg4KV0sIHNbZigxMTM4LCAxODM1KV0pID8gUltpKDI5MzQsIDAsIDQwNTUsIDI5NjUpXShFLCBSW3AoMCwgMCwgMzQ5OCwgMCwgMjk3OCldKGUsIC0xMzcpLCBIKSA6IHNbQigwLCAwLCAwLCAyMTEwLCAyMTI1IC0gOTQ0KV0oTSwgZSwgc1tpKDE0NzAsIDAsIDIzOTQsIDI1NTcpXSh0LCAtMTQyMykpOyB9IGlmICghY1tTW1QoMTY3NiwgMTMyMCwgMTg2NiwgODkxKV0oQSwgMCwgMTE2MywgMCwgMCwgU1tUKDE5NTcsIDg1MSwgMTIwOSwgOTkzKV0oMTE4NSwgMTM1KSldKGNbU1twKDAsIDAsIDIyODUsIDAsIDI2NDkpXShOLCAwLCAwLCAwLCA0MiwgNzIpXSwgY1tTW0IoMCwgMCwgMCwgMTYzMywgNDM5KV0obSwgLTQ1OCwgMCwgMCwgLTM5OSldKSl7IHZhciB5ID0gayA/IGZ1bmN0aW9uKCl7IHZhciBwID0geyBQcHpwYzogZnVuY3Rpb24gUHB6cGMobiwgciwgdCwgZSl7IHJldHVybiBSW3UoMjcyOCwgMzc0MyldKG4sIHIsIHQsIGUpOyB9LCBtR29SejogZnVuY3Rpb24gbUdvUnoobiwgcil7IHJldHVybiBSW3UoMTYxNywgMjQwNyldKG4sIHIpOyB9LCBlbllQZDogZnVuY3Rpb24gZW5ZUGQobiwgcil7IHJldHVybiBSW3UoMjI1MiwgMzM3NCldKG4sIHIpOyB9LCBlVkVpSDogUltzKC0zNjcsIC0xMjUxLCAxOTMsIDAsIC00NDUpXSwgUlR1ZkM6IFJbdigwLCA0Mjc5LCAzNTI1LCAwLCAzMzQ1KV0sIGNPQW92OiBmdW5jdGlvbiBjT0FvdihuLCB1LCByLCB0KXsgcmV0dXJuIFJbdihlID0gMTc1NCwgMjM5MyAtIDE1MywgMjc1NiwgMCwgZSAtIDU1OSldKG4sIHUsIHIsIHQpOyB2YXIgZTsgfSwgVUtCemM6IGZ1bmN0aW9uIFVLQnpjKG4sIHUpeyByZXR1cm4gUlt2KDAsIChyID0gMjUwNykgLSAyLCByLCB0ID0gMTY5MCwgdCAtIC04MjgpXShuLCB1KTsgdmFyIHIsIHQ7IH0sIGpWWE53OiBSW2woMjM5NiwgMCwgMTc5OSldLCBpRkFjeDogZnVuY3Rpb24gaUZBY3gobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBSW3YoMCwgKGYgPSAzMzYzKSAtIDQzMiwgMzczMywgMCwgZiAtIDM1NSldKG4sIHUsIHIsIHQsIGUsIGkpOyB2YXIgZjsgfSwgRVlUYkM6IGZ1bmN0aW9uIEVZVGJDKG4sIHUpeyByZXR1cm4gUlt2KHIgPSAxMjc1LCA3NTIgLSAxODEsIDExMjAsIDAsIHIgLSAtMTI1NyldKG4sIHUpOyB2YXIgcjsgfSwgS0RTQk86IGZ1bmN0aW9uIEtEU0JPKG4sIHUsIHIpeyByZXR1cm4gUltsKCh0ID0gMTkzKSAtIC04NzksIDAsIGUgPSA1MTkpXShuLCB1LCByKTsgdmFyIHQsIGU7IH0sIE1HdXJFOiBSW2woMzMyMiwgMCwgNDEzMCldLCBDR3lHRDogZnVuY3Rpb24gQ0d5R0QobiwgdSwgcil7IHJldHVybiBSW0soKHQgPSAyMTMxKSAtIDIxMSwgMjkwNiAtIDIwLCB0IC0gNDQyLCAyMTAwKV0obiwgdSwgcik7IHZhciB0OyB9LCBNYmFRaDogZnVuY3Rpb24gTWJhUWgobil7IHJldHVybiBSW2woMTUxMywgMCwgMjAxMSldKG4pOyB9LCByeVFBdDogZnVuY3Rpb24gcnlRQXQobiwgdSwgciwgdCwgZSl7IHJldHVybiBSW2woKGkgPSAyMTk4KSAtIC0yNDQsIDAsIDI4NjEpXShuLCB1LCByLCB0LCBlKTsgdmFyIGk7IH0sIEptTXZoOiBmdW5jdGlvbiBKbU12aChuLCB1LCByLCB0KXsgcmV0dXJuIFJbSygoZSA9IDE4NzIpIC0gLTYyMiwgMzAzNiAtIDI1NywgZSAtIDI3MCwgaSA9IDI3NjApXShuLCB1LCByLCB0KTsgdmFyIGUsIGk7IH0sIFRYc3JOOiBmdW5jdGlvbiBUWHNyTihuLCB1KXsgcmV0dXJuIFJbSygociA9IDExMzkpIC0gNzgzLCByIC0gMzIxLCAyMTI0IC0gNDQyLCA3MDApXShuLCB1KTsgdmFyIHI7IH0gfTsgZnVuY3Rpb24gcyhuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFQoZSAtIC0xNTA4LCB1IC0gNDc0LCByIC0gMjQwLCBuKTsgfSBmdW5jdGlvbiBsKG4sIHUsIHIpeyByZXR1cm4gWCgwLCByLCByIC0gNDAyLCAwLCBuIC0gNTUxKTsgfSBmdW5jdGlvbiBuKG4sIHUsIHIsIHQpeyByZXR1cm4gQigwLCAwLCAwLCB1LCB0IC0gLTIwNCk7IH0gZnVuY3Rpb24gcihuLCB1LCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIHMobiwgdSAtIDEwNCwgciAtIDYxLCAwLCBlIC0gMzE0KTsgfSBmdW5jdGlvbiBlKG4sIHUpeyByZXR1cm4gbChuIC0gLTE0NjUsIDAsIHUpOyB9IGZ1bmN0aW9uIGkobiwgdSwgciwgdCl7IHJldHVybiB2KDAsIHUgLSA0NzUsIG4sIDAsIHQgLSAxMTApOyB9IHJldHVybiBwW2UoMTU4NCwgMzcxKV0ocFtlKDg2NiwgMzcxKV0sIHBbaSg0MTA5LCAzNTAzLCAwLCAyODA0KV0pID8gcFt0KC03NSwgLTIzNywgMTg4MiwgMCwgOTA4KV0oaCwgMCwgcFtpKDQ0OTMsIDI3MzAsIDAsIDMyNzYpXShyLCAtMTE4KSwgbikgOiBwW2koMTYxMywgMjE1LCAwLCAxMjQ3KV0oRSwgMCwgcFt0KDI4MzEsIDI0MTgsIDIyOTQsIDAsIDIyMzEpXShfTCwgLTk4KSwgSCk7IH0gZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgZnVuY3Rpb24gaShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIHMoZSwgdSAtIDQxOCwgciAtIDQxOCwgMCwgciAtIDE2OTEpOyB9IGlmIChwW3MobyA9IDMyMDIsIG8gLSAzNiwgKHYgPSAzMDgyKSAtIDgsIDAsIHYgLSAxOTE5KV0ocFtpKDAsIDIyNDIsIDI3MTEsIDAsIDE5NDEpXSwgcFtsKDIwNjkgLSAtNDQzLCAwLCA4MzQpXSkpIHJldHVybiBwW2koMCwgOTg1LCAyMjIzLCAwLCAxNzU0KV0oYiwgMCwgcFtsKDIxMDAgLSAzNTIsIDAsIDIzMzApXShlLCAtMTI4MCksIDAsIDAsIHIpOyBpZiAoYSl7IHZhciBmID0gX0xbSygzMjQ5IC0gNjM0LCAyMTc5IC0gNDYzLCAyMjA0IC0gMzMxLCBjID0gMzMwMSldKHcsIGFyZ3VtZW50cyk7IHJldHVybiBHID0gbnVsbCwgZjsgfSB2YXIgYywgbywgdjsgfSB2YXIgZSA9IHsgYVVVZ0Y6IGZ1bmN0aW9uIGFVVWdGKG4sIHIsIHQpeyBmdW5jdGlvbiBlKG4sIHUsIHIsIHQpeyByZXR1cm4gbCh0IC0gLTk3MywgMCwgcik7IH0gdmFyIGksIGYgPSB7IFJPT3hwOiBmdW5jdGlvbiBST094cChuLCByLCB0KXsgcmV0dXJuIHBbdSgxODU4LCAyNzA0KV0obiwgciwgdCk7IH0gfTsgZnVuY3Rpb24gYyhuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEsodSAtIC02NywgdSAtIDIxNCwgciAtIDEwLCBuKTsgfSByZXR1cm4gcFtlKDAsIDAsIDc3NiwgMjA3NildKHBbZSgwLCAwLCAxMzg3LCA5NTkpXSwgcFtjKDYsIDExMTksIDExMSwgMCwgMTI4NCldKSA/IF9MW2ZbYygxNzUsIDQzMiwgMjMxLCAwLCAxNzIxKV0oSCwgNDg4LCAxNDE0KV0oTywgQykgOiBqW3BbcyhpID0gLTUyNSwgaSAtIDExMCwgMTQwNiAtIDE2OSwgMCwgNDMxIC0gNjgpXShfTCwgNTE1LCAxNTUwKV0obiwgciwgdCk7IH0sIEVsTWxsOiBmdW5jdGlvbiBFbE1sbChuLCByKXsgdmFyIHQsIGUsIGksIGYsIGMgPSB7IEVhY1hwOiBmdW5jdGlvbiBFYWNYcChuLCByLCB0KXsgcmV0dXJuIFJbdSgxNTkxLCAyNDA1KV0obiwgciwgdCk7IH0sIHVrY2htOiBmdW5jdGlvbiB1a2NobShuLCByKXsgcmV0dXJuIFJbdSgyNjQ2LCAyNjg2KV0obiwgcik7IH0gfTsgZnVuY3Rpb24gbyhuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEsoZSAtIDY2NywgdSAtIDI5MSwgciAtIDE2MiwgdCk7IH0gZnVuY3Rpb24gYShuLCB1LCByLCB0KXsgcmV0dXJuIHMobiwgdSAtIDI0MSwgciAtIDMyMCwgMCwgdCAtIDE4MjgpOyB9IHJldHVybiBSW28oMCwgNDE5OCwgMzgyMiwgMjkxMCwgMzI3OSldKFJbdihpID0gNDMwLCAoZiA9IDExMzkpIC0gMTkxLCBmLCAwLCBpIC0gLTc5NildLCBSW0soKHQgPSAxMzc0KSAtIDY1MSwgNTE2IC0gNDAzLCB0IC0gMjEzLCBlID0gMTUxMSldKSA/IGNbbygwLCAyNTAzLCAzMTc2LCA0ZTMsIDMwNzYpXShFLCBjW2EoMjQ5NSwgMzU2MSwgMjc3NCwgMjI5MildKF9MLCAtOTU5KSwgSCkgOiBqW1JbYSgzODA1LCA0MDYxLCA0MTMzLCAzMzU2KV0oX0wsIDU5OSwgNTk3KV0obiwgcik7IH0gfTsgZnVuY3Rpb24gaShuLCB1LCByLCB0KXsgZnVuY3Rpb24gZShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIHMoZSwgdSAtIDMwMSwgciAtIDQ3LCAwLCBuIC0gNDIyKTsgfSByZXR1cm4gUltlKDMyMCwgMTE1OCwgLTMxOCwgMCwgLTM5NildKFJbZSgxMzM4LCAxOTkzLCAxMzIzLCAwLCAyNjIwKV0sIFJbbCgyNDc0IC0gNjYsIDAsIDM1MzQpXSkgPyBSW2UoLTUzLCAyNTMsIC0xMDE4LCAwLCAtMTUyKV0oTiwgMCwgMCwgMCwgUltLKDU0NyAtIC02MDAsIChpID0gMTAyMSkgLSAzMDAsIDEzIC0gMjg5LCBpKV0odCwgODA3KSwgbikgOiBwW2UoNzg2LCA5MDksIDE1MjMsIDAsIDYyOSldKFMpOyB2YXIgaTsgfSBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyBmdW5jdGlvbiBpKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gdigwLCB1IC0gMTMsIGUsIDAsIHIgLSAtMzQ2KTsgfSBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbChlIC0gMjIxLCAwLCB0KTsgfSBpZiAoUltmKDAsIDAsIDAsIDQ4NywgMTYxMSldKFJbZigwLCAwLCAwLCAyNzksIDEzMTkpXSwgUltpKDMxODUsIDE4NTUsIDMwOTMsIDM2MzUsIDI0MDYpXSkpeyB2YXIgYyA9IGZ1bmN0aW9uIGMoKXsgaWYgKGMpeyB2YXIgbiA9ICRbZigwLCAwLCAwLCAyNzM1LCAyMTg0IC0gLTEzOTgpXShfLCBhcmd1bWVudHMpOyByZXR1cm4gbm4gPSBudWxsLCBuOyB9IH07IHJldHVybiBWID0gITEsIGM7IH0gcmV0dXJuIFJbaSgyNzc4LCAyNTAyLCAyNjUxLCAxOTA2LCAyMjA3KV0oaCwgMCwgUltLKChvID0gMTM0NykgLSA3MDksIG8gLSAyNTksIDE0ODUgLSAxMTQsIDY0KV0obiwgLTk4KSwgZSk7IHZhciBvOyB9IGZ1bmN0aW9uIHYobiwgdSwgciwgdCwgZSl7IHJldHVybiBUKGUgLSAtMjU5LCB1IC0gNDExLCByIC0gNzIsIHIpOyB9IGZ1bmN0aW9uIGMobiwgdSwgciwgdCl7IGZ1bmN0aW9uIGUobiwgdSwgcil7IHJldHVybiBsKHUgLSAtMzg3LCAwLCByKTsgfSBmdW5jdGlvbiBpKG4sIHUpeyByZXR1cm4gbCh1IC0gLTkxLCAwLCBuKTsgfSBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSyh1IC0gLTE3MiwgdSAtIDcsIHIgLSAzMTIsIGUpOyB9IGZ1bmN0aW9uIGMobiwgdSwgciwgdCl7IHJldHVybiB2KDAsIHUgLSAyNjUsIHQsIDAsIG4gLSA2ODEpOyB9IHJldHVybiBSW2YoMCwgNDUxLCAtNDY3LCAwLCAxMzUzKV0oUltmKDAsIDIyNTIsIDE4MTQsIDAsIDI2MDgpXSwgUltjKDM2MDgsIDQ5MDQsIDAsIDIyNjgpXSkgPyBPW3BbaSgyOCwgMTE3MCldKGgsIDAsIDAsIDI3OCwgMzk1KV0ocm5bcFtmKDAsIDM0MywgNzQ3LCAwLCAxMTE4KV0odG4sIDcwNiwgMCwgMCwgNzg5KV0sICRbcFtpKDE2OTgsIDE5MzMpXShlbiwgMCwgMCwgNzAsIDAsIDM5KV0pID8gKFkgPSBHW3hbcFtmKDAsIDI1MjIsIDE5NTcsIDAsIDMzMzIpXShSLCAyNzcsIDAsIDE4OCldKGIsIDQxOCwgNjA2KV0oYiwgYXJndW1lbnRzKSwgaCA9IG51bGwsIGopIDogTVtwW2UoMCwgODc0LCAxMjQ1KV0oUCwgMCwgMCwgMjk2LCAzMzQpXShaLCBqW3BbYygyNDYyLCAxMjI3LCAwLCAyNDk4KV0oQSwgMCwgMCwgMTMzLCAwLCA0MildKGssIDU3NiksIHgpIDogUltmKDAsIDE0MTUsIDEyMzgsIDAsIDk3NyldKG0sIHQsIDAsIDAsIFJbZSgwLCAxNjEyLCAxMzMzKV0ociwgNTU2KSk7IH0gZnVuY3Rpb24gSyhuLCB1LCByLCB0KXsgcmV0dXJuIFQobiAtIC03NjIsIHUgLSAzMDAsIHIgLSA0NzksIHQpOyB9IGlmIChqW1JbbigwLCAxOTM4LCAwLCAxNDI1KV0oaSwgNjk5LCAwLCAwLCA3OTkpXShqW1JbdigwLCAyOTE5LCAyODY2LCAwLCAxOTYzKV0oZiwgMTE5LCAwLCAwLCAwLCAxMTkpXSwgaltSW2woMzY3OSwgMCwgMzQ1MCldKHIsIDY3LCAwLCA5OSldKSl7IGlmIChSW3MoNDQ1LCA3NjUsIC01MDAsIDAsIC00MDEpXShSW3YoMCwgMjIyNywgMjUwNiwgMCwgMTI3NCldLCBSW3MoMzQ3LCA1MjYsIDIyLCAwLCAyNSldKSkgcmV0dXJuIHBbSygyMDkyLCA4MzIsIDIxNjcsIDE1NjApXShyLCBFKTsgaWYgKHkpeyBpZiAoIVJbcygxOTI1LCAxNDcxLCAyMjg3LCAwLCAxOTQ1KV0oUltsKDI5MTAsIDAsIDMwMjcpXSwgUltuKDAsIDg0NSwgMCwgMTE2MyldKSl7IHZhciBvID0gKHZvaWQgMClbZVtSW3YoMCwgMjk5MSwgMjUyMywgMCwgMzAwOCldKGYsIDIzOSwgMCwgMCwgMCwgMjc5KV0odywgNDE4LCA2MDYpXShTLCBhcmd1bWVudHMpOyByZXR1cm4gWSA9IG51bGwsIG87IH0gZm9yICh2YXIgRCA9IFJbdigwLCAyNjgxLCAzMjk2LCAwLCAxOTcxKV1bbCgxOTE4LCAwLCA4NDMpXSgifCIpLCBRID0gMDs7KXsgc3dpdGNoIChEW1ErK10peyBjYXNlICIwIjogdmFyIEkgPSAkW3YoMCwgMTIyMCwgMjI3MSwgMCwgMjA4NikgKyAidCJdKEopOyBjb250aW51ZTsgY2FzZSAiMSI6IHZhciBKID0gUlt2KDAsIDMyMDUsIDMyNTIsIDAsIDMwNDgpXShSW2woMTQyNSwgMCwgMTYwNyldKFJbcygxNTYwLCAtMTI5LCAxNzA0LCAwLCAxMDg3KV0oeiwgVSksIHFbbigwLCA1NDAsIDAsIDUwMCkgKyAiaCJdKSwgX2RbdigwLCAxNjgyLCAxNDI5LCAwLCAxMTY1KSArICJoIl0pOyBjb250aW51ZTsgY2FzZSAiMiI6IHZhciBVID0gUFtzKC0xMzYsIDE2MTEsIDM0MCwgMCwgNTE4KSArICJPZiJdKGcpOyBjb250aW51ZTsgY2FzZSAiMyI6IHZhciBnID0gd1t2KDAsIDc0OCwgOTMyLCAwLCAyMDg2KSArICJ0Il0oUltsKDEzNDUsIDAsIDU5MCldKEcsIHpbbigwLCAyMDQsIDAsIDUwMCkgKyAiaCJdKSk7IGNvbnRpbnVlOyBjYXNlICI0IjogeSArPSBJOyBjb250aW51ZTsgfSBicmVhazsgfSB9IH0gZWxzZSBpZiAoWSkgcmV0dXJuIFJbdigwLCAxODIzLCAyOTA4LCAwLCAyNTIxKV0oUltuKDAsIDIwNzgsIDAsIDE4NjUpXSwgUltuKDAsIDMwNzQsIDAsIDE4NjUpXSkgPyBIW3BbcygxOTMxLCAxMDk1LCAtMTU5LCAwLCA4NzgpXShPLCA1MTUsIDE1NTApXShDLCBlLCB3KSA6IGpbUltuKDAsIDY4MCwgMCwgMTQyNSldKGMsIDAsIDAsIDI3OCwgMzk1KV0oaltSW3YoMCwgMzUxOCwgMTA5MywgMCwgMjE5OSldKGksIDcwNiwgMCwgMCwgNzg5KV0sIGpbUltsKDI4MjcsIDAsIDE4NDYpXSh0LCAwLCAwLCA3MCwgMCwgMzkpXSkgPyBSW24oMCwgODcxLCAwLCAxMTUxKV0oUlt2KDAsIDExOTgsIDI3OTUsIDAsIDI0MzEpXSwgUltLKDE5MjgsIDI2OTgsIDEzMzMsIDMwMDEpXSkgPyBSW3YoMCwgMTIzMCwgMzMzMywgMCwgMjM5NildKEUsIF9MLCAwLCAwLCAwLCBSW3YoMCwgNjU0LCAyNTAzLCAwLCAxODg3KV0oSCwgLTE0NjEpKSA6IChvID0gWVtqW1JbbCgxOTcxLCAwLCAyMTMwKV0ociwgMjc3LCAwLCAxODgpXShxLCA0MTgsIDYwNildKHgsIGFyZ3VtZW50cyksIFkgPSBudWxsLCBvKSA6IGVbUltzKDI0NjIsIDI0MTgsIDIxOTAsIDAsIDE0MTQpXShjLCAwLCAwLCAyOTYsIDMzNCldKFksIGVbUltsKDE2MTMsIDAsIDM4MSldKHQsIDAsIDAsIDEzMywgMCwgNDIpXShqLCA1NzYpLCB5KTsgfSA6IGZ1bmN0aW9uKCl7fTsgcmV0dXJuIGsgPSAhMSwgeTsgfSBpZiAoail7IGlmIChTW3AoMCwgMCwgMjY0MiwgMCwgMjMyNildKFNbQigwLCAwLCAwLCAxMDY2LCAxOTEyKV0sIFNbdigwLCAyOTA5LCA0MTY5LCAwLCAyNDM1KV0pKSByZXR1cm4gUltCKDAsIDAsIDAsIDEwNDksIDczNCldKEUsIDAsIFJbcCgwLCAwLCAzNzA3LCAwLCAyNDkzKV0oX0wsIDE4MSksIEgpOyB2YXIgbiA9IHFbU1tUKDE4MjAsIDk5OCwgMjI4NiwgMTE3OSldKGIsIDAsIDEzOTgsIDAsIDAsIDE0NjIpXShfZCwgYXJndW1lbnRzKTsgcmV0dXJuIGZuID0gbnVsbCwgbjsgfSB9KTsgZnVuY3Rpb24gbyhuLCB1LCByLCB0KXsgcmV0dXJuIHkoMCwgMCwgMCwgdCwgbiAtIDEyMDgpOyB9IGZ1bmN0aW9uIGwobiwgdSwgciwgdCwgZSl7IHJldHVybiB5KDAsIDAsIDAsIGUsIHQgLSAxMjg0KTsgfSBmdW5jdGlvbiBLKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gUigwLCAwLCAwLCByIC0gNjk5LCBlKTsgfSBmdW5jdGlvbiBNKG4sIHUpeyBmdW5jdGlvbiByKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gUSh1LCAwLCByIC0gMjQxLCBuIC0gNjM5LCBlIC0gMjE5KTsgfSBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gUSh1LCAwLCByIC0gNzAsIHQgLSAtODY1LCBlIC0gNDE2KTsgfSByZXR1cm4gc1tLKDAsIDAsIDgwOSAtIDcxLCAwLCAxNjgwKV0oc1tyKDI3NjQsIDM2NjcsIDM3NzksIDAsIDMyNTMpXSwgc1tyKDI3NjQsIDM0NDUsIDIzMzgsIDAsIDI2ODYpXSkgPyBzW3QoMCwgNTY4LCAxNTU4LCA2MDUsIDg5MSldKF9MLCBzW3IoMjIzMSwgMzI5MSwgMTAyNywgMCwgMzQ4OCldKHUsIDk2OCksIG4pIDogc1t0KDAsIDE4NjksIDgwOSwgNjA1LCAtMzI4KV0oRSwgX0wsIEgpOyB9IGZ1bmN0aW9uIFoobiwgdSwgciwgdCwgZSl7IGZ1bmN0aW9uIGkobiwgdSwgciwgdCwgZSl7IHJldHVybiBRKGUsIDAsIHIgLSAxNjMsIG4gLSAtMjMyLCBlIC0gNDIwKTsgfSByZXR1cm4gU1tpKDYxMiwgOTE5LCAxODQyLCAwLCAxNDg2KV0oU1tpKDExMzEsIDIyMjIsIDEzNTksIDAsIDIwMjQpXSwgU1tpKDExMzEsIDE5NTIsIDEyOTUsIDAsIDc3MSldKSA/IFNbaSgzMjYzLCAyMzE0LCAyOTkzLCAwLCAyNDc5KV0oX0wsIFNbbCgzMzMyIC0gMzAxLCAobyA9IDE0MTMpIC0gMjY5LCAxNzcyIC0gMzIyLCAyMTYyIC0gLTY3NSwgbyldKHIsIC04MzIpLCBlKSA6IHNbUShjID0gMjMzOCwgMCwgKGYgPSAxNzAwKSAtIDQyMywgZiAtIC0xMTc3LCBjIC0gMzU3KV0oRSwgX0wsIEgpOyB2YXIgZiwgYywgbzsgfSBmdW5jdGlvbiBEKG4sIHUsIHIsIHQpeyByZXR1cm4geSgwLCAwLCAwLCBuLCB0IC0gNjM2KTsgfSBmdW5jdGlvbiBBKG4sIHIsIHQsIGUsIGkpeyB2YXIgZiwgYywgbywgYSA9IHsgTUh5d006IGZ1bmN0aW9uIE1IeXdNKG4sIHIsIHQpeyByZXR1cm4gU1t1KDY4MywgMTM2MCldKG4sIHIsIHQpOyB9LCBocGdXaTogZnVuY3Rpb24gaHBnV2kobiwgcil7IHJldHVybiBTW3UoMTkzNywgODg5KV0obiwgcik7IH0gfTsgZnVuY3Rpb24gdihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEsoMCwgMCwgZSAtIDM3OCwgMCwgdSk7IH0gZnVuY3Rpb24gcChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFEodSwgMCwgciAtIDQyNCwgbiAtIDE0NiwgZSAtIDEzMyk7IH0gcmV0dXJuIFNbUShvID0gMzE3NywgMCwgMTYzNyAtIDQ5MSwgMjg2NiAtIC00NTQsIG8gLSA3MSldKFNbdigwLCAxNjAxLCAwLCAwLCAxMTI5KV0sIFNbcCgxMTU4LCAtMTU0LCAzNzgsIDAsIDE5NSldKSA/IFNbdigwLCA4MzIsIDAsIDAsIDExMjMpXShfTCwgU1twKDEzMzQsIDIwMywgNjUsIDAsIDIzMzUpXShpLCA0NzQpLCByKSA6IGFbcCgzNjMxLCAzNjk0LCAzODYzLCAwLCAyMzkzKV0oRSwgX0wsIGFbRChmID0gNjcwLCBmIC0gNDMxLCAoYyA9IDE2NDEpIC0gMTcsIGMgLSAtMTIyOCldKEgsIC00MSkpOyB9IGZ1bmN0aW9uIFEobiwgdSwgciwgdCwgZSl7IHJldHVybiBZKG4sIHQgLSAzMDgpOyB9IGZ1bmN0aW9uIF9MKG4sIHIpeyB2YXIgdCA9IHsgcVVDTE06IGZ1bmN0aW9uIHFVQ0xNKG4sIHIpeyByZXR1cm4gU1t1KDEwNzIsIDIwMzYpXShuLCByKTsgfSB9OyBmdW5jdGlvbiBmKG4sIHUsIHIpeyByZXR1cm4gTigwLCAwLCAwLCBuLCB1IC0gLTE1NzMpOyB9IGZ1bmN0aW9uIGMobiwgdSwgciwgdCl7IHJldHVybiBSKDAsIDAsIDAsIG4gLSAyNTgsIHQpOyB9IGZ1bmN0aW9uIG8obiwgdSl7IHJldHVybiBSKDAsIDAsIDAsIG4gLSA5ODQsIHUpOyB9IGZ1bmN0aW9uIGUobiwgdSwgciwgdCwgZSl7IHJldHVybiBZKHUsIGUgLSAtNDc2KTsgfSBpZiAoU1tlKDAsIDEzNTksIDIyNTMsIDM2ODgsIDIzNzkpXShTW2UoMCwgODkxLCAyMTk5LCAxNzQ1LCAxOTgwKV0sIFNbbygyNDQ5LCAyOTY0KV0pKSByZXR1cm4gdFtlKDAsIDIxNzUsIDQ2MCwgNDMxLCAxMTM5KV0oX2QsIEUpOyB2YXIgYSA9IFNbYyg4NCwgMCwgMCwgLTYxMyldKF9kKTsgcmV0dXJuIChfTCA9IGZ1bmN0aW9uIEwobiwgcil7IHZhciB0ID0geyBVak1EdzogZnVuY3Rpb24gVWpNRHcobiwgciwgdCwgZSwgaSwgZil7IHJldHVybiBTW3UoMzAxNSwgOTgyKV0obiwgciwgdCwgZSwgaSwgZik7IH0sIHdzTmJaOiBmdW5jdGlvbiB3c05iWihuLCByKXsgcmV0dXJuIFNbdSgyMjE0LCAxMTEwKV0obiwgcik7IH0gfTsgZnVuY3Rpb24gZShuLCB1LCByLCB0KXsgcmV0dXJuIG8odCAtIDQxMCwgdSk7IH0gZnVuY3Rpb24gaShuLCB1LCByKXsgcmV0dXJuIGModSAtIDkwNywgMCwgMCwgcik7IH0gcmV0dXJuIFNbaSgwLCAxNzQwLCAxMjYxKV0oU1tlKDAsIDY0OCwgMCwgMTQ5MCldLCBTW2koMCwgMTg3NSwgMTA0NyldKSA/IGFbbiAtPSAzODRdIDogdFtmKDMxODYsIDM2MzIgLSAxNjM5LCAyNTkwIC0gMTU3KV0oRSwgMCwgMCwgdFtlKDAsIDI1NjcsIDAsIDI0MDMpXShfTCwgODUyKSwgMCwgSCk7IH0pKG4sIHIpOyB9IGZ1bmN0aW9uIHcobiwgciwgdCwgZSwgaSl7IGZ1bmN0aW9uIGYobiwgdSwgciwgdCl7IHJldHVybiBOKDAsIDAsIDAsIHQsIHIgLSAtNTk2KTsgfSB2YXIgYyA9IHsga2p1Z1M6IGZ1bmN0aW9uIGtqdWdTKG4sIHIsIHQsIGUsIGksIGYpeyByZXR1cm4gU1t1KDMwMjMsIDM4MjIpXShuLCByLCB0LCBlLCBpLCBmKTsgfSwgTnZBUVU6IGZ1bmN0aW9uIE52QVFVKG4sIHIpeyByZXR1cm4gU1t1KDEwODcsIDk2OCldKG4sIHIpOyB9LCBsU1RXQzogU1t2KDAsIDAsIDI3ODIsIDAsIDM4NDgpXSwgUlRUdVY6IFNbcCg4NzUsIDAsIDIwNjUpXSwgVGRaeHQ6IGZ1bmN0aW9uIFRkWnh0KG4sIHUsIHIpeyByZXR1cm4gU1t2KDAsIDAsICh0ID0gMzE5NykgLSA5MzgsIDAsIDM5MTgpXShuLCB1LCByKTsgdmFyIHQ7IH0sIEpTT3FsOiBmdW5jdGlvbiBKU09xbChuLCB1LCByLCB0KXsgcmV0dXJuIFNbdigwLCBlID0gMTM1NCwgZSAtIDk5OSwgMCwgMjA0MCldKG4sIHUsIHIsIHQpOyB2YXIgZTsgfSwgYkN3bmg6IGZ1bmN0aW9uIGJDd25oKG4sIHUpeyByZXR1cm4gU1t2KDAsIHIgPSAzNTEyLCAzNzQzIC0gODgwLCAwLCByKV0obiwgdSk7IHZhciByOyB9LCBJbW5seTogZnVuY3Rpb24gSW1ubHkobiwgdSl7IHJldHVybiBTW3AodCA9IDIyMjksIHIgPSAxMTczLCByIC0gMjU3KV0obiwgdSk7IHZhciByLCB0OyB9LCBpV2pHRzogU1twKC03NTksIDAsIDI3NSldLCBwV0FQQzogZnVuY3Rpb24gcFdBUEMobiwgdSl7IHJldHVybiBTW3AociA9IDIwMzEsIDAsIDIzMDkgLSAxODY3KV0obiwgdSk7IHZhciByOyB9IH07IGZ1bmN0aW9uIG8obiwgdSwgciwgdCwgZSl7IHJldHVybiBiKHIgLSAtMTE1MiwgMCwgZSk7IH0gZnVuY3Rpb24gYShuLCB1KXsgcmV0dXJuIGIobiAtIC02NTcsIDAsIHUpOyB9IGZ1bmN0aW9uIHYobiwgdSwgciwgdCwgZSl7IHJldHVybiBiKHIgLSAtMTAyNiwgMCwgZSk7IH0gZnVuY3Rpb24gcChuLCB1LCByKXsgcmV0dXJuIFIoMCwgMCwgMCwgciAtIC05LCBuKTsgfSBpZiAoU1tvKDAsIDAsIDE1ODMsIDAsIDgwMCldKFNbZigyMTc0LCAxNjQyLCAyNTMwLCAyNjUyKV0sIFNbcCgyNzcyLCAwLCAxNTAxKV0pKSByZXR1cm4gU1tvKDAsIDAsIDEwMTIsIDAsIDIyMDQpXShFLCBTW3YoMCwgMCwgMjg5MywgMCwgNDAxNSldKFNbdigwLCAwLCAxNjYzLCAwLCA0ODQpXShfTCwgLTE1OCksIC02NDgpLCBIKTsgdmFyIHMgPSB7IFJ5ckVVOiBmdW5jdGlvbiBSeXJFVShuLCByLCB0KXsgZnVuY3Rpb24gZShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIHYoMCwgMCwgZSAtIDg1MywgMCwgcik7IH0gdmFyIGkgPSB7IFFyTnRUOiBmdW5jdGlvbiBRck50VChuLCByLCB0LCBlLCBpLCBmKXsgcmV0dXJuIGNbdSgzMDYwLCAxMDQwKV0obiwgciwgdCwgZSwgaSwgZik7IH0gfTsgZnVuY3Rpb24gZihuLCB1LCByKXsgcmV0dXJuIHAobiwgMCwgciAtIDYyMSk7IH0gaWYgKGNbZigyNTYxLCAwLCAxODQ2KV0oY1tmKC0xMjIsIDAsIDI5MCldLCBjW2UoMCwgMCwgMTUyMCwgMCwgMTQ3MSldKSkgcmV0dXJuIGNbZSgwLCAwLCAzNzY0LCAwLCAzMjI0KV0obiwgciwgdCk7IGkgPSBfTFtpW2EoMTczNiAtIDMzNSwgMTk2OSldKEgsIDAsIDEzOTgsIDAsIDAsIDE0NjIpXShPLCBhcmd1bWVudHMpOyByZXR1cm4gQyA9IG51bGwsIGk7IH0sIFhnWW1rOiBmdW5jdGlvbiBYZ1ltayhuLCByKXsgdmFyIHQgPSB7IE1MZW9NOiBmdW5jdGlvbiBNTGVvTShuLCByLCB0LCBlKXsgcmV0dXJuIGNbdSgxOTQzLCAzMDEyKV0obiwgciwgdCwgZSk7IH0sIHR6bmZHOiBmdW5jdGlvbiB0em5mRyhuLCByKXsgcmV0dXJuIGNbdSgyODk1LCA0NTkyKV0obiwgcik7IH0gfTsgZnVuY3Rpb24gZShuLCB1LCByLCB0KXsgcmV0dXJuIGYobiAtIDQ0MywgdSAtIDU1LCB0IC0gLTk5OSwgdSk7IH0gZnVuY3Rpb24gaShuLCB1LCByKXsgcmV0dXJuIGYobiAtIDUzLCB1IC0gOTEsIHIgLSAxMTEsIG4pOyB9IHJldHVybiBjW2koMTA0MCwgMTI0NiwgMTE3OCldKGNbaSgzNTUsIDEzMjAsIDEyNDcpXSwgY1tpKDIzMSwgMTQ4NiwgMTI0NyldKSA/IHRbZSgxODgsIC0xMTksIDAsIDExOTgpXShFLCAwLCB0W2YoMjUwMyAtIDE3MSwgMTc2NSAtIDQ5OSwgMTc0NiAtIDM3NSwgMTc5OSldKF9MLCAtMTE4KSwgSCkgOiBjW2UoMjQ1NywgMjE3LCAwLCAxMTIxKV0obiwgcik7IH0gfTsgcmV0dXJuIHNbU1tmKDE0NDgsIDE1MDMsIDEzNjcsIDIyMjcpXShfTCwgNDg2LCA4MDkpXShxLCBzW1NbYSgyMTgxLCA5MTMpXShfTCwgNDA0LCA1OTUpXShuLCAtMTM5KSwgaSk7IH0gZnVuY3Rpb24gRyhuLCBCLCBWLCBoLCByKXsgdmFyIEQgPSB7IERVTVlzOiBmdW5jdGlvbiBEVU1ZcyhuLCByLCB0KXsgcmV0dXJuIFNbdSgyMDkyLCAxOTAxKV0obiwgciwgdCk7IH0sIFV2aVJXOiBmdW5jdGlvbiBVdmlSVyhuLCByKXsgcmV0dXJuIFNbdSgxNDI5LCA3MjkpXShuLCByKTsgfSwgZEtvUVE6IGZ1bmN0aW9uIGRLb1FRKG4sIHIsIHQpeyByZXR1cm4gU1t1KDk3NCwgNDgyKV0obiwgciwgdCk7IH0sIHpUSEpGOiBmdW5jdGlvbiB6VEhKRihuLCByKXsgcmV0dXJuIFNbdSgxODU0LCAyMTE5KV0obiwgcik7IH0sIG9waEppOiBmdW5jdGlvbiBvcGhKaShuLCByKXsgcmV0dXJuIFNbdSgxMDg3LCAxMjE2KV0obiwgcik7IH0sIFZzY3FJOiBTW0koMzkzMiwgMzI1NiwgNDM0MywgMzE0OSldLCBaRlFoejogZnVuY3Rpb24gWkZRaHoobiwgdSl7IHJldHVybiBTW0koMTUxNiAtIDIxNiwgKHIgPSAxODAyKSAtIC0xMTU4LCAyNDc1IC0gNSwgMzEzOSldKG4sIHUpOyB2YXIgcjsgfSwgZ0xma3E6IGZ1bmN0aW9uIGdMZmtxKG4peyByZXR1cm4gU1tJKDM1NjEgLSA4NywgMjM1MyAtIC0xMDY0LCAodSA9IDIxNzUpIC0gMTk3LCB1KV0obik7IHZhciB1OyB9LCBIbGlhSTogZnVuY3Rpb24gSGxpYUkobiwgdSl7IHJldHVybiBTW0koODcyIC0gMzM5LCAyMDM4IC0gLTEwMjcsIDgxOCAtIDE3NSwgciA9IDMwMjQpXShuLCB1KTsgdmFyIHI7IH0sIHVDS2JiOiBTW1UoMCwgNDAwOCwgMCwgMCwgMjk1MildLCBDb3NCdjogU1tVKDAsIDI2MTksIDAsIDAsIDI2MDgpXSwgWUFxYWw6IGZ1bmN0aW9uIFlBcWFsKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gU1tJKChpID0gMjAxMSkgLSAyOSwgaSAtIC00NzAsIDEzMjYgLSAzODYsIDIwMDEpXShuLCB1LCByLCB0LCBlKTsgdmFyIGk7IH0sIHpEb3NXOiBmdW5jdGlvbiB6RG9zVyhuLCB1LCByKXsgcmV0dXJuIFNbSig0MDkwLCAzNTAwLCA0NzU0LCAyMDUzKV0obiwgdSwgcik7IH0sIFVRV0RZOiBmdW5jdGlvbiBVUVdEWShuLCB1KXsgcmV0dXJuIFNbSigociA9IDE4MjMpIC0gMzcyLCA1OTEgLSAzNTYsIDE2MjAsIHIgLSAzMTYpXShuLCB1KTsgdmFyIHI7IH0sIFZwQVlKOiBmdW5jdGlvbiBWcEFZSihuLCB1KXsgcmV0dXJuIFNbVSgwLCByID0gMTg0NCwgMCwgMCwgMTYxMiAtIDE3OCldKG4sIHUpOyB2YXIgcjsgfSwgdlN1eGc6IFNbSig1ODIsIDk5NywgMTk2NSwgNzQ0KV0sIG1XUFdDOiBmdW5jdGlvbiBtV1BXQyhuLCB1KXsgcmV0dXJuIFNbVSgwLCByID0gMTU3MCwgMCwgMCwgMTQ2OCAtIDQ3OCldKG4sIHUpOyB2YXIgcjsgfSwgdldsSlA6IFNbUSgxNzE5LCAxNzQ4LCAxNjU4LCAyMjA2KV0sIHZZZUJjOiBTW0koMjk4NSwgMjY3NywgMzc3MywgMTQyOSldLCBPcHpycTogZnVuY3Rpb24gT3B6cnEobiwgdSwgciwgdCl7IHJldHVybiBTW0koMjI5MCAtIDI2NCwgMTk3NCAtIDMzMywgKGUgPSAxNDQ3KSAtIDM0MywgZSldKG4sIHUsIHIsIHQpOyB2YXIgZTsgfSwgbkJEelY6IGZ1bmN0aW9uIG5CRHpWKG4sIHUpeyByZXR1cm4gU1tUKHIgPSAyMDI3LCAwLCB0ID0gNjg4LCAwLCB0IC0gNzI5KV0obiwgdSk7IHZhciByLCB0OyB9LCBMUGFJazogU1tUKDE1ODMsIDAsIDAsIDAsIDc2NSldLCBidk5abDogU1tVKDAsIDI3MzgsIDAsIDAsIDI2MzEpXSwgT1hXRWs6IGZ1bmN0aW9uIE9YV0VrKG4sIHUsIHIpeyByZXR1cm4gU1tJKDE2OTEsIDMwMDIsIDMyMjUsIDIyNjMpXShuLCB1LCByKTsgfSwgSlRCckY6IGZ1bmN0aW9uIEpUQnJGKG4sIHUpeyByZXR1cm4gU1tJKDIxMDYgLSA3OCwgKHQgPSAzMDc0KSAtIDU1MCwgKHIgPSAyODk2KSAtIDExNywgcildKG4sIHUpOyB2YXIgciwgdDsgfSwgY2FIdWk6IGZ1bmN0aW9uIGNhSHVpKG4sIHUpeyByZXR1cm4gU1tKKDUzNiAtIDIwNywgKHIgPSAxMzg1KSAtIDI3MCwgMTc4OSwgciAtIDEwOTcpXShuLCB1KTsgdmFyIHI7IH0sIEJ6Vm5vOiBTW0ooMzIwNiwgMTA4OCwgMjg2NiwgMjA0OSldLCBWU0dCdTogU1tVKDAsIDM4NTUsIDAsIDAsIDI3MjIpXSwgdG5ZalE6IGZ1bmN0aW9uIHRuWWpRKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gU1tVKDAsIGYgPSAxOTY0LCAwLCBjID0gMTc4MSwgYyAtIC04MjApXShuLCB1LCByLCB0LCBlLCBpKTsgdmFyIGYsIGM7IH0sIFFLR0lDOiBmdW5jdGlvbiBRS0dJQyhuLCB1KXsgcmV0dXJuIFNbSig0MTggLSAzMTksIChyID0gNTkyKSAtIDE0NCwgMTI5NSwgciAtIDIzNCldKG4sIHUpOyB2YXIgcjsgfSwgdU1ienE6IFNbSSgyMDI5LCAyMjkwLCAzMDk0LCAxMTQxKV0sIHNLRWdIOiBmdW5jdGlvbiBzS0VnSChuLCB1KXsgcmV0dXJuIFNbSSgzNzg1IC0gMjc0LCAociA9IDM1NDQpIC0gMTAwLCA0NTg1IC0gNzksIDQwOTApXShuLCB1KTsgdmFyIHI7IH0sIFZ0bkNDOiBmdW5jdGlvbiBWdG5DQyhuLCB1KXsgcmV0dXJuIFNbVCgxMzcyLCByID0gNDQ2LCAwLCAwLCByIC0gOTApXShuLCB1KTsgdmFyIHI7IH0sIHlSUnZUOiBTW1UoMCwgMTQ5NSwgMCwgMCwgMTAzNCldLCBTYm50dzogU1tRKDMwNzcsIDI1NDQsIDI3ODMsIDI1ODEpXSwgaEdkYlA6IGZ1bmN0aW9uIGhHZGJQKG4sIHUpeyByZXR1cm4gU1tJKDE5NTUgLSA2LCA4NjUgLSAtNzI3LCAyMTUxIC0gMzA5LCByID0gMTkyNSldKG4sIHUpOyB2YXIgcjsgfSwgZnViclU6IFNbUSgyMjc0LCAxMDQxLCAxMjI3LCAyMTU0KV0sIEphUFNtOiBTW1EoMTgyNiwgMTkyOSwgODczLCAxMjY1KV0sIG5KTGd0OiBTW0ooMTA0MiwgNjQ0LCA4NjMsIDU0MSldLCBYVWl5YTogU1tUKDEwNTcsIDAsIDAsIDAsIDgwOSldLCBmZWVNaTogU1tVKDAsIDM5ODcsIDAsIDAsIDMzNDIpXSwgamZVU0o6IGZ1bmN0aW9uIGpmVVNKKG4sIHUsIHIsIHQpeyByZXR1cm4gU1tVKDAsIDY3MCwgMCwgZSA9IDE0NTEsIGUgLSAtNzcxKV0obiwgdSwgciwgdCk7IHZhciBlOyB9LCBSZ1RhcTogZnVuY3Rpb24gUmdUYXEobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBTW0ooODk3IC0gMzEyLCAoZiA9IDI0NTApIC0gMTk3LCBmLCAyMDkyIC0gODUzKV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmOyB9LCBRckJGUDogU1tJKDEyODAsIDE2OTQsIDIwOTAsIDIyMDUpXSwgUkRpZHc6IGZ1bmN0aW9uIFJEaWR3KG4sIHUpeyByZXR1cm4gU1tUKHIgPSA0ODcsIDAsIDAsIDAsIDE1NTkgLSA2MildKG4sIHUpOyB2YXIgcjsgfSwgV1l2a0k6IGZ1bmN0aW9uIFdZdmtJKG4sIHUpeyByZXR1cm4gU1tRKDExMjcgLSA0MDcsIChyID0gNjI5KSAtIDE4NCwgciwgKHQgPSA4MzQpIC0gMSldKG4sIHUpOyB2YXIgciwgdDsgfSwgd0dGYWQ6IFNbSSgxODgzLCAyNzEzLCAzMDY0LCAxOTA0KV0sIGJObkdpOiBTW0koMTI3MSwgMTcyOSwgMjMzNiwgMTkyNyldLCBGS3RJWjogZnVuY3Rpb24gRkt0SVoobiwgdSl7IHJldHVybiBTW1EoMjU5NiAtIDQ2OCwgKHIgPSAxMzUxKSAtIDIwLCByLCAodCA9IDI1MjgpIC0gMTgxKV0obiwgdSk7IHZhciByLCB0OyB9LCBIZkd1ZDogU1tVKDAsIDE1LCAwLCAwLCAxMjA3KV0sIHNES0dQOiBmdW5jdGlvbiBzREtHUChuLCB1LCByLCB0KXsgcmV0dXJuIFNbUSgzNjE3IC0gMjc3LCAoZSA9IDM0NzQpIC0gNzMsIDQ0MTEsIGUgLSAzMTgpXShuLCB1LCByLCB0KTsgdmFyIGU7IH0sIHhWZGJOOiBTW0koMzkxMSwgMzEyNywgMjQ4NywgMjUyMyldLCBGdFRUUTogZnVuY3Rpb24gRnRUVFEobiwgdSl7IHJldHVybiBTW0ooMTc5MywgMzM4NywgMjU4NywgMTU5OSldKG4sIHUpOyB9LCBqc3hjQjogU1tUKC0yMiwgMCwgMCwgMCwgODQpXSwgT0hkZEs6IFNbSSgyMDY2LCAyODc1LCAyNzg5LCAzMjA0KV0sIFdLRkhWOiBmdW5jdGlvbiBXS0ZIVihuLCB1KXsgcmV0dXJuIFNbVChyID0gMjY5MiwgMCwgMCwgdCA9IDM2MjYsIHQgLSAxNjc4KV0obiwgdSk7IHZhciByLCB0OyB9LCBWbEVabzogU1tRKDI2MDAsIDIyMTYsIDMwMTMsIDI0MDgpXSwgR1pCc006IFNbVCgyMDYzLCAwLCAwLCAwLCAxNjUxKV0sIG94ZVdROiBmdW5jdGlvbiBveGVXUShuLCB1LCByKXsgcmV0dXJuIFNbVCh0ID0gMTI4OCwgMCwgMCwgZSA9IDE3ODgsIGUgLSAxNjI0KV0obiwgdSwgcik7IHZhciB0LCBlOyB9LCBvYWFwRDogU1tRKDI0NDAsIDI2NDAsIDMyODksIDIxMzIpXSwgTEV3VGc6IFNbVSgwLCA3ODUsIDAsIDAsIDIwODUpXSwgSm1WdUc6IGZ1bmN0aW9uIEptVnVHKG4sIHUpeyByZXR1cm4gU1tKKDEwNDEgLSA5NCwgMjk5MyAtIDQyNywgMzQ1NiwgKHIgPSAyMTk4KSAtIDgwMCldKG4sIHUpOyB2YXIgcjsgfSwgaWxiRUY6IFNbVCg4MjIsIDAsIDAsIDAsIDE5NzcpXSwgQUxEaGI6IFNbSSgzODc3LCAyODg0LCAxNTgwLCAzNjE2KV0sIGxFY3BJOiBmdW5jdGlvbiBsRWNwSShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFNbSigoaSA9IDEyMDYpIC0gMjc0LCAxNzk3IC0gNTAwLCBpLCAxODExIC0gMTkwKV0obiwgdSwgciwgdCwgZSk7IHZhciBpOyB9LCBiSUhLVDogU1tRKDIzOTMsIDI3NDQsIDE1ODIsIDE0NjApXSwgQnJ0VWg6IFNbSSgxNTMzLCAxNjAyLCAyNjg3LCAxMDk4KV0sIEpoeElBOiBmdW5jdGlvbiBKaHhJQShuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIFNbVSgwLCAzMTE5LCBmID0gMzU2NywgMCwgZiAtIDE5MCldKG4sIHUsIHIsIHQsIGUsIGkpOyB2YXIgZjsgfSwgTFZpb2I6IGZ1bmN0aW9uIExWaW9iKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gU1tJKDE0NiAtIDIyNSwgODEyIC0gLTEzNjAsIDYzMSAtIDE5LCBmID0gMTA5MyldKG4sIHUsIHIsIHQsIGUsIGkpOyB2YXIgZjsgfSwgdklTbVg6IGZ1bmN0aW9uIHZJU21YKG4sIHUpeyByZXR1cm4gU1tJKDIzMTUgLSA0NzMsIChyID0gMjUzNCkgLSAtODk4LCAxMzU2IC0gMzU4LCAxOTUyKV0obiwgdSk7IHZhciByOyB9LCBiY3hpTjogZnVuY3Rpb24gYmN4aU4obiwgdSwgciwgdCl7IHJldHVybiBTW0ooKGUgPSAxNDI2KSAtIDI4NCwgMTM2OSAtIDM0OCwgZSwgNDEzIC0gMzQ5KV0obiwgdSwgciwgdCk7IHZhciBlOyB9LCBTZkNmbjogZnVuY3Rpb24gU2ZDZm4obil7IHJldHVybiBTW0ooMjU2OCAtIDI3NSwgKHUgPSAzNzEyKSAtIDE4MSwgdSwgMjczOCAtIDExMDgpXShuKTsgdmFyIHU7IH0sIGpsdkpmOiBTW0ooMjQwMiwgMTY1NCwgMTYyNywgMTU4NyldLCBIZGJ2UjogU1tRKDI0NjAsIDE5NDUsIDE1MDcsIDI2NzgpXSwgZ0NodVE6IGZ1bmN0aW9uIGdDaHVRKG4sIHUpeyByZXR1cm4gU1tKKDMyMyAtIDM1OSwgMjQwIC0gMjk4LCByID0gLTM1MywgODMwIC0gLTIxNCldKG4sIHUpOyB2YXIgcjsgfSwgc3FjdlI6IFNbSSgyMjI3LCAyNTcwLCAzMTkxLCAyMzM1KV0sIGRKWUVZOiBTW0ooMjk4OSwgMTg1OSwgMjU5NywgMTgxNSldLCBOZXFZRzogZnVuY3Rpb24gTmVxWUcobiwgdSl7IHJldHVybiBTW0koMjkzMSAtIDU1LCAociA9IDIzMzEpIC0gNTUxLCByIC0gNzAsIDE0OTMpXShuLCB1KTsgdmFyIHI7IH0sIGhOV2xPOiBmdW5jdGlvbiBoTldsTyhuLCB1LCByLCB0KXsgcmV0dXJuIFNbVChlID0gLTMzNSwgMCwgMCwgMCwgOTkzIC0gMjYyKV0obiwgdSwgciwgdCk7IHZhciBlOyB9LCBVRGhXQTogZnVuY3Rpb24gVURoV0EobiwgdSl7IHJldHVybiBTW1QoMjYxOSwgMCwgMCwgMCwgNTY1KV0obiwgdSk7IH0sIEFobFVaOiBTW0koLTQ4LCAxMDcyLCAxMzkwLCAyNDAxKV0sIFRXY1JjOiBmdW5jdGlvbiBUV2NSYyhuLCB1LCByLCB0KXsgcmV0dXJuIFNbSigxMTYzIC0gMjU1LCAoZSA9IDI0ODMpIC0gMTk4LCBlLCAoaSA9IDE3MTgpIC0gMjIyKV0obiwgdSwgciwgdCk7IHZhciBlLCBpOyB9LCBTeWVxTDogU1tUKDgyNSwgMCwgMCwgMCwgMzE4KV0sIHBnaUtTOiBmdW5jdGlvbiBwZ2lLUyhuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFNbVSgwLCBpID0gMjcwMiwgMCwgMCwgMzA5MSAtIDI1OCldKG4sIHUsIHIsIHQsIGUpOyB2YXIgaTsgfSwgcmV4aEE6IGZ1bmN0aW9uIHJleGhBKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gU1tVKDAsIGkgPSAzNjIxLCAwLCAwLCAyODYyIC0gNTM5KV0obiwgdSwgciwgdCwgZSk7IHZhciBpOyB9LCBJa2hwRzogZnVuY3Rpb24gSWtocEcobiwgdSwgciwgdCl7IHJldHVybiBTW1UoZSA9IDQ5MCwgLTI1NywgMCwgMCwgZSAtIC00NjApXShuLCB1LCByLCB0KTsgdmFyIGU7IH0sIGtHdW1qOiBmdW5jdGlvbiBrR3VtaihuLCB1KXsgcmV0dXJuIFNbUSgyODgzIC0gNDk1LCAociA9IDgyMSkgLSAxMDMsIHIsIDE4MTIgLSAtMjQ1KV0obiwgdSk7IHZhciByOyB9LCBsd1FiWjogZnVuY3Rpb24gbHdRYloobiwgdSl7IHJldHVybiBTW0ooLTEwODIgLSAyMzEsIChyID0gLTEyNzEpIC0gNDExLCByLCAtMjMwIC0gLTUxOCldKG4sIHUpOyB2YXIgcjsgfSwgV1VZWGs6IFNbVSgwLCAyMjUzLCAwLCAwLCAyMDQ2KV0sIFZteGlyOiBTW1QoMTMyOSwgMCwgMCwgMCwgMTk5NyldLCBmeEdLRDogZnVuY3Rpb24gZnhHS0QobiwgdSl7IHJldHVybiBTW1EoMzA4MCwgMzk2NSwgMzI2MCwgMjM5MyldKG4sIHUpOyB9LCBucnRLWDogZnVuY3Rpb24gbnJ0S1gobiwgdSl7IHJldHVybiBTW0ooMzczMSAtIDQyMCwgKHIgPSAyOTQ2KSAtIDM5MiwgMzk4NCwgciAtIDYzNildKG4sIHUpOyB2YXIgcjsgfSwgUFZtalM6IFNbVCgyNTE0LCAwLCAwLCAwLCAyMjY4KV0sIGtIckVMOiBTW1EoMzI0LCA5MzEsIDIzNCwgODY0KV0sIEdWYmxkOiBmdW5jdGlvbiBHVmJsZChuLCB1LCByLCB0KXsgcmV0dXJuIFNbUSgoZSA9IDE3MTApIC0gNDIzLCAyODUzIC0gMTU2LCAxOTQ1LCBlIC0gMzMzKV0obiwgdSwgciwgdCk7IHZhciBlOyB9LCBxT25zUDogZnVuY3Rpb24gcU9uc1AobiwgdSl7IHJldHVybiBTW0ooMjM5MiAtIDIzMiwgMjM1MSAtIDMwMSwgMjc0MCwgKHIgPSAxNTc3KSAtIDg1NSldKG4sIHUpOyB2YXIgcjsgfSwgalF4T3g6IGZ1bmN0aW9uIGpReE94KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gU1tVKGkgPSAxOTU5LCAxNjcyLCAwLCAwLCBpIC0gLTUwNildKG4sIHUsIHIsIHQsIGUpOyB2YXIgaTsgfSwgZUJMZ246IGZ1bmN0aW9uIGVCTGduKG4sIHUpeyByZXR1cm4gU1tUKHIgPSAzNzI5LCAwLCAwLCAwLCAzMjI2IC0gMTM3MSldKG4sIHUpOyB2YXIgcjsgfSwgR2VMdmQ6IFNbVSgwLCAzMDU2LCAwLCAwLCAyMDI1KV0sIFhSUFVKOiBmdW5jdGlvbiBYUlBVSihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFNbVChpID0gMzM0MywgMCwgMCwgMCwgMjcwNCAtIDE0MTIpXShuLCB1LCByLCB0LCBlKTsgdmFyIGk7IH0sIEJ3ZXZ1OiBmdW5jdGlvbiBCd2V2dShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFNbUSgtNzA0IC0gNjQsIDM0MiAtIDE3NSwgMTAyMywgKGkgPSA1MTMpIC0gLTgyMCldKG4sIHUsIHIsIHQsIGUpOyB2YXIgaTsgfSwgZmJTVUY6IGZ1bmN0aW9uIGZiU1VGKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gU1tJKChmID0gLTQ2MikgLSA3LCAoYyA9IDc2MSkgLSAtOTA5LCBjIC0gMTEsIGYpXShuLCB1LCByLCB0LCBlLCBpKTsgdmFyIGYsIGM7IH0sIFRlSEd5OiBmdW5jdGlvbiBUZUhHeShuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIFNbSigxNzQ3IC0gNDYxLCAyNjE5IC0gNDgxLCAzMDQ4LCAoZiA9IDMwNzEpIC0gOTQ2KV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmOyB9LCBlTURaQzogZnVuY3Rpb24gZU1EWkMobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBTW0ooKGYgPSAzNjEzKSAtIDM5NSwgMzA2MyAtIDQwMCwgYyA9IDI3NjksIGYgLSAxMTI2KV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmLCBjOyB9LCBCRlhTZTogZnVuY3Rpb24gQkZYU2UobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBTW1EoKGYgPSAxMDE1KSAtIDE0NCwgMTE0MyAtIDM5LCAxNTIsIGYgLSAtMzQ1KV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmOyB9LCBSbmhTRjogZnVuY3Rpb24gUm5oU0YobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBTW1EoKGYgPSAzMzU0KSAtIDM3NSwgMjE1MSAtIDQwNywgMzg2MiwgZiAtIDc0NyldKG4sIHUsIHIsIHQsIGUsIGkpOyB2YXIgZjsgfSwgWkNzdmg6IGZ1bmN0aW9uIFpDc3ZoKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gU1tRKDE4NDMgLSAyOCwgMzMxIC0gMTczLCBpID0gMjkxNCwgMTY2NSAtIDI5MCldKG4sIHUsIHIsIHQsIGUpOyB2YXIgaTsgfSwgRnRJRmc6IGZ1bmN0aW9uIEZ0SUZnKG4sIHUsIHIsIHQpeyByZXR1cm4gU1tKKDM1ODUgLSAyNTYsIChlID0gMzY0MCkgLSA1MCwgZSwgMjM1NyAtIDgxMSldKG4sIHUsIHIsIHQpOyB2YXIgZTsgfSwgdGlWR2E6IGZ1bmN0aW9uIHRpVkdhKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gU1tUKGYgPSA3ODYsIDAsIDAsIGMgPSAxNTY0LCBjIC0gNjU0KV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmLCBjOyB9LCBFUkpOTzogZnVuY3Rpb24gRVJKTk8obiwgdSl7IHJldHVybiBTW1UociA9IDQwMywgciwgMCwgMCwgLTE5MSAtIC0xMDQ3KV0obiwgdSk7IHZhciByOyB9LCBiSlFZcjogZnVuY3Rpb24gYkpRWXIobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBTW1EoMTMxNyAtIDI4MCwgKGYgPSAxNjI3KSAtIDEyLCAxNDIzLCBmIC0gOTI1KV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmOyB9LCBxVkpkbzogZnVuY3Rpb24gcVZKZG8obiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBTW1EoKGYgPSAyNDY5KSAtIDE5OSwgMTc3MiAtIDQ4NCwgZiwgMzEwNiAtIDU1NCldKG4sIHUsIHIsIHQsIGUsIGkpOyB2YXIgZjsgfSwgY1dJRUE6IGZ1bmN0aW9uIGNXSUVBKG4sIHUsIHIsIHQpeyByZXR1cm4gU1tRKDMxMyAtIDM2MywgKGUgPSAxNTQ1KSAtIDE3NywgZSwgMTQzNyAtIC05NDEpXShuLCB1LCByLCB0KTsgdmFyIGU7IH0sIEVCWXdKOiBmdW5jdGlvbiBFQll3SihuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIFNbUSgyNDA3IC0gNDc2LCAzNjc1IC0gMzg1LCBmID0gMzI5OSwgMjMzNiAtIC03MDEpXShuLCB1LCByLCB0LCBlLCBpKTsgdmFyIGY7IH0sIEh5V3RSOiBmdW5jdGlvbiBIeVd0UihuLCB1KXsgcmV0dXJuIFNbSigxNzIxIC0gNDkyLCAzMzk3IC0gNTksIDM4NzcsIChyID0gMjc4OCkgLSAxMTg5KV0obiwgdSk7IHZhciByOyB9IH07IGZ1bmN0aW9uIFEobiwgdSwgciwgdCl7IHJldHVybiBOKDAsIDAsIDAsIHIsIHQgLSAtNTk3KTsgfSBmdW5jdGlvbiBpKG4sIHIsIHQsIGUsIGkpeyB2YXIgZiwgYyA9IHsgVG1uc0s6IGZ1bmN0aW9uIFRtbnNLKG4sIHIsIHQsIGUsIGksIGYpeyByZXR1cm4gU1t1KDU4MCwgMTg2MCldKG4sIHIsIHQsIGUsIGksIGYpOyB9LCBKSWlqVDogZnVuY3Rpb24gSklpalQobiwgcil7IHJldHVybiBTW3UoMzA1NCwgMjQwOCldKG4sIHIpOyB9IH07IGZ1bmN0aW9uIG8obiwgdSwgciwgdCwgZSl7IHJldHVybiBJKG4gLSA0ODYsIGUgLSA0OTIsIHIgLSA5MCwgdCk7IH0gZnVuY3Rpb24gYShuLCB1LCByLCB0KXsgcmV0dXJuIFQobiwgMCwgMCwgMCwgdCAtIDExMDEpOyB9IGZ1bmN0aW9uIHYobiwgdSwgciwgdCwgZSl7IHJldHVybiBUKGUsIDAsIDAsIDAsIHUgLSAxNzMzKTsgfSByZXR1cm4gU1tvKDI3OTcsIDAsIDg0NiwgMTIwOSwgMjAzMSldKFNbdigwLCAxNDE0LCAyMzI1LCAxNzEzLCAyMzczKV0sIFNbYSgxODg2LCAyNTksIDEzNDksIDc4MildKSA/IFNbVShmID0gMjQ1MSwgZiwgMCwgMCwgMjEwNiAtIC0xMDIzKV0oX0wsIFNbYSgyMDQ3LCAyODAxLCAyMjU3LCAyNjUzKV0obiwgLTk0KSwgaSkgOiBjW28oMzkwNCwgMCwgMzU5MCwgMzEwNCwgMjYzNSldKEUsIDAsIDAsIDAsIGNbdigwLCAyOTYzLCAyMjM1LCAxODU2LCAyOTQ1KV0oX0wsIDM3NSksIEgpOyB9IGZ1bmN0aW9uIEkobiwgdSwgciwgdCl7IHJldHVybiBOKDAsIDAsIDAsIHQsIHUgLSAtMjg3KTsgfSBmdW5jdGlvbiBKKG4sIHUsIHIsIHQpeyByZXR1cm4geSgwLCAwLCAwLCByLCB0IC0gLTk4KTsgfSBmdW5jdGlvbiBVKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gUigwLCAwLCAwLCBlIC0gMTMxMywgdSk7IH0gZnVuY3Rpb24gZyhuLCB1LCByLCB0LCBlKXsgZnVuY3Rpb24gaShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEoobiAtIDM4MCwgdSAtIDY1LCByLCBlIC0gMTAyNyk7IH0gZnVuY3Rpb24gZihuLCB1LCByKXsgcmV0dXJuIEoobiAtIDgyLCB1IC0gMjQ4LCByLCB1IC0gLTM4Myk7IH0gcmV0dXJuIFNbaSg2MTYsIDIyNCwgOTE5LCAwLCAxMzEwKV0oU1tUKDI2MjgsIGEgPSAzNDM0LCAwLCAwLCBhIC0gMTQ5NyldLCBTW2koMjMwOCwgMzI4MywgNDEzOSwgMCwgMzAxMCldKSA/IFNbZigtOTIxLCAtNTQsIDQ1MSldKF9MLCBTW1QoMTQ1NywgMCwgbyA9IDQxOCwgMCwgbyAtIC0xNDcpXSh0LCA0MzMpLCBlKSA6IERbVChjID0gMjY0NiwgMCwgMCwgMCwgMzcyNiAtIDE1ODQpXShFLCBEW2YoLTg4NiwgMzIsIC03ODcpXShfTCwgLTk0KSwgSCk7IHZhciBjLCBvLCBhOyB9IHZhciBqID0geyBqWmVFeDogZnVuY3Rpb24galplRXgobiwgdSl7IGZ1bmN0aW9uIHIobiwgdSwgciwgdCl7IHJldHVybiBVKDAsIHQsIDAsIDAsIHUgLSA2MTIpOyB9IGZ1bmN0aW9uIHQobiwgdSwgciwgdCl7IHJldHVybiBKKG4gLSAxODcsIHUgLSA0OTcsIHUsIHQgLSAxMDY0KTsgfSByZXR1cm4gU1t0KDI0NjcsIDE4NzgsIDAsIDIxMTIpXShTW3IoMCwgMjQwOSwgMCwgMjA3MCldLCBTW3IoMCwgMjEzMCwgMCwgMzQ2OSldKSA/IFNbdCgyNTU5LCAxODAyLCAwLCAxMjg0KV0obiwgdSkgOiBEW1UoMCwgMjE5MywgMCwgMCwgMjE0MCAtIC0zNTUpXShFLCBEW3QoMjE4NCwgMzExMywgMCwgMzE1NyldKF9MLCA0NzQpLCBIKTsgfSwgbFZIYWY6IFNbSSgxMTc0LCAyNDIyLCAyODk1LCAzNzUxKV0oX0wsIDU2MSwgLTM1NiksIExKZUpQOiBTW0koNDExMSwgMzUwNywgNDY0OSwgMjI4MildKF9MLCA1MDYsIC0zODkpLCBpSU5OQTogZnVuY3Rpb24gaUlOTkEobiwgciwgdCl7IGZ1bmN0aW9uIGUobiwgdSwgcil7IHJldHVybiBJKG4gLSA0NDcsIG4gLSAxNzksIHIgLSAxNjYsIHUpOyB9IHZhciBpLCBmLCBjLCBvID0geyB4SENpTTogZnVuY3Rpb24geEhDaU0obiwgciwgdCl7IHJldHVybiBTW3UoMTQxNywgODI5KV0obiwgciwgdCk7IH0gfTsgcmV0dXJuIFNbZSgyNDMzLCAyMzU3LCAyMjk3KV0oU1tlKDIxNDUsIDIyNjYsIDE1NjgpXSwgU1tJKChjID0gMTMyNCkgLSAxNTUsIDIzNTYgLSAtOTA5LCAzMTc3IC0gMTQ1LCBjKV0pID8gU1tJKChmID0gMTU0MCkgLSA0ODEsIGYgLSAtMzQyLCAxOTg1IC0gMTAsIDE3MDQpXShuLCByLCB0KSA6IG9bUSgoaSA9IDEzMDYpIC0gMTY1LCAyMDYzIC0gMTk4LCAyNjIzLCBpIC0gLTY2NSldKEUsIF9MLCBIKTsgfSwgTm9nS1o6IGZ1bmN0aW9uIE5vZ0taKG4sIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIpeyByZXR1cm4gSShuIC0gNDk3LCBuIC0gLTM1MSwgciAtIDMzMSwgcik7IH0gdmFyIGUsIGksIGYgPSB7IEFQRlR1OiBmdW5jdGlvbiBBUEZUdShuLCByKXsgcmV0dXJuIFNbdSgxMzc2LCAzOTQpXShuLCByKTsgfSB9OyByZXR1cm4gU1tRKChpID0gNTE3KSAtIDQ1MSwgMTc2NyAtIDY0LCBpLCA1NTcgLSAtNTk4KV0oU1tRKDE0NzAgLSAzMTgsIChlID0gODY5KSAtIDM0NCwgMjAxNywgZSAtIC05OTYpXSwgU1t0KDIzOTgsIDAsIDMzMDMpXSkgPyBTW3QoMjUxOSwgMCwgMzMxMyldKG4sIHIpIDogZlt0KDExNjMsIDAsIDYyMSldKG4sIEUpOyB9LCByRFNwdjogZnVuY3Rpb24gckRTcHYobiwgcil7IHZhciB0LCBlID0geyBwSUJiczogZnVuY3Rpb24gcElCYnMobiwgcil7IHJldHVybiBEW3UoMjU3NSwgMjk0MCldKG4sIHIpOyB9IH07IGZ1bmN0aW9uIGkobiwgdSwgciwgdCl7IHJldHVybiBUKHIsIDAsIDAsIDAsIG4gLSAzNjApOyB9IGZ1bmN0aW9uIGYobiwgdSwgciwgdCl7IHJldHVybiBRKG4gLSA0OTAsIHUgLSAzNzAsIHIsIHQgLSA0NTkpOyB9IHJldHVybiBEW2koMTgzMCwgMTAwOSwgODczLCA1ODQpXShEW2YoMjgwMiwgMzkwMCwgMjAxMSwgMzIxNildLCBEW2YoMzczMiwgNDM3MiwgMzk3NSwgMzIxNildKSA/IGVbVCh0ID0gMzEwOSwgMCwgMCwgMCwgMzc5NSAtIDE1ODYpXShuLCBFKSA6IERbaSg1NDgsIC0xNzcsIC01OTIsIC0yMTIpXShuLCByKTsgfSwgVmxUYXU6IFNbUSg4NjcsIDE1ODUsIDIxODQsIDE1MjIpXShfTCwgNDY1LCAtMzYwKSwgaHZCa2w6IGZ1bmN0aW9uIGh2QmtsKG4sIHIpeyB2YXIgdCwgZSA9IHsgQWp5S286IGZ1bmN0aW9uIEFqeUtvKG4sIHIsIHQsIGUsIGksIGYpeyByZXR1cm4gU1t1KDIzMzQsIDIyMjgpXShuLCByLCB0LCBlLCBpLCBmKTsgfSwgUkRuT0w6IGZ1bmN0aW9uIFJEbk9MKG4sIHIpeyByZXR1cm4gU1t1KDEwNTksIDk5NCldKG4sIHIpOyB9IH07IGZ1bmN0aW9uIGkobiwgdSwgciwgdCwgZSl7IHJldHVybiBKKG4gLSAyNTIsIHUgLSAyNTIsIHUsIGUgLSAxMTUxKTsgfSBmdW5jdGlvbiBmKG4sIHUsIHIsIHQpeyByZXR1cm4gSShuIC0gMzA2LCByIC0gNTA1LCByIC0gNjAsIHQpOyB9IHJldHVybiBTW2YoMjI2MSwgMCwgMjkyOSwgMTY0NyldKFNbZigyOTc2LCAwLCAyOTY1LCAyNTk4KV0sIFNbVCgxODY3LCAwLCAwLCB0ID0gMjI3MCwgdCAtIDk5OSldKSA/IFNbaSgyNTk2LCAzMjQyLCAwLCAwLCAyMjgxKV0obiwgcikgOiBlW2koMjIxOCwgMjU4MSwgMCwgMCwgMTc0MildKEUsIF9MLCAwLCAwLCAwLCBlW2koMjAxNiwgMzY5MSwgMCwgMCwgMjkyMildKEgsIDg1OSkpOyB9LCBMaEhLQjogU1tRKDM1MTUsIDMwOTAsIDE4OTcsIDIyMjUpXShfTCwgNTM3LCA1MTgpLCBMSE9iSjogU1tRKDIwNDIsIDEyMjQsIDQ0MiwgMTQ4MCldKF9MLCA0NzYsIC0yMTYpLCBBV3ZDZzogZnVuY3Rpb24gQVd2Q2cobiwgcil7IGZ1bmN0aW9uIHQobiwgdSwgciwgdCl7IHJldHVybiBRKG4gLSAzMjAsIHUgLSAyNzAsIHQsIHUgLSA5MjYpOyB9IGZ1bmN0aW9uIGUobiwgdSwgciwgdCl7IHJldHVybiBVKDAsIHQsIDAsIDAsIHUgLSAtMjI4KTsgfSB2YXIgaSA9IHsgQkFWdmQ6IGZ1bmN0aW9uIEJBVnZkKG4peyByZXR1cm4gRFt1KDY2MywgNTkyKV0obik7IH0gfTsgcmV0dXJuIERbZSgwLCAyNDIzLCAwLCAyMTA2KV0oRFtlKDAsIDIyODUsIDAsIDM0NzgpXSwgRFt0KDEzMDcsIDE3OTEsIDAsIDEyNTApXSkgPyBpW3QoMTEzNCwgMTgxMywgMCwgMjI2NSldKFMpIDogRFtlKDAsIDI0MjMsIDAsIDE1OTApXShuLCByKTsgfSwgVGpmdFg6IFNbUSgzMjA4LCAzODI2LCAxODU0LCAyNjMxKV0oX0wsIDQxMCwgLTMxNyksIFRSVEJwOiBTW0ooMTM2NywgMTM2OSwgMTg5LCAxMjQzKV0oX0wsIDUxNiwgLTI3MCksIHNFSEp6OiBTW1QoMTk4NiwgMCwgMCwgMCwgNzAzKV0oU1tVKDAsIDQyNDMsIDAsIDAsIDM0MjgpXShTW1UoMCwgMjgyNSwgMCwgMCwgMjM4NCldKF9MLCA0MDAsIDc1NyksIFNbUSgtNDY2LCAtNzYsIDY3MiwgNjA0KV0oX0wsIDUyOSwgLTI3NykpLCAibXoiKSwgVGlNcmw6IFNbVCgxODAsIDAsIDAsIDAsIDYyMildKF9MLCA2MDIsIDI5KSwgbHRtc3M6IFNbSigyNjUwLCAzMTQ3LCAyNzIzLCAyMjc2KV0oX0wsIDU5MCwgLTIyNiksIHRzSW5uOiBTW1QoOTA4LCAwLCAwLCAwLCA4ODApXShTW1EoMTc1OCwgMTg3NCwgMjEyOSwgMTg3NSldKFNbVCg4ODcsIDAsIDAsIDAsIDg4MildKF9MLCA0MTEsIC0xNzQpLCBTW0koMjA3OCwgMTEwNiwgMTE3OCwgMTY5KV0oX0wsIDM5NiwgMjQ1KSksICJmUyIpLCBzU09iVTogU1tJKDk3OCwgMTgzMiwgNTYyLCAxOTU3KV0oX0wsIDQwMywgMjM4KSwgUHR1QVk6IFNbUSgyMTA1LCA0MzQ5LCA0MjMxLCAzMDUwKV0oX0wsIDM4NiwgLTQzNCksIEFZcGduOiBTW1QoMjQ1NCwgMCwgMCwgMCwgMjA4MyldKFNbSigxMTQ3LCA5MzMsIDMyNzIsIDIyNTEpXShTW0ooMjUyMywgMjg2OCwgMTA0OCwgMTczMCldKF9MLCA1MjMsIC0zMjcpLCBTW0koMzIxNywgMzU1MywgNDA0OSwgMzY4NildKF9MLCA0OTAsIC01NTEpKSwgIm0iKSwgbVlvamM6IFNbVSgwLCA0MDIxLCAwLCAwLCAzMjU2KV0oU1tJKDQ0MzMsIDMyMzMsIDM1NTYsIDQxMTcpXShfTCwgNDMzLCA5MjUpLCAiSFgiKSwgYUZvbEQ6IFNbSSg1MDEsIDEzODgsIDE2MTYsIDMyOCldKF9MLCA0NzEsIDk0MCksIGl2bldmOiBTW1UoMCwgMTE1NCwgMCwgMCwgMjA1MyldKFNbSSgxNDE4LCAxODkyLCA3MDgsIDg2MildKFNbSSgyNDk5LCAxNzk1LCAxMjc0LCAyNzQxKV0oX0wsIDQ2MSwgNDQ5KSwgU1tJKDIyNzksIDMwOTgsIDIyNjQsIDI4OTMpXShfTCwgNDEzLCAtNDg5KSksICJBTSIpLCBhamlOUDogU1tUKDI3NTAsIDAsIDAsIDAsIDIwNjkpXShfTCwgNTg3LCA0NTMpLCBPakFtTjogU1tKKDEyODAsIDI5NTMsIDE2MTAsIDE5NDIpXShTW1EoMTI5MCwgMzY0NywgMTY1MywgMjQ5MildKFNbUSg3ODIsIDE2NTcsIDY4MiwgNjUzKV0oX0wsIDU5NSwgLTIzNiksIFNbUSgxNjUsIC0xODQsIDE4MzEsIDcwNyldKF9MLCA1NDUsIDkxMikpLCAiT0IiKSwgVUlxbkE6IFNbVCgyMjM1LCAwLCAwLCAwLCAxNTg5KV0oX0wsIDQ3NCwgOTE0KSwgZEhSeUI6IFNbSig5MDMsIDc0MywgNjU4LCA5OTApXShfTCwgNTUzLCAtMjcyKSwgUGJPeXE6IFNbVCgtOTAyLCAwLCAwLCAwLCAtMzE3KV0oU1tKKC0xNjksIDI3OSwgNTEyLCAxMDIyKV0oX0wsIDUxOCwgNDMzKSwgU1tUKDIxOTksIDAsIDAsIDAsIDIwNDQpXShfTCwgNDMwLCA0MDkpKSwgeGRta206IFNbSSgyNjU5LCAxMzM2LCAxNzEzLCAxOTMzKV0oU1tRKDE3ODYsIDIwNzUsIDI5ODcsIDE5OTApXShTW1EoMTE2NywgMjIzMiwgMjA3OCwgMTMyMildKF9MLCA0ODksIC0yOTIpLCBTW1UoMCwgMjQyNiwgMCwgMCwgMjI2OSldKF9MLCA0NDYsIDI4MikpLCAickUiKSwgcVVXdkw6IFNbVSgwLCAxMDM4LCAwLCAwLCA5NTEpXShTW1UoMCwgMzMzNSwgMCwgMCwgMjIzNyldKF9MLCA0NTgsIDg2NSksIFNbVSgwLCAxMjE0LCAwLCAwLCAxNjkxKV0oX0wsIDU4OSwgMTYpKSwgQ0VqRGg6IFNbSigxMTc4LCAyNzI5LCAyMjk4LCAxOTE4KV0oX0wsIDUyMCwgLTE1MCksIFpmZ2paOiBTW0ooODgzLCAyNDQ1LCAyMjQyLCAxNjEwKV0oX0wsIDU1OCwgNTY4KSwga2ZLbXY6IFNbSigxNzcxLCAxNTk2LCAyMDQxLCAxNDMyKV0oX0wsIDQ5MSwgLTMwNSksIHFQUGl0OiBTW1UoMCwgMTIwNiwgMCwgMCwgMTg2NildKF9MLCA1NDQsIC0xNDIpLCBQRlN0bDogU1tKKDI5NzcsIDIwMTcsIDExODgsIDIxNDIpXShfTCwgNDM0LCAtMTYyKSwgeEhCRXo6IFNbVCgtMzExLCAwLCAwLCAwLCAyMzQpXShfTCwgNDE3LCAtMzQxKSwgeHNvclU6IGZ1bmN0aW9uIHhzb3JVKG4sIHUpeyBmdW5jdGlvbiByKG4sIHUsIHIpeyByZXR1cm4gSihuIC0gMjEyLCB1IC0gMTEyLCBuLCByIC0gOTc1KTsgfSBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSShuIC0gODksIHIgLSAtNjc1LCByIC0gNDI0LCBlKTsgfSByZXR1cm4gU1tyKDMyMTgsIDM4ODksIDMzMDgpXShTW3QoMTczNCwgMCwgMjI4MywgMCwgMzIxNCldLCBTW1EoNDE2IC0gMzEsIC03MzQgLSAzNDAsIDExMDAsIDY0IC0gLTgwNyldKSA/IFNbdCgxNDA1LCAwLCA4MzgsIDAsIDEzKV0obiwgdSkgOiBEW1EoMjU2OCwgMjMzMywgMjUyNCwgMjExOCldKEUsIF9MLCAwLCAwLCBEW3IoMjU2NywgNDA1MSwgMzA2OCldKEgsIDU1NikpOyB9LCBqRERxSDogU1tVKDAsIDIzOTYsIDAsIDAsIDEwNTcpXShfTCwgNDI5LCA0MjkpLCBFRm5jczogU1tRKC00NTYsIDI0MSwgMTI5MSwgNzA3KV0oX0wsIDU3OSwgLTQyMSksIGxaUG9TOiBTW0ooMzYxOSwgMzc1NSwgMzEzNSwgMjU4NCldKFNbSSgzNTI1LCAzMjcyLCAyODkwLCAyNzEyKV0oU1tVKDAsIDc3NSwgMCwgMCwgODg1KV0oX0wsIDU1MywgOTUxKSwgU1tUKDI0ODAsIDAsIDAsIDAsIDIyMjcpXShfTCwgNDE3LCAtMjQ5KSksICIrJCIpLCBTdk16eDogZnVuY3Rpb24gU3ZNengobil7IGZ1bmN0aW9uIHUobiwgdSwgciwgdCl7IHJldHVybiBVKDAsIHQsIDAsIDAsIHUgLSAtMjc2KTsgfSBmdW5jdGlvbiByKG4sIHUsIHIsIHQpeyByZXR1cm4gUShuIC0gMzEwLCB1IC0gMjcwLCB0LCB1IC0gNjQ3KTsgfSByZXR1cm4gU1t1KDAsIDExNzMsIDAsIDcxNyldKFNbdSgwLCA3NzAsIDAsIC0xNDApXSwgU1tyKDI3MjQsIDI1MjUsIDAsIDE4NDgpXSkgPyBTW3UoMCwgOTg2LCAwLCAxODU5KV0obikgOiBEW3IoMjc3MiwgMTQ2MywgMCwgOTcwKV0oRSwgX0wsIEgpOyB9LCBkcmNjSzogZnVuY3Rpb24gZHJjY0sobiwgciwgdCl7IGZ1bmN0aW9uIGUobiwgdSwgciwgdCl7IHJldHVybiBUKHIsIDAsIDAsIDAsIHUgLSA3NDMpOyB9IGZ1bmN0aW9uIGkobiwgdSwgciwgdCwgZSl7IHJldHVybiBKKG4gLSAzMTcsIHUgLSAxNDksIGUsIHQgLSA0MTIpOyB9IHZhciBmID0geyBPVXhuRzogZnVuY3Rpb24gT1V4bkcobiwgcil7IHJldHVybiBEW3UoMTU0OSwgMjU2MCldKG4sIHIpOyB9IH07IHJldHVybiBEW2koMzI3NCwgOTY5LCAwLCAyMTc0LCAxNzkwKV0oRFtpKDIzNTMsIDMzNjEsIDAsIDI1ODMsIDM2ODApXSwgRFtpKDEyNjAsIDMzOTgsIDAsIDI1ODMsIDM4MjgpXSkgPyBEW2UoMCwgNjgwLCAtMjAxLCAxNDI0KV0obiwgciwgdCkgOiBmW2UoMCwgMzAzMiwgMzcwOSwgNDAwNCldKG4sIEUpOyB9LCBidUdBWTogZnVuY3Rpb24gYnVHQVkobiwgdSl7IGZ1bmN0aW9uIHIobiwgdSwgciwgdCl7IHJldHVybiBKKG4gLSAyMTIsIHUgLSAzMSwgciwgdCAtIC0zODQpOyB9IHJldHVybiBEW3IoMjgzOSwgMzM2MywgOTUwLCAyMjg3KV0oRFtyKDEyMTcsIC0xMjgsIDExNTcsIC05NSldLCBEW1QoLTc0NiwgMCwgMCwgMCwgLTY0KV0pID8gRFtyKDEwODksIC04NTQsIDUxNywgLTExOCldKEUsIF9MLCBIKSA6IERbVCgyNDE4LCAwLCAwLCB0ID0gMjEyOSwgdCAtIDM2NSldKG4sIHUpOyB2YXIgdDsgfSB9OyBmdW5jdGlvbiB4KG4sIHUsIHIsIHQsIGUpeyBmdW5jdGlvbiBpKG4sIHUpeyByZXR1cm4gVSgwLCBuLCAwLCAwLCB1IC0gLTEyMTkpOyB9IHJldHVybiBTW2koMTc5OSwgMjIxMildKFNbaSg0MTksIDUzNyldLCBTW2koMTQ1NCwgNjQ2KV0pID8gRVtEW2koMjQwMiwgMjA5NildKF9MLCA1MzksIDM4KV0oSCkgOiBTW1EoKGYgPSA2NDkpIC0gNDA4LCAzMjMgLSA0NTgsIDE2MTAsIGYgLSA5KV0oX0wsIFNbUSgxNjEzIC0gMzc5LCAxNDIxIC0gMzU5LCAxOTE3LCAyMTQwIC0gLTk4MildKG4sIC04OTEpLCBlKTsgdmFyIGY7IH0gZnVuY3Rpb24gWChuLCB1LCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFQociwgMCwgMCwgMCwgZSAtIDEwMzIpOyB9IGZ1bmN0aW9uIGUobiwgdSwgcil7IHJldHVybiBVKDAsIHIsIDAsIDAsIG4gLSAtNTEyKTsgfSByZXR1cm4gRFtJKChjID0gMTk1NykgLSAyMjAsIGMgLSAtOTk5LCAzMDY0IC0gMzIzLCAyNTM0KV0oRFtVKDAsIDM3MDgsIDAsIDAsIDMxMzQgLSAtNzYpXSwgRFtlKDI2MTIsIDAsIDMyNDApXSkgPyBEW1QoaSA9IDg3NSwgMCwgMCwgZiA9IDIwMTcsIGYgLSAyMjIpXShfTCwgRFt0KDAsIDE5OTksIDE4NzksIDExMzksIDEwMzEpXSh1LCAtOTI1KSwgcikgOiBEW3QoMCwgMjU3MCwgMjA4OSwgMzA0MCwgMjUxMyldKEUsIDAsIERbZSgxMzk5LCAwLCAxMDkyKV0oX0wsIDM3NyksIEgpOyB2YXIgaSwgZiwgYzsgfSB2YXIgbSA9IGZ1bmN0aW9uKCl7IHZhciBwID0geyBSdXROQjogZnVuY3Rpb24gUnV0TkIobiwgcil7IHJldHVybiBEW3UoODg0LCA4ODcpXShuLCByKTsgfSwgWGpzZ2U6IGZ1bmN0aW9uIFhqc2dlKG4sIHIpeyByZXR1cm4gRFt1KDIxNzIsIDE0MDEpXShuLCByKTsgfSwgakVMcEs6IERbYygzMDgwLCAwLCAyMTI2LCAxMTEyLCAyMjI0KV0sIFF4YWZEOiBEW2MoMjg3OSwgMCwgMjk5NiwgMzU5OCwgMjQyNCldLCBuZEJUeTogZnVuY3Rpb24gbmRCVHkobiwgdSwgciwgdCl7IHJldHVybiBEW1IoKGUgPSAzMDI4KSAtIDg1NSwgMCwgMCwgMCwgMTk2MyldKG4sIHUsIHIsIHQpOyB2YXIgZTsgfSwgVUFOQkI6IGZ1bmN0aW9uIFVBTkJCKG4sIHUpeyByZXR1cm4gRFtSKChyID0gMTQxKSAtIC01NTAsIDAsIDAsIDAsIDcyNSldKG4sIHUpOyB2YXIgcjsgfSwgakNPV2o6IGZ1bmN0aW9uIGpDT1dqKG4sIHUpeyByZXR1cm4gRFtSKChyID0gMTAzNSkgLSA0MzMsIDAsIDAsIDAsIDIyMzMpXShuLCB1KTsgdmFyIHI7IH0sIFN0ZFBtOiBmdW5jdGlvbiBTdGRQbShuLCB1KXsgcmV0dXJuIERbUigociA9IDI1NjEpIC0gNDM2LCAwLCAwLCB0ID0gMzg0NSwgdCldKG4sIHUpOyB2YXIgciwgdDsgfSwgV3BtQ3A6IERbdigyOTI0LCAyMjE4KV0sIFZZc0V2OiBEW0soMTc2NCwgMjQ3OSwgMjA2NildLCBKdU5XRzogZnVuY3Rpb24gSnVOV0cobiwgdSwgcil7IHJldHVybiBEW0soMTEzNCwgMTA3NSwgODU5KV0obiwgdSwgcik7IH0sIHRTRFlPOiBEW3YoMTY2MywgMTk1NyldLCBFWnVaTjogZnVuY3Rpb24gRVp1Wk4obiwgdSl7IHJldHVybiBEW2MoMzk0MCAtIDM0OSwgciA9IDMwODksIDM0NDcgLSAxMzEsIDMxNzYsIHIgLSA2NDMpXShuLCB1KTsgdmFyIHI7IH0sIGpsUHpHOiBEW3YoNzUzLCA2NDYpXSwgb2ZRSUM6IERbdigxODE4LCAyMTc3KV0sIFpxWUh0OiBmdW5jdGlvbiBacVlIdChuLCB1LCByLCB0KXsgcmV0dXJuIERbbCgtMTAzLCAxNTExLCAxNTE5LCAtNzcxLCAyMDA1KV0obiwgdSwgciwgdCk7IH0sIEdmVEpIOiBmdW5jdGlvbiBHZlRKSChuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIERbYygzODQgLSAzNDUsIGYgPSAxMjcxLCAxMTI2IC0gMjQ1LCBmLCAxNjMgLSAtNTMwKV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmOyB9LCBVd3lZVzogRFtsKDEyNTIsIC04MywgNjMwLCAyNDE5LCAyMTQ3KV0sIFpld0x4OiBmdW5jdGlvbiBaZXdMeChuLCB1LCByLCB0KXsgcmV0dXJuIERbSygoZSA9IDk4KSAtIC05MzgsIGUgLSAxMiwgaSA9IC05MjEpXShuLCB1LCByLCB0KTsgdmFyIGUsIGk7IH0sIGZhV2liOiBmdW5jdGlvbiBmYVdpYihuLCB1KXsgcmV0dXJuIERbdihyID0gMTA3MCwgNjY4IC0gMjgyKV0obiwgdSk7IHZhciByOyB9LCBZZUlqTjogZnVuY3Rpb24gWWVJak4obiwgdSl7IHJldHVybiBEW2MoMzMzNiAtIDgzLCByID0gMzMyNywgKHQgPSA0MjIxKSAtIDQ3OCwgdCwgciAtIDY1NCldKG4sIHUpOyB2YXIgciwgdDsgfSwgdGN2SHc6IERbUigyOTQwLCAwLCAwLCAwLCAzOTQwKV0sIE9Ha29HOiBEW0soMTk0NiwgMTMzMCwgMTI0NildLCBPaGpnTzogZnVuY3Rpb24gT2hqZ08obiwgdSl7IHJldHVybiBEW3YoODM4LCAociA9IDYxKSAtIC01OTYpXShuLCB1KTsgdmFyIHI7IH0sIGVRQkpIOiBEW2woMTA4NiwgMjM0NSwgMjEsIDkyNCwgMTczNyldLCBKTVRwYzogZnVuY3Rpb24gSk1UcGMobiwgdSwgciwgdCl7IHJldHVybiBEW2MoMTgyNCwgMCwgMjQ1NywgOTY5LCAyODU4KV0obiwgdSwgciwgdCk7IH0sIGpIc2VEOiBmdW5jdGlvbiBqSHNlRChuLCB1KXsgcmV0dXJuIERbdihyID0gMTI0NiwgMjE5MCAtIDg3NyldKG4sIHUpOyB2YXIgcjsgfSwgcHNXY1k6IERbYygxODc5LCAwLCAxMzQ2LCAzMjI1LCAyMDkxKV0sIGRTS1h3OiBmdW5jdGlvbiBkU0tYdyhuLCB1KXsgcmV0dXJuIERbUig0MzggLSAtMTgsIDAsIDAsIHIgPSAxNzY2LCByKV0obiwgdSk7IHZhciByOyB9LCBGdVZMVTogZnVuY3Rpb24gRnVWTFUobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBEW3YoZiA9IDIyODMsIChjID0gMTgzMSkgLSAtNTc4KV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmLCBjOyB9LCBTRG1IeTogZnVuY3Rpb24gU0RtSHkobiwgdSl7IHJldHVybiBEW2woMTg1MSAtIDMxNSwgNTIxIC0gMzM0LCAzMTAxIC0gMzk3LCAociA9IDIwMjQpIC0gMzU4LCByKV0obiwgdSk7IHZhciByOyB9LCBKcGFuTTogRFtsKDIwNywgNDczLCAxNDUzLCAtMTgzLCAtMTEzMCldLCBrd3VrRDogRFtsKDM1NCwgMzY2LCA0MzUsIDYxLCAtNDQxKV0sIGVsTUZrOiBmdW5jdGlvbiBlbE1GayhuLCB1KXsgcmV0dXJuIERbUigodCA9IDEyNjUpIC0gNjY2LCByID0gMTU1MSwgMCwgMCwgcildKG4sIHUpOyB2YXIgciwgdDsgfSwgY2llZlo6IERbUigxNDI0LCAwLCAwLCAwLCA2OTEpXSwgcFdkZkM6IERbUig5NTcsIDAsIDAsIDAsIDIwNjEpXSwgUnRPdHY6IGZ1bmN0aW9uIFJ0T3R2KG4sIHUsIHIpeyByZXR1cm4gRFtLKCh0ID0gMTM4MCkgLSAtMzkyLCAyMTI2IC0gNDMyLCA2NTApXShuLCB1LCByKTsgdmFyIHQ7IH0sIE5BWUJ1OiBEW3YoMzYxOSwgMjg1NSldLCBnWE1aaTogRFtLKDEzMjAsIDE2MTEsIDIxNzUpXSwgeVp6Y2M6IGZ1bmN0aW9uIHlaemNjKG4sIHUpeyByZXR1cm4gRFtsKDcxIC0gLTIyNSwgMjAwIC0gNDE5LCAociA9IC01NjApIC0gNDI0LCAtMTI1IC0gNDAwLCByKV0obiwgdSk7IHZhciByOyB9LCBwU2FwQzogZnVuY3Rpb24gcFNhcEMobiwgdSl7IHJldHVybiBEW1IoKHIgPSAyMDI1KSAtIC0xNDUsIDAsIDAsIDAsIDI2NTUpXShuLCB1KTsgdmFyIHI7IH0sIFFaTHJROiBEW0soMjgzMSwgMjgzNiwgMjE4MildLCB0WlhmaTogRFt2KDI0MjQsIDE1NjApXSwgeG5aYlY6IGZ1bmN0aW9uIHhuWmJWKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gRFtsKChmID0gNzkzKSAtIDU1OCwgKGkgPSA4OSkgLSAzNDcsIDUwMiAtIDQ4MSwgZiAtIDIwMiwgaSldKG4sIHUsIHIsIHQsIGUpOyB2YXIgaSwgZjsgfSwgcVVaZXg6IERbUig5MjMsIDAsIDAsIDAsIDUxNildLCBXemxmZTogRFt2KDMwNTMsIDIwMTUpXSwgWXRmVVU6IGZ1bmN0aW9uIFl0ZlVVKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gRFtsKChmID0gMzE2KSAtIDgxLCAoaSA9IDEwMjIpIC0gMTEwLCBmIC0gOTksIC04OTQgLSAxODcsIGkpXShuLCB1LCByLCB0LCBlKTsgdmFyIGksIGY7IH0sIGFxQkZROiBmdW5jdGlvbiBhcUJGUShuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIERbbCgxODg4IC0gLTQsIDI4MzAgLSAxMiwgKGYgPSAyNjQ4KSAtIDI1MCwgMjE0NiAtIDI2NSwgZildKG4sIHUsIHIsIHQsIGUsIGkpOyB2YXIgZjsgfSwgV2ZOUWI6IGZ1bmN0aW9uIFdmTlFiKG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gRFtLKChmID0gMjU2OCkgLSAtOTg5LCAzMTg4IC0gMjI5LCAxNjA1KV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmOyB9LCBtWFhjUjogZnVuY3Rpb24gbVhYY1IobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBEW2MoMTI5MiAtIDcwLCBmID0gMzc0LCA4MjQgLSA0NTgsIDEwNjMsIGYgLSAtNDUxKV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmOyB9IH07IGZ1bmN0aW9uIG8obiwgdSwgcil7IGZ1bmN0aW9uIHQobiwgdSwgciwgdCl7IHJldHVybiBSKHIgLSAtNDg0LCAwLCAwLCAwLCBuKTsgfSByZXR1cm4gRFt0KDE1NjIsIDM3MzcsIDI0NjEsIDIzMzEpXShEW2MoKGUgPSAyNDM2KSAtIDM2OCwgMCwgMTY5MiAtIDQwMiwgMzQ1MCwgZSAtIC02MDApXSwgRFt0KDE0ODYsIDEzNDEsIDE4NDYsIDE2NzcpXSkgPyBEW3QoMjgyNSwgMjQ4MSwgMjA0MiwgMjEyOSldKGksIERbUigxNTA1LCAwLCAwLCAwLCAyMzQ4KV0odSwgNTUyKSwgMCwgMCwgMCwgcikgOiBuW0UgLT0gNDA0XTsgdmFyIGU7IH0gZnVuY3Rpb24gcyhuLCB1LCByLCB0LCBlKXsgZnVuY3Rpb24gaShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEsodSAtIDI0NCwgdSAtIDMxOSwgdCk7IH0gZnVuY3Rpb24gZihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGwoZSAtIDQ0NywgdSAtIDQ1NSwgciAtIDE5NSwgdCAtIDI4NSwgdCk7IH0gcmV0dXJuIHBbaSgwLCAzMzcwLCAwLCAyMjY2LCAyMzY5KV0ocFtpKDAsIDI1NzQsIDAsIDIxNDYsIDIwMTApXSwgcFtpKDAsIDIxNjQsIDAsIDg4MiwgMjMyOSldKSA/IHBbbCgyMDAzIC0gMTIxNywgMTk2NyAtIDI0MywgKGMgPSA5NTMpIC0gMjUyLCAxMjUzIC0gMTg5LCBjKV0oWCwgMCwgcFtmKDAsIC0zNjIsIC0zMTYsIC02MzAsIDYxNildKHIsIDcxMiksIGUpIDogcFtmKDAsIDMwNTIsIDI3MDEsIDE3NjIsIDI2OTApXShuLCBFKTsgdmFyIGM7IH0gZnVuY3Rpb24gdihuLCB1KXsgcmV0dXJuIEoobiAtIDQ4LCB1IC0gMzYzLCBuLCB1IC0gMjQ2KTsgfSBmdW5jdGlvbiBsKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gVChlLCAwLCAwLCAwLCBuIC0gNTgpOyB9IHZhciBZID0geyBEYVRNUTogZnVuY3Rpb24gRGFUTVEobiwgciwgdCl7IGZ1bmN0aW9uIGUobiwgdSwgciwgdCwgZSl7IHJldHVybiBLKHUgLSA0ODksIHUgLSA0NzcsIHIpOyB9IHZhciBpLCBmID0geyBudGNyejogZnVuY3Rpb24gbnRjcnoobiwgcil7IHJldHVybiBwW3UoMjI3MywgNDI3OCldKG4sIHIpOyB9IH07IGZ1bmN0aW9uIGMobiwgdSwgciwgdCl7IHJldHVybiBSKG4gLSAzMjEsIDAsIDAsIDAsIHQpOyB9IHJldHVybiBwW2UoMCwgMTc2NywgODU1LCAyOTc4LCAyMDkyKV0ocFtsKChpID0gMTQ1KSAtIC0xOSwgMTA1MSAtIDExLCArIC02MjQsIGkgLSAyNDEsIDcyNyldLCBwW2UoMCwgMzI0MCwgMjM5MywgNDAwOSwgMzg1MyldKSA/IGZbYygyOTg2LCAzMTc4LCAxODE4LCAyMjIyKV0obiwgRSkgOiBqW3BbYygxNDcyLCAxMjAyLCA5MTgsIDE4MildKF9MLCA2MTgsIC0xNjUpXShuLCByLCB0KTsgfSwga2VNTVg6IGZ1bmN0aW9uIGtlTU1YKG4sIHIpeyBmdW5jdGlvbiBpKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gUihlIC0gMTcyLCAwLCAwLCAwLCB1KTsgfSBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbChlIC0gNTU2LCB1IC0gODMsIHIgLSA0NjEsIHQgLSA0NDAsIG4pOyB9IHZhciBmID0geyBGZlh0aDogZnVuY3Rpb24gRmZYdGgobiwgciwgdCl7IHJldHVybiBwW3UoMTI3MCwgMjk0NCldKG4sIHIsIHQpOyB9LCBGWlZYTjogZnVuY3Rpb24gRlpWWE4obiwgcil7IHJldHVybiBwW3UoOTIyLCAxNDQzKV0obiwgcik7IH0sIGVDTkhIOiBmdW5jdGlvbiBlQ05ISChuLCByLCB0KXsgcmV0dXJuIHBbdSgxMjcwLCA5NDMpXShuLCByLCB0KTsgfSB9OyBmdW5jdGlvbiBlKG4sIHUpeyByZXR1cm4gdihuLCB1IC0gMTE4OSk7IH0gaWYgKHBbaSgwLCAyNzgzLCAyNjQwLCAyNTY0LCAyNzkzKV0ocFtpKDAsIDIxMDIsIDE4MDksIDE4NjgsIDIwNzgpXSwgcFtlKDI4MTIsIDI5NzgpXSkpeyB2YXIgYyA9IHsgRklpRkI6IGZ1bmN0aW9uIEZJaUZCKG4sIHUpeyByZXR1cm4gZltlKDEzMzcsIDI1NjQgLSAtMTEzMildKG4sIHUpOyB9IH0sIG8gPSB7IHlEcVRWOiBmdW5jdGlvbiB5RHFUVihuLCB1LCByKXsgcmV0dXJuIGZbaSgwLCB0ID0gNDg5LCB0IC0gNDMzLCAoZSA9IDQ0KSAtIDI2LCBlIC0gLTk3MyldKG4sIHUsIHIpOyB2YXIgdCwgZTsgfSwgVGJpa3k6IGZ1bmN0aW9uIFRiaWt5KG4sIHUpeyByZXR1cm4gY1tpKDAsIDIwMzksIDIyMjIgLSAyMzEsIDE5OTYgLSAxODksIDE0NDQgLSAtNzI3KV0obiwgdSk7IH0gfTsgcmV0dXJuIG9bZlt0KDQxOSwgMTkzOCwgOTYwLCAxODUxLCA3NjcpXShILCA1MjcsIDUyKV0oTywgb1tmW2koMCwgNDc5LCAxMDY0LCA4MzksIDg1MyldKEMsIDQ2MCwgLTExMildKGcsIDg1NSksIHcpOyB9IHJldHVybiBqW3BbdCgyOTcsIDIzOTQsIDE1MjUsIDEyNSwgMTA3MyldKF9MLCA1MzMsIC0yOTkpXShuLCByKTsgfSwgUWlucE06IGZ1bmN0aW9uIFFpbnBNKG4sIHUpeyBmdW5jdGlvbiByKG4sIHUsIHIsIHQpeyByZXR1cm4gYyhuIC0gMjE1LCAwLCByIC0gMjcyLCB0LCB1IC0gNTg3KTsgfSBpZiAoRFt2KDE2NjEsIDI3NzggLSA3MjUpXShEW3IoMjAyMiwgMjE5NiwgMjM5OCwgMjgwNCldLCBEW2woKHQgPSA5NTIpIC0gLTMzLCAxMTkzIC0gMzIzLCB0IC0gMTYwLCAoZSA9IDI3MykgLSAxNCwgZSldKSkgcmV0dXJuIGpbRFtyKDg3MCwgMTIwNiwgMjM4OSwgMjkzKV0oX0wsIDUzMywgOTgxKV0obiwgdSk7IHZhciB0LCBlLCBpID0gRVt2KDI3MjMsIDIxMzEgLSAtNDgyKV0oYSwgYXJndW1lbnRzKTsgcmV0dXJuIEggPSBudWxsLCBpOyB9LCBlTWNKYjogZnVuY3Rpb24gZU1jSmIobiwgcil7IHZhciB0ID0geyBOTFRzTjogZnVuY3Rpb24gTkxUc04obiwgciwgdCl7IHJldHVybiBwW3UoMTI3MCwgMzIyNSldKG4sIHIsIHQpOyB9LCBiT0RJczogZnVuY3Rpb24gYk9ESXMobiwgcil7IHJldHVybiBwW3UoMTY3NSwgMTgzNSldKG4sIHIpOyB9IH07IGZ1bmN0aW9uIGUobiwgdSwgciwgdCwgZSl7IHJldHVybiBsKHQgLSA0MDEsIHUgLSAyNzQsIHIgLSA0MDYsIHQgLSA0NDYsIGUpOyB9IHJldHVybiBwW2UoMCwgLTMzMywgLTQ1OCwgNTQwLCAxODY2KV0ocFtlKDAsIDIwNTEsIDMyMDMsIDIwODYsIDMyNjMpXSwgcFt2KDMzNjUsIDI4MjEgLSA2MTkpXSkgPyBqW3BbdigxODQ1LCAxMDM0KV0oX0wsIDQ1MSwgOTI2KV0obiwgcikgOiB0W2UoMCwgMjI2MSwgMjA2MiwgMjI5NSwgMzMxNSldKEUsIHRbZSgwLCAxODgxLCAxODA0LCAxNzIyLCA2MTgpXShfTCwgNjk2KSwgSCk7IH0sIGhJRGlYOiBqW0RbSygzMzczLCA0Mzg5LCAyNDc3KV0obywgMCwgOTY3LCAxMDcyKV0sIFJoeHhkOiBmdW5jdGlvbiBSaHh4ZChuLCByKXsgdmFyIHQgPSB7IG5QVFhJOiBmdW5jdGlvbiBuUFRYSShuLCByKXsgcmV0dXJuIHBbdSgyNzQwLCAyODY0KV0obiwgcik7IH0gfTsgZnVuY3Rpb24gZShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEsoZSAtIC0zODQsIHUgLSA2OCwgdSk7IH0gcmV0dXJuIHBbZSgwLCAxMjk0LCAwLCAxMTUsIDg5NCldKHBbZSgwLCAyOTQ4LCAwLCAyMjU3LCAyMzU4KV0sIHBbZSgwLCAyMTg2LCAwLCAyMTU1LCAyMzU4KV0pID8galtwW2MoMjY0MCwgMCwgMTIzMCwgMzY0NywgMTYyMCldKG8sIDAsIHBbZSgwLCA5NzIsIDAsIDI2OTQsIDE2NzcpXSg5MjgsIC0xNTApLCA5NzcpXShuLCByKSA6IHRbbCg2NTEsIC0yOSwgMiwgMTE0NywgMTg1NSldKG4sIEUpOyB9LCBLaWVoYjogaltEW2woMjIzNCwgMjI3MiwgMzE1MSwgMjg4NywgMTc0MCldKG8sIDAsIDEwMDUsIDEwNTIpXSwgZ0RDd0M6IGpbRFt2KDE4NiwgNTg2KV0ocywgMCwgMCwgMzY0LCAwLCAzNDcpXSB9OyBmdW5jdGlvbiBjKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSShuIC0gMjM2LCBlIC0gLTUwNywgciAtIDE4LCB0KTsgfSBmdW5jdGlvbiBSKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gVSgwLCBlLCAwLCAwLCBuIC0gLTQ4MSk7IH0gZnVuY3Rpb24gYihuLCB1LCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEsodSAtIC0xMjI1LCB1IC0gMTYwLCByKTsgfSBmdW5jdGlvbiBlKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbCh1IC0gMjUxLCB1IC0gNDg1LCByIC0gNTgsIHQgLSAxMzQsIGUpOyB9IGlmIChwW2UoMCwgMjIzOCwgMTA0NiwgMzIxNywgMTU3MildKHBbdCgwLCAxMTI0LCAxNzQ1LCA2MTYsIC01OCldLCBwW3QoMCwgMTEyNCwgOTkzLCAyMjQ0LCAxMTQ5KV0pKXsgdmFyIGkgPSAodm9pZCAwKVtIW3BbZSgwLCAzOSwgLTM1NCwgMTA5NiwgLTU4NildKE8sIDIzOSwgMCwgMCwgMCwgMjc5KV0oQywgNDE4LCA2MDYpXShyLCBhcmd1bWVudHMpOyByZXR1cm4gdyA9IG51bGwsIGk7IH0gcmV0dXJuIHBbdCgwLCAxNjkxLCAyNjAxLCAyNzIwLCAxNTA5KV0oWCwgMCwgcFtlKDAsIDQyMCwgLTQ0LCAxNzIyLCAtMzM3KV0ociwgMTgxKSwgbik7IH0gZnVuY3Rpb24gSyhuLCB1LCByKXsgcmV0dXJuIFEobiAtIDEwNSwgdSAtIDU3LCByLCBuIC0gMzE4KTsgfSBpZiAoaltEW2MoMzI1MCwgMCwgMjk2NywgMzE3MiwgMjUxNildKGcsIDAsIDAsIDAsIERbdig5NjAsIDk0OSldKDU1OSwgLTM5NiksIDY1MildKGpbRFtsKDE1MzksIDkyNiwgMTY2MywgMTIwNiwgMTgyMyldKGIsIC0yNDYsIDAsIC0yOTkpXSwgaltEW2woMTUzOSwgMTkzMCwgMTE0MywgNDc4LCAyNTg3KV0oYiwgLTE0NywgMCwgLTIyMyldKSkgcmV0dXJuIFlbRFtjKDE1ODYsIDAsIDMxMjUsIDEzNjMsIDE5OTUpXShiLCAtMzE0LCAwLCAtMjU5KV0oQiwgWVtEW1IoMjE3MywgMCwgMCwgMCwgMjM3MildKGIsIC0zMTgsIDAsIC0yODgpXShWLCAtNDI2KSwgaCk7IHZhciByID0gITA7IHJldHVybiBmdW5jdGlvbihLLCBEKXsgdmFyIFEgPSB7IER1aldGOiBmdW5jdGlvbiBEdWpXRihuLCByKXsgcmV0dXJuIHBbdSgxMzUyLCAyMzM5KV0obiwgcik7IH0sIER3SVZnOiBmdW5jdGlvbiBEd0lWZyhuLCByKXsgcmV0dXJuIHBbdSgxNjAxLCAxOTcxKV0obiwgcik7IH0sIEJrT25XOiBwW1IoNTE0LCAwLCAwLCAwLCAxNDczKV0sIFdmakFNOiBwW1IoMTY2NSwgMCwgMCwgMCwgMjgwOSldLCBEVVlaUjogZnVuY3Rpb24gRFVZWlIobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBwW3YoLTczNiwgMCwgZiA9IDI3MCwgMCwgZiAtIC04NDYpXShuLCB1LCByLCB0LCBlLCBpKTsgdmFyIGY7IH0sIEphSVFTOiBmdW5jdGlvbiBKYUlRUyhuLCB1KXsgcmV0dXJuIHBbdig3NzcsIDAsIDAsIHIgPSAxNDE0LCByIC0gLTEwMTYpXShuLCB1KTsgdmFyIHI7IH0sIGJ0WXVVOiBmdW5jdGlvbiBidFl1VShuLCB1KXsgcmV0dXJuIHBbeCgtNzkxIC0gMjIwLCAwLCByID0gNDAwLCAtMTAgLSAtMTc2NildKG4sIHUpOyB2YXIgcjsgfSwgblpjRms6IHBbYSgwLCAwLCAxOTA1LCAwLCAxNDM5KV0sIGh4dkhHOiBmdW5jdGlvbiBoeHZIRyhuLCB1LCByLCB0KXsgcmV0dXJuIHBbdihlID0gMzcxNCwgMCwgMCwgMCwgMjQ2NCAtIC03NTIpXShuLCB1LCByLCB0KTsgdmFyIGU7IH0sIFlzRWJ3OiBmdW5jdGlvbiBZc0VidyhuLCB1KXsgcmV0dXJuIHBbeCg5NzUgLSAxNDcsIHIgPSA4NjEsIHIsICh0ID0gMjAzMSkgLSA0MCldKG4sIHUpOyB2YXIgciwgdDsgfSwgeHdxUmo6IGZ1bmN0aW9uIHh3cVJqKG4sIHUpeyByZXR1cm4gcFtSKDc3MywgMCwgMCwgMCwgNDQ4KV0obiwgdSk7IH0sIEh6VmFYOiBwW2EoMCwgMCwgODc2LCAwLCAxMTA1KV0sIHBZQVBWOiBmdW5jdGlvbiBwWUFQVihuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIHBbYSgwLCAwLCA2MTcsIGYgPSA1ODAsIGYgLSAxMDM1KV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmOyB9LCBYeVliWDogZnVuY3Rpb24gWHlZYlgobiwgdSl7IHJldHVybiBwW2EociA9IDI1NCwgMCwgNjEwLCAwLCByIC0gNzU1KV0obiwgdSk7IHZhciByOyB9LCBHVVB3STogZnVuY3Rpb24gR1VQd0kobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBwW0koLTQ0MSAtIDEzMywgZiA9IDg3NywgZiAtIDEsIDAsIDIwMDkpXShuLCB1LCByLCB0LCBlLCBpKTsgdmFyIGY7IH0sIGJSbGlHOiBmdW5jdGlvbiBiUmxpRyhuLCB1KXsgcmV0dXJuIHBbdigtMTc5LCByID0gOTU4LCAwLCAwLCByIC0gLTE1NTkpXShuLCB1KTsgdmFyIHI7IH0sIHVjb1NmOiBwW0ooLTIyNiwgMjQ2LCAyOSldLCBLS01DWjogcFtJKDI2NzgsIDAsIDE3MzAsIDAsIDEzNjApXSwgV0dKQnA6IGZ1bmN0aW9uIFdHSkJwKG4sIHUpeyByZXR1cm4gcFthKHIgPSAxMjE1LCB0ID0gOTU1LCByLCAwLCB0IC0gMjc2KV0obiwgdSk7IHZhciByLCB0OyB9LCBoZnVDVTogZnVuY3Rpb24gaGZ1Q1UobiwgdSl7IHJldHVybiBwW2EociA9IDIwMzEsIHQgPSAxOTEwLCByLCAwLCB0IC0gNDE2KV0obiwgdSk7IHZhciByLCB0OyB9LCBxZWprczogcFt4KDI5MzgsIDAsIDE2MjEsIDI2OTUpXSwgeWxHVGc6IHBbYSgwLCAwLCAxOTI0LCAwLCA4NzApXSwgZXRrYVg6IGZ1bmN0aW9uIGV0a2FYKG4sIHUsIHIpeyByZXR1cm4gcFt4KDEwNjQgLSA5MywgdCA9IDEyNzMsIHQsIDIwMzQgLSAtNDc1KV0obiwgdSwgcik7IHZhciB0OyB9LCBEQkdZRDogcFtJKDgwMSwgMCwgMTc2MCwgMCwgMjI5MyldLCBOeXBtRTogcFthKDAsIDAsIDEwMjIsIDAsIDEyNzUpXSwgcWh1bmk6IGZ1bmN0aW9uIHFodW5pKG4sIHUsIHIsIHQpeyByZXR1cm4gcFtKKChpID0gMTAyNykgLSA0NTYsIGUgPSA5MDIsIDE3NDMgLSAxNDYpXShuLCB1LCByLCB0KTsgdmFyIGUsIGk7IH0sIEJVT0twOiBmdW5jdGlvbiBCVU9LcChuLCB1KXsgcmV0dXJuIHBbeCgociA9IDMxODIpIC0gMjkyLCAwLCByLCAyMTc1IC0gLTI5NildKG4sIHUpOyB2YXIgcjsgfSwgR1JYVnM6IGZ1bmN0aW9uIEdSWFZzKG4sIHUpeyByZXR1cm4gcFtJKChyID0gMjc3MykgLSAxMjEsIDAsIHIgLSAxNjk4LCB0ID0gMzM2OSwgdCldKG4sIHUpOyB2YXIgciwgdDsgfSwgbVdocmI6IGZ1bmN0aW9uIG1XaHJiKG4sIHUpeyByZXR1cm4gcFtKKChyID0gMTkxMikgLSAxMTA2LCAxODIwLCByIC0gOSldKG4sIHUpOyB2YXIgcjsgfSwgRHVCQ2c6IHBbSSgyMjQ1LCAwLCAyMDU5LCAwLCAzMjc0KV0sIG9Xc0x2OiBwW1IoMTQ0NywgMCwgMCwgMCwgMTU1NSldLCBOUFdXTjogZnVuY3Rpb24gTlBXV04obiwgdSwgciwgdCwgZSl7IHJldHVybiBwW0koKGkgPSA4MzMpIC0gMjMyLCAwLCBpIC0gMTExNSwgMCwgMTg5MildKG4sIHUsIHIsIHQsIGUpOyB2YXIgaTsgfSwgaEJIZGg6IGZ1bmN0aW9uIGhCSGRoKG4sIHUpeyByZXR1cm4gcFt4KChyID0gMzg4KSAtIDMyMiwgMCwgciwgKHQgPSAxMDcyKSAtIC0xNTY2KV0obiwgdSk7IHZhciByLCB0OyB9LCBwaVN2dDogcFthKDAsIDAsIC0xMTgwLCAwLCAzOSldLCB5UVJQQjogcFtKKDY2MiwgMTM1MCwgNzI4KV0sIHFjbWJIOiBmdW5jdGlvbiBxY21iSChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIHBbdihpID0gMzA0MiwgMCwgMCwgZiA9IDMxMjksIGYgLSAzMTgpXShuLCB1LCByLCB0LCBlKTsgdmFyIGksIGY7IH0gfTsgZnVuY3Rpb24gSShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGMobiAtIDQ2MCwgMCwgciAtIDMyNSwgZSwgciAtIC02NTEpOyB9IGZ1bmN0aW9uIGEobiwgdSwgciwgdCwgZSl7IHJldHVybiBSKGUgLSAtODc3LCAwLCAwLCAwLCByKTsgfSBmdW5jdGlvbiBKKG4sIHUsIHIpeyByZXR1cm4gYyhuIC0gMzQ2LCAwLCByIC0gMTAzLCB1LCBuIC0gLTgzOSk7IH0gZnVuY3Rpb24gVShuLCB1LCByLCB0LCBlKXsgZnVuY3Rpb24gaShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIHgobiAtIDU0LCAwLCByLCB1IC0gLTE0ODIpOyB9IGZ1bmN0aW9uIGYobiwgdSwgciwgdCwgZSl7IHJldHVybiBJKG4gLSAzMzEsIDAsIHQgLSAyNDIsIDAsIGUpOyB9IHJldHVybiBRW2YoMTU2OCwgMCwgMCwgMTU5NiwgMTkzOSldKFFbaSgxMzUzLCA0MTUsIDEwMDcsIDAsIDE0MTMpXSwgUVthKDAsIDAsIDQ0NSwgMCwgNDY0IC0gNDU4KV0pID8gUVt2KGMgPSA2MjMsIDAsIDAsIG8gPSAxNTM4LCBvIC0gODgpXShzLCAwLCAwLCBRW2koNTIzLCAyMzMsIDU3NiwgMCwgMTEwOCldKGUsIDg1MiksIDAsIG4pIDogUVtmKDEyMzEsIDAsIDAsIDY0MiwgMTI5NCldKG4sIEUpOyB2YXIgYywgbzsgfSBmdW5jdGlvbiBnKG4sIHUsIHIsIHQsIGUpeyBmdW5jdGlvbiBpKG4sIHUsIHIsIHQpeyByZXR1cm4gSShuIC0gNzEsIDAsIHIgLSAyMywgMCwgdCk7IH0gZnVuY3Rpb24gZihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEkobiAtIDQxNywgMCwgbiAtIDEyNzUsIDAsIGUpOyB9IGZ1bmN0aW9uIGMobiwgdSwgciwgdCl7IHJldHVybiB2KG4sIDAsIDAsIDAsIHUgLSAtNjIwKTsgfSByZXR1cm4gUVtpKDU3MiwgMCwgMTM3NywgOTI2KV0oUVtjKDU2OCwgNjExLCAxOTM0LCA5OTgpXSwgUVtpKDQ3OSwgMCwgLTEwMSwgLTMxMCldKSA/IFFbYygxNTExLCAyMTE2LCAyMjU2LCAxMzU2KV0obiwgRSkgOiBRW2YoMTg1MCwgMCwgMCwgMCwgMjI2MildKG8sIDAsIFFbZigyNzcwLCAwLCAwLCAwLCAyNTkxKV0oZSwgLTIyKSwgdCk7IH0gZnVuY3Rpb24gdihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFIoZSAtIDY5NCwgMCwgMCwgMCwgbik7IH0gaWYgKGpbcFthKDAsIDAsIDcwOCwgMCwgMTQyKV0oVSwgMTE4NCwgMCwgMCwgMCwgMTA3OCldKGpbcFt4KDQ4NTAsIDAsIDI3MTEsIDM5OTEpXShnLCAwLCAwLCAwLCA4NzcsIDk1NSldLCBqW3BbeCg0MDAyLCAwLCAyNzUzLCAzMDgwKV0oVSwgMTE0NywgMCwgMCwgMCwgMTA2MyldKSkgcmV0dXJuIG07IGZ1bmN0aW9uIHgobiwgdSwgciwgdCl7IHJldHVybiBjKG4gLSAxMjYsIDAsIHIgLSA0MjUsIHIsIHQgLSA5OTMpOyB9IHZhciBuID0gciA/IGZ1bmN0aW9uKCl7IHZhciBhID0geyBDcE54dzogZnVuY3Rpb24gQ3BOeHcobiwgciwgdCwgZSwgaSwgZil7IHJldHVybiBRW3UoNzA2LCAtNTQ4KV0obiwgciwgdCwgZSwgaSwgZik7IH0sIFRXY01zOiBmdW5jdGlvbiBUV2NNcyhuLCByKXsgcmV0dXJuIFFbdSgxMDY2LCA3OTMpXShuLCByKTsgfSwgZ2xPS3M6IFFbcCgyNTM3LCAwLCAyNDA3LCAxMjg5KV0sIEtvbGFROiBRW2MoMjQ3MywgMzIyNCwgMCwgMCwgMzQ4MSldLCBadHFRVjogZnVuY3Rpb24gWnRxUVYobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBRW2MoNDg0IC0gMjEzLCBmID0gLTE2MywgMCwgMCwgNDcgLSAtMTY2NyldKG4sIHUsIHIsIHQsIGUsIGkpOyB2YXIgZjsgfSwgWVhKSVI6IGZ1bmN0aW9uIFlYSklSKG4sIHUpeyByZXR1cm4gUVtjKDIxOTIsIDI5MTcsIDAsIDAsIDIzOTQpXShuLCB1KTsgfSwgUFZaVVo6IGZ1bmN0aW9uIFBWWlVaKG4sIHUpeyByZXR1cm4gUVtwKChyID0gMzM1NSkgLSAzMjgsIDAsIHIgLSA4OTEsIDM2MTkpXShuLCB1KTsgdmFyIHI7IH0sIHJLQndVOiBmdW5jdGlvbiByS0J3VShuLCB1KXsgcmV0dXJuIFFbYygociA9IDM0MzcpIC0gNDc2LCB0ID0gMzExOSwgMCwgMCwgciAtIDE4MSldKG4sIHUpOyB2YXIgciwgdDsgfSwgbWVBeWc6IGZ1bmN0aW9uIG1lQXlnKG4sIHUpeyByZXR1cm4gUVtjKDgzNCAtIDMyNSwgNzQ0LCByID0gMTQ2OSwgMCwgciAtIC0xNDA5KV0obiwgdSk7IHZhciByOyB9LCBHTmlHVzogUVtjKDYyNywgMTc3NywgMCwgMCwgMTg5MyldLCBReHhFRjogUVtzKC02MDIsIDAsIDk3LCAtMjM1KV0sIG1wcGh4OiBmdW5jdGlvbiBtcHBoeChuLCB1LCByKXsgcmV0dXJuIFFbcCgodCA9IDIyNzkpIC0gMzg2LCAwLCB0IC0gMzAyLCAxMTY4KV0obiwgdSwgcik7IHZhciB0OyB9LCBGVHpaaDogZnVuY3Rpb24gRlR6WmgobiwgdSl7IHJldHVybiBRW3MoKHIgPSAxMjUwKSAtIDQ5MCwgdCA9IDEzMCwgciAtIDExMTMsIHQpXShuLCB1KTsgdmFyIHIsIHQ7IH0sIGNPSFNwOiBRW3AoMTUxMiwgMCwgMTkyMywgMjY3OSldLCBKSnpiWjogZnVuY3Rpb24gSkp6YloobiwgdSl7IHJldHVybiBRW2YoMjI2OSAtIDM2LCAwLCAyNTg0IC0gOTEsIHIgPSAyNzQ4LCByKV0obiwgdSk7IHZhciByOyB9LCBYYkxSRTogUVtwKDIwMTgsIDAsIDIwMzMsIDMxMTYpXSwgY29pem46IGZ1bmN0aW9uIGNvaXpuKG4sIHUpeyByZXR1cm4gUVtwKChyID0gLTU2OSkgLSAxMjUsIHQgPSAtMjQsIHQgLSAtNjQ4LCByKV0obiwgdSk7IHZhciByLCB0OyB9LCBiZEN4VjogZnVuY3Rpb24gYmRDeFYobiwgdSl7IHJldHVybiBRW2MoMjAwOSAtIDE3NSwgMjU4NCwgciA9IDE0NzUsIDAsIHIgLSAtMTU0NCldKG4sIHUpOyB2YXIgcjsgfSB9OyBmdW5jdGlvbiBjKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSShuIC0gNDY0LCAwLCBlIC0gMTUyNCwgMCwgdSk7IH0gZnVuY3Rpb24gbihuLCB1LCByLCB0KXsgZnVuY3Rpb24gZShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIHYoMCwgdSAtIDE2MjksIHIgLSA4NSwgZSk7IH0gZnVuY3Rpb24gaShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIHMobiAtIDM1NiwgMCwgciAtIDE3OTAsIGUpOyB9IGlmIChhW2UoMTk3MCwgMzIyNCwgMjQ2MCwgMCwgMTkwNildKGFbZSgzODAzLCAyOTI4LCAyNjQwLCAwLCAyMzUwKV0sIGFbcCgoYyA9IC05MTYpIC0gNDYxLCBvID0gMjE3LCBvIC0gLTY5OSwgYyldKSl7IHZhciBmID0gKHZvaWQgMClbUFthW2UoMTg0OSwgMjQ0OSwgMzMxMSwgMCwgMjA1NCldKHosIDIzOSwgMCwgMCwgMCwgMjc5KV0ocSwgNDE4LCA2MDYpXShfZCwgYXJndW1lbnRzKTsgcmV0dXJuICQgPSBudWxsLCBmOyB9IHJldHVybiBhW2koMjIxNiwgMzYxMiwgMjU3NSwgMCwgMjExNyldKGcsIDAsIDAsIDAsIHQsIGFbaSgzMDQ3LCAyMzczLCAzMzcwLCAwLCAzNDgzKV0obiwgLTUyMykpOyB2YXIgYywgbzsgfSBmdW5jdGlvbiB2KG4sIHUsIHIsIHQpeyByZXR1cm4gSih1IC0gMzI2LCB0LCByIC0gMTAyKTsgfSBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSShuIC0gNDgsIDAsIHIgLSAxMTM5LCAwLCBlKTsgfSBmdW5jdGlvbiByKG4sIHUsIHIsIHQsIGUpeyBmdW5jdGlvbiBpKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gdigwLCBuIC0gMTIwNSwgciAtIDEyMSwgZSk7IH0gcmV0dXJuIFFbYygzMzEyIC0gMzI5LCAzODA0LCAwLCAwLCAzMTUzIC0gLTI4MildKFFbaSgyOTg5LCAwLCAzOTA1LCAwLCAyMzQwKV0sIFFbaSgyOTg5LCAwLCAyMzc0LCAwLCAzMDY4KV0pID8gUVtpKDE1MzMsIDAsIDIzNTQsIDAsIDIyNDUpXShVLCBuLCAwLCAwLCAwLCBRW2MoKGYgPSAyNTI2KSAtIDQ3MiwgMjExMiwgMCwgMCwgZiAtIC00OTMpXShlLCAtMTQ2MSkpIDogYVtwKDQ0OTgsIDAsIDI3MTAsIDMwNDApXShuLCBFKTsgdmFyIGY7IH0gdmFyIHQgPSB7IG1HbkhVOiBmdW5jdGlvbiBtR25IVShuLCByLCB0KXsgZnVuY3Rpb24gZShuLCB1KXsgcmV0dXJuIGYobiAtIDM0NiwgMCwgdSAtIC02NTYsIDAsIG4pOyB9IHZhciBpID0geyBpRGppRzogZnVuY3Rpb24gaURqaUcobiwgcil7IHJldHVybiBhW3UoMTQyOCwgOTM4KV0obiwgcik7IH0gfTsgcmV0dXJuIGFbZSgxMTYxLCAxNjU0KV0oYVtlKDI0NjEsIDI4MzgpXSwgYVtlKDY5NSwgMTcyMSldKSA/IFlbYVtlKDI1NTUsIDEyNDEpXShfTCwgNDg1LCAxNDYpXShuLCByLCB0KSA6IGlbZSgxNTAwLCAyMjc2KV0obiwgRSk7IH0sIEN0V2pFOiBmdW5jdGlvbiBDdFdqRShuLCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIHYoMCwgZSAtIDExMzYsIHIgLSAzNjksIHUpOyB9IHZhciBlLCBpID0geyBYUkZoUTogZnVuY3Rpb24gWFJGaFEobiwgciwgdCl7IHJldHVybiBhW3UoMTUzOCwgMjUzNildKG4sIHIsIHQpOyB9IH07IHJldHVybiBhW2YoNTI5LCAwLCAyNDYxLCAwLCA2OTEpXShhW3QoMCwgMjE5NCwgMzgzNCwgMCwgMjUwOSldLCBhW3YoMCwgKGUgPSAxMTU4KSAtIC0yMTUsIGUgLSA0NjMsIDg3NildKSA/IFlbYVt0KDAsIDMyMzYsIDMwODYsIDAsIDIwMzIpXShfTCwgNDg4LCAxNDE0KV0obiwgcikgOiBfTFtpW3QoMCwgMjE0NywgMTI2NSwgMCwgMTE3MCldKEgsIDU5OSwgNTk3KV0oTywgQyk7IH0gfTsgZnVuY3Rpb24gcChuLCB1LCByLCB0KXsgcmV0dXJuIEkobiAtIDI3NCwgMCwgciAtIDU1MywgMCwgdCk7IH0gZnVuY3Rpb24gcyhuLCB1LCByLCB0KXsgcmV0dXJuIHgobiAtIDEyNiwgMCwgdCwgciAtIC0xNzkzKTsgfSBmdW5jdGlvbiBlKG4sIHUsIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIsIHQpeyByZXR1cm4gcChuIC0gMzE5LCAwLCB0IC0gNTcwLCB1KTsgfSByZXR1cm4gYVt2KDAsIDkzMCAtIDk0NiwgKGkgPSAyMTY4KSAtIDIzLCBpKV0oYVtmKChlID0gMjk2NCkgLSAzMjksIDAsIDI2MDkgLSAxNDMsIDAsIGUpXSwgYVt2KDAsIDE0NzQgLSA5LCAzODYgLSA4OCwgMTk3KV0pID8gYVt2KDAsIDg5NiwgNjk5LCAzMzkpXShFLCBfTCwgSCkgOiBhW3QoMjQzMCwgMTkzOCwgMCwgMTgwNSldKGcsIDAsIDAsIDAsIHIsIGFbdCg0MDQzLCA0MjE1LCAwLCAzNDc0KV0odSwgLTk1NykpOyB2YXIgZSwgaTsgfSBpZiAoWVtRW3YoMCwgNzEzLCAtNDQzLCAtMTQwKV0oZSwgMCwgODYsIDE4NyldKFlbUVtjKDI2NzMsIDMyOTMsIDAsIDAsIDIxNTMpXShlLCAwLCAtMTA5LCAtMTk1KV0sIFlbUVtjKDE2MTUsIDEwMDksIDAsIDAsIDE0NTApXShyLCAtMzc5LCAwLCAwLCAwLCAtNDEwKV0pKSByZXR1cm4gdFtRW2MoMTM4NiwgMTk1MywgMCwgMCwgMTcxNCldKHIsIC0yODksIDAsIDAsIDAsIC0yNjApXShCLCB0W1FbYygxMTMzLCAzMTAzLCAwLCAwLCAyMTUzKV0oYiwgMjMwLCAwLCBRW3MoOTQ2LCAwLCAxODIsIDEwNzUpXShRW3YoMCwgMjc3LCAxNDEwLCA5MjApXSgxMTIsIC00MDQpLCA3NDkpKV0oViwgLTEzOSksIGgpOyBpZiAoRCl7IGlmIChRW2MoMTgzMiwgMzczOSwgMCwgMCwgMjYwOSldKFFbYygyNjQ2LCA3NjcsIDAsIDAsIDE4MjYpXSwgUVtwKDIzNTUsIDAsIDE3NDcsIDE4ODMpXSkpeyB2YXIgaSA9IHsgVURQWHE6IGZ1bmN0aW9uIFVEUFhxKG4sIHUpeyByZXR1cm4gYVt2KDAsIChyID0gMjc5MCkgLSAxNDIxLCByIC0gMjIxLCAxNzczKV0obiwgdSk7IHZhciByOyB9IH0sIG8gPSB7IFpPeWFjOiBmdW5jdGlvbiBaT3lhYyhuLCB1LCByKXsgcmV0dXJuIGFbcCgodCA9IC01KSAtIDQzLCAwLCA5NjMgLSAtMzQ4LCB0KV0obiwgdSwgcik7IHZhciB0OyB9LCBYRWJxVTogZnVuY3Rpb24gWEVicVUobiwgdSl7IHJldHVybiBpW2MoMTQzNCwgMTYzNiwgMCwgMCwgMzQ2MCldKG4sIHUpOyB9IH07IHJldHVybiBvW2FbYygyMDM2LCAyMTY4LCAwLCAwLCAyMjgyKV0oSCwgNDkzLCAxMzk2KV0oTywgb1thW2MoMjY1MiwgMTIzMSwgMCwgMCwgMjI4MildKEMsIDU1NCwgMTM4NyldKHQsIC03MDMpLCB3KTsgfSBpZiAoWVtRW2MoMjkxMiwgMTc5NCwgMCwgMCwgMjM4NCldKG4sIDQyNywgMCwgMCwgMzgyKV0oWVtRW3MoLTExNiwgMCwgNzExLCA0NTUpXShuLCA0MzcsIDAsIDAsIDQ4MCldLCBZW1FbYygxNTg2LCAxODcyLCAwLCAwLCAxNzE0KV0oVSwgMTM1NywgMCwgMCwgMCwgMTI0OSldKSl7IGlmIChRW3YoMCwgMTE0NywgNTkyLCAyMjY1KV0oUVtjKDIzNjEsIDIwODUsIDAsIDAsIDIyNjQpXSwgUVtwKDI1NjAsIDAsIDI2MjMsIDIwMzgpXSkpIHJldHVybiBRW3MoLTEzNTksIDAsIC04MiwgLTM0OCldKG4sIEUpOyB2YXIgbCA9IEJbUVtjKDMyODYsIDE0NjksIDAsIDAsIDIxNTMpXShlLCAwLCAtNTAsIDgpXShWLCBhcmd1bWVudHMpOyByZXR1cm4gaCA9IG51bGwsIGw7IH0gcmV0dXJuIGwgPSBEW1FbdigwLCAxMjUsIC01MTUsIC03OTUpXShuLCAzODQsIDAsIDAsIDQ0MyldKEssIGFyZ3VtZW50cyksIEQgPSBudWxsLCBsOyB9IH0gOiBmdW5jdGlvbigpe307IHJldHVybiByID0gITEsIG47IH07IH0oKSwgYyA9IGpbU1tUKC03NjEsIDAsIDAsIDAsIDExMCldKF9MLCA2MTgsIDQ2MyldKG0sIHRoaXMsIGZ1bmN0aW9uKCl7IHZhciBwID0geyBvRUlOdzogZnVuY3Rpb24gb0VJTncobiwgciwgdCwgZSwgaSl7IHJldHVybiBEW3UoNjkyLCAtMzExKV0obiwgciwgdCwgZSwgaSk7IH0sIFlSWXhJOiBmdW5jdGlvbiBZUll4SShuLCByLCB0LCBlLCBpKXsgcmV0dXJuIERbdSgyMDUwLCAxOTI4KV0obiwgciwgdCwgZSwgaSk7IH0sIHl4a3R5OiBmdW5jdGlvbiB5eGt0eShuLCByLCB0LCBlLCBpLCBmKXsgcmV0dXJuIERbdSg4MjIsIDEyMTgpXShuLCByLCB0LCBlLCBpLCBmKTsgfSwgblVsUUo6IGZ1bmN0aW9uIG5VbFFKKG4sIHIsIHQsIGUpeyByZXR1cm4gRFt1KDIxMjQsIDIwMjApXShuLCByLCB0LCBlKTsgfSwgRlJlcGc6IGZ1bmN0aW9uIEZSZXBnKG4sIHIsIHQsIGUsIGkpeyByZXR1cm4gRFt1KDEyMDYsIDE4ODMpXShuLCByLCB0LCBlLCBpKTsgfSwgQm5wVmo6IGZ1bmN0aW9uIEJucFZqKG4sIHIsIHQsIGUpeyByZXR1cm4gRFt1KDE4MzQsIDUzNildKG4sIHIsIHQsIGUpOyB9LCBsUWt5STogZnVuY3Rpb24gbFFreUkobiwgcil7IHJldHVybiBEW3UoMTM5NywgMTYzNildKG4sIHIpOyB9LCBQam9qSzogZnVuY3Rpb24gUGpvaksobiwgcil7IHJldHVybiBEW3UoMjkwOSwgMjg1MSldKG4sIHIpOyB9LCBnRUJjVDogRFtzKC0xMDExLCAwLCA0NTcsIC0yNyldLCBWS1dqVTogRFtLKDIyNTEsIDMzMjAsIDIyNzIpXSwgR1NRSXM6IGZ1bmN0aW9uIEdTUUlzKG4sIHUpeyByZXR1cm4gRFtLKChyID0gMjIwMikgLSAyNTQsIHIgLSAtMzcxLCAxOTg0KV0obiwgdSk7IHZhciByOyB9LCBreVlZcjogZnVuY3Rpb24ga3lZWXIobiwgdSl7IHJldHVybiBEW0soKHIgPSAyNDQwKSAtIDMzOCwgciAtIC0zMjgsIHQgPSAyMzU5KV0obiwgdSk7IHZhciByLCB0OyB9LCBBQVdOQjogRFtzKDEyNzksIDAsIDEwMjYsIDIxNTgpXSwgYlJaSHM6IERbbCgyNDg3LCAwLCAxMjc0KV0sIGprblVtOiBmdW5jdGlvbiBqa25VbShuLCB1LCByLCB0KXsgcmV0dXJuIERbcyhlID0gMzgxNSwgMCwgZSAtIDE3NywgKGkgPSAyODM2KSAtIDExMzcpXShuLCB1LCByLCB0KTsgdmFyIGUsIGk7IH0sIHptV3huOiBmdW5jdGlvbiB6bVd4bihuLCB1KXsgcmV0dXJuIERbcyhyID0gMTM2OCwgMCwgMjk1NCAtIDIyOSwgKHQgPSAxNjk2KSAtIDI2NCldKG4sIHUpOyB2YXIgciwgdDsgfSwgRHVNb2w6IGZ1bmN0aW9uIER1TW9sKG4sIHUsIHIpeyByZXR1cm4gRFtLKC0yNTAgLSAxNjYsIDY1NSAtIC05MzMsIHQgPSAtMzc0KV0obiwgdSwgcik7IHZhciB0OyB9IH07IGZ1bmN0aW9uIG4obiwgciwgdCwgZSl7IGZ1bmN0aW9uIGkobiwgdSwgciwgdCwgZSl7IHJldHVybiBsKGUsIDAsIHIgLSAtMTApOyB9IHZhciBmLCBjID0geyBsenRSYjogZnVuY3Rpb24gbHp0UmIobil7IHJldHVybiBEW3UoMjQ4MSwgMTgzMyldKG4pOyB9IH07IGZ1bmN0aW9uIG8obiwgdSwgciwgdCwgZSl7IHJldHVybiBLKG4gLSAxMDEsIHIgLSAtOTQxLCB1KTsgfSByZXR1cm4gRFtvKDE5NjQsIDMwMzEsIDMwNTIsIDM0MzksIDQyOTYpXShEW28oMjU0MCwgMTAxNSwgMjM1MSwgMTA0MSwgMjUyOSldLCBEW3MoZiA9IDMxMjQsIDAsIDI5OTIgLSA0ODUsIDI1MjUgLSA4NTYpXSkgPyBjW2koMCwgNjc2LCAxNDM1LCAxOTY3LCAxODQ5KV0oUykgOiBEW2woMjA1MywgMCwgLTExOSldKFksIGUsIDAsIDAsIDAsIERbaSgwLCA2NzAsIC01NCwgLTU1NiwgNjU0KV0odCwgMTQxNCkpOyB9IGZ1bmN0aW9uIHMobiwgdSwgciwgdCl7IHJldHVybiBJKG4gLSA0MDgsIHQgLSAtMTIxMywgciAtIDM4NCwgbik7IH0gZnVuY3Rpb24gcihuLCB1LCByLCB0LCBlKXsgZnVuY3Rpb24gaShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEsobiAtIDM1LCBlIC0gLTExMTcsIG4pOyB9IGZ1bmN0aW9uIGYobiwgdSwgciwgdCwgZSl7IHJldHVybiBsKG4sIDAsIHUgLSAxNzg5KTsgfSBmdW5jdGlvbiBjKG4sIHUsIHIpeyByZXR1cm4gcyhyLCAwLCByIC0gNDQ5LCBuIC0gMTM4NCk7IH0gaWYgKERbZig0MTYyLCAzMzcyLCAwLCA0MjU3LCAzNDk0KV0oRFtpKDE5MzQsIDAsIDAsIDE3MDIsIDg1MSldLCBEW2YoMjU5OSwgMTM5MCwgMCwgMTExNSwgNTg4KV0pKSByZXR1cm4gRFtpKDE4NjEsIDAsIDAsIDI2MjgsIDIzNjgpXShZLCByLCAwLCAwLCAwLCBEW0soMTMzMyAtIDE3OCwgMjExMiAtIC0zMTMsIHYgPSAyNzkzKV0oZSwgODU5KSk7IGlmIChxW3BbYygxMjY0LCAwLCAtNzgpXShfZCwgNDI3LCAwLCAwLCAzODIpXSgkW3BbYygxODgyLCAwLCA1ODYpXShoLCA0MzcsIDAsIDAsIDQ4MCldLCBubltwW2woYSA9IDE3MjIsIDAsIDI4NTIgLSA3MjIpXSh1biwgMTM1NywgMCwgMCwgMCwgMTI0OSldKSl7IHZhciBvID0gY25bcFtjKDIzMDYsIDAsIDEzNjApXShYLCAwLCAtNTAsIDgpXSh4LCBhcmd1bWVudHMpOyByZXR1cm4gcSA9IG51bGwsIG87IH0gcmV0dXJuIG8gPSB0bltwW2koNTQzLCAwLCAwLCAxNTg1LCA2NDEpXSgkLCAzODQsIDAsIDAsIDQ0MyldKGVuLCBhcmd1bWVudHMpLCBmbiA9IG51bGwsIG87IHZhciBhLCB2OyB9IGZ1bmN0aW9uIHQobiwgdSwgcil7IHJldHVybiBVKDAsIHIsIDAsIDAsIHUgLSAtMTI4Mik7IH0gZnVuY3Rpb24gZShuLCByLCB0KXsgdmFyIGUgPSB7IHRBbVFjOiBmdW5jdGlvbiB0QW1RYyhuLCByLCB0LCBlKXsgcmV0dXJuIERbdSgyNTUxLCAzMDAzKV0obiwgciwgdCwgZSk7IH0sIHlYWEt4OiBmdW5jdGlvbiB5WFhLeChuLCByKXsgcmV0dXJuIERbdSgyNTQ4LCAxOTIxKV0obiwgcik7IH0gfTsgZnVuY3Rpb24gaShuLCB1LCByLCB0KXsgcmV0dXJuIHModCwgMCwgciAtIDE0LCB1IC0gLTgwKTsgfSBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSyhuIC0gMzk0LCByIC0gLTE0NjYsIG4pOyB9IHJldHVybiBEW2YoMTc5NSwgMCwgMTU0NiwgMjY0OSwgMjIwOSldKERbaSgwLCAxMjUyLCAxMzc1LCAxOTI1KV0sIERbZigyMzE2LCAwLCAxNTQxLCA1MDIsIDExMjcpXSkgPyBlW2YoLTEwMzcsIDAsIDMyLCAyMzgsIDUyNSldKEUsIGVbaSgwLCAtMTkzLCAtMTE5MywgOTI1KV0obywgODQ2KSwgMCwgSCkgOiBEW3MoMjY3MCwgMCwgMjYwOSwgMjI4NCldKFgsIDAsIERbaSgwLCAtMTgsIDI4NSwgLTg3NildKG4sIDM3NyksIHQpOyB9IGZ1bmN0aW9uIGkobiwgdSwgciwgdCl7IGZ1bmN0aW9uIGUobiwgdSwgciwgdCwgZSl7IHJldHVybiBsKHUsIDAsIHQgLSA2MTMpOyB9IGZ1bmN0aW9uIGkobiwgdSwgciwgdCwgZSl7IHJldHVybiBhKHQgLSAtMTg1LCBlKTsgfSBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSyhuIC0gMzksIG4gLSAtMjczLCByKTsgfSByZXR1cm4gcFtpKDAsIDAsIDIyOCwgMTE0NywgOTY5KV0ocFtpKDAsIDAsIC0xODgsIDEwMDUsIDE5MDgpXSwgcFtsKDEyMDYsIDAsIChjID0gMTY0MykgLSAxNDA1KV0pID8gcFtlKDAsIDMwNTQsIDAsIDI3NDMsIDMyNTUpXSh4LCBwW2UoMCwgMjU2MCwgMCwgMTc1NywgMTM5MildKHQsIDM5MCksIDAsIDAsIDAsIHUpIDogb1twW2YoMjY2MCwgMCwgMjU0MCwgMTY0NiwgMzQ1NSldKEgsIDAsIHBbZigyNjUyLCAwLCAyNTkzLCAzMjQwLCAyMDM1KV0oOTI4LCAtMTUwKSwgOTc3KV0oTywgQyk7IHZhciBjOyB9IGZ1bmN0aW9uIG8obiwgdSwgciwgdCwgZSl7IGZ1bmN0aW9uIGkobiwgdSwgciwgdCwgZSl7IHJldHVybiBhKHIgLSA3NzgsIHQpOyB9IGZ1bmN0aW9uIGYobiwgdSwgciwgdCl7IHJldHVybiBzKG4sIDAsIHIgLSA0MzcsIHQgLSAxMDA2KTsgfSByZXR1cm4gcFtpKDAsIDAsIDEzOTAsIDkyNSwgODE5KV0ocFtmKDI1NDgsIDAsIDM1MDQsIDMxOTUpXSwgcFtpKDAsIDAsIDIyNDcsIDkwOCwgMzAzMSldKSA/IHBbYSgxODMxIC0gMjQyLCBjID0gMTMzMCldKFgsIDAsIHBbaSgwLCAwLCAzMjM4LCAyNTg5LCAyNTg3KV0oZSwgMTM5MSksIHQpIDogcFtmKDEzNjUsIDAsIDE4MjYsIDE5MjgpXShFLCAwLCBwW2YoNjYxLCAwLCAyMTIxLCA5MTYpXShlLCAtMjIpLCBIKTsgdmFyIGM7IH0gZnVuY3Rpb24gbChuLCB1LCByKXsgcmV0dXJuIFUoMCwgbiwgMCwgMCwgciAtIC0xMzAzKTsgfSBmdW5jdGlvbiBhKG4sIHUpeyByZXR1cm4gVSgwLCB1LCAwLCAwLCBuIC0gLTY5OSk7IH0gaWYgKGpbRFtsKDExMjksIDAsIDIwMDYpXShpLCAwLCA2NCwgMCwgLTM4KV0oaltEW2woNjYyLCAwLCAyMDA2KV0obiwgMCwgMTE0OSwgMTE0OCwgMTIyMildLCBqW0RbdCgwLCAyMDI3LCAyNjY3KV0oaSwgMCwgMjgsIDAsIC02KV0pKXsgaWYgKERbcygxMTU2LCAwLCAxNTU2LCA2MjApXShEW2EoMjU2MiwgMjE3OCldLCBEW3MoMjgwNSwgMCwgMjA0OSwgMjA2NCldKSl7IHZhciBmID0gW2pbRFtLKDIzNzYsIDI4OTAsIDE2NjIpXShpLCAwLCAtOTgsIDAsIC0zMyldLCBqW0RbbCgtMTgsIDAsIDYxNCldKG4sIDAsIDEzMTksIDEyNjEsIDEyNjQpXSwgaltEW3QoMCwgMjI1MSwgMzEyMSldKG8sIDAsIDAsIDAsIDExMjQsIDEwNDApXSwgaltEW3QoMCwgLTk4LCA2MzIpXShyLCAwLCA3NDEsIDcyOSwgNzM4LCA3NDYpXSwgaltEW0soNTE0OCwgMzgyNywgNDU1OCldKGUsIDQ5LCAwLCA3OSldLCBqW0RbSyg3MDAsIDE4MjgsIDI1MTQpXShpLCAwLCAtODcsIDAsIC01MildLCBqW0RbdCgwLCAzNjMsIDEwMDcpXShuLCAwLCAxMjA3LCAxMTQ1LCAxMTI3KV0sIGpbRFtsKDI4NCwgMCwgOTE1KV0obywgMCwgMCwgMCwgOTA3LCA5MzkpXSwgaltEW2EoMjE5NywgMzI0NyldKGUsIC0yMiwgMCwgLTc1KV0sIGpbRFtsKDU2NCwgMCwgODIwKV0obywgMCwgMCwgMCwgOTEwLCA5NjYpXSwgaltEW2EoODY5LCA5ODUpXShpLCAwLCA4OCwgMCwgNTUpXSwgaltEW2woMjAwMiwgMCwgMTcxNSldKG8sIDAsIDAsIDAsIDg1NywgODg3KV0sIGpbRFt0KDAsIDEzNzIsIDE0MyldKGUsIC0xNTgsIDAsIC02OCldLCBqW0RbbCgyNDE5LCAwLCAyMjI3KV0ociwgMCwgODgxLCA4ODAsIDc5NywgNzY5KV0sIGpbRFtsKDE4NDUsIDAsIDE3MTUpXShyLCAwLCA2OTksIDc5NywgNzI4LCA3NjApXSwgaltEW3QoMCwgMTQwMSwgNDY3KV0obywgMCwgMCwgMCwgMTAyMiwgMTA1MildLCBqW0RbdCgwLCA2MzUsIDUwKV0obiwgMCwgMTM1OCwgMTI0MCwgMTI0MCldLCBqW0RbYSg2NTEsIC00ODMpXShuLCAwLCAxMDUwLCAxMTI0LCAxMjIxKV0sIGpbRFtLKDI3NDksIDQwMTEsIDMzMDYpXShvLCAwLCAwLCAwLCA5OTAsIDkxMCldLCBqW0RbYSgxMjQ1LCAyMTQwKV0obiwgMCwgMTMyNSwgMTI5MywgMTIwOSldLCBqW0RbSyg1MDYwLCAzOTk4LCAzNzk2KV0oZSwgMjEsIDAsIC04NCldLCBqW0RbdCgwLCA2NjEsIDk2MyldKHIsIDAsIDc1OCwgNzY3LCA1NzYsIDY1MildLCBqW0RbdCgwLCAxMTMwLCA5NzApXShuLCAwLCAxMTE2LCAxMjI2LCAxMTkzKV1dOyByZXR1cm4gKG0gPSBmdW5jdGlvbiBtKCl7IGZ1bmN0aW9uIG4obiwgdSwgcil7IHJldHVybiBhKHUgLSAtODQsIHIpOyB9IHJldHVybiBEW24oMCwgMTgyMywgMjEyNSldKERbbigwLCAxNzExLCAyNjA1KV0sIERbbigwLCAxNzExLCAyOTk0KV0pID8gZiA6IHBbcygxOTQ1LCAwLCAyMzQyIC0gMzQyLCAxMzA4IC0gNjY4KV0oRSwgbywgSCk7IH0pKCk7IH0gcmV0dXJuIERbdCgwLCAxNzI1LCAxOTI0KV0oRSwgRFtsKDExOTIsIDAsIDYwOCldKG8sIDM5MCksIDAsIDAsIDAsIEgpOyB9IGZ1bmN0aW9uIEsobiwgdSwgcil7IHJldHVybiBJKG4gLSA0MzAsIHUgLSA0NjIsIHIgLSA0NzksIHIpOyB9IHJldHVybiBjW0RbYSgyMjY1LCAyNjg5KV0oRFtLKDE5NDgsIDIxMDcsIDIzMTQpXShvLCAwLCAwLCAwLCAxMTMxLCAxMDY4KSwgRFt0KDAsIDE1MDMsIDI3NzMpXShyLCAwLCA2NjIsIDgyNCwgNjIwLCA3MTIpKV0oKVtEW2woMTgyMywgMCwgMTY2MSldKERbcyg0MzksIDAsIDY3OSwgMTA3NSldKGUsIDQyLCAwLCA1MSksICJoIildKGpbRFtsKDkyNiwgMCwgLTI0OSldKGksIDAsIC01NywgMCwgLTM0KV0pW0RbYSgyMjY1LCAxNjc1KV0oRFt0KDAsIDk5MCwgNTQxKV0oZSwgNTQsIDAsIDE3MSksIERbYSg3MzcsIC0zMjYpXShvLCAwLCAwLCAwLCAxMDEyLCAxMDEwKSldKClbRFtzKDExMjIsIDAsIDQzMSwgMTY4MyldKERbSygyNDcxLCAzNDQyLCAzNDc1KV0oRFtLKDEyMjAsIDE4MjgsIDE3NzApXShpLCAwLCAtMTYyLCAwLCAtOTgpLCBEW2EoMTk4NCwgMjIyNCldKHIsIDAsIDY5OCwgNzI0LCA2NzQsIDY1OSkpLCAiciIpXShjKVtEW2EoMjE4MSwgMTE5MCldKERbdCgwLCA2OCwgLTI3NyldKGksIDAsIDE0NSwgMCwgODkpLCAiaCIpXShqW0RbSygzNDQ0LCAzMzc0LCAyNTIwKV0oZSwgLTgxLCAwLCAtMTg0KV0pOyB9KTsgZnVuY3Rpb24gVChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGIoZSAtIC0xNjQ2LCAwLCBuKTsgfSBmdW5jdGlvbiBZKG4sIHIsIHQsIGUsIGkpeyBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gVChlLCAwLCAwLCAwLCB0IC0gMjUwKTsgfSB2YXIgYyA9IHsgalNRQnU6IGZ1bmN0aW9uIGpTUUJ1KG4sIHIpeyByZXR1cm4gU1t1KDg4NSwgMjUxKV0obiwgcik7IH0gfTsgZnVuY3Rpb24gbyhuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFEobiAtIDUsIHUgLSAxMDksIGUsIHQgLSAtNzM5KTsgfSBmdW5jdGlvbiBhKG4sIHUsIHIsIHQpeyByZXR1cm4gSShuIC0gNDcwLCB0IC0gMTg2LCByIC0gNDc4LCBuKTsgfSByZXR1cm4gU1tmKDAsIDAsIDAsIDIwMjEsIDIxMTcpXShTW2EoNzA0LCAwLCAxMjQ5LCAxNjgxKV0sIFNbZigwLCAwLCAwLCA1NTYsIDEzNTYpXSkgPyBjW28oMjQxNywgMjA4MSwgMCwgMjM1MSwgMTc2MCldKG4sIEUpIDogU1thKDE0OTQsIDAsIDIyNjYsIDEzNzUpXShfTCwgU1tvKDE3NDgsIDIzNiwgMCwgNDQyLCAyNTgpXShpLCAtNjkxKSwgbik7IH0gcmV0dXJuIGpbU1tVKDAsIDIzMTcsIDAsIDAsIDE4NzgpXShfTCwgNTgzLCAtMTY1KV0oYyksIGpbU1tVKDAsIDEwMzIsIDAsIDAsIDE3NzQpXShfTCwgNTcyLCAtMjc2KV0ocSwgaltTW1UoMCwgMjM3MSwgMCwgMCwgMjkyOSldKF9MLCAzOTksIC0zODgpXShoLCAtODgwKSwgVik7IH0gdmFyIFAgPSBTW2IoMjA1MiwgMCwgMjM2OSldKEMsIHRoaXMsIGZ1bmN0aW9uKCl7IHZhciBLID0geyBIZ0F2dDogZnVuY3Rpb24gSGdBdnQobiwgciwgdCl7IHJldHVybiBTW3UoMjQxOCwgMjQwMSldKG4sIHIsIHQpOyB9LCBYb29zUTogZnVuY3Rpb24gWG9vc1Eobiwgcil7IHJldHVybiBTW3UoMjcyNiwgMjcxOSldKG4sIHIpOyB9LCB6TndiZzogU1tRKDAsIDE5NDYsIDIyNzEsIDMxNTksIDIzNDEpXSwgVGtMR3U6IFNbSSgwLCAwLCAyNDQ1LCAzMTU3LCAzNDk4KV0sIFZYaUV0OiBmdW5jdGlvbiBWWGlFdChuLCB1KXsgcmV0dXJuIFNbUSgwLCByID0gMjcyMCwgKHQgPSAxODgxKSAtIC0xNDYxLCByIC0gNDA5LCB0IC0gNDU2KV0obiwgdSk7IHZhciByLCB0OyB9LCBOR29kbzogZnVuY3Rpb24gTkdvZG8obiwgdSwgcil7IHJldHVybiBTW1EodCA9IDMyNTksIHQsIDI4MzMgLSAtNDAsIDMxMTcgLSAxOSwgMjY5MCAtIDI5MSldKG4sIHUsIHIpOyB2YXIgdDsgfSwgdnZET1I6IGZ1bmN0aW9uIHZ2RE9SKG4sIHUpeyByZXR1cm4gU1tJKHIgPSAzOTIyLCB0ID0gMzY0OSwgciAtIDI3NywgdCwgNDE3NCAtIDEzMSldKG4sIHUpOyB2YXIgciwgdDsgfSwgUVBIYkU6IFNbbCgwLCAyNzYsIDE3OTAsIDgwNiwgMTI4NCldLCBtVUdObDogU1tsKDAsIDIxNTQsIDE0MywgMTM3MiwgMTIxOSldLCBKUEhlZTogZnVuY3Rpb24gSlBIZWUobil7IHJldHVybiBTW1EodSA9IDc5NSwgdSwgKHIgPSAxMTg1KSAtIC05NTUsIHIgLSA3OSwgOTkgLSAyMDcpXShuKTsgdmFyIHUsIHI7IH0sIFJKUUtWOiBmdW5jdGlvbiBSSlFLVihuLCB1KXsgcmV0dXJuIFNbdigociA9IDI1MTIpIC0gMzA0LCAodCA9IDE4NjYpIC0gMjczLCAxMjY0IC0gODYsIHQgLSAxMTU3LCByKV0obiwgdSk7IHZhciByLCB0OyB9LCBnZVVlZjogZnVuY3Rpb24gZ2VVZWYobiwgdSl7IHJldHVybiBTW1EoMCwgMjk2NCwgKHIgPSAyNDgxKSAtIC04MzYsIHIgLSA0NDgsIDIwNzMgLSAzMjgpXShuLCB1KTsgdmFyIHI7IH0sIHpMVm52OiBTW0koMCwgMCwgMTQyNiwgMTg2NCwgOTApXSwgSkNoZ2U6IGZ1bmN0aW9uIEpDaGdlKG4sIHUpeyByZXR1cm4gU1tRKDAsIDQxOTEsIDM2NDIsIDI4MjksIDE5ODgpXShuLCB1KTsgfSwgUXJyQ086IGZ1bmN0aW9uIFFyckNPKG4sIHUpeyByZXR1cm4gU1tsKDAsIHIgPSA0MjIsIC0xNjQxIC0gMjc2LCByIC0gOTEsIC00ODYgLSAtMTE4NyldKG4sIHUpOyB2YXIgcjsgfSwgTEt3eWI6IGZ1bmN0aW9uIExLd3liKG4sIHUpeyByZXR1cm4gU1t2KChyID0gNDY2KSAtIDE2LCAyMjk0IC0gNDQwLCAyNTcyIC0gMTQyLCAxMzczIC0gMTA5OSwgcildKG4sIHUpOyB2YXIgcjsgfSwgbXlKdlg6IGZ1bmN0aW9uIG15SnZYKG4sIHUsIHIpeyByZXR1cm4gU1tJKDAsIDAsICh0ID0gMjczNykgLSAtMjAsIDMzNjcsIHQgLSAyNjUpXShuLCB1LCByKTsgdmFyIHQ7IH0sIEtJU0lzOiBmdW5jdGlvbiBLSVNJcyhuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIFNbVSgzNzc3LCAoZiA9IDMwMzApIC0gNDU5LCAyMjIwIC0gMjc5LCBmIC0gMTQyMCldKG4sIHUsIHIsIHQsIGUsIGkpOyB2YXIgZjsgfSwgc0lQcmo6IFNbVSgtNzk1LCA5MzgsIDQwNSwgNTI1KV0sIGFSY0ZROiBTW2woMCwgMzM1OCwgMmUzLCA0MDA0LCAzMTUzKV0sIHNLc1duOiBmdW5jdGlvbiBzS3NXbihuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIFNbSSgwLCAwLCAxODM1IC0gLTEwMDQsIGYgPSAxNDkwLCBmIC0gMTApXShuLCB1LCByLCB0LCBlLCBpKTsgdmFyIGY7IH0sIFNNQmhCOiBmdW5jdGlvbiBTTUJoQihuLCB1KXsgcmV0dXJuIFNbbCgwLCByID0gMzEwMSwgciAtIDI1NSwgKHQgPSAzMzUyKSAtIDI2MywgdCAtIDMyMCldKG4sIHUpOyB2YXIgciwgdDsgfSwgZUtFek46IFNbbCgwLCAyNDk0LCA0ODIsIDU1NiwgMTgxMSldLCBsZmx5WTogZnVuY3Rpb24gbGZseVkobiwgdSl7IHJldHVybiBTW1UociA9IDI2MzQsIHIgLSAyNjgsICh0ID0gMjAyNCkgLSAyMTYsIHQgLSAxNTcyKV0obiwgdSk7IHZhciByLCB0OyB9LCBFQ0N3WTogU1tJKDAsIDAsIDMxNDYsIDQwNTIsIDE5NzgpXSwgSWpWTEU6IFNbdSgyOTU0LCAyNzkyKV0sIFBDZ3ZLOiBmdW5jdGlvbiBQQ2d2SyhuLCB1KXsgcmV0dXJuIFNbdigociA9IC02NjIpIC0gMTE1LCAodCA9IDU3OCkgLSA2OCwgMTIyNyAtIDMwNCwgdCAtIDI0MywgcildKG4sIHUpOyB2YXIgciwgdDsgfSwga2RZRFc6IGZ1bmN0aW9uIGtkWURXKG4sIHUpeyByZXR1cm4gU1t2KDE1MDcgLSAzODIsIChyID0gLTM3NSkgLSAxNjUsIC0xNjkgLSAzMDAsIDI5NiAtIC0zNjQsIHIpXShuLCB1KTsgdmFyIHI7IH0sIE1Za0d3OiBTW2woMCwgMjY3NiwgMzExOCwgMjA2NiwgMjM3NildLCBDd3ZuZTogU1tJKDAsIDAsIDE1MzMsIDEyMzgsIDExNTQpXSwgUHV1YmU6IGZ1bmN0aW9uIFB1dWJlKG4sIHUsIHIpeyByZXR1cm4gU1tsKDAsIHQgPSAxNjkxLCAyIC0gMjQyLCB0IC0gODUsIDEwOTkgLSAtMjQzKV0obiwgdSwgcik7IHZhciB0OyB9LCBYa1liaDogZnVuY3Rpb24gWGtZYmgobiwgdSwgciwgdCl7IHJldHVybiBTW0koMCwgMCwgMjQxNCAtIC0xMjc0LCBlID0gMTIyNSwgZSAtIDYyKV0obiwgdSwgciwgdCk7IHZhciBlOyB9LCBJVEN6SzogU1tRKDAsIDIwMzgsIDMxMjAsIDM2MTAsIDIwNzkpXSwgVnFXa286IGZ1bmN0aW9uIFZxV2tvKG4sIHUpeyByZXR1cm4gU1tJKDAsIHIgPSAxMjk5LCA4ODkgLSAtMTA2NywgciwgLTEzMyAtIDMyMildKG4sIHUpOyB2YXIgcjsgfSwga3lYc0Q6IFNbUSgwLCA5NDEsIDIyMjEsIDI1OTMsIDMyOTUpXSwgaUtqUUU6IFNbbCgwLCAyMTk5LCA0MTE1LCAyNzYwLCAzMjg4KV0sIEdGTFFmOiBmdW5jdGlvbiBHRkxRZihuLCB1KXsgcmV0dXJuIFNbSSgwLCAwLCAociA9IDU2KSAtIC0xMTk5LCAtODksIHIgLSAyNDcpXShuLCB1KTsgdmFyIHI7IH0sIHpLeVB1OiBmdW5jdGlvbiB6S3lQdShuLCB1KXsgcmV0dXJuIFNbVSgxNDcsIChyID0gMTQxMSkgLSAxMjUsIDE4NzcgLSA0MTgsIHIgLSAxNjM5KV0obiwgdSk7IHZhciByOyB9LCBPZmdtdTogU1tRKDAsIDUxNiwgMTMzMiwgMzYsIDEyODcpXSwgWkRoQWY6IFNbdSgxMDU0LCAxOTYzKV0sIGRLcG92OiBmdW5jdGlvbiBkS3BvdihuLCB1LCByKXsgcmV0dXJuIFNbSSh0ID0gMTA1MSwgMCwgMTQ1MCAtIC01NjcsIHQsIDIyMDggLSAxMjYpXShuLCB1LCByKTsgdmFyIHQ7IH0sIHhJZ2hLOiBmdW5jdGlvbiB4SWdoSyhuLCB1KXsgcmV0dXJuIFNbUSgwLCByID0gMjM4OSwgKHQgPSAyMjYyKSAtIDIzOCwgciAtIDI1NSwgdCAtIDE0KV0obiwgdSk7IHZhciByLCB0OyB9LCBDZU9ndzogZnVuY3Rpb24gQ2VPZ3cobiwgdSl7IHJldHVybiBTW2wociA9IDI3MDAsIHQgPSAyMzA0LCB0IC0gMTcwLCAyODE5IC0gMjEyLCByIC0gLTE1MildKG4sIHUpOyB2YXIgciwgdDsgfSwgUHZ3enc6IFNbdSgyODUxLCAzNjIwKV0sIHZMZ2hSOiBTW1EoMCwgMjUwNCwgMjYzNSwgMjg3NCwgMTg5NildLCB2Vm94azogZnVuY3Rpb24gdlZveGsobiwgdSl7IHJldHVybiBTW1EociA9IDIxMDEsIHQgPSAyNjM5LCByIC0gMjA4LCA5NDEgLSA3NSwgdCAtIDI1KV0obiwgdSk7IHZhciByLCB0OyB9LCBRUExhdTogZnVuY3Rpb24gUVBMYXUobiwgdSl7IHJldHVybiBTW1EoMCwgMjU1NSwgMzU3MCwgMzEzNiwgNDcwOCldKG4sIHUpOyB9LCBSRkVJeTogU1t1KDI2MTYsIDEwMjMpXSwgeGhlZE86IFNbSSgwLCAwLCAzMTIxLCAzNjA0LCAzMTg3KV0sIEhHelBzOiBmdW5jdGlvbiBIR3pQcyhuLCB1KXsgcmV0dXJuIFNbUSgwLCByID0gMjY2OSwgMjY3MSAtIDM3OCwgciAtIDI4OCwgMTgxMCAtIDQ5NyldKG4sIHUpOyB2YXIgcjsgfSwgb2lTbEY6IFNbSSgwLCAwLCAxODk1LCAxNTYxLCAxMDI1KV0sIEJ2UkZMOiBmdW5jdGlvbiBCdlJGTChuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIFNbbChmID0gNjkzLCBjID0gMTUzNSwgODkgLSA0OTUsIGMgLSAxMzAsIGYgLSAtNjUxKV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmLCBjOyB9LCBLZlZpRDogZnVuY3Rpb24gS2ZWaUQobiwgdSl7IHJldHVybiBTW1UoMTUzNiwgKHIgPSAyNjIxKSAtIDE4NCwgMTc2NSAtIDQxOCwgciAtIDEzNTYpXShuLCB1KTsgdmFyIHI7IH0sIFZ0bEZWOiBmdW5jdGlvbiBWdGxGVihuLCB1KXsgcmV0dXJuIFNbSSgwLCByID0gMjYzOSwgciAtIC0xMDA3LCAxOTI2LCAzOTM1IC0gMzAxKV0obiwgdSk7IHZhciByOyB9IH0sIEQgPSB7IGpMcEh1OiBmdW5jdGlvbiBqTHBIdShuLCByKXsgdmFyIHQsIGUgPSB7IEhNWGR2OiBmdW5jdGlvbiBITVhkdihuLCByLCB0KXsgcmV0dXJuIEtbdSgxNTczLCAyMjEzKV0obiwgciwgdCk7IH0gfTsgZnVuY3Rpb24gaShuLCB1LCByLCB0KXsgcmV0dXJuIHYobiAtIDQ0MywgdSAtIDM3NiwgciAtIDYwLCB0IC0gLTM0Mywgbik7IH0gZnVuY3Rpb24gZihuLCB1LCByLCB0KXsgcmV0dXJuIGwoMCwgciwgciAtIDE4MCwgdCAtIDE4OSwgbiAtIC0xMDg1KTsgfSByZXR1cm4gS1tpKDI0NzgsIDIyNywgMTM2MCwgMTUxOSldKEtbZigxODUxLCAwLCAyMDU5LCAyMjI5KV0sIEtbZig3OTcsIDAsIDE2MjksIDEzMzgpXSkgPyBLW2koMjkzMiwgMjg2OCwgMjE0NCwgMTYxNCldKG4sIHIpIDogZVtRKDAsIHQgPSAxNDYwLCAyNTQyIC0gLTkxLCAzODExIC0gMzcsIHQgLSAzMTcpXShFLCBfTCwgSCk7IH0sIGtXSHFHOiBTW3UoMTk5MiwgMTQ5NCldKF9MLCA0NTksIDc3NSksIGdacVZ1OiBTW3UoMjg3MCwgMzU1MCldKF9MLCA0OTQsIDY3MiksIHJTTmJuOiBmdW5jdGlvbiByU05ibihuLCByLCB0KXsgZnVuY3Rpb24gZShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGwoMCwgZSwgciAtIDE3OSwgdCAtIDI4OSwgdSAtIDIzNik7IH0gdmFyIGkgPSB7IGdIYlZUOiBmdW5jdGlvbiBnSGJWVChuLCByLCB0KXsgcmV0dXJuIEtbdSgxNzE5LCAtMjA1KV0obiwgciwgdCk7IH0gfTsgZnVuY3Rpb24gZihuLCB1LCByLCB0KXsgcmV0dXJuIGwoMCwgbiwgciAtIDExMiwgdCAtIDM0OCwgdSAtIC00MTIpOyB9IHJldHVybiBLW2UoMzkzMSwgMzIwMSwgMjQ1MSwgMjc4NCwgMzU3NyldKEtbZSgyMDMwLCAxMzI5LCA5NzQsIDIzNTMsIDEwNTEpXSwgS1tmKDQxMjQsIDI4NTAsIDMzMTEsIDQwNjEpXSkgPyBpW2YoNDcsIDExNDMsIDEyMDksIDI0KV0oRSwgX0wsIEgpIDogS1tmKDE1NTAsIDE0OTksIDg3NCwgMTQ4MSldKG4sIHIsIHQpOyB9LCBSTkpUaTogZnVuY3Rpb24gUk5KVGkobiwgdSl7IGZ1bmN0aW9uIHIobiwgdSwgciwgdCwgZSl7IHJldHVybiBVKHIsIHUgLSAyODgsIHIgLSAxMTcsIGUgLSAtMjEwKTsgfSBmdW5jdGlvbiB0KG4sIHUsIHIsIHQpeyByZXR1cm4gdihuIC0gMjI2LCB1IC0gMTU0LCByIC0gMTc2LCB1IC0gMzE4LCB0KTsgfSByZXR1cm4gU1tVKGUgPSAxMjM5LCAxMDg0IC0gNCwgZSAtIDE1MCwgMjI2NyAtIDE3OCldKFNbdCgzMTk3LCAyNjg3LCAzNjQ2LCAyMDMzKV0sIFNbdCgxNzQyLCAxMjU4LCAyMzA0LCAxMjk3KV0pID8gS1tyKDAsIDE0MTksIDExMSwgMCwgMTQ1NCldKFMpIDogU1tyKDAsIDE3MTIsIC0zOCwgMCwgMzk3KV0obiwgdSk7IHZhciBlOyB9LCBOSXlzUTogZnVuY3Rpb24gTkl5c1EobiwgdSwgcil7IGZ1bmN0aW9uIHQobiwgdSwgciwgdCwgZSl7IHJldHVybiBRKDAsIHQsIHIgLSAtMzAwLCB0IC0gNTIsIGUgLSA5Mik7IH0gcmV0dXJuIFNbdCgyNDUzLCAwLCAxNzgyLCA5NDUsIDg0OCldKFNbdCgxMDQ0LCAwLCAxNzAxLCA1NzksIDE4NDApXSwgU1t0KDE1MDgsIDAsIDE5NjIsIDIxMTUsIDI1NzYpXSkgPyBTW3QoODI3LCAwLCAyMDk0LCAzMzMyLCAxMzAyKV0obiwgdSwgcikgOiBLW3YoMzA3OSAtIDIyMSwgMjU1NSAtIDgsIChpID0gMjA3MSkgLSAxMCwgMjM5OCAtIDEwNzksIGkpXShFLCBfTCwgS1tsKDAsIDgyMiwgLTg5NSAtIDQ3OCwgKGUgPSA1MikgLSAyNjcsIGUgLSAtODU5KV0oSCwgLTE0MjMpKTsgdmFyIGUsIGk7IH0sIHR3clpjOiBmdW5jdGlvbiB0d3JaYyhuLCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEkoMCwgMCwgciAtIC02MDMsIG4sIGUgLSA3Mik7IH0gZnVuY3Rpb24gZShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGwoMCwgbiwgciAtIDExNSwgdCAtIDM0LCBlIC0gNik7IH0gdmFyIGksIGYsIGMgPSB7IExzcWRLOiBmdW5jdGlvbiBMc3FkSyhuLCByLCB0KXsgcmV0dXJuIFNbdSgxNzkxLCAzNDk2KV0obiwgciwgdCk7IH0gfTsgcmV0dXJuIFNbdCg4MjAsIDgzNCwgMTYwOSwgMCwgMjI1OSldKFNbZSgzMTQyLCAwLCAyMDg3LCAxMTgyLCAyMTMyKV0sIFNbbChpID0gMjk5MSwgaSwgKyhmID0gMTc4NyksIDIyNDAgLSAzODgsIGYgLSAtMzM5KV0pID8gU1t0KC0yMTYsIDExNDYsIDk1NSwgMCwgMTM1MCldKG4sIHIpIDogY1tlKDMxOTYsIDAsIDIyMzAsIDMwNTcsIDI1NjUpXShFLCBfTCwgSCk7IH0sIG52WlVROiBmdW5jdGlvbiBudlpVUShuLCB1LCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEkoMCwgMCwgZSAtIC0xMjA3LCB1LCBlIC0gMzQpOyB9IGZ1bmN0aW9uIGUobiwgdSwgciwgdCwgZSl7IHJldHVybiBJKDAsIDAsIHUgLSAtMTUwMywgbiwgZSAtIDY2KTsgfSBmdW5jdGlvbiBpKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gUSgwLCB1LCB0IC0gLTc1OSwgdCAtIDQ5NywgZSAtIDMyMyk7IH0gZnVuY3Rpb24gZihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFUociwgdSAtIDI0NCwgciAtIDQ0NSwgZSAtIDE3MDcpOyB9IGlmIChTW3QoMjcyMywgMjQ4NywgMCwgMCwgMjE0NildKFNbdCgtMTYxLCAxNzA1LCAwLCAwLCA1NDYpXSwgU1tlKDk1NSwgMjAsIDAsIDAsIDExNTkpXSkpIHJldHVybiBTW2YoMCwgNDc2NiwgNDAyOSwgMCwgMzgwNCldKG4sIHUsIHIpOyB2YXIgciA9IFBbdCg4MzYsIDE5NzMsIDAsIDAsIDEyMTApICsgInQiXSh6KSwgYyA9IHFbZigwLCAxNDIyLCAxODczLCAwLCAyNDgxKSArICJPZiJdKHIpOyBpZiAoS1tpKDIyNDcsIDI2ODUsIDAsIDIxMzksIDIxMzgpXShjLCAtMSkpIGZvciAodmFyIG8gPSBLW2YoMCwgMTUyMSwgMjQ3MSwgMCwgMjQ3MildW2YoMCwgMTI2NiwgMjMzNywgMCwgMjM4OSldKCJ8IiksIGEgPSAwOzspeyBzd2l0Y2ggKG9bYSsrXSl7IGNhc2UgIjAiOiBxICs9IHA7IGNvbnRpbnVlOyBjYXNlICIxIjogdmFyIHYgPSBmbltmKDAsIDI0NjIsIDE5MjAsIDAsIDI0ODEpICsgIk9mIl0obCk7IGNvbnRpbnVlOyBjYXNlICIyIjogdmFyIHAgPSBEW2koNzAzLCA3ODUsIDAsIDE1ODMsIDE0MjcpICsgInQiXShzKTsgY29udGludWU7IGNhc2UgIjMiOiB2YXIgcyA9IEtbaSgyNjgzLCAyNjAzLCAwLCAyNTQzLCAzMzUxKV0oS1tpKDk0MywgMTk0NiwgMCwgNzE5LCAxODMpXShLW3QoNTU3LCA3MzIsIDAsIDAsIDEyNjQpXShjLCB2KSwgY25bdCgtMTAwLCA1NzgsIDAsIDAsIDI4OSkgKyAiaCJdKSwgSlt0KDMwMSwgNjIyLCAwLCAwLCAyODkpICsgImgiXSk7IGNvbnRpbnVlOyBjYXNlICI0IjogdmFyIGwgPSB0bltlKDQ3NiwgOTE0LCAwLCAwLCAxNjM4KSArICJ0Il0oS1t0KDEzOTQsIDI5ODksIDAsIDAsIDIxNzApXSgkLCBlbltpKDExNTEsIDEwMzQsIDAsIDY2MiwgOTE3KSArICJoIl0pKTsgY29udGludWU7IH0gYnJlYWs7IH0gZWxzZSB1ICs9IHI7IH0sIHVuZldUOiBmdW5jdGlvbiB1bmZXVChuLCB1LCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFEoMCwgdSwgdCAtIDMzLCB0IC0gNjgsIGUgLSAxOSk7IH0gcmV0dXJuIFNbdCg5MjgsIDI1MzMsIDAsIDIwODQsIDMzMjIpXShTW3QoMjA1MSwgMjk0OSwgMCwgMzE5OCwgNDQ5MSldLCBTW1UoZSA9IDE3MzEsIDEzMjcgLSA0MTAsIGUgLSA2OSwgMjMxMCAtIDEzMjIpXSkgPyBTW3QoMjM0NSwgMzA1MCwgMCwgMTc1NiwgMTQzMyldKG4sIHUsIHIpIDogUzsgdmFyIGU7IH0sIFJRc3FvOiBmdW5jdGlvbiBSUXNxbyhuLCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFUobiwgdSAtIDEzNSwgciAtIDEyOSwgdSAtIDk3KTsgfSB2YXIgZSwgaSwgZiwgYywgbywgYSA9IHsgR1Fnb1o6IGZ1bmN0aW9uIEdRZ29aKG4sIHIsIHQpeyByZXR1cm4gU1t1KDc3NCwgNDUxKV0obiwgciwgdCk7IH0gfTsgcmV0dXJuIFNbUSgwLCBvID0gMTQ3NSwgMjQzNCAtIC01MDAsIG8gLSAxOTQsIDEzNzkgLSAxODMpXShTW3QoMzY3LCAzNTYsIC05MzQsIDAsIDc0MSldLCBTW3QoMjc4NywgMTQ0NCwgODQyLCAwLCAxNjQzKV0pID8gSFthW0koZiA9IDE5NDAsIGMgPSAyNDU4LCBjIC0gLTg2NiwgZiwgMTkzNiAtIDI1NyldKE8sIDU0MywgMTI0MyldKEMsIHAsIHcpIDogU1tsKGUgPSAyNDE4LCBlLCAoaSA9IDI2MjApIC0gMzM5LCAxOTg5IC0gMTQsIGkgLSA3NjApXShuLCByKTsgfSwgR01qRFo6IGZ1bmN0aW9uIEdNakRaKG4sIHUsIHIsIHQpeyBmdW5jdGlvbiBlKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSSgwLCAwLCB0IC0gLTEwNywgdSwgZSAtIDIyMik7IH0gcmV0dXJuIFNbbCgwLCAxOTk3LCA1MzUsIDE2MSwgNzk4KV0oU1tsKGYgPSAxNjY3LCBmLCAoYyA9IDI4MjUpIC0gMzk3LCAyODQ4IC0gNDI5LCBjIC0gMjk2KV0sIFNbZSgyNTY2LCAyMDgyLCAwLCAyMzA0LCAxMzQxKV0pID8gU1tlKDIxMTYsIDIzOCwgMCwgMTA4MSwgOTM4KV0obiwgdSwgciwgdCkgOiBfTFtLW3YoKGkgPSA2MTUpIC0gNjEsIC05NyAtIDExMiwgMTAxNSAtIDE4LCBpIC0gLTQ2OSwgMTA0NyldKEgsIDQ1MSwgOTI2KV0oTywgQyk7IHZhciBpLCBmLCBjOyB9LCBhZ3pCTzogZnVuY3Rpb24gYWd6Qk8obiwgdSl7IGZ1bmN0aW9uIHIobiwgdSwgciwgdCwgZSl7IHJldHVybiBVKHIsIHUgLSAyNDUsIHIgLSAyNDMsIG4gLSAtMjE1KTsgfSByZXR1cm4gS1tyKDE0MzQsIDI3NjMsIDU0OSwgMCwgMjMwNildKEtbcigyNDMsIDc0MCwgLTQzOSwgMCwgLTc3NCldLCBLW0koaSA9IDk3MCwgMCwgMTE4OCAtIC0xNDgyLCBpLCAyMDkyIC0gMzE5KV0pID8gS1tyKDE0LCA0MDAsIC01OTUsIDAsIDQ5NyldKG4sIHUpIDogS1tVKDI1OTcsIChlID0gMjAwMSkgLSA1MCwgNzU2IC0gNzYsIGUgLSAtMTAxKV0oRSwgMCwgS1t2KDE2NDQgLSAzMjcsIDIyNzAgLSAyNzQsICh0ID0gLTEyKSAtIDU2LCAxMjgxIC0gODE2LCB0KV0oX0wsIC0xMjgwKSwgMCwgMCwgSCk7IHZhciB0LCBlLCBpOyB9LCBjWVVITzogZnVuY3Rpb24gY1lVSE8obiwgdSwgcil7IGZ1bmN0aW9uIHQobiwgdSwgciwgdCwgZSl7IHJldHVybiBJKDAsIDAsIHQgLSAtOTA1LCByLCBlIC0gMjkwKTsgfSBmdW5jdGlvbiBlKG4sIHUsIHIsIHQpeyByZXR1cm4gbCgwLCBuLCByIC0gMzMzLCB0IC0gNDA1LCByIC0gLTYzOCk7IH0gcmV0dXJuIEtbdCgxNTIxLCAxNjc2LCAxMjEzLCAyMDY4LCAxNDY1KV0oS1t0KDEzMjUsIDM3MzIsIDE5MzksIDI1MzksIDE3ODYpXSwgS1tlKDEzMjAsIDAsIDIzOTgsIDE5MzcpXSkgPyBLW0koMCwgZiA9IDI5NTEsIDM0MjUgLSAtMzA5LCBmLCA0Mzc3IC0gNDQpXShFLCAwLCBfTCwgMCwgMCwgS1tJKGkgPSAzOTcsIDAsIGkgLSAtMTExMiwgMTMyOCwgOTcgLSAzNTEpXShILCAxNjIpKSA6IEtbZSgyMDA4LCAwLCAxMjczLCAzOTYpXShuLCB1LCByKTsgdmFyIGksIGY7IH0sIE5xU2RZOiBmdW5jdGlvbiBOcVNkWShuLCB1KXsgZnVuY3Rpb24gcihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFUobiwgdSAtIDUsIHIgLSAxNTksIGUgLSAxNDIwKTsgfSByZXR1cm4gS1tyKDI2MTgsIDE2OTksIDIzMTEsIDAsIDE1MzEpXShLW3IoMjkzOSwgMzk0MywgMzk4MywgMCwgMjg2NildLCBLW3IoMjQxMywgMzA0NSwgNzkyLCAwLCAyMDg0KV0pID8gS1t2KDIxOTggLSA0NTAsIChmID0gMjA5NikgLSAzNjAsIDE1NzggLSAzMCwgMjg2NiAtIDMyOSwgZildKG4sIHUpIDogS1tsKDAsIGkgPSAzNjIwLCBpIC0gMzkxLCA0MTc4IC0gMjUsIDMzODggLSAzNzApXShFLCAwLCAwLCAwLCBLW2wodCA9IDE4OTEsIHQsIDI1NjcgLSA5MiwgKGUgPSAyMTQ5KSAtIDQ3MiwgZSAtIDg2KV0oX0wsIDgwNyksIEgpOyB2YXIgdCwgZSwgaSwgZjsgfSwgd0t2S0E6IGZ1bmN0aW9uIHdLdktBKG4sIHIsIHQpeyBmdW5jdGlvbiBlKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSSgwLCAwLCBlIC0gOTcsIHUsIGUgLSAzNTApOyB9IHZhciBpLCBmLCBjLCBvLCBhID0geyB1RnNRdzogZnVuY3Rpb24gdUZzUXcobiwgciwgdCl7IHJldHVybiBLW3UoMTU3MywgMzIxMildKG4sIHIsIHQpOyB9LCBLUHR0UzogZnVuY3Rpb24gS1B0dFMobiwgcil7IHJldHVybiBLW3UoMTg3MSwgMTE2MCldKG4sIHIpOyB9IH07IHJldHVybiBLW2UoOTU4LCA0NTMsIDAsIDAsIDE3MzUpXShLW2UoMTk3NywgMTI5NywgMCwgMCwgMjIzNCldLCBLW2UoMjU4NiwgMTkxNCwgMCwgMCwgMjQ3NSldKSA/IEtbZSgyNTUzLCAyNjg3LCAwLCAwLCAzMjQ0KV0obiwgciwgdCkgOiBhW3YoKGMgPSAyMTIwKSAtIDQ3MiwgKG8gPSAyMjEyKSAtIDEzOSwgMjEwMSAtIDIzNCwgbyAtIDEwNzksIGMpXShFLCBhW0koaSA9IDUzOCwgZiA9IDE0NzYsIGkgLSAtMTU0NywgZiwgODMxIC0gMjU4KV0oX0wsIC04MzIpLCBIKTsgfSwgV1hZRWk6IGZ1bmN0aW9uIFdYWUVpKG4sIHUsIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gVSh1LCB1IC0gMzg3LCByIC0gMTAsIHQgLSA1MDYpOyB9IHJldHVybiBTW3QoMCwgMzQxNCwgMzA3MSwgMjEyMCwgMjk5OSldKFNbdCgwLCAyNzg4LCAxNDY3LCAyMDA0LCAxNzQxKV0sIFNbbChvID0gMzIyNywgbywgMjU5NiAtIDQwMywgMTk0MSAtIDI4NCwgMjcyNSAtIDU3NSldKSA/IEtbSShmID0gMjAzNCwgMCwgKGMgPSAyMTQxKSAtIDM2MCwgZiwgYyAtIDM3NyldKF9MLCBILCBPLCBDKSA6IFNbSShlID0gMjkzNCwgaSA9IDMyMjMsIGkgLSAtMjk5LCBlLCAyMjA5IC0gNzQpXShuLCB1LCByKTsgdmFyIGUsIGksIGYsIGMsIG87IH0sIHVKQ29YOiBmdW5jdGlvbiB1SkNvWChuLCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEkoMCwgMCwgciAtIC0yNDYsIHUsIGUgLSAxNTIpOyB9IHZhciBlID0geyBPZFNLdDogZnVuY3Rpb24gT2RTS3QobiwgciwgdCwgZSl7IHJldHVybiBLW3UoMTE4MSwgMTM4NSldKG4sIHIsIHQsIGUpOyB9IH07IGlmIChLW3YoKG8gPSAyOTQwKSAtIDMzMiwgKGEgPSAzMjQxKSAtIDMxNSwgMTgxMSAtIDQ5MSwgbyAtIDQyMSwgYSldKEtbdigoZiA9IDM4MCkgLSA0NDYsIChjID0gODQ2KSAtIDMwNywgMjU1IC0gMSwgZiAtIC0yMzksIGMpXSwgS1t0KDIwNzAsIDY1OCwgMTIyNywgMCwgMTY2MCldKSkgcmV0dXJuIEtbdCgyNTA5LCAyMDUxLCAxNDM5LCAwLCAxMTI5KV0obiwgcik7IHZhciBpLCBmLCBjLCBvLCBhLCBlID0gX0xbZVtsKGkgPSAyMDAxLCBpLCAyMTQxIC0gNDM4LCAxNjA4IC0gMzYyLCAxNjI5IC0gNTAyKV0oSCwgMCwgLTUwLCA4KV0oTywgYXJndW1lbnRzKTsgcmV0dXJuIEMgPSBudWxsLCBlOyB9LCBUTlRSQTogZnVuY3Rpb24gVE5UUkEobiwgcil7IHZhciB0LCBlLCBpLCBmID0geyB1c3JUUzogZnVuY3Rpb24gdXNyVFMobiwgcil7IHJldHVybiBLW3UoMTA4NSwgMjg4KV0obiwgcik7IH0gfTsgZnVuY3Rpb24gYyhuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFEoMCwgZSwgdCAtIDQ1MSwgdCAtIDI2NSwgZSAtIDExMik7IH0gcmV0dXJuIEtbSShlID0gMjcyOCwgaSA9IDM1NDAsIGkgLSAxNjcsIGUsIDI4MDIgLSAzMTApXShLW2MoMTU0OCwgMCwgMCwgMjI0MiwgMzQ1MCldLCBLW2MoMjA2NywgMCwgMCwgMjI0OSwgMTA3MyldKSA/IGZbVSgxNjUwLCAxMjgwIC0gMTgxLCAodCA9IDE5MzQpIC0gNTcsIHQgLSAtNDYpXShuLCBFKSA6IEtbYyg1MDIyLCAwLCAwLCAzNzY3LCAzMDM4KV0obiwgcik7IH0sIHV4Y1FjOiBmdW5jdGlvbiB1eGNRYyhuLCB1LCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEkoMCwgMCwgZSAtIC0xNTEyLCByLCBlIC0gMzE2KTsgfSBmdW5jdGlvbiBlKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbCgwLCB0LCByIC0gMTI2LCB0IC0gNjQsIGUgLSAtOTQyKTsgfSByZXR1cm4gS1t0KDg5LCAtNDUzLCA3MTAsIDAsIDIwOSldKEtbdCgxMzI3LCAxOTE4LCAxNzM1LCAwLCAxNDMwKV0sIEtbVShjID0gMTI2NSwgMTcwOCAtIDQ2MSwgKGYgPSAxOTExKSAtIDI0NSwgZiAtIDE2ODQpXSkgPyBLW1UoMTE5NCwgMTI4OSAtIDM3MiwgMjgxMCAtIDIyOSwgKGkgPSAxNzE2KSAtIDExMDIpXShFLCBLW2UoMTY4NywgMCwgMjgzNiwgMzQwLCAxNjU4KV0oX0wsIC05NTUpLCBIKSA6IEtbZSg3NTYsIDAsIDIwOTcsIDI3MzUsIDE3ODYpXShuLCB1LCByKTsgdmFyIGksIGYsIGM7IH0sIHRLcEtlOiBmdW5jdGlvbiB0S3BLZShuLCB1KXsgZnVuY3Rpb24gcihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEkoMCwgMCwgciAtIC0xMTczLCB1LCBlIC0gMzk1KTsgfSByZXR1cm4gU1tRKDAsIGYgPSAtMzYsIDI0MSAtIC0xMjk1LCBmIC0gMjUyLCA0NDAgLSA4MSldKFNbbCgwLCBpID0gMzI2NiwgMjQ4MyAtIDY3LCBpIC0gMjQ2LCAzMDc0IC0gMzAzKV0sIFNbUSh0ID0gMTYzMCwgZSA9IDgwNywgdCAtIC04ODYsIDMwMCAtIDE1MywgZSAtIDIwNyldKSA/IEtbcigxNzg3LCAyMzcyLCAyMjMwLCAwLCAxNTg3KV0obiwgRSkgOiBTW3IoLTUzLCA0MzcsIDEwOTUsIDAsIDMyNildKG4sIHUpOyB2YXIgdCwgZSwgaSwgZjsgfSwgQlVUcnE6IGZ1bmN0aW9uIEJVVHJxKG4sIHIsIHQpeyB2YXIgZSwgaSA9IHsgZ2d2TWI6IGZ1bmN0aW9uIGdndk1iKG4sIHIpeyByZXR1cm4gS1t1KDI3NzMsIDI0NzcpXShuLCByKTsgfSB9OyBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbCgwLCB0LCByIC0gMTUyLCB0IC0gMzI2LCBlIC0gLTI0OSk7IH0gZnVuY3Rpb24gYyhuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEkoMCwgMCwgbiAtIC0zNjUsIGUsIGUgLSAzNzUpOyB9IHJldHVybiBLW2YoODQ2LCAwLCAxODQ0LCAyMzExLCAxNTQyKV0oS1tjKDIzMzEsIDI2NTgsIDAsIDAsIDE3NTMpXSwgS1tmKDIzNTgsIDAsIDM4MywgMTAwNSwgMTE4NCldKSA/IEtbbCgwLCBlID0gMjE5MywgMTAxNSAtIDM3OCwgZSAtIDgsIDEyNDAgLSAtMjkwKV0obiwgciwgdCkgOiBpW2MoMTAzNiwgLTg4LCAwLCAwLCAtMjg1KV0obiwgRSk7IH0sIHBObXRXOiBmdW5jdGlvbiBwTm10VyhuLCB1LCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEkoMCwgMCwgZSAtIC01ODYsIHQsIGUgLSAyMjQpOyB9IGZ1bmN0aW9uIGUobiwgdSwgciwgdCl7IHJldHVybiBsKDAsIHQsIHIgLSAzNTgsIHQgLSAzMTksIHIgLSA3MjMpOyB9IHJldHVybiBTW2UoMzkyMSwgMCwgMjk2MSwgMzk0NyldKFNbZSgyMzMyLCAwLCAxOTUxLCAxODIwKV0sIFNbdCgxNjA1LCAxODU5LCAwLCAyODQ5LCAxNjAzKV0pID8gS1t0KDY4LCAyMzU4LCAwLCAxOTQxLCAxMTk1KV0oRSwgMCwgS1tlKDQ1MTYsIDAsIDQwMTMsIDMwMzEpXShfTCwgNzEyKSwgSCkgOiBTW0koaSA9IDM1MDgsIDAsIDMxNDEgLSAzOTIsIGksIDM5ODcgLSA0ODUpXShuLCB1LCByKTsgdmFyIGk7IH0gfSwgbiA9IHt9OyBmdW5jdGlvbiBRKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gWSh1LCByIC0gNDg1KTsgfSBmdW5jdGlvbiByKG4sIHUsIHIsIHQpeyBmdW5jdGlvbiBlKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gVShlLCB1IC0gNzIsIHIgLSA4NiwgdSAtIDk1MSk7IH0gZnVuY3Rpb24gaShuLCB1LCByLCB0KXsgcmV0dXJuIGwoMCwgciwgciAtIDI1LCB0IC0gMjYwLCB0IC0gMzEzKTsgfSByZXR1cm4gS1tlKDAsIDMwMzgsIDI2NjksIDAsIDQyNjQpXShLW2koMzQzNiwgMCwgMzU5OCwgMjgwNildLCBLW1UoMjc0MSwgKG8gPSAzOTMwKSAtIDkyLCA0ODQzIC0gMjIsIG8gLSAxNTY4KV0pID8gS1tpKDM0MTAsIDAsIDI1MTQsIDMzMzEpXShFLCBLW2woMCwgZiA9IDExNDksIGYgLSA0ODAsIChjID0gMTA3OCkgLSAzOTQsIGMgLSAtOTg1KV0oX0wsIDE1MzQpLCAwLCAwLCAwLCBIKSA6IEtbZSgwLCAyNzc0LCAyNjkyLCAwLCAzNTU0KV0oX0wsIEtbZSgwLCA4NzksIDE4NjIsIDAsIC04MCldKHQsIC05NTUpLCByKTsgdmFyIGYsIGMsIG87IH0gZnVuY3Rpb24gSShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFkodCwgciAtIDU2MCk7IH0gZnVuY3Rpb24gSihuLCByLCB0KXsgdmFyIGUsIGksIHAgPSB7IGZMaEFSOiBmdW5jdGlvbiBmTGhBUihuLCByLCB0LCBlLCBpLCBmKXsgcmV0dXJuIFNbdSgxMTgzLCAzMjMpXShuLCByLCB0LCBlLCBpLCBmKTsgfSwgUWJLTk06IGZ1bmN0aW9uIFFiS05NKG4sIHIpeyByZXR1cm4gU1t1KDE4ODAsIDIxMTIpXShuLCByKTsgfSwgamZLQ3g6IGZ1bmN0aW9uIGpmS0N4KG4sIHIsIHQpeyByZXR1cm4gU1t1KDE5MDcsIDYyOCldKG4sIHIsIHQpOyB9LCBsQlFPZzogZnVuY3Rpb24gbEJRT2cobiwgcil7IHJldHVybiBTW3UoMzA4NCwgMzQ5MyldKG4sIHIpOyB9LCBkSm9WRDogZnVuY3Rpb24gZEpvVkQobiwgcil7IHJldHVybiBTW3UoODc0LCAxMzY4KV0obiwgcik7IH0sIHJNSUNsOiBTW3UoMjM2NCwgMzEzMildLCByakxQejogZnVuY3Rpb24gcmpMUHoobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBTW3MoKGYgPSAxODE5KSAtIDE4MSwgMjIzOCAtIDM5OSwgMjQwMyAtIDE3OSwgMjIwNCAtIC03ODUsIGYpXShuLCB1LCByLCB0LCBlLCBpKTsgdmFyIGY7IH0sIG1SeERwOiBmdW5jdGlvbiBtUnhEcChuLCByKXsgcmV0dXJuIFNbdSgxOTM3LCAxOTE2KV0obiwgcik7IH0gfTsgZnVuY3Rpb24gZihuLCB1LCByLCB0KXsgZnVuY3Rpb24gZShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIHMobiAtIDQ3NiwgdSAtIDQ5MCwgciAtIDMxNSwgdSAtIDg3LCBlKTsgfSByZXR1cm4gS1tzKChvID0gMTkxMCkgLSA0MTcsIDQwNzQgLSAzODMsIDMzOTMgLSA0MywgMjg2MiAtIDExMSwgbyldKEtbZSgxMTMxLCA3NjcsIDE1OTQsIDAsIDE0MjYpXSwgS1tlKDI4LCA3NjcsIDE3MzgsIDAsIDIwMildKSA/IEtbcygoYyA9IDIxMDUpIC0gNDE4LCAyMTQxIC0gNDA0LCAyODAgLSA5MSwgOTMxIC0gODksIGMpXSh4LCByLCAwLCAwLCAwLCBLW3MoMzI2IC0gNzgsIDY3MCAtIDM4MywgKGYgPSAxNjMwKSAtIDQ3OSwgZiAtIDc4MSwgMjgxMyldKHUsIC04OTYpKSA6IHBbcyg3ODIgLSAzNTIsIChpID0gMTUxMCkgLSA0MzgsIDExMzEgLSAzNzAsIGkgLSAtMzk5LCAxNDU4KV0oRSwgMCwgMCwgcFtlKDg5MywgNzQ3LCAtMjMyLCAwLCA0MjIpXShhLCAtMTc4KSwgMCwgSCk7IHZhciBpLCBmLCBjLCBvOyB9IGZ1bmN0aW9uIHMobiwgdSwgciwgdCwgZSl7IHJldHVybiB2KG4gLSAyMSwgdSAtIDI4NCwgciAtIDQxMywgdCAtIDE5NCwgZSk7IH0gZnVuY3Rpb24gYyhuLCB1LCByLCB0KXsgcmV0dXJuIGwoMCwgdSwgciAtIDI3MCwgdCAtIDEzOSwgbiAtIC0xMDIwKTsgfSBmdW5jdGlvbiBhKG4sIHIsIHQsIGUsIGkpeyBmdW5jdGlvbiBmKG4sIHUsIHIsIHQpeyByZXR1cm4gcyhuIC0gMzE2LCB1IC0gMzY0LCByIC0gODAsIHQgLSA5MTIsIG4pOyB9IHZhciBjLCBvLCBhID0geyBNWWNuTzogZnVuY3Rpb24gTVljbk8obiwgciwgdCl7IHJldHVybiBwW3UoMTAyMSwgMTUzMCldKG4sIHIsIHQpOyB9LCBoRVhZTTogZnVuY3Rpb24gaEVYWU0obiwgcil7IHJldHVybiBwW3UoOTM4LCAyMDA4KV0obiwgcik7IH0gfTsgZnVuY3Rpb24gdihuLCB1LCByLCB0KXsgcmV0dXJuIHMobiAtIDMxMywgdSAtIDQ5MCwgciAtIDM3MywgdCAtIC02MzksIG4pOyB9IHJldHVybiBwW2YoMTkxNywgMjQxNCwgMjIwMSwgMjc1NyldKHBbZigyODYyLCAzNDY1LCA0NjI4LCAzOTgyKV0sIHBbdigzMTA3LCAzMTExLCAyNTc1LCAyNDMxKV0pID8gYVtzKChvID0gMjc0NykgLSAxMzYsIDM2ODMgLSA0MDEsIDMxODggLSAzODIsIG8gLSA5MzQsIDIxMDApXShFLCBhW3UoMTQ5MSwgMTc3NSldKGksIC02NTIpLCBIKSA6IHBbdig4MTYsIDEwMjMsIC0zNDAsIDM4MCldKHgsIGksIDAsIDAsIDAsIHBbcygoYyA9IDMyNTgpIC0gMzU2LCAyODI2IC0gMTEzLCA0MTM3IC0gMjI3LCAyOTE1IC0gNDIsIGMpXSh0LCAtNTEpKTsgfSBpZiAoRFtTW3UoMTkyMywgMTc2NSldKGEsIDAsIDExNDMsIDEwMzAsIDEwMjQsIDEwNzApXShEW1NbbygyMDE3LCAxNTEwLCAyNzI2LCAyMDIzLCAzMDI1KV0oYSwgMCwgOTQxLCAxMDM4LCAxMTEwLCAxMDY0KV0sIERbU1tvKDExNDgsIDE2OTAsIDEwMSwgMTkwNCwgLTg3KV0oZiwgMCwgMjA1LCAyOTMsIDI2OSldKSkgcmV0dXJuIERbU1tRKDAsIDIzOTAsIChlID0gMjA5OSkgLSAtMzQsIDExNDQgLSAyMjEsIGUgLSA1NildKGcsIDAsIC0yODgsIDAsIFNbYygyODYsIC00MTcsIC02MzcsIDEyMzgpXSgtMzY4LCAtMTEwNCksIC0yODgpXShxLCBEW1NbYygxMTIwLCAxNTA5LCA3NjksIDE5NDIpXShhLCAwLCAxMTcwLCAxMTAwLCAxMDUzLCAxMDcyKV0ociwgLTQyNiksIHQpOyBmdW5jdGlvbiBvKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gVSh0LCB1IC0gNDg1LCByIC0gMjkxLCBuIC0gMjUwKTsgfSBKW1NbdSgxNTAyLCAxNzUzKV0oZiwgMCwgMjMxLCAyNzksIDEyMCldKG5bU1tVKC0xNSwgLTc0NyAtIDQyLCA5MDkgLSAxMzIsIChpID0gOTcpIC0gLTEwMyldKGEsIDAsIDEyMDgsIDExMzIsIDExODAsIDEwNzMpXSgpKTsgfSBmdW5jdGlvbiB2KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gTigwLCAwLCAwLCBlLCB0IC0gLTkxOSk7IH0gZnVuY3Rpb24gVShuLCB1LCByLCB0KXsgcmV0dXJuIHkoMCwgMCwgMCwgbiwgdCAtIC0zNDApOyB9IGZ1bmN0aW9uIHAobiwgdSwgciwgdCl7IGZ1bmN0aW9uIGUobiwgdSwgciwgdCl7IHJldHVybiBVKHQsIHUgLSAyNjYsIHIgLSAzMjMsIHIgLSA5MDEpOyB9IHJldHVybiBTW2UoMCwgODAzLCA5MTIsIDE5NTApXShTW2UoMCwgMzE1MCwgMjg0MCwgMjg0OSldLCBTW2UoMCwgMjcwMiwgMjg0MCwgMjAyMildKSA/IFNbdigxMDE4IC0gMjcxLCAoZiA9IDExMSkgLSA0MCwgNjY5IC0gMzAzLCAxMzgwIC0gNDQzLCBmKV0oX0wsIFNbbCgwLCBpID0gMjQyNCwgMTA0NiAtIDQyOSwgaSAtIDQ0MCwgMTg0MiAtIDU4NildKHQsIC0yMDUpLCB1KSA6IEtbZSgwLCAxNjQ3LCAyMzQ2LCAzNTc2KV0obiwgRSk7IHZhciBpLCBmOyB9IGZ1bmN0aW9uIGwobiwgdSwgciwgdCwgZSl7IHJldHVybiBZKHUsIGUgLSAxNTIpOyB9IGZ1bmN0aW9uIGcobiwgciwgdCwgZSwgaSl7IGZ1bmN0aW9uIGYobiwgdSwgciwgdCwgZSl7IHJldHVybiBRKDAsIHIsIGUgLSAtOTYzLCB0IC0gODcsIGUgLSA0ODQpOyB9IHJldHVybiBTW3UoMTkyMCwgMTM3NSldKFNbZigwLCAwLCAtMzU0LCA4MzMsIDI5MyldLCBTW3UoNzMxLCAxNDY5KV0pID8gU1tsKDAsIG8gPSAxODc4LCBvIC0gMzE2LCAxNzgwIC0gNzIsIDIyMTkgLSAxMDMpXShfTCwgU1tmKDAsIDAsIDY1OSwgMzM4LCAxNjcxKV0oZSwgMjMxKSwgaSkgOiBLW1EoMCwgYyA9IDEwOTYsIDE1MTAgLSAzNjQsIDI2MSAtIDk5LCBjIC0gMTYyKV0obiwgRSk7IHZhciBjLCBvOyB9IGZ1bmN0aW9uIHgobiwgciwgdCwgZSwgaSl7IGZ1bmN0aW9uIGYobiwgdSwgciwgdCwgZSl7IHJldHVybiBJKDAsIDAsIGUgLSAtMTE2MSwgdCwgZSAtIDYzKTsgfSBmdW5jdGlvbiBjKG4sIHUsIHIsIHQpeyByZXR1cm4gVShyLCB1IC0gNjYsIHIgLSA0MzAsIHQgLSAxMjEyKTsgfSBmdW5jdGlvbiBvKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSSgwLCAwLCBlIC0gLTY0NiwgciwgZSAtIDEpOyB9IHZhciBhID0geyBQamF5RTogZnVuY3Rpb24gUGpheUUobiwgciwgdCwgZSwgaSwgZil7IHJldHVybiBTW3UoMTMwNiwgMzI4NyldKG4sIHIsIHQsIGUsIGksIGYpOyB9LCBKcHRvdTogZnVuY3Rpb24gSnB0b3Uobiwgcil7IHJldHVybiBTW3UoMTIwNCwgMTczNildKG4sIHIpOyB9IH07IHJldHVybiBTW2YoMCwgMCwgMCwgLTY5NywgNDk3KV0oU1tmKDAsIDAsIDAsIDQ3LCA4OTApXSwgU1tvKDAsIDAsIDEwMTUsIDAsIDQ5NCldKSA/IGFbbygwLCAwLCA4NTcsIDAsIDEzMzEpXShFLCBfTCwgMCwgMCwgMCwgYVtvKDAsIDAsIDEyMjgsIDAsIDEwMTkpXShILCAtODk2KSkgOiBTW2MoMCwgMzIwMSwgMTI5NiwgMjIxMyldKF9MLCBTW2MoMCwgNDMwOCwgMjU3NCwgMzU4OSldKGksIDY5NiksIG4pOyB9IHJldHVybiBuW0RbU1tJKDAsIDAsIDI2NTcsIDM0NzAsIDM4NDYpXShfTCwgNDE0LCA3MzkpXShxLCA0MTUsIC00NjkpXSA9IERbU1tRKDAsIDQxODUsIDM0MTMsIDM3NTksIDIyMzApXShfTCwgNDAyLCA2NTYpXShEW1NbbCgwLCAxOTExLCAyMDM4LCAxODUzLCA5NjYpXShfTCwgNDAyLCAxMjM1KV0oRFtTW1EoMCwgMzI4MSwgMjkzMSwgMTY1MywgMzQzMyldKF9MLCA0NjksIDExMTQpXShxLCA0MjMsIC00NjQpLCBEW1NbUSgwLCAxNTg4LCAxODM3LCAyMDAzLCAxMTQwKV0oX0wsIDUzNiwgMTM1MyldKHEsIDQwOSwgLTQ3OCkpLCAiKyQiKSwgUFtEW1NbUSgwLCA2MDAsIDEzMzYsIDE1MzIsIDY0OCldKF9MLCA1NTIsIDc2OSldKERbU1tRKDAsIDgzNiwgMTE2NCwgOTQzLCAxNjQyKV0oX0wsIDUzNiwgODgyKV0ocSwgNDExLCA5MTcpLCBEW1NbUSgwLCA0NDI3LCAzNjE4LCA0MTY4LCA0ODU1KV0oX0wsIDUxMiwgNzUyKV0oSiwgMCwgLTE5LCAtMjQpKV0oKVtEW1NbbCgwLCA0MjY1LCAzODQ5LCAyNTI4LCAyOTU3KV0oX0wsIDUzMiwgMTIzOSldKERbU1tVKDE1NDIsIDIzMjIsIDI2NjIsIDEzNzkpXShyLCAwLCAwLCAtNTAwLCAtMzkwKV0ocSwgNDEyLCAxODcpLCAiaCIpXShuW0RbU1tsKDAsIDI2ODUsIDM2MzYsIDE4ODUsIDI1OTgpXShfTCwgNTEyLCAxMzg3KV0oSiwgMCwgLTExLCAwKV0pW0RbU1t1KDIxMDMsIDY1NildKHAsIDAsIDQ0MiwgMCwgMzY4KV0oRFtTW0koMCwgMCwgMTM1MSwgMTA4OSwgMjA0MildKHIsIDAsIDAsIC00MzEsIC0zODcpXShxLCA0MTEsIDkzMCksIERbU1t1KDE0MjIsIDE4MDIpXShwLCAwLCAxODgsIDAsIDIzMCldKHEsIDQwNywgLTQ3MikpXSgpW0RbU1t1KDE5NjEsIDIyMDApXShwLCAwLCAzMDIsIDAsIDE4MyldKERbU1tsKDAsIDMwODksIDE5ODksIDI4MDIsIDMyOTkpXShfTCwgNjA0LCA5NDQpXShEW1NbUSgwLCAyMDkxLCAyMTE4LCAxOTE3LCAzNDA4KV0ocCwgMCwgMjU0LCAwLCAyNzUpXShxLCA0MTQsIDkyOSksIERbU1tVKC0yNzMsIDE4OTMsIDQyNiwgNzc4KV0ocCwgMCwgMzAxLCAwLCAzMzEpXShxLCA0MDYsIDE4OSkpLCAiciIpXShQKVtEW1NbVSgtODQ4LCAtMjg1LCAtMTE5MiwgLTQxKV0oX0wsIDQ0MSwgMTM4NildKERbU1tsKDAsIDI2NTcsIDI0NiwgNzYsIDE0MDQpXShyLCAwLCAwLCAtNDA5LCAtNDU0KV0ocSwgNDEyLCAtNDczKSwgImgiKV0obltEW1NbSSgwLCAwLCAzNDU1LCAyNzg3LCA0NzY1KV0oX0wsIDQ0MywgNzM3KV0ocSwgNDE1LCAxOTQpXSk7IH0pOyBmdW5jdGlvbiBOKG4sIHIsIHQsIGUsIGkpeyByZXR1cm4gdShpIC0gNjY1LCBlKTsgfSBmdW5jdGlvbiB6KG4sIHIsIHQsIGUsIGkpeyBmdW5jdGlvbiB2KG4sIHUsIHIpeyByZXR1cm4gTigwLCAwLCAwLCByLCBuIC0gLTE0NDMpOyB9IGZ1bmN0aW9uIHAobiwgdSwgciwgdCwgZSl7IHJldHVybiBSKDAsIDAsIDAsIHUgLSAyNjAsIGUpOyB9IGZ1bmN0aW9uIHMobiwgdSwgciwgdCwgZSl7IHJldHVybiB5KDAsIDAsIDAsIG4sIGUgLSAyMTEpOyB9IHZhciBsID0geyBVbGJwTjogU1tLKDAsIDEzODMsIDMxMTgsIDI2ODksIDM3NzIpXSwgdVZxYmE6IFNbSygwLCAyNTE1LCAyNTM2LCAyOTQzLCAzOTE3KV0sIEZTdVhROiBTW2YoMCwgMzM5NiwgMjgwNildLCBoUVZuRTogU1tLKDAsIDE0ODEsIDIwNDQsIDE0MTYsIDE0MSldLCBWRHZmZTogU1twKDAsIDE1NDIsIDAsIDAsIDExMjYpXSwgelVpUG46IFNbSygwLCAyNDUyLCA0MzM3LCAzMjk5LCA0Mzc1KV0sIFlRQnBaOiBTW3MoMjg2NCwgMjg4OCwgMjc0MSwgMCwgMTk0OSldLCBzdHV6UTogU1t2KDIzODQsIDAsIDI3ODMpXSwgTlJUR0Q6IFNbcCgwLCA0MDMsIDAsIDAsIC04MjEpXSwgQ3lZWGc6IFNbdigxNjg1LCAwLCAxNzU4KV0sIG1nb2ZROiBTW3MoMTUwNiwgMzA1MywgMTg3MywgMCwgMjExNSldLCB6WFZ3VDogU1t2KDE2OSwgMCwgMzUzKV0sIFN5WkJTOiBTW2YoMCwgMjg5MSwgMzI3OSldLCBkU3dMeTogU1twKDAsIC00MiwgMCwgMCwgLTExNzcpXSwgYnhNV0Y6IFNbdigxMDU0LCAwLCAtMjI0KV0sIHZYUk5FOiBTW2YoMCwgMTA1OCwgMTk2NyldLCBaaEJEVDogU1t2KDIxNiwgMCwgLTkzNyldLCBES1dRdDogU1tmKDAsIDQyODcsIDM2NzIpXSwgWWFjeFQ6IFNbcygxOTUzLCAyMTgzLCAxMDQ5LCAwLCAyMTIxKV0sIFJKWUZHOiBTW3MoMTE4NywgLTc0MywgMTUxOSwgMCwgNDE5KV0sIFR4eFhvOiBTW3AoMCwgMTcwLCAwLCAwLCAtMTE3MyldLCBUR213VjogU1tmKDAsIDM1MjYsIDMwMjkpXSwgT3RHZkU6IFNbSygwLCAzMTc5LCAxOTQ2LCAyODM1LCAzOTIzKV0sIG9tbkNYOiBTW0soMCwgMzE5NCwgMzA0OSwgMjEzNywgMTM0OSldLCBXSFZtdTogU1tLKDAsIDM3NjYsIDI5MTgsIDM2NTcsIDM3MjkpXSwgakxXa0I6IFNbdigzOSwgMCwgODQ5KV0sIGFYcU5rOiBTW2YoMCwgMjExOSwgMjc2MCldLCB6U1NMaTogU1twKDAsIDExMTEsIDAsIDAsIDIzNTYpXSwga09QTEQ6IFNbcygzNTA0LCAxNDI1LCAxODg5LCAwLCAyNTQ5KV0sIHZhWXB3OiBTW3YoMTgxMCwgMCwgMjk3MildLCBXYWtuYzogU1tLKDAsIDIwNDQsIDM2MDYsIDI4NDMsIDMxNzYpXSwgUmdpa1c6IFNbdigxNTg0LCAwLCAxOTM0KV0sIEVYUE9xOiBTW3YoMTczOSwgMCwgMjY2MCldLCB3cVJ3dDogU1t2KDE0ODgsIDAsIDEzNDkpXSwgZVRkWkE6IFNbcCgwLCA2NTEsIDAsIDAsIDU1MyldLCBKRmhldTogU1tzKDE3MjAsIDIzMTEsIDIzNTYsIDAsIDI3NjIpXSwgVUhJYVA6IFNbcCgwLCAxODIwLCAwLCAwLCA5NDkpXSwgcWpRa206IFNbZigwLCAzNzk2LCAzMDg5KV0sIE5MdXRCOiBTW3MoMTM1NSwgOTA5LCAxMTMxLCAwLCAxMzgwKV0sIFpTT1ZtOiBTW2YoMCwgMzg3OSwgMzE0NyldLCBGZ0dhczogU1tLKDAsIDQ0MDIsIDQ1ODYsIDM0MjAsIDI5OTMpXSwgVEtoV1A6IFNbSygwLCAzOTk2LCAxNjM4LCAyNjgzLCAxMzQ1KV0sIElxRExHOiBTW3AoMCwgMzY0LCAwLCAwLCAxMzM2KV0sIERvbFZDOiBTW2YoMCwgMzUxMCwgMzkxNCldLCB6Z25wVzogU1twKDAsIDI0MzMsIDAsIDAsIDExMzkpXSwgREpqY2Q6IFNbcCgwLCA1NDksIDAsIDAsIDgxOCldLCBlaUpEcTogU1t2KDI5MSwgMCwgNTUpXSwgcGZCUHY6IFNbcCgwLCA3MDcsIDAsIDAsIC0yNTApXSwgT29Uam46IFNbZigwLCAzOTEwLCAzNTUzKV0sIGtQdXRCOiBTW2YoMCwgMjE2OSwgMjcxOSldLCBvZXBkQjogU1tmKDAsIDI5MTAsIDIzODYpXSwgTHptUEM6IFNbcygxMDY5LCAxNTU3LCAxMzcsIDAsIDQ5OCldLCBORlhBQzogU1tmKDAsIDM4MzgsIDMwNzUpXSwgcU92WVA6IFNbcyg1OSwgMTgsIC01MDUsIDAsIDM5NCldLCBvZkRRRDogU1twKDAsIDk0NywgMCwgMCwgMTAxMSldLCBUeXN0UzogU1tzKDM3NDIsIDM1MTcsIDE2MTcsIDAsIDI0NzYpXSwgS0JLdXY6IFNbSygwLCAtOCwgMTcyMiwgMTIyNCwgMjU1MSldLCBwdE9DSjogU1tzKDE2NDUsIDE4NTQsIDIxMDcsIDAsIDIwNTMpXSwgeUV5dks6IFNbcygxMTI1LCAxMjkwLCAxNjU4LCAwLCAzNDQpXSwgbkltREw6IFNbZigwLCAxNTgxLCAyNTA2KV0sIFBTT05uOiBTW3MoNDMyLCAxNDY2LCAtNDQ1LCAwLCA1MDIpXSwgc1NQR2w6IFNbdigxODY2LCAwLCAyMTI4KV0sIG5jS1NKOiBTW3YoLTc1LCAwLCAxMDA2KV0sIEt5QmZTOiBTW3YoMTIxNywgMCwgNzE0KV0sIFJ4TnNwOiBTW2YoMCwgMzc1OCwgMzUyMyldLCBGQm9LUTogU1tzKDE1ODIsIDMxNTAsIDE4MzgsIDAsIDE4MDgpXSwganlUbEI6IFNbcCgwLCAyNDY5LCAwLCAwLCAyNzExKV0sIGRkSnBuOiBTW3YoNjY1LCAwLCAxMDgzKV0sIHByZUFoOiBTW2YoMCwgMjI5MywgMzI5NCldLCBOb3lYTjogU1tmKDAsIDI2NDMsIDE4ODQpXSwgSFhFbVc6IFNbSygwLCAyMjQyLCAzODg3LCAyODk0LCAyOTMxKV0sIG9ueGNLOiBTW0soMCwgMTg4MCwgMTI4NywgMjIyOCwgMzUyMyldLCBYU21IcjogU1tmKDAsIDI1MTksIDE2NjEpXSwgbmdBbGM6IFNbcyg1NDYsIDIyMzMsIDIyMTgsIDAsIDE3MzEpXSwgTFRBdXQ6IFNbZigwLCAyNTIwLCAzMjExKV0sIEJmRGFFOiBTW3YoLTE3NSwgMCwgMTUpXSwgYk9HSXQ6IFNbZigwLCAzNjY4LCAzNDM0KV0sIG9Hb2JEOiBTW2YoMCwgMjA3MCwgMTkwMyldLCBjS01LdDogU1tmKDAsIDQyMjYsIDMzNTYpXSwgaEJPVUU6IFNbcCgwLCAxODM1LCAwLCAwLCAyNDE1KV0sIFRtdFF4OiBTW3AoMCwgNTY5LCAwLCAwLCAxNDczKV0sIE9vSWNyOiBTW2YoMCwgMjQyOCwgMTU1NyldLCB4dG90QzogU1twKDAsIDIxMjUsIDAsIDAsIDE0MjEpXSwgc2FUQnY6IFNbdigxMDQ5LCAwLCAyNjgpXSwgeUdMbVM6IFNbZigwLCAzNDAxLCAyNjkxKV0sIHJyZXN0OiBTW3YoMzk5LCAwLCAtNzU1KV0sIHVZcmhEOiBTW0soMCwgMTgyMywgMTcxNCwgMTI4MiwgMTY1NildLCB2eFFydzogU1tLKDAsIDM3MzUsIDQzOTcsIDMzMTksIDQyMjQpXSwga3l2VUg6IFNbcCgwLCAyMjI0LCAwLCAwLCAyOTAzKV0sIGJpWnF3OiBTW3MoMTc5NywgMzUzNSwgMjYzNywgMCwgMjI3OCldLCBmVkpGVTogU1tzKDE3MjMsIDMxNzYsIDMyNzgsIDAsIDI4NTcpXSwgQ2dUVFM6IFNbZigwLCAxNjUwLCAyNzA1KV0sIGxOcGpiOiBTW3AoMCwgMTU0NywgMCwgMCwgMjgzMildLCB4a1FKbjogU1tLKDAsIDEzODQsIDE1MDQsIDE2OTAsIDc2OCldLCBKSHVLbTogU1tmKDAsIDIyMDQsIDE5MjcpXSwgTG1VamM6IFNbcyg2NiwgMjIzNCwgNjgyLCAwLCAxMTI4KV0sIGd3WUtiOiBTW3MoMzI2NywgMzI4MCwgMzE1NCwgMCwgMjM0MSldLCBQTEhSRTogU1t2KC0xODIsIDAsIDgyMCldLCBWeGZZZTogU1tLKDAsIDQxODEsIDI0MTksIDM2MDIsIDQ1MTUpXSwgTWN2bU86IFNbcCgwLCA0MzksIDAsIDAsIC00NDIpXSwgenNVakc6IFNbSygwLCAzNzgsIDI3NTUsIDE1NzYsIDE2MDYpXSwgVWh3eGg6IFNbSygwLCAyODA1LCAzNzk2LCAyNTc5LCAzODQ2KV0sIFV1eW9iOiBTW0soMCwgMjE5MCwgMjQ3OSwgMTE4OCwgOTMxKV0sIHJ1UkFzOiBTW3YoMTY3NSwgMCwgMTY2NyldLCBsRmlwSTogU1tzKDI1MTIsIDI2NTMsIDE1NTksIDAsIDE1NjkpXSwgVmpBTE46IFNbZigwLCAzMTMyLCAzNTU3KV0sIGRUR2VXOiBTW3MoMTIxOSwgLTEzMCwgNDcwLCAwLCA2MzkpXSwgZFVsZlo6IFNbSygwLCA0NzAyLCAyNjY3LCAzNDc3LCAzNDcyKV0sIEVrdENGOiBTW3AoMCwgOTYxLCAwLCAwLCA1OTQpXSwgVUp4RGk6IFNbcCgwLCAxOTAsIDAsIDAsIDEyNzkpXSwgaUhTZU46IFNbdigxMjA4LCAwLCAyMTMxKV0sIGx4ZHdUOiBTW2YoMCwgMjY4NCwgMzQ1NildLCBVVmhRWjogU1tLKDAsIDE0NzksIDE2NTcsIDE3OTYsIDE5MzgpXSwgd1F6TWk6IFNbcCgwLCAxODA0LCAwLCAwLCAxNTM0KV0sIGlzamNwOiBTW3AoMCwgMjE3NywgMCwgMCwgMzA2NyldLCBrVGJhdTogU1tmKDAsIDIyNzksIDMzNDgpXSwgSVFxWlM6IFNbcCgwLCA1NTIsIDAsIDAsIDc0MCldLCBVYWpQUTogU1twKDAsIDExMjcsIDAsIDAsIC0xNjUpXSwgekRGb0k6IFNbZigwLCAyNDkxLCAzNzM4KV0sIG15SGhJOiBTW3AoMCwgMTcsIDAsIDAsIDY2NSldLCBORnN5VDogU1tLKDAsIDI4NzIsIDI3MDMsIDIyMzIsIDE5OTQpXSwgZllyWUY6IFNbdigxMTIwLCAwLCAxNjExKV0sIFlVSk9pOiBTW3MoMTE3NCwgMjEzMCwgMzAxMCwgMCwgMjM5MyldLCBsbmlzTDogU1tzKC01MjksIC01MTcsIDU3MiwgMCwgODEyKV0sIFNGWWhxOiBTW2YoMCwgMjYyMCwgMzcxNyldLCBObVhDYjogU1tzKDMzMCwgLTE4MCwgODEzLCAwLCA0MjkpXSwgeXhuZGI6IFNbZigwLCA0Mjk2LCAzNDc4KV0sIEJwdmVjOiBTW0soMCwgNDI3OCwgMjQ1MSwgMjk2OCwgMjUzOCldLCBnWHJBczogU1t2KDc3LCAwLCA5MDQpXSwgdnVQb0U6IFNbcygtNTM2LCAtMzkzLCA4MzUsIDAsIDc5NildLCB1T2pOSDogU1twKDAsIDIxNzIsIDAsIDAsIDI3MTgpXSwgZ3VjbWg6IFNbdigyMTgyLCAwLCAyNDMwKV0sIHRXdVdWOiBTW3MoOTk2LCA1NDcsIDE4NDUsIDAsIDEzOTIpXSwgSGpMS1A6IFNbZigwLCAxNDI4LCAxMzczKV0sIHF1bEhrOiBTW0soMCwgMTY4NSwgMzI1MCwgMjIxMywgMzMxMSldLCBlWkNNWDogU1twKDAsIDE1MjgsIDAsIDAsIDE4NDApXSwgWU9ocFo6IFNbcCgwLCA0OTksIDAsIDAsIDg1NCldLCBPQlJibzogU1tzKDIxNjEsIDQ0MSwgMTQ0MCwgMCwgMTc2NyldLCB4R0RRUTogU1twKDAsIDE4NTIsIDAsIDAsIDg4NCldLCB4UGtZUDogU1tLKDAsIDQ0OTIsIDQ2NDQsIDM1MzksIDMxNzcpXSwgZmVnQlo6IFNbcCgwLCAxMzA1LCAwLCAwLCAyMTU1KV0sIFlWY3RnOiBTW0soMCwgMjU0NiwgODMwLCAyMTUwLCAyMzYyKV0sIGtwQ3J6OiBTW0soMCwgMjEyNSwgMTYyMywgMTYxOCwgMTkzMCldLCBqWXNhZDogU1tmKDAsIDMyNzksIDIwNzIpXSwgWXFaaHQ6IFNbZigwLCA1MDA0LCAzODIwKV0sIFl2aGJpOiBTW2YoMCwgNDcwLCAxNDk3KV0sIHp5RFNqOiBTW0soMCwgODQ0LCAyMDA2LCAxNjg0LCAxNTA3KV0sIEN0VG14OiBTW3MoNzYyLCAyMDk5LCA2MTYsIDAsIDE1OTApXSwgQmhBcU06IFNbSygwLCA0NDIzLCAyODEzLCAzMTU4LCA0Mjk4KV0sIHhwcGRvOiBTW2YoMCwgMzI5NiwgMzgzOSldLCBLbUdCdDogU1t2KDE3NywgMCwgLTEwMzgpXSwgcFhEemU6IFNbdigtOTMsIDAsIDM0NSldLCB0UERmRDogU1twKDAsIC02NiwgMCwgMCwgLTEyKV0sIE9UWnlsOiBTW0soMCwgMzg1MCwgMzQ2MSwgMzAzMCwgMjQ1NSldLCBab0VVWjogU1t2KC0xMTEsIDAsIC0xNzQpXSwgSlFjZmM6IFNbSygwLCAxMzI0LCAyMzQwLCAxMjE3LCAyNDA2KV0sIHNoZ3JUOiBTW3MoNTE0LCAtODAsIC0yNjAsIDAsIDM1OCldLCBFakxKeTogU1t2KDIyMjgsIDAsIDEyMTkpXSwgSVh2UXA6IFNbcCgwLCAxMzQ2LCAwLCAwLCAxMjAyKV0sIEVYV1h4OiBTW2YoMCwgMTU1NCwgMTY3MSldLCBmS3pFRzogU1tmKDAsIDEyMzIsIDI0ODgpXSwgQWZQZnY6IFNbSygwLCA0NjkzLCAzMzE5LCAzNDYzLCA0NDYzKV0sIFhBSmRlOiBTW2YoMCwgMjk0NSwgMjU4OCldLCBvdGdrVTogU1twKDAsIDE1NzcsIDAsIDAsIDY1NyldLCBqdGF4SjogU1tmKDAsIDE3NTAsIDI0MTEpXSwgWmhicWo6IFNbdigyMTEyLCAwLCAzMjg0KV0sIHFtWGVZOiBTW2YoMCwgOTE1LCAxODQ3KV0sIExVTHhNOiBTW3YoLTM0LCAwLCA2MDUpXSwgdGlzWk06IFNbdigyNjMsIDAsIDY4MSldLCBNWXFicDogU1tmKDAsIDI4MzUsIDIwNDMpXSwgd3dIZW46IFNbdigxMDQ1LCAwLCAzNDEpXSwgdkxmQWQ6IFNbcyg0ODEsIC0yNjUsIDE5MzgsIDAsIDYzMildLCBrV2pVQjogU1tmKDAsIDE2MDMsIDI2OTkpXSwgRk54YWI6IFNbSygwLCAxOTQ5LCA0MzQ0LCAzMDg2LCAxOTE4KV0sIEZQZ2xXOiBTW2YoMCwgMTg4MiwgMjg2MyldLCBMUWdMTTogU1tLKDAsIDM4MDksIDE3MTgsIDI3MTQsIDIyNDEpXSwgcEtLVFI6IFNbcCgwLCAtMTU0LCAwLCAwLCAyNjIpXSwgT1V6Y1k6IFNbcyg3MTIsIDE2NzcsIC02NjgsIDAsIDUwNyldLCB3ZHNhRjogU1twKDAsIDE4OCwgMCwgMCwgLTg0OSldLCBjYVpMRzogU1t2KDIyMzMsIDAsIDg5OSldLCBhWGlhejogU1t2KDkxMSwgMCwgNjg2KV0sIEliSkhsOiBTW0soMCwgMTg3MiwgMTM5OSwgMjE2MCwgMTU1MSldLCBpemZBQTogU1twKDAsIC0xMjYsIDAsIDAsIDc4MildLCBKT3Z5eDogU1tzKDI3MTgsIDIwMjcsIDI2MzEsIDAsIDIyNTcpXSwgYkJZa286IFNbSygwLCAzMjg4LCAyOTE1LCAzNDc2LCA0NTY4KV0sIHpCZlNROiBTW3YoMzYzLCAwLCAxNTcxKV0sIGFzZk92OiBTW3AoMCwgMzMzLCAwLCAwLCAyMTUpXSwgV1VwV0g6IFNbcCgwLCA2NzYsIDAsIDAsIDE2MzYpXSwgb1BmRFU6IFNbcCgwLCAxODQxLCAwLCAwLCAyNDA1KV0sIHV3ZlNLOiBTW3MoMjE4MywgMTA4NCwgMjEzMiwgMCwgMTI0MCldLCBDY3pqRDogU1t2KDE4MjcsIDAsIDE2NzcpXSwgc3ZQZWY6IFNbcygxNTQ0LCA0MDQyLCAzMzM1LCAwLCAyODQxKV0sIHJNV1FlOiBTW2YoMCwgMTU1OSwgMjMyMyldLCBHTVhVVDogU1tzKDM4NiwgNDM2LCA1NDMsIDAsIDM4NCldLCBoVE94RzogU1t2KDM2MiwgMCwgLTY4NyldLCBjWFpqazogU1tmKDAsIDQ3OTYsIDM3MjgpXSwgaFRDRlg6IFNbZigwLCAxOTY3LCAyMDk0KV0sIFpGYkFxOiBTW3MoMTU0NiwgMTYwNSwgLTI2OSwgMCwgNTI2KV0sIEpNZ3BqOiBTW0soMCwgMjY3OSwgMjgzNSwgMzI2NiwgMzAxMCldLCBHT0l3bTogU1tmKDAsIDMzNTQsIDM1NTQpXSwgd0R1dW46IFNbcyg0ODAsIC0xNzYsIC02OTksIDAsIDQ3NCldLCBGUHFqZTogU1tzKDE0NiwgNzksIDIzNDMsIDAsIDExNDQpXSwgRkx2b3o6IFNbcCgwLCAxMDYzLCAwLCAwLCAxMDYxKV0sIHBXZU5rOiBTW3YoMTI2NCwgMCwgMjApXSwgVUh0TWM6IFNbcygxMDE2LCAxOTkwLCAyNDA0LCAwLCAxNTU2KV0sIG9OeGFsOiBTW2YoMCwgMzcwNiwgMzQ1MCldLCBMZ2tqdDogU1t2KDIwOTEsIDAsIDEzNzUpXSwgWnhBT3I6IFNbZigwLCAzNDA3LCAyMTAyKV0sIHBhWXpoOiBTW2YoMCwgMzAwOCwgMjM3NildLCBMbUVweDogU1t2KC0yMCwgMCwgLTEwMTkpXSwgRG5aQkI6IFNbSygwLCAyODk3LCAzNzg2LCAzNjk5LCA0ODk1KV0sIFlISnl0OiBTW3YoMTU5NCwgMCwgMTIzOSldLCB0WVhDUDogU1t2KDIzMzAsIDAsIDI1MjgpXSwgTmp2emY6IFNbcygzMjUxLCAzMjExLCA0MDQ2LCAwLCAyOTM3KV0sIENPbVpjOiBTW3AoMCwgMTEzOCwgMCwgMCwgNDczKV0sIFRaY0tlOiBTW0soMCwgMjI1NiwgMzYzMiwgMjM1NywgMTU2MildLCBHSnJNUjogU1twKDAsIDIzNywgMCwgMCwgMTkxKV0sIGdObmVvOiBTW0soMCwgMjk0OCwgNDI2NiwgMjk3OSwgMzAzOSldLCBNSUpxTzogU1t2KDk3NCwgMCwgMTg4OSldLCBkS0JITzogU1tLKDAsIDI3MDAsIDI4ODgsIDM3MzQsIDI1NTcpXSwgelhlRkk6IFNbSygwLCAxOTE1LCAyOTkwLCAyMjY2LCAxNTYxKV0sIFZNcFBUOiBTW2YoMCwgNDU0MSwgMzQ1MSldLCBERHd2RjogU1tzKDEzNDQsIDgyNCwgLTMzMywgMCwgNjU2KV0sIGRla0lzOiBTW3MoMTg4NywgNzAsIDE1OTQsIDAsIDEzMDYpXSwgVUJpZGY6IFNbdigyMzYsIDAsIDE1NzEpXSwgWnNsanY6IFNbdigxNjgwLCAwLCA5NTQpXSwgdUdoeHo6IFNbSygwLCAzNDgzLCAyNTM2LCAyODgyLCAxNjk3KV0sIFlwR0ptOiBTW3MoNDA5LCAxMDAsIDEyNTUsIDAsIDczOCldLCBHbEhqSjogU1twKDAsIDExOTgsIDAsIDAsIDc1KV0sIERFTGFXOiBTW3YoMjIyOSwgMCwgMzAxNSldLCB4dFRnbzogU1tmKDAsIDI1MjUsIDM2ODgpXSwgd2xUTXc6IFNbcCgwLCAxNDI4LCAwLCAwLCAyMTM0KV0sIExhR1ZOOiBTW3MoNjA0LCAyOTE4LCA4MDIsIDAsIDE4NDMpXSwgQXdXdVI6IFNbSygwLCAyOTEwLCAxNzE5LCAyMTM2LCAxMDA0KV0sIElvUG5oOiBTW3MoMjA3MCwgLTUwMCwgLTI4NiwgMCwgNzc1KV0sIGJrcWVZOiBTW0soMCwgMjUwOCwgMzYwNSwgMzYzNSwgMzIyNCldLCBQYVNkZjogU1tLKDAsIDExMTcsIDE0OTAsIDE5OTUsIDMxMDMpXSwgSkhqWFo6IGZ1bmN0aW9uIEpIalhaKG4sIHUpeyByZXR1cm4gU1tLKHIgPSAxNzU1LCAxOTU2LCAxOTc3IC0gNzksIHIgLSAtMTMwNCwgMTcxNCAtIDQxNyldKG4sIHUpOyB2YXIgcjsgfSwgY3lJeXM6IFNbcCgwLCA4OCwgMCwgMCwgMTM4MCldLCBubVRrYzogZnVuY3Rpb24gbm1Ua2MobiwgdSwgcil7IHJldHVybiBTW2YoMCwgdCA9IDM4MjMsIDI0OTUgLSAzNyldKG4sIHUsIHIpOyB2YXIgdDsgfSB9OyBmdW5jdGlvbiBLKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gWSh1LCB0IC0gNTE4KTsgfSBmdW5jdGlvbiBmKG4sIHUsIHIpeyByZXR1cm4gYihyIC0gLTYzLCAwLCB1KTsgfSBpZiAoU1tzKDIxNDUsIDI3MjUsIDM2NjEsIDAsIDI2NDQpXShTW3AoMCwgMjEwOCwgMCwgMCwgMTIwNyldLCBTW3AoMCwgMjEwOCwgMCwgMCwgMjI4MildKSkgcmV0dXJuIFNbcCgwLCA0NTksIDAsIDAsIDE2OTEpXShFLCBfTCwgSCk7IHZhciBjID0geyB5RHFUVjogZnVuY3Rpb24geURxVFYobiwgdSwgcil7IHZhciB0ID0ge307IGZ1bmN0aW9uIGUobiwgdSwgcil7IHJldHVybiB2KHIgLSA0NCwgMCwgbik7IH0gZnVuY3Rpb24gaShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEsoMCwgdSwgciAtIDQ5OSwgbiAtIC0xMTkzLCBlIC0gMjI1KTsgfSBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSygwLCByLCByIC0gMTI4LCBlIC0gLTE0NDgsIGUgLSAzOTQpOyB9IGZ1bmN0aW9uIGMobiwgdSwgciwgdCl7IHJldHVybiBzKHQsIHUgLSAxODYsIHIgLSAzMTAsIDAsIG4gLSA1NjIpOyB9IGZ1bmN0aW9uIG8obiwgdSwgciwgdCl7IHJldHVybiBwKDAsIHQgLSAyODcsIDAsIDAsIG4pOyB9IHRbbygxNTQ4LCAwLCAwLCAzNjIpXSA9IGxbbygzMzUzLCAwLCAwLCAyNzI5KV0sIHRbbygxNzQ0LCAwLCAwLCAxNDU4KV0gPSBsW28oNDg3LCAwLCAwLCAxNDAxKV0sIHRbdig0MzMsIDAsIDI5MSldID0gbFtmKDAsIDAsIDYwNSwgMCwgLTIxMildLCB0W2YoMCwgMCwgNTMzLCAwLCAtMzI2KV0gPSBsW2MoMzM1NywgMjI1OCwgMjYzNSwgMzk3NildLCB0W2MoMjg3OCwgMzEwNiwgMTkxMywgMTY1MSldID0gbFtpKDIyNTgsIDEyMTMsIDMwMjIsIDAsIDIxNjApXSwgdFtjKDE1MjYsIDE2MjUsIDIxNjcsIDI3MDQpXSA9IGxbZigwLCAwLCA3MTcsIDAsIDEyOTMpXSwgdFtmKDAsIDAsIDgyNywgMCwgNzA2KV0gPSBsW2MoMTI1NSwgOTg0LCAxNDU4LCAyNDU0KV0sIHRbaSgyNTksIDQ2MiwgNTY1LCAwLCAxNTU3KV0gPSBsW2YoMCwgMCwgMTEwOSwgMCwgLTcyKV0sIHRbdigtMjAwLCAwLCA5NTQpXSA9IGxbbygyNjEyLCAwLCAwLCAyMTM3KV0sIHRbYygyNDMyLCAzNjQyLCAyNDMxLCAyNzY3KV0gPSBsW3YoMTExNywgMCwgMjE3NildLCB0W28oMjE2NSwgMCwgMCwgMTg4OSldID0gbFtjKDI5ODMsIDMyNDksIDIzMDUsIDMwNjUpXSwgdFtvKDI1NTgsIDAsIDAsIDE4MjQpXSA9IGxbdigtMTI0LCAwLCA5MDcpXSwgdFt2KDc4LCAwLCAtNzg0KV0gPSBsW3YoMTM3LCAwLCAtODAwKV0sIHRbYyg5ODgsIDEyMzUsIDY0MiwgMTMxKV0gPSBsW2koMjA3OCwgMTYwMSwgMjIyMywgMCwgMjM4MSldLCB0W3YoNDMyLCAwLCAtMzc5KV0gPSBsW2MoMzAwNywgMjUxMywgMzQyNiwgNDA0MyldLCB0W2MoMTc0OCwgMTY3NSwgMTM1MSwgMjQ3NyldID0gbFtmKDAsIDAsIDE3MjEsIDAsIDIxMzYpXSwgdFtpKDEwNiwgLTEyMCwgMjkxLCAwLCAxMTY0KV0gPSBsW2MoMjE5NywgMTAyMiwgMTI4MCwgMTY0NyldLCB0W2koNTUzLCAtNzEwLCAtNzQzLCAwLCAxMDYxKV0gPSBsW2YoMCwgMCwgLTEzLCAwLCA4NjEpXSwgdFtvKC00MTEsIDAsIDAsIDEzMCldID0gbFtvKDIwNTIsIDAsIDAsIDIxNDYpXSwgdFtjKDEwNjIsIDIxMSwgMTk1NywgOTM0KV0gPSBsW28oLTI0MCwgMCwgMCwgODg3KV0sIHRbYygxODU5LCAxMDEzLCAyMTA5LCAxNTA3KV0gPSBsW28oNDQ4LCAwLCAwLCAxNTMxKV0sIHRbaSg2MjIsIDE3ODEsIDQ5MSwgMCwgMjY0KV0gPSBsW2MoMTE4NCwgMzk3LCAxMDc0LCAxMDEpXSwgdFtpKDE3NTQsIDE0NDEsIDIyNjQsIDAsIDE1MTIpXSA9IGxbYygyNzM0LCAyODUzLCAxNTk2LCAzNzUwKV0sIHRbYygxNzkyLCAzMDExLCAyOTk0LCAxMzcwKV0gPSBsW2YoMCwgMCwgMTA3NSwgMCwgMTY2NildLCB0W3YoLTIzNCwgMCwgODI5KV0gPSBsW28oMTYyOSwgMCwgMCwgODkzKV0sIHRbYygyNDQyLCAyNTM2LCAzNjkxLCAzNzAxKV0gPSBsW2koMTYxMywgMjkzMSwgMjcwNywgMCwgMTUyNCldLCB0W2YoMCwgMCwgMTI2NywgMCwgLTI2KV0gPSBsW3YoMjMwOSwgMCwgMzYxNCldLCB0W28oMTQxNywgMCwgMCwgNTQxKV0gPSBsW2koMjIwMywgMjk4MCwgMjUxMSwgMCwgMjEyNildLCB0W28oMjkxLCAwLCAwLCAxNTUzKV0gPSBsW3YoNDIxLCAwLCAtNTkzKV0sIHRbYygyMzk5LCAzMzE2LCAzNDc2LCAyNjU0KV0gPSBsW2YoMCwgMCwgMzEyMSwgMCwgMjE0NyldLCB0W2MoMzI0MiwgMzA3MiwgNDQ5MywgMzIxNildID0gbFtmKDAsIDAsIDIxNTYsIDAsIDk0MyldLCB0W2koMTExOCwgNzcwLCAxNzc5LCAwLCAyMzgzKV0gPSBsW2koNzQ4LCA3NDcsIDgzMywgMCwgMTI3MildLCB0W2MoMjA5OSwgMjk2OCwgMjcyMCwgMTI5MCldID0gbFtvKDEzNDcsIDAsIDAsIDI0ODEpXSwgdFtmKDAsIDAsIDI2NDUsIDAsIDIxOTUpXSA9IGxbYygzMTU5LCA0MTUyLCA0Mjc5LCAyMTAwKV0sIHRbdigxMTAzLCAwLCAtNzEpXSA9IGxbdig5ODgsIDAsIC0xMTQpXSwgdFtmKDAsIDAsIDE1NDYsIDAsIDcyMSldID0gbFt2KDQyNSwgMCwgMzMzKV0sIHRbdigxMzY5LCAwLCAxMTU3KV0gPSBsW2koLTEzMiwgLTE0NTMsIC05MTIsIDAsIDYwOSldLCB0W2YoMCwgMCwgMjMzNCwgMCwgMTYwMyldID0gbFt2KDE0NjQsIDAsIDIwMjgpXSwgdFtjKDIyNzEsIDIzNzcsIDMwNTMsIDMwMjYpXSA9IGxbdig4MTksIDAsIDE4OTQpXSwgdFtpKDE5OTAsIDIzNjYsIDMxODYsIDAsIDIzODkpXSA9IGxbZigwLCAwLCAxOTA0LCAwLCAxMTA4KV0sIHRbbygyMjQ2LCAwLCAwLCAxMjMxKV0gPSBsW28oMTM1NCwgMCwgMCwgMjE5NSldLCB0W2YoMCwgMCwgNjM2LCAwLCAxNTkzKV0gPSBsW2MoMjUxMCwgMTM2NSwgMjgzOSwgMjk5MyldLCB0W2YoMCwgMCwgMjM4OCwgMCwgMTQzNyldID0gbFt2KDE1MDgsIDAsIDIxODApXSwgdFtmKDAsIDAsIDk4MSwgMCwgNzg3KV0gPSBsW3YoMTk1NywgMCwgMjE4NyldLCB0W3YoMTk4NiwgMCwgMjgxMCldID0gbFtvKDk0NSwgMCwgMCwgOTQzKV0sIHRbZigwLCAwLCAyMTEzLCAwLCAxMTk3KV0gPSBsW2koMTI0NCwgMTAwMywgMjUxMywgMCwgNjc4KV0sIHRbYygzMDk5LCA0MTU0LCAzODEyLCAyNDYzKV0gPSBsW2koNTg2LCAtOTEsIDE0OSwgMCwgMTE4KV0sIHRbYygxNjQ3LCAyNjI2LCAyMjk3LCAxOTI1KV0gPSBsW28oMTY4MCwgMCwgMCwgMTg5MildLCB0W3YoMTA4OSwgMCwgMTgzNildID0gbFtjKDExODMsIDc4MiwgMjA2LCA5MyldLCB0W3YoNzMwLCAwLCA5MDQpXSA9IGxbbygxNTEyLCAwLCAwLCAxMTczKV0sIHRbbygyODI1LCAwLCAwLCAyNzM1KV0gPSBsW2YoMCwgMCwgMTEzMCwgMCwgMTk0NyldLCB0W3YoOTY1LCAwLCA0NjgpXSA9IGxbdigtOSwgMCwgOTExKV0sIHRbYygxMTg3LCAyMzYzLCA0OCwgMjQ5NildID0gbFtmKDAsIDAsIDQ1MSwgMCwgLTI1NSldLCB0W2MoMjc3NiwgMzY5MywgNDA0NiwgMjU4MSldID0gbFtpKC00MiwgMzcxLCAtNTM5LCAwLCAtMTEyOCldLCB0W2koMTQ0MiwgMjE4MCwgNzIwLCAwLCA2NzgpXSA9IGxbbygxNjkzLCAwLCAwLCAxMDc3KV0sIHRbbygxMDEzLCAwLCAwLCAyMTg3KV0gPSBsW2koMjIsIDg2LCA1NSwgMCwgNjApXSwgdFtvKDE1MjIsIDAsIDAsIDIyNDYpXSA9IGxbaSgtMTE2LCAtMzc5LCAxMDI2LCAwLCA4NjQpXSwgdFtmKDAsIDAsIDgwMywgMCwgLTQ5KV0gPSBsW28oLTQyMiwgMCwgMCwgMzAwKV0sIHRbdigxNTQyLCAwLCAxNzM3KV0gPSBsW2YoMCwgMCwgMzEzNywgMCwgMTg4NildLCB0W3YoODYzLCAwLCA2NzcpXSA9IGxbdigxODUxLCAwLCAxMzM1KV0sIHRbYygzMTM0LCAyMDkxLCAzNTMzLCAzMjI0KV0gPSBsW2MoMTk2MCwgMTcyMywgMTMzMiwgMjYwNCldLCB0W3YoMTA3NCwgMCwgMTU3MildID0gbFtmKDAsIDAsIC04MzMsIDAsIC0yMDEpXSwgdFtjKDI4NzUsIDM5MDMsIDE1MzMsIDMyOTQpXSA9IGxbbygyOTUsIDAsIDAsIDU3NSldLCB0W2koMjcxLCAtMTk0LCAtMjA2LCAwLCA5ODEpXSA9IGxbaSgxNTMxLCAxMjQ0LCA4NTQsIDAsIDE5NDIpXSwgdFtvKDMyNjAsIDAsIDAsIDIyNjkpXSA9IGxbZigwLCAwLCAtNjc4LCAwLCA1MTgpXSwgdFtjKDIzMDAsIDI0NDMsIDI1OTAsIDE1OTUpXSA9IGxbaSg4OTYsIDM2MywgLTMyOSwgMCwgLTEwNCldLCB0W2koLTc5LCAtMTAyMCwgODg1LCAwLCAtNjkpXSA9IGxbdig1MzAsIDAsIC01NDMpXSwgdFtjKDI0NzcsIDI0MDMsIDI3MzYsIDE4ODIpXSA9IGxbbygxMDczLCAwLCAwLCAxNjU3KV0sIHRbdig5ODEsIDAsIDE2MjMpXSA9IGxbdigyMjc5LCAwLCAzMzI2KV0sIHRbaSg2MTYsIC03MTIsIC02MzEsIDAsIDgzOCldID0gbFtpKDE3NjEsIDEwODgsIDU0NywgMCwgMTMyNildLCB0W28oMTUyOCwgMCwgMCwgNTQ2KV0gPSBsW2MoMzQ3MCwgNDQ5MCwgNDQzNSwgMjk5NSldLCB0W2YoMCwgMCwgMjM4MSwgMCwgMTM0MildID0gbFtmKDAsIDAsIDI4NDIsIDAsIDE5OTEpXSwgdFtvKDEzNTQsIDAsIDAsIDE3MzEpXSA9IGxbdigxNjEyLCAwLCAxNTgyKV0sIHRbZigwLCAwLCAtMjcyLCAwLCAtMzg4KV0gPSBsW2koMzA4LCA5MDYsIDE0ODUsIDAsIC05ODQpXSwgdFtpKDM1OCwgMjc2LCA2NTEsIDAsIC04NDApXSA9IGxbaSgxODMyLCA2OTAsIDE0NzUsIDAsIDc5MCldLCB0W28oMjc5MSwgMCwgMCwgMTk5OCldID0gbFtvKDQ3NCwgMCwgMCwgMjIwKV0sIHRbZigwLCAwLCAxNjMwLCAwLCAzMjYpXSA9IGxbaSg1ODcsIDE4ODksIDMzNiwgMCwgNDgpXSwgdFtpKDIzMCwgMTEzNywgMzI0LCAwLCAtODU1KV0gPSBsW28oMjY4NywgMCwgMCwgMjIwOCldLCB0W2MoMjcxNywgMjc3MCwgMzQwMywgMzI0NSldID0gbFtjKDEwNzEsIDExNSwgMTYzOCwgMTg3MCldLCB0W2YoMCwgMCwgMjI2NywgMCwgMTg0OCldID0gbFtvKDQyOSwgMCwgMCwgMTM5KV0sIHRbbyg4NTYsIDAsIDAsIDE4NDEpXSA9IGxbYygzMDE5LCAyNzA1LCAyODU3LCAyMTc5KV0sIHRbZigwLCAwLCAyMzg5LCAwLCAxOTkzKV0gPSBsW2YoMCwgMCwgMjE1OSwgMCwgMTMyMyldLCB0W3YoMTkzMywgMCwgMjU1NSldID0gbFtvKDIwOTQsIDAsIDAsIDI0MjMpXSwgdFtjKDI0MjksIDM2NDMsIDEyNzYsIDI3MDQpXSA9IGxbYygzMzM1LCAzMzEyLCAzNjc1LCAzODk5KV0sIHRbZigwLCAwLCAyNzkwLCAwLCAxOTUyKV0gPSBsW2koMTc1NiwgMTEzMiwgODg1LCAwLCAzMDY0KV0sIHRbaSg4NDgsIDczMywgMjE3OSwgMCwgMTE4NildID0gbFtpKDc5MiwgMzEwLCA1OTYsIDAsIDkzMCldLCB0W28oLTkxLCAwLCAwLCA5NSldID0gbFtvKDgwNCwgMCwgMCwgOTU3KV0sIHRbaSgxMTM4LCAyNjUsIDEzMzMsIDAsIDExOCldID0gbFtmKDAsIDAsIDE5MywgMCwgMTA1NildLCB0W3YoMTYwNCwgMCwgMTU5MyldID0gbFtjKDIyNjMsIDI1MTgsIDk2NiwgMzAzNildLCB0W2MoMTQ0MiwgMjQ5MiwgODQyLCAyMTM1KV0gPSBsW2MoMzQ3MiwgNDQ1MSwgMjE4NiwgMzg3NildLCB0W28oMTUyOCwgMCwgMCwgMTk5OSldID0gbFtpKDIwNjEsIDExMzQsIDExNTEsIDAsIDE0OTMpXSwgdFtjKDE1NDcsIDIzNjEsIDI1MzcsIDE4MDMpXSA9IGxbdigxNjE1LCAwLCAxOTIxKV0sIHRbYygyMjgwLCAxODQzLCAxOTcyLCAzMTQ5KV0gPSBsW2koMjE4NCwgMjQ3MSwgMTUyNCwgMCwgMTgxOCldLCB0W2MoMTE0MSwgLTE4MiwgMTU1MSwgMTQ4KV0gPSBsW3YoNTIsIDAsIC0xMTM5KV0sIHRbYygyMTU2LCAxOTgzLCAyMzQyLCAzMzQ2KV0gPSBsW28oNjE4LCAwLCAwLCAxMjc0KV0sIHRbaSg3MDAsIC01MiwgLTc4LCAwLCAtNDY2KV0gPSBsW28oLTQ0NCwgMCwgMCwgMjEyKV0sIHRbYygxNzg5LCAyODczLCAyMTg1LCAxMzU0KV0gPSBsW2MoMjM4MywgMTkxMCwgMTM1MiwgMjI1NCldLCB0W2YoMCwgMCwgMTQ4MSwgMCwgMTY1MildID0gbFt2KDEwLCAwLCAtMzcpXSwgdFt2KDQzNSwgMCwgMTczOCldID0gbFtvKDM0LCAwLCAwLCA2NDYpXSwgdFtvKDcwOSwgMCwgMCwgMTk0MCldID0gbFt2KDIzMTIsIDAsIDEwNjMpXSwgdFtvKDI4MCwgMCwgMCwgMjc1KV0gPSBsW2YoMCwgMCwgLTkzOSwgMCwgNDIpXSwgdFtmKDAsIDAsIDE5NDIsIDAsIDE4MjIpXSA9IGxbYyg5MjgsIDE0NCwgLTIxMCwgOTA3KV0sIHRbZigwLCAwLCAxMTUsIDAsIDg3MildID0gbFtpKDE3MTYsIDEyNjUsIDExOTEsIDAsIDQ5NildLCB0W3YoMTAyMiwgMCwgMjA3MyldID0gbFtpKDE1NjQsIDYxOCwgODc5LCAwLCAyNTk5KV0sIHRbdigtNDEsIDAsIC0xMjY5KV0gPSBsW2MoMzM2NSwgNDExMiwgMzEwOCwgMjIzMyldLCB0W2YoMCwgMCwgMTQ3OSwgMCwgMTgwMildID0gbFtjKDE1NTUsIDE2MjYsIDU4OCwgMTg0NyldLCB0W2koMTgyMiwgMTgyOSwgMTk1NywgMCwgMTI3MyldID0gbFtjKDE3MTIsIDMwMzUsIDE4MDQsIDIwNDcpXSwgdFtjKDE0NTIsIDE4MzEsIDIyNDMsIDE4MDUpXSA9IGxbYygxOTM5LCAxMTA0LCAxNDA1LCAyNzk5KV0sIHRbdigyMTE0LCAwLCAxMTc0KV0gPSBsW28oNjc4LCAwLCAwLCAxODc2KV0sIHRbdigxNDE3LCAwLCAzMjkpXSA9IGxbaSg2MzQsIDE2NDYsIDcwOCwgMCwgMTU1NildLCB0W2koMjI3MSwgMzQ1NSwgMjA2MywgMCwgOTg1KV0gPSBsW2MoOTczLCA0MzIsIDg4OCwgNDU4KV0sIHRbdig3NzQsIDAsIDgwMSldID0gbFtvKDE0NjUsIDAsIDAsIDExMDMpXSwgdFt2KDk2NywgMCwgMTM2NyldID0gbFtmKDAsIDAsIDkwMSwgMCwgMTMwMSldLCB0W3YoLTM1LCAwLCAtMTA4NCldID0gbFt2KDc2MywgMCwgMTg5NildLCB0W2MoMzUyNSwgMjMxNywgMzQxNywgMzQwNildID0gbFtjKDEzNTAsIDE0MzQsIDEzNTksIDExMjUpXSwgdFtpKDg1NywgMTE4MywgMTk3MSwgMCwgLTMwNyldID0gbFt2KDQzNywgMCwgODYzKV0sIHRbbyg0NzEsIDAsIDAsIDU2NyldID0gbFtmKDAsIDAsIDIwODQsIDAsIDE2NzgpXSwgdFtmKDAsIDAsIC00NTIsIDAsIDY5NCldID0gbFt2KDIxNzMsIDAsIDE2OTUpXSwgdFtmKDAsIDAsIDgyMSwgMCwgNTAxKV0gPSBsW2MoMjY3NiwgMzQ1OCwgMTc3NywgMjc0NSldLCB0W2koMTExNSwgMjAxNCwgMjMwLCAwLCAxNzQwKV0gPSBsW28oNTExLCAwLCAwLCAxMDMpXSwgdFt2KDIyMTcsIDAsIDE2OTQpXSA9IGxbdig0OTQsIDAsIC02NjApXSwgdFtvKDE3MjgsIDAsIDAsIDE4NTIpXSA9IGxbYygyNzMwLCAzMzI5LCAzOTY3LCAxNzg5KV0sIHRbZigwLCAwLCAyODMwLCAwLCAxOTc3KV0gPSBsW28oMjU1LCAwLCAwLCAxMDYwKV0sIHRbdig4MzIsIDAsIDk2KV0gPSBsW2koMTg4OCwgMjA3OCwgMTkxNiwgMCwgMTAzMSldLCB0W2koNDA1LCAxMDg2LCAxNDA3LCAwLCAtNjA1KV0gPSBsW2MoMjcwNywgMjU0OCwgMzUyNiwgMTc5MyldLCB0W28oNzQ2LCAwLCAwLCAxNzQ5KV0gPSBsW28oMTg4NiwgMCwgMCwgMTEyMCldLCB0W28oMjQ5NSwgMCwgMCwgMjA2NildID0gbFtpKDcxMSwgMTkyLCA3MjksIDAsIDE0MDgpXSwgdFt2KDIxLCAwLCA5KV0gPSBsW2koMTE0NiwgMjA0LCA0ODAsIDAsIDExNyldLCB0W28oNTE3LCAwLCAwLCAxMzkxKV0gPSBsW2koODE1LCAxNTc3LCAyOTUsIDAsIC00MjApXSwgdFtjKDMyNzUsIDM4NjcsIDI5OTMsIDI2NDgpXSA9IGxbZigwLCAwLCAxMTU3LCAwLCAxMjMzKV0sIHRbdig5MDQsIDAsIDg2KV0gPSBsW2MoMjQzNywgMjk4MCwgMTkyMSwgMjIxMyldLCB0W2YoMCwgMCwgODk3LCAwLCA1NzkpXSA9IGxbZigwLCAwLCA4NDYsIDAsIDEyMTYpXSwgdFtvKDIxNzAsIDAsIDAsIDI1MjgpXSA9IGxbbygzODEzLCAwLCAwLCAyNjA4KV0sIHRbaSgxOTU0LCAyNTA4LCAxMjQ0LCAwLCA2MzApXSA9IGxbZigwLCAwLCAyMzM1LCAwLCAyMTMxKV0sIHRbaSgxMjgxLCAzOTQsIDEwMDQsIDAsIDkxNCldID0gbFtjKDE2MjgsIDEwMTAsIDE5MzQsIDk4NyldLCB0W3YoMTkzNiwgMCwgMjI4NSldID0gbFtvKDMwODUsIDAsIDAsIDI0NDEpXSwgdFt2KDE5MjAsIDAsIDI5MDYpXSA9IGxbaSg1OTQsIDU4NCwgNjM2LCAwLCAxNTkyKV0sIHRbdigyODMsIDAsIDQ3MildID0gbFtjKDE1NjAsIDgzOCwgMjc1NywgMzcyKV0sIHRbbygyMTIzLCAwLCAwLCAxNzk0KV0gPSBsW2MoMzIwMSwgMjgxMiwgMjQwMiwgMTkwMCldLCB0W3YoMTMwLCAwLCA0OTEpXSA9IGxbdigxNDUzLCAwLCAyNDgxKV0sIHRbdig2NjEsIDAsIDExOTYpXSA9IGxbYyg5MDEsIDE5NzEsIDIwMzYsIDUwKV0sIHRbbygxOTY4LCAwLCAwLCAyMzUwKV0gPSBsW28oMjY0OSwgMCwgMCwgMTc3NildLCB0W28oMTQ3NywgMCwgMCwgMTAzMildID0gbFt2KDc1NywgMCwgMTkzKV0sIHRbbyg1NTksIDAsIDAsIDE2NDUpXSA9IGxbYygxMTUyLCAxMDgxLCAxMzk3LCA1NTIpXSwgdFtmKDAsIDAsIC0zNywgMCwgMTI4OSldID0gbFtmKDAsIDAsIC02NjMsIDAsIDUwNSldLCB0W2MoMTQ5NywgMTE3NCwgMjY5MywgMjc4KV0gPSBsW28oMTgxNywgMCwgMCwgODQxKV0sIHRbYygyNDAzLCAyMjA5LCAzMDg3LCAxODQxKV0gPSBsW2YoMCwgMCwgODE0LCAwLCA4NTApXSwgdFt2KDE4MzUsIDAsIDE3NzMpXSA9IGxbYygzMzY3LCAyMzg1LCAzNDI1LCA0MjY2KV0sIHRbYygxMjk0LCAyNDIxLCAyMTQzLCAxMTIxKV0gPSBsW3YoMTMzNiwgMCwgMTE2MyldLCB0W3YoNjcxLCAwLCAtMTgzKV0gPSBsW3YoMjA1NSwgMCwgMjc0MSldLCB0W2MoODc5LCAyMTUsIDg5OCwgOTYyKV0gPSBsW2koMTc4NywgNjc5LCAyMTEzLCAwLCAxNzA1KV0sIHRbaSgyNDA4LCAyNzgwLCAyMjgxLCAwLCAxMzczKV0gPSBsW2YoMCwgMCwgMTIyNCwgMCwgMTQ2NCldLCB0W28oLTMxNSwgMCwgMCwgMTIzKV0gPSBsW2YoMCwgMCwgLTc2NiwgMCwgMTQ3KV0sIHRbaSgzMTcsIDg4LCAxNDIsIDAsIDY3NyldID0gbFtpKDY0MywgMTg4NCwgMTg0NywgMCwgMTU1KV0sIHRbdigxMjk1LCAwLCAyNjY1KV0gPSBsW2koMjM3MCwgMTIxOCwgMzY0NywgMCwgMTg4NSldLCB0W2UoMTg0NCwgMCwgMjA3MyldID0gbFtjKDEwMzMsIDk1NiwgMTkwNCwgODExKV0sIHRbaSg3NDQsIDQ5NiwgNzY0LCAwLCAxNTU0KV0gPSBsW2koNDgxLCAxNTI5LCA2NywgMCwgNjEpXSwgdFtlKDE4ODIsIDAsIDI0NDApXSA9IGxbZigwLCAwLCAyMjM3LCAwLCAxNDg2KV0sIHRbbyg4MDIsIDAsIDAsIDI5NyldID0gbFtvKDExNTUsIDAsIDAsIDIxOTIpXSwgdFtjKDE2MzcsIDEyOTQsIDIwMTMsIDI0MzEpXSA9IGxbZSgtOTU4LCAwLCAxMDMpXSwgdFtmKDAsIDAsIDk1MCwgMCwgMjA4NyldID0gbFtpKDcyNSwgMTgxOSwgNzAwLCAwLCA5MzkpXSwgdFtpKDE3MjMsIDIyMDUsIDQ1NywgMCwgODQ1KV0gPSBsW2YoMCwgMCwgNDg2LCAwLCAxZTMpXSwgdFtvKDI5MzcsIDAsIDAsIDI3MDkpXSA9IGxbYygxMTIzLCA0OTEsIDcxMSwgMjMzNCldLCB0W2UoLTIzOSwgMCwgLTEyNSldID0gbFtvKDIyOTEsIDAsIDAsIDIyOTgpXSwgdFtlKC0zMDQsIDAsIDExNildID0gbFtpKDIyOTEsIDIyNDAsIDI2NDMsIDAsIDIyNTgpXSwgdFtvKDM0NywgMCwgMCwgMTIyMSldID0gbFtvKDIxODgsIDAsIDAsIDEzMDIpXSwgdFtmKDAsIDAsIDIwNTMsIDAsIDIyMDUpXSA9IGxbbygxOTA5LCAwLCAwLCAyNzUwKV0sIHRbZigwLCAwLCAtMTM1LCAwLCAxMDM1KV0gPSBsW2UoMzEzMiwgMCwgMTg0MyldLCB0W2MoMTk1MywgMzI2OSwgMTY5MSwgMjQ1OCldID0gbFtvKDIxMTgsIDAsIDAsIDE4OTQpXSwgdFtmKDAsIDAsIDMwOTEsIDAsIDIyMjIpXSA9IGxbZSgtNjY3LCAwLCA5MCldLCB0W2MoMzMyMywgMjkzMiwgMjgwNCwgMjM2MSldID0gbFtjKDIzMzksIDMwOTMsIDE3MzQsIDMyNjgpXSwgdFtjKDE4OTQsIDU2MCwgMjM2OSwgMzExNyldID0gbFtmKDAsIDAsIC0xNzAsIDAsIDQwMCldLCB0W2koMTgwOSwgMTM2OSwgMTE2MSwgMCwgMjg0OSldID0gbFtvKDE5ODIsIDAsIDAsIDE0NTUpXSwgdFtjKDI5MzMsIDMyMzEsIDI2MDYsIDM5NjEpXSA9IGxbYygyNTk3LCAyOTcxLCAxMzMwLCAyMjI4KV0sIHRbbyg2OTksIDAsIDAsIDE3NzIpXSA9IGxbaSgxMDAyLCAxOTE1LCAyNzMsIDAsIDIyNTkpXSwgdFtvKDMyNDgsIDAsIDAsIDE5NTcpXSA9IGxbZigwLCAwLCAtMTAzNywgMCwgLTMxOSldLCB0W2MoMzI2NCwgMjM4NCwgNDM0NCwgMjE2MCldID0gbFtvKDIxMDUsIDAsIDAsIDE4MzEpXSwgdFtmKDAsIDAsIDI1OTQsIDAsIDIyNTkpXSA9IGxbbygzMzE1LCAwLCAwLCAyMDk2KV0sIHRbZSgxNjg0LCAwLCAyMzg5KV0gPSBsW2koOTEsIDEzOTAsIDQ3NiwgMCwgLTc3NCldLCB0W2YoMCwgMCwgMTc0MiwgMCwgODc0KV0gPSBsW28oMTg0NSwgMCwgMCwgNzUwKV0sIHRbZigwLCAwLCAxNzgyLCAwLCAxMzExKV0gPSBsW28oOTc3LCAwLCAwLCAxMDcpXSwgdFtvKDgyMywgMCwgMCwgMTUzNCldID0gbFtlKDE5NDksIDAsIDYxNSldLCB0W2UoMTUzOSwgMCwgMjA4NCldID0gbFtvKDE3ODcsIDAsIDAsIDY1MyldLCB0W2YoMCwgMCwgMTU0OCwgMCwgMjI0OCldID0gbFtvKDIzMDgsIDAsIDAsIDE4NjEpXSwgdFtvKC0zNDYsIDAsIDAsIDU2MildID0gbFtjKDEzMTQsIDcwNiwgMTU0NSwgMTkyNCldLCB0W2MoMzA1NiwgNDE2MiwgNDEyMSwgMTc0MildID0gbFtpKDY2NCwgMTQ1MSwgLTQ4MywgMCwgNDg5KV0sIHRbZigwLCAwLCAxMDUzLCAwLCAxNzg2KV0gPSBsW2YoMCwgMCwgLTI3NSwgMCwgMTA2NCldLCB0W2UoMTkzOCwgMCwgMjE2OSldID0gbFtmKDAsIDAsIDE4NSwgMCwgNjIwKV0sIHRbYygzMTcyLCAyMDgwLCA0MDA2LCA0MjA2KV0gPSBsW2koMTk5NywgMjQyOSwgMzE3MSwgMCwgMTM2MyldLCB0W2koNTI0LCAxMjI3LCA4NDQsIDAsIC03ODIpXSA9IGxbaSgtODYsIDEwOTYsIDU0MywgMCwgNjAzKV0sIHRbYygzMDAzLCAzODc1LCAxNzAyLCAyMzMxKV0gPSBsW2YoMCwgMCwgLTEwMzIsIDAsIDIzMyldLCB0W28oODMxLCAwLCAwLCAyMDY5KV0gPSBsW2UoMTY3MCwgMCwgNTI3KV0sIHRbZSgxNTc3LCAwLCA3MjMpXSA9IGxbYygyNzY2LCAyNTc1LCAyMjk2LCAzOTYyKV0sIHRbaSgyMjI0LCAyMDM4LCAxMTE4LCAwLCAzMzcwKV0gPSBsW2koLTEyMSwgMTA0LCA0NTksIDAsIC00MTUpXSwgdFtvKDY3MCwgMCwgMCwgOTEwKV0gPSBsW2koMjM1NSwgMTA2MSwgMjg5NCwgMCwgMTgyMCldLCB0W2YoMCwgMCwgLTM4NSwgMCwgNzU3KV0gPSBsW2UoMjIzNSwgMCwgMTMyMSldLCB0W2UoODE3LCAwLCAxODExKV0gPSBsW2MoMjI4MiwgMzQxMSwgMzYyMCwgMTgyOSldLCB0W2YoMCwgMCwgLTU1MSwgMCwgMTMyKV0gPSBsW28oMzE2NSwgMCwgMCwgMjUyMCldLCB0W2koMTcyMiwgMTg1NCwgMjk5NywgMCwgMTEzNyldID0gbFtmKDAsIDAsIDI1MjAsIDAsIDE1ODYpXSwgdFtvKDE2MSwgMCwgMCwgODkpXSA9IGxbZSgtOTUxLCAwLCA1MildLCB0W2UoLTEzOCwgMCwgMjcwKV0gPSBsW2MoMzQwOCwgMzg5MCwgNDYzMCwgMzkxNyldLCB0W2YoMCwgMCwgLTY3MiwgMCwgLTM3MCldID0gbFtlKDM2NzUsIDAsIDIzMzQpXSwgdFtjKDMyMTcsIDI2NjIsIDQyMjUsIDMxMjApXSA9IGxbZSgyMzY1LCAwLCAxNjgwKV0sIHRbaSgyMzQsIDY1NywgLTgsIDAsIC0yNDgpXSA9IGxbaSgyMDcwLCAyMDc3LCAzMTAyLCAwLCAyMzA1KV0sIHRbaSgyMzQ0LCAxMjI1LCAxMzc2LCAwLCAzMzg3KV0gPSBsW2MoMzE2NywgMjA3NCwgMzc5NywgNDQ3NSldLCB0W2UoODkwLCAwLCAyMDUyKV0gPSBsW2koODE3LCAyMDY4LCA4NywgMCwgMTcyMyldLCB0W2UoLTM0LCAwLCAtMTM3KV0gPSBsW28oMzI5LCAwLCAwLCA5OTcpXSwgdFtvKDIzMTksIDAsIDAsIDIyNzMpXSA9IGxbYygxNjQ4LCAyMTQ2LCA2NTMsIDY4MildLCB0W2MoMTEwNSwgOTg1LCAxMzIwLCA5NjgpXSA9IGxbbygyMjMyLCAwLCAwLCAxMDU0KV0sIHRbZSgyMDk0LCAwLCAxOTM2KV0gPSBsW2YoMCwgMCwgMjQ4NCwgMCwgMTk5OSldLCB0W2UoLTM1NCwgMCwgNTQzKV0gPSBsW2YoMCwgMCwgMjQ0MywgMCwgMTE1NSldLCB0W2MoMTYxNCwgMTI0NCwgMjc4LCA4MTApXSA9IGxbaSgxNTEzLCA2MjIsIDI0NzcsIDAsIDI4NyldLCB0W28oNjEsIDAsIDAsIDEyMzgpXSA9IGxbaSg2NjksIDM0LCA4MDQsIDAsIDEzODkpXSwgdFtvKDI3ODEsIDAsIDAsIDIyNzcpXSA9IGxbZigwLCAwLCA3ODQsIDAsIDE5NDApXSwgdFtlKC03ODksIDAsIC05OCldID0gbFtjKDMzNjAsIDI1MDUsIDQyNjEsIDI0ODcpXSwgdFtlKDE4MjMsIDAsIDE0MDUpXSA9IGxbbygtMjMwLCAwLCAwLCAxMDE3KV0sIHRbbygxMjQwLCAwLCAwLCA4NDIpXSA9IGxbZigwLCAwLCAyMTc4LCAwLCAxMzU3KV0sIHRbYygyODg1LCAzNzYwLCAzMDIzLCAzOTUyKV0gPSBsW2koMzcxLCAtMjI5LCAtOTUsIDAsIC03NDkpXSwgdFtjKDMzOTMsIDI2MDAsIDIwNjIsIDI1NzMpXSA9IGxbZigwLCAwLCAxODkyLCAwLCAyMDQ4KV0sIHRbbygtMTkzLCAwLCAwLCA0MTIpXSA9IGxbaSgyNDM3LCAzNjcxLCAyOTY2LCAwLCAzNjY1KV0sIHRbaSgxMTQxLCAxOTcyLCAxMzQyLCAwLCAyNDgxKV0gPSBsW2UoNzIsIDAsIDQxNyldLCB0W2koMjAzMCwgMzM0MCwgMTgzNCwgMCwgMTY3MCldID0gbFtpKDE2NTYsIDIyOTAsIDIyOTMsIDAsIDYyMCldLCB0W2UoLTg2MiwgMCwgLTUpXSA9IGxbbygyNzY3LCAwLCAwLCAyNDA1KV0sIHRbbygxOTUwLCAwLCAwLCAxMzg5KV0gPSBsW2MoMjA2OCwgMzE5MSwgMTYwNSwgMTQ2NildLCB0W2koMjQ3NCwgMTcxMCwgMzQyNiwgMCwgMjg0MildID0gbFtmKDAsIDAsIDIwOTksIDAsIDg5MildLCB0W2YoMCwgMCwgLTEyODEsIDAsIC0xNDApXSA9IGxbYygzMTQ2LCA0MzY5LCAzNjA2LCAyODU5KV0sIHRbYygzNDY3LCAyNTAzLCAzNDE4LCAyNzY0KV0gPSBsW2UoMzMzNSwgMCwgMjAyOSldLCB0W2UoMTQ3MywgMCwgODUzKV0gPSBsW2MoMjM5NywgMTg1NCwgMzcyMCwgMjYxNildLCB0W2YoMCwgMCwgLTkxNCwgMCwgLTg4KV0gPSBsW2MoMzUxMSwgMzIwMCwgMzczOCwgMjk1NildLCB0W28oMzEzMiwgMCwgMCwgMjI1NyldID0gbFtpKDc3LCA5NTYsIC0xMDY3LCAwLCA1OTIpXSwgdFtmKDAsIDAsIDI2ODQsIDAsIDE5NzUpXSA9IGxbaSgxNDMzLCAxODA5LCAyMzksIDAsIDYyMCldLCB0W2koMjE5NCwgMjMyMCwgMjAzNiwgMCwgMzUxMSldID0gbFtmKDAsIDAsIDQxLCAwLCAxMTYyKV0sIHRbZSgyNDgzLCAwLCAyMDQxKV0gPSBsW2UoMTkzMywgMCwgMjAxMildLCB0W2koMTQyOCwgMjY5NSwgMjI2NCwgMCwgOTAxKV0gPSBsW2UoMzM2NSwgMCwgMjM4MSldLCB0W2MoMjIwMywgMTE5MCwgMzM5MiwgMTU1NildID0gbFtvKDI4MTMsIDAsIDAsIDE1ODEpXSwgdFtvKDE1MDcsIDAsIDAsIDQ0MCldID0gbFtmKDAsIDAsIC02OTcsIDAsIDUwMCldLCB0W2UoMjE1NywgMCwgMjEzMildID0gbFtpKDIxMzcsIDg2NiwgMzQ3OSwgMCwgMzEwNildOyBpZiAobFtlKDE2MDYsIDAsIDExNzkpXShsW28oLTE3MCwgMCwgMCwgNjAzKV0sIGxbaSgzNzIsIC02MjcsIDEyMTUsIDAsIDI0NyldKSkgcmV0dXJuIGxbZigwLCAwLCAxMzg0LCAwLCA1NTApXShuLCB1LCByKTsgdmFyIGEgPSBbdFtlKC05NjksIDAsIDMyKV0sIHRbZigwLCAwLCAyMDEsIDAsIDk3MildLCB0W2MoMTYwMCwgMjcxOCwgMzczLCAxNzk4KV0sIHRbaSgtNzEsIC0yMDEsIDExMTcsIDAsIC00OTIpXSwgdFtlKDIwODYsIDAsIDE3NTUpXSwgdFtmKDAsIDAsIDEwMTYsIDAsIDI0NyldLCB0W2YoMCwgMCwgLTUxMCwgMCwgNzA2KV0sIHRbYygxMjgzLCA0NDQsIDg5OSwgMzU4KV0sIHRbbygxMDgyLCAwLCAwLCAxNzQpXSwgdFtlKDExNzcsIDAsIDEzMDkpXSwgdFtjKDI2ODIsIDMyMTYsIDEzNTMsIDM0MzgpXSwgdFtmKDAsIDAsIDkyNywgMCwgMTMzOCldLCB0W2koMjIxLCAtMzk0LCA4NjEsIDAsIC04MzQpXSwgdFtpKC0zNiwgLTMwNiwgOTg3LCAwLCAtODUxKV0sIHRbYygxNTk5LCAyNTEyLCAxNTMzLCAyMDQ3KV0sIHRbbygxMDkxLCAwLCAwLCA5NTUpXSwgdFtvKDg0MiwgMCwgMCwgMzM3KV0sIHRbYygxNTc3LCAxNjg0LCAxMzUxLCAyODE4KV0sIHRbZigwLCAwLCAtMjYzLCAwLCAtMzU2KV0sIHRbZigwLCAwLCAtMTA3MiwgMCwgLTIxNyldLCB0W2koODM1LCAxNTUwLCAtNiwgMCwgNDkwKV0sIHRbZSgtNDk3LCAwLCA1MjMpXSwgdFtjKDI3NzgsIDIzODAsIDE1OTAsIDMyNzQpXSwgdFtlKC0yNjQsIDAsIDY2OSldLCB0W2UoNzI4LCAwLCAtMTkwKV0sIHRbZSgyNTc0LCAwLCAxMzE5KV0sIHRbaSgyMjksIDk2MSwgLTUzMSwgMCwgLTEwMjkpXSwgdFtjKDEzMzQsIDE5MiwgMjM3OSwgMTY2MildLCB0W2YoMCwgMCwgMTAsIDAsIDEwNjcpXSwgdFtlKDE1OTYsIDAsIDEyNzYpXSwgdFtmKDAsIDAsIDE0MzUsIDAsIDE5NjMpXSwgdFtpKDExMTgsIDgxMywgMTYwMSwgMCwgMTgzNildLCB0W2koMTA3NSwgMjE4NiwgOTA0LCAwLCAtMTQxKV0sIHRbaSgyNDUwLCAzMTg4LCAyMTEyLCAwLCAxMzI1KV0sIHRbYygyMjcwLCAzMTcwLCAxMzg3LCAyNTk2KV0sIHRbZigwLCAwLCAxMDMsIDAsIDcyMSldLCB0W2MoMjUzNiwgMzg3MiwgMTcxOSwgMjg1MildLCB0W28oMTU0NywgMCwgMCwgMjA4OSldLCB0W2YoMCwgMCwgMTQyNiwgMCwgOTkyKV0sIHRbbygyMzAyLCAwLCAwLCAyMjIxKV0sIHRbYygyMDI0LCAzMTA5LCAyOTMzLCAzMTEzKV0sIHRbaSgxODQ4LCAxNzIwLCAzMDI4LCAwLCAyNTg3KV0sIHRbZigwLCAwLCAxMjYxLCAwLCAxNDM3KV0sIHRbZigwLCAwLCAxNjU4LCAwLCA3ODcpXSwgdFtjKDMxNTMsIDMwMTEsIDMwODcsIDQwOTIpXSwgdFtmKDAsIDAsIDMwMiwgMCwgMTE5NyldLCB0W2YoMCwgMCwgMTQzMSwgMCwgMTgyMCldLCB0W2MoMTY0NywgMjM1NCwgMTM3MiwgNDI2KV0sIHRbZigwLCAwLCAtMjEzLCAwLCA5NzcpXSwgdFtjKDE4OTcsIDE0NzAsIDE4NDMsIDE3ODkpXSwgdFtjKDM1MjgsIDMwMDQsIDIyMjIsIDQ3MzYpXSwgdFtlKDg1MSwgMCwgMTAwOSldLCB0W2koMTYzLCAtMTE3MywgLTEwOTQsIDAsIDU4NSldLCB0W28oMjQ2NCwgMCwgMCwgMTk4MyldLCB0W2MoMjQ2NiwgMTc1NSwgMzA5MiwgMzM4OSldLCB0W2MoMjk4MCwgMjMzNiwgMTY0OCwgMzA4NildLCB0W28oMjg5NCwgMCwgMCwgMjI0NildLCB0W2MoMTIzMCwgODI4LCA5MzYsIDIxODcpXSwgdFtmKDAsIDAsIDYzNiwgMCwgMTQzMCldLCB0W2koMTAwNiwgNTQ4LCAxMTM2LCAwLCAxNjY3KV0sIHRbbygzMTg2LCAwLCAwLCAyMzQxKV0sIHRbaSgxMjE3LCA5OCwgOTQ0LCAwLCA0NjQpXSwgdFtmKDAsIDAsIDE1OTMsIDAsIDE1OTYpXSwgdFtmKDAsIDAsIDEyMzgsIDAsIDE2KV0sIHRbbygzMDE2LCAwLCAwLCAyMjY5KV0sIHRbaSgxMjc2LCAxMzQ5LCAxMzU4LCAwLCAxOTgyKV0sIHRbbygxMzc4LCAwLCAwLCAxNTIpXSwgdFtmKDAsIDAsIDQzMSwgMCwgMTE5OCldLCB0W2UoMTEyMywgMCwgMTAyNSldLCB0W2UoMTY4LCAwLCA1MTcpXSwgdFtjKDEzMzksIDMyMCwgMTUzMywgMTYzKV0sIHRbYygyNjIxLCAyMzcxLCAxODMzLCAyNDY2KV0sIHRbbyg5NzMsIDAsIDAsIDE3MzEpXSwgdFtpKC0xMzMsIC0xMzE3LCA5ODcsIDAsIC0xNDU4KV0sIHRbbygtNDc4LCAwLCAwLCA1ODkpXSwgdFtvKDg4OCwgMCwgMCwgMTk5OCldLCB0W2YoMCwgMCwgNzg3LCAwLCAzMjYpXSwgdFtjKDEyNTQsIDg0NiwgLTYsIDU1NildLCB0W2MoMjcxNywgMjcxMywgMzc4MCwgMTk1OCldLCB0W2YoMCwgMCwgMjY2NiwgMCwgMTg0OCldLCB0W2UoMTI5MCwgMCwgMTUxMSldLCB0W2YoMCwgMCwgMjk3NSwgMCwgMTk5MyldLCB0W2MoMzEwMCwgNDMxMywgNDQyMywgNDA2MSldLCB0W2UoMTIwNCwgMCwgMTMwNildLCB0W2UoMjUzNCwgMCwgMjEwOCldLCB0W2UoMTQ0MSwgMCwgNzQ5KV0sIHRbaSgtMTM2LCAtMTM3NiwgNDE2LCAwLCAtNzY5KV0sIHRbbygxODkzLCAwLCAwLCAxMzY5KV0sIHRbZSgxNTE0LCAwLCAxNjQ4KV0sIHRbaSg0MTgsIDc3MiwgMTQ4NywgMCwgNTc0KV0sIHRbZigwLCAwLCAzNjIsIDAsIDE1MTMpXSwgdFtpKDUyMywgLTI4MCwgMTIxMiwgMCwgNzMzKV0sIHRbZSgtODEsIDAsIDExNTcpXSwgdFtjKDExNDEsIDEwNDYsIDIyNDMsIDk1OCldLCB0W28oODUwLCAwLCAwLCAxMzYzKV0sIHRbZigwLCAwLCAtMTgzLCAwLCA0NDUpXSwgdFtpKDc2NSwgMjA5MSwgMTcwNCwgMCwgMzA0KV0sIHRbZSgxNDUxLCAwLCAxODA4KV0sIHRbbygyMDcsIDAsIDAsIDgwOSldLCB0W2YoMCwgMCwgOTg3LCAwLCAxNDU0KV0sIHRbYygxMDY4LCAxODEsIDE5MjEsIC0yNDMpXSwgdFtmKDAsIDAsIDMwNDEsIDAsIDE4MjIpXSwgdFtjKDIxNTEsIDg0MSwgMjI4MywgMjE4OSldLCB0W2YoMCwgMCwgNzk3LCAwLCA5MTApXSwgdFtvKC0xMDA0LCAwLCAwLCAzMzMpXSwgdFtmKDAsIDAsIDI2MTYsIDAsIDE4MDIpXSwgdFtpKDE4MjIsIDc5MiwgMjEyMywgMCwgMjU1NSldLCB0W2MoMTQ1MiwgMTQxMCwgMTUyMiwgMjQxNCldLCB0W2UoMTY3MSwgMCwgMjE1OCldLCB0W2MoMjU4NCwgMzQ4NywgMTQ0NywgMTYxMildLCB0W2koMjI3MSwgMzQ4MiwgMzE4MCwgMCwgMTMwMyldLCB0W28oNzMsIDAsIDAsIDExNDgpXSwgdFtlKDU3MiwgMCwgMTAxMSldLCB0W2MoMTEzMiwgMjQ0MywgMjI3MSwgMTE1MyldLCB0W2MoMzUyNSwgMjE5MywgNDE5MywgNDE1OSldLCB0W2UoNzA0LCAwLCA3NTgpXSwgdFtvKDY3OSwgMCwgMCwgNTY3KV0sIHRbYygxOTczLCAxNjY4LCAyMTIyLCA4MzUpXSwgdFtlKDEwMDEsIDAsIDY1NyldLCB0W2koMTExNSwgLTQyLCA5MzksIDAsIC0xMTIpXSwgdFtvKDE4OTMsIDAsIDAsIDI1OTEpXSwgdFtlKDIwNiwgMCwgMTUyMildLCB0W2UoMTAzMSwgMCwgMjEzMyldLCB0W2YoMCwgMCwgMTk1MiwgMCwgNzIwKV0sIHRbbygxNDIxLCAwLCAwLCA2MzYpXSwgdFtjKDI1NDIsIDM3NTAsIDE4NTIsIDMxOTApXSwgdFtvKDk5NSwgMCwgMCwgMjA2NildLCB0W28oMTQsIDAsIDAsIDM5NSldLCB0W2UoMTM3NSwgMCwgMTA2MSldLCB0W2koMjI1MSwgMjgzMSwgMzE4MiwgMCwgMjIwNildLCB0W2UoNzU5LCAwLCA5NDgpXSwgdFtvKDMzMCwgMCwgMCwgMTA2NSldLCB0W28oMzI2MSwgMCwgMCwgMjUyOCldLCB0W2UoMjEyNSwgMCwgMTg1NSldLCB0W2koMTI4MSwgLTQ3LCA5MzAsIDAsIDE0NjMpXSwgdFtjKDMxMDMsIDI0OTUsIDMyMjAsIDQzMDcpXSwgdFtlKDI3MDIsIDAsIDE5NjQpXSwgdFtjKDE0NTAsIDcxOCwgNDU2LCAxMTQzKV0sIHRbaSgxNTYzLCA5ODcsIDcwOSwgMCwgMjU5OCldLCB0W2koMjczLCA1MDgsIDEyNiwgMCwgLTQpXSwgdFtjKDE4MjgsIDI2MTIsIDkyNCwgMjg1OSldLCB0W28oMzAwNSwgMCwgMCwgMjM1MCldLCB0W2MoMTgyNSwgNzk3LCAyMjYwLCA3MzcpXSwgdFtvKDEwODksIDAsIDAsIDE2NDUpXSwgdFtpKDE1NDQsIDExMTAsIDY3NywgMCwgMjQ1OCldLCB0W28oLTE2OCwgMCwgMCwgNzA0KV0sIHRbZigwLCAwLCA1MzUsIDAsIDExMjQpXSwgdFtlKDIyNzAsIDAsIDE4NzkpXSwgdFtpKDI3MCwgLTYwOSwgNDgwLCAwLCAxMzgzKV0sIHRbZigwLCAwLCAxMzg2LCAwLCA1NTkpXSwgdFtvKC0xMDM0LCAwLCAwLCA4NildLCB0W2YoMCwgMCwgMjgxNiwgMCwgMjE1MyldLCB0W28oMzc4LCAwLCAwLCAxMjMpXSwgdFtpKDMxNywgLTM2MiwgLTczNSwgMCwgLTIzMyldLCB0W2koMTQzOCwgMzk0LCAxNzkyLCAwLCAxMDczKV0sIHRbbygxMjk5LCAwLCAwLCAyNDAzKV0sIHRbYygxNzY4LCAxMDg1LCA2NzYsIDI1NTYpXSwgdFtvKDI2NjcsIDAsIDAsIDI3NzApXSwgdFtpKDY2LCA3MzgsIDEwMDEsIDAsIDE0NCldLCB0W28oODU5LCAwLCAwLCA4NDQpXSwgdFtvKDE2MDMsIDAsIDAsIDI1NzMpXSwgdFtmKDAsIDAsIDEyNDAsIDAsIDE0NjgpXSwgdFtjKDM1MDIsIDI0NTYsIDI5NDYsIDQwMjEpXSwgdFtvKDY1MywgMCwgMCwgMjA1KV0sIHRbZSgtMTExMiwgMCwgMTE2KV0sIHRbZSg0MjAsIDAsIDg5MSldLCB0W2koMjQ2MCwgMzA0NiwgMzYwNywgMCwgMjg5NSldLCB0W28oNDI4LCAwLCAwLCAxNTIxKV0sIHRbbyg0NTIsIDAsIDAsIDExNjApXSwgdFtlKDE1MDEsIDAsIDIzNzgpXSwgdFtmKDAsIDAsIDMwMDUsIDAsIDIwNDQpXSwgdFtmKDAsIDAsIDE5NiwgMCwgNjE1KV0sIHRbaSgxODA5LCAyNzc4LCA4MTUsIDAsIDI3OTMpXSwgdFtlKDExNDYsIDAsIDE4MTApXSwgdFtjKDI1NjUsIDMzOTcsIDI3MzcsIDI3MDcpXSwgdFtlKDIyNDAsIDAsIDE2MjcpXSwgdFtvKDIwMzgsIDAsIDAsIDI0NzEpXSwgdFtpKDI1MTQsIDIxNDcsIDMyNDgsIDAsIDIyOTcpXSwgdFtvKDM5OTYsIDAsIDAsIDI3MTkpXSwgdFtmKDAsIDAsIDIwODEsIDAsIDg3NCldLCB0W2MoMjU5MCwgMzQxNSwgMTU1OCwgMjY1MSldLCB0W2YoMCwgMCwgNTEzLCAwLCAxMDQ4KV0sIHRbbygyMTYwLCAwLCAwLCAyNDE0KV0sIHRbZigwLCAwLCAyMzM3LCAwLCAyMjQ4KV0sIHRbbyg0NDksIDAsIDAsIDU2MildLCB0W2koMjAzMiwgMTM3NywgMjQ1OCwgMCwgMzE0NSldLCB0W2koMjA0MSwgMTQ0MiwgMjE3NSwgMCwgOTE0KV0sIHRbZSgxMDI0LCAwLCAyMTY5KV0sIHRbZSgyOTkzLCAwLCAyMDQ5KV0sIHRbaSg1MjQsIDk5MCwgLTE0MCwgMCwgMzQpXSwgdFtmKDAsIDAsIDI1NDIsIDAsIDE3MjQpXSwgdFtjKDI4NjIsIDE3MDcsIDM2OTAsIDIyNTEpXSwgdFtpKDgyMiwgNTQwLCA4MTQsIDAsIC0yMzIpXSwgdFtmKDAsIDAsIDE2MTAsIDAsIDE5NjkpXSwgdFtmKDAsIDAsIC0zNzksIDAsIDQyNCldLCB0W2koMTAxMiwgMjA1LCAxMjc1LCAwLCAyMTE2KV0sIHRbYygyOTM0LCAyODcwLCAyNjY1LCAyODExKV0sIHRbaSgzODcsIDEyOTQsIC02OTUsIDAsIDEzOSldLCB0W2koMTcyMiwgMjcxMSwgMTM2MywgMCwgMTI1MSldLCB0W28oLTEwMDMsIDAsIDAsIDg5KV0sIHRbaSgzNjksIDE2NTYsIC0zNTUsIDAsIC0xOTgpXSwgdFtlKDY3OSwgMCwgLTIxNCldLCB0W28oMjE0NywgMCwgMCwgMjQyNCldLCB0W2MoMTI1OCwgNjY2LCAxODM3LCAyMDQwKV0sIHRbYygzMzY4LCA0MDk1LCAzOTYxLCAzMzczKV0sIHRbZSgyOTE3LCAwLCAyMDUyKV0sIHRbZSgxMDIyLCAwLCAtMTM3KV0sIHRbZigwLCAwLCAxMTUxLCAwLCAxNzg3KV0sIHRbbygtNzI4LCAwLCAwLCAzMTIpXSwgdFtvKDM1MzQsIDAsIDAsIDIyNjYpXSwgdFtvKDMzNiwgMCwgMCwgODczKV0sIHRbZSgtNjMyLCAwLCA0OTEpXSwgdFtlKDg1LCAwLCA5MDgpXSwgdFtmKDAsIDAsIDI1MjUsIDAsIDE3OTEpXSwgdFtjKDEwMjUsIDI4NywgLTIzNiwgMjEzNSldLCB0W2MoMjUyOCwgMzMwNywgMTUwMywgMTQyMildLCB0W2MoMTYzNSwgMTU3MywgMzY2LCA3MDcpXSwgdFtmKDAsIDAsIDI1MTIsIDAsIDE2MDYpXSwgdFtlKDE3MDgsIDAsIDIyNzApXSwgdFtvKDEzMDEsIDAsIDAsIDQxMildLCB0W28oMTkyLCAwLCAwLCAxMzcyKV0sIHRbZigwLCAwLCAxNTY2LCAwLCAxNzc1KV0sIHRbYygxMTE4LCAxODAxLCAxMDM3LCAyMzc2KV0sIHRbbygyMDY2LCAwLCAwLCAxMzg5KV0sIHRbaSgyNDc0LCAyMzI5LCAxMzQzLCAwLCAzMDY4KV0sIHRbaSgxMTUsIDkyOCwgLTUxMywgMCwgMTMwNyldLCB0W2UoMzUyNiwgMCwgMjM0NCldLCB0W2UoMTU2MywgMCwgODUzKV0sIHRbbygyMTUsIDAsIDAsIDM5OCldLCB0W2YoMCwgMCwgMTY0OSwgMCwgMTc3MSldLCB0W2koMjIzMCwgOTg0LCAxNTQzLCAwLCAzNTI0KV0sIHRbZigwLCAwLCAxNDU3LCAwLCAxOTM5KV0sIHRbbygxOTEzLCAwLCAwLCAyMzcxKV0sIHRbbygxMTg2LCAwLCAwLCAxNjU5KV0sIHRbaSgxMTc5LCAxOTEzLCAxNDAwLCAwLCA3NzcpXSwgdFtvKDc2NCwgMCwgMCwgNDQwKV0sIHRbZigwLCAwLCAxMTE4LCAwLCAxOTc2KV1dOyByZXR1cm4gKFMgPSBmdW5jdGlvbiBTKCl7IHJldHVybiBhOyB9KSgpOyB9LCBUYmlreTogZnVuY3Rpb24gVGJpa3kobiwgcil7IGZ1bmN0aW9uIHQobiwgdSwgciwgdCwgZSl7IHJldHVybiBLKDAsIG4sIHIgLSAxNDMsIHQgLSAyODEsIGUgLSA0MzApOyB9IHZhciBlID0geyBEZXJseTogZnVuY3Rpb24gRGVybHkobiwgciwgdCl7IHJldHVybiBTW3UoMTE3MiwgMjQzMSldKG4sIHIsIHQpOyB9LCB2eVJhZDogZnVuY3Rpb24gdnlSYWQobiwgcil7IHJldHVybiBTW3UoMTczNSwgNjIyKV0obiwgcik7IH0gfTsgcmV0dXJuIFNbcCgwLCAxNDkyIC0gMTE5OSwgMCwgMCwgMTIyMildKFNbdCg4MDUsIDAsIDIyOTUsIDE0MDUsIDE5MzkpXSwgU1t0KDE5MzksIDAsIDMyMTEsIDMyNzMsIDQzNjYpXSkgPyBTW3QoMzE5NSwgMCwgMjczNCwgMjc1NywgMTkyMildKG4sIHIpIDogZVt2KDI4NTAgLSA3OTQsIDAsIDE2MzIpXShFLCBlW3QoNDA2NSwgMCwgMjQxMiwgMzY3MCwgNDk0OCldKF9MLCAtOTI1KSwgSCk7IH0gfTsgcmV0dXJuIGNbU1tLKDAsIDI3ODgsIDE2MjQsIDE1MTcsIDExMjYpXShfTCwgNTI3LCA1MildKHEsIGNbU1t2KDE5MTYsIDAsIDEyNTUpXShfTCwgNDYwLCAtMTEyKV0odCwgODU1KSwgaSk7IH0gZnVuY3Rpb24gWShuLCByKXsgcmV0dXJuIHUociAtIDQwLCBuKTsgfSBmdW5jdGlvbiBxKG4sIHIpeyB2YXIgbCA9IHsgWGplb206IGZ1bmN0aW9uIFhqZW9tKG4sIHIpeyByZXR1cm4gU1t1KDU1NCwgNjE5KV0obiwgcik7IH0sIElITlFzOiBmdW5jdGlvbiBJSE5RcyhuLCByKXsgcmV0dXJuIFNbdSgyNTcxLCAyNzY5KV0obiwgcik7IH0sIFJMRVNyOiBmdW5jdGlvbiBSTEVTcihuLCByLCB0KXsgcmV0dXJuIFNbdSgxNDE0LCAxMzQyKV0obiwgciwgdCk7IH0sIGdLU0t3OiBmdW5jdGlvbiBnS1NLdyhuLCByKXsgcmV0dXJuIFNbdSg3OTMsIDIwNDYpXShuLCByKTsgfSwgWnhyV3o6IGZ1bmN0aW9uIFp4cld6KG4sIHIpeyByZXR1cm4gU1t1KDEwMTYsIDMzOCldKG4sIHIpOyB9LCBMSHhOZTogU1tRKDI1MzUsIDExNTYsIDE3ODIsIDAsIDE2MjgpXSwgdUxyZmo6IGZ1bmN0aW9uIHVMcmZqKG4peyByZXR1cm4gU1tRKDEzNDQgLSAyNTAsIDE5NzMsICh1ID0gMTE4MykgLSAzNDYsIDAsIHUgLSAxMTUpXShuKTsgdmFyIHU7IH0sIExzclJlOiBmdW5jdGlvbiBMc3JSZShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFNbUSgoaSA9IDIwODgpIC0gOTEsIDE1NDMsIDMyNzEgLSA0MywgMCwgaSAtIDE3MTQpXShuLCB1LCByLCB0LCBlKTsgdmFyIGk7IH0sIEZYenhKOiBmdW5jdGlvbiBGWHp4SihuLCB1KXsgcmV0dXJuIFNbUSgzMjc4IC0gNTAsIDIyMjcsIDE2NTAgLSA0NTgsIHIgPSAyODkzLCByIC0gMTU3NildKG4sIHUpOyB2YXIgcjsgfSwgVG9LclI6IFNbUSgxNDQ4LCAzMTksIDE2NSwgMCwgMTI4NSldLCBDQmRucjogU1tRKC0zNTcsIDE5NjMsIDg2LCAwLCA3ODkpXSwgdGpxTEk6IGZ1bmN0aW9uIHRqcUxJKG4sIHUsIHIpeyByZXR1cm4gU1tLKC0yOTUgLSAyNTcsIC0yODEsICh0ID0gNjE3KSAtIC04NTgpXShuLCB1LCByKTsgdmFyIHQ7IH0sIFJzZEpxOiBTW28oMjczOSwgMCwgMCwgMCwgMzQxOCldLCBJbndHVTogU1tLKDkzMiwgMTQwOCwgMTI4OSldLCB0ZVFpTTogZnVuY3Rpb24gdGVRaU0obiwgdSwgcil7IHJldHVybiBTW0soMTM2OSwgMTk5MSwgNzQ5KV0obiwgdSwgcik7IH0sIGp1UmpoOiBTW0QoMzA4MCwgMCwgMCwgMzM5NildLCBjRG9YUDogU1tEKDI5ODYsIDAsIDAsIDI2NDUpXSwgR1FRd3Y6IGZ1bmN0aW9uIEdRUXd2KG4sIHUsIHIsIHQsIGUsIGkpeyByZXR1cm4gU1tEKDMwMDYsIDAsIDAsIDEyNzIpXShuLCB1LCByLCB0LCBlLCBpKTsgfSwgamJRWEs6IGZ1bmN0aW9uIGpiUVhLKG4sIHUpeyByZXR1cm4gU1tEKDI2NTUgLSAtMzE3LCAwLCAwLCByID0gMjIxNCldKG4sIHUpOyB2YXIgcjsgfSwgWERWbXY6IGZ1bmN0aW9uIFhEVm12KG4sIHUpeyByZXR1cm4gU1tEKChyID0gMjM5OSkgLSAtNjk5LCAwLCAwLCB0ID0gMTE5MyldKG4sIHUpOyB2YXIgciwgdDsgfSwgWmprZU06IFNbRCgyMTUzLCAwLCAwLCAzNDU4KV0sIHFZbHZCOiBmdW5jdGlvbiBxWWx2QihuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIFNbRCgoYyA9IDE5MTUpIC0gMzcsIGYgPSAxMDgyLCAwLCBmKV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmLCBjOyB9LCBqaFRqaDogZnVuY3Rpb24gamhUamgobiwgdSl7IHJldHVybiBTW1EoOTUyIC0gMjc0LCAxNTg5LCA2NzMgLSA0MjAsIHIgPSA1NTMsIHIgLSA5NTgpXShuLCB1KTsgdmFyIHI7IH0sIG10eWtuOiBmdW5jdGlvbiBtdHlrbihuLCB1KXsgcmV0dXJuIFNbRCgociA9IDI0MjkpIC0gLTIyNywgMCwgMCwgMjM5NSldKG4sIHUpOyB2YXIgcjsgfSwgZ0VUb1U6IFNbdSgxMjc5LCAxMjY0KV0sIFhxZ2t0OiBTW0QoMzEwMSwgMCwgMCwgNDM4MildLCBaWUhlZjogZnVuY3Rpb24gWllIZWYobiwgdSl7IHJldHVybiBTW3AoKHIgPSAyNjI0KSAtIDQ4NCwgMzUzMSAtIDE3MCwgMzI2OCAtIDQzMywgciAtIDc3OCwgMzAzNSldKG4sIHUpOyB2YXIgcjsgfSwgcXl2RXM6IGZ1bmN0aW9uIHF5dkVzKG4sIHUpeyByZXR1cm4gU1tvKDIwOTYgLSAtNjI0LCAwLCByID0gMzIxOSwgMCwgcildKG4sIHUpOyB2YXIgcjsgfSwgY2pwZ3Y6IFNbUSg1NzksIDE5MDQsIDQ5MiwgMCwgMTE0MildLCBFQ3drQzogZnVuY3Rpb24gRUN3a0MobiwgdSl7IHJldHVybiBTW3AoKHIgPSA3NDkpIC0gNDk5LCA0MzEgLSAzNzYsICh0ID0gNjgyKSAtIDEwOSwgdCAtIDE1MiwgcildKG4sIHUpOyB2YXIgciwgdDsgfSwgQkNGUHc6IFNbbygyNTQxLCAwLCAwLCAwLCAzMjMwKV0sIFFIUFhPOiBTW3UoMjIwNywgMzU0MyldLCB0UmN6YjogZnVuY3Rpb24gdFJjemIobiwgdSwgciwgdCl7IHJldHVybiBTW3AoMzk1MyAtIDEyOCwgKGUgPSAzMDYxKSAtIDI2NSwgKGkgPSAyNzc2KSAtIDEyMiwgZSAtIDkxNCwgaSldKG4sIHUsIHIsIHQpOyB2YXIgZSwgaTsgfSwgWUlFTnA6IGZ1bmN0aW9uIFlJRU5wKG4sIHUsIHIsIHQpeyByZXR1cm4gU1tvKChlID0gNjIyKSAtIC0zODksIDAsIDAsIDAsIDEzNildKG4sIHUsIHIsIHQpOyB2YXIgZTsgfSwgQlRZR3A6IGZ1bmN0aW9uIEJUWUdwKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gU1tvKDIwNzcgLSA2MDksIDAsIDAsIGkgPSAxODIzLCBpKV0obiwgdSwgciwgdCwgZSk7IHZhciBpOyB9LCBLcWVvUzogZnVuY3Rpb24gS3Flb1MobiwgdSl7IHJldHVybiBTW0QoKHIgPSAtNikgLSAtMTI3MCwgMCwgMCwgLTcyMyldKG4sIHUpOyB2YXIgcjsgfSwgRnJlZnU6IGZ1bmN0aW9uIEZyZWZ1KG4sIHUpeyByZXR1cm4gU1tEKDE5NjAgLSAzOCwgMCwgciA9IDEyMzQsIHIpXShuLCB1KTsgdmFyIHI7IH0sIFBCWWpJOiBmdW5jdGlvbiBQQllqSShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFNbcCgoaSA9IDE5MjQpIC0gMTQ2LCAoZiA9IDMxMzgpIC0gMTEwLCAyNDE1IC0gNDAwLCBmIC0gNTQ5LCBpKV0obiwgdSwgciwgdCwgZSk7IHZhciBpLCBmOyB9LCBzVlZiZDogZnVuY3Rpb24gc1ZWYmQobiwgdSwgciwgdCl7IHJldHVybiBTW28oKGUgPSAyOTM3KSAtIDEyMTEsIDAsIDAsIDAsIDI1NDEpXShuLCB1LCByLCB0KTsgdmFyIGU7IH0sIFRTWHROOiBmdW5jdGlvbiBUU1h0TihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIFNbUSg2MzQgLSA0MjAsIGkgPSA0ODEsIGkgLSA0MzksIDAsIDE1NDIgLSAxODg0KV0obiwgdSwgciwgdCwgZSk7IHZhciBpOyB9LCBBcmtlRTogZnVuY3Rpb24gQXJrZUUobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBTW0QoKGYgPSAxMjYyKSAtIC0zMTgsIDAsIDAsIGMgPSAyMzMzKV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmLCBjOyB9LCBvaGFLZTogZnVuY3Rpb24gb2hhS2UobiwgdSl7IHJldHVybiBTW28oKHIgPSAyNzIwKSAtIDk5NywgMCwgMCwgMCwgMjQ1NSldKG4sIHUpOyB2YXIgcjsgfSB9OyBmdW5jdGlvbiBwKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4geSgwLCAwLCAwLCBlLCB0IC0gMzkwKTsgfSBmdW5jdGlvbiBLKG4sIHUsIHIpeyByZXR1cm4geSgwLCAwLCAwLCB1LCByIC0gNDA1KTsgfSBmdW5jdGlvbiBvKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gUigwLCAwLCAwLCBuIC0gNjk5LCBlKTsgfSBmdW5jdGlvbiBEKG4sIHUsIHIsIHQpeyByZXR1cm4gYihuIC0gLTUyOSwgMCwgdCk7IH0gZnVuY3Rpb24gUShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIHkoMCwgMCwgMCwgdSwgZSAtIC01NDkpOyB9IGlmIChTW28oMjM1MSwgMCwgMCwgMCwgMjgwOSldKFNbdSgyMjc2LCAxOTc3KV0sIFNbUSgxNTk3LCAxMTA1LCAxMjA4LCAwLCAxMTAwKV0pKSByZXR1cm4gbFtvKDI0NjMsIDAsIDAsIDAsIDIyMjIpXShuLCBFKTsgdmFyIEkgPSB7IFlrbmhMOiBTW3UoMjQxMiwgMzMwMyldKFNbRCgzNDc5LCAwLCAwLCA0MjM5KV0oU1t1KDE0MTIsIDE2ODQpXShfTCwgNTUzLCAtNDE1KSwgU1tvKDc0OCwgMCwgMCwgMCwgNzkxKV0oX0wsIDQxNywgLTUyOCkpLCAiKyQiKSwgS3JkenM6IGZ1bmN0aW9uIEtyZHpzKG4sIHUpeyBmdW5jdGlvbiByKG4sIHUsIHIpeyByZXR1cm4gUShuIC0gNzAsIG4sIHIgLSAyNDUsIDAsIHIgLSAxNTQyKTsgfSByZXR1cm4gU1tyKDE1MDEsIDAsIDExMDUpXShTW3IoMjkzMywgMCwgMTkzNSldLCBTW3IoOTgxLCAwLCAxOTM1KV0pID8gU1twKCh0ID0gOTI5KSAtIDE4MiwgMTI3OSAtIDgxLCAxNTg2IC0gNDcwLCA5NzUgLSAtNTU3LCB0KV0obiwgdSkgOiBsW28oMTc5NiAtIC0zMTgsIDAsIDAsIDAsIDI4MjgpXShuLCBFKTsgdmFyIHQ7IH0sIGxTZG9uOiBTW1EoLTc1NywgODUsIDY2NiwgMCwgNDUxKV0oX0wsIDU1MCwgLTI0OCksIGdTZFZJOiBTW0soMTMwMywgMTI1NCwgMTQzMyldKF9MLCA1MTMsIDM2NiksIEVEaVpnOiBmdW5jdGlvbiBFRGlaZyhuKXsgZnVuY3Rpb24gcihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEQoZSAtIC0xMTU5LCAwLCAwLCB0KTsgfSBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbyh0IC0gMzAsIDAsIDAsIDAsIGUpOyB9IHZhciBlID0geyBIVHh0VzogZnVuY3Rpb24gSFR4dFcobiwgciwgdCl7IHJldHVybiBsW3UoMjExNSwgMTUzMyldKG4sIHIsIHQpOyB9LCBRRU1vTDogZnVuY3Rpb24gUUVNb0wobiwgcil7IHJldHVybiBsW3UoMjgyNSwgMjMwMyldKG4sIHIpOyB9IH07IHJldHVybiBsW3IoMCwgMCwgMCwgODIzLCAxMTQ5KV0obFtyKDAsIDAsIDAsIDMwMzIsIDE4OTQpXSwgbFt0KDAsIDAsIDAsIDI1MjUsIDI4NTgpXSkgPyBsW3IoMCwgMCwgMCwgNDIxLCAtMTE0KV0obikgOiBlW0QoMjc1MiAtIC02NDYsIDAsIDAsIDM1NDYpXShFLCBlW3QoMCwgMCwgMCwgMTEyMywgMjA4MildKF9MLCA0MzMpLCBIKTsgfSB9OyBmdW5jdGlvbiBKKG4sIHIsIHQsIGUsIGkpeyBmdW5jdGlvbiBmKG4sIHUpeyByZXR1cm4gbyh1IC0gNjEzLCAwLCAwLCAwLCBuKTsgfSB2YXIgYyA9IHsgbkFmbGk6IGZ1bmN0aW9uIG5BZmxpKG4sIHIpeyByZXR1cm4gU1t1KDEwNjQsIDEwODMpXShuLCByKTsgfSB9OyByZXR1cm4gU1tmKDMzMzEsIDIxOTkpXShTW2YoMTQ0NSwgMjc2MildLCBTW0QoMTA2MiAtIC01ODQsIDAsIDAsIC0xNDkpXSkgPyBjW2YoMTcyNywgMTAwMyldKG4sIEUpIDogU1tmKDI1MTgsIDEyNjQpXShfTCwgU1tEKDIyNjEgLSA1ODYsIDAsIDAsIDIzMTcpXShuLCAtODU5KSwgaSk7IH0gZnVuY3Rpb24gVShuLCB1LCByLCB0LCBlKXsgZnVuY3Rpb24gaShuLCB1LCByLCB0KXsgcmV0dXJuIFEobiAtIDQ3OSwgciwgciAtIDQ4NiwgMCwgdCAtIDY5Myk7IH0gZnVuY3Rpb24gZihuLCB1LCByKXsgcmV0dXJuIEQociAtIDU2NSwgMCwgMCwgbik7IH0gaWYgKCFsW2YoMjI4MiwgMCwgMjg3MyldKGxbZigzMTkyLCAwLCAzNzAzKV0sIGxbaSgxNzMyLCAwLCAxNDUxLCAxMjkyKV0pKSByZXR1cm4gbFtpKDE5NDcsIDAsIDE1NzMsIDE4NzUpXShfTCwgbFtmKDQxMTUsIDAsIDM2OTYpXSh0LCAtNjUyKSwgZSk7IGlmIChDKXsgdmFyIGMgPSBxW19kW2xbZigzMjIzLCAwLCAyNTY4KV0oJCwgMjE4LCAwLCAwLCBsW2YoMjE0OCwgMCwgMzIzNyldKGxbaSgtMzg0LCAwLCAxNjQ5LCA4MTYpXSgxNzIsIC04MSksIC0xMTgwKSldKF8sIDQxOCwgNjA2KV0obm4sIGFyZ3VtZW50cyk7IHJldHVybiB1biA9IG51bGwsIGM7IH0gfSBmdW5jdGlvbiBnKG4sIHIsIHQsIGUsIGkpeyBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gRChlIC0gODksIDAsIDAsIG4pOyB9IHZhciBjLCBvLCBhLCB2ID0geyBkWnhZdTogZnVuY3Rpb24gZFp4WXUobiwgciwgdCl7IHJldHVybiBsW3UoMjU1OCwgNDA0NSldKG4sIHIsIHQpOyB9IH07IHJldHVybiBsW2YoMTEwOSwgMCwgMCwgMCwgMjM5NyldKGxbZigyNzEwLCAwLCAwLCAwLCAxNzAwKV0sIGxbcCgtMzQ3IC0gNDE1LCAobyA9IDg0OCkgLSA0MDMsIChhID0gOTE4KSAtIDczLCBvIC0gLTgzNCwgYSldKSA/IHZbRCg0ODMgLSAtOTQzLCAwLCAwLCA2MjMpXShFLCBfTCwgSCkgOiBsW3AoKGMgPSAxODEwKSAtIDE4OCwgNDMyIC0gMTksIDE4MjYgLSAxMzYsIDEzNjMgLSA0ODcsIGMpXShfTCwgbFtmKDI2OTQsIDAsIDAsIDAsIDE0NTEpXSh0LCAtMTM3KSwgaSk7IH0gdmFyIHggPSBJW1NbbygyMTk4LCAwLCAwLCAwLCAxNDIxKV0oX0wsIDYxMiwgLTEwNyldKG5uKTsgcmV0dXJuIChxID0gZnVuY3Rpb24gcShuLCByKXsgZnVuY3Rpb24gYShuLCB1LCByLCB0KXsgcmV0dXJuIEQociAtIDIxMiwgMCwgMCwgdCk7IH0gZnVuY3Rpb24gYyhuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEQoZSAtIC05MjUsIDAsIDAsIHUpOyB9IGZ1bmN0aW9uIHYobiwgdSwgciwgdCwgZSl7IHJldHVybiBLKG4gLSAyNzcsIHQsIGUgLSAtNjc1KTsgfSB2YXIgcCA9IHsgb1Z0VVY6IGZ1bmN0aW9uIG9WdFVWKG4sIHIpeyByZXR1cm4gbFt1KDc5MiwgMTM4NSldKG4sIHIpOyB9LCBwUHJMVzogZnVuY3Rpb24gcFByTFcobiwgcil7IHJldHVybiBsW3UoMTMzOSwgNzQ4KV0obiwgcik7IH0sIGlIdnVKOiBsW28oMTUwNiwgMCwgOTQ2LCAzMzU4LCAyMjQ0KV0sIFBkREF2OiBsW28oODMxLCAwLCAyNzIsIC02MjcsIDYzMildLCBhdWFlTDogZnVuY3Rpb24gYXVhZUwobiwgdSwgcil7IHJldHVybiBsW2MoMCwgNDE4MCwgMCwgMCwgMzI3MiAtIDEzMzMpXShuLCB1LCByKTsgfSwgaXFMdmU6IGZ1bmN0aW9uIGlxTHZlKG4sIHUpeyByZXR1cm4gbFtvKDc4OCAtIDI3NSwgMCwgKHIgPSAtMTA4KSAtIDQ1NiwgciwgNjk1IC0gMTEzKV0obiwgdSk7IHZhciByOyB9LCBQSFlpZjogZnVuY3Rpb24gUEhZaWYobiwgdSl7IHJldHVybiBsW28oKHIgPSAxMTI5KSAtIDMzLCB0ID0gMTg2NywgMTE1NyAtIDE1NSwgciwgdCAtIC0zOTMpXShuLCB1KTsgdmFyIHIsIHQ7IH0sIHRnZW5HOiBmdW5jdGlvbiB0Z2VuRyhuLCB1KXsgcmV0dXJuIGxbbygxMzQ3IC0gMjMwLCAwLCAociA9IDE3MzApIC0gMzgyLCByLCAyMjEyIC0gODYxKV0obiwgdSk7IHZhciByOyB9LCBoWW9wUzogbFtvKDIxNDEsIDAsIDcxMSwgNDk3LCAxNjQzKV0sIGxwaHZMOiBmdW5jdGlvbiBscGh2TChuLCB1LCByLCB0LCBlLCBpKXsgcmV0dXJuIGxbbygoZiA9IDE5ODEpIC0gMjk4LCBjID0gNzg0LCA5MjAgLSAzNzIsIGMsIGYgLSA5MzIpXShuLCB1LCByLCB0LCBlLCBpKTsgdmFyIGYsIGM7IH0sIEJ2WGFXOiBmdW5jdGlvbiBCdlhhVyhuLCB1KXsgcmV0dXJuIGxbYygwLCAxOTgwLCAwLCAwLCAxNjExIC0gLTEzNildKG4sIHUpOyB9LCBHRG9qUDogZnVuY3Rpb24gR0RvalAobiwgdSl7IHJldHVybiBsW2MoMCwgMTgwNCwgMCwgMCwgMjkyNCAtIDk3NCldKG4sIHUpOyB9IH07IGZ1bmN0aW9uIG8obiwgdSwgciwgdCwgZSl7IHJldHVybiBRKG4gLSAyNjksIHQsIHIgLSAzMDYsIDAsIGUgLSA0NTkpOyB9IGZ1bmN0aW9uIHMobiwgdSwgcil7IHJldHVybiBEKG4gLSAtMTIzLCAwLCAwLCByKTsgfSBpZiAobFtzKDEwNTQsIDAsIDEwNDMpXShsW3YoMTgwMCwgMCwgMCwgMjU0MywgMjUwMSldLCBsW3YoMzczOCwgMCwgMCwgMjg4MywgMjUxMildKSl7IHZhciBfdCA9IGZ1bmN0aW9uIF90KG4sIHIsIHQpeyBmdW5jdGlvbiBlKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbyhuIC0gNDMxLCAwLCByIC0gMzIyLCBlLCByIC0gLTcwKTsgfSB2YXIgaSA9IHsgY3dGQVY6IGZ1bmN0aW9uIGN3RkFWKG4sIHIpeyByZXR1cm4gcFt1KDUzMCwgMzc4KV0obiwgcik7IH0gfTsgZnVuY3Rpb24gZihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGMoMCwgbiwgMCwgMCwgZSAtIDU5MCk7IH0gcmV0dXJuIHBbZigtMTk1LCAwLCAwLCAwLCA3NTQpXShwW2UoMTMwNiwgMCwgLTI2LCAwLCAtMTA2OSldLCBwW2YoOTIsIDAsIDAsIDAsIDkxMildKSA/IGlbZigyNTUzLCAwLCAwLCAwLCAyOTEzKV0obiwgRSkgOiBwW3MoMjkxNCAtIC0xNzEsIDAsIDM0NDEpXShfTCwgcFtlKC0zNzYsIDAsIC0xNCwgMCwgNTQyKV0ocFtmKDM1NSwgMCwgMCwgMCwgNDkyKV0odCwgNDk2KSwgLTMxOSksIG4pOyB9OyB2YXIgX2UgPSBmdW5jdGlvbiBfZShuLCByLCB0LCBlLCBpKXsgZnVuY3Rpb24gZihuLCB1LCByLCB0KXsgcmV0dXJuIGEoMCwgMCwgdSAtIC0xMTc0LCB0KTsgfSBmdW5jdGlvbiBjKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gYSgwLCAwLCB1IC0gLTc1NCwgZSk7IH0gdmFyIG8gPSB7IERoRHdxOiBmdW5jdGlvbiBEaER3cShuLCByKXsgcmV0dXJuIHBbdSgyODYxLCAyNzgzKV0obiwgcik7IH0gfTsgcmV0dXJuIHBbYygwLCAzMTIsIDAsIDAsIDE2NDgpXShwW2YoMCwgNTE5LCAwLCAxOTIpXSwgcFtjKDAsIDkzOSwgMCwgMCwgMTI0NyldKSA/IG9bYSgwLCAwLCAxOTE2IC0gOSwgMTkzNildKG4sIEUpIDogcFt2KC0xNTcgLSA0MywgMCwgMCwgODU4LCAyMzEgLSAzOTYpXShnLCAwLCAwLCBwW2YoMCwgLTEyNiwgMCwgMTQ0KV0ociwgLTE3OCksIDAsIGkpOyB9OyB2YXIgX2kgPSBmdW5jdGlvbiBfaShuLCB1LCByLCB0KXsgZnVuY3Rpb24gZShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIG8obiAtIDQ2MywgMCwgciAtIDE3OSwgZSwgciAtIDI1Myk7IH0gcmV0dXJuIGxbZSg0ODgsIDAsIDE3ODEsIDAsIDEyMDEpXShsW2UoMTk2NiwgMCwgMTU5NCwgMCwgMjQyNyldLCBsW2MoMCwgMjYwLCAwLCAwLCAxMzAzIC0gNDA1KV0pID8gcFtlKDI1ODAsIDAsIDI2ODEsIDAsIDE0MDYpXShFLCBwW2UoMTU0OSwgMCwgMjQyNywgMCwgMjYwMCldKF9MLCAyMzEpLCBIKSA6IGxbbygyMDAzIC0gMjAwLCAwLCAoaSA9IDg3NikgLSAxNjksIDEzNzYsIGkgLSA3MjcpXShKLCBsW28oMzEwMiAtIDcxLCAwLCAxNzY3IC0gNDMsIDI3NDAsIDE5MzcgLSAxMzU1KV0odCwgMTUzNCksIDAsIDAsIDAsIHUpOyB2YXIgaTsgfTsgdmFyIGYgPSBmdW5jdGlvbiBmKG4sIHIsIHQpeyB2YXIgZSA9IHsgRkFPSXE6IGZ1bmN0aW9uIEZBT0lxKG4sIHIpeyByZXR1cm4gbFt1KDIyNTQsIDI0OSldKG4sIHIpOyB9IH07IGZ1bmN0aW9uIGkobiwgdSwgcil7IHJldHVybiBzKG4gLSAtNjUwLCAwLCByKTsgfSByZXR1cm4gbFtpKDQwNCwgMCwgMTA5NyldKGxbdigyMzMxLCAwLCAwLCAxMzQ4LCAxZTMpXSwgbFtpKDExODcsIDAsIDEwMDcpXSkgPyBlW3YoMzQ1NCAtIDMwNSwgMCwgMCwgMjg3NiwgMzQ5MCAtIDEwODYpXShuLCBFKSA6IGxbaSgxMDU2LCAwLCA0MzkpXShVLCAwLCAwLCAwLCBsW2koMTg5OSwgMCwgODQwKV0obiwgMzc1KSwgdCk7IH07IHJldHVybiB7fSBbbFt2KDI0NzEsIDAsIDAsIDI5NjEsIDE4NzMpXShfdCwgNjkzLCAwLCA3MzIpXSA9IElbbFtzKDI3NjksIDAsIDMwNTcpXShfdCwgNzk0LCAwLCA3NzcpXSwgSVtsW28oMzEwOCwgMCwgMTc0NiwgMzM3OSwgMjQ3MCldKF9pLCAwLCAxMjQ2LCAwLCAxMTgyKV0oSVtsW3YoMTQxNiwgMCwgMCwgNzk1LCAxMDQzKV0oX2ksIDAsIDEzNDgsIDAsIDEyNDIpXSwgSVtsW2EoMCwgMCwgMzEwNCwgMjI0NildKF90LCA4NTcsIDAsIDc3NSldKSA/IHhbbiAtPSA0MDRdIDogSVtsW2MoMCwgLTcyOSwgMCwgMCwgLTE1KV0obFt2KDgxNiwgMCwgMCwgLTQ3MywgODY5KV0oX2UsIDAsIDI4NywgMCwgMCwgMzcxKSwgbFtzKDE4ODAsIDAsIDMxNjgpXShfaSwgMCwgMTE2MSwgMCwgMTIxOSkpXSgpW2xbdigzNDEzLCAwLCAwLCA5MTIsIDIxOTMpXShsW3MoMjcxMCwgMCwgMTgwOCldKF90LCA3NTEsIDAsIDc2NyksICJoIildKE9ZWGNPVltsW28oLTI2NywgMCwgLTYzNCwgMTU0OSwgMjE0KV0oX2ksIDAsIDEzMDcsIDAsIDEyMzApXSlbbFtzKDc4NywgMCwgLTIwOSldKGxbYygwLCAxMzM4LCAwLCAwLCAxOTY3KV0oZiwgMzI1LCAwLCAzMjApLCBsW2EoMCwgMCwgMjIxNSwgMzIyMCldKF9pLCAwLCAxMjM1LCAwLCAxMjE5KSldKClbbFt2KC04NTMsIDAsIDAsIC05OTEsIC01MCldKGxbcyg3ODcsIDAsIDkxMCldKGxbbyg2NjQsIDAsIDEzMDgsIDc3NCwgMTEzOSldKGYsIDEyNiwgMCwgODMpLCBsW3YoMTUxLCAwLCAwLCAyMzcxLCAxMjUyKV0oX2ksIDAsIDEwODIsIDAsIDExNjYpKSwgInIiKV0oeClbbFthKDAsIDAsIDMzNjUsIDI4MDQpXShsW3MoNzgzLCAwLCA4MjYpXShfZSwgMCwgMjc1LCAwLCAwLCAzMDgpLCAiaCIpXShPWVhjT1ZbbFtjKDAsIDg3NCwgMCwgMCwgMTQ5NildKF9MLCBsW2MoMCwgMTE5MywgMCwgMCwgMjQxNyldKGxbbyg5MjAsIDAsIDc2OCwgMjI0NywgMTg5MildKDE0MjcsIDE2NzkpLCAtODA3KSwgMTM2NildKTsgfSByZXR1cm4gcFtjKDAsIDE0MzEsIDAsIDAsIDE2MTEpXShuLCBFKTsgfSkobiwgcik7IH0gZnVuY3Rpb24gX2QoKXsgZnVuY3Rpb24gbihuLCB1LCByLCB0KXsgcmV0dXJuIGIodCAtIC0xMTAsIDAsIG4pOyB9IGZ1bmN0aW9uIGkobiwgdSwgcil7IHJldHVybiB5KDAsIDAsIDAsIG4sIHUgLSAxMTMxKTsgfSBmdW5jdGlvbiByKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4geSgwLCAwLCAwLCBuLCBlIC0gLTI1NSk7IH0gZnVuY3Rpb24gdChuLCB1LCByKXsgcmV0dXJuIFkociwgdSAtIDE5NCk7IH0gZnVuY3Rpb24gZShuLCB1LCByLCB0KXsgcmV0dXJuIFkodSwgdCAtIC04OSk7IH0gdmFyIGYgPSB7IGFYSnRIOiBmdW5jdGlvbiBhWEp0SChuLCByKXsgcmV0dXJuIFNbdSgyODE3LCAyODUzKV0obiwgcik7IH0sIEZ1WkVsOiBmdW5jdGlvbiBGdVpFbChuLCByKXsgcmV0dXJuIFNbdSgxNTE4LCAxNjYzKV0obiwgcik7IH0sIEZiaWJLOiBTW2koMjEwNywgMjEyOSwgMzQ2OSldLCBsSHRZbzogU1tlKDAsIDIyOTAsIDAsIDMwNzYpXSB9OyBpZiAoU1tpKDM2ODgsIDMwODUsIDQwODYpXShTW3IoMTQ1NSwgLTQ0MCwgMTQxMCwgMCwgNDgwKV0sIFNbbigxMDU1LCAwLCAwLCAxODg3KV0pKSByZXR1cm4gU1tyKDU4MCwgMjEyOCwgMTYzMywgMCwgMTMyMyldKF9kLCBFKTsgdmFyIGMgPSBbU1tuKDQwNDcsIDAsIDAsIDI4NTYpXSwgU1t0KDAsIDI2MTksIDMxMjMpXSwgU1tlKDAsIDE0OTgsIDAsIDE5ODUpXSwgU1tuKDE2NDUsIDAsIDAsIDE1ODMpXSwgU1t0KDAsIDI0NjcsIDI5NzkpXSwgU1tpKDI4MTEsIDM0ODgsIDQwNTkpXSwgU1tuKDI3MDksIDAsIDAsIDI4NDcpXSwgU1tlKDAsIDIxMjAsIDAsIDMxMTMpXSwgU1tpKDE3ODcsIDE4NDEsIDI4NTYpXSwgU1tpKDIxMTgsIDMyMTAsIDIyNTQpXSwgU1tyKDIyNTUsIDI3MjMsIDIyMjAsIDAsIDE2NDkpXSwgU1tuKDE2NzAsIDAsIDAsIDE2NzIpXSwgU1tyKDIxNDAsIDE1MDgsIDE0MzYsIDAsIDE4NjgpXSwgU1tyKDExODYsIC01OTEsIDQ5MiwgMCwgMTApXSwgU1tuKDIxMDQsIDAsIDAsIDI1NTcpXSwgU1tuKDEzMzEsIDAsIDAsIDE5MjApXSwgU1tlKDAsIDY3NiwgMCwgOTQ1KV0sIFNbbigzNzEyLCAwLCAwLCAzNjI1KV0sIFNbcigxNDM3LCAyMjE1LCAyNzUxLCAwLCAxNjU1KV0sIFNbZSgwLCA3MjUsIDAsIDU0MyldLCBTW24oMjUzMywgMCwgMCwgMTU4NildLCBTW2koMjY4MiwgMzAwNCwgMjA2NCldLCBTW3IoNzU2LCAyNzg2LCAyMzM4LCAwLCAxNjM4KV0sIFNbZSgwLCAxMDE5LCAwLCAxNTMwKV0sIFNbbigzMzY5LCAwLCAwLCAzODI0KV0sIFNbbigxNjQzLCAwLCAwLCAxNTQyKV0sIFNbbigyNjczLCAwLCAwLCAyNzEzKV0sIFNbcigyMTI2LCAzNCwgNDc1LCAwLCAxMTYzKV0sIFNbbig0NzMyLCAwLCAwLCAzNDQ3KV0sIFNbZSgwLCAxNTI4LCAwLCAyNTM5KV0sIFNbdCgwLCAyNTE5LCAxNzYyKV0sIFNbaSgzMjc0LCAzMTA5LCAyODE4KV0sIFNbbigxOTE1LCAwLCAwLCAzMjQyKV0sIFNbaSgzODYwLCAzMDEzLCAyMzc4KV0sIFNbZSgwLCA4NzYsIDAsIDEyOTMpXSwgU1tuKDMxNDQsIDAsIDAsIDM2NjApXSwgU1tpKDM1MjgsIDMyNTgsIDI0MjMpXSwgU1tlKDAsIDIwNDIsIDAsIDIyNjgpXSwgU1t0KDAsIDE3ODcsIDI3ODQpXSwgU1t0KDAsIDI2MDksIDI3NDIpXSwgU1tlKDAsIDMyMzUsIDAsIDI4MTMpXSwgU1tyKDQzOSwgODc3LCAxMDA1LCAwLCAxNDg2KV0sIFNbaSgyNjkwLCAxODAyLCAxMzk4KV0sIFNbbigyNTYzLCAwLCAwLCAzODY3KV0sIFNbZSgwLCAzMjU1LCAwLCAzMDc1KV0sIFNbaSgxNTAwLCAxOTg3LCAyNjk5KV0sIFNbZSgwLCAxODgyLCAwLCAxMDIwKV0sIFNbdCgwLCAxNjMyLCAyMzE5KV0sIFNbbigzNTQwLCAwLCAwLCAzNTA2KV0sIFNbaSgxNTkyLCAyNjk0LCAzODQ4KV0sIFNbcigyMjA5LCAxODE4LCAxNzE2LCAwLCA5NzUpXSwgU1t0KDAsIDkwNSwgMTE1KV0sIFNbbigyNzg3LCAwLCAwLCAzMDI4KV0sIFNbdCgwLCA4MDEsIDI5MildLCBTW2UoMCwgNzM1LCAwLCAxNTg5KV0sIFNbdCgwLCAyODgzLCA0MDEwKV0sIFNbaSgxNzg4LCAxNDEzLCAxMjM4KV0sIFNbaSgyODA1LCAyOTczLCAyNTQ2KV0sIFNbcigtMTA0OSwgLTM4OSwgOTgsIDAsIC0xMjIpXSwgU1tlKDAsIDIwNTQsIDAsIDE2ODUpXSwgU1tpKDI0ODIsIDE0MjIsIDE2NCldLCBTW2UoMCwgMTYwNywgMCwgMjU5NSldLCBTW2koMjUxNCwgMTQ1MCwgMTYzKV0sIFNbdCgwLCAyMjI5LCAxNjM1KV0sIFNbbigzMDkxLCAwLCAwLCAzNDc2KV0sIFNbZSgwLCAxODQzLCAwLCAxOTMyKV0sIFNbaSg0NTMxLCAzOTA3LCAzODc4KV0sIFNbdCgwLCAxNjc3LCAyMjQ3KV0sIFNbcigxNjY1LCAxNjc4LCAxMjM2LCAwLCAxODgzKV0sIFNbaSgxNzEzLCAxODU5LCAyMjk5KV0sIFNbdCgwLCAyNTcwLCAzMDgxKV0sIFNbbigxOTE3LCAwLCAwLCAyMzk1KV0sIFNbbig2NzAsIDAsIDAsIDE2MTQpXSwgU1tuKDIwNjMsIDAsIDAsIDI2MjkpXSwgU1tpKDQ0MTEsIDMxODYsIDMwMDUpXSwgU1tyKDc3NywgMTE5OCwgLTczMCwgMCwgLTM2KV0sIFNbcigzMjg1LCAyNTc0LCA3NzMsIDAsIDIwMjMpXSwgU1t0KDAsIDEzNjUsIDE5OTEpXSwgU1tlKDAsIDI5MDQsIDAsIDI1MzUpXSwgU1tpKDM3MzksIDMyNzMsIDQ0NzUpXSwgU1tyKDQxOCwgMjY4LCAtMTQ1LCAwLCA2MjEpXSwgU1tyKC0xMTI2LCA5OTMsIDEzNSwgMCwgMTQ2KV0sIFNbZSgwLCAxNDg0LCAwLCAyNzY3KV0sIFNbbigxNDA0LCAwLCAwLCAyNTUyKV0sIFNbaSgzMzAyLCAyNjY2LCAyNDMwKV0sIFNbZSgwLCAxNjA0LCAwLCAxMTI4KV0sIFNbcigxMzMyLCAtOTYsIC0zNDksIDAsIDg1KV0sIFNbZSgwLCAyNzY2LCAwLCAyNzEyKV0sIFNbdCgwLCAzMTQ5LCAyMTI1KV0sIFNbaSgzMDY3LCAzMTk4LCA0MTEzKV0sIFNbaSgyNzg5LCAzNzc3LCAyNzQ1KV0sIFNbZSgwLCAyMTk0LCAwLCAxODg0KV0sIFNbbigyNDU4LCAwLCAwLCAyOTYzKV0sIFNbcigxNjQsIDIzNiwgMTAyNCwgMCwgNDkzKV0sIFNbdCgwLCAxMzg5LCAyMTk3KV0sIFNbbigxNTEyLCAwLCAwLCAyMDI2KV0sIFNbcig1OTcsIDk0MiwgMjE4OSwgMCwgMTg3NSldLCBTW2UoMCwgMTUwNSwgMCwgNTQ3KV0sIFNbaSgzNjgxLCAzNzkxLCA0MzQ4KV0sIFNbcig0NjYsIDExOTksIDE2NDgsIDAsIDQ5MSldLCBTW24oNzA2LCAwLCAwLCAxNzQzKV0sIFNbaSgyMTYzLCAyNzY4LCAxNzc5KV0sIFNbZSgwLCAxODg3LCAwLCA1ODEpXSwgU1tyKDEwNTQsIDNlMywgMjA0OCwgMCwgMTgxNCldLCBTW24oMjIzMywgMCwgMCwgMjQ2NyldLCBTW24oMzkwMSwgMCwgMCwgMzUxMCldLCBTW2UoMCwgMTU4NCwgMCwgNzYzKV0sIFNbZSgwLCAyMzEzLCAwLCAyODcwKV0sIFNbdCgwLCAxODg2LCA3NzgpXSwgU1tuKDIyMjcsIDAsIDAsIDE2MDYpXSwgU1tyKDIzNTIsIDE1MjQsIDExOTAsIDAsIDEzNDcpXSwgU1tpKDM3NzAsIDM0MzEsIDMyODMpXSwgU1tpKDY3MywgMTk4NSwgMTQ0MyldLCBTW2koMzUxMCwgMzI0MiwgNDIxMCldLCBTW3QoMCwgMzEwMiwgMzk5OCldLCBTW24oNDQ5OCwgMCwgMCwgMzMwMSldLCBTW3IoNDA2LCAtMzg5LCAxMjIwLCAwLCA2MDQpXSwgU1tlKDAsIDI0ODIsIDAsIDE3NjkpXSwgU1tuKDIzNzEsIDAsIDAsIDM2OTEpXSwgU1tuKDI2NTUsIDAsIDAsIDE0MzMpXSwgU1tpKDMzOTAsIDI0MjEsIDI2MDgpXSwgU1tyKDc1OCwgMTExNCwgMjI0MywgMCwgMTI1OSldLCBTW24oNDQ2NSwgMCwgMCwgMzI5MSldLCBTW2UoMCwgMzIxLCAwLCA5MzYpXSwgU1t0KDAsIDMxNzksIDQ0NTQpXSwgU1t0KDAsIDgzNiwgMTgwNCldLCBTW2koMjc0NCwgMzQ1MywgNDQwOSldLCBTW24oMzE1MiwgMCwgMCwgMzEzNSldLCBTW2koMjM2MywgMTYwMiwgMjUzOCldLCBTW2UoMCwgNDcyLCAwLCA5MjApXSwgU1t0KDAsIDMwOTcsIDMzODgpXSwgU1tpKDM2OTQsIDM3MDcsIDI0OTIpXSwgU1tuKDEwOTEsIDAsIDAsIDIyOTApXSwgU1tuKDI0NDYsIDAsIDAsIDEzMjYpXSwgU1tyKDEwNSwgMTk0LCAxMDUwLCAwLCAxMDE2KV0sIFNbcigyMzU0LCAxNTUzLCAyODQsIDAsIDE1ODApXSwgU1tyKDE1MTAsIDE3MjUsIDE3MzMsIDAsIDU1MSldLCBTW3IoMTM2MCwgNDA2LCA2NTgsIDAsIDEzMDEpXSwgU1tyKDI0NjcsIDU2MywgMzI0NywgMCwgMTkwNCldLCBTW2koMjg0NiwgMzcyOCwgMzcyMSldLCBTW3QoMCwgMjIzMCwgMjkzOCldLCBTW3IoMjE4OCwgODc0LCAxMjQ2LCAwLCA5NTMpXSwgU1tyKDE2ODQsIDU2NywgLTY4NSwgMCwgNDIxKV0sIFNbdCgwLCAxNTM0LCA3MTYpXSwgU1tuKDMwNzAsIDAsIDAsIDM3NzMpXSwgU1tpKDE4MDIsIDE0NzIsIDI4MDIpXSwgU1tlKDAsIDcyNSwgMCwgMTA3NyldLCBTW24oMTQzMCwgMCwgMCwgMjQ4OCldLCBTW3QoMCwgMjgzNCwgMzI4NSldLCBTW24oMzg3MCwgMCwgMCwgMzc5MildLCBTW2UoMCwgMTAzNiwgMCwgOTA2KV0sIFNbaSgyMzUzLCAxNDMyLCAyNTA1KV0sIFNbcigtNDUxLCA1NDMsIDEyMTcsIDAsIC0xNCldLCBTW3IoMTc3OCwgMjc1MiwgMjAyMSwgMCwgMTgzMyldLCBTW3QoMCwgOTAxLCAyMTY2KV0sIFNbZSgwLCAxODA2LCAwLCA2MTApXSwgU1tuKDg4NiwgMCwgMCwgMTI1NildLCBTW3QoMCwgMzI0MCwgMzc3MyldLCBTW2koMjMwMSwgMjc4NCwgMzI4MSldLCBTW3QoMCwgMTEzMywgMTk2KV0sIFNbZSgwLCAxMjQ2LCAwLCAxNjY3KV0sIFNbZSgwLCAyMTE4LCAwLCAyODU2KV0sIFNbdCgwLCAyMDUwLCAyMzEyKV0sIFNbbigxNjUxLCAwLCAwLCAyOTkzKV0sIFNbaSgyODU5LCAyMzg2LCAyMjUyKV0sIFNbcigzMDQ1LCAxODQ4LCAyNzc0LCAwLCAyMjUxKV0sIFNbdCgwLCAxMzA5LCAxNjczKV0sIFNbZSgwLCAxNDI0LCAwLCA2OTUpXSwgU1tlKDAsIDY2MiwgMCwgOTkyKV0sIFNbbigyNzM1LCAwLCAwLCAxOTk2KV0sIFNbcigyNDk1LCA3ODUsIDIzNSwgMCwgMTE4NCldLCBTW3QoMCwgMTAzOSwgMjA4NSldLCBTW2koMTk1NiwgMjY3NCwgMzMxOCldLCBTW3IoMjYxNSwgMTU5NywgMjU2NywgMCwgMTg4OSldLCBTW3QoMCwgMjMyNSwgMTIwMCldLCBTW2UoMCwgMTc2MiwgMCwgMjEwNyldLCBTW24oMTE5MSwgMCwgMCwgMTI2MildLCBTW3QoMCwgOTE0LCAtMzA3KV0sIFNbaSgxMTIxLCAxNjI2LCAyMjgwKV0sIFNbbigyNTQwLCAwLCAwLCAzNzM2KV0sIFNbdCgwLCAxOTIzLCAzMDQwKV0sIFNbcig4MTgsIDE2MTQsIDkzNCwgMCwgOTYzKV0sIFNbcigxMDI5LCAxMjQzLCA3MjIsIDAsIC03NCldLCBTW24oMzc2OSwgMCwgMCwgMzE1NSldLCBTW3QoMCwgMzE1MiwgMzc1OCldLCBTW2koOTI1LCAxODg4LCAzMTg1KV0sIFNbaSgyMjUwLCAxNzcxLCAxNjMzKV0sIFNbcigtNjA0LCAzMTUsIDE2MTEsIDAsIDcyOCldLCBTW2koNDQ0OSwgMzI3OSwgMzc1MildLCBTW2koMzEyNiwgMjE2MCwgOTQ3KV0sIFNbbig0Mjg5LCAwLCAwLCAzMzMwKV0sIFNbdCgwLCAzMjQ4LCAzMTE2KV0sIFNbbigxMDY0LCAwLCAwLCAyMjc2KV0sIFNbdCgwLCA3OTEsIC00MTMpXSwgU1t0KDAsIDEzNzQsIDMzOCldLCBTW3IoMjMxNywgMjMwMywgMjUyMCwgMCwgMjMxNyldLCBTW3IoMTM0NSwgODk4LCA4NTYsIDAsIDY4MyldLCBTW2UoMCwgNzM4LCAwLCA2NTApXSwgU1tuKDM0NjgsIDAsIDAsIDM0MzMpXSwgU1tpKDIyMjMsIDM1MjksIDM2NDEpXSwgU1t0KDAsIDg4MSwgLTI5OSldLCBTW3IoLTYxMywgMTYwMiwgMTg5NSwgMCwgNjc4KV0sIFNbdCgwLCAxOTg4LCAxODc0KV0sIFNbZSgwLCAyNzIwLCAwLCAxOTkzKV0sIFNbbigzMTgyLCAwLCAwLCAyNDU0KV0sIFNbdCgwLCAyOTEyLCAxNzkxKV0sIFNbaSgyNzA4LCAzNjE2LCAzOTc1KV0sIFNbaSgxMzEwLCAyMDc3LCA3NTYpXSwgU1tyKDE1NDksIDI0LCAyNTgsIDAsIDk2NSldLCBTW24oMTU1OCwgMCwgMCwgMTQ4MyldLCBTW3IoMjE5NCwgMTU3NSwgMjI4OCwgMCwgMjUwMildLCBTW2UoMCwgMjIzMiwgMCwgMjMyMyldLCBTW2UoMCwgMzQ4OCwgMCwgMzA1OSldLCBTW3QoMCwgMzM0NCwgMzE5NyldLCBTW2koMjMwOSwgMjU3NiwgMTQxNCldLCBTW2koMTc2MCwgMjU0NiwgMzU5NCldLCBTW24oMjQ4NywgMCwgMCwgMTY1MyldLCBTW3IoMjI0MywgMTkyMiwgMTI4NywgMCwgMTc4MildLCBTW2koMzU2NSwgMjQ5OSwgMTg2NyldLCBTW2UoMCwgMzI1NSwgMCwgMzEyNyldLCBTW2UoMCwgMjkxMCwgMCwgMTY1OSldLCBTW2UoMCwgMTk2NywgMCwgMjYzMCldLCBTW3QoMCwgMTA2MywgMzk0KV0sIFNbbigyNDUxLCAwLCAwLCAyMjA0KV0sIFNbaSgyNTg2LCAxNzYxLCAxMzQxKV0sIFNbcigxOTk3LCAxNTY1LCAyNjM4LCAwLCAxODE5KV0sIFNbaSgzOTk1LCAzMDcxLCA0MjkzKV0sIFNbdCgwLCAxMTQ1LCAxNTE2KV0sIFNbbigzODI4LCAwLCAwLCAyNjE0KV0sIFNbcigyNTIzLCAxNTI1LCAxOTc4LCAwLCAyMzY4KV0sIFNbaSgyMzczLCAzNjYzLCAzOTI5KV0sIFNbdCgwLCAyMzUzLCAzMzg4KV0sIFNbZSgwLCAzMTUzLCAwLCAxOTY3KV0sIFNbaSgyNzc1LCAyMzI1LCAyNzE4KV0sIFNbbigxMzA0LCAwLCAwLCAxNjczKV0sIFNbaSg0MzM2LCAzODI0LCAzMDYwKV0sIFNbZSgwLCAxMTk4LCAwLCAxMzg4KV1dOyByZXR1cm4gKF9kID0gZnVuY3Rpb24gZCgpeyBmdW5jdGlvbiBuKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gaSh0LCBlIC0gLTEyNzgsIHIgLSA5Nik7IH0gcmV0dXJuIGZbaSgzMzIsIDk4MCAtIC04MTUsIDEwNTMgLSAzMTMpXShmW24oMCwgMCwgMzMxNywgMjgzOCwgMjM4OSldLCBmW24oMCwgMCwgNTU1LCAyMTM3LCAxNDk1KV0pID8gZltlKDAsIDM2NDIsIDAsIDM2MTAgLSA5MjcpXShfZCwgRSkgOiBjOyB9KSgpOyB9IGZ1bmN0aW9uICQobiwgciwgdCwgZSwgaSl7IGZ1bmN0aW9uIGYobiwgdSwgciwgdCl7IHJldHVybiBOKDAsIDAsIDAsIHQsIHIgLSAtOTYpOyB9IGZ1bmN0aW9uIGMobiwgdSwgciwgdCwgZSl7IHJldHVybiBZKHIsIGUgLSA3MzcpOyB9IGZ1bmN0aW9uIG8obiwgdSwgciwgdCl7IHJldHVybiB5KDAsIDAsIDAsIHIsIHQgLSAyKTsgfSB2YXIgYSA9IHsgU2V3cVU6IGZ1bmN0aW9uIFNld3FVKG4sIHIpeyByZXR1cm4gU1t1KDE1MTQsIDEwOSldKG4sIHIpOyB9LCBueWh5SzogZnVuY3Rpb24gbnloeUsobiwgcil7IHJldHVybiBTW3UoMjc5MiwgMzI1NyldKG4sIHIpOyB9LCBESGJzdjogU1tjKDAsIDAsIDM4NTQsIDAsIDM5NDEpXSwgZ1hsdHE6IGZ1bmN0aW9uIGdYbHRxKG4sIHUsIHIpeyByZXR1cm4gU1tjKDAsIDAsIDM4OTQsIDAsIDI5MjYgLSAtOTU4KV0obiwgdSwgcik7IH0gfTsgZnVuY3Rpb24gdihuLCB1LCByLCB0KXsgcmV0dXJuIHkoMCwgMCwgMCwgdCwgbiAtIDYwNCk7IH0gaWYgKFNbYygwLCAwLCAzMDEwLCAwLCAyMTA1KV0oU1tjKDAsIDAsIDM5NTksIDAsIDMyMDYpXSwgU1tvKDYwOSwgMjY4MSwgMjE5NiwgMTcwOCldKSkgcmV0dXJuIG5bRSAtPSAzODRdOyB2YXIgcCA9IHsgWk95YWM6IGZ1bmN0aW9uIFpPeWFjKG4sIHIsIHQpeyB2YXIgZSwgaSA9IHsgQkJsV3I6IGZ1bmN0aW9uIEJCbFdyKG4sIHIpeyByZXR1cm4gYVt1KDI0MDUsIDIzNjYpXShuLCByKTsgfSB9OyBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gdih0IC0gLTEwMTMsIHUgLSA0MjksIHIgLSAyMjYsIGUpOyB9IGZ1bmN0aW9uIGMobiwgdSwgcil7IHJldHVybiBvKG4gLSAyNTQsIHUgLSAxMTMsIHUsIHIgLSAtNjcpOyB9IHJldHVybiBhW3YoMzQyNyAtIDE0NCwgKGUgPSAzMjY5KSAtIDI3NCwgMzMxMSAtIDY2LCBlKV0oYVtmKDAsIC0xNDc5LCAzMzcsIC0yMTksIC02MTgpXSwgYVtjKDc5OCwgNjM5LCAxMjUpXSkgPyBpW2YoMCwgMjU3NiwgMjk4MCwgMjE3MiwgMjE0NyldKG4sIEUpIDogYVtjKDE5NjEsIDE2NjUsIDE2ODgpXShuLCByLCB0KTsgfSwgWEVicVU6IGZ1bmN0aW9uIFhFYnFVKG4sIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gYygwLCAwLCB1LCAwLCBlIC0gLTE1MzcpOyB9IHZhciBlID0geyBwSnhKSjogZnVuY3Rpb24gcEp4SkoobiwgciwgdCl7IHJldHVybiBTW3UoNTcyLCAxMDUzKV0obiwgciwgdCk7IH0gfTsgZnVuY3Rpb24gaShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGYoMCwgMCwgdCAtIC00NjYsIGUpOyB9IHJldHVybiBTW2koMCwgMCwgMCwgMTE1NCwgMTE3MyldKFNbZigwLCAwLCAzMjE0IC0gODAsIDIxMTYpXSwgU1t0KDAsIDE5NjEsIDAsIDAsIDE4MDUpXSkgPyBTW3QoMCwgMTgzNywgMCwgMCwgMTUxOSldKG4sIHIpIDogZVtpKDAsIDAsIDAsIDExMjIsIDE4MTcpXShFLCBfTCwgSCk7IH0gfTsgcmV0dXJuIHBbU1t1KDI4NzMsIDIzNDMpXShfTCwgNDkzLCAxMzk2KV0ocSwgcFtTW3UoOTgwLCA2OTApXShfTCwgNTU0LCAxMzg3KV0oaSwgLTcwMyksIG4pOyB9IFNbdSgyNjg4LCAzMTg3KV0oUCk7IHZhciBfID0gU1tZKDExOTQsIDExODIpXShTW1koMTczOCwgMTQwNCldKFNbdSgyMjg0LCA0MTkzKV0oU1t1KDE2NjIsIDE4NTEpXShTW3UoMzAzNCwgMjUyMildKCQsIC0yOTYsIC0yODksIC0yODgsIC0yOTAsIC0yOTUpLCBTW3UoMTU0NCwgMjI4MSldKEcsIC00NjAsIC00NTgsIC00NjMsIC00NTgsIC00NjEpKSwgU1tiKDMzMTQsIDAsIDI2NDkpXShHLCAtNDcyLCAtNDgyLCAtNDgwLCAtNDc2LCAtNDg0KSksIFNbdSgzMDMxLCAxODM0KV0odywgMjY2LCAyNjEsIDI2NiwgMjY3LCAyNjcpKSwgU1t1KDI2MDcsIDE5NjIpXShHLCAtNDU1LCAtNDU0LCAtNDY4LCAtNDYwLCAtNDYyKSk7IGZ1bmN0aW9uIHkobiwgciwgdCwgZSwgaSl7IHJldHVybiB1KGkgLSAtMzg0LCBlKTsgfSBmdW5jdGlvbiBubigpeyBmdW5jdGlvbiBvKG4sIHUsIHIsIHQpeyByZXR1cm4gUigwLCAwLCAwLCB0IC0gODc2LCByKTsgfSBmdW5jdGlvbiBjKG4sIHUsIHIsIHQpeyByZXR1cm4gWSh1LCB0IC0gNzY2KTsgfSB2YXIgcyA9IHsgY05YZ2w6IGZ1bmN0aW9uIGNOWGdsKG4sIHIsIHQpeyByZXR1cm4gU1t1KDkwMywgMTUyMildKG4sIHIsIHQpOyB9LCBZcktueDogZnVuY3Rpb24gWXJLbngobiwgcil7IHJldHVybiBTW3UoMjM1OSwgMjgyMCldKG4sIHIpOyB9LCBhbGVwRzogU1tJKDAsIDk2OSwgMCwgMjExNCldLCBieEVIbDogU1tsKDk2MCwgMCwgMCwgNDE2KV0sIEJKd2FqOiBmdW5jdGlvbiBCSndhaihuLCB1KXsgcmV0dXJuIFNbSSgwLCAociA9IDE4MDYpIC0gLTExMywgMCwgMjI3NildKG4sIHUpOyB2YXIgcjsgfSwgRVJsTUQ6IGZ1bmN0aW9uIEVSbE1EKG4sIHUpeyByZXR1cm4gU1tsKChyID0gNjQzKSAtIC0zNTksIDAsIDAsIC02MDcpXShuLCB1KTsgdmFyIHI7IH0sIEFrenZ2OiBmdW5jdGlvbiBBa3p2dihuLCB1KXsgcmV0dXJuIFNbbCgociA9IDgxMSkgLSAtNjUyLCAwLCB0ID0gODM3LCB0KV0obiwgdSk7IHZhciByLCB0OyB9LCBBUGRxSDogU1tsKDE3NTcsIDAsIDAsIDI3NDQpXSwgUlFMTXE6IFNbbCgxNDkxLCAwLCAwLCAxNTIwKV0sIFV2SlpmOiBmdW5jdGlvbiBVdkpaZihuLCB1LCByKXsgcmV0dXJuIFNbRCgxODI5LCAwLCAwLCAwLCAyODU4KV0obiwgdSwgcik7IH0sIGZEa0N2OiBmdW5jdGlvbiBmRGtDdihuLCB1LCByLCB0KXsgcmV0dXJuIFNbRChpID0gNDE0MiwgMCwgZSA9IDI4MDUsIDAsIGUgLSAxODYpXShuLCB1LCByLCB0KTsgdmFyIGUsIGk7IH0sIGpFVGptOiBmdW5jdGlvbiBqRVRqbShuLCB1KXsgcmV0dXJuIFNbYygwLCAxNTg4LCAwLCAyMTI0IC0gLTI3NyldKG4sIHUpOyB9LCBNTGp5YzogZnVuY3Rpb24gTUxqeWMobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBTW2woMjQwMCAtIC0xMjMsIDAsIGYgPSAyMzQyLCBmKV0obiwgdSwgciwgdCwgZSwgaSk7IHZhciBmOyB9LCBLU2JXbTogZnVuY3Rpb24gS1NiV20obiwgdSl7IHJldHVybiBTW2woKHQgPSAxMDk3KSAtIDQ5OSwgciA9IDUxNiwgMCwgcildKG4sIHUpOyB2YXIgciwgdDsgfSwgWUZ1SnQ6IFNbSSgwLCAxODQyLCAwLCAyNTQ0KV0sIEtpeWlFOiBTW0QoMjU3LCAwLCAwLCAwLCAxNDMxKV0sIE9weVB6OiBTW2MoMCwgMjYxMiwgMCwgMjU2NCldLCB5Z1RSVjogZnVuY3Rpb24geWdUUlYobiwgdSwgciwgdCwgZSwgaSl7IHJldHVybiBTW2woKGMgPSAzMCkgLSAtODc0LCBmID0gMjUsIDAsIGYpXShuLCB1LCByLCB0LCBlLCBpKTsgdmFyIGYsIGM7IH0sIGVERE9COiBmdW5jdGlvbiBlRERPQihuLCB1KXsgcmV0dXJuIFNbRCgxMzUxLCAwLCAwLCAwLCAxOTQ3KV0obiwgdSk7IH0sIGRIT09wOiBTW0koMCwgMTMwNCwgMCwgMTExMSldLCBxbFdFQzogZnVuY3Rpb24gcWxXRUMobiwgdSwgciwgdCwgZSl7IHJldHVybiBTW0QoaSA9IDI0NDgsIDAsIDAsIDAsIDE1MzIgLSAtMTM5OCldKG4sIHUsIHIsIHQsIGUpOyB2YXIgaTsgfSwgTWR4YmQ6IGZ1bmN0aW9uIE1keGJkKG4sIHUpeyByZXR1cm4gU1tvKDAsIDAsIDE3MzAsIDYxNiAtIC01MDUpXShuLCB1KTsgfSwgT2lWanY6IGZ1bmN0aW9uIE9pVmp2KG4sIHUpeyByZXR1cm4gU1tjKDAsIDE2OTEsIDAsIDE4MzYgLSAtMTI0OSldKG4sIHUpOyB9LCBBaG1qVDogZnVuY3Rpb24gQWhtalQobiwgdSwgcil7IHJldHVybiBTW0koMCwgKHQgPSAxOTQ4KSAtIDQ0NiwgMCwgZSA9IDI0MjMpXShuLCB1LCByKTsgdmFyIHQsIGU7IH0gfTsgZnVuY3Rpb24gYShuLCB1LCByLCB0KXsgZnVuY3Rpb24gZShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIEQoZSwgMCwgMCwgMCwgdCAtIC05NzYpOyB9IGZ1bmN0aW9uIGkobiwgdSwgciwgdCl7IHJldHVybiBEKHQsIDAsIDAsIDAsIHIgLSAtNjI1KTsgfSBmdW5jdGlvbiBmKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gRChlLCAwLCAwLCAwLCByIC0gNDI3KTsgfSByZXR1cm4gc1tmKDAsIDMxNzksIDQwNTgsIDMyNzMsIDI5NzIpXShzW2koMCwgNzU3LCAzMzUsIC0yMzYpXSwgc1tpKDAsIDI5ODMsIDE4MjcsIDE0ODIpXSkgPyBIW3NbZigwLCAxNjA0LCAyOTE1LCAzNzcwLCAyNTIxKV0oTywgNDA4LCAtMjMpXShDLCByLCB3KSA6IHNbZSgwLCA1MjIsIDI0NTYsIDE1MTIsIDEzMjIpXShfTCwgc1tlKDAsIDEyNjMsIC0xMjEsIDEyMywgLTkyMildKHQsIDgzNyksIG4pOyB9IGZ1bmN0aW9uIG4obiwgdSwgciwgdCl7IGZ1bmN0aW9uIGUobiwgdSwgciwgdCl7IHJldHVybiBvKDAsIDAsIHIsIHQgLSAtMjYyKTsgfSBmdW5jdGlvbiBpKG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gSSgwLCBuIC0gLTM2NywgMCwgZSk7IH0gZnVuY3Rpb24gZihuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGMoMCwgdSwgMCwgZSAtIC00NCk7IH0gcmV0dXJuIHNbZSgwLCAwLCAyNTI5LCAxMzgwKV0oc1tpKDcyOSwgMCwgMTI4NSwgMCwgLTQwNildLCBzW2koMzEzLCAwLCAtOTY0LCAwLCAxMzA3KV0pID8gc1tlKDAsIDAsIDE3NTcsIDE3NjIpXShuLCBFKSA6IHNbZigwLCA0MzQxLCAwLCAwLCAzNzExKV0oX0wsIHNbZigwLCAyNDcxLCAwLCAwLCAxNDAyKV0odCwgNDg2KSwgdSk7IH0gZnVuY3Rpb24gbChuLCB1LCByLCB0KXsgcmV0dXJuIHkoMCwgMCwgMCwgdCwgbiAtIDQyOCk7IH0gZnVuY3Rpb24gSyhuLCB1LCByLCB0LCBlKXsgZnVuY3Rpb24gaShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGwoZSAtIC04MjAsIDAsIDAsIHUpOyB9IGZ1bmN0aW9uIGYobiwgdSwgciwgdCwgZSl7IHJldHVybiBsKHQgLSAtNjUxLCAwLCAwLCBlKTsgfSByZXR1cm4gU1tpKDAsIDIxNDUsIDAsIDAsIDIyOTMpXShTW2koMCwgMTgsIDAsIDAsIDc2NCldLCBTW2koMCwgMTA5MiwgMCwgMCwgNzY0KV0pID8gU1tmKDAsIDAsIDAsIDE4MDgsIDIyNzQpXShfTCwgU1tJKDAsIChhID0gMTA1OSkgLSA4MzMsIG8gPSA0OTcsIG8pXShlLCAyOSksIHUpIDogc1tmKDAsIDAsIDAsIDE5OTEsIDE0NzUpXShFLCAwLCBzW0QoLTQ0OSwgYyA9IC0zMjgsIDAsIDAsIGMgLSAtMTQyNyldKF9MLCAxMzkxKSwgSCk7IHZhciBjLCBvLCBhOyB9IGZ1bmN0aW9uIEQobiwgdSwgciwgdCwgZSl7IHJldHVybiBSKDAsIDAsIDAsIGUgLSAxNDEwLCBuKTsgfSB2YXIgUSA9IHsgY3ZuSHg6IGZ1bmN0aW9uIGN2bkh4KG4sIHUsIHIpeyBmdW5jdGlvbiB0KG4sIHUsIHIsIHQsIGUpeyByZXR1cm4gbygwLCAwLCBlLCB1IC0gODk4KTsgfSBmdW5jdGlvbiBlKG4sIHUsIHIsIHQpeyByZXR1cm4gbCh0IC0gMTQ2LCAwLCAwLCByKTsgfSByZXR1cm4gU1tEKDExNDMsIDAsIDAsIDAsIDI0NzkgLSA2NyldKFNbZSgwLCAwLCAxMTAwLCAxNDIxKV0sIFNbdCgwLCAyMDU0LCAwLCAwLCAyNTY2KV0pID8gU1tlKDAsIDAsIDE1MjcsIDI1NjQpXShuLCB1LCByKSA6IHNbdCgwLCAzNDQzLCAwLCAwLCA0MTAwKV0obiwgRSk7IH0sIFVCUlNtOiBmdW5jdGlvbiBVQlJTbShuLCByKXsgZnVuY3Rpb24gdChuLCB1LCByLCB0LCBlKXsgcmV0dXJuIG8oMCwgMCwgdCwgZSAtIDU4NSk7IH0gdmFyIGUgPSB7IGNwVktlOiBmdW5jdGlvbiBjcFZLZShuLCByLCB0LCBlLCBpLCBmKXsgcmV0dXJuIHNbdSgxNTQ2LCAyOTE2KV0obiwgciwgdCwgZSwgaSwgZik7IH0sIHhiWEx6OiBmdW5jdGlvbiB4YlhMeihuLCByKXsgcmV0dXJuIHNbdSgyNjIwLCA0MTE2KV0obiwgcik7IH0gfTsgZnVuY3Rpb24gaShuLCB1LCByLCB0LCBlKXsgcmV0dXJuIGMoMCwgZSwgMCwgdSAtIC0yODIpOyB9IHJldHVybiBzW28oMCwgMCwgMjUwNywgMTQ2OSAtIC0xODApXShzW3QoMCwgMCwgMCwgMzcxNywgMjgyNCldLCBzW3QoMCwgMCwgMCwgMTI3NywgMTcyOCldKSA/IHNbaSgwLCAyMjQxLCAwLCAwLCAyODk0KV0obiwgcikgOiBlW3QoMCwgMCwgMCwgMTAyMywgMTU4OCldKEUsIGVbaSgwLCAxMjM1LCAwLCAwLCAyNTMwKV0oX0wsIDU1MiksIDAsIDAsIDAsIEgpOyB9LCBlcmlWVzogU1tJKDAsIDI2MywgMCwgLTYyKV0oX0wsIDM4NCwgNjI3KSwgRXFrbXA6IFNbbygwLCAwLCA2ODgsIDE5MjQpXShTW0koMCwgMTUzNCwgMCwgMTQ5MCldKFNbRCgxODIwLCAwLCAwLCAwLCAxNzgzKV0oX0wsIDQwMCwgMTk2KSwgU1tjKDAsIDM5NjQsIDAsIDM5MTEpXShfTCwgNTI5LCA2MTUpKSwgIm16IiksIERHVUJBOiBTW2MoMCwgMzk1MCwgMCwgMjY1OSldKF9MLCA2MDIsIDc5OSksIEN5aWpqOiBTW2MoMCwgMTkxOCwgMCwgMTk1NildKF9MLCA1OTAsIDkwMyksIGtFZndsOiBTW0koMCwgMjUxOCwgMCwgMjAxMSldKFNbbygwLCAwLCAyMzkyLCAxNDgzKV0oU1tJKDAsIDIwMDEsIDAsIDMxOTApXShfTCwgNDExLCAzNjcpLCBTW2woNjI2LCAwLCAwLCA2NjApXShfTCwgMzk2LCAxMTI2KSksICJmUyIpLCBMQnhtVTogU1tJKDAsIDg0NywgMCwgNjk0KV0oX0wsIDQwMywgMTI5NCksIGFhcHdxOiBTW28oMCwgMCwgMjc3NCwgMTg0NildKF9MLCAzODYsIDg2OCksIGFmTVVJOiBTW0QoMjE5MSwgMCwgMCwgMCwgMzM1MyldKFNbbCgyNDU2LCAwLCAwLCAzMTg0KV0oU1tsKDc3MiwgMCwgMCwgLTI0OSldKF9MLCA1MjMsIDM4NCksIFNbbCgyODM0LCAwLCAwLCAzNTg1KV0oX0wsIDQ5MCwgMzIyKSksICJtIiksIExTY3JWOiBTW2MoMCwgMjUxMywgMCwgMjQyMildKFNbbygwLCAwLCAzODc0LCAzMDIyKV0oX0wsIDQzMywgNzkxKSwgIkhYIiksIGRuQ2xmOiBTW28oMCwgMCwgMjI0OCwgMjk1NyldKF9MLCA0NzEsIDE0MTgpLCBJSlFXQzogU1tsKDcyNSwgMCwgMCwgLTUwMCldKFNbbygwLCAwLCAxMzIyLCAyMzQ5KV0oU1tsKDE0ODYsIDAsIDAsIDE1MjUpXShfTCwgNDYxLCAyNDMpLCBTW2MoMCwgMTkyNiwgMCwgMjg3MildKF9MLCA0MTMsIDExNjQpKSwgIkFNIiksIENvRFZGOiBTW2MoMCwgMTI0NSwgMCwgMjMxMCldKF9MLCA1ODcsIDEwMjQpLCBWclFaZzogU1tsKDE4NTEsIDAsIDAsIDIwMzkpXShTW0QoMjU1MiwgMCwgMCwgMCwgMTMzOSldKFNbYygwLCAyMjgwLCAwLCAyNzk4KV0oX0wsIDU5NSwgOTgzKSwgU1tsKDc3MSwgMCwgMCwgMTU4MildKF9MLCA1NDUsIDQ5NykpLCAiT0IiKSwgVU1BbFY6IFNbYygwLCAyODczLCAwLCAzMzkxKV0oX0wsIDQ3NCwgNjQxKSwgcEZKTFE6IFNbbygwLCAwLCAyMDE0LCAyNzk1KV0oX0wsIDU1MywgMTM5NyksIE5GdW5LOiBTW0koMCwgNDM5LCAwLCAyNDIpXShTW28oMCwgMCwgMzg1NCwgMjc5NSldKF9MLCA1MTgsIDFlMyksIFNbYygwLCAxODg0LCAwLCAzMDY0KV0oX0wsIDQzMCwgNjg1KSksIFB6S1dROiBTW28oMCwgMCwgMjA5OSwgMTUyOCldKFNbRCgzMDgyLCAwLCAwLCAwLCAzNDQ3KV0oU1tJKDAsIDIyMjAsIDAsIDE4MTYpXShfTCwgNDg5LCA1NTUpLCBTW0koMCwgNjIzLCAwLCA3MzIpXShfTCwgNDQ2LCA4NDIpKSwgInJFIiksIGFsWVJEOiBTW28oMCwgMCwgODE2LCAxNDM5KV0oU1tvKDAsIDAsIDEzMzUsIDkwMCldKF9MLCA0NTgsIDEzNzYpLCBTW2woMjA4OCwgMCwgMCwgMTk0OSldKF9MLCA1ODksIDY4OCkpLCBLaGhDczogU1tEKDM0MTIsIDAsIDAsIDAsIDMwODApXShfTCwgNTIwLCA3NzYpLCB0dWF1YzogU1tjKDAsIDE3OTUsIDAsIDI1NTApXShfTCwgNTU4LCAxMzI2KSwgb1FxRXo6IFNbbCg2MjYsIDAsIDAsIDMzNyldKF9MLCA0OTEsIDcyMSksIG1Ba1FtOiBTW2MoMCwgMTc4MywgMCwgMjUzMyldKF9MLCA1NDQsIDYyMSksIGRMV1hlOiBTW0koMCwgODQ2LCAwLCAxNTcpXShfTCwgNDM0LCA1MDgpLCBoUURqQzogU1tJKDAsIDM3NCwgMCwgLTc2MyldKF9MLCA0MTcsIDM3NSkgfSwgciA9IFtRW1NbbygwLCAwLCAzOTA4LCAyNjEwKV0oX0wsIDM4OSwgNzI0KV0sIFFbU1tvKDAsIDAsIDM2OTEsIDI3MzEpXShfTCwgNDU3LCAxMzk4KV0sIFFbU1tsKDE3MzcsIDAsIDAsIDE3NDgpXShfTCwgNTg0LCA2ODApXSwgUVtTW28oMCwgMCwgMTk0MSwgMjcxMildKF9MLCA1MDIsIDQwNCldLCBRW1NbSSgwLCAyNTYyLCAwLCAyMTIzKV0oX0wsIDU1OSwgMTM1NSldLCBRW1NbbCgyNDcxLCAwLCAwLCAzMTU3KV0oX0wsIDQ0MiwgNTAxKV0sIFFbU1tEKDUwNCwgMCwgMCwgMCwgMTAwOSldKF9MLCA0OTIsIDY4OCldLCBRW1NbSSgwLCAyMjIwLCAwLCAxNzMwKV0oX0wsIDQyNywgNTM5KV0sIFFbU1tEKDI2NzAsIDAsIDAsIDAsIDIwMDQpXShfTCwgNDMyLCA3NTApXSwgUVtTW2woMjExMCwgMCwgMCwgMTQwNSldKF9MLCA1MDgsIDU3MCldLCBRW1NbRCgxODMsIDAsIDAsIDAsIDk4MildKF9MLCA2MDgsIDgxMSldLCBRW1NbSSgwLCAxNjE5LCAwLCA5NjIpXShfTCwgNTYwLCAxMDc4KV0sIFFbU1tEKDYyMiwgMCwgMCwgMCwgMTU0MildKF9MLCA0MjAsIDYxOCldLCBRW1NbbygwLCAwLCAyOTcsIDEwOTQpXShfTCwgNDc1LCA0NDcpXSwgUVtTW0QoNDU0MCwgMCwgMCwgMCwgMzQ1OSldKF9MLCA2MTksIDg0MildLCBRW1NbbygwLCAwLCAyMTk5LCAxODY0KV0oX0wsIDU5MSwgOTMyKV0sIFFbU1tEKDM5MDQsIDAsIDAsIDAsIDMxMzApXShfTCwgNTkzLCA5NjYpXSwgUVtTW28oMCwgMCwgMzc2NywgMjQ5MildKF9MLCA0NTAsIDExNzgpXSwgUVtTW0QoMjU3LCAwLCAwLCAwLCAxNDY4KV0oX0wsIDQ4MSwgNDU5KV0sIFFbU1tJKDAsIDczMywgMCwgMTc0OSldKF9MLCA1MTAsIDI4NildLCBRW1NbbygwLCAwLCAzMCwgMTIwMSldKF9MLCA0OTksIDU4OSldLCBRW1NbbCgyMDExLCAwLCAwLCA5OTYpXShfTCwgNDU0LCA4NTEpXSwgUVtTW0koMCwgMTk4NSwgMCwgMTE1MyldKF9MLCA1MzQsIDkxMCldXTsgZnVuY3Rpb24gSShuLCB1LCByLCB0KXsgcmV0dXJuIE4oMCwgMCwgMCwgdCwgdSAtIC0xMTMwKTsgfSByZXR1cm4gKG5uID0gZnVuY3Rpb24gbm4oKXsgZnVuY3Rpb24gZShuLCByKXsgaWYgKCFzW3UoMTcyNCwgMjM4NCldKHNbdSgyNDM2LCAyMDg3KV0sIHNbdSgyNDM2LCAzNjcxKV0pKSByZXR1cm4gc1t1KDI5OTcsIDM2MTcpXShLLCAwLCByLCAwLCAwLCBzW3UoNjQwLCA4NjEpXShuLCAxNjIpKTsgbiArPSBFOyB9IHZhciBpID0geyBpQUpuSjogZnVuY3Rpb24gaUFKbkoobiwgciwgdCl7IHZhciBlID0geyBncW1TYzogZnVuY3Rpb24gZ3FtU2MobiwgciwgdCl7IHJldHVybiBzW3UoMjAyOSwgMTM1NildKG4sIHIsIHQpOyB9IH07IHJldHVybiBzW3UoMzEyMSwgMjc3MSldKHNbdSg4NDgsIDExNzYpXSwgc1t1KDg0OCwgMTY1MildKSA/IFFbc1t1KDI5NDksIDQyNDcpXShfTCwgNDA4LCAtMjMpXShuLCByLCB0KSA6IEhbZVt1KDkzMCwgNjEyKV0oTywgNjE4LCAtMTY1KV0oQywgdCwgdyk7IH0gfTsgaWYgKFFbc1tjKDMzNDksIDMyMjYpXShlLCA2NDMsIDczMSldKFFbc1tjKDExNjQsIDMwNyldKGUsIDgwNywgNzkzKV0sIFFbc1tjKDIzMDIsIDIzNTgpXShuLCAwLCA3MTksIDAsIHNbbCgxMDQ3IC0gLTk1MiwgMCwgMCwgLTI2OCldKDcyMCwgLTM4MikpXSkpIHJldHVybiByOyB2YXIgZiA9IHYgPyBmdW5jdGlvbigpeyBmdW5jdGlvbiBuKG4sIHUsIHIpeyByZXR1cm4gRChyLCAwLCAwLCAwLCBuIC0gMTQ5IC0gMjQxKTsgfSBpZiAoZil7IHZhciB1ID0gRVtpW3NbbigyNzUxLCAwLCAyNjU4KV0oYSwgMjE4LCAwLCAwLCBzW2MoKHQgPSAxOTc2KSAtIC0zNzksIHIgPSAxNjU3KV0oc1tuKDE2MTAsIDAsIDI4NjApXSgxNzIsIC04MSksIC0xMTgwKSldKEssIDQxOCwgNjA2KV0oZSwgYXJndW1lbnRzKTsgcmV0dXJuIHAgPSBudWxsLCB1OyB9IHZhciByLCB0OyB9IDogZnVuY3Rpb24oKXt9OyBmdW5jdGlvbiBjKG4sIHUpeyByZXR1cm4gbygwLCAwLCB1LCBuIC0gNDc1KTsgfSByZXR1cm4gX0wgPSAhMSwgZjsgfSkoKTsgfSBmb3IgKHZhciB1biA9IDA7IFNbWSgyMDkyLCAyMjY0KV0odW4sIHJbWSgtMzA2LCA5MzYpICsgImgiXSk7IHVuKyspeyB2YXIgZSA9IHJbdSgxODE3LCAxNzA0KSArICJ0Il0odW4pLCBybiA9IEVbdSgxNDk4LCAyNDE0KSArICJPZiJdKGUpOyBpZiAoU1tZKDc5NCwgMTU1NSldKHJuLCAtMSkpIGZvciAodmFyIHRuID0gU1tZKDE5ODEsIDEzMjUpXVt1KDE0MDYsIDE1OCldKCJ8IiksIGVuID0gMDs7KXsgc3dpdGNoICh0bltlbisrXSl7IGNhc2UgIjAiOiB2YXIgZm4gPSBfW3UoMTgxNywgMTIyNCkgKyAidCJdKFNbdSgyODcyLCA0NzY1KV0odW4sIF9bWSgzMjUsIDkzNikgKyAiaCJdKSk7IGNvbnRpbnVlOyBjYXNlICIxIjogdmFyIGNuID0gRVt1KDE0OTgsIDEyMzYpICsgIk9mIl0oZm4pOyBjb250aW51ZTsgY2FzZSAiMiI6IHZhciB0ID0gRVt1KDE4MTcsIC0zMjgpICsgInQiXShpKTsgY29udGludWU7IGNhc2UgIjMiOiBIICs9IHQ7IGNvbnRpbnVlOyBjYXNlICI0IjogdmFyIGkgPSBTW2IoMzk1MiwgMCwgMzYwMyldKFNbdSgxMDk3LCAyOTU4KV0oU1tZKDIyOTQsIDEyNDApXShybiwgY24pLCBFW2IoMTczMSwgMCwgMTQzOCkgKyAiaCJdKSwgRVtZKDE3MjYsIDkzNikgKyAiaCJdKTsgY29udGludWU7IH0gYnJlYWs7IH0gZWxzZSBIICs9IGU7IH0gcmV0dXJuIFNbdSgxNDk0LCA4ODIpXShnemluZmxhdGUsIFNbWSgxMTQ3LCAyMTM4KV0oYXRvYiwgU1tZKDMzNzgsIDI1MjgpXShkZWNvZGVVUklDb21wb25lbnQsIFNbdSg4NzYsIC0xMDQwKV0oZXNjYXBlLCBIKSkpKTsgfSBwKCk7IGZ1bmN0aW9uIGJ1ZmYyYmluKG4peyBuID0gbmV3IFVpbnQ4QXJyYXkobik7IHJldHVybiBhdG9iKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgbikpOyB9IGZ1bmN0aW9uIGJ1ZmYyYmFzZShuKXsgbiA9IG5ldyBVaW50OEFycmF5KG4pOyByZXR1cm4gYnRvYShTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIG4pKTsgfSBmdW5jdGlvbiBiYXNlMmJ1ZmYobil7IHJldHVybiBuZXcgVWludDhBcnJheShhdG9iKG4pLnNwbGl0KCIiKS5tYXAoZnVuY3Rpb24obil7IHJldHVybiBuLmNoYXJDb2RlQXQoMCk7IH0pKS5idWZmZXI7IH0gZnVuY3Rpb24gZ3ppbmZsYXRlKG4peyBuID0gbi5zcGxpdCgiIikubWFwKGZ1bmN0aW9uKG4peyByZXR1cm4gbi5jaGFyQ29kZUF0KDApOyB9KTsgdmFyIHIgPSBuZXcgWmxpYi5SYXdJbmZsYXRlKG4pOyBuID0gci5kZWNvbXByZXNzKCk7IHJldHVybiBuZXcgVGV4dERlY29kZXIoInV0Zi04IikuZGVjb2RlKG4pOyB9IGZ1bmN0aW9uIGVycm9yKGUpe30=');
      var decrypt = Utils.decodeSecret([78, 81, 75, 20, 65, 92, 71, 16, 9, 24, 107, 100, 24, 19, 29, 20, 13, 20, 67, 77, 21, 20, 105, 85, 93, 82, 20, 5, 16, 77, 92, 90, 74, 26, 106, 88, 81, 82, 2, 20, 69, 88, 70, 16, 100, 84, 81, 64, 81, 65, 83, 71, 16, 9, 24, 86, 76, 90, 80, 77, 93, 95, 90, 24, 96, 85, 85, 74, 92, 70, 90, 71, 16, 83, 16, 79, 19, 75, 81, 67, 26, 72, 69, 74, 92, 27, 90, 29, 11, 20, 69, 11, 25, 66, 82, 75, 20, 104, 121, 116, 120, 77, 64, 67, 107, 81, 65, 65, 93, 67, 77, 20, 14, 25, 82, 69, 90, 91, 68, 80, 91, 93, 25, 108, 125, 120, 112, 68, 77, 68, 97, 92, 69, 69, 81, 75, 68, 17, 29, 72, 25, 64, 88, 93, 75, 30, 86, 68, 86, 87, 20, 13, 20, 94, 69, 87, 87, 71, 80, 91, 94, 28, 17, 75, 68, 15, 19, 77, 92, 89, 71, 22, 67, 92, 64, 97, 92, 69, 69, 81, 75, 68, 113, 81, 82, 93, 81, 66, 20, 5, 16, 95, 65, 93, 90, 64, 89, 91, 86, 24, 16, 79, 78, 2, 20, 68, 92, 81, 67, 23, 71, 86, 87, 80, 16, 9, 24, 86, 76, 90, 80, 77, 93, 95, 90, 16, 25, 66, 73, 8, 25, 73, 11, 20, 78, 81, 75, 20, 107, 125, 91, 93, 85, 81, 94, 107, 81, 66, 76, 81, 67, 64, 24, 13, 25, 108, 126, 117, 124, 68, 64, 72, 98, 92, 69, 70, 92, 71, 68, 15, 24, 68, 75, 77, 19, 66, 20, 85, 66, 89, 92, 17, 71, 80, 75, 93, 64, 64, 17, 11, 25, 73, 19, 90, 85, 68, 87, 80, 16, 17, 81, 26, 66, 73, 16, 70, 93, 68, 76, 70, 93, 25, 70, 85, 71, 3]);
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
        network.clear();
        network.timeout(10000);
        network.silent(url, function (json) {
          success(json);
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
            if (link) link = (prefer_http || prox ? 'http:' : 'https:') + link;
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

      function success(json) {
        component.loading(false);

        if (json && json.results && json.results.length) {
          extract = json.results;
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
        extract.forEach(function (v) {
          if (v.episodes) {
            for (var s_num in v.episodes) {
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
          extract.forEach(function (v, v_id) {
            if (v.episodes && v.episodes[s_num]) {
              var voice = v.translation + (v.studio ? ' (' + v.studio + ')' : '');
              filter_items.voice.push(voice);
              filter_items.voice_info.push({
                id: v_id
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

        if (filter_items.season[choice.season]) {
          var s_num = filter_items.season_num[choice.season];

          if (filter_items.voice_info[choice.voice]) {
            var voice = filter_items.voice[choice.voice];
            var v = extract[filter_items.voice_info[choice.voice].id];

            if (v && v.episodes && v.episodes[s_num]) {
              var episodes = v.episodes[s_num];

              for (var e_num in episodes) {
                filtred.push({
                  title: 'S' + s_num + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + e_num,
                  quality: (episodes[e_num] ? episodes[e_num] + 'p' : v.max_qual ? v.max_qual + 'p' : '360p ~ 1080p') + (v.quality ? ' - ' + v.quality : ''),
                  info: ' / ' + Lampa.Utils.shortText(voice, 50),
                  season: s_num,
                  episode: e_num,
                  media: v
                });
              }
            }
          }
        } else {
          extract.forEach(function (v) {
            var voice = v.translation + (v.studio ? ' (' + v.studio + ')' : '');
            filtred.push({
              title: voice,
              quality: (v.max_qual ? v.max_qual + 'p' : '360p ~ 1080p') + (v.quality ? ' - ' + v.quality : ''),
              info: '',
              media: v
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
        if (element.media.streams) return getFileStream(element, call, error);
        if (!element.media.link) return error();
        var link = element.media.link;
        if (prefer_http || prox) link = link.replace('https://', 'http://');
        var url = prox + link;
        network.clear();
        network.timeout(10000);
        network.silent(url, function (str) {
          str = str.replace(/\n/g, '');
          var scripts = str.match(/<script>(.*?)<\/script>/g);

          if (scripts) {
            var tmp = scripts.filter(function (s) {
              return s.indexOf('Playerjs') !== -1;
            });
            if (tmp.length) scripts = tmp;
            tmp = scripts.filter(function (s) {
              return s.indexOf('gzinflate') !== -1;
            });
            if (tmp.length) scripts = tmp;
            tmp = scripts.filter(function (s) {
              return s.indexOf('eval') !== -1;
            });
            if (tmp.length) scripts = tmp;

            if (scripts.length) {
              var streams = {};
              var configs;

              try {
                configs = (0, eval)('"use strict"; (function(script){\n' + lib + '\n' + decrypt + '\n' + '}).call({},' + JSON.stringify(scripts[0].substring(8, scripts[0].length - 9)) + ');');
              } catch (e) {}

              if (configs && configs.length) {
                var file = configs[0].file || '';

                if (file) {
                  try {
                    streams = JSON.parse(file);
                  } catch (e) {
                    streams = {
                      file: file
                    };
                  }
                }
              }

              element.media.streams = streams;
              return getFileStream(element, call, error);
            }
          }

          error();
        }, error, false, {
          dataType: 'text'
        });
      }
      /**
       * Получить поток
       * @param {*} element
       */


      function getFileStream(element, call, error) {
        if (element.stream) return call(element);
        if (!element.media.streams) return error();
        var streams = element.media.streams;
        var stream = '';

        if (streams.file) {
          stream = streams.file;
        } else if (streams.length && element.season) {
          streams.forEach(function (s) {
            if (s.folder) {
              var s_num = (s.title || '').match(/ (\d+)$/);

              if (s_num && s_num[1] == element.season) {
                s.folder.forEach(function (e) {
                  var e_num = (e.title || '').match(/ (\d+)$/);

                  if (e_num && e_num[1] == element.episode) {
                    stream = e.file;
                  }
                });
              }
            }
          });
        }

        var items = extractItems(stream);
        var link = items[0] && items[0].file || '';
        if (!link || link.indexOf('/index.m3u8') == -1) return error();

        if (!prefer_http) {
          var file = prox + link;
          var quality = {};
          items.forEach(function (item) {
            quality[item.label] = prox + item.file;
          });
          var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
          if (quality[preferably]) file = quality[preferably];
          element.stream = file;
          element.qualitys = quality;
          return call(element);
        }

        network.clear();
        network.timeout(10000);
        network.silent(prox + link, function (str) {
          var links = component.parseM3U(str);
          var link = links[0] && links[0].link || '';
          if (!link) return error();
          if (prefer_http) link = link.replace('https://', 'http://');
          var found = link.match(/(https?:\/\/[^\/]*\/secure\/([^\/]*)\/([^\/]*)\/([^\/]*)\/(([^\/]*)\/)?)([^\/]*\.mp4)\//);

          if (found) {
            var _file = found[1] + found[7] + '/index.m3u8';

            _file = Lampa.Utils.addUrlComponent(_file, 'hash=' + found[2]);
            _file = Lampa.Utils.addUrlComponent(_file, 'expires=' + found[3]);
            _file = Lampa.Utils.addUrlComponent(_file, 'id=' + found[4]);
            if (found[6]) _file = Lampa.Utils.addUrlComponent(_file, 's=' + found[6]);
            _file = Lampa.Utils.addUrlComponent(_file, 'name=' + found[7]);
            var _quality = false;
            var name_template = found[7].replace(items[0].quality + '', '%s');

            if (name_template !== found[7]) {
              _quality = {};
              items.forEach(function (item) {
                if (item.quality) {
                  var name = name_template.replace('%s', item.quality + '');

                  var _file2 = found[1] + name + '/index.m3u8';

                  _file2 = Lampa.Utils.addUrlComponent(_file2, 'hash=' + found[2]);
                  _file2 = Lampa.Utils.addUrlComponent(_file2, 'expires=' + found[3]);
                  _file2 = Lampa.Utils.addUrlComponent(_file2, 'id=' + found[4]);
                  if (found[6]) _file2 = Lampa.Utils.addUrlComponent(_file2, 's=' + found[6]);
                  _file2 = Lampa.Utils.addUrlComponent(_file2, 'name=' + name);
                  _quality[item.label] = _file2;
                }
              });

              var _preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';

              if (_quality[_preferably]) _file = _quality[_preferably];
            }

            element.stream = _file;
            element.qualitys = _quality;
            return call(element);
          }

          error();
        }, error, false, {
          dataType: 'text'
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

    function hdvb(component, _object) {
      var network = new Lampa.Reguest();
      var extract = [];
      var backend = 'http://back.freebie.tom.ru/lampa/hdvburl?v=2224';
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

    var proxyInitialized = false;
    var proxyWindow;
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
        var ip = Utils.getMyIp();
        var proxy1 = (window.location.protocol === 'https:' ? 'https://' : 'http://') + 'prox.lampa.stream/';
        var proxy2 = 'https://cors.nb557.workers.dev/' + (ip ? 'ip' + ip + '/' : '');
        var proxy3 = Lampa.Storage.field('online_mod_proxy_other_url');
        var alt_proxy = Lampa.Storage.field('online_mod_proxy_other') === true ? proxy3 || proxy2 : proxy1;

        if (Lampa.Storage.field('online_mod_proxy_' + name) === true) {
          if (name === 'rezka') return alt_proxy;
          if (name === 'rezka2') return alt_proxy;
          if (name === 'kinobase') return alt_proxy;
          if (name === 'cdnmovies') return proxy3 || proxy2;
          if (name === 'videodb') return proxy3 || proxy2;
          if (name === 'zetflix') return proxy3 || proxy2;
          if (name === 'redheadsound') return proxy3 || proxy2;
          if (name === 'anilibria') return alt_proxy;
          if (name === 'kodik') return proxy3 || proxy2;
          if (name === 'kinopub') return proxy3 || proxy2;
          if (name === 'bazon') return proxy3 || proxy2;
        }

        return '';
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
        redheadsound: new redheadsound(this, object),
        anilibria: new anilibria(this, object),
        kodik: new kodik(this, object),
        kinopub: new kinopub(this, object),
        bazon: new bazon(this, object),
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
        filter_sources.push('bazon');
        filter_sources.push('filmix2');
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
          if (!object.clarification && +object.movie.kinopoisk_id && ['rezka', 'collaps', 'cdnmovies', 'videodb', 'zetflix', 'kodik', 'bazon', 'hdvb'].indexOf(balanser) >= 0) {
            _this2.extendChoice();

            sources[balanser].search(object, +object.movie.kinopoisk_id);
          } else if (!object.clarification && object.movie.imdb_id && ['rezka', 'collaps', 'cdnmovies', 'videodb', 'zetflix', 'kodik', 'bazon', 'hdvb'].indexOf(balanser) >= 0) {
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
          var width = 0;
          var height = 0;
          str.split('\n').forEach(function (line) {
            line = line.trim();

            if (line.charAt(0) == '#') {
              var resolution = line.match(/\bRESOLUTION=(\d+)x(\d+)\b/);

              if (resolution) {
                width = parseInt(resolution[1]);
                height = parseInt(resolution[2]);
              }
            } else if (line.length) {
              pl.push({
                width: width,
                height: height,
                link: line
              });
              width = 0;
              height = 0;
            }
          });
        } catch (e) {}

        return pl;
      };

      this.proxyCall = function (method, url, timeout, post_data, call_success, call_fail) {
        var process = function process() {
          if (proxyWindow) {
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
            proxyWindow.postMessage({
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

        if (!proxyInitialized) {
          proxyInitialized = true;
          var proxyOrigin = (window.location.protocol === 'https:' ? 'https://' : 'http://') + 'nb557.surge.sh';
          var proxyUrl = proxyOrigin + '/proxy.html';

          if (Lampa.Storage.field('online_mod_alt_iframe_proxy') === true) {
            proxyOrigin = 'https://nb557.github.io';
            proxyUrl = proxyOrigin + '/plugins/proxy.html';
          }

          var proxyIframe = document.createElement('iframe');
          proxyIframe.setAttribute('src', proxyUrl);
          proxyIframe.setAttribute('width', '0');
          proxyIframe.setAttribute('height', '0');
          proxyIframe.setAttribute('tabindex', '-1');
          proxyIframe.setAttribute('title', 'empty');
          proxyIframe.setAttribute('style', 'display:none');
          proxyIframe.addEventListener('load', function () {
            proxyWindow = proxyIframe.contentWindow;
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
        sources.redheadsound.destroy();
        sources.anilibria.destroy();
        sources.kodik.destroy();
        sources.kinopub.destroy();
        sources.bazon.destroy();
        sources.filmix2.destroy();
        sources.hdvb.destroy();
        window.removeEventListener('resize', minus);
      };
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
      online_mod_nolink: {
        ru: 'Не удалось извлечь ссылку',
        uk: 'Неможливо отримати посилання',
        be: 'Не ўдалося атрымаць спасылку',
        en: 'Failed to fetch link',
        zh: '获取链接失败'
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
        zh: '您需要通过验证码。 尝试使用镜像而不是代理'
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
        zh: '比 HLS 更喜欢 DASH'
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
      online_mod_rezka2_mirror: {
        ru: 'Зеркало для rezka2',
        uk: 'Дзеркало для rezka2',
        be: 'Люстэрка для rezka2',
        en: 'Mirror for rezka2',
        zh: 'rezka2的镜子'
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

    function resetTemplates() {
      Lampa.Template.add('online_mod', "<div class=\"online selector\">\n        <div class=\"online__body\">\n            <div style=\"position: absolute;left: 0;top: -0.3em;width: 2.4em;height: 2.4em\">\n                <svg style=\"height: 2.4em; width:  2.4em;\" viewBox=\"0 0 128 128\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <circle cx=\"64\" cy=\"64\" r=\"56\" stroke=\"white\" stroke-width=\"16\"/>\n                    <path d=\"M90.5 64.3827L50 87.7654L50 41L90.5 64.3827Z\" fill=\"white\"/>\n                </svg>\n            </div>\n            <div class=\"online__title\" style=\"padding-left: 2.1em;\">{title}</div>\n            <div class=\"online__quality\" style=\"padding-left: 3.4em;\">{quality}{info}</div>\n        </div>\n    </div>");
      Lampa.Template.add('online_mod_folder', "<div class=\"online selector\">\n        <div class=\"online__body\">\n            <div style=\"position: absolute;left: 0;top: -0.3em;width: 2.4em;height: 2.4em\">\n                <svg style=\"height: 2.4em; width:  2.4em;\" viewBox=\"0 0 128 112\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <rect y=\"20\" width=\"128\" height=\"92\" rx=\"13\" fill=\"white\"/>\n                    <path d=\"M29.9963 8H98.0037C96.0446 3.3021 91.4079 0 86 0H42C36.5921 0 31.9555 3.3021 29.9963 8Z\" fill=\"white\" fill-opacity=\"0.23\"/>\n                    <rect x=\"11\" y=\"8\" width=\"106\" height=\"76\" rx=\"13\" fill=\"white\" fill-opacity=\"0.51\"/>\n                </svg>\n            </div>\n            <div class=\"online__title\" style=\"padding-left: 2.1em;\">{title}</div>\n            <div class=\"online__quality\" style=\"padding-left: 3.4em;\">{quality}{info}</div>\n        </div>\n    </div>");
    }

    var button = "<div class=\"full-start__button selector view--online_mod\" data-subtitle=\"online_mod 28.10.2023\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:svgjs=\"http://svgjs.com/svgjs\" version=\"1.1\" width=\"512\" height=\"512\" x=\"0\" y=\"0\" viewBox=\"0 0 244 260\" style=\"enable-background:new 0 0 512 512\" xml:space=\"preserve\" class=\"\">\n    <g xmlns=\"http://www.w3.org/2000/svg\">\n        <path d=\"M242,88v170H10V88h41l-38,38h37.1l38-38h38.4l-38,38h38.4l38-38h38.3l-38,38H204L242,88L242,88z M228.9,2l8,37.7l0,0 L191.2,10L228.9,2z M160.6,56l-45.8-29.7l38-8.1l45.8,29.7L160.6,56z M84.5,72.1L38.8,42.4l38-8.1l45.8,29.7L84.5,72.1z M10,88 L2,50.2L47.8,80L10,88z\" fill=\"currentColor\"/>\n    </g></svg>\n\n    <span>#{online_mod_title}</span>\n    </div>"; // нужна заглушка, а то при страте лампы говорит пусто

    Lampa.Component.add('online_mod', component); //то же самое

    resetTemplates();
    var network = new Lampa.Reguest();
    Lampa.Listener.follow('full', function (e) {
      if (e.type == 'complite') {
        var btn = $(Lampa.Lang.translate(button));
        var loading = false;
        btn.on('hover:enter', function () {
          var onComplite = function onComplite() {
            loading = false;
            resetTemplates();
            Lampa.Component.add('online_mod', component);
            Lampa.Activity.push({
              url: '',
              title: Lampa.Lang.translate('online_mod_title_full'),
              component: 'online_mod',
              search: e.data.movie.title,
              search_one: e.data.movie.title,
              search_two: e.data.movie.original_title,
              movie: e.data.movie,
              page: 1
            });
          };

          Utils.setMyIp('');

          if (Lampa.Storage.field('online_mod_proxy_find_ip') === true) {
            if (loading) return;
            loading = true;
            network.clear();
            network.timeout(10000);
            network.silent('https://api.ipify.org/?format=json', function (json) {
              if (json.ip) Utils.setMyIp(json.ip);
              onComplite();
            }, function (a, c) {
              onComplite();
            });
          } else onComplite();
        });
        e.object.activity.render().find('.view--torrent').after(btn);
      }
    }); ///////FILMIX/////////

    var api_url = (window.location.protocol === 'https:' ? 'https://cors.nb557.workers.dev/' : '') + 'http://filmixapp.cyou/api/v2/';
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
      var url = Utils.rezka2Mirror() + 'ajax/login/';
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
      var url = Utils.rezka2Mirror() + 'logout/';
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


    var isMSX = !!(window.TVXHost || window.TVXManager);
    var isTizen = navigator.userAgent.toLowerCase().indexOf('tizen') !== -1;
    console.log('App', 'is MSX:', isMSX);
    console.log('App', 'is Tizen:', isTizen);
    Lampa.Storage.set('online_mod_proxy_videocdn', 'false');
    Lampa.Storage.set('online_mod_proxy_collaps', 'false');
    Lampa.Storage.set('online_mod_proxy_kinopub', 'true');
    Lampa.Storage.set('online_mod_proxy_bazon', 'true');
    Lampa.Storage.set('online_mod_proxy_hdvb', 'false');
    Lampa.Storage.set('online_mod_proxy_kp', 'false');
    Lampa.Storage.set('online_mod_alt_iframe_proxy', 'false');
    Lampa.Params.trigger('online_mod_iframe_proxy', !isTizen);
    Lampa.Params.trigger('online_mod_proxy_find_ip', false);
    Lampa.Params.trigger('online_mod_proxy_other', false);
    Lampa.Params.trigger('online_mod_proxy_videocdn', false);
    Lampa.Params.trigger('online_mod_proxy_rezka', false);
    Lampa.Params.trigger('online_mod_proxy_rezka2', false);
    Lampa.Params.trigger('online_mod_proxy_kinobase', false);
    Lampa.Params.trigger('online_mod_proxy_collaps', false);
    Lampa.Params.trigger('online_mod_proxy_cdnmovies', false);
    Lampa.Params.trigger('online_mod_proxy_videodb', false);
    Lampa.Params.trigger('online_mod_proxy_zetflix', false);
    Lampa.Params.trigger('online_mod_proxy_redheadsound', false);
    Lampa.Params.trigger('online_mod_proxy_anilibria', false);
    Lampa.Params.trigger('online_mod_proxy_kodik', false);
    Lampa.Params.trigger('online_mod_proxy_kinopub', false);
    Lampa.Params.trigger('online_mod_proxy_bazon', false);
    Lampa.Params.trigger('online_mod_proxy_hdvb', false);
    Lampa.Params.trigger('online_mod_proxy_kp', false);
    Lampa.Params.trigger('online_mod_skip_kp_search', false);
    Lampa.Params.trigger('online_mod_prefer_http', window.location.protocol !== 'https:');
    Lampa.Params.trigger('online_mod_prefer_mp4', true);
    Lampa.Params.trigger('online_mod_prefer_dash', false);
    Lampa.Params.trigger('online_mod_save_last_balanser', false);
    Lampa.Params.select('online_mod_kinobase_mirror', '', '');
    Lampa.Params.select('online_mod_rezka2_mirror', '', '');
    Lampa.Params.select('online_mod_rezka2_name', '', '');
    Lampa.Params.select('online_mod_rezka2_password', '', '');
    Lampa.Params.select('online_mod_proxy_other_url', '', '');
    Lampa.Params.select('online_mod_secret_password', '', '');
    Lampa.Storage.set('online_mod_prefer_http', '');

    if (window.location.protocol === 'https:') {
      Lampa.Storage.set('online_mod_prefer_http', 'false');
    }

    var template = "<div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_rezka\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} rezka</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_rezka2\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} rezka2</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_kinobase\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} kinobase</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_cdnmovies\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} cdnmovies</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_videodb\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} videodb</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_zetflix\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} zetflix</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_redheadsound\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} redheadsound</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_anilibria\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} anilibria</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_kodik\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_balanser} kodik</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_skip_kp_search\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_skip_kp_search}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_iframe_proxy\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_iframe_proxy}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_prefer_http\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_prefer_http}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_prefer_mp4\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_prefer_mp4}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_prefer_dash\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_prefer_dash}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_save_last_balanser\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_save_last_balanser}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_clear_last_balanser\" data-static=\"true\">\n        <div class=\"settings-param__name\">#{online_mod_clear_last_balanser}</div>\n        <div class=\"settings-param__status\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_kinobase_mirror\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_kinobase_mirror}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_mirror\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_mirror}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_name\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_name}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_password\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_password}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_login\" data-static=\"true\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_login}</div>\n        <div class=\"settings-param__status\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_rezka2_logout\" data-static=\"true\">\n        <div class=\"settings-param__name\">#{online_mod_rezka2_logout}</div>\n        <div class=\"settings-param__status\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_find_ip\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_find_ip}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_other\" data-type=\"toggle\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_other}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_proxy_other_url\" data-type=\"input\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_proxy_other_url}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>\n    <div class=\"settings-param selector\" data-name=\"online_mod_secret_password\" data-type=\"input\" data-string=\"true\" placeholder=\"#{settings_cub_not_specified}\">\n        <div class=\"settings-param__name\">#{online_mod_secret_password}</div>\n        <div class=\"settings-param__value\"></div>\n    </div>";

    if (Utils.isDebug()) {
      template += "";
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
