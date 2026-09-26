import { useAuthContext } from '../features/auth/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};

