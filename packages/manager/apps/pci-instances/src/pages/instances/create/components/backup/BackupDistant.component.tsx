import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleField } from '@/components/form';
import Banner from '@/components/banner/Banner.component';
import {
  Text,
  SelectValueChangeDetail,
  ToggleCheckedChangeDetail,
} from '@ovhcloud/ods-react';
import { useFormContext } from 'react-hook-form';
import LocalizationSelect from '@/components/localizationCard/LocalizationSelect.component';
import {
  selectDistantBackupLocalizations,
  TDistantBackupLocalizationItemData,
} from '../../view-models/backupViewModel';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';

const BackupDistant: FC = () => {
  const { t } = useTranslation(['creation', 'common']);
  const [isDistantBackupActivate, setIsDistantBackupActivate] = useState(false);
  const { getFormattedMonthlyCatalogPrice } = useCatalogPrice(4);
  const [backupPrice, setBackupPrice] = useState<number | null>(null);
  const { setValue } = useFormContext<TInstanceCreationForm>();

  const regions = useMemo(() => selectDistantBackupLocalizations(), []);

  const handleActivateDistantBackup = ({
    checked,
  }: ToggleCheckedChangeDetail) => {
    setIsDistantBackupActivate(checked);

    if (!checked) setValue('distantBackupLocalization', null);
  };

  const handleSelectDistantBackupLocalization = ({
    items,
  }: SelectValueChangeDetail) => {
    const newLocalization = items[0];

    if (newLocalization && 'value' in newLocalization) {
      setValue('distantBackupLocalization', newLocalization.value);
      setBackupPrice(
        (newLocalization.customRendererData as TDistantBackupLocalizationItemData)
          .backupPrice,
      );
    }
  };

  return (
    <>
      <ToggleField
        withLabels
        className="mt-6"
        label={t(
          'creation:pci_instance_creation_backup_setting_distant_backup_checkbox_label',
        )}
        checked={isDistantBackupActivate}
        badges={[
          {
            label: t('common:pci_instances_common_new'),
            color: 'new',
          },
        ]}
        onCheckedChange={handleActivateDistantBackup}
      />
      {isDistantBackupActivate && (
        <div className="mt-6">
          <Banner>
            {t(
              'creation:pci_instance_creation_backup_setting_distant_backup_warning_message',
            )}
          </Banner>
          <LocalizationSelect<TDistantBackupLocalizationItemData>
            className="mt-6 max-w-[32%]"
            regions={regions}
            onValueChange={handleSelectDistantBackupLocalization}
          />
          {backupPrice && (
            <Text className="mt-6 font-semibold">
              {t('creation:pci_instance_creation_backup_billing_label')}
              {getFormattedMonthlyCatalogPrice(backupPrice)}
            </Text>
          )}
        </div>
      )}
    </>
  );
};

export default BackupDistant;
