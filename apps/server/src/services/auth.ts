import { createClient, SupabaseClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, AuthCredentials, RegisterData, AuthResponse, JWTPayload } from '../types/auth';

interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export class AuthService {
  private supabase: SupabaseClient;
  private jwtSecret: string;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || ''
    );
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret';
  }

  async register(data: RegisterData): Promise<AuthResult> {
    // Validação de email
    if (!this.isValidEmail(data.email)) {
      return { success: false, error: 'Email inválido' };
    }

    // Validação de senha
    if (data.password.length < 6) {
      return { success: false, error: 'Senha deve ter pelo menos 6 caracteres' };
    }

    // Verificar se email já existe
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', data.email)
      .single();

    if (existingUser) {
      return { success: false, error: 'Email já cadastrado' };
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Criar usuário
    const { data: newUser, error } = await this.supabase
      .from('users')
      .insert({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error || !newUser) {
      return { success: false, error: 'Erro ao criar usuário' };
    }

    // Gerar token JWT
    const token = this.generateToken(newUser);

    const user: User = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      createdAt: new Date(newUser.created_at),
      lastActive: new Date()
    };

    return { success: true, user, token };
  }

  async login(credentials: AuthCredentials): Promise<AuthResult> {
    // Buscar usuário por email
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', credentials.email)
      .single();

    if (error || !user) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    if (!isValidPassword) {
      return { success: false, error: 'Credenciais inválidas' };
    }

    // Gerar token JWT
    const token = this.generateToken(user);

    // Atualizar última atividade
    await this.supabase
      .from('users')
      .update({ last_active: new Date().toISOString() })
      .eq('id', user.id);

    const userData: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: new Date(user.created_at),
      lastActive: new Date()
    };

    return { success: true, user: userData, token };
  }

  async validateToken(token: string): Promise<AuthResult> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;
      
      // Buscar usuário no banco
      const { data: user, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        return { success: false, error: 'Token inválido' };
      }

      const userData: User = {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: new Date(user.created_at),
        lastActive: new Date(user.last_active)
      };

      return { success: true, user: userData };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return { success: false, error: 'Token expirado' };
      }
      return { success: false, error: 'Token inválido' };
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<AuthResult> {
    // Verificar se usuário existe
    const { data: existingUser, error: fetchError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError || !existingUser) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    // Atualizar usuário
    const { data: updatedUser, error } = await this.supabase
      .from('users')
      .update({
        username: updates.username,
        last_active: updates.lastActive?.toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error || !updatedUser) {
      return { success: false, error: 'Erro ao atualizar perfil' };
    }

    const userData: User = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      createdAt: new Date(updatedUser.created_at),
      lastActive: new Date(updatedUser.last_active)
    };

    return { success: true, user: userData };
  }

  async logout(userId: string): Promise<AuthResult> {
    // Atualizar última atividade
    await this.supabase
      .from('users')
      .update({ last_active: new Date().toISOString() })
      .eq('id', userId);

    return { success: true };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateToken(user: any): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 dias
    };

    return jwt.sign(payload, this.jwtSecret);
  }
}
