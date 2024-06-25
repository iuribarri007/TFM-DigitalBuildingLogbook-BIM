import * as THREE from "three"
import * as OBC from "openbim-components"
import * as WEBIFC from "web-ifc"
import { FragmentsGroup } from "bim-fragment"
import { Fragment } from "bim-fragment"
import { exp, or } from "three/examples/jsm/nodes/Nodes.js"
import { ViewHelper } from "three/examples/jsm/helpers/ViewHelper.js"
//Local imports
import { projectPhasesArray} from "../infoProject"
//Local logic
import { wallEntitiesByLevel, dblEnvelopeWallElements, dblEnvelopeWindowElements, dblEnvelopeFloorElements, dblEnvelopeRoofElements } from "./getIFCProps"
import { floorEntitiesByLevel,windowEntitiesByLevel,roofEntitiesByLevel, } from "./getIFCProps"
import {modelFragmentIdByLevel} from "./getIFCProps"
//Import logic
import { getEntityFragmentsByLevel,getDblEntitiesByLevel,classifyEnvelope } from "./getIFCProps"
import { dblEnvelopeWalls,dblEnvelopeFloors, dblEnvelopeRoofs, dblEnvelopeWindows } from "./getIFCProps"
//
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
//

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
export async function loadIfcAsFragments(ifcModelFile) {
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
  //Get the fragmentIds and ExpressIds
  await getEntityFragmentsByLevel(model,objProp)
  //
  await getDblEntitiesByLevel(model,modelFragmentIdByLevel)
  //
  await classifyEnvelope(dblEnvelopeWallElements,dblEnvelopeFloorElements,dblEnvelopeRoofElements)

  //import { dblEnvelopeWalls,dblEnvelopeFloors, dblEnvelopeRoofs, dblEnvelopeWindows }

 
  //console.log(dblEnvelopeWallElements,dblEnvelopeWindowElements)

  //Adding Classification Tree
  const tree = await createModelTree()
  await classificationWindow.slots.content.dispose(true)
  classificationWindow.addChild(tree)
  
  //This functions returns the express Ids of the walls

  //getEntityIdsByLevelByType(model,objProp)
  //
  
  
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
