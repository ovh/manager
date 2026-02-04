import React, { useContext } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  MODAL_COLOR,
  Modal,
  ModalBody,
  ModalContent,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { LogsContext } from '@/LogsToCustomer.context';
import { NAMESPACES } from '@/LogsToCustomer.translations';
import { useDeleteLogSubscription } from '@/data/hooks/useLogSubscriptions';

export default function DataStreamsTerminate() {
  const navigate = useNavigate();
  const { t } = useTranslation(NAMESPACES.LOG_SUBSCRIPTION);
  const { subscriptionId } = useParams();
  const { currentLogKind, logApiUrls, logApiVersion } = useContext(LogsContext);

  const closeModal = () => {
    navigate('..');
  };

  const { mutate, isPending } = useDeleteLogSubscription({
    logSubscriptionUrl: logApiUrls.logSubscription,
    apiVersion: logApiVersion,
    subscriptionId: subscriptionId ?? '',
    logKind: currentLogKind,
    onSettled: closeModal,
  });

  return (
    <Modal open>
      <ModalContent dismissible={false} color={MODAL_COLOR.critical}>
        <ModalBody className="space-y-4">
          <Text preset={TEXT_PRESET.heading4}>
            {t('log_subscription_terminate_modal_headline')}
          </Text>
          <Text preset={TEXT_PRESET.paragraph}>
            {t('log_subscription_terminate_modal_description')}
          </Text>
          <div className="flex justify-end gap-2">
            <Button
              color={BUTTON_COLOR.primary}
              onClick={closeModal}
              disabled={isPending}
              variant={BUTTON_VARIANT.ghost}
            >
              {t('log_subscription_terminate_modal_cancel_button')}
            </Button>
            <Button
              color={BUTTON_COLOR.critical}
              onClick={() => mutate()}
              disabled={isPending}
              loading={isPending}
              variant={BUTTON_VARIANT.default}
            >
              {t('log_subscription_terminate_modal_confirm_button')}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
