import { useEffect, useRef } from 'react';

import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import type { Bounds } from '@/types/form.type';

/**
 * Hook to validate a numeric field against dynamic bounds.
 * Useful when bounds are fetched asynchronously and might change.
 *
 * Sets form errors for display purposes and returns the error state
 * synchronously for immediate use in disabled states.
 *
 * @param fieldName - The name of the field to validate
 * @param value - The current value of the field
 * @param bounds - The min/max bounds to validate against
 * @returns Whether the field has a bounds validation error
 */
export const useDynamicBoundsValidation = <T extends FieldValues>(
  fieldName: Path<T>,
  value: number | null | undefined,
  bounds: Bounds,
): boolean => {
  const { setError, clearErrors } = useFormContext<T>();
  const { t } = useTranslation([NAMESPACES.FORM]);

  // Track previous error state to avoid unnecessary setError/clearErrors calls
  const prevHasErrorRef = useRef(false);

  const { min, max } = bounds;

  // Calculate error state synchronously for immediate return
  const isValueValid = value !== null && value !== undefined && !Number.isNaN(value);
  const hasError =
    isValueValid && ((min !== undefined && value < min) || (max !== undefined && value > max));

  // Sync error state with react-hook-form for error message display
  useEffect(() => {
    // Skip if error state hasn't changed
    if (hasError === prevHasErrorRef.current) return;
    prevHasErrorRef.current = hasError;

    if (!hasError) {
      clearErrors(fieldName);
      return;
    }

    const isUnderMin = min !== undefined && value < min;
    setError(fieldName, {
      type: 'bounds',
      message: t(
        isUnderMin
          ? `${NAMESPACES.FORM}:error_min_inclusive`
          : `${NAMESPACES.FORM}:error_max_inclusive`,
        { value: isUnderMin ? min : max },
      ),
    });
  }, [hasError, fieldName, setError, clearErrors, min, max, value, t]);

  return hasError;
};
