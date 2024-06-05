import * as THREE from "three"
import * as OBC from "openbim-components"
import * as WEBIFC from "web-ifc"
import { FragmentsGroup } from "bim-fragment"
import { Fragment } from "bim-fragment"
import { or } from "three/examples/jsm/nodes/Nodes.js"
//
import { projectPhasesArray} from './infoProject'

const viewer = new OBC.Components()
const sceneComponent = new OBC.SimpleScene(viewer)
viewer.scene = sceneComponent
const scene = sceneComponent.get()
sceneComponent.setup()
scene.background = null
//Creating the Renderer
const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement
const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer)
viewer.renderer = rendererComponent
//Creating the camera
const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
viewer.camera = cameraComponent

const raycasterComponent = new OBC.SimpleRaycaster(viewer)
viewer.raycaster= raycasterComponent
//Creating the highlighter
const highlighter = new OBC.FragmentHighlighter(viewer)
//Changing the colour to the highlighter

highlighter.setup()

viewer.init()
cameraComponent.updateAspect()
rendererComponent.postproduction.enabled= true
//Setting the fragment manager in order to be able to download the fragment file 

const fragmentManager = new OBC.FragmentManager(viewer)

let fragments = new OBC.FragmentManager(viewer)
const ifcLoader= new OBC.FragmentIfcLoader(viewer)
ifcLoader.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.44/",
  absolute: true
  }
ifcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
ifcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

