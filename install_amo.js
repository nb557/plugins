/**
 * Amo — Easy Install & Server Switcher Plugin for Lampa
 * Rewrites/switches the active Lampa client server to https://app.amo.watch
 * Compatible with ES5 (Tizen, webOS, Orsay, Android TV, Desktop Electron, Browser).
 *
 * Install URL: https://app.amo.watch/install_amo.js
 */
(function (root) {
    'use strict';

    var AMO_SERVER_URL = 'https://app.amo.watch/';
    var AMO_SERVER_HOST = 'app.amo.watch';
    var PLUGIN_ID = 'amo_server_switch';
    var PLUGIN_VERSION = '1.2.2';

    var AMO_ICON_SVG = '<svg viewBox="0 0 1254 1254" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M603 67C560 68 526 91 500 136L32 1054C16 1085 19 1116 34 1141C52 1172 84 1187 125 1188H215C250 1188 276 1170 291 1139L493 731C499 719 501 710 501 697V510C501 491 512 479 528 476C540 474 549 478 561 485L789 620C800 627 805 638 805 652V784C805 798 799 808 783 820L966 1147C982 1174 1009 1187 1042 1187H1155C1191 1187 1217 1169 1226 1139C1232 1120 1229 1100 1219 1081L752 137C729 91 696 70 660 68C640 67 622 67 603 67Z"/><path fill="#FF385D" d="M805 657V787C805 798 801 806 792 812L307 1103L416 886L788 675C798 669 805 663 805 657Z"/></svg>';

    var I18N = {
        amo_switch_title: {
            en: 'Amo Server',
            ru: 'Сервер Amo',
            uk: 'Сервер Amo',
            be: 'Сервер Amo',
            ro: 'Server Amo',
            pt: 'Servidor Amo',
            es: 'Servidor Amo',
            fr: 'Serveur Amo',
            de: 'Amo-Server',
            pl: 'Serwer Amo',
            tr: 'Amo Sunucusu',
            ar: 'خادم Amo',
            hi: 'Amo सर्वर',
            zh: 'Amo 服务器'
        },
        amo_switch_descr: {
            en: 'Switch Lampa server to app.amo.watch (4K Movies, Series, Live TV)',
            ru: 'Переключить сервер на app.amo.watch (Фильмы 4K, Сериалы, ТВ)',
            uk: 'Перемкнути сервер на app.amo.watch (Фільми 4K, Серіали, ТБ)',
            be: 'Пераключыць сервер на app.amo.watch (Фільмы 4K, Серыялы, ТБ)',
            ro: 'Comută serverul pe app.amo.watch (Filme 4K, Seriale, TV Live)',
            pt: 'Mudar servidor para app.amo.watch (Filmes 4K, Séries, TV ao vivo)',
            es: 'Cambiar servidor a app.amo.watch (Películas 4K, Series, TV en vivo)',
            fr: 'Basculer vers app.amo.watch (Films 4K, Séries, TV en direct)',
            de: 'Server auf app.amo.watch umstellen (4K-Filme, Serien, Live-TV)',
            pl: 'Przełącz serwer na app.amo.watch (Filmy 4K, Seriale, TV na żywo)',
            tr: 'Sunucuyu app.amo.watch olarak değiştir (4K Film, Dizi, Canlı TV)',
            ar: 'تبديل الخادم إلى app.amo.watch (أفلام 4K، مسلسلات، بث مباشر)',
            hi: 'सर्वर को app.amo.watch पर स्विच करें (4K फ़िल्में, सीरीज़, लाइव टीवी)',
            zh: '将服务器切换至 app.amo.watch（4K 电影、剧集、直播电视）'
        },
        amo_switch_open_now: {
            en: 'Open Amo now',
            ru: 'Открыть Amo сейчас',
            uk: 'Відкрити Amo зараз',
            be: 'Адкрыць Amo зараз',
            ro: 'Deschide Amo acum',
            pt: 'Abrir Amo agora',
            es: 'Abrir Amo ahora',
            fr: 'Ouvrir Amo maintenant',
            de: 'Amo jetzt öffnen',
            pl: 'Otwórz Amo teraz',
            tr: 'Amo\'yu şimdi aç',
            ar: 'افتح Amo الآن',
            hi: 'अभी Amo खोलें',
            zh: '立即打开 Amo'
        },
        amo_switch_open_now_descr: {
            en: 'Switch this device to https://app.amo.watch',
            ru: 'Перейти на сервер https://app.amo.watch',
            uk: 'Перейти на сервер https://app.amo.watch',
            be: 'Перайсці на сервер https://app.amo.watch',
            ro: 'Comută acest dispozitiv la https://app.amo.watch',
            pt: 'Mudar este dispositivo para https://app.amo.watch',
            es: 'Cambiar este dispositivo a https://app.amo.watch',
            fr: 'Basculer cet appareil vers https://app.amo.watch',
            de: 'Dieses Gerät auf https://app.amo.watch umstellen',
            pl: 'Przełącz to urządzenie na https://app.amo.watch',
            tr: 'Bu cihazı https://app.amo.watch adresine geçir',
            ar: 'تبديل هذا الجهاز إلى https://app.amo.watch',
            hi: 'इस डिवाइस को https://app.amo.watch पर स्विच करें',
            zh: '将此设备切换至 https://app.amo.watch'
        },
        amo_switch_auto: {
            en: 'Auto-open Amo on launch',
            ru: 'Автоматический переход при запуске',
            uk: 'Автоматичний перехід при запуску',
            be: 'Аўтаматычны пераход пры запуску',
            ro: 'Deschide Amo automat la pornire',
            pt: 'Abrir Amo automaticamente ao iniciar',
            es: 'Abrir Amo automáticamente al iniciar',
            fr: 'Ouvrir Amo automatiquement au démarrage',
            de: 'Amo beim Start automatisch öffnen',
            pl: 'Automatycznie otwieraj Amo przy starcie',
            tr: 'Başlangıçta Amo\'yu otomatik aç',
            ar: 'فتح Amo تلقائياً عند التشغيل',
            hi: 'लॉन्च होने पर Amo स्वतः खोलें',
            zh: '启动时自动打开 Amo'
        },
        amo_switch_auto_descr: {
            en: 'Hold DOWN arrow on startup to stay on the previous server',
            ru: 'Удерживайте кнопку ВНИЗ при запуске, чтобы остаться на старом сервере',
            uk: 'Утримуйте кнопку ВНИЗ при запуску, щоб залишитися на старому сервері',
            be: 'Утрымлівайце кнопку УНІЗ пры запуску, каб застацца на старым серверы',
            ro: 'Ține apăsată săgeata JOS la pornire pentru a rămâne pe serverul anterior',
            pt: 'Segure a seta PARA BAIXO ao iniciar para permanecer no servidor anterior',
            es: 'Mantén presionada la flecha ABAJO al iniciar para quedarte en el servidor anterior',
            fr: 'Maintenez la flèche BAS au démarrage pour rester sur le serveur précédent',
            de: 'Pfeil NACH UNTEN beim Start gedrückt halten, um auf dem alten Server zu bleiben',
            pl: 'Przytrzymaj strzałkę W DÓŁ podczas startu, aby pozostać na poprzednim serwerze',
            tr: 'Önceki sunucuda kalmak için açılışta AŞAĞI tuşuna basılı tutun',
            ar: 'اضغط مطولاً على السهم لأسفل عند التشغيل للبقاء على الخادم السابق',
            hi: 'पुराने सर्वर पर बने रहने के लिए स्टार्टअप पर DOWN बटन दबाए रखें',
            zh: '启动时按住向下键可保留在原服务器'
        },
        amo_switch_connecting: {
            en: 'Switching to Amo (app.amo.watch)…',
            ru: 'Переключение на Amo (app.amo.watch)…',
            uk: 'Перемикання на Amo (app.amo.watch)…',
            be: 'Пераключэнне на Amo (app.amo.watch)…',
            ro: 'Se comută la Amo (app.amo.watch)…',
            pt: 'Mudando para Amo (app.amo.watch)…',
            es: 'Cambiando a Amo (app.amo.watch)…',
            fr: 'Basculement vers Amo (app.amo.watch)…',
            de: 'Wechsle zu Amo (app.amo.watch)…',
            pl: 'Przełączanie na Amo (app.amo.watch)…',
            tr: 'Amo\'ya (app.amo.watch) geçiliyor…',
            ar: 'جارٍ التبديل إلى Amo (app.amo.watch)…',
            hi: 'Amo (app.amo.watch) पर स्विच हो रहा है…',
            zh: '正在切换至 Amo (app.amo.watch)…'
        }
    };

    function isAmoHost(host) {
        var h = String(host || '').toLowerCase();
        return h === 'app.amo.watch' || h === 'dev-app.amo.watch' || /(^|\.)amo\.watch$/.test(h);
    }

    function tr(key) {
        if (typeof Lampa !== 'undefined' && Lampa.Lang && typeof Lampa.Lang.translate === 'function') {
            return Lampa.Lang.translate(key);
        }
        return (I18N[key] && I18N[key].en) ? I18N[key].en : key;
    }

    /**
     * Rewrite native client server settings where the shell exposes an API
     * (Lampa Desktop Electron, Samsung Orsay WidgetLoader, Lampa Storage).
     */
    function rewriteClientServer(targetUrl) {
        var url = targetUrl || AMO_SERVER_URL;
        var cleanUrl = url.replace(/\/+$/, '');

        // 1. Lampa Desktop (Electron storeManager: lampaUrl)
        try {
            if (root && root.electronAPI && root.electronAPI.store && typeof root.electronAPI.store.set === 'function') {
                root.electronAPI.store.set('lampaUrl', cleanUrl);
            }
        } catch (e) {}

        // 2. Samsung Orsay WidgetLoader
        try {
            if (root && root.top && root.top.WidgetLoader && typeof root.top.WidgetLoader.setUrl === 'function') {
                root.top.WidgetLoader.setUrl(url);
            } else if (typeof Lampa !== 'undefined' && Lampa.Orsay && typeof Lampa.Orsay.setLoaderUrl === 'function') {
                Lampa.Orsay.setLoaderUrl(url);
            }
        } catch (e) {}

        // 3. Lampa Storage redirect keys (compatible with standard Lampa & redirect plugins)
        try {
            if (typeof Lampa !== 'undefined' && Lampa.Storage) {
                Lampa.Storage.set('location_server', AMO_SERVER_HOST);
                Lampa.Storage.set('amo_server_url', url);
            } else if (typeof localStorage !== 'undefined') {
                localStorage.setItem('location_server', AMO_SERVER_HOST);
                localStorage.setItem('amo_server_url', url);
            }
        } catch (e) {}
    }

    /**
     * Switch active WebView / browser session to Amo server.
     */
    function navigateToAmo(win) {
        var w = win || root;
        rewriteClientServer(AMO_SERVER_URL);
        try {
            if (typeof Lampa !== 'undefined' && Lampa.Noty && typeof Lampa.Noty.show === 'function') {
                Lampa.Noty.show(tr('amo_switch_connecting'));
            }
        } catch (e) {}

        try {
            if (w && w.location) {
                if (typeof w.location.replace === 'function') {
                    w.location.replace(AMO_SERVER_URL);
                } else {
                    w.location.href = AMO_SERVER_URL;
                }
            }
        } catch (e) {
            try {
                w.location.href = AMO_SERVER_URL;
            } catch (e2) {}
        }
    }

    function registerPluginManifest() {
        try {
            if (typeof Lampa !== 'undefined' && Lampa.Manifest) {
                Lampa.Manifest.plugins = {
                    type: 'other',
                    version: PLUGIN_VERSION,
                    name: 'Amo',
                    description: tr('amo_switch_descr'),
                    component: PLUGIN_ID
                };
            }
        } catch (e) {}
    }

    function addHeadButton() {
        try {
            if (typeof $ === 'undefined') return;
            $('#AMO_SWITCH').remove();
            var btn = $('<div id="AMO_SWITCH" class="head__action selector amo-switch-btn" title="Amo">' + AMO_ICON_SVG + '</div>');
            var actions = $('#app > div.head > div > div.head__actions, .head__actions').first();
            if (actions.length) {
                actions.prepend(btn);
                btn.on('hover:enter hover:click hover:touch', function () {
                    Lampa.Storage.set('amo_auto_redirect', true);
                    navigateToAmo(root);
                });
            }
        } catch (e) {}
    }

    function registerSettings() {
        if (typeof Lampa === 'undefined' || !Lampa.SettingsApi) return;

        try {
            if (Lampa.Lang && typeof Lampa.Lang.add === 'function') {
                Lampa.Lang.add(I18N);
            }
        } catch (e) {}

        try {
            Lampa.SettingsApi.addComponent({
                component: PLUGIN_ID,
                name: tr('amo_switch_title'),
                icon: AMO_ICON_SVG
            });

            Lampa.SettingsApi.addParam({
                component: PLUGIN_ID,
                param: {
                    name: 'amo_open_now',
                    type: 'button'
                },
                field: {
                    name: tr('amo_switch_open_now'),
                    description: tr('amo_switch_open_now_descr')
                },
                onChange: function () {
                    Lampa.Storage.set('amo_auto_redirect', true);
                    navigateToAmo(root);
                }
            });

            Lampa.SettingsApi.addParam({
                component: PLUGIN_ID,
                param: {
                    name: 'amo_auto_redirect',
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: tr('amo_switch_auto'),
                    description: tr('amo_switch_auto_descr')
                },
                onChange: function (value) {
                    var enabled = String(value) === 'true' || value === true;
                    Lampa.Storage.set('amo_auto_redirect', enabled);
                    if (enabled) {
                        navigateToAmo(root);
                    }
                }
            });
        } catch (e) {}
    }

    function initPlugin() {
        if (!root || root.__amo_install_plugin_loaded) return;
        root.__amo_install_plugin_loaded = true;

        var currentHost = (root.location && root.location.hostname) ? root.location.hostname : '';
        registerPluginManifest();

        // Already on Amo server — do not redirect in a loop
        if (isAmoHost(currentHost)) {
            return;
        }

        // Initialize default auto-redirect preference to true on first install
        try {
            if (typeof Lampa !== 'undefined' && Lampa.Storage) {
                var currentSetting = Lampa.Storage.get('amo_auto_redirect', null);
                if (currentSetting === null || currentSetting === undefined || currentSetting === '') {
                    Lampa.Storage.set('amo_auto_redirect', true);
                }
            }
        } catch (e) {}

        // Allow holding DOWN arrow (keyCode 40 / 29461) during boot to cancel auto-redirect
        try {
            if (typeof Lampa !== 'undefined' && Lampa.Keypad && Lampa.Keypad.listener) {
                Lampa.Keypad.listener.follow('keydown', function (e) {
                    if (e && (e.code === 40 || e.code === 29461)) {
                        Lampa.Storage.set('amo_auto_redirect', false);
                    }
                });
            }
        } catch (e) {}

        rewriteClientServer(AMO_SERVER_URL);
        registerSettings();
        addHeadButton();

        setTimeout(function () {
            var shouldRedirect = true;
            try {
                if (typeof Lampa !== 'undefined' && Lampa.Storage) {
                    shouldRedirect = Lampa.Storage.field('amo_auto_redirect') !== false &&
                        Lampa.Storage.get('amo_auto_redirect', true) !== false &&
                        Lampa.Storage.get('amo_auto_redirect', 'true') !== 'false';
                }
            } catch (e) {}

            if (shouldRedirect) {
                navigateToAmo(root);
            }
        }, 350);
    }

    var api = {
        AMO_SERVER_URL: AMO_SERVER_URL,
        AMO_SERVER_HOST: AMO_SERVER_HOST,
        PLUGIN_ID: PLUGIN_ID,
        PLUGIN_VERSION: PLUGIN_VERSION,
        I18N: I18N,
        isAmoHost: isAmoHost,
        rewriteClientServer: rewriteClientServer,
        navigateToAmo: navigateToAmo,
        initPlugin: initPlugin
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.AmoInstallPlugin = api;
    }

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        if (window.appready) {
            initPlugin();
        } else if (typeof Lampa !== 'undefined' && Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
            Lampa.Listener.follow('app', function (e) {
                if (e && e.type === 'ready') initPlugin();
            });
        } else {
            initPlugin();
        }
    }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
