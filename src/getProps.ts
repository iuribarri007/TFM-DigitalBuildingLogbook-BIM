import * as OBC from "openbim-components"
import * as WEBIFC from "web-ifc"
import { Fragment, FragmentsGroup } from "bim-fragment"
//Define an object to contain de Ids By level
export const modelEntitiesIdByLevel:any={}
// Defining a function to check if a value is already present
function isValuePresent(obj: Record<string, any[]>, value: any): boolean {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const array = obj[key];
            if (array.includes(value)) {
                return true;
            }
        }
    }
  return false;
}
//Getting the Ids of all the entities by Level//Export
export async function getEntityIdsByLevel(model: FragmentsGroup, obj:any){
    const properties= model.properties
    if (properties===undefined||null){return}
    const storeys= obj.storeys
    for (let level in storeys){
      let modelEntityLevelArray:any=[]
      modelEntitiesIdByLevel[level]=modelEntityLevelArray
      const storeysObject= storeys[level]
      for (let e in storeysObject){
        const set = storeysObject[e]
        const setArray= Array.from(set)
        for (let id in setArray){
          const classifiedId:number= setArray[id]as number
          const classifiedIdProps = properties[classifiedId]
          const classifiedIdType= classifiedIdProps.type
          if(classifiedIdType === WEBIFC.IFCWALL||classifiedIdType === WEBIFC.IFCWALLSTANDARDCASE||classifiedIdType ===WEBIFC.IFCWALLELEMENTEDCASE ||classifiedIdType ===WEBIFC.IFCCURTAINWALL|| //Ifc Wall classes
            classifiedIdType === WEBIFC.IFCWINDOW || classifiedIdType === WEBIFC.IFCPLATE||classifiedIdType ===WEBIFC.IFCRAILING || classifiedIdType ===WEBIFC.IFCMEMBER || classifiedIdType ===WEBIFC.IFCDOOR || //IfcWindow or Curtain pannel
            classifiedIdType === WEBIFC.IFCSLAB || classifiedIdType === WEBIFC.IFCSLABSTANDARDCASE ||classifiedIdType ===WEBIFC.IFCSLABELEMENTEDCASE|| classifiedIdType ===WEBIFC.IFCCOVERING || // Ifc floors and related
            classifiedIdType === WEBIFC.IFCROOF || classifiedIdType === WEBIFC.IFCBUILDINGELEMENTPROXY || classifiedIdType ===WEBIFC.IFCBUILDINGELEMENT || //Ifc
            classifiedIdType === WEBIFC.IFCCOLUMN || classifiedIdType === WEBIFC.IFCCOLUMNSTANDARDCASE || classifiedIdType === WEBIFC.IFCBEAM || classifiedIdType === WEBIFC.IFCFOOTING || classifiedIdType === WEBIFC.IFCPILE ||
            classifiedIdType === WEBIFC.IFCSTAIR || classifiedIdType === WEBIFC.IFCSTAIRFLIGHT || classifiedIdType === WEBIFC.IFCRAMP || classifiedIdType === WEBIFC.IFCRAMPFLIGHT)
            {
              if(isValuePresent(modelEntitiesIdByLevel,classifiedId)){continue}
              else{modelEntityLevelArray.push(classifiedId)}
            }
          else {continue}
        }
      }
      if (modelEntityLevelArray.length===0){
        delete modelEntitiesIdByLevel[modelEntityLevelArray]
    }
  }
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
export const externalWallsByLevel:any={};
export const externalWindowsByLevel:any={};
export const externalFloorsByLevel:any={};
export const externalRoofsByLevel:any={};

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

// Classifying the entities into types and getting the properties
export async function getEntityPropsByLevels(model:FragmentsGroup, obj:object){
    const properties = model.properties
    for (let level in obj){
      let levelArray= obj[level]
      //Define all arrays inside objects
      let wallEntitiesLevelArray: ModelEntity[] = [];
      let windowEntitiesLevelArray: ModelEntity[] = [];
      let floorEntitiesLevelArray: ModelEntity[] = [];
      let roofEntitiesLevelArray: ModelEntity[] = [];
      //
      for (let id in levelArray){
        let modelEntityPset={}
        let modelEntity: ModelEntity = { key: levelArray[id], entityType: levelArray[id].type ,Attributes: { GlobalId: "", Name: "", Tag: "" }, modelEntityPset };
        const expressID= levelArray[id]
        if(properties === undefined|| null){return} 
         //Insert the expressID as a key
        modelEntity["key"]= expressID
        modelEntity["entityType"]= properties[expressID].type
        //Define the atributes
        const idProperties= properties[expressID];
        const attributes= "Attributes"
        modelEntity[attributes]={
          "GlobalId": idProperties.GlobalId.value,
          "Name":idProperties.Name.value,
          //"PredefinedType":idProperties.PredefinedType.value,
          "Tag": idProperties.Tag.value,
        }
        OBC.IfcPropertiesUtils.getRelationMap(
          properties,
          WEBIFC.IFCRELDEFINESBYPROPERTIES,
          (setID, relatedIDs)=>{
            const set = properties[setID]
            const workingIDs= relatedIDs.filter(id => id==expressID)
            if( set.type===WEBIFC.IFCPROPERTYSET && workingIDs.length!==0){
              if(set.HasProperties.length!==0){
                let modelEntityPsetValue ={}
                let modelEntityPsetKey= properties[set.expressID].Name.value
                modelEntity[modelEntityPsetKey] = {
                  "id": set.expressID,
                  "name":modelEntityPsetKey,
                  modelEntityPsetValue
                }
                for (let p in set.HasProperties){
                  if(set.HasProperties.length>0){
                    const pId= set.HasProperties[p].value
                    if(properties[pId].Name.value != null && properties[pId].NominalValue.value !== null){
                      const pName= properties[pId].Name.value
                      const pValue= properties[pId].NominalValue.value
                      modelEntityPsetValue[pName]=pValue
                    }
                    else {continue}
                  }
                }
              }  
            }
            else if(set.type===WEBIFC.IFCELEMENTQUANTITY && workingIDs.length!==0){
              if (set.Quantities.length!==0){
                let modelEntityQsetValue={}
                let modelEntityQsetKey= properties[set.expressID].Name.value
                modelEntity[modelEntityQsetKey]={
                  "id":set.expressID,
                  "name":modelEntityQsetKey,
                  modelEntityQsetValue
                }
                //console.log(modelEntityQsetKey,set)
                for (let q in set.Quantities){
                  if(set.Quantities.length>0){
                    const qId= set.Quantities[q].value
                    const qIdProps= properties[qId]
                    if (qIdProps.Name.value){
                      if(properties[qId].type=== WEBIFC.IFCQUANTITYLENGTH){
                        const qLengthName= qIdProps.Name.value
                        const qLengthValue= qIdProps.LengthValue.value
                        modelEntityQsetValue[qLengthName]=qLengthValue
  
                      }
                      else if (properties[qId].type=== WEBIFC.IFCQUANTITYAREA){
                        const qAreaName= qIdProps.Name.value
                        const qAreaValue= qIdProps.AreaValue.value
                        modelEntityQsetValue[qAreaName]=qAreaValue
                      }
                      else if(properties[qId].type=== WEBIFC.IFCQUANTITYVOLUME){
                        const qVolumeName= qIdProps.Name.value
                        const qVolumeValue= qIdProps.VolumeValue.value
                        modelEntityQsetValue[qVolumeName]= qVolumeValue
                      }
                    }
                  }
                }
              }
            }
          }
        )
      let idType= idProperties.type
      if(idType===WEBIFC.IFCWALL || idType=== WEBIFC.IFCWALLSTANDARDCASE || idType === WEBIFC.IFCWALLELEMENTEDCASE){wallEntitiesLevelArray.push(modelEntity)}
      else if(idType === WEBIFC.IFCWINDOW || idType === WEBIFC.IFCPLATE){windowEntitiesLevelArray.push(modelEntity)}
      else if(idType === WEBIFC.IFCSLAB || idType === WEBIFC.IFCCOVERING || idType === WEBIFC.IFCSLABSTANDARDCASE ||idType === WEBIFC.IFCSLABELEMENTEDCASE ){floorEntitiesLevelArray.push(modelEntity)}
      else if(idType === WEBIFC.IFCROOF){roofEntitiesLevelArray.push(modelEntity)}
      }
      if(wallEntitiesLevelArray.length!==0){wallEntitiesByLevel[level]=wallEntitiesLevelArray}
      if(windowEntitiesLevelArray.length!==0){windowEntitiesByLevel[level]=windowEntitiesLevelArray}
      if(floorEntitiesLevelArray.length!==0){floorEntitiesByLevel[level]=floorEntitiesLevelArray}
      if (roofEntitiesLevelArray.length!==0){roofEntitiesByLevel[level]=roofEntitiesLevelArray}
    }
}

export function getExternalEntitiesByLevel (...objs: any){
    objs.forEach(obj=>{
      for (let level in obj){
        let externalWallsLevelArray:any[] =[]
        let externalWindowsLevelArray:any[] = []
        let externalFloorsLevelArray:any[]=[]
        let externalRoofsLevelArray:any[] = []
        let levelArray = obj[level]
        //
        for (let e in levelArray){
          let entity: ModelEntity= levelArray[e]
          const expressID= entity.key
          const idType= entity.entityType
          //
          if(idType=== WEBIFC.IFCWALL || idType=== WEBIFC.IFCWALLSTANDARDCASE || idType=== WEBIFC.IFCWALLELEMENTEDCASE){
            if(entity.Pset_WallCommon.modelEntityPsetValue.IsExternal==true ){
              const extWallType= entity.Pset_WallCommon.modelEntityPsetValue.Reference
              const extWallOrientation= "wall orientation"
              const extWallUvalue= entity.Pset_WallCommon.modelEntityPsetValue.ThermalTransmittance
              const extWallRvalue= 1/(extWallUvalue)
              const extWallSurface= entity.Qto_WallBaseQuantities.modelEntityQsetValue.NetSideArea
              const extWallThickness= entity.Qto_WallBaseQuantities.modelEntityQsetValue.Width
              //
              let externalWallEntity: externalWallEntity= {
                key: entity.key,
                entityType:idType,
                dbl:{
                  dblWallType:extWallType,
                  dblWallOrientation:extWallOrientation,
                  dblWallUvalue:extWallUvalue,
                  dblWallRvalue:extWallRvalue,
                  dblWallSurface: extWallSurface,
                  dblWallThickness:extWallThickness
                }
              }
              externalWallsLevelArray.push(externalWallEntity)
            }
          }
          if(idType === WEBIFC.IFCWINDOW || idType === WEBIFC.IFCPLATE){
            if(entity.Pset_WindowCommon.modelEntityPsetValue.IsExternal==true ){
              const extWindowType = entity.Pset_WindowCommon.modelEntityPsetValue.Reference
              const extWindowOrientation = "window orientation"
              const extWindowUvalue= 1.2 //entity.Pset_WindowCommon.modelEntityPsetValue.ThermalTransmittance| añadir transmintancia térmica a las ventanas
              const extWindowGvalue= 0.54 //SolarHeatGainTransmittance
              const extWindowSurface = entity.Qto_WindowBaseQuantities.modelEntityQsetValue.Area
              const extWindowSolarProtection= "Yes"
              //
              const  externalWindowEntity: externalWindowEntity={
                key:entity.key,
                entityType:entity.entityType,
                dbl:{
                  dblWindowType: extWindowType,
                  dblWindowOrientation: extWindowOrientation,
                  dblWindowUvalue:extWindowUvalue,
                  dblWindowGvalue: extWindowGvalue,
                  dblWindowSurface: extWindowSurface,
                  dblSunProtection: extWindowSolarProtection,
                }
              }
              externalWindowsLevelArray.push(externalWindowEntity)
            }
          }
          
        }
        
        if(externalWallsLevelArray.length!==0){externalWallsByLevel[level]=externalWallsLevelArray}
        if(externalWindowsLevelArray.length!==0){externalWindowsByLevel[level]=externalWindowsLevelArray}
        if(externalFloorsLevelArray.length!==0){externalFloorsByLevel[level]= externalFloorsLevelArray}
        if(externalRoofsLevelArray.length!==0){externalRoofsByLevel[level]= externalRoofsLevelArray}
      }
    }
    )
  }
  