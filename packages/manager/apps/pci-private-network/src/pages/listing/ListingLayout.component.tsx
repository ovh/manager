import { useEffect, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PciGuidesHeader,
  useProjectUrl,
  Title,
} from '@ovh-ux/manager-react-components';
import {
  OsdsBreadcrumb,
  OsdsSpinner,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
} from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  PciAnnouncementBanner,
  PciDiscoveryBanner,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { MaintenanceBanner } from '@/components/maintenance/MaintenanceBanner.component';
import { usePrivateNetworks } from '@/data/hooks/networks/useNetworks';
import { useProductMaintenance } from '@/hooks/useMaintenance/useMaintenance';
import { PrivateNetworkTabName } from './ListingLayout.constant';

const ListingLayout: React.FC = () => {
  const { t } = useTranslation('listing');
  const projectUrl = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const projectId = project.project_id;
  const navigate = useNavigate();

  const { isPending, data: networks } = usePrivateNetworks(projectId);

  const regions = useMemo(() => networks?.map((network) => network.region), [
    networks,
  ]);

  const { hasMaintenance, maintenanceURL } = useProductMaintenance(
    projectId,
    regions,
  );

  useEffect(() => {
    if (networks?.length === 0) {
      navigate(`/pci/projects/${projectId}/private-networks/onboarding`);
    }
  }, [networks]);

  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: projectUrl,
            label: project.description,
          },
          {
            label: t('pci_projects_project_network_private'),
          },
        ]}
      />
      <div className="header my-8">
        <div className="flex items-center justify-between">
          <Title>{t('pci_projects_project_network_private')}</Title>
          <PciGuidesHeader category="instances" />
        </div>
      </div>

      <PciAnnouncementBanner projectId={projectId} />

      <div className="mb-5">
        <PciDiscoveryBanner project={project} />

        {hasMaintenance && (
          <div className="mt-5">
            <MaintenanceBanner maintenanceURL={maintenanceURL} />
          </div>
        )}
      </div>

      {isPending ? (
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.lg}
          className="block text-center"
        />
      ) : (
        <>
          <OsdsTabs>
            <OsdsTabBar slot="top">
              <OsdsTabBarItem
                panel={PrivateNetworkTabName.GLOBAL_REGIONS_TAB_NAME}
                className="flex items-center justify-center"
              >
                {t(
                  'pci_projects_project_network_private_global_regions_tab_label',
                )}
              </OsdsTabBarItem>
              <OsdsTabBarItem
                panel={PrivateNetworkTabName.LOCAL_ZONE_TAB_NAME}
                className="flex items-center justify-center"
              >
                {t(
                  'pci_projects_project_network_private_local_zones_tab_label',
                )}
              </OsdsTabBarItem>
            </OsdsTabBar>
            <Outlet />
          </OsdsTabs>
        </>
      )}
    </>
  );
};

export default ListingLayout;
