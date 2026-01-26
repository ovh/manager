import { useMemo } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import {
  deleteVirtualMACs,
  getIcebergDedicatedServerTasksQueryKey,
} from '@/data/api';
import { useIpHasVmac } from '@/data/hooks/ip';
import { TRANSLATION_NAMESPACES, fromIdToIp, ipFormatter } from '@/utils';

export default function DeleteVirtualMac() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { id, service: serviceName } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { t } = useTranslation(['virtual-mac', TRANSLATION_NAMESPACES.listing]);
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { trackClick, trackPage } = useOvhTracking();

  const queryClient = useQueryClient();

  const { ipvmac } = useIpHasVmac({
    serviceName,
    ip,
    enabled: Boolean(serviceName),
  });

  const macAddresses = useMemo(
    () =>
      ipvmac
        .filter((vmac) => vmac.ip.includes(ip))
        .map((vmac) => vmac.macAddress),
    [ipvmac, ip],
  );

  const closeModal = () => {
    navigate(`..?${search.toString()}`);
  };

  const { isPending, mutate: deleteVirtualMacHandler } = useMutation({
    mutationFn: () => deleteVirtualMACs({ serviceName, macAddresses, ip }),
    onSuccess: async () => {
      clearNotifications();
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'mac-delete_success',
      });
      ipvmac.forEach((vmac) =>
        addSuccess(t('deleteVirtualMacSuccess', { ip, vmac: vmac.macAddress })),
      );
      if (serviceName) {
        await queryClient.invalidateQueries({
          queryKey: getIcebergDedicatedServerTasksQueryKey(serviceName),
        });
      }
      closeModal();
    },
    onError: (err: ApiError) => {
      clearNotifications();
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'mac-delete_error',
      });
      closeModal();
      addError(
        t('deleteVirtualMacError', {
          error: err?.response?.data?.message,
        }),
        true,
      );
    },
  });

  const closeHandler = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['delete_virtual-mac', 'cancel'],
    });
    closeModal();
  };

  return (
    <Modal
      onOpenChange={closeHandler}
      heading={t('deleteVirtualMacTitle')}
      primaryButton={{
        label: t('confirm', { ns: NAMESPACES.ACTIONS }),
        onClick: () => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['delete_virtual-mac', 'confirm'],
          });
          deleteVirtualMacHandler();
        },
        loading: isPending,
      }}
      secondaryButton={{
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
        disabled: isPending,
        onClick: closeHandler,
      }}
    >
      <div>
        <Text className="mb-4 block" preset={TEXT_PRESET.paragraph}>
          {t('deleteVirtualMacInfo')}
        </Text>
        <Text className="mb-4 block" preset={TEXT_PRESET.heading6}>
          {t('deleteVirtualMacConfirmation')}
        </Text>
      </div>
    </Modal>
  );
}
