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
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  OsdsText,
  OsdsSpinner,
  OsdsButton,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import {
  OrderDescription,
  useOrderPollingStatus,
  useOrderURL,
} from '@ovh-ux/manager-module-order';
import { getVrackListQueryKey } from '@/api';
import { DeliveringMessages } from '../DeliveringMessages';
import { handleClick } from '@/utils/ods-utils';

export type CreateVrackProps = {
  closeModal: () => void;
};

export const CreateVrack: React.FC<CreateVrackProps> = ({ closeModal }) => {
  const { t } = useTranslation('vrack-services/listing');
  const vrackOrderUrl = useOrderURL('vrack');

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
        {t('modalVrackCreationDescription')}
      </OsdsText>
      {areVrackOrdersLoading && (
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
      )}
      <DeliveringMessages
        messageKey="deliveringVrackMessage"
        orders={vrackDeliveringOrders}
      />
      {isVrackOrdersError && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          {t('genericApiError', {
            error: vrackOrdersError,
            interpolation: { escapeValue: false },
          })}
        </OsdsMessage>
      )}
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(closeModal)}
      >
        {t('modalCancelVrackAssociationButtonLabel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={
          areVrackOrdersLoading ||
          vrackDeliveringOrders.length > 0 ||
          isVrackOrdersError ||
          undefined
        }
        target={OdsHTMLAnchorElementTarget._blank}
        href={vrackOrderUrl}
        {...handleClick(closeModal)}
      >
        {t('modalCreateNewVrackButtonLabel')}
      </OsdsButton>
    </>
  );
};
