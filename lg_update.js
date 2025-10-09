(function () {
    'use strict';

    function startPlugin() {
      window.lg_update_plugin = true;
      var network = new Lampa.Reguest();
      network.clear();
      network.timeout(1000 * 30);
      network.silent('http://lampa.mx/app.min.js', function (app) {
        window.localStorage.setItem('app.js', app);
        Lampa.Noty.show('LG Update: OK. Reboot Lampa');
      }, function (a, c) {
        Lampa.Noty.show('LG Update: ' + network.errorDecode(a, c));
      }, false, {
        dataType: 'text'
      });
    }

    if (!window.lg_update_plugin) startPlugin();

})();
