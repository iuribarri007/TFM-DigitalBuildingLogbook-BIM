// IFC properties to table logic//
import { a2 } from "./indexDBLStructure";
import { a3 } from "./indexDBLStructure";
import { Button } from "openbim-components";
import { func } from "three/examples/jsm/nodes/Nodes.js";
//Add event listener//

interface Subcategory {
  subCategory: string;
  subcategoryIndicators: { subcatIndicatorName: string }[];
}
  function generateTable(array: Subcategory[]) {
    
    const tableSectionBody = document.getElementById("tableSection-body") as HTMLElement;
    const templateTableSection = document.getElementById("tableSectionDemo") as HTMLElement;
  
    array.forEach((subcategory) => {
      const tableSection = templateTableSection.cloneNode(true) as HTMLElement;
      const subcategoryButton = tableSection.querySelector(".tableSubcategory") as HTMLElement;
      const table = tableSection.querySelector(".tableComplete") as HTMLElement;
      const headerRow = table.querySelector(".tableRow") as HTMLElement;

      // Add a default header cell
      const defaultHeader = document.getElementById("tableIndicatorDemo") as HTMLElement;
      headerRow.appendChild(defaultHeader);
  
      // Add subcategory indicator names as additional headers
      subcategory.subcategoryIndicators.forEach((indicator) => {
        const indicatorHeader = defaultHeader.cloneNode(true) as HTMLElement;
        indicatorHeader.id = "";
        indicatorHeader.textContent = indicator.subcatIndicatorName;
        headerRow.appendChild(indicatorHeader);
      });
  
      // You can continue to customize the table structure as needed
      subcategoryButton.textContent = subcategory.subCategory;
      tableSectionBody.appendChild(tableSection);
      
    });
    const existingSection = document.getElementById("tableSectionDemo") as HTMLElement;
    existingSection.remove();
    const existingIndicator = document.getElementById("tableIndicatorDemo") as HTMLElement;
    existingIndicator.remove();
  }

generateTable(a2)


