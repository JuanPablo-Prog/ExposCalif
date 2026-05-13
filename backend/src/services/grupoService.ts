import { GrupoRepository } from '../repositories/grupoRepository';

export class GrupoService {
  constructor(private grupoRepo: GrupoRepository) {}

  async listByMateria(materiaId: number, page: number, size: number) {
    const { data, total } = await this.grupoRepo.findAllByMateria(materiaId, page, size);
    return {
      content: data,
      page,
      size,
      totalElements: total,
      totalPages: Math.ceil(total / size),
    };
  }

  async getById(id: number) {
    const grupo = await this.grupoRepo.findById(id);
    if (!grupo) throw new Error('Grupo no encontrado');
    return grupo;
  }

  async create(data: { nombre_grupo: string; periodo: string; id_materia: number }) {
    return this.grupoRepo.create(data);
  }

  async update(id: number, data: { nombre_grupo?: string; periodo?: string; id_materia?: number }) {
    const existing = await this.grupoRepo.findById(id);
    if (!existing) throw new Error('Grupo no encontrado');
    return this.grupoRepo.update(id, data);
  }

  async delete(id: number) {
    const existing = await this.grupoRepo.findById(id);
    if (!existing) throw new Error('Grupo no encontrado');
    await this.grupoRepo.delete(id);
  }
}