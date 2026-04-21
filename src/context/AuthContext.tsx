import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../api/auth';
import type { UsuarioInfo } from '../api/auth';

interface AuthContextType {
  user: UsuarioInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dni: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAdmin: boolean;
  isGerente: boolean;
  isOperador: boolean;
  canConfirmar: boolean;
  canRechazar: boolean;
  canAnular: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'inmogestor_token';
const USER_KEY = 'inmogestor_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (dni: string, password: string) => {
    try {
      const response = await authService.login(dni, password);
      
      if (response.success && response.token && response.usuario) {
        const usuarioInfo: UsuarioInfo = {
          usuarioId: response.usuario.usuarioId,
          dni: response.usuario.dni,
          nombre: response.usuario.nombre,
          apellido: response.usuario.apellido,
          rolNombre: response.usuario.rolNombre
        };
        
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(usuarioInfo));
        
        setToken(response.token);
        setUser(usuarioInfo);
        
        return { success: true, message: 'Login exitoso' };
      }
      
      return { success: false, message: response.mensaje || 'Error al iniciar sesión' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error de conexión';
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    authService.logout().catch(() => {});
  }, []);

  const isAdmin = user?.rolNombre === 'Superior';
  const isGerente = user?.rolNombre === 'Superior';
  const isOperador = user?.rolNombre === 'Operador';
  const canConfirmar = isAdmin || isGerente;
  const canRechazar = isAdmin || isGerente;
  const canAnular = isAdmin || isGerente;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        isAdmin,
        isGerente,
        isOperador,
        canConfirmar,
        canRechazar,
        canAnular,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
