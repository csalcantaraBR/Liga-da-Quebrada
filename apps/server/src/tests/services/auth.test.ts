import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../../services/auth';
import { User, AuthCredentials, RegisterData, AuthResponse } from '../../types/auth';

// Mock do JWT
vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
    sign: vi.fn(() => 'mock.jwt.token'),
    TokenExpiredError: class extends Error {
      name = 'TokenExpiredError';
      message = 'jwt expired';
    }
  },
  verify: vi.fn(),
  sign: vi.fn(() => 'mock.jwt.token'),
  TokenExpiredError: class extends Error {
    name = 'TokenExpiredError';
    message = 'jwt expired';
  }
}));

// Mock do bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(() => Promise.resolve('$2a$10$hashedpassword')),
    compare: vi.fn(() => Promise.resolve(true))
  },
  hash: vi.fn(() => Promise.resolve('$2a$10$hashedpassword')),
  compare: vi.fn(() => Promise.resolve(true))
}));

// Mock do Supabase
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();

const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: mockSelect.mockReturnValue({
      eq: mockEq.mockReturnValue({
        single: mockSingle
      })
    }),
    insert: mockInsert.mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: mockSingle
      })
    }),
    update: mockUpdate.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: mockSingle
        })
      })
    })
  }))
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient)
}));

describe('AuthService', () => {
  let authService: AuthService;
  const mockUser: User = {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: new Date('2024-01-01'),
    lastActive: new Date()
  };

  beforeEach(() => {
    authService = new AuthService();
    vi.clearAllMocks();
    
    // Reset mocks para estado padrão
    mockSingle.mockResolvedValue({ data: null, error: null });
    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null })
    });
  });

  describe('Registro de Usuário', () => {
    it('should register a new user successfully', async () => {
      const registerData: RegisterData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };

      // Mock para verificar se email não existe
      mockSingle.mockResolvedValueOnce({ data: null, error: null });
      
      // Mock para criar usuário
      mockSingle.mockResolvedValueOnce({ 
        data: { 
          id: 'user-1', 
          username: 'newuser', 
          email: 'new@example.com',
          created_at: new Date().toISOString()
        }, 
        error: null 
      });

      const result = await authService.register(registerData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user!.username).toBe('newuser');
      expect(result.user!.email).toBe('new@example.com');
      expect(result.token).toBeDefined();
    });

    it('should fail registration with invalid email', async () => {
      const registerData: RegisterData = {
        username: 'newuser',
        email: 'invalid-email',
        password: 'password123'
      };

      const result = await authService.register(registerData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email inválido');
    });

    it('should fail registration with weak password', async () => {
      const registerData: RegisterData = {
        username: 'newuser',
        email: 'new@example.com',
        password: '123'
      };

      const result = await authService.register(registerData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Senha deve ter pelo menos 6 caracteres');
    });

    it('should fail registration with existing email', async () => {
      const registerData: RegisterData = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123'
      };

      // Mock para email já existente
      mockSingle.mockResolvedValueOnce({ 
        data: { id: 'existing-user' }, 
        error: null 
      });

      const result = await authService.register(registerData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email já cadastrado');
    });
  });

  describe('Login de Usuário', () => {
    it('should login user successfully', async () => {
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock para buscar usuário
      mockSingle.mockResolvedValueOnce({ 
        data: { 
          id: 'user-1', 
          username: 'testuser', 
          email: 'test@example.com',
          password: '$2a$10$hashedpassword', // Senha hasheada
          created_at: new Date().toISOString()
        }, 
        error: null 
      });

      const result = await authService.login(credentials);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user!.email).toBe('test@example.com');
      expect(result.token).toBeDefined();
    });

    it('should fail login with invalid credentials', async () => {
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Mock para usuário existente mas senha errada
      mockSingle.mockResolvedValueOnce({ 
        data: { 
          id: 'user-1', 
          username: 'testuser', 
          email: 'test@example.com',
          password: '$2a$10$hashedpassword', // Senha hasheada diferente
          created_at: new Date().toISOString()
        }, 
        error: null 
      });

      // Mock bcrypt.compare para retornar false (senha errada)
      const bcrypt = await import('bcryptjs');
      vi.mocked(bcrypt.default.compare).mockResolvedValueOnce(false);

      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Credenciais inválidas');
    });

    it('should fail login with non-existent email', async () => {
      const credentials: AuthCredentials = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      // Mock para usuário não encontrado
      mockSingle.mockResolvedValueOnce({ 
        data: null, 
        error: { message: 'User not found' } 
      });

      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Usuário não encontrado');
    });
  });

  describe('Validação de Token', () => {
    it('should validate valid token', async () => {
      const validToken = 'valid.jwt.token';

      // Mock JWT verify para token válido
      const jwt = await import('jsonwebtoken');
      vi.mocked(jwt.default.verify).mockReturnValueOnce({
        userId: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      } as any);

      // Mock para buscar usuário
      mockSingle.mockResolvedValueOnce({ 
        data: { 
          id: 'user-1', 
          username: 'testuser', 
          email: 'test@example.com',
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        }, 
        error: null 
      });

      const result = await authService.validateToken(validToken);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
    });

    it('should fail validation with invalid token', async () => {
      const invalidToken = 'invalid.token';

      // Mock JWT verify para token inválido
      const jwt = await import('jsonwebtoken');
      vi.mocked(jwt.default.verify).mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      const result = await authService.validateToken(invalidToken);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Token inválido');
    });

    it('should fail validation with expired token', async () => {
      const expiredToken = 'expired.jwt.token';

      // Mock JWT verify para token expirado
      const jwt = await import('jsonwebtoken');
      vi.mocked(jwt.default.verify).mockImplementationOnce(() => {
        const error = new jwt.default.TokenExpiredError();
        throw error;
      });

      const result = await authService.validateToken(expiredToken);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Token expirado');
    });
  });

  describe('Atualização de Perfil', () => {
    it('should update user profile successfully', async () => {
      const userId = 'user-1';
      const updates = {
        username: 'updateduser',
        lastActive: new Date()
      };

      // Mock para verificar se usuário existe
      mockSingle.mockResolvedValueOnce({ 
        data: { 
          id: 'user-1', 
          username: 'olduser', 
          email: 'test@example.com',
          created_at: new Date().toISOString()
        }, 
        error: null 
      });
      
      // Mock para atualizar usuário
      mockSingle.mockResolvedValueOnce({ 
        data: { 
          id: 'user-1', 
          username: 'updateduser', 
          email: 'test@example.com',
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        }, 
        error: null 
      });

      const result = await authService.updateProfile(userId, updates);

      expect(result.success).toBe(true);
      expect(result.user!.username).toBe('updateduser');
    });

    it('should fail update with invalid user ID', async () => {
      const userId = 'invalid-user-id';
      const updates = {
        username: 'updateduser'
      };

      // Mock para usuário não encontrado
      mockSingle.mockResolvedValueOnce({ 
        data: null, 
        error: { message: 'User not found' } 
      });

      const result = await authService.updateProfile(userId, updates);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Usuário não encontrado');
    });
  });

  describe('Logout', () => {
    it('should logout user successfully', async () => {
      const userId = 'user-1';

      const result = await authService.logout(userId);

      expect(result.success).toBe(true);
    });
  });
});
