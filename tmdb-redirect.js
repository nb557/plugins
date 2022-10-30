(function () {
    'use strict';

    Lampa.TMDB.image = function (url) {
        var fix_url = url.replace("//", "/");
        var base = Lampa.Utils.protocol() + 'image.tmdb.org/' + fix_url;
        return (Lampa.Storage.field('proxy_tmdb') && Lampa.Storage.field('language') == 'ru') ? 'http://backup.twicker.ru/image/' + base : base;
    };

    Lampa.TMDB.api = function (url) {
        var base = Lampa.Utils.protocol() + 'api.themoviedb.org/3/' + url;
        return (Lampa.Storage.field('proxy_tmdb') && Lampa.Storage.field('language') == 'ru') ? 'http://backup.twicker.ru/api/' + base : base;
    };

    Lampa.Settings.listener.follow('open', function (e) {
      if (e.name == 'tmdb') {
        e.body.find('[data-parent="proxy"]').remove();
      }
    });
})();