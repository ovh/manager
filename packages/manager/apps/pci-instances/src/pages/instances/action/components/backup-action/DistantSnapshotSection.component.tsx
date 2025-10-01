import { useTranslation } from 'react-i18next';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';
import {
  ComboboxGroupItem,
  ComboboxValueChangeDetails,
  ICON_NAME,
  Message,
  MessageBody,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useInstanceBackupPrice } from '@/data/hooks/instance/action/useInstanceBackupPrice';
import { ComboboxField, InputField } from '@/components/form';
import { TBackupFormFieldsValues } from '@/pages/instances/action/hooks/useBackupFormShema';

export const DistantSnapshotSection = ({
  projectId,
  continents,
}: {
  projectId: string;
  continents: ReturnType<typeof useInstanceBackupPrice>['distantContinents'];
}) => {
  const { t } = useTranslation('actions');
  const { control } = useFormContext<TBackupFormFieldsValues>();

  const [open, distantRegion] = useWatch({
    control,
    name: ['distantSnapshot', 'distantRegion'],
  });

  const {
    price: backupPrice,
    isLoading: isBackupLoading,
  } = useInstanceBackupPrice(projectId, distantRegion ?? '');

  const { getFormattedCatalogPrice } = useCatalogPrice(3);
  const price = useMemo(
    () => (backupPrice ? getFormattedCatalogPrice(backupPrice) : null),
    [backupPrice, getFormattedCatalogPrice],
  );

  const regionItems = useMemo(
    () =>
      Array.from(continents.entries()).map<ComboboxGroupItem>(
        ([label, regions]) => ({
          label,
          options: regions.map((region) => ({
            label: region.label,
            value: region.name,
          })),
        }),
      ),
    [continents],
  );

  const showActivateRegionWarning = useMemo(
    () =>
      !!distantRegion &&
      !!Array.from(continents.values()).find(
        (regions) =>
          regions.find((r) => r.name === distantRegion)?.enabled === false,
      ),
    [distantRegion, continents],
  );

  if (!open) return null;

  return (
    <div className="flex flex-col gap-6 mt-6">
      <Controller
        render={({ field, fieldState: { error, invalid } }) => (
          <InputField
            label={t(
              'pci_instances_actions_backup_instance_distant_name_label',
            )}
            invalid={invalid}
            errorMessage={error?.message}
            type="text"
            {...field}
          />
        )}
        name="distantSnapshotName"
      />
      <div className="flex flex-col gap-4">
        <Controller
          render={({
            field: { value, onChange },
            fieldState: { error, invalid },
          }) => {
            const handleChange = (changeDetails: ComboboxValueChangeDetails) =>
              onChange(changeDetails.value[0]);

            return (
              <ComboboxField
                label={t(
                  'pci_instances_actions_backup_instance_distant_region_label',
                )}
                errorMessage={error?.message}
                value={value ? [value] : []}
                items={regionItems}
                onValueChange={handleChange}
                invalid={invalid}
                allowCustomValue={false}
              />
            );
          }}
          name="distantRegion"
        />
        {!!price && !isBackupLoading && (
          <Text preset={TEXT_PRESET.caption}>
            {t('pci_instances_actions_backup_instance_price', {
              price,
            })}
          </Text>
        )}
      </div>
      {showActivateRegionWarning && (
        <Message color="warning" dismissible={false}>
          <MessageIcon name={ICON_NAME.triangleExclamation} />
          <MessageBody>
            {t('pci_instances_actions_backup_instance_region_enable_warning')}
          </MessageBody>
        </Message>
      )}
    </div>
  );
};
