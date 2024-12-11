import {
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import IpRange from '@/components/ip-range/IpRange.component';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';

const HostRoute: React.FC = () => {
  const { t } = useTranslation('new');
  const {
    setValue,
    watch,
    formState: { touchedFields, errors },
  } = useFormContext<NewPrivateNetworkForm>();

  const hostRoutes = watch('subnet.hostRoutes');
  const targetCidr = hostRoutes?.[0]?.destination;
  const nextHop = hostRoutes?.[0]?.nextHop;

  const isTouched = touchedFields.subnet?.hostRoutes;
  const isErrors = errors.subnet?.hostRoutes?.[0];
  const isTargetCidrHasError = isTouched && !!isErrors?.destination;
  const isNextHopIpHasError = isTouched && !!isErrors?.nextHop;

  const onTargetCidrChange = async ({ target }) =>
    setValue(
      'subnet.hostRoutes',
      [
        {
          destination: target.value as string,
          nextHop,
        },
      ],
      {
        shouldTouch: true,
        shouldValidate: true,
      },
    );

  const onNextHopIpChange = async ({ target }) =>
    setValue(
      'subnet.hostRoutes',
      [
        {
          destination: targetCidr,
          nextHop: target.value as string,
        },
      ],
      {
        shouldTouch: true,
        shouldValidate: true,
      },
    );

  return (
    <div>
      <div className="mb-3">
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          color={ODS_TEXT_COLOR_INTENT.primary}
          hue={ODS_TEXT_COLOR_HUE._800}
          size={ODS_TEXT_SIZE._200}
        >
          {t('pci_projects_project_network_private_host_route')}
        </OsdsText>
      </div>
      <IpRange
        startLabel={t('pci_projects_project_network_private_target_cidr')}
        endLabel={t('pci_projects_project_network_private_nexthop_ip')}
        startPlaceholder="192.168.200.0/24"
        endPlaceholder="10.56.1.1"
        start={targetCidr}
        end={nextHop}
        isStartIpHasError={isTargetCidrHasError}
        isEndIpHasError={isNextHopIpHasError}
        onStartIpChange={onTargetCidrChange}
        onEndIpChange={onNextHopIpChange}
      />
    </div>
  );
};

export default HostRoute;
