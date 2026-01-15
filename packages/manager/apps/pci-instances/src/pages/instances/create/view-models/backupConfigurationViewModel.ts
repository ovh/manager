import { mockedDistantBackupLocalizations } from '@/__mocks__/instance/constants';
import { TCustomRegionItemData } from '@/components/localizationCard/LocalizationSelect.component';
import { TBackupConfiguration } from '@/domain/entities/configuration';
import { SelectGroupItem } from '@ovhcloud/ods-react';

const HOUR_AVERAGE_IN_MONTH = 730;

export type TDistantBackupLocalizationItemData = TCustomRegionItemData & {
  backupPrice: number;
};

const localBackupsItems = [
  {
    rotation: '7',
    isEnabled: true,
  },
  {
    rotation: '14',
    isEnabled: true,
  },
  {
    rotation: 'custom',
    isEnabled: false,
    badge: 'Coming soon',
  },
];

export const selectLocalBackupConfigurations = (microRegion: string | null) => (
  backupConfigurations?: TBackupConfiguration[],
) => {
  if (!microRegion) return null;

  const config = backupConfigurations?.find(
    (config) => config.region === microRegion,
  );

  if (!config) return null;

  const hourlyPrice = config.prices.find((price) => price.type === 'hour');
  const price = hourlyPrice?.priceInUcents
    ? hourlyPrice.priceInUcents * HOUR_AVERAGE_IN_MONTH
    : null;

  return {
    items: localBackupsItems,
    price,
  };
};

export const selectDistantBackupLocalizations = () =>
  mockedDistantBackupLocalizations as SelectGroupItem<
    TDistantBackupLocalizationItemData
  >[];
