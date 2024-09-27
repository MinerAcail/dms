import "../assets/styles/style.scss";
import "../App.scss";

import PAListComponent from "@/components/CareList/PAlist";
////////////////////////////////////////////////////////////////
function CallerList() {
 //try
  return (
    <div className="section justify-center ">
    <div className="_divLg  py-10">
      
      <PAListComponent />
    </div>
  </div>
  
  );
}

export default CallerList;





