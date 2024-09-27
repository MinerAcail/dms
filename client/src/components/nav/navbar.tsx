// import { Button } from "../ui/button";
import Logo from "./logo/logo";
import "./style.scss";
import { useState, useEffect } from "react";
import { NavigationMenuDemo } from "./MenuDemo";
import { useAuth } from "@/middleware/context/authContext";
import { SideNavi } from "./sidenavi";

const Navbar = () => {
  const { user } = useAuth();
  const Admin = user?.types === "Admin";
  const subChurch = user?.types === "subChurch";

  const subLeader = user?.types === "SubLeader";
  const Leader = user?.types === "Leader";

  const [refreshTime, setRefreshTime] = useState(new Date());

  useEffect(() => {
    const handleRefresh = () => {
      setRefreshTime(new Date());
    };

    window.addEventListener("beforeunload", handleRefresh);

    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
    };
  }, []);

  return (
    <div className="navbar relative px-10">
      <Logo />

      <>
        {subLeader || Leader ? <SideNavi /> : <NavigationMenuDemo />}
        { (Admin || subChurch) && (
  <div className="links time hidden md:block">
      {user?.name} {" "}
    {/* Last Refresh Time: {refreshTime.toLocaleTimeString()} */}

  </div>
)}
      </>
    </div>
  );
};

export default Navbar;
