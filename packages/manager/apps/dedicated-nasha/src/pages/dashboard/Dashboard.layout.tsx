import React, { useContext, useMemo } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout } from '@ovh-ux/muk';
import { ChangelogButton } from '@ovh-ux/manager-react-components';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  BUTTON_VARIANT,
  BUTTON_COLOR,
  Icon,
  ICON_NAME,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Tabs,
  TabList,
  Tab,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useNasha, useServiceInfo, usePartitionAllocatedSize } from '@/hooks/nasha';
import { EolBanner } from '@/components/EolBanner';
import { urls } from '@/routes/Routes.constants';
import { GUIDES_URL, SIZE_MIN } from '@/constants/nasha.constants';
import { CHANGELOG_LINKS, CHANGELOG_CHAPTERS } from '@/App.constants';
import { prepareNasha } from '@/utils/nasha.utils';
import { useNashaEolBanner } from '@/hooks/nasha/useNashaEolBanner';

export default function DashboardLayout() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(['dashboard', 'common']);
  const { environment, shell } = useContext(ShellContext);

  const { data: nashaRaw, isLoading: isNashaLoading, error: nashaError } = useNasha(
    serviceName || '',
  );
  const { data: serviceInfo, isLoading: isServiceInfoLoading } = useServiceInfo(
    serviceName || '',
  );
  const { data: partitionAllocatedSize } = usePartitionAllocatedSize(
    serviceName || '',
  );

  // Prepare nasha with translations
  const nasha = useMemo(() => {
    if (!nashaRaw) return null;
    return prepareNasha(nashaRaw, t);
  }, [nashaRaw, t]);

  const isLoading = isNashaLoading || isServiceInfoLoading;

  // Determine active tab
  const activeTab = useMemo(() => {
    if (location.pathname.includes('/partitions')) return 'partitions';
    return 'general';
  }, [location.pathname]);

  // Check if user can create partitions
  const canCreatePartitions = useMemo(() => {
    if (!nasha || partitionAllocatedSize === undefined) return false;
    return partitionAllocatedSize <= nasha.zpoolSize - SIZE_MIN;
  }, [nasha, partitionAllocatedSize]);

  const isNashaEolServiceBannerAvailable = useNashaEolBanner(nashaRaw);

  // Get guides URL based on subsidiary
  const ovhSubsidiary = environment?.getUser?.()?.ovhSubsidiary || 'DEFAULT';
  const guidesUrl = GUIDES_URL[ovhSubsidiary] || GUIDES_URL.DEFAULT;

  const handleTabChange = (event: any) => {
    const value = event?.detail?.value;
    if (value === 'general') {
      navigate(urls.dashboard(serviceName!));
    } else if (value === 'partitions') {
      navigate(urls.partitions(serviceName!));
    }
  };

  const handleEditNameClick = () => {
    navigate(urls.editName(serviceName!));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (nashaError || !nasha) {
    return (
      <div className="p-4">
        <Text preset={TEXT_PRESET.paragraph} className="text-red-500">
          {t('common:nasha_error', {
            message: nashaError?.message || 'Failed to load NAS-HA',
          })}
        </Text>
      </div>
    );
  }

  const displayName = nasha.customName || nasha.serviceName;

  return (
    <BaseLayout
      header={{
        title: (
          <div className="flex items-center gap-2">
            <span>{displayName}</span>
            <Button
              variant={BUTTON_VARIANT.ghost}
              color={BUTTON_COLOR.neutral}
              onClick={handleEditNameClick}
              aria-label={t('dashboard:nasha_dashboard_edit')}
            >
              <Icon name={ICON_NAME.pen} />
            </Button>
          </div>
        ),
        changelogButton: (
          <ChangelogButton links={CHANGELOG_LINKS} chapters={[...CHANGELOG_CHAPTERS]} />
        ),
        guideMenu: (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={BUTTON_VARIANT.outline} color={BUTTON_COLOR.neutral}>
                {t('dashboard:nasha_dashboard_guides_header')}
                <Icon name={ICON_NAME.chevronDown} className="ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Link href={guidesUrl} target="_blank" rel="noopener">
                {t('dashboard:nasha_dashboard_guides_title')}
                <Icon name={ICON_NAME.externalLink} className="ml-1" />
              </Link>
            </PopoverContent>
          </Popover>
        ),
      }}
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href={`#${urls.listing}`}>NAS-HA</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>{displayName}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      }
      tabs={
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabList>
            <Tab value="general">
              {t('dashboard:nasha_dashboard_tab_general_information')}
            </Tab>
            <Tab value="partitions">
              {t('dashboard:nasha_dashboard_tab_partitions')}
            </Tab>
          </TabList>
        </Tabs>
      }
    >
      {/* EOL Banner */}
  {isNashaEolServiceBannerAvailable && <EolBanner serviceName={serviceName!} />}

      {/* Outlet for nested routes */}
      <Outlet
        context={{
          nasha,
          serviceInfo,
          serviceName,
          canCreatePartitions,
          partitionAllocatedSize,
        }}
      />
    </BaseLayout>
  );
}

