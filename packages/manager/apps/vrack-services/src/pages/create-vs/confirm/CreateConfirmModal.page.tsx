import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  Modal,
  ModalBody,
  ModalContent,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OrderDescription, getDeliveringOrderQueryKey } from '@ovh-ux/manager-module-order';
import { useCreateVrackServicesCart } from '@ovh-ux/manager-network-common';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import type { TrackingClickParams } from '@ovh-ux/manager-react-shell-client';

import { LoadingText } from '@/components/LoadingText.component';
import { OrderSubmitModalContent } from '@/components/OrderSubmitModalContent.component';
import { urls } from '@/routes/RoutesAndUrl.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

const trackingParams: TrackingClickParams = {
  buttonType: ButtonType.button,
  location: PageLocation.popup,
};

export default function CreateConfirmModal() {
  const [hasVrackServiceOrderAsked, setHasVrackServiceOrderAsked] = useState<boolean>(false);
  const [hasVrackOrderAsked, setHasVrackOrderAsked] = useState<boolean>(false);
  const { t } = useTranslation([TRANSLATION_NAMESPACES.create, NAMESPACES.ACTIONS]);
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
  } = useCreateVrackServicesCart();

  const cancel = () => {
    trackClick({
      ...trackingParams,
      actions: ['add_vrack-services', 'cancel'],
    });
    navigate('..');
  };

  return (
    <Modal
      open
      closeOnEscape={!isPending}
      closeOnInteractOutside={!isPending}
      onOpenChange={cancel}
    >
      <ModalContent dismissible={!isPending}>
        <ModalBody>
          <Text preset={TEXT_PRESET.heading4}>{t('modalHeadline')}</Text>
          {hasVrackOrderAsked && !isPending && !isSendOrderPending && !isSendOrderError && (
            <Text className="mb-4 block" preset={TEXT_PRESET.paragraph}>
              {t('modalDescriptionLine4')}
            </Text>
          )}
          {hasVrackServiceOrderAsked && !isPending && !isSendOrderPending && !isSendOrderError && (
            <Text className="mb-4 block" preset={TEXT_PRESET.paragraph}>
              {t('modalDescriptionLine5')}
            </Text>
          )}
          {(!hasVrackServiceOrderAsked || isPending || isSendOrderPending) && (
            <>
              <Text className="mb-4 block" preset={TEXT_PRESET.paragraph}>
                {t('modalDescriptionLine1')}
              </Text>
              <Text className="mb-4 block" preset={TEXT_PRESET.paragraph}>
                {t('modalDescriptionLine2')}
              </Text>
            </>
          )}
          {isError && (
            <Message dismissible={false} color={MESSAGE_COLOR.critical} className="mb-6">
              <MessageIcon name="hexagon-exclamation" />
              <MessageBody>{error?.response?.data?.message}</MessageBody>
            </Message>
          )}
          {isSendOrderError && !isSendOrderError && (
            <Message dismissible={false} color={MESSAGE_COLOR.critical} className="mb-6">
              <MessageIcon name="hexagon-exclamation" />
              <MessageBody>{sendOrderError?.response?.data?.message}</MessageBody>
            </Message>
          )}
          {(isPending || isSendOrderPending) && (
            <LoadingText title={t('modalCreateOrderWaitMessage')} />
          )}
          <div className="flex justify-end gap-4">
            <Button slot="actions" type="button" variant={BUTTON_VARIANT.ghost} onClick={cancel}>
              {t('cancel', { ns: NAMESPACES.ACTIONS })}
            </Button>
            {data?.contractList && data.contractList.length > 0 ? (
              <OrderSubmitModalContent
                submitButtonLabel={t('confirm', { ns: NAMESPACES.ACTIONS })}
                cartId={data?.cartId || ''}
                contractList={data.contractList}
                onSuccess={() => {
                  void queryClient.invalidateQueries({
                    queryKey: getDeliveringOrderQueryKey(OrderDescription.vrackServices),
                  });

                  void queryClient.invalidateQueries({
                    queryKey: getDeliveringOrderQueryKey(OrderDescription.vrack),
                  });

                  navigate(urls.listing, { state: { fromOrder: true } });
                }}
              />
            ) : (
              <>
                <Button
                  type="button"
                  variant={BUTTON_VARIANT.outline}
                  disabled={isPending || isSendOrderPending}
                  onClick={() => {
                    setHasVrackServiceOrderAsked(true);
                    trackClick({
                      ...trackingParams,
                      actions: ['no-vrack', 'confirm'],
                    });
                    createCart({
                      region: region || '',
                      hasVrack: false,
                      ovhSubsidiary: environment.user.ovhSubsidiary,
                    });
                  }}
                >
                  {t('modalNoVrackButtonLabel')}
                </Button>
                <Button
                  type="button"
                  disabled={isPending || isSendOrderPending}
                  onClick={() => {
                    setHasVrackOrderAsked(true);
                    setHasVrackServiceOrderAsked(true);
                    trackClick({
                      ...trackingParams,
                      actions: ['create-vrack', 'confirm'],
                    });
                    createCart({
                      region: region || '',
                      hasVrack: true,
                      ovhSubsidiary: environment.user.ovhSubsidiary,
                    });
                  }}
                >
                  {t('modalConfirmVrackButtonLabel')}
                </Button>
              </>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
