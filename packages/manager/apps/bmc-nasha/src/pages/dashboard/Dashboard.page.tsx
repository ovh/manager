import { useMemo } from 'react';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  BaseLayout,
  Button,
  ChangelogMenu,
  GuideMenu,
  Tile,
  ActionMenu,
  ICON_NAME,
  Icon,
} from '@ovh-ux/muk';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNashaDetail, useServiceInfo, useCanCreatePartitions } from '@/data/api/hooks/useNashaDetail';
import { useUser } from '@/hooks/useUser';
import { CHANGELOG_LINKS, CHANGELOG_CHAPTERS } from '@/constants/Changelog.constants';
import { GUIDES_URL } from '@/constants/Guides.constants';
import { PREFIX_TRACKING_DASHBOARD } from '@/constants/Nasha.constants';
import { SpaceMeter } from '@/components/space-meter/SpaceMeter.component';

export default function DashboardPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const location = useLocation();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const user = useUser();

  const { data: nasha, isLoading: isNashaLoading } = useNashaDetail(serviceName || '');
  const { data: serviceInfo } = useServiceInfo(serviceName || '');
  const { canCreatePartitions } = useCanCreatePartitions(
    serviceName || '',
    typeof nasha?.zpoolSize === 'number' ? nasha.zpoolSize : undefined,
  );

  const name = useMemo(() => nasha?.customName || nasha?.serviceName || '', [nasha]);
  const guideUrl = useMemo(() => {
    if (!user?.ovhSubsidiary) {
      return GUIDES_URL.DEFAULT;
    }
    return GUIDES_URL[user.ovhSubsidiary as keyof typeof GUIDES_URL] || GUIDES_URL.DEFAULT;
  }, [user?.ovhSubsidiary]);

  const guideItems = useMemo(
    () => [
      {
        id: 1,
        href: guideUrl,
        target: '_blank',
        label: t('nasha_dashboard_guides_title', { defaultValue: 'Guides NAS-HA' }),
      },
    ],
    [guideUrl, t],
  );

  const handleEditName = () => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD, 'edit-name'] });
    navigate(`/${serviceName}/edit-name`);
  };

  const handleGoToPartitionsCreate = () => {
    trackClick({ actions: [PREFIX_TRACKING_DASHBOARD, 'create-partition'] });
    navigate(`/${serviceName}/partitions/create`);
  };

  if (isNashaLoading || !nasha) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BaseLayout
      header={{
        title: name,
        headerButton: (
          <div className="flex items-center gap-2">
            <ChangelogMenu links={CHANGELOG_LINKS} chapters={CHANGELOG_CHAPTERS} />
            <GuideMenu items={guideItems} />
          </div>
        ),
        editButton: (
          <Button variant="ghost" size="sm" onClick={handleEditName} aria-label={t('nasha_dashboard_edit')}>
            <Icon name={ICON_NAME.pen} aria-hidden={true} />
          </Button>
        ),
        subtitle: serviceName,
        tabs: (
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              <NavLink
                to={`/${serviceName}`}
                end
                className={({ isActive }) =>
                  `py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                {t('nasha_dashboard_tab_general_information', { defaultValue: 'General Information' })}
              </NavLink>
              <NavLink
                to={`/${serviceName}/partitions`}
                className={({ isActive }) =>
                  `py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                {t('nasha_dashboard_tab_partitions', { defaultValue: 'Partitions' })}
              </NavLink>
            </nav>
          </div>
        ),
      }}
    >
      <Outlet />
      {/* Default content when no outlet - show General Information */}
      {!location.pathname.includes('/partitions') &&
        !location.pathname.includes('/edit-name') &&
        location.pathname.endsWith(`/${serviceName}`) && (
        <div className="nasha-dashboard-general-information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            {/* Information Tile */}
            <div className="col-span-1">
              <Tile.Root title={t('nasha_dashboard_information_title', { defaultValue: 'Information' })}>
                <Tile.Item.Root>
                  <Tile.Item.Term
                    label={t('nasha_dashboard_information_name', { defaultValue: 'Name' })}
                    actions={
                      <ActionMenu
                        id="edit-name-menu"
                        isCompact
                        popoverPosition="end"
                        items={[
                          {
                            id: 1,
                            label: t('nasha_dashboard_edit', { defaultValue: 'Edit' }),
                            onClick: handleEditName,
                          },
                        ]}
                      />
                    }
                  />
                  <Tile.Item.Description>{name}</Tile.Item.Description>
                </Tile.Item.Root>
                <Tile.Item.Root>
                  <Tile.Item.Term label={t('nasha_dashboard_information_id', { defaultValue: 'ID' })} />
                  <Tile.Item.Description>{nasha.serviceName}</Tile.Item.Description>
                </Tile.Item.Root>
                <Tile.Item.Root>
                  <Tile.Item.Term
                    label={t('nasha_dashboard_information_datacenter', { defaultValue: 'Datacenter' })}
                  />
                  <Tile.Item.Description>{nasha.localeDatacenter}</Tile.Item.Description>
                </Tile.Item.Root>
                <Tile.Item.Root>
                  <Tile.Item.Term
                    label={t('nasha_dashboard_information_disk_type', { defaultValue: 'Disk Type' })}
                  />
                  <Tile.Item.Description>{nasha.diskType}</Tile.Item.Description>
                </Tile.Item.Root>
                <Tile.Item.Root>
                  <Tile.Item.Term
                    label={t('nasha_dashboard_information_disk_size', { defaultValue: 'Disk Size' })}
                  />
                  <Tile.Item.Description divider={false}>{nasha.diskSize}</Tile.Item.Description>
                </Tile.Item.Root>
              </Tile.Root>
            </div>

            {/* Configuration Tile */}
            <div className="col-span-1">
              <Tile.Root title={t('nasha_dashboard_configuration_title', { defaultValue: 'Configuration' })}>
                <Tile.Item.Root>
                  <Tile.Item.Term label={t('nasha_dashboard_configuration_quota', { defaultValue: 'Quota' })} />
                  <Tile.Item.Description>
                    <SpaceMeter usage={nasha.use} large />
                    <Button
                      variant="link"
                      size="m"
                      disabled={!canCreatePartitions}
                      onClick={handleGoToPartitionsCreate}
                      className="mt-2 flex items-center gap-2"
                    >
                      {t('nasha_dashboard_configuration_link', { defaultValue: 'Manage partitions' })}
                      <Icon name={ICON_NAME.arrowRight} aria-hidden={true} />
                    </Button>
                  </Tile.Item.Description>
                </Tile.Item.Root>
              </Tile.Root>
            </div>

            {/* Billing Tile - Simplified version */}
            <div className="col-span-1">
              <Tile.Root title={t('manager_billing_subscription', { defaultValue: 'Billing' })}>
                {serviceInfo && (
                  <>
                    <Tile.Item.Root>
                      <Tile.Item.Term
                        label={t('manager_billing_subscription_creation', { defaultValue: 'Creation date' })}
                      />
                      <Tile.Item.Description>
                        {new Date(serviceInfo.creation).toLocaleDateString()}
                      </Tile.Item.Description>
                    </Tile.Item.Root>
                    <Tile.Item.Root>
                      <Tile.Item.Term
                        label={t('manager_billing_subscription_statut', { defaultValue: 'Status' })}
                      />
                      <Tile.Item.Description divider={false}>{serviceInfo.status}</Tile.Item.Description>
                    </Tile.Item.Root>
                  </>
                )}
              </Tile.Root>
            </div>
          </div>
        </div>
      )}
    </BaseLayout>
  );
}
