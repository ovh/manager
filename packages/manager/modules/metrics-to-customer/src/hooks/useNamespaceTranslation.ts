import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

/**
 * Hook that creates a namespaced translation function.
 * Sets up translation with a base namespace and a primary namespace (with configurable suffix),
 * checking the primary namespace first before falling back to the base namespace.
 *
 * @param baseNamespace - The base namespace for translations
 * @param suffix - The suffix to append to the base namespace for the primary namespace (default: '-override')
 * @returns A translation function that handles both single keys and arrays of keys
 */
export const useNamespaceTranslation = (baseNamespace: string, suffix: string = '-override') => {
  const baseNs = baseNamespace;
  const primaryNs = `${baseNs}${suffix}`;

  const { t, i18n } = useTranslation([baseNs, primaryNs]);

  const translate = useCallback(
    (key: string | string[]): string | string[] => {
      // Handle array of keys - translate each key individually and return array
      if (Array.isArray(key)) {
        return key.map((k) => {
          const ns = i18n.exists(k, { ns: primaryNs }) ? primaryNs : baseNs;
          return t(k, { ns });
        });
      }
      // Handle single key - return string
      const ns = i18n.exists(key, { ns: primaryNs }) ? primaryNs : baseNs;
      return t(key, { ns });
    },
    [t, i18n, primaryNs, baseNs],
  );

  return translate;
};
