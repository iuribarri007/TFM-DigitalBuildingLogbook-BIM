import * as OBC from "openbim-components"
import * as WEBIFC from "web-ifc"
import { FragmentsGroup } from "bim-fragment"
//Define an object to contain de Ids By level
const modelEntitiesIdByLevel:any={}
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
//
async function getEntityIdsByLevel(model: FragmentsGroup, obj:any){
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