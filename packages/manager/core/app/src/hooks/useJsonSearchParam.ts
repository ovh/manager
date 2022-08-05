import { useSearchParams } from 'react-router-dom';

export default function useJsonSearchParam<T>(
  param: string,
): [T, (data: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const saveValue = (data: T) => {
    try {
      if (data === undefined || data === null) {
        searchParams.delete(param);
      } else {
        searchParams.set(param, JSON.stringify(data));
      }
      setSearchParams(searchParams);
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

  return [value, saveValue];
}
