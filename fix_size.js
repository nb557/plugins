(function () {
    'use strict';

    function startPlugin() {
      window.fix_size_plugin = true;

      function addPlugin() {
        Lampa.Lang.add({
          settings_interface_size_fixed: {
            be: 'Фіксаваны памер',
            bg: 'Фиксиран размер',
            cs: 'Pevná velikost',
            en: 'Fixed size',
            he: 'גודל קבוע',
            pt: 'Tamanho fixo',
            ru: 'Фиксированный размер',
            uk: 'Фіксований розмір',
            zh: '固定大小'
          }
        });
        Lampa.SettingsApi.addParam({
          component: 'interface',
          param: {
            name: 'interface_size_fixed',
            type: 'select',
            values: {
              '10': '10',
              '12': '12',
              '14': '14',
              '16': '16',
              '18': '18',
              '20': '20',
              '22': '22',
              '24': '24',
              '28': '28',
              '32': '32'
            },
            "default": '16'
          },
          field: {
            name: Lampa.Lang.translate('settings_interface_size_fixed')
          },
          onChange: function onChange() {
            var name = Lampa.Controller.enabled().name;
            Lampa.Layer.update();
            Lampa.Controller.toggle(name);
          }
        });
        Lampa.Settings.listener.follow('open', function (e) {
          if (e.name == 'interface') {
            var item = e.body.find('[data-name="interface_size_fixed"]');
            item.detach();
            item.insertAfter(e.body.find('[data-name="interface_size"]'));
          }
        });
        var css = $('style#fix_size_css');

        if (!css.length) {
          css = $('<style type="text/css" id="fix_size_css"></style>');
          css.appendTo('head');
        }

        css.html('.card--category { width: 16em !important }');
        var platform_screen = Lampa.Platform.screen;

        Lampa.Platform.screen = function (need) {
          if (need === 'tv') {
            try {
              var stack = new Error().stack.split('\n');
              var offset = stack[0] === 'Error' ? 1 : 0;

              if (/^( *at +new +)?create\$i/.test(stack[1 + offset]) && /^( *at +)?component(\/this)?\.append/.test(stack[2 + offset])) {
                return false;
              }
            } catch (e) {}
          }

          return platform_screen(need);
        };

        var layer_update = Lampa.Layer.update;

        Lampa.Layer.update = function (where) {
          var font_size = parseInt(Lampa.Storage.field('interface_size_fixed')) || 16;
          $('body').css({
            fontSize: font_size + 'px'
          });
          layer_update(where);
        };

        var timer;
        $(window).on('resize', function () {
          clearTimeout(timer);
          timer = setTimeout(function () {
            Lampa.Layer.update();
          }, 150);
        });
        Lampa.Layer.update();
      }

      if (window.appready) addPlugin();else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type == 'ready') addPlugin();
        });
      }
    }

    if (!window.fix_size_plugin) startPlugin();

})();
