import { Effect } from 'effect';
import { z } from 'zod/v3';
import {
  VCDVrackSegment,
  useUpdateVcdVrackSegment,
  useVcdVrackSegmentOptions,
} from '@ovh-ux/manager-module-vcd-api';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorBoundary, Modal } from '@ovh-ux/manager-react-components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ApiResponse } from '@ovh-ux/manager-core-api';
import { Suspense, useEffect, useMemo } from 'react';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { RhfField } from '@/components/Fields';
import { subRoutes } from '@/routes/routes.constant';
import { useMessageContext } from '@/context/Message.context';
import { isGatewayCidr } from '@/utils/isGatewayCidr';
import { hasIpv4CIDRConflictInArray } from '@/utils/hasIpv4CIDRConflictInArray';
import { TRACKING } from '@/tracking.constants';

function AddNetworkVrackSegmentLoaded() {
  const { trackClick, trackPage } = useOvhTracking();
  const { id, vdcId, vrackSegmentId } = useParams();
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
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    select: (data: ApiResponse<VCDVrackSegment>) => ({
      ...data.data.targetSpec,
    }),
  };

  const { data: vrackSegmentTargetSpec, isError } = useSuspenseQuery(options);

  const ADD_NETWORK_FORM_SCHEMA = useMemo(
    () =>
      z.object({
        network: z
          .string()
          .trim()
          .cidr({
            version: 'v4',
            message: t('managed_vcd_dashboard_vrack_add_network_input_helper'),
          })
          .refine(
            (network) =>
              hasIpv4CIDRConflictInArray(
                network,
                vrackSegmentTargetSpec.networks,
              ).pipe(Effect.isFailure, Effect.runPromise),
            {
              message: t('managed_vcd_dashboard_vrack_add_network_input_error'),
            },
          )
          .refine(
            (network) =>
              isGatewayCidr(network).pipe(
                Effect.orElseSucceed(() => false),
                Effect.runSync,
              ),
            {
              message: t(
                'managed_vcd_dashboard_vrack_add_network_input_helper',
              ),
            },
          ),
      }),
    [t, vrackSegmentTargetSpec],
  );

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
        pageName: 'add_network_success',
      });
      addSuccess({
        content: t('managed_vcd_dashboard_vrack_add_network_success'),
        includedSubRoutes: [vdcId],
        excludedSubRoutes: [
          subRoutes.datacentreCompute,
          subRoutes.datacentreStorage,
        ],
      });
      closeModal();
    },
    onError: (error) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: `add_network_error::${error.message
          .replaceAll(' ', '-')
          .toLowerCase()}`,
      });
    },
  });

  const { register, formState, handleSubmit, control, reset } = useForm<
    z.infer<typeof ADD_NETWORK_FORM_SCHEMA>
  >({
    mode: 'onChange',
    resolver: zodResolver(ADD_NETWORK_FORM_SCHEMA),
    values: {
      network: '',
    },
  });

  // Necessary because the schema changes during the first rendering
  // So we need reset the form after schema change is done
  // And as the form validation is async, we put the reset job in the end of task queue of JS
  useEffect(() => {
    setTimeout(reset);
  }, [ADD_NETWORK_FORM_SCHEMA, reset]);

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
    trackClick(TRACKING.vrackModifyVlanId.confirm);
    updateVrackSegment({
      ...vrackSegmentTargetSpec,
      networks: [...vrackSegmentTargetSpec.networks, network],
    });
  };

  const { isValid } = formState;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal
        isOpen
        heading={t('managed_vcd_dashboard_vrack_add_network')}
        primaryLabel={t('managed_vcd_dashboard_vrack_add_network')}
        isPrimaryButtonLoading={isUpdatePending}
        isPrimaryButtonDisabled={isUpdatePending || !isValid}
        onPrimaryButtonClick={handleSubmit(onSubmit)}
        secondaryLabel={tActions('cancel')}
        onSecondaryButtonClick={cancelModal}
        onDismiss={cancelModal}
      >
        <div className="flex flex-col gap-2">
          {updateError && (
            <OdsMessage color="critical" isDismissible={false}>
              {t('managed_vcd_dashboard_vrack_add_network_error', {
                errorApi: updateError.message,
              })}
            </OdsMessage>
          )}
          <OdsText>
            {t('managed_vcd_dashboard_vrack_form_add_network_description')}
          </OdsText>
          <RhfField controllerParams={register('network')} control={control}>
            <RhfField.Label>
              {t('managed_vcd_dashboard_vrack_network_address')}
            </RhfField.Label>
            <RhfField.HelperAuto
              helperMessage={t(
                'managed_vcd_dashboard_vrack_add_network_input_helper',
              )}
            />
            <RhfField.Input />
          </RhfField>
        </div>
      </Modal>
    </form>
  );
}

export default function AddNetworkVrackSegment() {
  const { t } = useTranslation('datacentres/vrack-segment');

  return (
    <Suspense
      fallback={
        <Modal
          isOpen
          heading={t('managed_vcd_dashboard_vrack_add_network')}
          isLoading
        ></Modal>
      }
    >
      <AddNetworkVrackSegmentLoaded />;
    </Suspense>
  );
}
