/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * The hooks will be available in the `@ovh-ux/manager-pci-common` package.
 */
import { v6 } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

/**
 * @deprecated The interface is deprecated and will be removed in MRC V3.
 */
export interface Stein {
  date: string;
  zone: string;
  travaux: string;
}

/**
 * @deprecated This function is deprecated and will be removed in MRC V3.
 */
export const getMigrationSteins = async (): Promise<Stein[]> => {
  const { data } = await v6.get<Stein[]>('/cloud/migrationStein');
  return data;
};

/**
 * @deprecated This constant is deprecated and will be removed in MRC V3.
 */
export const migrationSteinsQueryKey = ['migrationSteins'];

/**
 * @deprecated This hook is deprecated and will be removed in MRC V3.
 */
export const useMigrationSteins = () =>
  useQuery({
    queryKey: migrationSteinsQueryKey,
    queryFn: () => getMigrationSteins(),
    select: (data) =>
      [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
  });
