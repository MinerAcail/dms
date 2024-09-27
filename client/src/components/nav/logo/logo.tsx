import { NavLink} from "react-router-dom";
import "./logo.scss";
import { useAuth } from "@/middleware/context/authContext";
import envlogo from "../../../assets/envcare.png";

const Logo = () => {
 
  const { isAuthenticated} = useAuth();
  return (
    <NavLink
      onClick={() => {
        {
        }
      }}
      className="logo mx-2"
      to={"/"}
    >
       
      {isAuthenticated && <div className="flex">
      <img src={envlogo} alt="Logo" className="w-24 h-auto "
      style={{
        marginRight:10
      }}
      />
        <h1 className="text-slate-900  flex"> <h1 className="text-indigo-600 ">env</h1>Care</h1> 
      
      </div>}
    </NavLink>
  );
};

export default Logo;
