import { useTranslation } from 'react-i18next';
import { OsdsChip, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import {
  Region3AZChip,
  RegionGlobalzoneChip,
  RegionLocalzoneChip,
} from '@ovh-ux/manager-pci-common';
import { clsx } from 'clsx';
import { TCatalogGroup } from '@/api/data/catalog';

export const RegionChipByGroupName = ({
  group,
}: Readonly<{ group: TCatalogGroup }>) => {
  switch (group.name) {
    case 'localzone':
      return <RegionLocalzoneChip showTooltip={false} />;
    case 'region':
      return <RegionGlobalzoneChip showTooltip={false} />;
    case 'region-3-az':
      return <Region3AZChip showTooltip={false} />;
    default:
      return null;
  }
};

interface DeploymentModeTileProps {
  group: TCatalogGroup;
  selected?: boolean;
}

export function DeploymentModeTile({
  group,
  selected,
}: Readonly<DeploymentModeTileProps>) {
  const { t } = useTranslation(['add', 'common']);

  return (
    <div
      className="flex flex-col w-full items-center"
      style={{ minHeight: '164px' }}
    >
      <div className="mb-4">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          className={clsx('leading-8', selected && 'font-bold')}
        >
          {t(
            `pci_projects_project_storages_blocks_add_deployment_mode_title_${group.name}`,
          )}
        </OsdsText>
      </div>
      <div className="mb-3">
        <RegionChipByGroupName group={group} />
      </div>
      <div className="mb-3 text-center">
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t(
            `pci_projects_project_storages_blocks_add_deployment_mode_description_${group.name}`,
          )}
        </OsdsText>
      </div>
      <div>
        {group.tags.includes('is_new') && (
          <div>
            <OsdsChip
              className="m-3"
              color={ODS_THEME_COLOR_INTENT.success}
              size={ODS_CHIP_SIZE.sm}
              inline
            >
              {t('common:pci_projects_project_storages_blocks_new')}
            </OsdsChip>
            <OsdsText
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
              className="uppercase font-bold"
            >
              {t('pci_projects_project_storages_blocks_add_beta_free')}
            </OsdsText>
          </div>
        )}
      </div>
    </div>
  );
}
