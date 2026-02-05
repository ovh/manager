import { z } from 'zod';

/**
 * Test-only mock for @hookform/resolvers/zod (zod v4). 
 * Uses safeParseAsync instead of parse: validation failures resolve with { values, errors } instead of throwing.
 * Avoids unhandled rejection when forms mount with empty or async defaultValues.
 */
export function createZodResolverMock() {
  return (schema: z.ZodType) => {
    return async (formData: unknown) => {
      const result = await schema.safeParseAsync(formData);

      if (result.success) {
        return { values: result.data, errors: {} };
      }

      const flattened = z.flattenError(result.error);
      const fieldErrors: Record<string, { type: string; message: string }> = {};

      for (const [fieldPath, messages] of Object.entries(flattened.fieldErrors)) {
        const message = Array.isArray(messages) ? messages[0] : messages;
        if (typeof message === 'string') {
          fieldErrors[fieldPath] = { type: 'validation', message };
        }
      }

      return { values: formData, errors: fieldErrors };
    };
  };
}
