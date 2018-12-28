import { AppconfigService } from '../../services/appconfig.service';
import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { D3Service, D3, Selection, BaseType } from 'd3-ng2-service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-maptest',
  templateUrl: './maptest.component.html',
  styleUrls: ['./maptest.component.scss']
})
export class MaptestComponent implements OnInit {

  d3: D3;
  svg: Selection<BaseType, {}, null, undefined>;
  g: Selection<BaseType, {}, null, undefined>;
  json: any;
  body: any;
  static leafletmap: L.Map;
  leafletmap: L.Map;

  constructor(public appconfig: AppconfigService, public mapService: MapService, private d3Service: D3Service, private http: Http) {
    this.d3 = d3Service.getD3();
  }

  ngOnInit() {
    MaptestComponent.leafletmap = this.leafletmap = L.map('map', {
      zoomControl: false,
      center: L.latLng(51, 9),
      zoom: 7,
      minZoom: 4,
      maxZoom: 19,
      layers: [this.mapService.baseMaps.Mapbox]
    });

    L.control.zoom({ position: 'topright' }).addTo(this.leafletmap);
    L.control.layers(this.mapService.baseMaps).addTo(this.leafletmap); ;
    L.control.scale().addTo(this.leafletmap);
    this.svg = this.d3.select(this.leafletmap.getPanes().overlayPane).append('svg');
    this.g = this.svg.append('g').attr('class', 'leaflet-zoom-hide');
    this.getJson().subscribe(() => this.gotJson());
    // var stream = this.d3.geoStream()


  }

  private getJson() {
    return this.http.get('https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/master/2_bundeslaender/2_hoch.geojson').map((r) => this.map(r));
  }

  private map(res: Response) {
    const body = res.json();
    this.json = body.features;
    this.body = body;
  }
  private gotJson() {
    const range = this.d3.range(10);
    const transform = this.d3.geoTransform({ point: this.projectPoint });
    const path = this.d3.geoPath().projection(transform);
    const feature = this.g.selectAll('path').data(this.json).enter().append('path');
    const color = this.d3.scaleOrdinal().domain(range as any).range(['#9C6744', '#C9BEB9', '#CFA07E', '#C4BAA1', '#C2B6BF', '#8FB5AA', '#85889E', '#9C7989', '#91919C', '#99677B', '#918A59', '#6E676C', '#6E4752', '#6B4A2F', '#998476', '#8A968D', '#968D8A', '#968D96', '#CC855C', '#967860', '#929488', '#949278', '#A0A3BD', '#BD93A1', '#65666B', '#6B5745', '#6B6664', '#695C52', '#56695E', '#69545C', '#565A69', '#696043', '#63635C', '#636150', '#333131', '#332820', '#302D30', '#302D1F', '#2D302F', '#CFB6A3', '#362F2A']);

    feature.attr('d', path)
      .style('fill', (c) => {return color((c as any).id) as any; })
      .style('stroke', (c) => {return this.d3.rgb(color((c as any).id) as any).brighter(0.85) as any; })
      .style('opacity', 0.4);
    const bounds = path.bounds(this.body), topLeft = bounds[0], bottomRight = bounds[1];
    this.svg.attr('width', bottomRight[0] - topLeft[0])
      .attr('height', bottomRight[1] - topLeft[1])
      .style('left', topLeft[0] + 'px')
      .style('top', topLeft[1] + 'px');

      this.g.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');
  }

  // private projectPoint(x: number, y: number){
  //   const point = this.leafletmap.latLngToLayerPoint(new L.LatLng(y, x));
  //     (this as any).stream.point(point.x, point.y);
  // }

  private projectPoint(x: any, y: any) {
    // console.log(x + ' ' + y);
    const point = MaptestComponent.leafletmap.latLngToLayerPoint(new L.LatLng(y, x));
    (this as any).stream.point(point.x, point.y);
  }

}
