import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Icon,
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
import { selectLocalBackups } from '../view-models/backupViewModel';
import { useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../CreateInstance.schema';

const radioLabelClassname = 'text-lg font-bold text-[--ods-color-heading]';

const badgeClassname =
  'bg-[--ods-color-neutral-500] text-xs !text-[--ods-color-element-text-selected]';

const Backup: FC = () => {
  const { t } = useTranslation(['creation', 'common']);

  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const selectedLocalBackup = useWatch({
    control,
    name: 'localBackup',
  });

  const { price, items } = useMemo(() => selectLocalBackups(), []);

  const handleSelectLocalBackup = (value: string | null) =>
    setValue('localBackup', value);

  const handleDeactivateLocalBackup = ({
    checked,
  }: ToggleCheckedChangeDetail) => {
    const localBackup = items[0]?.value ?? null;
    handleSelectLocalBackup(checked ? localBackup : null);
  };

  return (
    <section>
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
        checked={!!selectedLocalBackup}
        badges={[
          {
            label: t('common:pci_instances_common_recommanded'),
          },
        ]}
        onCheckedChange={handleDeactivateLocalBackup}
      />
      {selectedLocalBackup && (
        <div className="mt-6">
          <Text className="font-semibold">
            {t('creation:pci_instance_creation_backup_billing_label')} {price}
          </Text>
          <RadioGroup
            className="mt-6 grid grid-cols-3 gap-6"
            {...(selectedLocalBackup && { value: selectedLocalBackup })}
            onValueChange={({ value }) => handleSelectLocalBackup(value)}
          >
            {items.map(({ value, label, description }) => (
              <PciCard
                key={value}
                selectable
                selected={selectedLocalBackup === value}
                onClick={() => handleSelectLocalBackup(value)}
              >
                <PciCard.Header>
                  <Radio value={value}>
                    <RadioControl />
                    <RadioLabel className={radioLabelClassname}>
                      {label}
                    </RadioLabel>
                  </Radio>
                </PciCard.Header>
                <PciCard.Content>
                  <Text>{description}</Text>
                </PciCard.Content>
              </PciCard>
            ))}
            <PciCard disabled>
              <PciCard.Header>
                <Radio disabled value="">
                  <RadioControl />
                  <RadioLabel className={radioLabelClassname}>
                    Custom
                  </RadioLabel>
                </Radio>
                <Badge className={badgeClassname} color="neutral">
                  Coming soon
                  <Icon
                    className="!text-[--ods-color-element-text-selected]"
                    name="circle-info"
                  />
                </Badge>
              </PciCard.Header>
              <PciCard.Content>
                <Text>
                  Choose the scheduling yourself (in UNIX Cron format), the
                  number of rotations, and the maximum executions you want.
                </Text>
              </PciCard.Content>
            </PciCard>
          </RadioGroup>
        </div>
      )}
    </section>
  );
};

export default Backup;
