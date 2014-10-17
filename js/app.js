$(function(){
  L.mapbox.accessToken = 'pk.eyJ1IjoidG1mcm56IiwiYSI6IkRNZURKUHcifQ._ljgPcF75Yig1Of8adL93A';
  var map = L.map('map',{
          minZoom: 5,
          maxZoom: 12,
          maxBounds: [[-48.6619,155],[-33.2479,190]],
          loadingControl: true
        }).setView([-41.20,175], 6);
  var map2 = L.map('map2',{
          minZoom: 5,
          maxZoom: 12,
          maxBounds: [[-48.6619,155],[-33.2479,190]],
          loadingControl: true
        }).setView([-41.20,175], 6);
  //var layers = document.getElementById('menu-ui');

  var layer_base  = L.mapbox.tileLayer('tmfrnz.71d5bu2v'),
      layer_base2  = L.mapbox.tileLayer('tmfrnz.71d5bu2v'),
      layer_young = L.mapbox.tileLayer('tmfrnz.l0ffajor'),
      layer_total = L.mapbox.tileLayer('tmfrnz.jded0a4i');

  layer_base
      .setZIndex(1)
      .addTo(map);
  layer_base2
      .setZIndex(1)      
      .addTo(map2);
  layer_total
      .setZIndex(2)
      .addTo(map);         
  layer_young
      .setZIndex(2)
      .addTo(map2);
  

//  addLayer(layer_young, 'Young', 2);
//  addLayer(layer_total, 'Total', 3);

//  function addLayer(layer, name, zIndex) {
//      layer.setZIndex(zIndex);
//
//      // Create a simple layer switcher that
//      // toggles layers on and off.
//      var link = document.createElement('a');
//          link.href = '#';
//          link.innerHTML = name;
//
//    if (name=='Young'){
//      layer.addTo(map);
//      link.className = 'active';}
//    else{
//      link.className = ''};
//
//      link.onclick = function(e) {
//          e.preventDefault();
//          e.stopPropagation();
//
//          if (!map.hasLayer(layer)) {
//        map.removeLayer(layer_young);
//        map.removeLayer(layer_total);
//              map.addLayer(layer);
//        $('.active').removeClass('active');
//              this.className = 'active';
//          }
//      };
//
//      layers.appendChild(link);
//  }

// when either map finishes moving, trigger an update on the other one.
map.on('moveend', follow).on('zoomend', follow);
map2.on('moveend', follow).on('zoomend', follow);

// quiet is a cheap and dirty way of avoiding a problem in which one map
// syncing to another leads to the other map syncing to it, and so on
// ad infinitum. this says that while we are calling sync, do not try to 
// loop again and sync other maps
var quiet = false;
function follow(e) {
    if (quiet) return;
    quiet = true;
    if (e.target === map) sync(map2, e);
    if (e.target === map2) sync(map, e);
    quiet = false;
}

// sync simply steals the settings from the moved map (e.target)
// and applies them to the other map.
function sync(map, e) {
    map.setView(e.target.getCenter(), e.target.getZoom(), {
        animate: false,
        reset: true
    });
}

});