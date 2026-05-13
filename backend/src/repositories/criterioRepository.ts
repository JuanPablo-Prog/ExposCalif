import { SupabaseClient } from '@supabase/supabase-js';

export class CriterioRepository {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Obtiene un criterio por su ID
   * @param id - ID del criterio
   * @returns El criterio encontrado o null si no existe
   */
  async findById(id: number) {
    const { data, error } = await this.supabase
      .from('criterios')
      .select('*')
      .eq('id_criterio', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error al buscar criterio: ${error.message}`);
    }
    return data;
  }

  /**
   * Lista todos los criterios de una materia (con paginación opcional)
   * @param materiaId - ID de la materia
   * @param page - Número de página (desde 0)
   * @param size - Tamaño de página
   */
  async findByMateria(materiaId: number, page?: number, size?: number) {
    let query = this.supabase
      .from('criterios')
      .select('*', { count: 'exact' })
      .eq('id_materia', materiaId)
      .order('id_criterio', { ascending: true });

    if (page !== undefined && size !== undefined) {
      const from = page * size;
      const to = from + size - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    if (error) throw new Error(`Error al listar criterios: ${error.message}`);
    return { data, total: count || 0 };
  }

  /**
   * Crea un nuevo criterio (solo admin/docente)
   * @param criterio - Datos del criterio (nombre, descripción, peso, id_materia)
   */
  async create(criterio: {
    nombre_criterio: string;
    descripcion?: string;
    peso: number;
    id_materia: number;
  }) {
    const { data, error } = await this.supabase
      .from('criterios')
      .insert(criterio)
      .select()
      .single();

    if (error) throw new Error(`Error al crear criterio: ${error.message}`);
    return data;
  }

  /**
   * Actualiza un criterio existente
   * @param id - ID del criterio
   * @param updates - Campos a actualizar
   */
  async update(
    id: number,
    updates: {
      nombre_criterio?: string;
      descripcion?: string;
      peso?: number;
      id_materia?: number;
    }
  ) {
    const { data, error } = await this.supabase
      .from('criterios')
      .update(updates)
      .eq('id_criterio', id)
      .select()
      .single();

    if (error) throw new Error(`Error al actualizar criterio: ${error.message}`);
    return data;
  }

  /**
   * Elimina un criterio (solo admin)
   * @param id - ID del criterio
   */
  async delete(id: number) {
    const { error } = await this.supabase
      .from('criterios')
      .delete()
      .eq('id_criterio', id);

    if (error) throw new Error(`Error al eliminar criterio: ${error.message}`);
  }
}