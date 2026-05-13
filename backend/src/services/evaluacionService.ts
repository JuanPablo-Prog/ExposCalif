import { EvaluacionRepository } from '../repositories/evaluacionRepository';
import { ExposicionRepository } from '../repositories/exposicionRepository';
import { CriterioRepository } from '../repositories/criterioRepository';
import { AlumnoRepository } from '../repositories/alumnoRepository';

export class EvaluacionService {
  constructor(
    private evaluacionRepo: EvaluacionRepository,
    private exposicionRepo: ExposicionRepository,
    private criterioRepo: CriterioRepository,
    private alumnoRepo: AlumnoRepository
  ) {}

  async registrarEvaluacion(
    exposicionId: number,
    alumnoEvaluadorId: number,
    detalles: { id_criterio: number; calificacion: number }[],
    comentarioGeneral?: string
  ) {
    // Verificar que la exposición existe
    const exposicion = await this.exposicionRepo.findById(exposicionId);
    if (!exposicion) throw new Error('Exposición no encontrada');

    // Verificar que el alumno evaluador existe
    const evaluador = await this.alumnoRepo.findById(alumnoEvaluadorId);
    if (!evaluador) throw new Error('Alumno evaluador no encontrado');

    // Verificar que el alumno no haya evaluado ya esta exposición
    const evaluacionExistente = await this.evaluacionRepo.findByAlumnoEvaluador(exposicionId, alumnoEvaluadorId);
    if (evaluacionExistente) throw new Error('El alumno ya evaluó esta exposición');

    // Validar que los criterios pertenezcan a la materia de la exposición (obtener materia desde el grupo)
    const materiaId = exposicion.equipos?.grupos?.id_materia;
    if (!materiaId) throw new Error('No se pudo determinar la materia de la exposición');

    for (const det of detalles) {
      const criterio = await this.criterioRepo.findById(det.id_criterio);
      if (!criterio || criterio.id_materia !== materiaId) {
        throw new Error(`El criterio ${det.id_criterio} no pertenece a la materia de la exposición`);
      }
    }

    // Crear cabecera de evaluación
    const evaluacion = await this.evaluacionRepo.create({
      id_exposicion: exposicionId,
      id_alumno_evaluador: alumnoEvaluadorId,
      comentario_general: comentarioGeneral,
    });

    // Crear detalles de evaluación
    for (const det of detalles) {
      await this.evaluacionRepo.addDetalle({
        id_evaluacion: evaluacion.id_evaluacion,
        id_criterio: det.id_criterio,
        calificacion: det.calificacion,
      });
    }

    return evaluacion;
  }

  async obtenerEvaluacionesPorExposicion(exposicionId: number) {
    const evaluaciones = await this.evaluacionRepo.findByExposicion(exposicionId);
    return evaluaciones;
  }

  async obtenerEvaluacionPropia(exposicionId: number, alumnoEvaluadorId: number) {
    return this.evaluacionRepo.findByAlumnoEvaluador(exposicionId, alumnoEvaluadorId);
  }
}