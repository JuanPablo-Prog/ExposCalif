import { supabase } from '../config/supabase';

export class AuthService {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    // Obtener rol
    const { data: userData } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id_usuario', data.user.id)
      .single();
    return {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        rol: userData?.rol,
      },
    };
  }

  async register(email: string, password: string, metadata: { nombre: string; apellido: string; matricula?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw new Error(error.message);
    return data;
  }
}