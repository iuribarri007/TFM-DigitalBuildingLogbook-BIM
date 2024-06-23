import * as OBC from "openbim-components"
import * as WEBIFC from "web-ifc"
import { Fragment, FragmentsGroup } from "bim-fragment"
//Import dblEntityinterfaces
import { dblElementLayerMaterial, dblEntity } from "./dblElementsInterface"
//Import Wall interfaces
import { dblWallEntity } from "./dblElementsInterface"
import { dblWallProps } from "./dblElementsInterface"
import { dblWallLayer } from "./dblElementsInterface"
import { dblWallQtos } from "./dblElementsInterface"
//Import Window interfaces
import { dblWindowEntity } from "./dblElementsInterface"
import { dblWindowProps } from "./dblElementsInterface"
import { dblWindowComponents } from "./dblElementsInterface"
import { dblWindowQtos } from "./dblElementsInterface"
//Import Floor interfaces
import { dblFloorEntity } from "./dblElementsInterface"
import { dblFloorProps } from "./dblElementsInterface"
import { dblFloorLayer } from "./dblElementsInterface"
import { dblFloorQtos } from "./dblElementsInterface"
//Import Roof interfaces
import { dblRoofEntity } from "./dblElementsInterface"
import { dblRoofProps } from "./dblElementsInterface"
import { dblRoofLayer } from "./dblElementsInterface"
import { dblRoofQtos } from "./dblElementsInterface"
import { expression, instance, property } from "three/examples/jsm/nodes/Nodes.js"


//Define an object to contain de Ids By level
export const modelEntitiesIdByLevel:any={}
//Trial
export const modelFragmentIdByLevel:any={}
// Defining a function to check if a value is already present


interface ModelEntityIdFragment{
  expressId:number
  fragmentIds:[any];
}

function isIdPresent (array:ModelEntityIdFragment[],id:string|number){
  return array.some((obj:ModelEntityIdFragment) => obj.expressId == id)
}
function checkPresentExpressIdIndex(expressId: number, fragments: ModelEntityIdFragment[]): number {
  return fragments.findIndex(fragment => fragment.expressId === expressId);
}

export async function getEntityFragmentsByLevel(model:FragmentsGroup, obj:any){
  const properties= model.properties
  if(properties===undefined||null){return}
  const storeys= obj.storeys
  //console.log(storeys)
  for (const level in storeys){
    const modelEntityFragmentLevelArray:any=[]

      modelFragmentIdByLevel[level]= modelEntityFragmentLevelArray
      const storeysObject= storeys[level]
      for (const e in storeysObject){
        const set = storeysObject[e]
        //console.log(e,set)
        const fragmentId= e 
        const setArray= Array.from(set)
        for (let id in setArray){
          const classifiedId:number= setArray[id]as number
          //console.log(classifiedId)
          const modelEntityIdFragment:ModelEntityIdFragment={
            expressId: classifiedId,
            fragmentIds: [fragmentId]
          }
          
          const classifiedIdProps = properties[classifiedId]
          const classifiedIdType= classifiedIdProps.type
          //
          
          //console.log(modelEntityIdFragment)
          if(classifiedIdType === WEBIFC.IFCWALL||classifiedIdType === WEBIFC.IFCWALLSTANDARDCASE||classifiedIdType ===WEBIFC.IFCWALLELEMENTEDCASE ||classifiedIdType ===WEBIFC.IFCCURTAINWALL||//Ifc Wall classes
            classifiedIdType === WEBIFC.IFCWINDOW || classifiedIdType === WEBIFC.IFCPLATE||classifiedIdType ===WEBIFC.IFCRAILING || classifiedIdType ===WEBIFC.IFCMEMBER || classifiedIdType ===WEBIFC.IFCDOOR || //IfcWindow or Curtain pannel
            classifiedIdType === WEBIFC.IFCSLAB || classifiedIdType === WEBIFC.IFCSLABSTANDARDCASE ||classifiedIdType ===WEBIFC.IFCSLABELEMENTEDCASE|| classifiedIdType ===WEBIFC.IFCCOVERING || // Ifc floors and related
            classifiedIdType === WEBIFC.IFCROOF || classifiedIdType === WEBIFC.IFCBUILDINGELEMENTPROXY || classifiedIdType ===WEBIFC.IFCBUILDINGELEMENT || //Ifc
            classifiedIdType === WEBIFC.IFCCOLUMN || classifiedIdType === WEBIFC.IFCCOLUMNSTANDARDCASE || classifiedIdType === WEBIFC.IFCBEAM || classifiedIdType === WEBIFC.IFCFOOTING || classifiedIdType === WEBIFC.IFCPILE ||
            classifiedIdType === WEBIFC.IFCSTAIR || classifiedIdType === WEBIFC.IFCSTAIRFLIGHT || classifiedIdType === WEBIFC.IFCRAMP || classifiedIdType === WEBIFC.IFCRAMPFLIGHT)
            { 
              const index = checkPresentExpressIdIndex(classifiedId, modelEntityFragmentLevelArray);
              if(index!==-1){
                modelEntityFragmentLevelArray[index].fragmentIds.push(fragmentId)
                //console.log("Is already in",fragmentId,modelEntityFragmentLevelArray[index])
              }
              else {
                modelEntityFragmentLevelArray.push(modelEntityIdFragment)
                //console.log("New Index")
              }
            }
        }
      }
      if (modelEntityFragmentLevelArray.length===0){
        delete modelFragmentIdByLevel[modelEntityFragmentLevelArray]} 
  }
  //console.log("blala",modelFragmentIdByLevel)
}

