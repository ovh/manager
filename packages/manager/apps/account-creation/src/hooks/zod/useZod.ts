import { z } from 'zod';
import { Rule } from '@/types/rule';

export type RuleZodSchema =
  | z.ZodString
  | z.ZodEffects<z.ZodString, string, string>
  | z.ZodOptional<z.ZodString | z.ZodEffects<z.ZodString, string, string>>;

const toZodField = (field: Rule): RuleZodSchema => {
  let zodSchema: RuleZodSchema = z
    .string({
      required_error: 'required_field',
    })
    .trim()
    .min(1, 'required_field');

  if (field.in) {
    zodSchema = zodSchema.refine((value) => field.in?.includes(value));
  } else {
    if (field.maxLength) {
      zodSchema = zodSchema.max(field.maxLength, 'error_max_chars');
    }
    if (field.minLength) {
      zodSchema = zodSchema.min(field.minLength, 'error_min_chars');
    }
    if (field.prefix) {
      zodSchema = zodSchema.startsWith(field.prefix, 'error_pattern');
    }
    if (field.regularExpression) {
      zodSchema = zodSchema.regex(
        new RegExp(field.regularExpression),
        'error_pattern',
      );
    }
  }

  if (!field.mandatory) {
    return zodSchema.optional();
  }

  return zodSchema;
};

export const getZodSchemaFromRule = <T extends Record<string, Rule>>(
  fields: T,
) =>
  z.object(
    Object.keys(fields).reduce((acc, fieldName) => {
      acc[fieldName] = toZodField(fields[fieldName]);
      return acc;
    }, {} as Record<string, RuleZodSchema>) as {
      [K in keyof T]: RuleZodSchema;
    },
  );

export const useZodTranslatedError = (errorMessage: string, rule: Rule) => {
  switch (errorMessage) {
    case 'error_max_chars':
      return {
        key: 'error_max_chars',
        options: { value: rule.maxLength || 0 },
      };
    case 'error_min_chars':
      return {
        key: 'error_min_chars',
        options: { value: rule.minLength || 0 },
      };
    default:
      return { key: errorMessage };
  }
};
