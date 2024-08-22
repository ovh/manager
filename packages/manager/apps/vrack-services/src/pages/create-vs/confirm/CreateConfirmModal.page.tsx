import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateCartResult,
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
import { ApiError } from '@ovh-ux/manager-core-api';
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
import { MessagesContext } from '@/components/feedback-messages/Messages.context';

const trackingParams: TrackingClickParams = {
  buttonType: ButtonType.button,
  location: PageLocation.popup,
};

export default function CreateConfirmModal() {
  const { t } = useTranslation('vrack-services/create');
  const { trackClick } = useOvhTracking();
  const { region } = useParams();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { environment } = React.useContext(ShellContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: createCart, data, error, isError, isPending } = useMutation<
    CreateCartResult,
    ApiError,
    { hasVrack?: boolean; region: string }
  >({
    mutationFn: (params) =>
      createVrackServicesCart({
        ovhSubsidiary: environment.user.ovhSubsidiary,
        ...params,
      }),
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
      <OsdsText
        className="block mb-8"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('modalDescriptionLine3')}
      </OsdsText>
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
      {isPending && <LoadingText title={t('modalCreateOrderWaitMessage')} />}
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
          onSuccess={async (orderResponse) => {
            await queryClient.invalidateQueries({
              queryKey: getDeliveringOrderQueryKey(
                OrderDescription.vrackServices,
              ),
            });

            await queryClient.invalidateQueries({
              queryKey: getDeliveringOrderQueryKey(OrderDescription.vrack),
            });

            addSuccessMessage(t('vrackServicesCreationSuccess'), {
              linkLabel: t('vrackServicesOrderLinkLabel'),
              linkUrl: orderResponse.data.url,
            });

            navigate(urls.listing);
          }}
        />
      ) : (
        <>
          <OsdsButton
            slot="actions"
            type={ODS_BUTTON_TYPE.button}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            disabled={isPending || undefined}
            {...handleClick(() => {
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
            disabled={isPending || undefined}
            {...handleClick(() => {
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
