/**
 * External Subtitle Auto Loader for Lampa
 * Author: Jerickson Mayor
 */


(function() {
    'use strict';
    if (window.externalsub_plugin) return;
    window.externalsub_plugin = true;

    const baseApi = "https://sub-api-two.vercel.app";
    const request = new Lampa.Reguest();

    const originalNotyShow = Lampa.Noty.show;
    
    const showCustomNoty = (text, isError) => {
        const tempNotyShow = function(t, e, p) {
            originalNotyShow.call(this, t, p);
            
            setTimeout(() => {
                const $noty = $('.noty').last();
                const $text = $noty.find('.noty__text');
                
                if (typeof t === 'string') {
                    $text.text((e ? '😕 ' : '😄 ') + t);
                }
                
                $noty.css({background: e ? '#ff5757' : '#65eaa7'});
                
                setTimeout(() => {
                    $noty.css({background: ''});
                    $text.text('');
                }, 3000);
            }, 10);
        };
        
        Lampa.Noty.show = tempNotyShow;
        Lampa.Noty.show(text, isError);
        Lampa.Noty.show = originalNotyShow;
    };



    Lampa.Player.listener.follow('start', e => {
        const movie = Lampa.Activity.active().movie;
        if (!movie?.id) return;

        request.silent(
            `${baseApi}/api/v2/sub/search?tmdbid=${movie.id}`,
            data => {
                const externalUrl = data?.file?.url;
                if (!externalUrl) return;

                const existingSubs = e.subtitles || [];
                const mergedSubs = [
                    ...existingSubs,
                    {
                        index: existingSubs.length,
                        label: "External Subtitle",
                        url: externalUrl
                    }
                ];

                Lampa.PlayerVideo.customSubs(mergedSubs);
                showCustomNoty('Added external subtitle', false);
            },
            errorData => {
                const message = errorData?.message ||
                    errorData?.responseJSON?.message ||
                    'Error fetching subtitle';
                showCustomNoty(`Failed to load external subtitle: ${message}`, true);
            },
            false, {
                dataType: 'json'
            }
        );
    });
})();