import { GetIpListParams } from '@/data/api';

export function cleanApiFilter(apiFilter: GetIpListParams) {
  const result: Record<string, string> = {};
  Object.entries(apiFilter).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = value as string;
    }
  });
  return result;
}

export function parseSearchValue(value: string) {
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    case 'null':
      return null;
    case 'undefined':
      return undefined;
    default:
      return value;
  }
}

export function searchToApiFilter(search?: URLSearchParams): GetIpListParams {
  const params: Record<string, string | number | boolean | null | undefined> =
    {};
  search?.forEach?.((value, key) => {
    params[key] =
      key === 'version' ? parseInt(value, 10) : parseSearchValue(value);
  });
  return params as GetIpListParams;
}
