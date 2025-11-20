import { useParams } from 'react-router-dom';

export function useParam(param: string, strict: true): string;

export function useParam(param: string, strict?: false): string | undefined;
export function useParam(param: string, strict = true): string | undefined {
  const { [param]: paramValue } = useParams();
  if (strict && !paramValue) {
    throw new Error(`Missing ${param} in URL.`);
  }
  return paramValue;
}
