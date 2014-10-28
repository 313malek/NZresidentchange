$(function(){

  var settings = {
    token:'pk.eyJ1IjoibnpoZXJhbGQiLCJhIjoiSVBPNHM0cyJ9.PDW_j3xU8w-wTnKCpnshPg',
    base_id: 'nzherald.9uvaq0k9',
    young_id: 'nzherald.8vzhbyb9',
    all_id: 'nzherald.nq5pcik9',
    map_url : 'http://dumparkltd.github.io/NZresidentchange/',
    parent_url : 'http://localhost:8888/NZresidentchange/embed.html',
    zoom_max : 12,
    bounds_min: L.latLngBounds(L.latLng(-46.5, 167.3), L.latLng(-35, 178.5)), // set initial min boundaries (SW,NE)
    bounds_max: L.latLngBounds(L.latLng(-57.1, 135), L.latLng(-23.7, 210)), // set maximum boundaries (SW,NE)
     //[[-48.6619,155],[-33.2479,190]]
  },
  mapView = {
      'x': '',
      'y': '',
      'z': ''
  },
  layers = {
    young:'',
    all:''
  },
  map;
  
  initFullscreen();
  
  initMap();

  initInfo();
  
  $('.reset-map').on('click', function(e){
    e.preventDefault();
    resetMapView();
  });
  
  function resetMapView(){
    setMinZoom();
    mapView = {'x': '','y': '','z': ''};    
    updateMapView();
    map.removeLayer(layers.all);
    map.addLayer(layers.young);
    $('.toggle-layer').removeClass('active'); 
    $("a[data-mapid='y']").addClass('active');
  }  
  
  function initInfo(){ 
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
    });
    
  }
  function updateMapView(){
    var ll;
    // if both x and y are set
    if ((mapView.x !== '' && mapView.y !== '')) {
      ll = L.latLng(mapView.y, mapView.x);
      // if not inside area bounds, set to default center
      if (!settings.bounds_min.contains(ll)) {
        ll = settings.bounds_min.getCenter();
      }
      // else set to default center
    } else {
      ll = settings.bounds_min.getCenter();
    }
    // zoom if set
    if (mapView.z !== '') {
      // make sure zoom is allowed
      map.setView(ll, Math.max(Math.min(mapView.z, settings.zoom_max), map.options.minZoom));
      // else set to default zoom level 
    } else {
      map.fitBounds(settings.bounds_min);
      map.panTo(ll);
    }
  }
  function rememberMapView() {
    mapView.z = map.getZoom();
    mapView.y = Math.round(map.getCenter().lat * 1000) / 1000;
    mapView.x = Math.round(map.getCenter().lng * 1000) / 1000;
  }  
   
  
  function setMinZoom() {
    var mapDim = {
      height: $('#map').height(),
      width: $('#map').width()
    }; // get map container dimensions
    map.options.minZoom = getBoundsZoomLevel(settings.bounds_min, mapDim); // set minimum required zoom to fit area bounds in container    
  }
  
  function initMap() {
    L.mapbox.accessToken = settings.token;
    map = L.map('map',{
      loadingControl: true,
      attributionControl: false
    });
    
    var credits = L.control.attribution({prefix:false}).addTo(map);
    credits.addAttribution('Map data \n\
<a href="http://creativecommons.org/licenses/by/3.0/nz/" title="CC BY 3.0 NZ" target="_blank">[CC]</a> \n\
<a href="http://data.linz.govt.nz/" target="_blank" title="Land Information New Zealand">LINZ</a>, \n\
<a href="http://lris.scinfo.org.nz/" target="_blank" title="Landcare Research New Zealand Ltd">LRIS</a>,  \n\
<a href="http://www.stats.govt.nz/" target="_blank" title="Statistics New Zealand">Statistics NZ</a> - \n\
a data visualisation by <a class="strong" href="http://dumpark.com" target="_blank" title="dumpark creative industries">dumpark</a></div>');
    
    setMinZoom();
    
    map.options.maxZoom = settings.zoom_max;
    map.setMaxBounds(settings.bounds_max);
    
    map.on('zoomend', rememberMapView);
    map.on('dragend', rememberMapView);
    
    updateMapView();
    
    // add basemap
    L.mapbox.tileLayer(settings.base_id)
            .setZIndex(1)
            .addTo(map);
    
    // add young map
    layers.young = L.mapbox.tileLayer(settings.young_id)
            .setZIndex(2)
            .addTo(map);
    $("a[data-mapid='y']").addClass('active');
            
    
    // add     
    layers.all = L.mapbox.tileLayer(settings.all_id)
      .setZIndex(2);
    
    $('.toggle-layer').on('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      if (!$(this).hasClass('active')){
        var data = $(this).data();
        $('.toggle-layer').removeClass('active');        
        if (data.mapid === 'y') {
          map.removeLayer(layers.all);
          map.addLayer(layers.young);
        } else if (data.mapid === 'all') {
          map.removeLayer(layers.young);
          map.addLayer(layers.all);
        }
        $(this).addClass('active');
      }      
    });
  }
  function getBoundsZoomLevel(bounds, mapDim) {
    var WORLD_DIM = {
      height: 256,
      width: 256
    };

    function latRad(lat) {
      var sin = Math.sin(lat * Math.PI / 180);
      var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
      return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
      return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    var latFraction = (latRad(ne.lat) - latRad(sw.lat)) / Math.PI;
    var lngDiff = ne.lng - sw.lng;
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;
    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);
    return Math.min(latZoom, lngZoom, settings.zoom_max);
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
            resetMapView();
            // you have just EXITED full screen
          } else {
            $('body').addClass('fullscreen');
            resetMapView();
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
  $(window).on('resize', function () {
    setMinZoom();
    updateMapView();
  });
      
});