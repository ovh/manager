import {
  mockedLocalBackups,
  mockedLocalizations,
} from '@/__mocks__/instance/constants';
import { TCustomRegionItemData } from '@/components/localizationCard/LocalizationSelect.component';
import { SelectGroupItem } from '@ovhcloud/ods-react';

export type TDistantBackupLocalizationItemData = TCustomRegionItemData & {
  backupPrice: number;
};

export const selectLocalBackups = () => ({
  items: mockedLocalBackups,
  price: '~0,011 € HT/mois/Go',
});

export const selectDistantBackupLocalizations = () =>
  mockedLocalizations as SelectGroupItem<TDistantBackupLocalizationItemData>[];
