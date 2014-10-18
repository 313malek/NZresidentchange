/* FULLSCREEN   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
  function initFullscreen() {
    // if embedded offer fullscreen
    if (top !== self) {
      $('body').removeClass('standalone');
      var wasFullScreen = fullScreenApi.isFullScreen(),
        resizeTimer;
      $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resized, 300);
      });

      function resized() {
        if (wasFullScreen !== fullScreenApi.isFullScreen()) { // fullscreen mode has changed
          if (wasFullScreen) {
            $('body').removeClass('fullscreen');
            setMinZoom();
            map.fitBounds(L.latLngBounds(getActivePoints()), {
              pan: {
                animate: true
              },
              zoom: {
                animate: true
              },
              maxZoom: settings.zoom_max_filter
            });
            // you have just EXITED full screen
          } else {
            $('body').addClass('fullscreen');
            setMinZoom();
            map.fitBounds(L.latLngBounds(getActivePoints()), {
              pan: {
                animate: true
              },
              zoom: {
                animate: true
              },
              maxZoom: settings.zoom_max_filter
            });
            // you have just ENTERED full screen
          }
          wasFullScreen = fullScreenApi.isFullScreen();
        }
      }
      // if not embedded treat as fullacreen
      if (top === self) {
        $('body').addClass('standalone');
      }
      $("a[data-toggle='fullscreen']").attr("href", settings.map_url);
      $("a[data-toggle='fullscreen']").click(function (e) {
        // if embedded and fullscreen support
        // also excluding webkit browsers for now
        var webkit = /webkit/.test(navigator.userAgent.toLowerCase());
        if (top !== self && fullScreenApi.supportsFullScreen && !webkit) {
          e.preventDefault();
          $('html').requestFullScreen();
        }
      });
      $("a[data-toggle='fullscreen-close']").attr("href", settings.parent_url);
      $("a[data-toggle='fullscreen-close']").click(function (e) {
        // if embedded and fullscreen support
        if (top !== self && fullScreenApi.supportsFullScreen) {
          e.preventDefault();
          $('html').cancelFullScreen();
        }
      });
    }
  }  