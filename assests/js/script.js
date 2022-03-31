/**
 *  Orkun Tumer
 */

// mapbox tile layer and its settings
const mapBoxToken = 'pk.eyJ1IjoidHVtZXJvcmt1biIsImEiOiJjampudWt3OGwwOHg3M3BudWd6YTh6aWs2In0.B0Jq-sVRnIqwVkLQ3C5dyg';
const MapBox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 13,
  id: 'mapbox.streets',
  accessToken: mapBoxToken,
  noWrap: true });


// openstreet tile layer and its settings
const OpenStreet = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'openstreetmap', noWrap: true });


const Google = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=tr&x={x}&y={y}&z={z}', {
  attribution: 'google', noWrap: true });


// grid tile with div
const gridDivLayer = L.GridLayer.extend({
  createTile: function (coords) {
    const tile = document.createElement('div');
    var size = this.getTileSize();
    tile.style.outline = '1px dashed green';
    tile.style.fontSize = '10px';
    tile.innerHTML =
    `<p class="gridTileCoordinates">
        ( x: ${coords.x}, y: ${coords.y} )
      </p>
      <div class="gridTileZoom">
        zoom: ${coords.z}
      </div>`;
    return tile;
  } });

const gridDiv = new gridDivLayer({ noWrap: true, bounds: [[-90, -180], [90, 180]] });

// grid tile with canvas
const gridCanvasLayer = L.GridLayer.extend({
  createTile: function (coords) {
    // create a <canvas> element for drawing
    var tile = L.DomUtil.create('canvas', 'leaflet-tile');
    // setup tile width and height according to the options
    var size = this.getTileSize();
    tile.width = size.x;
    tile.height = size.y;
    // get a canvas context and draw something on it using coords.x, coords.y and coords.z
    var ctx = tile.getContext('2d');
    // ctx.setLineDash([5, 5]);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";
    ctx.rect(0, 0, tile.width, tile.height);
    ctx.stroke();
    ctx.fillText(`( x: ${coords.x}, y: ${coords.y} )`, 5, 20);
    ctx.textAlign = "center";
    ctx.fillText(`zoom: ${coords.z}`, size.x / 2, size.y / 2);
    // return the tile so it can be rendered on screen
    return tile;
  } });

const gridCanvas = new gridCanvasLayer({ noWrap: true, bounds: [[-90, -180], [90, 180]] });

// custom control
let zoomDivRef;
const ZoomView = L.Control.extend({
  onAdd: function (map) {
    var div = L.DomUtil.create('div', "leaflet-zoom-control leaflet-bar-part leaflet-bar");

    div.innerHTML = 'zoom: ' + map.getZoom();
    zoomDivRef = div;
    return div;
  },

  onRemove: function (map) {
    // Nothing to do here
  } });

L.control.zoomview = opts => new ZoomView(opts);
const zoom = L.control.zoomview({ position: 'topleft' });

// layers control
const gridsAsOverLay = { gridDiv, gridCanvas };
const baseMaps = { MapBox, Google, OpenStreet };
const layers = L.control.layers(baseMaps, gridsAsOverLay, { position: 'topleft' });

// scale control
const scale = L.control.scale();

// leaflet map init
const map = L.map('map', {
  maxBounds: [[-90, -180], [90, 180]],
  layers: [OpenStreet] }).
setView([0, 0], 0);

// get Turkey to center
map.fitBounds([[19.841186398184323, -98.97939063057356], [20.5885399330218, -100.38525658275948]]);

// add to map zoom control
zoom.addTo(map);

// add to map layers control
setTimeout(() => {layers.addTo(map);}, 2000); // setTimeout just for fun

// add to map scale control
scale.addTo(map);

map.on('zoomend', () => {
  zoomDivRef.innerHTML = `zoom: ${map.getZoom()}`;
});

//Rute Points
L.Routing.control({
  waypoints: [
    L.latLng(19.841186398184323, -98.97939063057356),
    L.latLng(20.5885399330218, -100.38525658275948)
  ]
}).addTo(map);

//In Side
var inIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var marker = L.marker([20.214612100147303, -100.06307122675946], {icon: inIcon}).addTo(map);
var marker = L.marker([20.29706721145768, -100.15233513383124], {icon: inIcon}).addTo(map);
var marker = L.marker([20.321537635192637, -99.50963500291442], {icon: inIcon}).addTo(map);

//Out Side
var outIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.marker([20.196569207135607, -100.37206164418187], {icon: outIcon}).addTo(map);
L.marker([20.092137215715116, -99.32012076873077], {icon: outIcon}).addTo(map);

// geocerca 
var circle = L.circle([20.09858566966532, -99.86257075856747], {
  color: '#81b3c4',
  fillColor: '#a5e8ff',
  fillOpacity: 0.5,
  radius: 50000
}).addTo(map);