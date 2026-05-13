import { FastifyRequest, FastifyReply } from 'fastify';
import { EvaluacionService } from '../services/evaluacionService';
import { AlumnoRepository } from '../repositories/alumnoRepository';

export class EvaluacionController {
  constructor(
    private evaluacionService: EvaluacionService,
    private alumnoRepo: AlumnoRepository 
  ) {}

  async registrar(request: FastifyRequest<{ Body: { id_exposicion: number; id_alumno_evaluador: number; detalles: any[]; comentario_general?: string } }>, reply: FastifyReply) {
    const { id_exposicion, id_alumno_evaluador, detalles, comentario_general } = request.body;

    // Verificar que el evaluador sea el usuario autenticado (o admin)
    const userIdFromAlumno = await this.getUserIdFromAlumno(id_alumno_evaluador);
    if (request.user?.rol !== 'admin' && request.user?.id !== userIdFromAlumno) {
      return reply.status(403).send({ error: 'No puede evaluar en nombre de otro alumno' });
    }

    const result = await this.evaluacionService.registrarEvaluacion(
      id_exposicion,
      id_alumno_evaluador,
      detalles,
      comentario_general
    );
    reply.status(201).send(result);
  }

  async listByExposicion(request: FastifyRequest<{ Params: { idExposicion: string } }>, reply: FastifyReply) {
    const id = Number(request.params.idExposicion);
    const evaluaciones = await this.evaluacionService.obtenerEvaluacionesPorExposicion(id);
    reply.send(evaluaciones);
  }

  private async getUserIdFromAlumno(alumnoId: number): Promise<string> {
    const alumno = await this.alumnoRepo.findById(alumnoId);
    if (!alumno) {
      throw new Error(`Alumno con id ${alumnoId} no encontrado`);
    }
    if (!alumno.id_usuario) {
      throw new Error(`El alumno ${alumnoId} no tiene una cuenta de usuario vinculada`);
    }
    return alumno.id_usuario;
  }
}