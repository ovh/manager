import { useParams } from 'react-router-dom';

export function useParam(param: string): string {
  const { [param]: paramValue } = useParams();
  if (!paramValue) {
    throw new Error(`Missing ${param} in URL.`);
  }
  return paramValue;
}
