import ifcopenshell
import os
#Path to the file
#Load the Ifc file

model = ifcopenshell.open('TFM.ifc')

wall_types = model.by_type("IfcWallType")
constituent_sets = model.by_type("IfcMaterialConstituentSet")
material_constituents = model.by_type("IfcMaterialConstituentSet")
#for wall_type in wall_types:
#    print (wall_type)
for constituent_set in constituent_sets:
    print (constituent_set)