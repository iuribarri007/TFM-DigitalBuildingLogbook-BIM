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
const wallIdList:any={}
const windowIdList:any={}
const floorIdList:any={}
const roofIdList:any={}
//modelEntities
const wallArray:any=[];
const windowArray:any=[];
const floorArray:any=[];
const roofArray:any=[];
//externalModelEntities
const externalWallArray:any=[];
const externalWindowArray:any=[];
const externalFloorArray:any=[];
const externalRoofArray:any=[];
/*/ for (let ifcType in obj.entities) {
    if(ifcType=='IFCWALL'||ifcType==="IFCWALLSTANDARDCASE"){
      const ifcWall=obj.entities[ifcType];
      for (let entitiesWall in ifcWall){
        let idSetWall=ifcWall[entitiesWall]
        for (let wallValue of idSetWall){
          const wallValueNum:number = parseInt(wallValue)/*/

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
    wallIdList[level]=wallLevelArray
    windowIdList[level]=windowLevelArray
    floorIdList[level]=floorLevelArray
    roofIdList[level]=roofLevelArray
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
            //if(isValuePresent(wallIdList,classifiedId)){return}
            wallLevelArray.push(classifiedId)
            //console.log("pushedIdwalls",classifiedId)
          } else if(typeClassifiedId===WEBIFC.IFCWINDOW){
            //if(isValuePresent(windowIdList,classifiedId)){return}
            windowLevelArray.push(classifiedId)
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
      delete wallIdList[wallLevelArray]
    } else if (windowIdList[level].length===0){
      delete windowIdList[level]
    } else if (floorLevelArray.length===0){
      console.log("this is empty!")
      delete floorIdList[floorLevelArray]
    } else if (roofLevelArray.length===0){
      delete roofIdList[level]
    }
  }
}


//get the IDs of different types
function getEntityIds(obj: any):any []| undefined {
  for (let ifcType in obj.entities) {
    if(ifcType=='IFCWALL'||ifcType==="IFCWALLSTANDARDCASE"){
      const ifcWall=obj.entities[ifcType];
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

//getting the elements of the model with the psets and properties
async function getEntityProperties(model: FragmentsGroup, array: any[]) {
  const properties = await model.properties;
  for (let id in array) {
    let modelEntityPset={}
    let modelEntity = {modelEntityPset}
    //Defining the expressID of the element being proccesses
    const expressID = array[id]
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
    //getting the relation map with "IfcRelDefinesByProperties", the Pset
    OBC.IfcPropertiesUtils.getRelationMap(
      properties,
      WEBIFC.IFCRELDEFINESBYPROPERTIES,
      (setID, relatedIDs)=>{
        const set = properties[setID]
        const workingIDs= relatedIDs.filter(id => id===expressID)
        if( set.type===WEBIFC.IFCPROPERTYSET && workingIDs.length!==0){
          //console.log(expressID,setID,set)
          if(set.HasProperties.length!==0){
            let modelEntityPsetValue ={}
            let modelEntityPsetKey= properties[set.expressID].Name.value
            modelEntity[modelEntityPsetKey] = {
              "id": set.expressID,
              "name":properties[set.expressID].Name.value,
              modelEntityPsetValue
              }
              for (let p in set.HasProperties){
                if(set.HasProperties.length>0){
                  const pId= set.HasProperties[p].value
                  const pName= properties[pId].Name.value
                  const pValue= properties[pId].NominalValue.value
                  modelEntityPsetValue[pName]=pValue
                }
              }
          }  
        }
      }
    )

        wallArray.push(modelEntity)
      }
   }
   //Prueba extractMaterial
   async function extractMaterial (model: FragmentsGroup, id :number){
    if(model.properties===undefined){return}
    const exampleProperties  = await model.properties;
    const idName= exampleProperties[id].ObjectType.value
    console.log(idName)
    OBC.IfcPropertiesUtils.getRelationMap(exampleProperties,WEBIFC.IFCRELDEFINESBYPROPERTIES,(idExample,relatedTypeId)=>{
      const workingIDs= relatedTypeId.filter(i => i===id)
      const setType= exampleProperties[idExample]
      if(setType.type=== WEBIFC.IFCELEMENTQUANTITY && workingIDs.length!==0){
      OBC.IfcPropertiesUtils.getQsetQuantities(exampleProperties,idExample,(qtoId)=>{
        console.log(exampleProperties[qtoId])
      } )
    }
      //}
      
    })
    //OBC.IfcPropertiesUtils.getRelationMap(exampleProperties,WEBIFC.IFCRELASSOCIATESMATERIAL,(idExample,relatedIds)=>{
    //  const workingIDs= relatedIds.filter(id => id===idExample)
    //  const set = exampleProperties[idExample]
    //  if(set.type===WEBIFC.IFCMATERIALLAYERSET|| set.type===WEBIFC.IFCMATERIALCONSTITUENTSET || set.type!== WEBIFC.IFCMATERIALCONSTITUENT && workingIDs.length!==0){
    //    const setName = set.Name.value
    //    if(setName){
    //      if(setName===idName){
    //        const materialArray = set.MaterialConstituents 
    //        console.log(materialArray)
    //        for (let m in materialArray){
    //          const mId= materialArray[m].value
    //          console.log(exampleProperties[mId])
    //        }
    //      }
    //    }
    //  }
    //})
  }
//Adding a classifier

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
  await objProp
  //console.log(objProp)
  //This functions returns the express Ids of the walls
  await getEntityIds(objProp)
  await getEntityIdsByLevel(model,objProp)
  await wallIdArray,floorIdArray,windowIdArray
  //await getEntityProperties(model, wallIdArray)
  if(properties===undefined){return}
  //console.log("walls:",wallIdList)
  //console.log("windows",windowIdList)
  //console.log("floors",floorIdList)
  //console.log("roofs:",roofIdList)
  const wallExample =(wallIdArray[2])
  console.log("wallProperties",properties[wallExample])
  extractMaterial(model,wallExample)
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


