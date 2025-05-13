import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_TEXT_PRESET,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_MESSAGE_COLOR,
} from '@ovhcloud/ods-components';
import {
  OdsText,
  OdsSpinner,
  OdsButton,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import {
  OrderDescription,
  getDeliveringOrderQueryKey,
  useOrderPollingStatus,
} from '@ovh-ux/manager-module-order';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  getVrackListQueryKey,
  useCreateCartWithVrack,
} from '@ovh-ux/manager-network-common';
import { DeliveringMessages } from '@/components/feedback-messages/DeliveringMessages.component';
import { MessagesContext } from './feedback-messages/Messages.context';
import { LoadingText } from './LoadingText.component';
import { OrderSubmitModalContent } from './OrderSubmitModalContent.component';

const trackingParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export type CreateVrackProps = {
  closeModal: () => void;
};

export const CreateVrack: React.FC<CreateVrackProps> = ({ closeModal }) => {
  const { t } = useTranslation('vrack-services/create-vrack');
  const queryClient = useQueryClient();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { environment } = React.useContext(ShellContext);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  const {
    createCart,
    data,
    error,
    isError,
    isPending,
  } = useCreateCartWithVrack(environment.user.ovhSubsidiary);

  const {
    data: vrackDeliveringOrders,
    isLoading: areVrackOrdersLoading,
    isError: isVrackOrdersError,
    error: vrackOrdersError,
  } = useOrderPollingStatus({
    pollingKey: OrderDescription.vrack,
    queryToInvalidateOnDelivered: getVrackListQueryKey,
  });

  return (
    <>
      <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
        {t('modalVrackCreationDescriptionLine1')}
      </OdsText>
      <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
        {t('modalVrackCreationDescriptionLine2')}
      </OdsText>
      {areVrackOrdersLoading && <OdsSpinner size={ODS_SPINNER_SIZE.md} />}
      <DeliveringMessages
        messageKey="deliveringVrackMessage"
        orders={vrackDeliveringOrders}
      />
      {isPending && (
        <LoadingText title={t('modalVrackCreationOrderWaitMessage')} />
      )}
      {(isVrackOrdersError || isError) && (
        <OdsMessage
          className="block"
          isDismissible={false}
          color={ODS_MESSAGE_COLOR.critical}
        >
          {isVrackOrdersError
            ? t('modalVrackCreationError', { error: vrackOrdersError })
            : error?.response?.data?.message}
        </OdsMessage>
      )}
      <OdsButton
        slot="actions"
        type="button"
        variant={ODS_BUTTON_VARIANT.ghost}
        label={t('modalVrackCreationCancel')}
        onClick={closeModal}
      />
      {data?.contractList?.length > 0 ? (
        <OrderSubmitModalContent
          submitButtonLabel={t('modalVrackCreationSubmitOrderButtonLabel')}
          cartId={data?.cartId}
          contractList={data?.contractList}
          onSuccess={async (orderResponse) => {
            await queryClient.invalidateQueries({
              queryKey: getDeliveringOrderQueryKey(OrderDescription.vrack),
            });
            navigate('..');
            addSuccessMessage(t('vrackCreationSuccess'), {
              linkLabel: t('vrackOrderLinkLabel'),
              linkUrl: orderResponse.data.url,
            });
          }}
        />
      ) : (
        <OdsButton
          slot="actions"
          type="button"
          isDisabled={
            areVrackOrdersLoading ||
            vrackDeliveringOrders.length > 0 ||
            isVrackOrdersError ||
            isPending
          }
          label={t('modalCreateNewVrackButtonLabel')}
          onClick={() => {
            trackClick({
              ...trackingParams,
              actions: ['create-vrack', 'confirm'],
            });
            createCart();
          }}
        />
      )}
    </>
  );
};
