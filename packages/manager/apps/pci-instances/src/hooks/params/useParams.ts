import { useParams as useRouterParams } from 'react-router-dom';

export const useParams = <T extends string>(
  ...params: T[]
): Record<T, string> => {
  const urlParams = useRouterParams();

  return params.reduce((acc, cur) => {
    const value = urlParams[cur];
    if (!value) {
      throw new Error(`Missing "${cur}" in URL.`);
    }
    acc[cur] = value;
    return acc;
  }, {} as Record<T, string>);
};
