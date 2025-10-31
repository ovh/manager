import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  BaseLayout,
  Button,
  Tile,
  ActionMenu,
  ICON_NAME,
  Icon,
} from '@ovh-ux/muk';
import { NavLink } from 'react-router-dom';
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

  // Determine route prefix based on current URL - supports both /partition/:name and /partitions/:name
  const routePrefix = location.pathname.includes('/partition/') && !location.pathname.includes('/partitions/')
    ? `/${serviceName}/partition/${partitionName}`
    : `/${serviceName}/partitions/${partitionName}`;

  const handleEditDescription = () => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'edit-description'] });
    navigate(`${routePrefix}/edit-description`);
  };

  const handleEditSize = () => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'edit-size'] });
    navigate(`${routePrefix}/edit-size`);
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
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              <NavLink
                to={routePrefix}
                end
                className={({ isActive }) =>
                  `py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                {t('nasha_dashboard_partition_tab_general_information', {
                  defaultValue: 'General Information',
                })}
              </NavLink>
              <NavLink
                to={`${routePrefix}/snapshots`}
                className={({ isActive }) =>
                  `py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                {t('nasha_dashboard_partition_tab_snapshots', { defaultValue: 'Snapshots' })}
              </NavLink>
              <NavLink
                to={`${routePrefix}/accesses`}
                className={({ isActive }) =>
                  `py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                {t('nasha_dashboard_partition_tab_accesses', { defaultValue: 'Accesses' })}
              </NavLink>
            </nav>
          </div>
        ),
      }}
    >
      <Outlet />
      {/* Default content when no outlet - show General Information */}
      {!location.pathname.includes('/snapshots') &&
        !location.pathname.includes('/accesses') &&
        !location.pathname.includes('/edit-description') &&
        !location.pathname.includes('/edit-size') &&
        (location.pathname.endsWith(`/partition/${partitionName}`) ||
          location.pathname.endsWith(`/partitions/${partitionName}`)) && (
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
                            <ActionMenu
                              id="edit-description-menu"
                              isCompact
                              popoverPosition="end"
                              items={[
                                {
                                  id: 1,
                                  label: t('nasha_dashboard_partition_edit', { defaultValue: 'Edit' }),
                                  onClick: handleEditDescription,
                                },
                              ]}
                            />
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
                            <ActionMenu
                              id="edit-size-menu"
                              isCompact
                              popoverPosition="end"
                              items={[
                                {
                                  id: 2,
                                  label: t('nasha_dashboard_partition_edit', { defaultValue: 'Edit' }),
                                  onClick: handleEditSize,
                                },
                              ]}
                            />
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
