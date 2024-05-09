
interface ObjectPhaseInfo{
    id:number;
    year: number;
    description:string;
    ifcModel:any;

}
export const projectPhasesArray:ObjectPhaseInfo[]=[]

let phase0:ObjectPhaseInfo ={
    id:0,
    year:1955,
    description: "asdnasd",
    ifcModel: "ifc/00_PRUEBA.ifc"
}
let phase1:ObjectPhaseInfo ={
    id:1,
    year:2023,
    description: "asdnasd",
    ifcModel: "ifc/ARM-MAAB-ARM01-ZZZ-M3D-ARQ-ZZZ-TFM_custom.ifc"
}
let phase2:ObjectPhaseInfo ={
    id:2,
    year:2023,
    description: "asdnasd",
    ifcModel: "ifc/CENTRAL-LAN-ARQ_iniuribarri.ifc"
}
projectPhasesArray.push(phase0,phase1,phase2)
