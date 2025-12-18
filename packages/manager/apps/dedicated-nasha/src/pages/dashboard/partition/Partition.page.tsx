import React from 'react';
import { useOutletContext, useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { urls } from '@/routes/Routes.constants';
import type { Nasha, NashaPartition } from '@/types/nasha.type';

interface PartitionContext {
  nasha: Nasha;
  partition: NashaPartition;
  serviceName: string;
  partitionName: string;
}

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

export default function PartitionPage() {
  const { nasha, partition, serviceName, partitionName } =
    useOutletContext<PartitionContext>();
  const { t } = useTranslation('partition');
  const navigate = useNavigate();

  const handleEditDescriptionClick = () => {
    navigate(urls.partitionEditDescription(serviceName, partitionName));
  };

  const handleEditSizeClick = () => {
    navigate(urls.partitionEditSize(serviceName, partitionName));
  };

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Information Tile */}
        <Card className="p-4">
          <Text preset={TEXT_PRESET.heading5} className="mb-4">
            {t('nasha_dashboard_partition_information_title')}
          </Text>
          <Divider className="mb-4" />

          {/* Name */}
          <TileItem
            label={t('nasha_dashboard_partition_information_name')}
            value={partition.partitionName}
          />

          {/* Description */}
          <TileItem
            label={t('nasha_dashboard_partition_information_description')}
            value={
              partition.partitionDescription ? (
                <Text preset={TEXT_PRESET.paragraph}>
                  {partition.partitionDescription}
                </Text>
              ) : (
                <Text preset={TEXT_PRESET.paragraph} className="italic text-gray-400">
                  {t('nasha_dashboard_partition_information_description_none')}
                </Text>
              )
            }
            action={
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={BUTTON_VARIANT.ghost}
                    color={BUTTON_COLOR.neutral}
                    aria-label={t('nasha_dashboard_partition_actions')}
                  >
                    <Icon name={ICON_NAME.ellipsisVertical} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Button
                    variant={BUTTON_VARIANT.ghost}
                    color={BUTTON_COLOR.neutral}
                    onClick={handleEditDescriptionClick}
                    className="w-full justify-start"
                  >
                    {t('nasha_dashboard_partition_edit')}
                  </Button>
                </PopoverContent>
              </Popover>
            }
          />

          {/* Protocol */}
          <TileItem
            label={t('nasha_dashboard_partition_information_protocol')}
            value={partition.protocol}
          />

          {/* Size */}
          <TileItem
            label={t('nasha_dashboard_partition_information_size')}
            value={
              partition.use?.size ? (
                <Text preset={TEXT_PRESET.paragraph}>
                  {partition.use.size.value} {partition.use.size.unit}
                </Text>
              ) : (
                '-'
              )
            }
            action={
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={BUTTON_VARIANT.ghost}
                    color={BUTTON_COLOR.neutral}
                    aria-label={t('nasha_dashboard_partition_actions')}
                  >
                    <Icon name={ICON_NAME.ellipsisVertical} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Button
                    variant={BUTTON_VARIANT.ghost}
                    color={BUTTON_COLOR.neutral}
                    onClick={handleEditSizeClick}
                    className="w-full justify-start"
                  >
                    {t('nasha_dashboard_partition_edit')}
                  </Button>
                </PopoverContent>
              </Popover>
            }
          />

          {/* Quota */}
          {partition.use && (
            <TileItem
              label={t('nasha_dashboard_partition_information_quota')}
              value={<SpaceMeter usage={partition.use} large />}
            />
          )}
        </Card>
      </div>

      {/* Outlet for modals */}
      <Outlet />
    </div>
  );
}

