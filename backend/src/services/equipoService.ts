import { EquipoRepository } from '../repositories/equipoRepository';

export class EquipoService {
  constructor(private equipoRepo: EquipoRepository) {}

  async listByGrupo(grupoId: number, page: number, size: number) {
    const { data, total } = await this.equipoRepo.findAllByGrupo(grupoId, page, size);
    return {
      content: data,
      page,
      size,
      totalElements: total,
      totalPages: Math.ceil(total / size),
    };
  }

  async getById(id: number) {
    const equipo = await this.equipoRepo.findById(id);
    if (!equipo) throw new Error('Equipo no encontrado');
    return equipo;
  }

  async create(data: { nombre_equipo: string; id_grupo: number }) {
    return this.equipoRepo.create(data);
  }

  async update(id: number, data: { nombre_equipo?: string }) {
    const existing = await this.equipoRepo.findById(id);
    if (!existing) throw new Error('Equipo no encontrado');
    return this.equipoRepo.update(id, data);
  }

  async delete(id: number) {
    const existing = await this.equipoRepo.findById(id);
    if (!existing) throw new Error('Equipo no encontrado');
    await this.equipoRepo.delete(id);
  }

  async addAlumno(equipoId: number, alumnoId: number) {
    const equipo = await this.equipoRepo.findById(equipoId);
    if (!equipo) throw new Error('Equipo no encontrado');
    await this.equipoRepo.addAlumno(equipoId, alumnoId);
  }

  async removeAlumno(equipoId: number, alumnoId: number) {
    const equipo = await this.equipoRepo.findById(equipoId);
    if (!equipo) throw new Error('Equipo no encontrado');
    await this.equipoRepo.removeAlumno(equipoId, alumnoId);
  }
}