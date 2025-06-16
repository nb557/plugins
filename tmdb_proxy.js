(function () {
    'use strict';

    function filter(u) {
      return u.replace(/\/\/+/g, '/');
    }

    function proxyLink(u) {
      var proxy = Lampa.Storage.field('proxy_tmdb') ? 'https://apn-latest.onrender.com/' : '';
      return proxy + u;
    }

    Lampa.TMDB.image = function (url) {
      var base = Lampa.Utils.protocol() + filter('image.tmdb.org/' + url);
      return proxyLink(base);
    };

    Lampa.TMDB.api = function (url) {
      var base = Lampa.Utils.protocol() + filter('api.themoviedb.org/3/' + url);
      return proxyLink(base);
    };

    Lampa.Settings.listener.follow('open', function (e) {
      if (e.name == 'tmdb') {
        e.body.find('[data-parent="proxy"]').remove();
      }
    });
    console.log('TMDB-Proxy', 'nb557, enabled:', Lampa.Storage.field('proxy_tmdb'));

})();