//Setting a model
const modelEntitiesIdByLevel:any={}
//modelEntitiesIDs!
const wallIdArray: any= [];
const windowIdArray:any=[];
const floorIdArray:any=[];
const roofIdArray:any =[]
//modelEntitiesIds but with objects
const wallIdByLevel:any={}
const windowIdByLevel:any={}
const floorIdByLevel:any={}
const roofIdByLevel:any={}
//modelEntities
const wallArray:any=[];
const windowArray:any=[];
const floorArray:any=[];
const roofArray:any=[];
//model entitiesObjectbyLevel
interface ModelEntity {
  key: number; // or string if expressID is string
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
const wallEntitiesByLevel: { [key: string]: ModelEntity[] } = {};
const windowEntitiesByLevel: { [key: string]: ModelEntity[] } = {};
const floorEntitiesByLevel: { [key: string]: ModelEntity[] } = {};
const roofEntitiesByLevel: { [key: string]: ModelEntity[] } = {};
//modelEntitiesByLevel
const wallArrayLevels:any=[];
const windowArrayLevels:any=[];
const floorArrayLevels:any=[];
const roofArrayLevels:any=[];
//externalModelEntities
const externalWallArray:any=[];
const externalWindowArray:any=[];
const externalFloorArray:any=[];
const externalRoofArray:any=[];

// Defining a function to check if a value is present
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
//Prueba única lista de id
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

//Sorting the IDs by type and level
async function getEntityIdsByLevelByType(model: FragmentsGroup, obj:any){
  const properties= model.properties
  if(properties===undefined){return}
  const storeys= obj.storeys
  for (let level in storeys){
    //console.log(level)
    let wallLevelArray:any =[]
    let windowLevelArray:any= []
    let floorLevelArray:any= []
    let roofLevelArray:any= []
    wallIdByLevel[level]=wallLevelArray
    windowIdByLevel[level]=windowLevelArray
    floorIdByLevel[level]=floorLevelArray
    roofIdByLevel[level]=roofLevelArray
    const levelObject= storeys[level]
      for (let e in levelObject){
        const set= levelObject[e]
        const setArray = Array.from(set)
        for (let num in setArray){
          const classifiedId:number= setArray[num]as number
          //console.log(classifiedId)
          const propClassifiedId = properties[classifiedId]
          const typeClassifiedId= propClassifiedId.type
          if (typeClassifiedId===WEBIFC.IFCWALL||typeClassifiedId===WEBIFC.IFCWALLSTANDARDCASE||typeClassifiedId===WEBIFC.IFCWALLELEMENTEDCASE){
            if(isValuePresent(wallIdByLevel,classifiedId)){continue}
            else wallLevelArray.push(classifiedId)
            //console.log("pushedIdwalls",classifiedId)
          } else if(typeClassifiedId===WEBIFC.IFCWINDOW){
            if(isValuePresent(windowIdByLevel,classifiedId)){continue}
            else windowLevelArray.push(classifiedId)
            //console.log("pushedIdwindow",classifiedId)
          } else if(typeClassifiedId===WEBIFC.IFCSLAB||typeClassifiedId===WEBIFC.IFCCOVERING){
            //if(isValuePresent(floorIdList,classifiedId)){return}
            floorLevelArray.push(classifiedId)
            //console.log("pushedIdfloor",classifiedId)
          } else if(typeClassifiedId===WEBIFC.IFCROOF){
            //if(isValuePresent(roofIdList,classifiedId)){return}
            roofLevelArray.push(classifiedId)
            //console.log("pushedIdroof",classifiedId)
          } else{console.log("notfound")}
        }
    }
    if (wallLevelArray.length===0){
      delete wallIdByLevel[wallLevelArray]
    } else if (windowIdByLevel[level].length===0){
      delete windowIdByLevel[level]
    } else if (floorLevelArray.length===0){
      console.log("this is empty!")
      delete floorIdByLevel[floorLevelArray]
    } else if (roofLevelArray.length===0){
      delete roofIdByLevel[level]
    }
  }
}
// Entity props by Level
async function getEntityPropsByLevels(model:FragmentsGroup, obj:object){
  const properties = model.properties
  for (let level in obj){
    let levelArray= obj[level]
    //Define all arrays inside objects
    let wallEntitiesLevelArray: ModelEntity[] = [];
    let windowEntitiesLevelArray: ModelEntity[] = [];
    let floorEntitiesLevelArray: ModelEntity[] = [];
    let roofEntitiesLevelArray: ModelEntity[] = [];

    wallEntitiesByLevel[level]=wallEntitiesLevelArray
    windowEntitiesByLevel[level]=windowEntitiesLevelArray
    floorEntitiesByLevel[level]=floorEntitiesLevelArray
    roofEntitiesByLevel[level]=roofEntitiesLevelArray

    for (let id in levelArray){
      let modelEntityPset={}
      let modelEntity: ModelEntity = { key: levelArray[id], Attributes: { GlobalId: "", Name: "", Tag: "" }, modelEntityPset };
      const expressID= levelArray[id]
      if(properties === undefined|| null){return} 
       //Insert the expressID as a key
      modelEntity["key"]= expressID
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
      else if(idType === WEBIFC.IFCWINDOW){windowEntitiesLevelArray.push(modelEntity)}
      else if(idType === WEBIFC.IFCSLAB || idType === WEBIFC.IFCCOVERING){floorEntitiesLevelArray.push(modelEntity)}
      else if(idType === WEBIFC.IFCROOF){roofEntitiesLevelArray.push(modelEntity)}

     // if(wallEntitiesLevelArray.length === 0){delete wallEntitiesByLevel[level]}
     // if(windowEntitiesLevelArray.length === 0){delete windowEntitiesByLevel[level]}
     // if(floorEntitiesLevelArray.length === 0){delete floorEntitiesByLevel[level]}
     // if(roofEntitiesLevelArray.length === 0){delete roofEntitiesByLevel[level]}
    }
  }
}
///////////////
function getEntityIds(obj: any):any []| undefined {
  for (let ifcType in obj.entities) {
    if(ifcType=='IFCWALL'||ifcType==="IFCWALLSTANDARDCASE"){
      const ifcWall=( obj.entities[ifcType]);
      for (let entitiesWall in ifcWall){
        let idSetWall=ifcWall[entitiesWall]
        for (let wallValue of idSetWall){
          const wallValueNum:number = parseInt(wallValue)
          
          wallIdArray.push(wallValueNum)
        }
      }
    }
    if(ifcType=='IFCWINDOW'){
      const ifcWindow= (obj.entities[ifcType]);
      for (let entitiesWindow in ifcWindow){
        let idSetWindow= ifcWindow[entitiesWindow]
        for (let windowValue of idSetWindow){
          const windowValueNum:number = parseInt(windowValue)
          windowIdArray.push(windowValueNum)
        }
      }
    }
    if(ifcType=='IFCSLAB'){
      const ifcSlab= (obj.entities[ifcType]);
      for (let entitiesFloor in ifcSlab){
        let idSetSlab= ifcSlab[entitiesFloor]
        for (let slabValue of idSetSlab){
          const slabValueNum:number = parseInt(slabValue)
          floorIdArray.push(slabValueNum)
        }
      }
    }
  }
  //Elementos
  //console.log("Muros en el modelo", wallIdArray)
  return wallIdArray.length > 0 ? wallIdArray: undefined; // Return undefined if 'IFCWALL' entity type is not found
}
///////////////////
const classifier = new OBC.FragmentClassifier(viewer)
//Clipper
const clipper = new OBC.EdgesClipper(viewer);
clipper.enabled = true;
const styler = new OBC.FragmentClipStyler(viewer);
await styler.setup();
const toolbar = new OBC.Toolbar(viewer);
toolbar.name = "Main toolbar";
viewer.ui.addToolbar(toolbar);
const stylerButton = styler.uiElement.get("mainButton");
//Logic to clipper
window.ondblclick = () => {
  clipper.create();
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Load fragments
function disposeFragments(){
  fragments.dispose
}
async function loadIfcAsFragments(ifcModelFile) {
  const file = await fetch(ifcModelFile);
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const model = await ifcLoader.load(buffer, file.url);
  scene.add(model);
  const properties= model.properties 
  highlighter.update()
  //Classify the entities
  classifier.byStorey(model)
  const objProp = classifier.get()
  //This functions returns the express Ids of the walls
  await getEntityIds(objProp)
  getEntityIdsByLevel(model, objProp)
  //getEntityIdsByLevelByType(model,objProp)
  //
  await wallIdArray,floorIdArray,windowIdArray
  await getEntityPropsByLevels(model,windowIdByLevel)
  await getEntityPropsByLevels(model,modelEntitiesIdByLevel)
  console.log("walls",wallEntitiesByLevel)
  console.log("floors",floorEntitiesByLevel)
  console.log("windows", windowEntitiesByLevel)
  console.log("roofs", roofEntitiesByLevel)
  
  if(properties===undefined){return}
}
function ifcLoadEvent(event){
  disposeFragments()
  let buttonId = event.target.id
  let phase= projectPhasesArray.find(phase=> phase.id===parseInt(buttonId))
  if(phase){
    let ifcModel= phase.ifcModel
    loadIfcAsFragments(ifcModel)
    console.log("IFC successfully loaded")
  } else{
    console.log ("Not found")
  }
}
const phasesBtns = document.querySelectorAll('.phase')
function printId(event){
  let buttonId = event.target.id
  console.log(buttonId)
}
phasesBtns.forEach(button=>{
  button.addEventListener("click",ifcLoadEvent)
});

