import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export const validatorDto = async <T, V>(data: V, type: ClassConstructor<T>): Promise<ValidationError[]> => {
  const dto = plainToInstance(type, data);
  const errors = await validate(dto as object);
  return errors;
};

export const validatorArrayDto = async <T, V>(dataArray: V[], type: ClassConstructor<T>): Promise<ValidationError[]> => {
  const dto = plainToInstance(type, dataArray);
  let errors: ValidationError[] = [];
  for (const data of dto) {
    errors = errors.concat(await validate(data as object));
  }
  return errors;
};
