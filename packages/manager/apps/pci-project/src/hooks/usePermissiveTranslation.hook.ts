import { useTranslation as useTranslationOriginal } from 'react-i18next';

type UseTransReturn = ReturnType<typeof useTranslationOriginal>;
type UseTransArg1 = Parameters<typeof useTranslationOriginal>[0];
type UseTransArg2 = Parameters<typeof useTranslationOriginal>[1];

type PermissiveTranslationReturn = Omit<UseTransReturn, 't'> & {
  t: (key: string | undefined, ...args: unknown[]) => string;
};

const usePermissiveTranslation = (
  ns?: UseTransArg1,
  options?: UseTransArg2,
): PermissiveTranslationReturn => {
  const { t, ...rest } = useTranslationOriginal(ns, options);

  type T = typeof t;
  type TArgs = Parameters<T>;
  type TArg1 = TArgs[0];
  type TArgsRest = TArgs extends [TArg1, ...infer Rest] ? Rest : [];

  // Create a permissive t function that accepts undefined keys
  const permissiveT = (
    key: TArg1 | undefined, // accept undefined
    ...args: TArgsRest
  ): string => {
    if (!key) return '';

    // Type assertion needed because t function signature is complex
    return String((t as (key: TArg1, ...args: TArgsRest) => string)(key, ...args));
  };

  return {
    ...rest,
    t: permissiveT,
  } as PermissiveTranslationReturn;
};

export default usePermissiveTranslation;
