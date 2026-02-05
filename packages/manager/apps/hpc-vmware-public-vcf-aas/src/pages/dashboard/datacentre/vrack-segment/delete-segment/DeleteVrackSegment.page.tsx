import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  useDeleteVcdVrackSegment,
  useVcdVrackSegmentOptions,
} from '@ovh-ux/manager-module-vcd-api';
import { ErrorBoundary, Modal } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { DeleteModal } from '@/components/deleteModal/DeleteModal.component';
import { useMessageContext } from '@/context/Message.context';
import { useVrackSegmentParams } from '@/hooks/params/useSafeParams';
import { subRoutes } from '@/routes/routes.constant';
import { TRACKING } from '@/tracking.constants';

export default function DeleteVrackSegment() {
  const { id, vdcId, vrackSegmentId } = useVrackSegmentParams();
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation('datacentres/vrack-segment');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const cancelModal = () => {
    trackClick(TRACKING.vrackDeleteSegment.cancel);
    closeModal();
  };

  const defaultQueryOptions = useVcdVrackSegmentOptions({
    id,
    vdcId,
    vrackSegmentId,
  });

  const queryOptions = {
    ...defaultQueryOptions,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  };

  const { data: vrackSegment, isPending, isError } = useQuery(queryOptions);
  const { addSuccess, addError } = useMessageContext();

  const getDeleteErrorMessage = (message?: string) =>
    !message
      ? t('managed_vcd_dashboard_vrack_delete_segment_error_default')
      : t('managed_vcd_dashboard_vrack_delete_segment_error', {
          errorApi: message,
        });

  const { mutate: deleteSegment, isPending: isDeleting } = useDeleteVcdVrackSegment({
    id,
    vdcId,
    vrackSegmentId,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'delete_vcfaas-segment_success',
      });
      addSuccess({
        content: t('managed_vcd_dashboard_vrack_delete_segment_success', {
          vrack: t('managed_vcd_dashboard_vrack_column_segment_vrack_label', {
            vlanId: vrackSegment?.currentState?.vlanId,
          }),
        }),
        includedSubRoutes: [vdcId],
        excludedSubRoutes: [subRoutes.datacentreCompute, subRoutes.datacentreStorage],
      });
      closeModal();
    },
    onError: (error) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: `delete_vcfaas-segment_error::${error.message.replace(/ /g, '-').toLowerCase()}`,
      });
      addError({
        content: getDeleteErrorMessage(error.message),
        includedSubRoutes: [vdcId],
        excludedSubRoutes: [subRoutes.datacentreCompute, subRoutes.datacentreStorage],
      });
      closeModal();
    },
  });

  if (isError) {
    return (
      <Modal isOpen onDismiss={closeModal}>
        <ErrorBoundary redirectionApp="vcd" />
      </Modal>
    );
  }

  return (
    <DeleteModal
      isOpen
      heading={t('managed_vcd_dashboard_vrack_delete_segment')}
      primaryLabel={tActions('delete')}
      isPrimaryButtonLoading={isDeleting}
      isPrimaryButtonDisabled={isDeleting}
      isLoading={isPending}
      onPrimaryButtonClick={() => {
        deleteSegment();
        trackClick(TRACKING.vrackDeleteSegment.confirm);
      }}
      secondaryLabel={tActions('cancel')}
      onSecondaryButtonClick={cancelModal}
      onDismiss={cancelModal}
      confirmationKeyword={tActions('delete').toUpperCase()}
    >
      <div className="flex flex-col gap-2">
        <OdsText>{t('managed_vcd_dashboard_vrack_delete_segment_content')}</OdsText>
      </div>
    </DeleteModal>
  );
}
