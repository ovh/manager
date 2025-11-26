import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod/v3';

import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiResponse } from '@ovh-ux/manager-core-api';
import {
  VCDVrackSegment,
  useUpdateVcdVrackSegment,
  useVcdVrackSegmentOptions,
} from '@ovh-ux/manager-module-vcd-api';
import { ErrorBoundary, Modal } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { RhfField } from '@/components/Fields';
import { useMessageContext } from '@/context/Message.context';
import { subRoutes } from '@/routes/routes.constant';
import { TRACKING } from '@/tracking.constants';

const VLAN_MIN = 1;
const VLAN_MAX = 4094;

const VLAN_ID_FORM_SCHEMA = z.object({
  vlanId: z.number().min(VLAN_MIN).max(VLAN_MAX),
});

export default function EditVrackSegmentId() {
  const { id, vdcId, vrackSegmentId } = useParams();
  const { trackPage, trackClick } = useOvhTracking();
  const { t } = useTranslation('datacentres/vrack-segment');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const cancelModal = () => {
    trackClick(TRACKING.vrackDeleteSegment.cancel);
    closeModal();
  };
  const { addSuccess } = useMessageContext();
  const defaultOptions = useVcdVrackSegmentOptions({
    id,
    vdcId,
    vrackSegmentId,
  });

  const options = {
    ...defaultOptions,
    select: (data: ApiResponse<VCDVrackSegment>) => ({
      ...data.data.targetSpec,
      vlanId: Number(data.data.targetSpec.vlanId),
    }),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  };

  const { data: vrackSegment, isLoading, isError } = useQuery(options);

  const {
    mutate: updateVrackSegment,
    error: updateError,
    isPending: isUpdatePending,
  } = useUpdateVcdVrackSegment({
    id,
    vdcId,
    vrackSegmentId,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'modify_id-vlan_success',
      });
      addSuccess({
        content: t('managed_vcd_dashboard_vrack_edit_success'),
        includedSubRoutes: [vdcId],
        excludedSubRoutes: [subRoutes.datacentreCompute, subRoutes.datacentreStorage],
      });
      closeModal();
    },
    onError: (error) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: `modify_id-vlan_error::${error.message.replaceAll(' ', '-').toLowerCase()}`,
      });
    },
  });

  const { control, register, handleSubmit, formState } = useForm<
    z.infer<typeof VLAN_ID_FORM_SCHEMA>
  >({
    mode: 'onChange',
    resolver: zodResolver(VLAN_ID_FORM_SCHEMA),
    values: {
      vlanId: vrackSegment?.vlanId,
    },
  });
  const vlanId = useWatch({ control, name: 'vlanId' });

  const { isValid } = formState;

  if (isError) {
    return (
      <Modal isOpen onDismiss={closeModal}>
        <ErrorBoundary redirectionApp="vcd" />
      </Modal>
    );
  }

  const onSubmit: SubmitHandler<z.infer<typeof VLAN_ID_FORM_SCHEMA>> = ({ vlanId }) => {
    trackClick(TRACKING.vrackModifyVlanId.confirm);
    updateVrackSegment({
      ...vrackSegment,
      vlanId: vlanId.toString(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal
        isOpen
        heading={t('managed_vcd_dashboard_vrack_edit_vlan')}
        isLoading={isLoading}
        primaryLabel={tActions('modify')}
        isPrimaryButtonLoading={isUpdatePending}
        isPrimaryButtonDisabled={isUpdatePending || !isValid || vlanId === vrackSegment?.vlanId}
        onPrimaryButtonClick={handleSubmit(onSubmit)}
        secondaryLabel={tActions('cancel')}
        onSecondaryButtonClick={cancelModal}
        onDismiss={cancelModal}
      >
        <div className="flex flex-col gap-2">
          {updateError && (
            <OdsMessage color="critical" isDismissible={false}>
              {t('managed_vcd_dashboard_vrack_edit_error', {
                errorApi: updateError.message,
              })}
            </OdsMessage>
          )}
          <OdsText>{t('managed_vcd_dashboard_vrack_form_vlan_id_description')}</OdsText>
          {vlanId !== undefined && (
            <RhfField
              control={control}
              controllerParams={register('vlanId')}
              helperMessage={t('managed_vcd_dashboard_vrack_vlan_id_helper', {
                minId: VLAN_MIN,
                maxId: VLAN_MAX,
              })}
            >
              <RhfField.Label>{t('managed_vcd_dashboard_vrack_vlan_id')}</RhfField.Label>
              <RhfField.HelperAuto />
              <RhfField.Quantity max={VLAN_MAX} min={VLAN_MIN} />
            </RhfField>
          )}
        </div>
      </Modal>
    </form>
  );
}
