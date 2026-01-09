import { mockedDistantBackupLocalizations } from '@/__mocks__/instance/constants';
import { TCustomRegionItemData } from '@/components/localizationCard/LocalizationSelect.component';
import { SelectGroupItem } from '@ovhcloud/ods-react';

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

// TODO: return price as number and let the component format it
export const selectLocalBackups = () => ({
  items: localBackupsItems,
  price: '~0,011 € HT/mois/Go',
});

export const selectDistantBackupLocalizations = () =>
  mockedDistantBackupLocalizations as SelectGroupItem<
    TDistantBackupLocalizationItemData
  >[];
