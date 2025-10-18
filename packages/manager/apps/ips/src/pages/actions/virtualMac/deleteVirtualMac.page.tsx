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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  createDedicatedServerTasksQueryKeyPredicate,
  deleteVirtualMACs,
} from '@/data/api';
import { useIpHasVmac } from '@/data/hooks/ip';
import {
  fromIdToIp,
  ipFormatter,
  TRANSLATION_NAMESPACES,
  VMAC_UPDATE_FUNCTION_LIST,
} from '@/utils';

export default function DeleteVirtualMac() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { id, service } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { t } = useTranslation(['virtual-mac', TRANSLATION_NAMESPACES.listing]);
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { trackClick, trackPage } = useOvhTracking();

  const queryClient = useQueryClient();

  const { ipvmac } = useIpHasVmac({
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
    navigate(`..?${search.toString()}`);
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
      if (service) {
        await queryClient.invalidateQueries({
          predicate: createDedicatedServerTasksQueryKeyPredicate(
            service,
            VMAC_UPDATE_FUNCTION_LIST,
          ),
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
      actionType: 'exit',
      actions: ['mac-delete', 'cancel'],
    });
    closeModal();
  };

  return (
    <Modal
      isOpen
      onDismiss={closeHandler}
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
