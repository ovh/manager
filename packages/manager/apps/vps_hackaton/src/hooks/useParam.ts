import { useParams } from 'react-router-dom';

export const useParam = <T extends string>(paramName: string): T => {
  const params = useParams();
  const value = params[paramName];

  if (!value) {
    throw new Error(`Missing required route parameter: ${paramName}`);
  }

  return value as T;
};
