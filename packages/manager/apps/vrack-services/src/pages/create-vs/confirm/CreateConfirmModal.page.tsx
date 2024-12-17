import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateCartResult,
  Order,
  OrderDescription,
  getDeliveringOrderQueryKey,
  postOrderCartCartIdCheckout,
} from '@ovh-ux/manager-module-order';
import {
  ShellContext,
  useOvhTracking,
  ButtonType,
  PageLocation,
  TrackingClickParams,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsModal,
  OsdsButton,
  OsdsText,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import { handleClick } from '@ovh-ux/manager-react-components';
import { LoadingText } from '@/components/LoadingText.component';
import { OrderSubmitModalContent } from '@/components/OrderSubmitModalContent.component';
import { createVrackServicesCart } from '@/utils/cart';
import { urls } from '@/routes/routes.constants';

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
    mutate: sendOrder,
    isPending: isSendOrderPending,
    error: sendOrderError,
    isError: isSendOrderError,
  } = useMutation<ApiResponse<Order>, ApiError, { cartId: string }>({
    mutationFn: ({ cartId }) =>
      postOrderCartCartIdCheckout({
        cartId,
        autoPayWithPreferredPaymentMethod: true,
        waiveRetractationPeriod: true,
      }),
    onError: async (error, { cartId }) => {
      const {
        request: { status },
      } = error;

      if (status === 400) {
        const sendOrderResponse = await postOrderCartCartIdCheckout({
          cartId,
          autoPayWithPreferredPaymentMethod: false,
          waiveRetractationPeriod: true,
        });
        window.top.location.href = sendOrderResponse.data.url;
        return Promise.resolve(sendOrderResponse);
      }

      return Promise.resolve(error);
    },
  });

  const { mutate: createCart, data, error, isError, isPending } = useMutation<
    CreateCartResult,
    ApiError,
    { hasVrack?: boolean; region: string }
  >({
    mutationFn: async (params) => {
      const createCartResponse = await createVrackServicesCart({
        ovhSubsidiary: environment.user.ovhSubsidiary,
        ...params,
      });

      if (createCartResponse.contractList.length === 0)
        await sendOrder({ cartId: createCartResponse.cartId });

      return Promise.resolve(createCartResponse);
    },
  });

  const cancel = () => {
    trackClick({
      ...trackingParams,
      actions: ['add_vrack-services', 'cancel'],
    });
    navigate('..');
  };

  return (
    <OsdsModal
      dismissible
      headline={t('modalHeadline')}
      onOdsModalClose={cancel}
    >
      {hasVrackOrderAsked &&
        !isPending &&
        !isSendOrderPending &&
        !isSendOrderError && (
          <OsdsText
            className="block mb-4"
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('modalDescriptionLine4')}
          </OsdsText>
        )}
      {hasVrackServiceOrderAsked &&
        !isPending &&
        !isSendOrderPending &&
        !isSendOrderError && (
          <OsdsText
            className="block mb-4"
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('modalDescriptionLine5')}
          </OsdsText>
        )}
      {(!hasVrackServiceOrderAsked || isPending || isSendOrderPending) && (
        <>
          <OsdsText
            className="block mb-4"
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('modalDescriptionLine1')}
          </OsdsText>
          <OsdsText
            className="block mb-4"
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('modalDescriptionLine2')}
          </OsdsText>
        </>
      )}
      {isError && (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.error}
          icon={ODS_ICON_NAME.ERROR_CIRCLE}
          className="mb-6"
        >
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {error?.response?.data?.message}
          </OsdsText>
        </OsdsMessage>
      )}
      {isSendOrderError && !isSendOrderError && (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.error}
          icon={ODS_ICON_NAME.ERROR_CIRCLE}
          className="mb-6"
        >
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {sendOrderError?.response?.data?.message}
          </OsdsText>
        </OsdsMessage>
      )}
      {(isPending || isSendOrderPending) && (
        <LoadingText title={t('modalCreateOrderWaitMessage')} />
      )}
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(cancel)}
      >
        {t('modalCancelButtonLabel')}
      </OsdsButton>
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
          <OsdsButton
            slot="actions"
            type={ODS_BUTTON_TYPE.button}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            disabled={isPending || isSendOrderPending || undefined}
            {...handleClick(() => {
              setHasVrackServiceOrderAsked(true);
              trackClick({
                ...trackingParams,
                actions: ['no-vrack', 'confirm'],
              });
              createCart({ region, hasVrack: false });
            })}
          >
            {t('modalNoVrackButtonLabel')}
          </OsdsButton>
          <OsdsButton
            slot="actions"
            type={ODS_BUTTON_TYPE.button}
            variant={ODS_BUTTON_VARIANT.flat}
            color={ODS_THEME_COLOR_INTENT.primary}
            disabled={isPending || isSendOrderPending || undefined}
            {...handleClick(() => {
              setHasVrackOrderAsked(true);
              setHasVrackServiceOrderAsked(true);
              trackClick({
                ...trackingParams,
                actions: ['create-vrack', 'confirm'],
              });
              createCart({ region, hasVrack: true });
            })}
          >
            {t('modalConfirmVrackButtonLabel')}
          </OsdsButton>
        </>
      )}
    </OsdsModal>
  );
}
