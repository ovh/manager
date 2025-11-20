import { useCallback, useEffect } from 'react';
import {
  Badge,
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  SelectCustomOptionRendererArg,
  SelectOptionItem,
  SelectValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../../CreateInstance.page';
import {
  TAvailableOption,
  TCustomData,
} from '../../view-models/imagesViewModel';

type TDistributionVersionList = {
  versions: SelectOptionItem<TCustomData>[];
};

const DistributionVersionList = ({ versions }: TDistributionVersionList) => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const selectedVersion = useWatch({
    control,
    name: 'distributionImageVersion',
  });

  const updateImageVersionFields = useCallback(
    (version: SelectOptionItem | null) => {
      setValue('distributionImageVersion', {
        distributionImageVersionId: version?.value ?? null,
        distributionImageVersionName: version?.label ?? null,
      });
    },
    [setValue],
  );

  const handleSelectVersion = ({ items }: SelectValueChangeDetail) => {
    const version = (items as TAvailableOption[])[0];
    updateImageVersionFields(version ?? null);
  };

  useEffect(() => {
    const foundVersion = versions.find(
      ({ value }) => value === selectedVersion.distributionImageVersionId,
    );
    if (!foundVersion) {
      const firstAvailableVersion = versions.find(
        ({ customRendererData }) => customRendererData?.available,
      );
      updateImageVersionFields(firstAvailableVersion ?? null);
    }
  }, [
    selectedVersion.distributionImageVersionId,
    updateImageVersionFields,
    versions,
  ]);

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
            value={
              selectedVersion.distributionImageVersionId
                ? [selectedVersion.distributionImageVersionId]
                : []
            }
            onValueChange={handleSelectVersion}
          >
            <SelectControl />
            <SelectContent
              className="[&>div>span:first-child]:w-full"
              customOptionRenderer={({
                label,
                customData,
              }: SelectCustomOptionRendererArg) => (
                <div className="flex justify-between items-center w-full py-4">
                  <Text>{label}</Text>
                  {!(customData as TCustomData).available && (
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
