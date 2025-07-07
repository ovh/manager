import {
  discriminatedUnion,
  input,
  literal,
  object,
  output,
  string as zString,
  ZodType,
} from 'zod/v4';
import * as core from 'zod/v4/core';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

/**
 * This string is required with good naming value
 */
const string = (t: TFunction<[typeof NAMESPACES.FORM]>) => () =>
  zString(t(`${NAMESPACES.FORM}:required_field`)).min(
    1,
    t(`${NAMESPACES.FORM}:required_field`),
  );

const remove = <T extends ZodType>(schema: T) =>
  schema.nullable().transform(() => undefined);

const nullableRequired = <T extends ZodType>(schema: T) =>
  schema
    .nullable()
    .check((ctx) => {
      if (ctx.value === null) {
        const originalParse = schema.safeParse(ctx.value);

        // We should get an error, if not the user has used some other method to remove it
        if (!originalParse.success) {
          const invalidTypeIssue = originalParse.error.issues.find(
            (i) => i.code === 'invalid_type',
          );
          if (invalidTypeIssue) ctx.issues.push(invalidTypeIssue);
        }
      }
    })
    // This transform is used because it is the only method that allows to change the output type
    .transform((val) => val as output<T>);

export type InputSchemas = {
  object: typeof object;
  literal: typeof literal;
  discriminatedUnion: typeof discriminatedUnion;
  string: ReturnType<typeof string>;
  remove: typeof remove;
  nullableRequired: typeof nullableRequired;
};

export const useInputSchema = (): InputSchemas => {
  const { t } = useTranslation([NAMESPACES.FORM]);

  return {
    object,
    literal,
    discriminatedUnion,
    string: useMemo(() => string(t), [t]),
    remove,
    nullableRequired,
  };
};

export type BaseSchema<
  O = unknown,
  I = unknown,
  Internals extends core.$ZodTypeInternals<O, I> = core.$ZodTypeInternals<O, I>
> = core.$ZodType<O, I, Internals>;
export type TSchemaOutput<T extends BaseSchema> = output<T>;
export type TSchemaInput<T extends BaseSchema> = input<T>;
