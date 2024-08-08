import { useState } from 'react';
import clsx from 'clsx';
import {
  OsdsChip,
  OsdsSpinner,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_CHIP_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useGetCloudSchema } from '@/api/hooks/useCloud';

export const tileClass =
  'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]';

export const selectedTileClass =
  'font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]';

export interface VersionSelectorProps {
  onSelectVersion: (version: string) => void;
}

export function VersionSelector({
  onSelectVersion,
}: Readonly<VersionSelectorProps>) {
  const { t } = useTranslation('versions');
  const { data: schema, isPending } = useGetCloudSchema();
  const [selectedVersion, setSelectedVersion] = useState('');
  const versions = schema?.models['cloud.kube.VersionEnum'].enum || [];
  const lastVersion = [...versions].pop();

  const selectVersion = (version: string) => {
    if (version) {
      setSelectedVersion(version);
      onSelectVersion(version);
    }
  };

  if (isPending) {
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <div className="grid gap-6 list-none grid-cols-1 md:grid-cols-3">
      {versions?.map((version) => (
        <OsdsTile
          key={version}
          className={clsx(
            tileClass,
            version === selectedVersion && selectedTileClass,
          )}
          onClick={() => selectVersion(version)}
        >
          <OsdsText
            className="my-3"
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={
              version === selectedVersion
                ? ODS_TEXT_SIZE._500
                : ODS_TEXT_SIZE._400
            }
          >
            {t('pci_project_versions_list_version', { version })}
            {version === lastVersion && (
              <OsdsChip
                className="mt-4"
                color={ODS_THEME_COLOR_INTENT.success}
                size={ODS_CHIP_SIZE.sm}
              >
                {t('pci_project_versions_recommended_version')}
              </OsdsChip>
            )}
          </OsdsText>
        </OsdsTile>
      ))}
    </div>
  );
}
