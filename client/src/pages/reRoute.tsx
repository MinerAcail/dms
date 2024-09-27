import "../assets/styles/style.scss";
import "../App.scss";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/middleware/context/authContext";

function Commonroute() {
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    // Check user?.types and navigate them to their respective routes
    if (user?.types === 'Leader') {
      navigate('/grouplist');
    } else if (user?.types === 'SubLeader') {
      navigate('/grouplist');
    } else if (user?.types === 'Admin') {
      navigate('/');
    }else if (user?.types === 'subChurch') {
      navigate('/');
    }else {
      // Handle other user types or navigate to a default route
      navigate('/default-route');
    }
  }, [user, navigate]);

  // No JSX content is returned since it's just for navigation logic
  return null;
}

export default Commonroute;


