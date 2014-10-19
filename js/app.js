$(function(){

  var map_url = 'http://dumparkltd.github.io/NZresidentchange/',
      parent_url = 'http://localhost:8888/NZresidentchange/embed.html';      
  
  initFullscreen();
  
  initMap();

  initFooter();
  
  
  // EVENTS
  function initFooter(){ 
    $('.toggle-info').on('click',function(e){
      e.preventDefault();
      if ($('.information').hasClass('hidden')){
        $('.information').removeClass('hidden');
      }else{
        $('.information').addClass('hidden');
      }
    });

    $('.information').on('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      $('.information').addClass('hidden');
    });
    $('.information-box').on('click',function(e){
      e.stopPropagation();
    })
    
  }
  function initMap() {
    L.mapbox.accessToken = 'pk.eyJ1IjoidG1mcm56IiwiYSI6IkRNZURKUHcifQ._ljgPcF75Yig1Of8adL93A';
    var map = L.map('map',{
            minZoom: 5,
            maxZoom: 12,
            maxBounds: [[-48.6619,155],[-33.2479,190]],
            loadingControl: true
          }).setView([-41.20,175], 6);
    
    // add basemap
    L.mapbox.tileLayer('tmfrnz.r1bp4x6r')
            .setZIndex(1)
            .addTo(map);
    
    // add young map
    var layer_young = L.mapbox.tileLayer('tmfrnz.l0ffajor')
            .setZIndex(2)
            .addTo(map);
    $("a[data-mapid='y']").addClass('active');
            
    
    // add     
    var layer_total = L.mapbox.tileLayer('tmfrnz.jded0a4i')
      .setZIndex(2);
    
    $('.toggle-layer').on('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      var data = $(this).data();
      if (!$(this).hasClass('active')){
        $('.toggle-layer').removeClass('active');        
        if (data.mapid === 'y') {
          map.removeLayer(layer_total);
          map.addLayer(layer_young);
        } else if (data.mapid === 'all') {
          map.removeLayer(layer_young);
          map.addLayer(layer_total);
        }
        $(this).addClass('active');
      }      
    });
  }
  
  
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
//            setMinZoom();
//            map.fitBounds(L.latLngBounds(getActivePoints()), {
//              pan: {
//                animate: true
//              },
//              zoom: {
//                animate: true
//              },
//              maxZoom: settings.zoom_max_filter
//            });
            // you have just EXITED full screen
          } else {
            $('body').addClass('fullscreen');
//            setMinZoom();
//            map.fitBounds(L.latLngBounds(getActivePoints()), {
//              pan: {
//                animate: true
//              },
//              zoom: {
//                animate: true
//              },
//              maxZoom: settings.zoom_max_filter
//            });
            // you have just ENTERED full screen
          }
          wasFullScreen = fullScreenApi.isFullScreen();
        }
      }
      // if not embedded treat as fullacreen
      if (top === self) {
        $('body').addClass('standalone');
      }
      $("a[data-toggle='fullscreen']").attr("href", map_url);
      $("a[data-toggle='fullscreen']").click(function (e) {
        // if embedded and fullscreen support
        // also excluding webkit browsers for now
        var webkit = /webkit/.test(navigator.userAgent.toLowerCase());
        if (top !== self && fullScreenApi.supportsFullScreen && !webkit) {
          e.preventDefault();
          $('html').requestFullScreen();
        }
      });
      $("a[data-toggle='fullscreen-close']").attr("href", parent_url);
      $("a[data-toggle='fullscreen-close']").click(function (e) {
        // if embedded and fullscreen support
        if (top !== self && fullScreenApi.supportsFullScreen) {
          e.preventDefault();
          $('html').cancelFullScreen();
        }
      });
    }
  }    
      
});