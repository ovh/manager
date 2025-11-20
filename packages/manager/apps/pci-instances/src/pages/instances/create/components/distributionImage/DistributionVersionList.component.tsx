import { FC, useCallback, useEffect, useMemo } from 'react';
import {
  Badge,
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { mockedDistributionImageVersions } from '@/__mocks__/instance/constants';
import { TInstanceCreationForm } from '../../CreateInstance.page';

type TSelectedVersion = {
  label: string;
  value: string;
  osType: string;
};

const DistributionVersionList: FC = () => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [selectedImageId, selectedVersion] = useWatch({
    control,
    name: ['distributionImageId', 'distributionImageVersion'],
  });

  // TODO: will be handle by a view-models
  const versions = useMemo(
    () =>
      mockedDistributionImageVersions
        .find(({ imageId }) => imageId === selectedImageId)
        ?.versions.map(({ name, osType, unavailable }) => ({
          label: name,
          value: name,
          disabled: !!unavailable,
          osType,
          customRendererData: {
            unavailable,
          },
        })),
    [selectedImageId],
  );

  const updateImageVersionFields = useCallback(
    (version?: TSelectedVersion) => {
      setValue('distributionImageVersion', version?.value ?? null);
      setValue('distributionImageOsType', version?.osType ?? null);
    },
    [setValue],
  );

  const handleSelectVersion = ({ items }: SelectValueChangeDetail) => {
    const version = (items as TSelectedVersion[])[0];
    updateImageVersionFields(version);
  };

  useEffect(() => {
    const version = versions?.find(({ disabled }) => !disabled);

    updateImageVersionFields(version);
  }, [updateImageVersionFields, versions]);

  if (!versions || versions.length <= 1) return null;

  return (
    <Controller
      name="distributionImageVersion"
      control={control}
      render={() => (
        <FormField className="mt-8 max-w-[32%]">
          <FormFieldLabel>
            {t(
              'creation:pci_instance_creation_select_image_distribution_version_label',
            )}
          </FormFieldLabel>
          <Select
            items={versions}
            value={selectedVersion ? [selectedVersion] : []}
            onValueChange={handleSelectVersion}
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
