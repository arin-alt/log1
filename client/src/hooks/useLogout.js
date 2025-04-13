import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

export const useLogout = () => {
  const navigate = useNavigate();
  
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      });
      
      localStorage.removeItem('userData');
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  return { logout };
};