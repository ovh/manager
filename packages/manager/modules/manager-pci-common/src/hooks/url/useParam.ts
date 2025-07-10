import { useParams } from 'react-router-dom';

export const useParam = <T extends string>(
  ...params: T[]
): Record<T, string> => {
  const urlParams = useParams();

  return params.reduce((acc, param) => {
    const value = urlParams[param];
    if (value === undefined) {
      throw new Error(`Missing "${param}" in URL.`);
    }
    acc[param] = value;
    return acc;
  }, {} as Record<T, string>);
};
