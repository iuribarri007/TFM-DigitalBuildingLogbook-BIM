export interface dblEntity{
  expressId:number;
  fragmentId:[any];
  entityType:number;
  globalId:string
  }
export interface dblElementLayerMaterial{
  dblLayerMaterialName: string|undefined;
  dblLayerMaterialThickness: number|undefined;
  dblLayerMaterialThermalConductivity: number|undefined;
  dblLayerMaterialDensity: number|undefined;
  dblLayerNetVolume:number|undefined;//= NetArea * LayerThickness
  dblLayerWeight: number|undefined;// = (dblLayerMaterialDensity)/(dblLayerNetVolume)
}

//Wall interface
export interface dblWallLayer{
  dblWallLayerMaterial:string;
  dblWallLayerWidth:number;
  dblWallLayerDensity:any
  dblWallLayerConductivity:any;
  }
export interface dblWallProps{
  dblWallType:string|undefined;
  dblWalLoadBearing:boolean|undefined;
  dblWallIsExternal:boolean|undefined;
  dblWallEnvelopeCode:any|undefined;
  dblWallEnvelopeOrientation: string|undefined;
  dblWallUvalue:number|undefined;
  dblWallRvalue:number|undefined;
  }
export interface dblWallQtos{
  dblWallLenght:number |undefined;
  dblWallWidth:number|undefined;
  dblWallHeight:number|undefined;
  dblWallNetArea:number|undefined;
  dblWallNetVolume:number|undefined;
  }
//Window interface
export interface dblWindowComponents{

  }
export interface dblWindowProps{
  dblWindowType:string|undefined;
  dblWindowIsExternal:boolean|undefined;
  dblWindowEnvelopeCode:any|undefined;
  dblWindowEnvelopeOrientation:string|undefined;
  dblWindowUvalue:number|undefined;
  dblWindowGvalue:number|undefined;
  dblWindowGlazingFraction:number|undefined;
  }
export interface dblWindowQtos{
  dblWindowWidth:number| undefined;
  dblWindowHeight:number| undefined;
  dblWindowPerimeter:number| undefined;
  dblWindowArea:number| undefined;
}
//Floor interfaces
export interface dblFloorLayer{
  dblFloorLayerMaterial:string|undefined;
  dblFloorLayerWidth:number|undefined;
  dblFloorLayerDensity:any|undefined;
  dblFloorLayerConductivity:any|undefined;
}
export interface dblFloorProps{
  dblFloorType:string|undefined;
  dblFloorLoadBearing: boolean|undefined;
  dblFloorIsExternal:boolean|undefined;
  dblFloorEnvelopeCode:any|undefined;
  dblFloorUvalue:number|undefined;
  dblFloorRvalue:number|undefined;
}
export interface dblFloorQtos{
  dblFloorPerimeter:number|undefined;
  dblFloorWidth:number|undefined;
  dblFloorNetArea:number|undefined;
  dblFloorNetVolume:number|undefined;
}
//Roof interfaces
export interface dblRoofLayer{
  dblFloorLayerMaterial:string;
  dblFloorLayerWidth:number;
  dblFloorLayerDensity:any
  dblFloorLayerConductivity:any;
}
export interface dblRoofProps{
  dblRoofType:string|undefined;
  dblRoofLoadBearing: boolean|undefined;
  dblRoofIsExternal:boolean|undefined;
  dblRoofEnvelopeCode:any|undefined;
  dblRoofUvalue:number|undefined;
  dblRoofRvalue:number|undefined;
}
export interface dblRoofQtos{
  dblRoofPerimeter:number|undefined;
  dblRoofWidth:number|undefined;
  dblRoofNetArea:number|undefined;
  dblRoofNetVolume:number|undefined;
}
// Combine Interfaces create type
export type dblWallEntity <X, Y> = dblEntity & X & Y
export type dblWindowEntity <X,Y> = dblEntity & X & Y
export type dblFloorEntity <X,Y> = dblEntity & X & Y
export type dblRoofEntity <X,Y> = dblEntity & X & Y