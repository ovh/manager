import { useSearchParams } from 'react-router-dom';

export function useJsonSearchParam<T>(param: string): [T, (data: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const updateValue = (data: T) => {
    try {
      if (data === undefined || data === null) {
        searchParams.delete(param);
      } else {
        searchParams.set(param, JSON.stringify(data));
      }
      setSearchParams(searchParams, { replace: true });
    } catch {
      // skip
    }
  };
  let value = null;

  try {
    value = JSON.parse(searchParams.get(param));
  } catch {
    // skip
  }

  return [value, updateValue];
}

export default useJsonSearchParam;
