import { FC, useMemo } from 'react';
import {
  Badge,
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  Text,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { mockedDistributionImageList } from '@/__mocks__/instance/constants';
import { TInstanceCreationForm } from '../../CreateInstance.page';

const DistributionVersionList: FC = () => {
  const { t } = useTranslation('creation');
  const { control } = useFormContext<TInstanceCreationForm>();
  const [selectedDistributionImage, selectedVersion] = useWatch({
    control,
    name: ['distributionImageName', 'distributionImageVersion'],
  });

  // TODO: will be handle by a view-models
  const versions = useMemo(
    () =>
      mockedDistributionImageList.find(
        ({ id }) => id === selectedDistributionImage,
      )?.versions,
    [selectedDistributionImage],
  );

  if (!versions) return null;

  return (
    <Controller
      name="distributionImageVersion"
      control={control}
      render={({ field }) => (
        <FormField className="mt-8 max-w-[32%]">
          <FormFieldLabel>
            {t(
              'creation:pci_instance_creation_select_image_distribution_version_label',
            )}
          </FormFieldLabel>
          <Select
            items={versions}
            value={selectedVersion ? [selectedVersion] : []}
            onValueChange={({ value }) => field.onChange(value[0])}
          >
            <SelectControl />
            <SelectContent
              className="[&>div>span:first-child]:w-full"
              customOptionRenderer={({ label, customData }) => (
                <div className="flex justify-between items-center w-full py-4">
                  <Text>{label}</Text>
                  {customData?.unavailable && (
                    <Badge
                      className="bg-[--ods-color-neutral-500] text-[--ods-color-element-text-selected] text-xs"
                      color="neutral"
                    >
                      {t(
                        'creation:pci_instance_creation_select_image_distribution_version_unavailable',
                      )}
                    </Badge>
                  )}
                </div>
              )}
            />
          </Select>
        </FormField>
      )}
    />
  );
};

export default DistributionVersionList;
