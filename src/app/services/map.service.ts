import { Injectable } from '@angular/core';
import {Map} from 'leaflet';
import { Http } from '@angular/http';
// import 'leaflet.vectorgrid';
import 'leaflet';
import 'leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled';
import 'mapbox-gl';
import 'scripts/leaflet-mapbox-gl.js';

@Injectable()
export class MapService {
  public baseMaps: any;

  constructor(public http: Http) {
    const vectorTileOptions = {
    vectorTileLayerStyles: {
        // A plain set of L.Path options.
        water: {
            weight: 0,
            fillColor: '#9bc2c4',
            fillOpacity: 1,
            fill: true
        },
        // A function for styling features dynamically, depending on their
        // properties and the map's zoom level
        admin: function(properties, zoom) {
            const level = properties.admin_level;
            let weight = 1;
            if (level === 2) {weight = 4; }
            return {
                weight: weight,
                color: '#cf52d3',
                dashArray: '2, 6',
                fillOpacity: 0
            };
        },
        // An 'icon' option means that a L.Icon will be used
        place: {
            icon: new L.Icon.Default()
        },
        road: []
    },
    token: 'pk.eyJ1IjoiZjBydDFzIiwiYSI6ImNqMmNhMnQyNjAxcnQzM3BpdHBvZWp1bGUifQ.hPn-nFhLUFq1ceI47tosEg',
                subdomains: 'abcd',
                rendererFactory: (L.canvas as  any).tile

};
// tslint:disable:max-line-length
            this.baseMaps = {
            OpenStreetMap: L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {

                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
            }),
            // Esri: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            //     attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            // }),
            // CartoDB: L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
            //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            // }),
            MapboxTiles: L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZjBydDFzIiwiYSI6ImNqMmNhMnQyNjAxcnQzM3BpdHBvZWp1bGUifQ.hPn-nFhLUFq1ceI47tosEg'),
            VectorDB: L.vectorGrid.protobuf('https://{s}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v7/{z}/{x}/{y}.vector.pbf?access_token={token}', vectorTileOptions),
            Mapbox: L.mapboxGL({
              accessToken: 'pk.eyJ1IjoiZjBydDFzIiwiYSI6ImNqMmNhMnQyNjAxcnQzM3BpdHBvZWp1bGUifQ.hPn-nFhLUFq1ceI47tosEg',
              style: 'mapbox://styles/mapbox/dark-v9'
            })
        };
   }

}
