import { useCallback } from 'react';
import JSURL from 'jsurl';
import {
  useEnvironment,
  useTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { getExpressOrderURL } from '@ovh-ux/manager-module-order';
import { PCI_LEVEL2 } from '@/tracking.constants';
import { useMe } from '@/api/hooks/useMe';
import { createFloatingIp } from '@/api/hooks/useCreateFloatingIp';
import { createBasicIp } from '@/api/data/basic-ip';
import { StepIdsEnum } from '@/api/types';
import { useOrderStore } from './useStore';
import { PublicIp } from '@/types/publicip.type';

// Missing the publicIp/extNet/create IAM action reads as a plain failure otherwise
const FORBIDDEN_STATUS = 403;

const FIRST_STEP_BY_IP_TYPE: Record<PublicIp, StepIdsEnum> = {
  [PublicIp.FAILOVER]: StepIdsEnum.FAILOVER_COUNTRY,
  [PublicIp.FLOATING]: StepIdsEnum.FLOATING_REGION,
  [PublicIp.BASIC]: StepIdsEnum.BASIC_REGION,
};

export const useActions = (projectId: string) => {
  const { trackClick } = useTracking();
  const { region } = useEnvironment();
  const {
    form,
    steps,
    openStep,
    closeStep,
    setForm,
    setFloatingIpCreation,
  } = useOrderStore();
  const { t: tOrder } = useTranslation('order');
  const navigate = useNavigate();
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { me } = useMe();

  const doOrderFloatingIp = async () => {
    clearNotifications();
    trackClick({
      name: `confirm-add-additional-ip::failover-ip::${form.floatingRegion?.name}`,
      type: 'action',
      level2: PCI_LEVEL2,
    });

    const gateway = form.floatingGatewaySize
      ? {
          name: ((prefix: string) => {
            const maxRandomNumber = 9999;
            const getDate = () => {
              const date = new Date();
              return `${date.getDate()}${date.getMonth() + 1}`;
            };

            const getRandomNumber = () => {
              return (
                (Math.floor(Math.random() * maxRandomNumber) *
                  new Date().getMilliseconds()) %
                maxRandomNumber
              );
            };
            return `${
              prefix ? `${prefix}-` : ''
            }${getDate()}-${getRandomNumber()}`;
          })(`gateway-${form.floatingRegion?.name?.toLowerCase()}`),
          model: form.floatingGatewaySize,
        }
      : null;

    return createFloatingIp(
      projectId,
      form.floatingRegion?.name,
      form.instance?.id,
      form.ipAddress?.ip,
      gateway,
    );
  };

  const doOrderFailoverIp = () => {
    clearNotifications();
    trackClick({
      name: `confirm-add-additional-ip::failover-ip::${form.failoverCountry.regionNames[0]}`,
      type: 'action',
      level2: PCI_LEVEL2,
    });

    const order = {
      planCode: form.failoverCountry?.planCode,
      productId: 'ip',
      pricingMode: 'default',
      quantity: 1,
      configuration: [
        {
          label: 'country',
          value: form.failoverCountry?.name,
        },
        {
          label: 'destination',
          value: projectId,
        },
        {
          label: 'nexthop',
          value: form.instance.id,
        },
      ],
    };

    window.open(
      `${getExpressOrderURL(
        region,
        me.ovhSubsidiary,
      )}?products=${JSURL.stringify([order])}`,
      '_blank',
      'noopener',
    );
  };

  const doOrderBasicIp = () => {
    clearNotifications();
    trackClick({
      name: `confirm-add-additional-ip::basic-ip::${form.basicRegion?.name}`,
      type: 'action',
      level2: PCI_LEVEL2,
    });

    return createBasicIp({
      projectId,
      regionName: form.basicRegion?.name,
      instanceId: form.instance?.id,
    });
  };

  const onNext = useCallback(
    (id: string) => {
      switch (id) {
        case StepIdsEnum.IP_TYPE:
          openStep(
            FIRST_STEP_BY_IP_TYPE[form.ipType] ?? StepIdsEnum.FLOATING_REGION,
          );
          break;
        case StepIdsEnum.FAILOVER_COUNTRY:
          openStep(StepIdsEnum.FAILOVER_INSTANCE);
          break;
        case StepIdsEnum.FAILOVER_INSTANCE:
          doOrderFailoverIp();
          navigate('../additional-ips');
          break;
        case StepIdsEnum.FLOATING_REGION:
          openStep(StepIdsEnum.FLOATING_INSTANCE);
          break;
        case StepIdsEnum.FLOATING_INSTANCE:
          openStep(StepIdsEnum.FLOATING_SUMMARY);
          break;
        case StepIdsEnum.FLOATING_SUMMARY:
          setForm({ ...form, isSubmitting: true });

          doOrderFloatingIp()
            .then(() => {
              setFloatingIpCreation();
              navigate('..');
              addSuccess(
                tOrder('pci_additional_ip_create_floating_ip_success'),
                true,
              );
            })
            .catch((error) =>
              addError(
                tOrder('pci_additional_ip_create_floating_ip_error', {
                  message:
                    error.response?.data?.message || error.message || null,
                  interpolation: {
                    escapeValue: false,
                  },
                }),
              ),
            )
            .finally(() => setForm({ ...form, isSubmitting: false }));
          break;
        case StepIdsEnum.BASIC_REGION:
          openStep(StepIdsEnum.BASIC_INSTANCE);
          break;
        case StepIdsEnum.BASIC_INSTANCE:
          openStep(StepIdsEnum.BASIC_SUMMARY);
          break;
        case StepIdsEnum.BASIC_SUMMARY:
          setForm({ ...form, isSubmitting: true });

          doOrderBasicIp()
            .then(() => {
              navigate('..');
              addSuccess(
                tOrder('pci_additional_ip_create_basic_ip_success'),
                true,
              );
            })
            .catch((error) =>
              addError(
                error.response?.status === FORBIDDEN_STATUS
                  ? tOrder('pci_additional_ip_create_basic_ip_forbidden_error')
                  : tOrder('pci_additional_ip_create_basic_ip_error', {
                      message:
                        error.response?.data?.message || error.message || null,
                      interpolation: {
                        escapeValue: false,
                      },
                    }),
              ),
            )
            .finally(() => setForm({ ...form, isSubmitting: false }));
          break;
        default:
      }
    },
    [form, steps],
  );
  const onEdit = (id: string) => {
    switch (id) {
      case StepIdsEnum.IP_TYPE:
        setForm({
          ...form,
          failoverCountry: null,
          floatingRegion: null,
          basicRegion: null,
          instance: null,
          ipAddress: null,
        });

        Object.keys(StepIdsEnum)
          .filter((key) => StepIdsEnum[key] !== StepIdsEnum.IP_TYPE)
          .forEach((key) => {
            closeStep(StepIdsEnum[key]);
          });
        break;
      case StepIdsEnum.FAILOVER_COUNTRY:
        setForm({ ...form, instance: null });
        closeStep(StepIdsEnum.FAILOVER_INSTANCE);
        break;
      case StepIdsEnum.FLOATING_REGION:
        setForm({ ...form, instance: null, ipAddress: null });
        closeStep(StepIdsEnum.FLOATING_INSTANCE);
        closeStep(StepIdsEnum.FLOATING_SUMMARY);
        break;
      case StepIdsEnum.FLOATING_INSTANCE:
        closeStep(StepIdsEnum.FLOATING_SUMMARY);
        break;
      case StepIdsEnum.BASIC_REGION:
        setForm({ ...form, instance: null });
        closeStep(StepIdsEnum.BASIC_INSTANCE);
        closeStep(StepIdsEnum.BASIC_SUMMARY);
        break;
      case StepIdsEnum.BASIC_INSTANCE:
        closeStep(StepIdsEnum.BASIC_SUMMARY);
        break;
      default:
    }
  };

  return {
    Do: {
      orderFailoverIp: doOrderFailoverIp,
      orderFloatingIp: doOrderFloatingIp,
      orderBasicIp: doOrderBasicIp,
    },
    On: {
      next: onNext,
      edit: onEdit,
    },
  };
};
