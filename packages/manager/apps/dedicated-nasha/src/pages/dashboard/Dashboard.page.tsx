import React, { useContext } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Card,
  Divider,
  Icon,
  ICON_NAME,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { SpaceMeter } from '@/components/SpaceMeter';
import { BillingInformationsTile } from '@/components/BillingInformationsTile';
import { urls } from '@/routes/Routes.constants';
import { PREFIX_TRACKING_DASHBOARD } from '@/constants/nasha.constants';
import type { Nasha, NashaServiceInfo } from '@/types/nasha.type';

interface DashboardContext {
  nasha: Nasha & { localeDatacenter: string; diskSize: string };
  serviceInfo: NashaServiceInfo;
  serviceName: string;
  canCreatePartitions: boolean;
}

// Dashboard Tile Component
const DashboardTile: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <Card className="w-full">
    <div className="p-6 h-full flex flex-col">
      <Text preset={TEXT_PRESET.heading5} className="mb-4">
        {title}
      </Text>
      <Divider className="mb-4" />
      <div className="flex-1">{children}</div>
    </div>
  </Card>
);

// Tile Item Component
const TileItem: React.FC<{
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
}> = ({ label, value, action }) => (
  <div className="mb-4">
    <Text
      preset={TEXT_PRESET.caption}
      className="font-semibold text-gray-500 mb-1 block"
    >
      {label}
    </Text>
    <div className="flex justify-between items-start">
      <div className="flex-1">
        {typeof value === 'string' ? (
          <Text preset={TEXT_PRESET.paragraph}>{value}</Text>
        ) : (
          value
        )}
      </div>
      {action && <div className="ml-2">{action}</div>}
    </div>
  </div>
);

export default function DashboardPage() {
  const { nasha, serviceName, canCreatePartitions } =
    useOutletContext<DashboardContext>();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { shell } = useContext(ShellContext);

  const handleEditNameClick = () => {
    navigate(urls.editName(serviceName));
  };

  const handleCreatePartitionClick = () => {
    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD}::create-partition`,
      type: 'action',
    });
    navigate(urls.partitionsCreate(serviceName));
  };

  const displayName = nasha.customName || nasha.serviceName;

  return (
    <div className="grid grid-cols-3 gap-4 py-6">
      <div className="h-full">
        <DashboardTile title={t('nasha_dashboard_information_title')}>
          <TileItem
            label={t('nasha_dashboard_information_name')}
            value={displayName}
            action={
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={BUTTON_VARIANT.ghost}
                    color={BUTTON_COLOR.neutral}
                    aria-label={t('nasha_dashboard_actions')}
                  >
                    <Icon name={ICON_NAME.ellipsisVertical} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Button
                    variant={BUTTON_VARIANT.ghost}
                    color={BUTTON_COLOR.neutral}
                    onClick={handleEditNameClick}
                    className="w-full justify-start"
                  >
                    {t('nasha_dashboard_edit')}
                  </Button>
                </PopoverContent>
              </Popover>
            }
          />
          <TileItem
            label={t('nasha_dashboard_information_id')}
            value={nasha.serviceName}
          />
          <TileItem
            label={t('nasha_dashboard_information_datacenter')}
            value={nasha.localeDatacenter}
          />
          <TileItem
            label={t('nasha_dashboard_information_disk_type')}
            value={nasha.diskType}
          />
          <TileItem
            label={t('nasha_dashboard_information_disk_size')}
            value={nasha.diskSize}
          />
        </DashboardTile>
      </div>
      <div className="h-full">
        <DashboardTile title={t('nasha_dashboard_configuration_title')}>
          <TileItem
            label={t('nasha_dashboard_configuration_quota')}
            value={<SpaceMeter usage={nasha.use} large />}
          />
          <Button
            variant={BUTTON_VARIANT.ghost}
            color={BUTTON_COLOR.primary}
            disabled={!canCreatePartitions}
            onClick={handleCreatePartitionClick}
            className="mt-4"
          >
            {t('nasha_dashboard_configuration_link')}
            <Icon name={ICON_NAME.arrowRight} className="ml-2" />
          </Button>
        </DashboardTile>
      </div>
      <div className="h-full">
        <BillingInformationsTile resourceName={serviceName} />
      </div>
    </div>
  );
}
