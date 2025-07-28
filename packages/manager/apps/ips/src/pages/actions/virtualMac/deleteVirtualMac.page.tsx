import React, { useMemo } from 'react';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OdsText } from '@ovhcloud/ods-components/react';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import { deleteVirtualMACs, getdedicatedServerVmacQueryKey } from '@/data/api';
import {
  useGetIpdetails,
  useGetIpVmacWithIp,
  useIpHasVmac,
} from '@/data/hooks/ip';
import { fromIdToIp, ipFormatter, TRANSLATION_NAMESPACES } from '@/utils';

export default function DeleteVirtualMac() {
  const navigate = useNavigate();
  const { id, service } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { ipDetails } = useGetIpdetails({ ip });
  const { t } = useTranslation(['virtual-mac', TRANSLATION_NAMESPACES.listing]);
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { trackClick, trackPage } = useOvhTracking();

  const queryClient = useQueryClient();

  const { ipvmac, isLoading: isVmacLoading } = useIpHasVmac({
    serviceName: service,
    ip,
    enabled: Boolean(service),
  });

  const macAddresses = useMemo(
    () =>
      ipvmac
        .filter((vmac) => vmac.ip.includes(ip))
        .map((vmac) => vmac.macAddress),
    [ipvmac, ip],
  );

  const closeModal = () => {
    navigate('..');
  };

  const { isPending, mutate: deleteVirtualMacHandler } = useMutation({
    mutationFn: () =>
      deleteVirtualMACs({ serviceName: service, macAddresses, ip }),
    onSuccess: async () => {
      clearNotifications();
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'mac-delete_success',
      });
      ipvmac.forEach((vmac) =>
        addSuccess(t('deleteVirtualMacSuccess', { ip, vmac: vmac.macAddress })),
      );
      await queryClient.invalidateQueries({
        queryKey: getdedicatedServerVmacQueryKey({ serviceName: service }),
      });
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
      actionType: 'exit',
      actions: ['mac-delete', 'cancel'],
    });
    closeModal();
  };

  return (
    <Modal
      isOpen
      isDismissible
      onOdsClose={closeHandler}
      heading={t('deleteVirtualMacTitle')}
      primaryLabel={t('confirm', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={() => deleteVirtualMacHandler()}
      isPrimaryButtonLoading={isPending}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      isSecondaryButtonDisabled={isPending}
      onSecondaryButtonClick={closeHandler}
    >
      <div>
        <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
          {t('deleteVirtualMacInfo')}
        </OdsText>
        <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.heading6}>
          {t('deleteVirtualMacConfirmation')}
        </OdsText>
      </div>
    </Modal>
  );
}
