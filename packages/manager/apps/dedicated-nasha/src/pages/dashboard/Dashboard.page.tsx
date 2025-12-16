import React, { useContext, useState } from 'react';
import { useParams, useHref } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout } from '@ovh-ux/muk';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink,
  Button, 
  Card, 
  Divider, 
  Icon, 
  ICON_NAME, 
  Message, 
  MESSAGE_COLOR,
  Tabs, 
  TabList, 
  Tab, 
  Text,
  TEXT_PRESET,
  BUTTON_VARIANT,
  BUTTON_COLOR
} from '@ovhcloud/ods-react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNasha, useServiceInfo, usePartitionAllocatedSize } from '@/hooks/nasha/useNasha';
import { useNashaEolBanner } from '@/hooks/nasha/useNashaEolBanner';
import { SpaceMeter } from '@/components/SpaceMeter/SpaceMeter.component';
import { NASHA_USE_SIZE_NAME } from '@/App.constants';
import { urls } from '@/routes/Routes.constants';

// Local DashboardTile component using ODS 19
const DashboardTile = ({ title, items, children }: { title: string, items?: { id: string, label?: string, value: React.ReactNode }[], children?: React.ReactNode }) => (
  <Card className="flex flex-col p-4 w-full">
    <Text preset={TEXT_PRESET.heading4} className="mb-4">{title}</Text>
    <Divider className="mb-4" />
    <div className="flex flex-col gap-4">
        {items?.map((item) => (
            <div key={item.id} className="flex flex-col">
                {item.label && <Text preset={TEXT_PRESET.caption} className="font-bold text-gray-500 mb-1">{item.label}</Text>}
                <div className="text-base">
                    {typeof item.value === 'string' ? <Text preset={TEXT_PRESET.paragraph}>{item.value}</Text> : item.value}
                </div>
            </div>
        ))}
        {children}
    </div>
  </Card>
);

export default function DashboardPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation('dashboard');
  const { shell } = useContext(ShellContext);
  
  const { data: nasha, isLoading: isNashaLoading } = useNasha(serviceName || '');
  const { data: serviceInfo, isLoading: isServiceInfoLoading } = useServiceInfo(serviceName || '');
  const { data: partitionAllocatedSize, isLoading: isPartitionSizeLoading } = usePartitionAllocatedSize(serviceName || '');

  const showEolBanner = false; // useNashaEolBanner(nasha);

  const isLoading = isNashaLoading || isServiceInfoLoading || isPartitionSizeLoading;

  const urlListing = useHref(urls.listing);

  if (isLoading) {
    return <div>Loading...</div>; // TODO: Better loader
  }

  if (!nasha || !serviceInfo) {
    return <div>Error loading dashboard</div>;
  }

  // Formatting Logic
  const localeDatacenter = t(`nasha_datacenter_${nasha.datacenter.toLowerCase()}`);
  const diskSizeVal = nasha.use?.[NASHA_USE_SIZE_NAME];
  const diskSize = diskSizeVal ? `${diskSizeVal.value} ${t(`nasha_use_unit_${diskSizeVal.unit}`)}` : '';
  
  const canCreatePartitions = (partitionAllocatedSize || 0) <= nasha.zpoolSize - 10;

  const header = {
    title: nasha.customName || nasha.serviceName,
    description: nasha.serviceName,
  };

  const eolLink = "https://www.ovhcloud.com/en/public-cloud/storage/file-storage-evolution/";

  return (
    <BaseLayout
      header={header}
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href={urlListing}>NAS-HA</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>{serviceName}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      }
      tabs={
        <Tabs value="general">
          <TabList>
            <Tab value="general">
              {t('nasha_dashboard_tab_general_information')}
            </Tab>
            <Tab value="partitions">
                {t('nasha_dashboard_tab_partitions')}
            </Tab>
          </TabList>
        </Tabs>
      }
    >
      {showEolBanner && (
        <Message className="mb-4" color={MESSAGE_COLOR.warning} dismissible>
             <p>{t('nasha_components_eol_lv1_lv2_services_banner_description_part_1', { serviceName: nasha.serviceName })}</p>
             <p>{t('nasha_components_eol_lv1_lv2_services_banner_description_part_2')}</p>
             <a href={eolLink} target="_blank" rel="noopener noreferrer">{t('nasha_components_eol_lv1_lv2_services_banner_info_link')}</a>
        </Message>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
        {/* Information Tile */}
        <DashboardTile
          title={t('nasha_dashboard_information_title')}
          items={[
            {
              id: 'name',
              label: t('nasha_dashboard_information_name'),
              value: (
                <div className="flex justify-between items-center">
                   <Text preset={TEXT_PRESET.span}>{nasha.customName || nasha.serviceName}</Text>
                   <Button
                      variant={BUTTON_VARIANT.ghost}
                      color={BUTTON_COLOR.primary}
                      onClick={() => {
                        // Go to edit name
                      }}
                   >
                     <Icon name={ICON_NAME.pen} />
                   </Button>
                </div>
              )
            },
            {
              id: 'id',
              label: t('nasha_dashboard_information_id'),
              value: nasha.serviceName
            },
            {
              id: 'datacenter',
              label: t('nasha_dashboard_information_datacenter'),
              value: localeDatacenter
            },
            {
              id: 'diskType',
              label: t('nasha_dashboard_information_disk_type'),
              value: nasha.diskType
            },
            {
              id: 'diskSize',
              label: t('nasha_dashboard_information_disk_size'),
              value: diskSize
            }
          ]}
        />

        {/* Configuration Tile */}
        <DashboardTile
             title={t('nasha_dashboard_configuration_title')}
        >
             <div className="mb-4">
                <SpaceMeter usage={nasha.use} maxSize={nasha.zpoolSize} />
             </div>
             <Button
                color={BUTTON_COLOR.primary}
                variant={BUTTON_VARIANT.ghost}
                disabled={!canCreatePartitions}
                onClick={() => {
                    // Navigate to create partition
                }}
             >
                {t('nasha_dashboard_configuration_link')}
                <Icon name={ICON_NAME.arrowRight} className="ml-2"/>
             </Button>
        </DashboardTile>

        {/* Billing Tile */}
        <DashboardTile
            title="Billing"
            items={[
                { id: 'status', label: 'Status', value: serviceInfo.status },
                { id: 'expiration', label: 'Expiration', value: serviceInfo.expiration },
            ]}
        />
      </div>
    </BaseLayout>
  );
}
