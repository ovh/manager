import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  OrderDescription,
  getDeliveringOrderQueryKey,
} from '@ovh-ux/manager-module-order';
import {
  ShellContext,
  useOvhTracking,
  ButtonType,
  PageLocation,
  TrackingClickParams,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import {
  ODS_MESSAGE_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsModal,
  OdsButton,
  OdsText,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { useCreateVrackServicesCart } from '@ovh-ux/manager-network-common';
import { LoadingText } from '@/components/LoadingText.component';
import { OrderSubmitModalContent } from '@/components/OrderSubmitModalContent.component';
import { urls } from '@/routes/routes.constants';
import { useSendOrder } from '@/data/hooks/useSendOrder';

const trackingParams: TrackingClickParams = {
  buttonType: ButtonType.button,
  location: PageLocation.popup,
};

export default function CreateConfirmModal() {
  const [hasVrackServiceOrderAsked, setHasVrackServiceOrderAsked] = useState<
    boolean
  >(false);
  const [hasVrackOrderAsked, setHasVrackOrderAsked] = useState<boolean>(false);
  const { t } = useTranslation('vrack-services/create');
  const { trackClick } = useOvhTracking();
  const { region } = useParams();
  const { environment } = React.useContext(ShellContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    createCart,
    data,
    error,
    isError,
    isPending,
    sendOrderError,
    isSendOrderPending,
    isSendOrderError,
  } = useCreateVrackServicesCart(useSendOrder);

  const cancel = () => {
    trackClick({
      ...trackingParams,
      actions: ['add_vrack-services', 'cancel'],
    });
    navigate('..');
  };

  return (
    <OdsModal isOpen isDismissible onOdsClose={cancel}>
      <OdsText preset={ODS_TEXT_PRESET.heading4}>{t('modalHeadline')}</OdsText>
      {hasVrackOrderAsked &&
        !isPending &&
        !isSendOrderPending &&
        !isSendOrderError && (
          <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
            {t('modalDescriptionLine4')}
          </OdsText>
        )}
      {hasVrackServiceOrderAsked &&
        !isPending &&
        !isSendOrderPending &&
        !isSendOrderError && (
          <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
            {t('modalDescriptionLine5')}
          </OdsText>
        )}
      {(!hasVrackServiceOrderAsked || isPending || isSendOrderPending) && (
        <>
          <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
            {t('modalDescriptionLine1')}
          </OdsText>
          <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
            {t('modalDescriptionLine2')}
          </OdsText>
        </>
      )}
      {isError && (
        <OdsMessage
          isDismissible={false}
          color={ODS_MESSAGE_COLOR.critical}
          className="block mb-6"
        >
          {error?.response?.data?.message}
        </OdsMessage>
      )}
      {isSendOrderError && !isSendOrderError && (
        <OdsMessage
          isDismissible={false}
          color={ODS_MESSAGE_COLOR.critical}
          className="block mb-6"
        >
          {sendOrderError?.response?.data?.message}
        </OdsMessage>
      )}
      {(isPending || isSendOrderPending) && (
        <LoadingText title={t('modalCreateOrderWaitMessage')} />
      )}
      <OdsButton
        slot="actions"
        type="button"
        variant={ODS_BUTTON_VARIANT.ghost}
        label={t('modalCancelButtonLabel')}
        onClick={cancel}
      />
      {data?.contractList?.length > 0 ? (
        <OrderSubmitModalContent
          submitButtonLabel={t('modalSubmitOrderButtonLabel')}
          cartId={data?.cartId}
          contractList={data?.contractList}
          onSuccess={async () => {
            await queryClient.invalidateQueries({
              queryKey: getDeliveringOrderQueryKey(
                OrderDescription.vrackServices,
              ),
            });

            await queryClient.invalidateQueries({
              queryKey: getDeliveringOrderQueryKey(OrderDescription.vrack),
            });

            navigate(urls.listing, { state: { fromOrder: true } });
          }}
        />
      ) : (
        <>
          <OdsButton
            slot="actions"
            type="button"
            variant={ODS_BUTTON_VARIANT.outline}
            isDisabled={isPending || isSendOrderPending}
            onClick={() => {
              setHasVrackServiceOrderAsked(true);
              trackClick({
                ...trackingParams,
                actions: ['no-vrack', 'confirm'],
              });
              createCart({
                region,
                hasVrack: false,
                ovhSubsidiary: environment.user.ovhSubsidiary,
              });
            }}
            label={t('modalNoVrackButtonLabel')}
          />
          <OdsButton
            slot="actions"
            type="button"
            isDisabled={isPending || isSendOrderPending}
            label={t('modalConfirmVrackButtonLabel')}
            onClick={() => {
              setHasVrackOrderAsked(true);
              setHasVrackServiceOrderAsked(true);
              trackClick({
                ...trackingParams,
                actions: ['create-vrack', 'confirm'],
              });
              createCart({
                region,
                hasVrack: true,
                ovhSubsidiary: environment.user.ovhSubsidiary,
              });
            }}
          />
        </>
      )}
    </OdsModal>
  );
}
