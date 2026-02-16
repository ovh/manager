import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Divider,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Text,
  ToggleCheckedChangeDetail,
} from '@ovhcloud/ods-react';
import BackupHelper from './backup/BackupHelper.component';
import { PciCard } from '@/components/pciCard/PciCard.component';
import { ToggleField } from '@/components/form';
import { selectLocalBackupConfigurations } from '../view-models/backupConfigurationViewModel';
import { useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../CreateInstance.schema';
import BackupDistant from './backup/BackupDistant.component';
import { useBackupConfigurations } from '@/data/hooks/configuration/useBackupConfiguration';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { useCallback } from 'react';

type TBackupProps = {
  microRegion: string;
};

const radioLabelClassname = 'text-lg font-bold text-[--ods-color-heading]';

const badgeClassname =
  'bg-[--ods-color-neutral-500] text-xs !text-[--ods-color-element-text-selected]';

const Backup: FC<TBackupProps> = ({ microRegion }) => {
  const { t } = useTranslation(['creation', 'common']);

  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const selectedLocalBackupRotation = useWatch({
    control,
    name: 'localBackupRotation',
  });

  const {
    data: backupConfigurations = null,
    isPending,
  } = useBackupConfigurations({
    select: selectLocalBackupConfigurations(microRegion),
  });

  const { getTextPrice } = useCatalogPrice(4);

  const handleSelectLocalBackup = useCallback(
    (rotation: string | null) => setValue('localBackupRotation', rotation),
    [setValue],
  );

  const handleDeactivateLocalBackup = ({
    checked,
  }: ToggleCheckedChangeDetail) => {
    const localBackupRotation =
      backupConfigurations?.items[0]?.rotation ?? null;
    handleSelectLocalBackup(checked ? localBackupRotation : null);

    if (!checked) setValue('distantBackupLocalization', null);
  };

  useEffect(() => {
    if (!isPending && backupConfigurations) {
      const localBackupRotation =
        backupConfigurations.items[0]?.rotation ?? null;
      handleSelectLocalBackup(localBackupRotation);
    }
  }, [backupConfigurations, handleSelectLocalBackup, isPending]);

  // TODO: handle loading state
  if (isPending || !backupConfigurations) return null;

  return (
    <section>
      <Divider spacing="48" />
      <div className="flex items-center space-x-4">
        <Text preset="heading-3">
          {t('creation:pci_instance_creation_backup_setting_title')}
        </Text>
        <BackupHelper />
      </div>
      <Text className="mt-4" preset="paragraph">
        {t('creation:pci_instance_creation_backup_setting_description')}
      </Text>
      <ToggleField
        withLabels
        className="mt-6"
        label={t(
          'creation:pci_instance_creation_backup_setting_auto_backup_checkbox_label',
        )}
        checked={!!selectedLocalBackupRotation}
        badges={[
          {
            label: t('common:pci_instances_common_recommanded'),
          },
        ]}
        onCheckedChange={handleDeactivateLocalBackup}
      />
      {selectedLocalBackupRotation && (
        <div className="mt-6">
          {backupConfigurations.price && (
            <Text className="font-semibold">
              {t('creation:pci_instance_creation_backup_billing_label', {
                price: getTextPrice(backupConfigurations.price),
              })}
            </Text>
          )}
          <RadioGroup
            className="mt-6 grid grid-cols-3 gap-6"
            value={selectedLocalBackupRotation}
            onValueChange={({ value }) => handleSelectLocalBackup(value)}
          >
            {backupConfigurations.items.map(
              ({ rotation, isEnabled, badge }) => (
                <PciCard
                  key={rotation}
                  selectable
                  selected={selectedLocalBackupRotation === rotation}
                  onClick={() => handleSelectLocalBackup(rotation)}
                  disabled={!isEnabled}
                >
                  <PciCard.Header>
                    <div className="flex flex-wrap items-center gap-5">
                      <Radio disabled={!isEnabled} value={rotation}>
                        <RadioControl />
                        <RadioLabel className={radioLabelClassname}>
                          {t(
                            `creation:pci_instance_creation_backup_setting_rotation_${rotation}_label`,
                          )}
                        </RadioLabel>
                      </Radio>
                      {badge && (
                        <Badge className={badgeClassname} color="neutral">
                          {badge}
                        </Badge>
                      )}
                    </div>
                  </PciCard.Header>
                  <PciCard.Content>
                    <Text>
                      {t(
                        [
                          `creation:pci_instance_creation_backup_setting_rotation_description.${rotation}`,
                          'creation:pci_instance_creation_backup_setting_rotation_description.predefined',
                        ],
                        {
                          numEntries: rotation,
                        },
                      )}
                    </Text>
                  </PciCard.Content>
                </PciCard>
              ),
            )}
          </RadioGroup>
          <div className="mt-6">
            <BackupDistant />
          </div>
        </div>
      )}
    </section>
  );
};

export default Backup;
