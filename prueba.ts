/*/async function getEntityProperties(model: FragmentsGroup, array: any[]) {
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
     }/*/

     

////get the IDs of different types
//function getEntityIds(obj: any):any []| undefined {
//  for (let ifcType in obj.entities) {
//    if(ifcType=='IFCWALL'||ifcType==="IFCWALLSTANDARDCASE"){
//      const ifcWall=obj.entities[ifcType];
//      for (let entitiesWall in ifcWall){
//        let idSetWall=ifcWall[entitiesWall]
//        for (let wallValue of idSetWall){
//          const wallValueNum:number = parseInt(wallValue)
//          wallIdArray.push(wallValueNum)
//        }
//      }
//    }
//    if(ifcType=='IFCWINDOW'){
//      const ifcWindow= (obj.entities[ifcType]);
//      for (let entitiesWindow in ifcWindow){
//        let idSetWindow= ifcWindow[entitiesWindow]
//        for (let windowValue of idSetWindow){
//          const windowValueNum:number = parseInt(windowValue)
//          windowIdArray.push(windowValueNum)
//        }
//      }
//    }
//    if(ifcType=='IFCSLAB'){
//      const ifcSlab= (obj.entities[ifcType]);
//      for (let entitiesFloor in ifcSlab){
//        let idSetSlab= ifcSlab[entitiesFloor]
//        for (let slabValue of idSetSlab){
//          const slabValueNum:number = parseInt(slabValue)
//          floorIdArray.push(slabValueNum)
//        }
//      }
//    }
//  }
//  //Elementos
//  //console.log("Muros en el modelo", wallIdArray)
//  return wallIdArray.length > 0 ? wallIdArray: undefined; // Return undefined if 'IFCWALL' entity type is not found
//}

 /*/Prueba extractMaterial
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
      } )
    } 
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
  }/*/
//Adding a classifier
