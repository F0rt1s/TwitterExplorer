/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
// in the global namesapce "L"
declare namespace L {
  // there is a child namespace "vectorGrid"
  namespace vectorGrid {
    // which has a function call "slicer" that takes data and optional
    // configurations. To make it simple, we don't specify the input
    // and output types.
    export function slicer(data: any, options?: any): any;
    export function protobuf(url: string, options: any) : any;
  }

  function mapboxGL(options: any): TileLayer;
  namespace mapboxGL{

  }
}
