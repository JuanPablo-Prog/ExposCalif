// src/schemas/validationSchemas.ts
export interface MateriaInput {
  clave_materia: string;
  nombre_materia: string;
}

export type MateriaUpdate = Partial<MateriaInput>;