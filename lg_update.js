(function () {
    'use strict';

    function startPlugin() {
      window.lg_update_plugin = true;
      var src = 'http://lampa.mx/';
      var network = new Lampa.Reguest();
      network.clear();
      network.timeout(1000 * 30);
      network.silent(src + 'app.min.js?v=lg_update', function (app) {
        var old = window.localStorage.getItem('app.js');

        if (old != app) {
          window.localStorage.setItem('app.js', app);
          Lampa.Noty.show('LG Update: OK. Reboot Lampa');
        }

        var old_css = $('link[href="css/app.css"]');

        if (old_css.length) {
          Lampa.Utils.putStyle([src + 'css/app.css?v=lg_update'], function () {
            old_css.remove();
          }, function () {});
        }
      }, function (a, c) {
        Lampa.Noty.show('LG Update: ' + network.errorDecode(a, c));
      }, false, {
        dataType: 'text'
      });
    }

    if (!window.lg_update_plugin) startPlugin();

})();
