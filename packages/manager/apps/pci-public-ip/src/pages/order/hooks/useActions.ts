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
import { useStepsStore } from '@/pages/order/hooks/useStepsStore';

export const useActions = (projectId: string) => {
  const { trackClick } = useTracking();
  const { form, setForm } = useOrderStore();
  const {
    items: steps,
    open,
    close,
    check,
    uncheck,
    lock,
    unlock,
    getPosteriorSteps,
  } = useStepsStore();
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
          check(StepIdsEnum.IP_TYPE);
          lock(StepIdsEnum.IP_TYPE);
          if (form.ipType === IPTypeEnum.FAILOVER) {
            open(StepIdsEnum.FAILOVER_COUNTRY);
          } else {
            open(StepIdsEnum.FLOATING_REGION);
          }
          break;
        case StepIdsEnum.FAILOVER_COUNTRY:
          check(StepIdsEnum.FAILOVER_COUNTRY);
          lock(StepIdsEnum.FAILOVER_COUNTRY);
          open(StepIdsEnum.FAILOVER_INSTANCE);
          break;
        case StepIdsEnum.FAILOVER_INSTANCE:
          doOrderFailoverIp();
          break;
        case StepIdsEnum.FLOATING_REGION:
          check(StepIdsEnum.FLOATING_REGION);
          lock(StepIdsEnum.FLOATING_REGION);
          open(StepIdsEnum.FLOATING_INSTANCE);
          break;
        case StepIdsEnum.FLOATING_INSTANCE:
          check(StepIdsEnum.FLOATING_INSTANCE);
          lock(StepIdsEnum.FLOATING_INSTANCE);
          open(StepIdsEnum.FLOATING_SUMMARY);
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
                  message: error.data?.message || null,
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
        break;
      case StepIdsEnum.FAILOVER_COUNTRY:
        setForm({ ...form, instance: null });
        close(StepIdsEnum.FAILOVER_INSTANCE);
        break;
      case StepIdsEnum.FLOATING_REGION:
        setForm({ ...form, instance: null, ipAddress: null });
        close(StepIdsEnum.FLOATING_INSTANCE);
        close(StepIdsEnum.FLOATING_SUMMARY);
        break;
      case StepIdsEnum.FLOATING_INSTANCE:
        close(StepIdsEnum.FLOATING_SUMMARY);
        break;
      default:
    }

    getPosteriorSteps(id as StepIdsEnum).forEach((i) => {
      uncheck(i);
      unlock(i);
      close(i);
    });

    unlock(id as StepIdsEnum);
    uncheck(id as StepIdsEnum);
  };

  return {
    act: {
      orderFailoverIp: doOrderFailoverIp,
      orderFloatingIp: doOrderFloatingIp,
    },
    on: {
      next: onNext,
      edit: onEdit,
    },
  };
};
