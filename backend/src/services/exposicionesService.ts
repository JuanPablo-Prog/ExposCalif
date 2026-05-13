import { ExposicionRepository } from '../repositories/exposicionRepository';

export class ExposicionService {
  constructor(private exposicionRepo: ExposicionRepository) {}

  async listByEquipo(equipoId: number, page: number, size: number) {
    const { data, total } = await this.exposicionRepo.findAllByEquipo(equipoId, page, size);
    return {
      content: data,
      page,
      size,
      totalElements: total,
      totalPages: Math.ceil(total / size),
    };
  }

  async getById(id: number) {
    const exposicion = await this.exposicionRepo.findById(id);
    if (!exposicion) throw new Error('Exposición no encontrada');
    return exposicion;
  }

  async create(data: { titulo: string; fecha_exposicion: string; id_equipo: number; rubrica?: any }) {
    if (new Date(data.fecha_exposicion) < new Date()) {
      throw new Error('La fecha de exposición no puede ser en el pasado');
    }
    return this.exposicionRepo.create(data);
  }

  async update(id: number, data: { titulo?: string; fecha_exposicion?: string; rubrica?: any }) {
    const existing = await this.exposicionRepo.findById(id);
    if (!existing) throw new Error('Exposición no encontrada');
    return this.exposicionRepo.update(id, data);
  }

  async delete(id: number) {
    const existing = await this.exposicionRepo.findById(id);
    if (!existing) throw new Error('Exposición no encontrada');
    await this.exposicionRepo.delete(id);
  }
}