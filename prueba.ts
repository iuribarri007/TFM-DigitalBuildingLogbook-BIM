 //sync function getEntityProperties(model: FragmentsGroup, array: number[]) {
 //     const properties = await model.properties;
 //     
 //     for (let id in array) {
 //       let modelEntityPsetValue ={}
 //       let modelEntity = {}
 //       //Defining the expressID of the element being proccesses
 //       const expressID = array[id]
 //       if(properties === undefined|| null){return}
 //       //Insert the expressID as a key
 //       modelEntity["key"]= expressID
 //       //Define the atributes which are contained in the elements
 //       const idProperties= properties[expressID];
 //       const attributes= "Attributes"
 //       modelEntity[attributes]={
 //         "GlobalId": idProperties.GlobalId.value,
 //         "Name":idProperties.Name.value,
 //         "PredefinedType":idProperties.PredefinedType.value,
 //         "Tag": idProperties.Tag.value,
 //       }
 //       
 //       //getting the relation map with "IfcRelDefinesByProperties", the Pset
 //       OBC.IfcPropertiesUtils.getRelationMap(
 //         properties,
 //         WEBIFC.IFCRELDEFINESBYPROPERTIES,
 //         (setID, relatedIDs)=>{
 //           const set = properties[setID]
 //           const workingIDs= relatedIDs.filter(id => id===expressID)
 //           if( set.type===WEBIFC.IFCPROPERTYSET && workingIDs.length!==0){
 //             for (let i in set){
 //               if(set.HasProperties.length!==0){
 //                 //console.log(set)
 //                 let modelEntityPsetKey= properties[set.expressID].Name.value
 //                 modelEntity[modelEntityPsetKey] = {
 //                   "id": set.expressID,
 //                   "name":properties[set.expressID].Name.value,
 //                   modelEntityPsetValue
 //                   }
 //               }
 //               for (let p in set.HasProperties){
 //                 const pId= set.HasProperties[p].value
 //                 const pName= properties[pId].Name.value
 //                 const pValue= properties[pId].NominalValue.value
 //                 modelEntityPsetValue[pName]=pValue
 //                 console.log(expressID,setID,pId,pName,pValue)
 //   
 //                 
 //               }
 //               
 //             }  
 //           }
 //         else {return}  
 //         }
 //       )
 //         
 //           wallArray.push(modelEntity)
 //         }
 //         console.log(wallArray)
 //      }
 //      