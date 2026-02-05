import {
  Controller,
  ControllerRenderProps,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  FormField,
  FormFieldLabel,
  Select,
  SelectControl,
  SelectValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';
import { deps } from '@/deps/deps';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useEffect, useMemo } from 'react';
import {
  hasAnyEligibleBackup,
  selectAvailableImagesTypes,
  TFlavorBackupConstraints,
} from '../../view-models/imagesViewModel';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import { DistributionImageOption } from './DistributionImageOption.component';
import { useBackups } from '@/data/hooks/backups/useBackups';

type TDistributionImageTypeProps = {
  flavorBackupConstraints: TFlavorBackupConstraints | null;
};

const DistributionImageType = ({
  flavorBackupConstraints,
}: TDistributionImageTypeProps) => {
  const projectId = useProjectId();
  const { t } = useTranslation(['common', 'creation']);
  const { trackClick } = useOvhTracking();
  const { control, resetField, setValue } = useFormContext<
    TInstanceCreationForm
  >();
  const [selectedImageType, flavorId, microRegion] = useWatch({
    control,
    name: ['distributionImageType', 'flavorId', 'microRegion'],
  });

  const { data: hasEligibleBackup } = useBackups(
    microRegion ?? '',
    {
      select: hasAnyEligibleBackup(flavorBackupConstraints),
      enabled: !!microRegion && !!flavorBackupConstraints,
    },
    { limit: 10 },
  );

  const imageTypes = useMemo(
    () =>
      selectAvailableImagesTypes(deps)(
        projectId,
        flavorId,
        microRegion,
        hasEligibleBackup ?? false,
      ).map(({ labelKey, value, disabled }) => ({
        label: t(`common:${labelKey}`),
        value,
        disabled,
        customRendererData: { available: !disabled },
      })),
    [projectId, flavorId, microRegion, hasEligibleBackup, t],
  );

  const handleImageTypeChange = (
    field: ControllerRenderProps<
      TInstanceCreationForm,
      'distributionImageType'
    >,
  ) => ({ value }: SelectValueChangeDetail) => {
    const imageType = value[0];

    if (!imageType) return;

    field.onChange(imageType);

    if (imageType === 'backups') {
      resetField('distributionImageVariantId');
      resetField('distributionImageVersion');
      resetField('distributionImageOsType');
    } else {
      setValue('backup', null);
    }

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tile,
      actionType: 'action',
      actions: ['add_instance', 'select_image_type', imageType],
    });
  };

  useEffect(() => {
    const foundImageType = imageTypes.find(
      (type) => type.value === selectedImageType,
    );
    if (!foundImageType || foundImageType.disabled)
      resetField('distributionImageType');
  }, [imageTypes, resetField, selectedImageType]);

  return (
    <div className="mt-4">
      <Controller
        name="distributionImageType"
        control={control}
        render={({ field }) => (
          <FormField className="w-auto max-w-[32%]">
            <FormFieldLabel>
              {t(
                'creation:pci_instance_creation_select_image_distribution_type_label',
              )}
            </FormFieldLabel>
            <Select
              items={imageTypes}
              value={[selectedImageType]}
              onValueChange={handleImageTypeChange(field)}
            >
              <SelectControl />
              <DistributionImageOption badgeKey="common:pci_instances_common_unavailable" />
            </Select>
          </FormField>
        )}
      />
      <Text className="mt-4" preset="paragraph">
        {t(
          'creation:pci_instance_creation_select_image_distribution_type_license_information',
        )}
      </Text>
    </div>
  );
};

export default DistributionImageType;
