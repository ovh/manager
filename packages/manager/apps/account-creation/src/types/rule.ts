import { z } from 'zod';

export type Rule = {
  defaultValue: string | null;
  examples: string[];
  fieldName: string | null;
  in: string[];
  mandatory: boolean;
  maxLength: number | null;
  minLength: number | null;
  prefix: string | null;
  regularExpression: string | null;
};
