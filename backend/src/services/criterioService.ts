import { SupabaseClient } from '@supabase/supabase-js';

export class CriterioRepository {
  constructor(private supabase: SupabaseClient) {}

  async findById(id: number) {
    const { data, error } = await this.supabase
      .from('criterios')
      .select('*')
      .eq('id_criterio', id)
      .single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }

}