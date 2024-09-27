import logo from "../../assets/vbcilog.png";
import Navbar from "@/components/nav/navbar";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="app-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="main-container">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
