import { z } from 'zod';
import {
  mockVrackSegmentList,
  useUpdateVcdVrackSegment,
  useVcdVrackSegmentOptions,
  VCDVrackSegment,
} from '@ovh-ux/manager-module-vcd-api';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorBoundary, Modal } from '@ovh-ux/manager-react-components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@ovh-ux/manager-core-api';
import { RhfField } from '@/components/Fields';
import { subRoutes } from '@/routes/routes.constant';
import { useMessageContext } from '@/context/Message.context';

const VLAN_MIN = 1;
const VLAN_MAX = 4095;

const VLAN_ID_FORM_SCHEMA = z.object({
  vlanId: z
    .number()
    .min(VLAN_MIN)
    .max(VLAN_MAX),
});

export default function EditVrackSegmentId() {
  const { id, vdcId, vrackSegmentId } = useParams();
  const { t } = useTranslation('datacentres/vrack-segment');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess } = useMessageContext();
  const defaultOptions = useVcdVrackSegmentOptions({
    id,
    vdcId,
    vrackSegmentId,
  });

  const options = {
    ...defaultOptions,
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: mockVrackSegmentList[0],
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          } as ApiResponse<VCDVrackSegment>);
        }, 1500);
      }),
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
      addSuccess({
        content: t('managed_vcd_dashboard_vrack_edit_success'),
        includedSubRoutes: [vdcId],
        excludedSubRoutes: [
          subRoutes.datacentreCompute,
          subRoutes.datacentreStorage,
        ],
      });
      closeModal();
    },
  });

  const { control, register, handleSubmit, watch, formState } = useForm<
    z.infer<typeof VLAN_ID_FORM_SCHEMA>
  >({
    mode: 'onChange',
    resolver: zodResolver(VLAN_ID_FORM_SCHEMA),
    values: {
      vlanId: vrackSegment?.vlanId,
    },
  });

  const { isValid } = formState;

  if (isError) {
    return (
      <Modal isOpen onDismiss={closeModal}>
        <ErrorBoundary redirectionApp="vcd" />
      </Modal>
    );
  }

  const onSubmit: SubmitHandler<z.infer<typeof VLAN_ID_FORM_SCHEMA>> = ({
    vlanId,
  }) => {
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
        isPrimaryButtonDisabled={
          isUpdatePending ||
          !isValid ||
          watch('vlanId') === vrackSegment?.vlanId
        }
        onPrimaryButtonClick={handleSubmit(onSubmit)}
        secondaryLabel={tActions('cancel')}
        onSecondaryButtonClick={closeModal}
        onDismiss={closeModal}
      >
        <div className="flex flex-col gap-2">
          {updateError && (
            <OdsMessage color="critical" isDismissible={false}>
              {t('managed_vcd_dashboard_vrack_edit_error', {
                errorApi: updateError.message,
              })}
            </OdsMessage>
          )}
          <OdsText>
            {t('managed_vcd_dashboard_vrack_form_vlan_id_description')}
          </OdsText>
          {watch('vlanId') !== undefined && (
            <RhfField
              control={control}
              controllerParams={register('vlanId')}
              helperMessage={t('managed_vcd_dashboard_vrack_vlan_id_helper')}
            >
              <RhfField.Label>
                {t('managed_vcd_dashboard_vrack_vlan_id')}
              </RhfField.Label>
              <RhfField.HelperAuto />
              <RhfField.Quantity max={VLAN_MAX} min={VLAN_MIN} />
            </RhfField>
          )}
        </div>
      </Modal>
    </form>
  );
}
