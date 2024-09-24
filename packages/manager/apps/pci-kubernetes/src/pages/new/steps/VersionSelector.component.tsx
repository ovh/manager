import { useEffect, useMemo } from 'react';
import {
  OsdsSelectOption,
  OsdsSpinner,
  OsdsSelect,
  OsdsChip,
  OsdsText,
  OsdsFormField,
} from '@ovhcloud/ods-components/react';
import {
  ODS_CHIP_SIZE,
  ODS_SELECT_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useGetCloudSchema } from '@/api/hooks/useCloud';

export interface VersionSelectorProps {
  onSelectVersion: (version: string) => void;
  versionSelected: string;
}

export function VersionSelector({
  versionSelected,
  onSelectVersion,
}: Readonly<VersionSelectorProps>) {
  const { t } = useTranslation();
  const { data: schema, isPending } = useGetCloudSchema();
  const versions = schema?.models['cloud.kube.VersionEnum'].enum || [];

  const reverseVersion = useMemo(() => [...versions].reverse(), [versions]);
  const [lastVersion] = reverseVersion;

  useEffect(() => {
    // If the request for fetching last versions is not pending and no version has been selected, select the last version by default
    if (!isPending && !versionSelected) {
      onSelectVersion(lastVersion);
    }
  }, [versionSelected, isPending]);

  if (isPending) {
    return (
      <OsdsSpinner
        data-testid="version-selector-spinner"
        inline
        size={ODS_SPINNER_SIZE.md}
      />
    );
  }

  return (
    <div className="grid gap-6 list-none grid-cols-1 md:grid-cols-3">
      {versionSelected && (
        <OsdsFormField className="mt-2">
          <OsdsText
            slot="label"
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('add:kubernetes_select_version_title')}
          </OsdsText>
          <OsdsSelect
            data-testid="version-selector-select"
            aria-label={t('add:kubernetes_select_version_title')}
            id="select-version"
            name="version"
            size={ODS_SELECT_SIZE.md}
            value={versionSelected}
            onOdsValueChange={({ detail }) => {
              if (typeof detail.value === 'string') {
                onSelectVersion(detail.value);
              }
            }}
          >
            {reverseVersion.map((version) => (
              <OsdsSelectOption key={version} value={version}>
                <div className="flex gap-4 items-baseline">
                  {`${t('versions:pci_project_versions_list_version', {
                    version,
                  })} `}
                  {version === lastVersion && (
                    <OsdsChip
                      color={ODS_THEME_COLOR_INTENT.success}
                      size={ODS_CHIP_SIZE.sm}
                    >
                      {t('versions:pci_project_versions_recommended_version')}
                    </OsdsChip>
                  )}
                </div>
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </OsdsFormField>
      )}
    </div>
  );
}
