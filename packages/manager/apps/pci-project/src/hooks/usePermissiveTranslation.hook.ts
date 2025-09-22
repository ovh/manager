import { useTranslation as useTranslationOriginal } from 'react-i18next';

type UseTransReturn = ReturnType<typeof useTranslationOriginal>;
type UseTransArg1 = Parameters<typeof useTranslationOriginal>[0];
type UseTransArg2 = Parameters<typeof useTranslationOriginal>[1];

const usePermissiveTranslation = (
  ns?: UseTransArg1,
  options?: UseTransArg2,
) => {
  const { t, ...rest } = useTranslationOriginal(ns, options);

  type T = typeof t;
  type TArgs = Parameters<T>;
  type TArg1 = TArgs[0];
  type TArgsRest = TArgs extends [TArg1, ...(infer Rest)] ? Rest : [];

  // Create a permissive t function that accepts undefined keys
  const permissiveT = (
    key: TArg1 | undefined, // accept undefined
    ...args: TArgsRest
  ): string => {
    if (!key) return '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return String((t as any)(key, ...args)); // Convert to string for JSX compatibility
  };

  return {
    ...rest,
    t: permissiveT,
  } as Omit<UseTransReturn, 't'> & {
    t: (key: TArg1 | undefined, ...args: TArgsRest) => string;
  };
};

export default usePermissiveTranslation;
