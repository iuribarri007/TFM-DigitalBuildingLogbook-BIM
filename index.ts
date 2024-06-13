import * as THREE from "three"
import * as OBC from "openbim-components"
import * as WEBIFC from "web-ifc"
import { FragmentsGroup } from "bim-fragment"
import { Fragment } from "bim-fragment"
import { exp, or } from "three/examples/jsm/nodes/Nodes.js"
//
import { projectPhasesArray} from './infoProject'
import { ViewHelper } from "three/examples/jsm/helpers/ViewHelper.js"

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

//modelEntities
const wallArray:any=[];
const windowArray:any=[];
const floorArray:any=[];
const roofArray:any=[];

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
//external
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
const externalWallsByLevel:any={};
const externalWindowsByLevel:any={};
const externalFloorsByLevel:any={};
const externalRoofsByLevel:any={};

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
function getExternalEntitiesByLevel (...objs: any){
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

///////////////


//Clipper
const clipper = new OBC.EdgesClipper(viewer);
clipper.enabled = true;
const styler = new OBC.FragmentClipStyler(viewer);
await styler.setup();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Load fragments
function disposeFragments(){
  fragments.dispose
}
//Adding properties proccessor
const propertiesProcessor= new OBC.IfcPropertiesProcessor(viewer)
highlighter.events.select.onClear.add(()=>{
  propertiesProcessor.cleanPropertiesList()
})
//Adding Classifies
const classifier = new OBC.FragmentClassifier(viewer)
const classificationWindow= new OBC.FloatingWindow(viewer)
classificationWindow.visible=false
viewer.ui.add(classificationWindow)
classificationWindow.title="Model Tree"
const classificationsBtn = new OBC.Button(viewer)
classificationsBtn.materialIcon ="account_tree"

//Logic
classificationsBtn.onClick.add(() => {
  classificationWindow.visible =!classificationWindow.visible
  classificationWindow.active = classificationWindow.visible
})

//ToolBar
const toolbar = new OBC.Toolbar(viewer);
toolbar.addChild(
  classificationsBtn,
  propertiesProcessor.uiElement.get("main")
)
toolbar.name = "Main toolbar";
viewer.ui.addToolbar(toolbar);


//
const stylerButton = styler.uiElement.get("mainButton");
//Logic to clipper
window.ondblclick = () => {
  clipper.create();
}

//Create model tree
async function createModelTree(){
  const fragmentTree= new OBC.FragmentTree(viewer)
  await fragmentTree.init()
  await fragmentTree.update(["storeys","entities"])
  const tree = fragmentTree.get().uiElement.get("tree")
  //Hover and Select elements in tree 
  fragmentTree.onHovered.add((fragmentMap)=>{
    highlighter.highlightByID("hover",fragmentMap)
  })
  fragmentTree.onSelected.add((fragmentMap)=>{
    highlighter.highlightByID("select",fragmentMap)
  })
 return tree 
}
async function loadIfcAsFragments(ifcModelFile) {
  const file = await fetch(ifcModelFile);
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const model = await ifcLoader.load(buffer, file.url);
  scene.add(model);
  const properties= model.properties 
  if(properties===undefined){return}
  highlighter.update()
  //PropertiesProcessor
  propertiesProcessor.process(model)
  highlighter.events.select.onHighlight.add((fragmentMap)=>{
    const expressID= [...Object.values(fragmentMap)[0]][0]
    propertiesProcessor.renderProperties(model,Number(expressID))

  })
  
  
  //Classify the entities manually
  classifier.byStorey(model)
  const objProp = classifier.get()
  classifier.byStorey(model)
  classifier.byEntity(model)

  //Adding Classification Tree
  const tree = await createModelTree()
  await classificationWindow.slots.content.dispose(true)
  classificationWindow.addChild(tree)
  

  //This functions returns the express Ids of the walls
  await getEntityIdsByLevel(model, objProp)
  //getEntityIdsByLevelByType(model,objProp)
  //
  await wallIdArray,floorIdArray,windowIdArray
  await getEntityPropsByLevels(model,modelEntitiesIdByLevel)
  console.log("ALLwalls",wallEntitiesByLevel)
  console.log("Allfloors",floorEntitiesByLevel)
  console.log("Allwindows", windowEntitiesByLevel)
  console.log("Allroofs", roofEntitiesByLevel)
  //
 

  await getExternalEntitiesByLevel(wallEntitiesByLevel,windowEntitiesByLevel)
 
  console.log("ExternalWalls",externalWallsByLevel)
  console.log("ExternalWindows",externalWindowsByLevel)
  //console.log("externalFloors",externalFloorsByLevel)
  //console.log("ExternalRoofs",externalFloorsByLevel)
  
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

