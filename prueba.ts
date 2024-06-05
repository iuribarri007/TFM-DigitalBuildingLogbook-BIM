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

//getting the elements of the model with the psets and properties
/*/
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
   /*/
