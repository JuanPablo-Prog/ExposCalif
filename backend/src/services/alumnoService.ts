import { AlumnoRepository } from '../repositories/alumnoRepository';

export class AlumnoService {
  constructor(private alumnoRepo: AlumnoRepository) {}

  // Solo para admin: listar todos los alumnos con paginación y búsqueda
  async listAll(page: number, size: number, search?: string) {
    const { data, total } = await this.alumnoRepo.findAll(page, size, search);
    return {
      content: data,
      page,
      size,
      totalElements: total,
      totalPages: Math.ceil(total / size),
    };
  }

  // Obtener alumno por ID (admin o el propio alumno)
  async getById(id: number, currentUserId?: string, currentUserRol?: string) {
    const alumno = await this.alumnoRepo.findById(id);
    if (!alumno) throw new Error('Alumno no encontrado');

    // Si el usuario es alumno, verificar que sea su propio registro
    if (currentUserRol === 'alumno' && alumno.id_usuario !== currentUserId) {
      throw new Error('No tienes permiso para ver este perfil');
    }
    return alumno;
  }

  // Obtener perfil del alumno autenticado (basado en el id_usuario)
  async getPerfil(usuarioId: string) {
    const alumno = await this.alumnoRepo.findByUsuarioId(usuarioId);
    if (!alumno) throw new Error('Perfil de alumno no encontrado');
    return alumno;
  }

  // Crear alumno (solo admin)
  async create(data: { matricula: string; nombre: string; apellido: string; email: string; id_usuario?: string }) {
    return this.alumnoRepo.create(data);
  }

  // Actualizar alumno (admin o el propio alumno limitado)
  async update(id: number, data: { matricula?: string; nombre?: string; apellido?: string; email?: string }, currentUserId?: string, currentUserRol?: string) {
    const alumno = await this.alumnoRepo.findById(id);
    if (!alumno) throw new Error('Alumno no encontrado');

    if (currentUserRol === 'alumno' && alumno.id_usuario !== currentUserId) {
      throw new Error('No puedes actualizar este perfil');
    }
    // Para alumnos, restringir qué campos pueden modificar
    if (currentUserRol === 'alumno') {
      const { matricula, email, ...restrictedData } = data;
      return this.alumnoRepo.update(id, restrictedData);
    }
    return this.alumnoRepo.update(id, data);
  }

  // Eliminar alumno (solo admin)
  async delete(id: number) {
    const alumno = await this.alumnoRepo.findById(id);
    if (!alumno) throw new Error('Alumno no encontrado');
    await this.alumnoRepo.delete(id);
  }
}