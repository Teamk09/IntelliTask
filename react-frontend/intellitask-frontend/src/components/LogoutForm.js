import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await fetch('http://127.0.0.1:8000/api/logout/', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });

        navigate("/login");
      } catch (error) {
        console.error("Error logging out: ", error);
      }
    }

    handleLogout(); // Call the logout function immediately
  }, [navigate]);

  return null;
};

export default Logout;
