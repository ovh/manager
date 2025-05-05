import { z } from 'zod';
import {
  mockVrackSegmentList,
  useUpdateVcdVrackNetworkVrackSegment,
  useVcdVrackNetworkSegmentOptions,
  VrackSegment,
} from '@ovh-ux/manager-module-vcd-api';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorBoundary, Modal } from '@ovh-ux/manager-react-components';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@ovh-ux/manager-core-api';
import { useMemo } from 'react';
import { RhfField } from '@/components/Fields';
import { subRoutes } from '@/routes/routes.constant';
import { useMessageContext } from '@/context/Message.context';
import { hasIpv4CIDRConflict } from '@/utils/hasIpv4CIDRConflict';

export default function EditVdcDescription() {
  const { id, vdcId, vrackSegmentId } = useParams();
  const { t } = useTranslation('datacentres/vrack-segment');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess } = useMessageContext();
  const defaultOptions = useVcdVrackNetworkSegmentOptions({
    id,
    vcdId: vdcId,
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
          } as ApiResponse<VrackSegment>);
        }, 1500);
      }),
    select: (data: ApiResponse<VrackSegment>) => ({
      ...data.data.targetSpec,
    }),
  };

  const { data: vrackSegment, isError } = useQuery(options);

  const {
    mutate: updateVrackSegment,
    error: updateError,
    isPending: isUpdatePending,
  } = useUpdateVcdVrackNetworkVrackSegment({
    id,
    vcdId: vdcId,
    vrackSegmentId,
    onSuccess: () => {
      addSuccess({
        content: t('managed_vcd_dashboard_vrack_segment_add_network_success'),
        includedSubRoutes: [vdcId],
        excludedSubRoutes: [
          subRoutes.datacentreCompute,
          subRoutes.datacentreStorage,
        ],
      });
      closeModal();
    },
  });

  const ADD_NETWORK_FORM_SCHEMA = useMemo(
    () =>
      z.object({
        network: z
          .string()
          .trim()
          .cidr({
            version: 'v4',
            message: t(
              'managed_vcd_dashboard_vrack_segment_add_network_input_helper',
            ),
          })
          .refine(
            (network) =>
              !vrackSegment.networks.some((networkB) =>
                hasIpv4CIDRConflict(network, networkB),
              ),
            {
              message: t(
                'managed_vcd_dashboard_vrack_segment_add_network_input_error',
              ),
            },
          ),
      }),
    [t, vrackSegment],
  );

  const { register, formState, handleSubmit, ...restForm } = useForm<
    z.infer<typeof ADD_NETWORK_FORM_SCHEMA>
  >({
    mode: 'onBlur',
    resolver: zodResolver(ADD_NETWORK_FORM_SCHEMA),
    values: {
      network: '',
    },
  });

  if (isError) {
    return (
      <Modal isOpen onDismiss={closeModal}>
        <ErrorBoundary redirectionApp="vcd" />
      </Modal>
    );
  }

  const onSubmit: SubmitHandler<z.infer<typeof ADD_NETWORK_FORM_SCHEMA>> = ({
    network,
  }) => {
    updateVrackSegment({
      ...vrackSegment,
      networks: [...vrackSegment.networks, network],
    });
  };

  return (
    <FormProvider
      register={register}
      formState={formState}
      handleSubmit={handleSubmit}
      {...restForm}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal
          isOpen
          heading={t('managed_vcd_dashboard_vrack_segment_add_network_title')}
          primaryLabel={t(
            'managed_vcd_dashboard_vrack_segment_add_network_cta',
          )}
          isPrimaryButtonLoading={isUpdatePending}
          isPrimaryButtonDisabled={isUpdatePending}
          onPrimaryButtonClick={handleSubmit(onSubmit)}
          secondaryLabel={tActions('cancel')}
          onSecondaryButtonClick={closeModal}
          onDismiss={closeModal}
        >
          <div className="flex flex-col gap-2">
            {updateError && (
              <OdsMessage color="critical">
                {t('managed_vcd_dashboard_vrack_segment_add_network_error', {
                  errorApi: updateError.message,
                })}
              </OdsMessage>
            )}
            <OdsText>
              {t(
                'managed_vcd_dashboard_vrack_segment_form_add_network_description',
              )}
            </OdsText>
            <RhfField controllerParams={register('network')}>
              <RhfField.Label>
                {t('managed_vcd_dashboard_vrack_segment_add_network_title')}
              </RhfField.Label>
              <RhfField.HelperAuto
                helperMessage={t(
                  'managed_vcd_dashboard_vrack_segment_add_network_input_helper',
                )}
              />
              <RhfField.Input />
            </RhfField>
          </div>
        </Modal>
      </form>
    </FormProvider>
  );
}
