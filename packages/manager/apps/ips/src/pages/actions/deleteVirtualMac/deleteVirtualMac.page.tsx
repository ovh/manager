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
import { deleteVirtualMACs, getdedicatedServerVmacQueryKey } from '@/data/api';
import { useGetIpdetails, useGetIpVmacWithIp } from '@/data/hooks/ip';
import { fromIdToIp, ipFormatter } from '@/utils';

export default function DeleteVirtualMac() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { ipDetails } = useGetIpdetails({ ip });
  const { t } = useTranslation('listing');
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { trackClick, trackPage } = useOvhTracking();

  const queryClient = useQueryClient();

  const serviceName = useMemo(() => ipDetails?.routedTo?.serviceName, [
    ipDetails,
  ]);

  const { vmacsWithIp } = useGetIpVmacWithIp({
    serviceName,
    enabled: true,
  });

  const macAddresses = useMemo(
    () =>
      vmacsWithIp
        .filter((vmac) => vmac.ip.includes(ip))
        .map((vmac) => vmac.macAddress),
    [vmacsWithIp, ip],
  );

  const closeModal = () => {
    navigate('..');
  };

  const { isPending, mutate: deleteVirtualMacHandler } = useMutation({
    mutationFn: () => deleteVirtualMACs({ serviceName, macAddresses, ip }),
    onSuccess: async () => {
      clearNotifications();
      await queryClient.invalidateQueries({
        queryKey: getdedicatedServerVmacQueryKey({ serviceName }),
      });
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'mac-delete_success',
      });
      macAddresses.forEach((vmac) =>
        addSuccess(t('listingDeleteVMacIP_success', { ip, vmac })),
      );
      closeModal();
    },
    onError: () => {
      clearNotifications();
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'mac-delete_error',
      });
      closeModal();
      addError(t('listingDeleteVMacIP_error'), true);
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
      heading={t('listingActionDeleteVirtualMac')}
      primaryLabel={t('confirm', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={() => deleteVirtualMacHandler()}
      isPrimaryButtonLoading={isPending}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      isSecondaryButtonDisabled={isPending}
      onSecondaryButtonClick={closeHandler}
    >
      <div>
        <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
          {t('listingActionDeleteVirtualMacInfo')}
        </OdsText>
        <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.heading6}>
          {t('listingActionDeleteVirtualMacConfirmation')}
        </OdsText>
      </div>
    </Modal>
  );
}
