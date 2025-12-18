import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Card,
  Icon,
  ICON_NAME,
  Link,
  Switch,
  SwitchControl,
  SwitchLabel,
  Text,
  TEXT_PRESET,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { SpaceMeter } from '@/components/SpaceMeter';
import type { Nasha, NashaServiceInfo } from '@/types/nasha.type';

interface MetricsProps {
  nasha: Nasha;
  serviceInfo: NashaServiceInfo;
  urlRenew: string;
  onRenewClick?: () => void;
  monitoredDisabled?: boolean;
  onMonitoredChanged?: (monitored: boolean) => void;
}

export const Metrics: React.FC<MetricsProps> = ({
  nasha,
  serviceInfo,
  urlRenew,
  onRenewClick,
  monitoredDisabled = false,
  onMonitoredChanged,
}) => {
  const { t } = useTranslation('components');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleMonitoredChange = (checked: boolean) => {
    onMonitoredChanged?.(checked);
  };

  return (
    <Card className="p-5 mb-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* IP */}
          <div>
            <Text
              preset={TEXT_PRESET.caption}
              className="font-semibold text-gray-500 mb-1 block"
            >
              {t('nasha_components_metrics_ip')}
            </Text>
            <Text preset={TEXT_PRESET.paragraph}>{nasha.ip}</Text>
          </div>

          {/* Datacenter */}
          <div>
            <Text
              preset={TEXT_PRESET.caption}
              className="font-semibold text-gray-500 mb-1 block"
            >
              {t('nasha_components_metrics_datacenter')}
            </Text>
            <Text preset={TEXT_PRESET.paragraph}>
              {nasha.localeDatacenter || nasha.datacenter}
            </Text>
          </div>

          {/* Capacity */}
          <div>
            <Text
              preset={TEXT_PRESET.caption}
              className="font-semibold text-gray-500 mb-1 block"
            >
              {t('nasha_components_metrics_capacity')}
            </Text>
            <SpaceMeter usage={nasha.use} legend large />
            <Text
              preset={TEXT_PRESET.caption}
              className="text-gray-400 italic mt-2 block"
            >
              {t('nasha_components_metrics_capacity_delay_text')}
            </Text>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Creation Date */}
          <div>
            <Text
              preset={TEXT_PRESET.caption}
              className="font-semibold text-gray-500 mb-1 block"
            >
              {t('nasha_components_metrics_creation_date')}
            </Text>
            <Text preset={TEXT_PRESET.paragraph}>
              {formatDate(serviceInfo.creation)}
            </Text>
          </div>

          {/* Expiration Date */}
          <div>
            <Text
              preset={TEXT_PRESET.caption}
              className="font-semibold text-gray-500 mb-1 block"
            >
              {t('nasha_components_metrics_expiration_date')}
            </Text>
            <Text preset={TEXT_PRESET.paragraph} className="block mb-2">
              {formatDate(serviceInfo.expiration)}
            </Text>
            <Link
              href={urlRenew}
              target="_top"
              onClick={onRenewClick}
              className="inline-flex items-center gap-1"
            >
              {t('nasha_components_metrics_renew')}
              <Icon name={ICON_NAME.arrowRight} />
            </Link>
          </div>

          {/* Usage Notification */}
          <div>
            <Text
              preset={TEXT_PRESET.caption}
              className="font-semibold text-gray-500 mb-1 block"
            >
              {t('nasha_components_metrics_space_usage')}
            </Text>
            <div className="flex items-center gap-2">
              <Switch
                checked={nasha.monitored}
                disabled={monitoredDisabled}
                onCheckedChange={handleMonitoredChange}
              >
                <SwitchControl />
                <SwitchLabel className="sr-only">
                  {t('nasha_components_metrics_space_usage')}
                </SwitchLabel>
              </Switch>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant={BUTTON_VARIANT.ghost}
                    color={BUTTON_COLOR.neutral}
                    className="p-0"
                  >
                    <Icon
                      name={ICON_NAME.circleQuestion}
                      className="text-gray-400"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t('nasha_components_metrics_space_usage_help')}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Metrics;

