import { useEffect } from 'react';

import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

interface Bounds {
  min?: number;
  max?: number;
}

/**
 * Hook to validate a numeric field against dynamic bounds.
 * Useful when bounds are fetched asynchronously and might change.
 *
 * @param fieldName - The name of the field to validate
 * @param value - The current value of the field
 * @param bounds - The min/max bounds to validate against
 */
export const useDynamicBoundsValidation = <T extends FieldValues>(
  fieldName: Path<T>,
  value: number | null | undefined,
  bounds: Bounds,
) => {
  const {
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<T>();
  const { t } = useTranslation([NAMESPACES.FORM]);

  // Extract only the error type for this field to avoid infinite loops
  // (using the full errors object would cause re-runs on every error change)
  const fieldErrorType = errors[fieldName]?.type;

  // Extract primitive values to avoid re-runs when bounds object reference changes
  const { min, max } = bounds;

  useEffect(() => {
    if (value === null || value === undefined) return;

    if (min !== undefined && value < min) {
      setError(fieldName, {
        type: 'manual',
        message: t(`${NAMESPACES.FORM}:error_min_inclusive`, {
          value: min,
        }),
      });
    } else if (max !== undefined && value > max) {
      setError(fieldName, {
        type: 'manual',
        message: t(`${NAMESPACES.FORM}:error_max_inclusive`, {
          value: max,
        }),
      });
    } else if (fieldErrorType === 'manual') {
      clearErrors(fieldName);
    }
  }, [value, min, max, fieldName, setError, clearErrors, fieldErrorType, t]);
};
