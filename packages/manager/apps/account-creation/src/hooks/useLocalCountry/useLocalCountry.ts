import { useLocalStorage } from 'react-use';
import { Country } from '@ovh-ux/manager-config';

export const useLocalCountry = () =>
  useLocalStorage<Country | undefined>('ovh-country', undefined);
