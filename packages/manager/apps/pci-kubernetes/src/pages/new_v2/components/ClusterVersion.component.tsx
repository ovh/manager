import { useEffect, useMemo } from 'react';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Badge,
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
  Spinner,
} from '@ovhcloud/ods-react';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';

export const ClusterVersion = () => {
  const { t } = useTranslation(['add', 'versions']);

  const isPending = false;
  const versions = useMemo(() => {
    return ['1.30', '1.31', '1.32', '1.33', '1.34'];
  }, []);

  const { watch, setValue } = useFormContext<TCreateClusterSchema>();
  const selectedVersion = watch('version');

  const reversedVersions = useMemo(() => [...versions].reverse(), [versions]);
  const [latestVersion] = reversedVersions;

  const selectItems = useMemo(() => {
    return reversedVersions.map((version) => ({
      label: t('versions:pci_project_versions_list_version', { version }),
      value: version,
      customRendererData: {
        isRecommended: version === latestVersion,
      },
    }));
  }, [reversedVersions, latestVersion, t]);

  useEffect(() => {
    if (!isPending && !selectedVersion && latestVersion) {
      setValue('version', latestVersion);
    }
  }, [isPending, selectedVersion, latestVersion, setValue]);

  const handleValueChange = (detail: SelectValueChangeDetail) => {
    const selectedValue = detail.value?.[0];
    if (selectedValue) {
      setValue('version', selectedValue);
    }
  };

  if (isPending) {
    return <Spinner size="md" />;
  }

  return (
    <div className="mt-8">
      <FormField className="sm:w-1/2">
        <FormFieldLabel>{t('add:kubernetes_select_version_title')}</FormFieldLabel>
        <Select
          items={selectItems}
          value={selectedVersion ? [selectedVersion] : []}
          onValueChange={handleValueChange}
        >
          <SelectControl name="version" />
          <SelectContent
            customOptionRenderer={({ label, customData }) => (
              <div
                className="flex items-center"
                style={{ gap: 'var(--ods-theme-column-gap, 16px)' }}
              >
                <span>{label}</span>
                {customData?.isRecommended && (
                  <Badge color="information">
                    {t('versions:pci_project_versions_recommended_version_female')}
                  </Badge>
                )}
              </div>
            )}
          />
        </Select>
      </FormField>
    </div>
  );
};
