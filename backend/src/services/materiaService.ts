import { MateriaRepository } from '../repositories/materiaRepository';

export class MateriaService {
  constructor(private materiaRepo: MateriaRepository) {}

  async list(page: number, size: number, nombre?: string) {
    const { data, total } = await this.materiaRepo.findAll(page, size, nombre);
    return {
      content: data,
      page,
      size,
      totalElements: total,
      totalPages: Math.ceil(total / size),
    };
  }

  async getById(id: number) {
    return this.materiaRepo.findById(id);
  }

  async create(data: { clave_materia: string; nombre_materia: string }) {
    return this.materiaRepo.create(data);
  }

  async update(id: number, data: { clave_materia?: string; nombre_materia?: string }) {
    return this.materiaRepo.update(id, data);
  }

  async delete(id: number) {
    await this.materiaRepo.delete(id);
  }
}