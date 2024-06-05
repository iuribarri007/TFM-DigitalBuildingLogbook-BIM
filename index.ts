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
const wallEntitiesByLevel={}
const windowEntitiesByLevel={}
const floorEntitiesByLevel={}
const roofEntitiesByLevel={}
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
//Sorting the IDs by type and level
async function getEntityIdsByLevel(model: FragmentsGroup, obj:any){
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
          if (typeClassifiedId===WEBIFC.IFCWALL||typeClassifiedId===WEBIFC.IFCWALLSTANDARDCASE||typeClassifiedId===WEBIFC.IFCWALLELEMENTEDCASE||typeClassifiedId===WEBIFC.IFCWALLELEMENTEDCASE){
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
  const props = model.properties
  for (let level in obj){
    //
    let levelIdArray= obj[level]
    //Define all arrays inside objects
    let wallLevelPropsArray=[]
    let windowLevelPropsArray=[]
    let floorLevelPropsArray=[]
    let roofLevelPropsArray=[]
    wallEntitiesByLevel[level]=wallLevelPropsArray
    windowEntitiesByLevel[level]=windowLevelPropsArray
    floorEntitiesByLevel[level]=floorLevelPropsArray
    roofEntitiesByLevel[level]=roofLevelPropsArray
    //
    for (let id in levelIdArray){
      let modelEntityPset={}
      let modelEntity={modelEntityPset}
      const expressID= levelIdArray[id]
      if(props === undefined|| null){return} 
       //Insert the expressID as a key
      modelEntity["key"]= expressID
      //Define the atributes
      const idProperties= props[expressID];
      const attributes= "Attributes"
      modelEntity[attributes]={
        "GlobalId": idProperties.GlobalId.value,
        "Name":idProperties.Name.value,
        //"PredefinedType":idProperties.PredefinedType.value,
        "Tag": idProperties.Tag.value,
      }
      //console.log(modelEntity)
      let idProps= props[expressID]
      let idType= idProps.type
      //Condicional para pushearlo en diferentes arrays
      OBC.IfcPropertiesUtils.getRelationMap(
        props,
        WEBIFC.IFCRELDEFINESBYPROPERTIES,
        (setID, relatedIDs)=>{
          const set = props[setID]
          const workingIDs= relatedIDs.filter(id => id===expressID)
          if( set.type===WEBIFC.IFCPROPERTYSET && workingIDs.length!==0){
            console.log("This is a set",set)
            if(set.HasProperties.length!==0){
              let modelEntityPsetValue ={}
              let modelEntityPsetKey= props[set.expressID].Name.value
              modelEntity[modelEntityPsetKey] = {
                "id": set.expressID,
                "name":props[set.expressID].Name.value,
                }
                for (let p in set.HasProperties){
                  if(set.HasProperties.length>0){
                    const pId= set.HasProperties[p].value
                    const pName= props[pId].Name.value
                    const pValue= props[pId].NominalValue.value
                    modelEntityPsetValue[pName]=pValue
                  }
                }
          
            }  
          }
        }
      )
      
    }
  }
  console.log("This is the object",wallEntitiesByLevel)
}
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
async function loadIfcAsFragments(ifcModelFile) {
  const file = await fetch(ifcModelFile);
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const model = await ifcLoader.load(buffer, file.url);
  scene.add(model);
  const properties= model.properties 
  //console.log(properties)
  highlighter.update()
  //Classify the entities
  classifier.byStorey(model)
  classifier.byEntity(model)
  const objProp = classifier.get()
  //console.log(objProp)
  //This functions returns the express Ids of the walls
  await getEntityIdsByLevel(model,objProp)
  await wallIdArray,floorIdArray,windowIdArray
  //await getEntityPropsByLevels(model,wallIdList)
  await getEntityPropsByLevels(model,wallIdByLevel)
  /// prueba
  if(properties===undefined){return}
  //console.log("walls:",wallIdByLevel)
  //console.log("windows",windowIdByLevel)
  //console.log("floors",floorIdByLevel)
  //console.log("roofs:",roofIdByLevel)
  //extractMaterial(model,wallExample)
}
function ifcLoadEvent(event){
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


