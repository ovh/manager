import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  BaseLayout,
  Button,
  Tile,
  Tabs,
  TabList,
  Tab,
  ActionMenu,
  ICON_NAME,
  Icon,
} from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { usePartitionDetail } from '@/data/api/hooks/usePartitionDetail';
import { useNashaDetail } from '@/data/api/hooks/useNashaDetail';
import { SpaceMeter } from '@/components/space-meter/SpaceMeter.component';
import { PREFIX_TRACKING_DASHBOARD_PARTITIONS } from '@/constants/Nasha.constants';

export default function PartitionPage() {
  const { serviceName, partitionName } = useParams<{ serviceName: string; partitionName: string }>();
  const location = useLocation();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: nasha } = useNashaDetail(serviceName || '');
  const { data: partition, isLoading: isPartitionLoading } = usePartitionDetail(
    serviceName || '',
    partitionName || '',
  );

  const handleEditDescription = () => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'edit-description'] });
    navigate(`/${serviceName}/partitions/${partitionName}/edit-description`);
  };

  const handleEditSize = () => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'edit-size'] });
    navigate(`/${serviceName}/partitions/${partitionName}/edit-size`);
  };

  if (isPartitionLoading || !partition || !nasha) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BaseLayout
      header={{
        title: partition.partitionName,
        subtitle: nasha.serviceName,
        tabs: (
          <Tabs>
            <TabList>
              <Tab
                to={`/${serviceName}/partitions/${partitionName}`}
                isActive={
                  location.pathname.endsWith(`/partitions/${partitionName}`) &&
                  !location.pathname.includes('/snapshots') &&
                  !location.pathname.includes('/accesses')
                }
              >
                {t('nasha_dashboard_partition_tab_general_information', {
                  defaultValue: 'General Information',
                })}
              </Tab>
              <Tab
                to={`/${serviceName}/partitions/${partitionName}/snapshots`}
                isActive={location.pathname.includes('/snapshots')}
              >
                {t('nasha_dashboard_partition_tab_snapshots', { defaultValue: 'Snapshots' })}
              </Tab>
              <Tab
                to={`/${serviceName}/partitions/${partitionName}/accesses`}
                isActive={location.pathname.includes('/accesses')}
              >
                {t('nasha_dashboard_partition_tab_accesses', { defaultValue: 'Accesses' })}
              </Tab>
            </TabList>
          </Tabs>
        ),
      }}
    >
      <Outlet />
      {/* Default content when no outlet - show General Information */}
      {!location.pathname.includes('/snapshots') &&
        !location.pathname.includes('/accesses') &&
        !location.pathname.includes('/edit-description') &&
        !location.pathname.includes('/edit-size') &&
        location.pathname.endsWith(`/partitions/${partitionName}`) && (
          <div className="nasha-dashboard-partition-general-information">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              {/* Information Tile */}
              <div className="col-span-1">
                <Tile.Root
                  title={t('nasha_dashboard_partition_information_title', {
                    defaultValue: 'Information',
                  })}
                >
                  <Tile.Item.Root>
                    <Tile.Item.Term
                      label={t('nasha_dashboard_partition_information_name', {
                        defaultValue: 'Name',
                      })}
                    />
                    <Tile.Item.Description>{partition.partitionName}</Tile.Item.Description>
                  </Tile.Item.Root>
                  <Tile.Item.Root>
                    <Tile.Item.Term
                      label={t('nasha_dashboard_partition_information_description', {
                        defaultValue: 'Description',
                      })}
                      actions={
                        <ActionMenu compact placement="end">
                          <ActionMenu.Item onClick={handleEditDescription}>
                            {t('nasha_dashboard_partition_edit', { defaultValue: 'Edit' })}
                          </ActionMenu.Item>
                        </ActionMenu>
                      }
                    />
                    <Tile.Item.Description>
                      {partition.partitionDescription || (
                        <em className="text-gray-500">
                          {t('nasha_dashboard_partition_information_description_none', {
                            defaultValue: 'No description',
                          })}
                        </em>
                      )}
                    </Tile.Item.Description>
                  </Tile.Item.Root>
                  <Tile.Item.Root>
                    <Tile.Item.Term
                      label={t('nasha_dashboard_partition_information_protocol', {
                        defaultValue: 'Protocol',
                      })}
                    />
                    <Tile.Item.Description>{partition.protocol}</Tile.Item.Description>
                  </Tile.Item.Root>
                  <Tile.Item.Root>
                    <Tile.Item.Term
                      label={t('nasha_dashboard_partition_information_size', {
                        defaultValue: 'Size',
                      })}
                      actions={
                        <ActionMenu compact placement="end">
                          <ActionMenu.Item onClick={handleEditSize}>
                            {t('nasha_dashboard_partition_edit', { defaultValue: 'Edit' })}
                          </ActionMenu.Item>
                        </ActionMenu>
                      }
                    />
                    <Tile.Item.Description>
                      {partition.use?.size && (
                        <>
                          <span>{partition.use.size.value.toFixed(2)}</span>
                          <span className="ml-1">{partition.use.size.unit}</span>
                        </>
                      )}
                    </Tile.Item.Description>
                  </Tile.Item.Root>
                  <Tile.Item.Root>
                    <Tile.Item.Term
                      label={t('nasha_dashboard_partition_information_quota', {
                        defaultValue: 'Quota',
                      })}
                    />
                    <Tile.Item.Description divider={false}>
                      {partition.use && <SpaceMeter usage={partition.use} large />}
                    </Tile.Item.Description>
                  </Tile.Item.Root>
                </Tile.Root>
              </div>
            </div>
          </div>
        )}
    </BaseLayout>
  );
}
