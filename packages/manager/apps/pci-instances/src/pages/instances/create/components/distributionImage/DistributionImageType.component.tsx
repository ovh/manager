import { FC } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
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
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';
import {
  mockedDistributionImageList,
  mockedDistributionImageType,
} from '@/__mocks__/instance/constants';
import { TInstanceCreationForm } from '../../CreateInstance.page';

const DistributionImageType: FC = () => {
  const { t } = useTranslation('creation');
  const { trackClick } = useOvhTracking();
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const selectedImageType = useWatch({
    control,
    name: 'distributionImageType',
  });

  const handleImageTypeChange = ({ value }: SelectValueChangeDetail) => {
    const imageType = value[0];

    if (!imageType) return;

    const distributionImageName =
      mockedDistributionImageList.find(({ type }) => type === imageType)?.id ??
      null;

    setValue('distributionImageType', imageType);
    setValue('distributionImageName', distributionImageName);

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tab,
      actionType: 'action',
      actions: ['add_instance', 'select_image', imageType],
    });
  };

  return (
    <div className="mt-4">
      <Controller
        name="distributionImageType"
        control={control}
        render={() => (
          <FormField className="max-w-[32%]">
            <FormFieldLabel>
              {t(
                'creation:pci_instance_creation_select_image_distribution_type_label',
              )}
            </FormFieldLabel>
            <Select
              items={mockedDistributionImageType}
              value={selectedImageType ? [selectedImageType] : []}
              onValueChange={handleImageTypeChange}
            >
              <SelectControl />
              <SelectContent />
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
