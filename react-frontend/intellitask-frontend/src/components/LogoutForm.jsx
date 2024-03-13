import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;

      const handleLogout = async () => {
        try {
          await fetch('http://127.0.0.1:8000/api/logout/', {
            method: 'POST',
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`,
            },
          });

          localStorage.removeItem('token');
          navigate('/');
        } catch (error) {
          console.error('Error logging out: ', error);
        }
      };

      handleLogout();
    }
  }, [navigate]);

  return null;
};

export default Logout;