//model entitiesObjectbyLevel
interface ModelEntity {
    key: number; // or string if expressID is string
    entityType: number;
    Attributes: {
        GlobalId: string;
        Name: string;
        Tag: string;
        // PredefinedType?: string; // Uncomment if needed
    };
    [key: string]: any; // To accommodate dynamically added properties
}
interface ModelEntityPset {
    [key: string]: any; // Adjust this type based on the actual structure of the properties
}
//Defining a new interface
interface ModelInstance{
    expressId:number;
    fragmentId:Fragment;
    entityType: number;
    globalId:string;
}
interface WallEntity{

}
// Define and export Entities
export const wallEntitiesByLevel: { [key: string]: ModelEntity[] } = {};
export const windowEntitiesByLevel: { [key: string]: ModelEntity[] } = {};
export const floorEntitiesByLevel: { [key: string]: ModelEntity[] } = {};
export const roofEntitiesByLevel: { [key: string]: ModelEntity[] } = {};

//Define and export ExternalEntities
export const dblEnvelopeWallElements:any={}
export const dblEnvelopeWindowElements:any={}
export const dblEnvelopeFloorElements:any={}
export const dblEnvelopeRoofElements:any={}

//Interface ExternalEntities
interface externalWallEntity{
    key:number;
    entityType: number;
    dbl:{
      dblWallType: string;
      dblWallOrientation: string;
      dblWallUvalue: number;
      dblWallRvalue:number;
      dblWallSurface: number;
      dblWallThickness: number;
    }
  }
  interface externalWindowEntity{
    key:number;
    entityType:number;
    dbl:{
      dblWindowType: any;
      dblWindowOrientation: string;
      dblWindowUvalue:number;
      dblWindowGvalue: number;
      dblWindowSurface: number;
      dblSunProtection: string;
    }
  }
//
const dblWallElements:any={};
const dblWindowElements:any={};
const dblFloorElements:any={};
const dblRoofElements:any={};
//

