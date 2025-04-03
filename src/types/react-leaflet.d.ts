
declare module 'react-leaflet' {
  import * as L from 'leaflet';
  import * as React from 'react';

  interface MapContainerProps extends React.DOMAttributes<HTMLDivElement> {
    center: L.LatLngExpression;
    zoom: number;
    [key: string]: any;
  }

  interface TileLayerProps {
    attribution?: string;
    url: string;
    [key: string]: any;
  }

  interface MarkerProps {
    position: L.LatLngExpression;
    icon?: L.Icon | L.DivIcon;
    [key: string]: any;
  }

  export class MapContainer extends React.Component<MapContainerProps> {}
  export class TileLayer extends React.Component<TileLayerProps> {}
  export class Marker extends React.Component<MarkerProps> {}
  export class Popup extends React.Component<any> {}
}
