import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TEXT_PRESET,
  BUTTON_VARIANT,
  SPINNER_SIZE,
  MESSAGE_COLOR,
  Text,
  Spinner,
  Button,
  Message,
  MessageIcon,
  MessageBody,
} from '@ovhcloud/ods-react';
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
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DeliveringMessages } from '@/components/feedback-messages/DeliveringMessages.component';
import { MessagesContext } from './feedback-messages/Messages.context';
import { LoadingText } from './LoadingText.component';
import { OrderSubmitModalContent } from './OrderSubmitModalContent.component';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

const trackingParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export type CreateVrackProps = {
  closeModal: () => void;
};

export const CreateVrack: React.FC<CreateVrackProps> = ({ closeModal }) => {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.createVrack,
    NAMESPACES.ACTIONS,
  ]);
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
      <Text className="block mb-4" preset={TEXT_PRESET.paragraph}>
        {t('modalVrackCreationDescriptionLine1')}
      </Text>
      <Text className="block mb-4" preset={TEXT_PRESET.paragraph}>
        {t('modalVrackCreationDescriptionLine2')}
      </Text>
      {areVrackOrdersLoading && <Spinner size={SPINNER_SIZE.md} />}
      <DeliveringMessages
        messageKey="deliveringVrackMessage"
        orders={vrackDeliveringOrders}
      />
      {isPending && (
        <LoadingText title={t('modalVrackCreationOrderWaitMessage')} />
      )}
      {(isVrackOrdersError || isError) && (
        <Message dismissible={false} color={MESSAGE_COLOR.critical}>
          <MessageIcon name="hexagon-exclamation" />
          <MessageBody>
            {isVrackOrdersError
              ? t('modalVrackCreationError', { error: vrackOrdersError })
              : error?.response?.data?.message}
          </MessageBody>
        </Message>
      )}
      <Button
        slot="actions"
        type="button"
        variant={BUTTON_VARIANT.ghost}
        onClick={closeModal}
      >
        {t('cancel', { ns: NAMESPACES.ACTIONS })}
      </Button>
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
        <Button
          slot="actions"
          type="button"
          disabled={
            areVrackOrdersLoading ||
            vrackDeliveringOrders.length > 0 ||
            isVrackOrdersError ||
            isPending
          }
          onClick={() => {
            trackClick({
              ...trackingParams,
              actions: ['create-vrack', 'confirm'],
            });
            createCart();
          }}
        >
          {t('modalCreateNewVrackButtonLabel')}
        </Button>
      )}
    </>
  );
};