//
//Function
export async function getDblEntitiesByLevel(model:FragmentsGroup,obj:any){
  const properties= model.properties
  if(properties===undefined || null){return}
  //
  for (const level in obj){
    let levelArray= obj[level]
    console.log(level)
    //const mPsets = OBC.IfcPropertiesUtils.getAllItemsOfType(properties,WEBIFC.IFCMATERIALPROPERTIES)
    //console.log(mPsets)
    const dblWallEntitiesLevelArray: any = [];
    const dblWindowEntitiesLevelArray: any = [];
    const dblFloorEntitiesLevelArray: any = [];
    const dblRoofEntitiesLevelArray: any = [];
    //ExternalLevel Arrays
    const dblExternalWallsLevelArray: any=[];
    const dblExternalWindowsLevelArray: any=[];
    const dblExternalFloorsLevelArray: any=[];
    const dblExternalRoofsLevelArray: any=[];
    for (let id in levelArray){
    
      const expressID= levelArray[id].expressId
      const fragmentIdArray= levelArray[id].fragmentIds
      const idProps= properties[expressID]
      const idType= idProps.type
      

      let dblWallProps:dblWallProps = {
        dblWallType: undefined,
        dblWalLoadBearing: undefined,
        dblWallIsExternal: undefined,
        dblWallEnvelopeCode: undefined,
        dblWallEnvelopeOrientation: undefined,
        dblWallUvalue: undefined,
        dblWallRvalue: undefined,
      }
      let dblWallQtos:dblWallQtos = {
        dblWallLenght: undefined,
        dblWallWidth: undefined,
        dblWallHeight:undefined,
        dblWallNetArea: undefined,
        dblWallNetVolume: undefined,
      }
      //Windows
      let dblWindowProps: dblWindowProps = {
        dblWindowType:undefined,
        dblWindowIsExternal:undefined,
        dblWindowEnvelopeCode:undefined,
        dblWindowEnvelopeOrientation:undefined,
        dblWindowUvalue:undefined,
        dblWindowGvalue:undefined,
        dblWindowGlazingFraction:undefined,
      }
      let dblWindowQtos: dblWindowQtos = {
        dblWindowWidth:undefined,
        dblWindowHeight: undefined,
        dblWindowArea: undefined,
        dblWindowPerimeter: undefined,
      }
      //Floors
      let dblFloorProps:dblFloorProps = {
        dblFloorType: undefined,
        dblFloorLoadBearing:undefined,
        dblFloorIsExternal: undefined,
        dblFloorEnvelopeCode: undefined,
        dblFloorUvalue: undefined,
        dblFloorRvalue: undefined,
      }
      let dblFloorQtos:dblFloorQtos = {
        dblFloorWidth: undefined,
        dblFloorPerimeter: undefined,
        dblFloorNetArea: undefined,
        dblFloorNetVolume: undefined,
      }
      //Roofs
      let dblRoofProps: dblRoofProps = {
        dblRoofType: undefined,
        dblRoofLoadBearing: undefined,
        dblRoofIsExternal: undefined,
        dblRoofEnvelopeCode: undefined,
        dblRoofUvalue: undefined,
        dblRoofRvalue: undefined,
      }
      let dblRoofQtos: dblRoofQtos = {
        dblRoofWidth: undefined,
        dblRoofPerimeter: undefined,
        dblRoofNetArea: undefined,
        dblRoofNetVolume: undefined,
      }
      const dblElementMaterialLayerSet:any = [];
      //
      
      //console.log(expressID,idProps)
      //
      const dblEntity:dblEntity={
        expressId: parseFloat(expressID),
        fragmentId: fragmentIdArray,
        entityType:idType,
        globalId: idProps.GlobalId
      }
      const isWall= (idType===WEBIFC.IFCWALL||idType===WEBIFC.IFCWALLSTANDARDCASE || idType===WEBIFC.IFCWALLELEMENTEDCASE || idType===WEBIFC.IFCPLATE) 
      const isFloor = (idType===WEBIFC.IFCSLAB||idType===WEBIFC.IFCSLABSTANDARDCASE||idType===WEBIFC.IFCSLABELEMENTEDCASE ||idType===WEBIFC.IFCCOVERING)
      const isWindow = (idType===WEBIFC.IFCWINDOW)
      const isRoof = (idType===WEBIFC.IFCROOF)
      //
      //Type
      let instanceTypeId:any= undefined;
      //------------------------------------------------------------------------------------------------------
      //Element generic Properties
      let elementType:undefined|string= undefined; let elementLoadBearing: undefined|boolean= undefined; 
      let elementIsExternal:undefined|boolean=undefined; let elementEnvelopeCode:undefined|string= undefined;
      let elementUvalue:undefined|number = undefined; let elementRvalue:undefined| number = undefined;
      //WallQuantities
      let wallLenght:undefined|number=undefined; let wallWidth:undefined|number=undefined;
      let wallHeight:undefined|number=undefined ;let wallNetSideArea:any|undefined=undefined;
      let wallNetVolume:undefined|number=undefined;
      ///MaterialLayers
      let wallMaterialName= undefined
      //FloorProperties
      let floorPerimeter: undefined|number = undefined; let floorWidth: undefined|number= undefined;
      let floorNetArea: undefined|number = undefined; let floorNetVolume: undefined|number;
      //WallProperties
      let wallEnvelopeOrientation:undefined|string = undefined ;
      //--------------------------------------------------------------------------------------------------------
      //WindowProperties
      let windowGlazingFraction: undefined|number = undefined; let WindowGvalue: undefined|number = undefined;
      //WindowQuantities
      let windowHeight: undefined|number = undefined; let windowWidth: undefined|number = undefined;
      let windowPerimeter: undefined|number = undefined; let windowArea : undefined|number = undefined;
      //LayerSetMaterials
      let layerMaterialName: undefined|string = undefined; let layerMaterialThickness: undefined|number;
      let layerMaterialThermalConductivity: undefined|number = undefined; let layerMaterialDensity: undefined|number;
      let layerNetVolume:undefined|number = undefined; let layerWeight:undefined|number = undefined;
      // getting the type
      OBC.IfcPropertiesUtils.getRelationMap(properties,WEBIFC.IFCRELDEFINESBYTYPE,(typeId,relatedId)=>{
        const workingTypeId = relatedId.filter(id=>id==expressID)
        if(workingTypeId.length!==0){
          instanceTypeId = typeId
        }
      })
      //
      const instanceTypeProps= properties[instanceTypeId]
      // Get the type Psets and Properties
      if(!instanceTypeProps.hasOwnProperty("HasPropertySets")|| instanceTypeProps.HasPropertySets===null){continue}
      if(instanceTypeProps.hasOwnProperty("HasPropertySets")&& instanceTypeProps.HasPropertySets.length!==0){
        const instanceTypePsetArray= instanceTypeProps.HasPropertySets
        for (const pset of instanceTypePsetArray){
          const psetId= pset.value
          const instanceTypePset= properties[psetId]
          if(!instanceTypePset.hasOwnProperty("HasProperties")|| instanceTypePset.HasProperties.length==0){continue}
          const wallTypePsetPropArray= instanceTypePset.HasProperties
          for (const p of wallTypePsetPropArray){
            const pId= p.value
            const typeProp= properties[pId]
            const typePropName= typeProp.Name.value
            const typePropValue= typeProp.NominalValue.value
            switch(typePropName){
              case "ThermalTransmittance": elementUvalue = parseFloat(typePropValue.toFixed(2)) ; break;
              case "IsExternal": elementIsExternal = typePropValue; break;
              case "LoadBearing": elementLoadBearing = typePropValue; break
            }
            if(elementUvalue!==undefined){
              elementRvalue =parseFloat((1/elementUvalue).toFixed(2))
            }
          }
        }
      }
      //Get the instancePsets and properties
      OBC.IfcPropertiesUtils.getRelationMap(
        properties,
        WEBIFC.IFCRELDEFINESBYPROPERTIES,
        (setID, relatedID)=>{
          const workingPsetId= relatedID.filter( id=>id==expressID)
          const set = properties[setID]
          const setName= set.Name.value
          if((workingPsetId.length!==0 && (set.type==WEBIFC.IFCPROPERTYSET || set.type==WEBIFC.IFCELEMENTQUANTITY)) && (setName.includes("Common")||setName.includes("DBL")|| setName.includes("Quantities"))){
            if(set.hasOwnProperty("HasProperties")&& set.type===WEBIFC.IFCPROPERTYSET ){
              const propsArray= set.HasProperties
              //console.log("Pset",expressID,setID,set)
              for (let p of propsArray){
                const pID = p.value
                const property= properties[pID]
                //console.log(expressID,setID,pID,property)
                if(!property.hasOwnProperty("Name") && !property.Name.hasOwnProperty("value")&& !property.hasOwnProperty("NominalValue")){continue}
                const propertyName= property.Name.value
                const instancePropValue= property.NominalValue.value
                //
                switch(propertyName){
                  case "Reference": elementType= instancePropValue; break;
                  case "DBL_EnvelopeCode":elementEnvelopeCode = instancePropValue; break;
                }
                if(isWall || isWindow){
                  switch(propertyName){
                    case "DBL_EnvelopeOrientation": wallEnvelopeOrientation = instancePropValue
                  }
                }
                else if(isWindow){
                  switch(propertyName){
                    case "GlazingAreaFraction": windowGlazingFraction = instancePropValue
                  }
                }
              }
            }
            else if(set.hasOwnProperty("Quantities")&& set.type===WEBIFC.IFCELEMENTQUANTITY){
              const quantArray= set.Quantities
              for (let q of quantArray){
                const qId= q.value;
                const quantity= properties[qId]
                //console.log("Soy una cantidad",quantity)
                //if(quantity.type==WEBIFC.IFCPHYSICALCOMPLEXQUANTITY){quantity.HasQuantities.forEach(element => {
                //  const i=element.value
                //  console.log("raro",properties[i])
                //});}
                const quantityName= quantity.Name.value
                let quantityValue:any = undefined;
                for (const key in quantity){
                  if (key.includes("Value")){
                    quantityValue= quantity[key].value
                  }
                }
                if(isWall){
                  switch(quantityName){
                    case "Length": wallLenght = parseFloat(quantityValue.toFixed(2)); break;
                    case "Width": wallWidth = parseFloat (quantityValue.toFixed(2)); break;
                    case "Height": wallHeight = parseFloat(quantityValue.toFixed(2)) ; break
                    case "NetSideArea": wallNetSideArea = parseFloat(quantityValue.toFixed(2)); break;
                    case "NetVolume": wallNetVolume = parseFloat (quantityValue.toFixed(2)); break
                  }
                }
                else if(isFloor||isRoof){
                  switch(quantityName){
                    case "Perimeter":floorPerimeter =  parseFloat(quantityValue.toFixed(2));break;
                    case "Depth": floorWidth =  parseFloat(quantityValue.toFixed(2));break;
                    case "NetArea": floorNetArea = parseFloat(quantityValue.toFixed(2));break;
                    case "NetVolume": floorNetVolume = parseFloat(quantityValue.toFixed(2));break;
                  }
                }
                else if (isWindow){
                  switch(quantityName){
                    case "Width": windowWidth = parseFloat(quantityValue.toFixed(2));break;
                    case "Height": windowHeight = parseFloat(quantityValue.toFixed(2)); break;
                    case "Perimeter": windowPerimeter = parseFloat(quantityValue.toFixed(2)); break;
                    case "Area": windowArea = parseFloat(quantityValue.toFixed(2)); break;
                  }
                }
              }
            }
          }
        }
      )
      // Get the instance Material
      OBC.IfcPropertiesUtils.getRelationMap(
        properties,
        WEBIFC.IFCRELASSOCIATESMATERIAL,
        (layMatSet, relatedID)=>{
          const workingLayId= relatedID.filter(id=>id==instanceTypeId)
          const layMatProp = properties[layMatSet]
          // MaterialLayerSet
          if(workingLayId.length!==0 && ( layMatProp.type === WEBIFC.IFCMATERIALLAYERSET)&& (isWall || isFloor|| isRoof)){
            //console.log("layerset",layMatProp)
            let layerArray:any = undefined;
            for (const materialKey in layMatProp){
              if(materialKey.includes("Material")){
                layerArray= layMatProp[materialKey]
              }
            }
            //console.log("LayerArray",layerArray)
            if(layerArray.length===0){return}
            for(const layer in layerArray){
              const layerID= layerArray[layer].value
              const layerProps = properties[layerID]
              //console.log("Material",layerProps)
              if(layerProps.type === WEBIFC.IFCMATERIALLAYER && (layerProps.hasOwnProperty("LayerThickness") && layerProps.hasOwnProperty("Material"))){
                let nlayerMaterialThickness = layerProps.LayerThickness.value
                let nLayerMaterialName= undefined;
                const materialId= layerProps.Material.value
                const materialProps = properties[materialId] 
                //console.log("Material",materialProps)
                if(materialProps.type===WEBIFC.IFCMATERIAL && materialProps.hasOwnProperty("Name")){
                  nLayerMaterialName= materialProps.Name.value;
                }
                layerMaterialThickness = parseFloat(nlayerMaterialThickness.toFixed(2)) 
                layerMaterialName = nLayerMaterialName
                //console.log(materialProps)
                //Get Material Psets
                OBC.IfcPropertiesUtils.getRelationMap(properties,WEBIFC.IFCMATERIALPROPERTIES,(relatedM,relatingM) =>{
                  const workingPsetMats = relatedID.filter(id=> id==materialId)
                  if(workingPsetMats.length!==0){
                    console.log("MaterialPset",relatedM)
                  }
                }
                )
              }
              let dblElementLayerMaterial:dblElementLayerMaterial={
                dblLayerMaterialName: layerMaterialName,
                dblLayerMaterialThickness: layerMaterialThickness,
                dblLayerMaterialThermalConductivity: layerMaterialThermalConductivity,
                dblLayerMaterialDensity: layerMaterialDensity,
                dblLayerNetVolume: layerNetVolume,
                dblLayerWeight: layerWeight
              };
              dblElementMaterialLayerSet.push(dblElementLayerMaterial)
            }
          }
          if(workingLayId.length!==0 && ( layMatProp.type ===  WEBIFC.IFCMATERIALCONSTITUENTSET)){
            //console.log(expressID,"layerset",layMatProp)
            let materialConstituentArray:any = undefined;
            for (const materialKey in layMatProp){
              if(materialKey.includes("Material")){
                materialConstituentArray= layMatProp[materialKey]
              }
            }
            //console.log(expressID,materialConstituentArray)
          }
        }
      )
      if(isWall){
         dblWallProps:dblWallProps = {
          dblWallType: elementType,
          dblWalLoadBearing: elementLoadBearing,
          dblWallIsExternal: elementIsExternal,
          dblWallEnvelopeCode:elementEnvelopeCode,
          dblWallEnvelopeOrientation:wallEnvelopeOrientation,
          dblWallUvalue:elementUvalue,
          dblWallRvalue:elementRvalue,
        }
         dblWallQtos:dblWallQtos = {
          dblWallLenght: wallLenght,
          dblWallWidth: wallWidth,
          dblWallHeight:wallHeight,
          dblWallNetArea: wallNetSideArea,
          dblWallNetVolume: wallNetVolume,
        }
        //console.log("DBL_Wall",dblWallProps,dblWallQtos,dblElementMaterialLayerSet)
        const dblWall={
          entity: dblEntity,
          props: dblWallProps,
          qtos: dblWallQtos,
          materials: dblElementMaterialLayerSet 
          }
        if(elementIsExternal==true){dblExternalWallsLevelArray.push(dblWall)}
        else {dblWallEntitiesLevelArray.push(dblWall)}
        //console.log(expressID,dblWall)
      } 
      else if(isWindow){
        dblWindowProps: dblWindowProps = {
          dblWindowType:elementType,
          dblWindowIsExternal:elementIsExternal,
          dblWindowEnvelopeCode:elementEnvelopeCode,
          dblWindowEnvelopeOrientation:wallEnvelopeOrientation,
          dblWindowUvalue:elementUvalue,
          dblWindowGvalue:undefined,
          dblWindowGlazingFraction:undefined,
        }
         dblWindowQtos: dblWindowQtos = {
          dblWindowWidth:windowWidth,
          dblWindowHeight: windowHeight,
          dblWindowArea: windowPerimeter,
          dblWindowPerimeter: windowArea,
        }
        //console.log("DBL_Window",dblWindowProps, dblWindowQtos)
        const dblWindow={
          entity: dblEntity,
          props: dblWindowProps,
          qtos: dblWindowQtos,
        }
        if(elementIsExternal===true){dblExternalWindowsLevelArray.push(dblWindow)}
        else{dblWindowEntitiesLevelArray.push(dblWindow)}
        //console.log(expressID,dblWindow)
      } 
      else if(isFloor){
        dblFloorProps:dblFloorProps = {
          dblFloorType: elementType,
          dblFloorLoadBearing:elementLoadBearing,
          dblFloorIsExternal: elementIsExternal,
          dblFloorEnvelopeCode: elementEnvelopeCode,
          dblFloorUvalue: elementUvalue,
          dblFloorRvalue: elementRvalue,
        }
        dblFloorQtos:dblFloorQtos = {
          dblFloorWidth: floorWidth,
          dblFloorPerimeter: floorPerimeter,
          dblFloorNetArea: floorNetArea,
          dblFloorNetVolume: floorNetVolume,
        }
        //console.log("DBL_Floor",dblFloorProps,dblFloorQtos,dblElementMaterialLayerSet)
        const dblFloor = {
          entity: dblEntity,
          props: dblFloorProps,
          qtos: dblFloorQtos,
          materials: dblElementMaterialLayerSet
        }
        if(elementIsExternal==true){dblExternalFloorsLevelArray.push(dblFloor)}
        else(dblFloorEntitiesLevelArray.push(dblFloor))
        //console.log("Floor",expressID,dblFloor)
      } 
      else if(isRoof){
        dblRoofProps: dblRoofProps = {
          dblRoofType: elementType,
          dblRoofLoadBearing: elementLoadBearing,
          dblRoofIsExternal: elementIsExternal,
          dblRoofEnvelopeCode: elementEnvelopeCode,
          dblRoofUvalue: elementUvalue,
          dblRoofRvalue: elementRvalue,
        }
        dblRoofQtos: dblRoofQtos = {
          dblRoofWidth: floorWidth,
          dblRoofPerimeter: floorPerimeter,
          dblRoofNetArea: floorNetArea,
          dblRoofNetVolume: floorNetVolume,
        }
        //console.log("DBL_Roof",dblRoofProps,dblRoofQtos,dblElementMaterialLayerSet)
        const dblRoof = {
          entity: dblEntity,
          props: dblRoofProps,
          qtos: dblRoofQtos,
          materials: dblElementMaterialLayerSet
        }
        if(elementIsExternal == true){
          dblExternalRoofsLevelArray.push(dblRoof)

        }
        else {dblRoofEntitiesLevelArray.push(dblRoof)}
        
        //console.log(expressID,dblRoof)
      }
    }
    //if(dblWallEntitiesLevelArray.length!==0){dblWallElements[level] = dblWallEntitiesLevelArray}
    if(dblExternalWallsLevelArray.length!==0){dblEnvelopeWallElements[level] = dblExternalWallsLevelArray}

    //if(dblWindowEntitiesLevelArray.length!==0){dblWindowElements[level] = dblWindowEntitiesLevelArray}
    if(dblExternalWindowsLevelArray.length!==0){dblEnvelopeWindowElements[level] = dblExternalWindowsLevelArray}

    //if(dblFloorEntitiesLevelArray.length!==0){dblFloorElements[level]=dblFloorEntitiesLevelArray}
    if(dblExternalFloorsLevelArray.length!==0){dblEnvelopeFloorElements[level] = dblExternalFloorsLevelArray}

    //if(dblRoofEntitiesLevelArray.length!==0){dblRoofElements[level]=dblRoofEntitiesLevelArray}
    if(dblExternalRoofsLevelArray.length!==0){dblEnvelopeRoofElements[level] = dblExternalRoofsLevelArray}
    
    //Create an array per each level
    
  } 
  console.log("DBLExternalWalls",dblEnvelopeWallElements)
  console.log("DBLExternalWindow",dblEnvelopeWindowElements)
  console.log("DBLExternalFloors",dblEnvelopeFloorElements)
  console.log("DBLExternalRoofs",dblEnvelopeRoofElements)
}

export async function classifyEnvelope(...obj){
  obj.forEach( obj => {
    for (const level in obj){
      const dblLevel= obj[level]
      for (const e in dblLevel){
        const dblElement = dblLevel[e]
        const dblEnvelopeCode = undefined//AQUI LO DEJAMOS
        
      }
    }
  }
)
}


  