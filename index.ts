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
let wallIdArray: any= [];
let windowIdArray:any=[];
let floorIdArray:any=[];

//modelEntities
let wallArray:any=[];
let windowArray:any=[];
let floorArray:any=[];


interface entityPset{
  id:number;
  name:string;
  values:{}
}
interface entityPsetProps{
  id:string
}

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

//getting the elements of the model with the psets and properties

async function getEntityProperties(model: FragmentsGroup, array: number[]) {
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
            //console.log(set)
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
          //OBC.IfcPropertiesUtils.getPsetProps(
          //  properties,
          //  setID,
          //  (propID) =>{
          //    let entityProps= properties[propID]; 
          //    const entityPropName= entityProps.Name.value;
          //    const entityPropValue= entityProps.NominalValue.value;
          //    //modelEntityPset.modelEntityPsetValue[entityPropName]=entityPropValue
          //      //const pName= properties[propID].Name.value
          //      //const pValue= properties[propID].NominalValue.value
          //      //modelEntityPsetValue[pName]=pValue
          //    //modelEntityPsetValue[entityPropName]
          //    //console.log(expressID,setID,propID,entityPropName,entityPropValue)//ESTE ESTÁ BIEN          
          //)
          
        }
      else {return}  
      }
    )

        wallArray.push(modelEntity)
      }
      console.log(wallArray)
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
  console.log(properties)
  highlighter.update()
  //Classify the entities
  classifier.byEntity(model)
  classifier.byStorey(model)
  const objProp = classifier.get()
  await objProp
  console.log(objProp)
  //This functions returns the express Ids of the walls
  await getEntityIds(objProp)
  await wallIdArray,floorIdArray,windowIdArray
  console.log(wallIdArray)
  await getEntityProperties(model, wallIdArray)
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


