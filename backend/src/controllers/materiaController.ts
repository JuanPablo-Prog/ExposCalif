import { FastifyRequest, FastifyReply } from 'fastify';
import { MateriaService } from '../services/materiaService';
import { MateriaUpdate } from '../schemas/validationSchemas';

export class MateriaController {
  constructor(private materiaService: MateriaService) {}

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { page = 0, size = 10, nombre } = request.query as any;
    const result = await this.materiaService.list(Number(page), Number(size), nombre);
    reply.send(result);
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    const materia = await this.materiaService.getById(id);
    if (!materia) return reply.status(404).send({ error: 'Not Found' });
    reply.send(materia);
  }

  async create(request: FastifyRequest<{ Body: { clave_materia: string; nombre_materia: string } }>, reply: FastifyReply) {
    const nueva = await this.materiaService.create(request.body);
    reply.status(201).send(nueva);
  }

  // src/services/materiaService.ts
    async update(request: FastifyRequest<{ Params: { id: string }; Body: MateriaUpdate }>, reply: FastifyReply) {
        const id = Number(request.params.id);
        const updated = await this.materiaService.update(id, request.body);
        reply.send(updated);
    }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const id = Number(request.params.id);
    await this.materiaService.delete(id);
    reply.status(204).send();
  }
}
