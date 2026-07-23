import { useTranslation } from 'react-i18next';

import { useLocations } from '@/data/hooks/useLocations/useLocations';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { formatLocationTitle } from '@/utils/locationLabel/locationLabel';

/**
 * Libellé lisible de la localisation sélectionnée (récap, titre d'étape replié).
 * Retombe sur le nom de région brut tant que le référentiel n'est pas chargé.
 */
export const useLocationLabel = (locationName: string | null): string => {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ORDER);
  const { data: locations } = useLocations();

  if (!locationName) return '';

  const location = locations?.find(({ name }) => name === locationName);
  return location ? formatLocationTitle(t, location) : locationName;
};
