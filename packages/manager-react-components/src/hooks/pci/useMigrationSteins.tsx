import { useContext } from 'react';
import { ManagerReactComponentContext } from '../../context/ManagerReactContext';
import { useQuery } from '@tanstack/react-query';

export interface Stein {
  date: string;
  zone: string;
  travaux: string;
}

export const getMigrationSteins = async (): Promise<Stein[]> => {
  const context = useContext(ManagerReactComponentContext);
  const { apiClient } = context;
  const { data } = await apiClient.v6.get<Stein[]>('/cloud/migrationStein');
  return data;
};

export const migrationSteinsQueryKey = ['migrationSteins'];

export const useMigrationSteins = () =>
  useQuery({
    queryKey: migrationSteinsQueryKey,
    queryFn: () => getMigrationSteins(),
    select: (data) =>
      [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
  });
