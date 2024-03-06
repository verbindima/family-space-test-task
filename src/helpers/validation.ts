import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export const validatorDto = async (data: any, type: any): Promise<ValidationError[]> => {
  const dto = plainToInstance(type, data);
  const errors = await validate(dto);
  return errors;
};

export const validatorArrayDto = async (dataArray: any[], type: any): Promise<ValidationError[]> => {
  const dto: Array<any> = plainToInstance(type, dataArray);
  let errors: ValidationError[] = [];
  for (const data of dto) {
    errors = errors.concat(await validate(data));
  }
  return errors;
};
