import {
  Badge,
  BADGE_COLOR,
  BADGE_SIZE,
  Icon,
  Radio,
  RadioControl,
  Text,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { TableRow } from '@/components/flavorsTable/FlavorsTable.component';
import { DeploymentModeBadge } from '@/components/deploymentModeBadge/DeploymentModeBadge.component';
import { TFlavorForTable } from '@/pages/instances/create/view-models/flavorsViewModel';

export const FlavorRowsBuilder = (flavors: TFlavorForTable[]): TableRow[] => {
  const { t } = useTranslation('creation');

  return flavors.map((flavor) => ({
    id: flavor.name,
    disabled: flavor.unavailable || flavor.unavailableQuota,
    action: (
      <Radio
        value={flavor.name}
        className="w-full"
        disabled={flavor.unavailable || flavor.unavailableQuota}
      >
        <RadioControl />
      </Radio>
    ),
    name: (
      <div className="flex flex-row gap-4 w-full h-full flex-wrap items-center content-start">
        <Text className="font-normal">{flavor.name}</Text>
        {(flavor.unavailable || flavor.unavailableQuota) && (
          <Badge
            size={BADGE_SIZE.sm}
            color={BADGE_COLOR.warning}
            className="h-fit text-wrap font-normal"
          >
            {flavor.unavailable
              ? t('pci_instance_creation_flavor_unavailable')
              : t('pci_instance_creation_flavor_unavailable_quota')}
            <Icon aria-label="Info" name="circle-info" role="img" />
          </Badge>
        )}
      </div>
    ),
    memory: <Text>{flavor.memory}</Text>,
    vcore: <Text>{flavor.vcore}</Text>,
    storage: <Text>{flavor.storage}</Text>,
    mode: <DeploymentModeBadge mode={flavor.mode} size={BADGE_SIZE.sm} />,
    priceHour: (
      <Text className="font-semibold">{flavor.priceHour.toFixed(4)} €</Text>
    ),
    priceMonth: (
      <Text className="font-semibold">{flavor.priceMonth.toFixed(2)} €</Text>
    ),
  }));
};
