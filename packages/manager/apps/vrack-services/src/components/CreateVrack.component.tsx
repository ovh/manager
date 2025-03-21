import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsText,
  OsdsSpinner,
  OsdsButton,
  OsdsMessage,
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
import { handleClick } from '@ovh-ux/manager-react-components';
import { useQueryClient } from '@tanstack/react-query';
import {
  getVrackListQueryKey,
  useCreateCartWithVrack,
} from '@ovh-ux/manager-network-common';
import { DeliveringMessages } from '@/components/DeliveringMessages.component';
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
      <OsdsText
        className="block mb-4"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('modalVrackCreationDescriptionLine1')}
      </OsdsText>
      <OsdsText
        className="block mb-4"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('modalVrackCreationDescriptionLine2')}
      </OsdsText>
      {areVrackOrdersLoading && (
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
      )}
      <DeliveringMessages
        messageKey="deliveringVrackMessage"
        orders={vrackDeliveringOrders}
      />
      {isPending && (
        <LoadingText title={t('modalVrackCreationOrderWaitMessage')} />
      )}
      {(isVrackOrdersError || isError) && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {isVrackOrdersError
              ? t('modalVrackCreationError', { error: vrackOrdersError })
              : error?.response?.data?.message}
          </OsdsText>
        </OsdsMessage>
      )}
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(closeModal)}
      >
        {t('modalVrackCreationCancel')}
      </OsdsButton>
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
        <OsdsButton
          slot="actions"
          type={ODS_BUTTON_TYPE.button}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={
            areVrackOrdersLoading ||
            vrackDeliveringOrders.length > 0 ||
            isVrackOrdersError ||
            isPending ||
            undefined
          }
          {...handleClick(async () => {
            trackClick({
              ...trackingParams,
              actions: ['create-vrack', 'confirm'],
            });
            createCart();
          })}
        >
          {t('modalCreateNewVrackButtonLabel')}
        </OsdsButton>
      )}
    </>
  );
};
