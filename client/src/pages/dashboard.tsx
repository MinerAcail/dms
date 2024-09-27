import PieChartExample from "@/components/graphs/pie";
import { useState } from "react";
import "../assets/styles/style.scss";
import PieChart from "@/components/graphs/pieChart";
import SubsPieChart from "@/components/graphs/subsPieChart";
import { useAuth } from "@/middleware/context/authContext";

export default function Dashboard({}) {
  const { user } = useAuth();

  const Admin = user?.types === "Admin";
  const subChurch = user?.types === "subChurch";

  const [isHidden, setIsHidden] = useState(true); // Initialize the state as hidden
  const [isHiddenPie, setIsHiddenPie] = useState(true); // Initialize the state as hidden

  const toggleVisibility = () => {
    console.log("Toggle visibility");

    // setIsHidden((prevIsHidden: any) => !prevIsHidden);
    setIsHiddenPie((prevIsHidden: any) => !prevIsHidden);
  };
  const toggleVisibilityPic = () => {
    console.log("Toggle visibility");

    setIsHidden((prevIsHidden: any) => !prevIsHidden);
    // setIsHiddenPie((prevIsHidden: any) => !prevIsHidden);
  };
  return (
    <div className="section grid grid-cols-2">
      {Admin && (
        <>
          {isHidden && (
            <div className={`_divSm  ${!isHiddenPie ? "w-10/12" : "w-5/12"}`}>
              <PieChartExample
                outerRadius={!isHiddenPie ? 200 : 170}
                cx={!isHiddenPie ? "30%" : "50%"}
                outerRadius1={!isHidden ? 150 : 155}
                cx1={!isHidden ? "55%" : "65%"}
                toggleVisibility={toggleVisibility}
                isHidden={!isHiddenPie}
              />
            </div>
          )}
          {isHiddenPie && (
            <div
              className={`_divLg ${!isHidden? "w-10/12" : "w-8/12"}`}
            >
              <PieChart
                toggleVisibility={toggleVisibilityPic}
                isHidden={!isHidden}
              />
            </div>
          )}
        </>
      )}

      {subChurch && (
        <div className={`_divLg  w-10/12 `}>
          <SubsPieChart
            toggleVisibility={toggleVisibilityPic}
            // isHidden={!isHidden}
          />
        </div>
      )}
    </div>
  );
}
