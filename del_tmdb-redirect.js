(function () {
    'use strict';

    Lampa.TMDB.image = function (url) {
      var base = Lampa.Utils.protocol() + 'image.tmdb.org/' + url;
      return Lampa.Storage.field('proxy_tmdb') ? Lampa.Utils.protocol() + 'dsag3w1du2cu2.cloudfront.net/' + url : base;
    };

    Lampa.TMDB.api = function (url) {
      var base = Lampa.Utils.protocol() + 'api.themoviedb.org/3/' + url;
      return Lampa.Storage.field('proxy_tmdb') ? Lampa.Utils.protocol() + 'd2nsx85y22o8i8.cloudfront.net/3/' + url : base;
    };

    Lampa.Settings.listener.follow('open', function (e) {
      if (e.name == 'tmdb') {
        e.body.find('[data-parent="proxy"]').remove();
      }
    });

})();
