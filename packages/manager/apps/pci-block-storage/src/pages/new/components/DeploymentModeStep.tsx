import { useParams } from 'react-router-dom';
import {
  OsdsChip,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_CHIP_SIZE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useMemo, useState } from 'react';
import { TilesInputComponent } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { mapPricesToGroups } from '@/api/data/catalog';
import { useVolumeCatalog } from '@/api/hooks/useCatalog';

export const DeploymentModeStep = () => {
  const { t } = useTranslation(['add', 'common']);
  const { projectId } = useParams();

  const { data, isPending } = useVolumeCatalog(projectId);

  const mappedGroups = useMemo(
    () =>
      data
        ? mapPricesToGroups(data.regionsGroups, data.regions, data.models)
        : [],
    [data],
  );

  const [selectedRegionGroup, setSelectedRegionGroup] = useState<
    null | ReturnType<typeof mapPricesToGroups>[number]
  >(null);

  if (isPending) return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;

  return (
    <div>
      <TilesInputComponent<ReturnType<typeof mapPricesToGroups>[number]>
        items={mappedGroups}
        value={selectedRegionGroup}
        onInput={setSelectedRegionGroup}
        label={(group) => (
          <div className="w-full">
            <div className="border-solid border-0 border-b border-b-[#85d9fd] py-3 d-flex">
              <OsdsText>
                {t(
                  `pci_projects_project_storages_blocks_add_deployment_mode_title_${group.name}`,
                )}
              </OsdsText>
            </div>
            <div className="py-3">
              {group.tags.includes('is_new') ? (
                <div>
                  <OsdsChip
                    className="ms-3"
                    color={ODS_THEME_COLOR_INTENT.success}
                    size={ODS_CHIP_SIZE.sm}
                    inline
                  >
                    {t('common:pci_projects_project_storages_blocks_new')}
                  </OsdsChip>
                  Gratuit
                </div>
              ) : (
                group.leastPrice !== null &&
                t(
                  'pci_projects_project_storages_blocks_add_deployment_mode_price_from',
                  { price: group.leastPrice },
                )
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
};
