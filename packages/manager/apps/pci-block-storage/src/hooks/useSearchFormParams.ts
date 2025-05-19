import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
  useWatch,
} from 'react-hook-form';
import { z, ZodRawShape } from 'zod';

export function useSearchFormParams<
  S extends z.ZodObject<ZodRawShape>,
  FormReturn extends FieldValues
>(
  schema: S,
  {
    control,
    setValue,
  }: Pick<UseFormReturn<FormReturn>, 'control' | 'setValue'>,
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useWatch({ control });

  const partialSchema = useMemo(() => schema.partial(), [schema]);

  // Update form from search
  useEffect(() => {
    try {
      const searchData = partialSchema.parse(Object.fromEntries(searchParams));
      Object.entries(searchData).forEach(
        ([name, value]: [
          Path<FormReturn>,
          PathValue<FormReturn, Path<FormReturn>>,
        ]) => {
          if (value !== undefined && value !== null && form[name] !== value) {
            setValue(name, value);
          }
        },
      );
    } catch (e) {
      console.error('Error while parsing search params into form', e);
    }
  }, [searchParams]);

  // Update search from form
  useEffect(() => {
    setSearchParams((oldParams) =>
      Object.fromEntries([
        ...oldParams.entries(),
        ...Object.entries(form).filter(
          ([, val]) => val !== undefined && val !== null,
        ),
      ]),
    );
  }, [form]);
}
