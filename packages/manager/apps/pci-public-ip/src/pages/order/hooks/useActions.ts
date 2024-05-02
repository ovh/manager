import { useCallback } from 'react';
import JSURL from 'jsurl';
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@ovhcloud/manager-components';
import { PCI_LEVEL2 } from '@/tracking.constants';
import { URLS } from '@/pages/order/constants';
import { useMe } from '@/api/hooks/useMe';
import { createFloatingIp } from '@/api/hooks/useCreateFloatingIp';
import { IPTypeEnum, StepIdsEnum } from '@/api/types';
import { useOrderStore } from '@/pages/order/hooks/useStore';

export const useActions = (projectId: string) => {
  const { trackClick } = useTracking();
  const { form, steps, openStep, closeStep, setForm } = useOrderStore();
  const { t: tOrder } = useTranslation('order');
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { me } = useMe();

  const doOrderFloatingIp = async () => {
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

    const expressOrderUrl = URLS.get(me.ovhSubsidiary);

    window.open(
      `${expressOrderUrl}?products=${JSURL.stringify([order])}`,
      '_blank',
      'noopener',
    );
  };

  const onNext = useCallback(
    (id: string) => {
      switch (id) {
        case StepIdsEnum.IP_TYPE:
          if (form.ipType === IPTypeEnum.FAILOVER) {
            openStep(StepIdsEnum.FAILOVER_COUNTRY);
          } else {
            openStep(StepIdsEnum.FLOATING_REGION);
          }
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
          doOrderFloatingIp()
            .then(() => {
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
                }),
              ),
            );
          break;
        default:
      }
    },
    [form, steps],
  );
  const onEdit = (id: string) => {
    switch (id) {
      case StepIdsEnum.IP_TYPE:
        if (form.ipType === IPTypeEnum.FAILOVER) {
          setForm({ ...form, failoverCountry: null, instance: null });
        } else {
          setForm({
            ...form,
            instance: null,
            floatingRegion: null,
            ipAddress: null,
          });
        }

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
      default:
    }
  };

  return {
    Do: {
      orderFailoverIp: doOrderFailoverIp,
      orderFloatingIp: doOrderFloatingIp,
    },
    On: {
      next: onNext,
      edit: onEdit,
    },
  };
};
