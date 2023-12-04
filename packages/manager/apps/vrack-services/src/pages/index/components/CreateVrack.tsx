import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthentication } from '@ovh-ux/manager-react-core-application';
import { CountryCode } from '@ovh-ux/manager-config';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import {
  OrderDescription,
  getDeliveringOrderQueryKey,
  getVrackListQueryKey,
  orderVrack,
  orderVrackQueryKey,
  useOrderPollingStatus,
} from '@/api';
import { DeliveringMessages } from './DeliveringMessages';
import { handleClick } from '@/utils/ods-utils';

export type CreateVrackProps = {
  closeModal: () => void;
};

export const CreateVrack: React.FC<CreateVrackProps> = ({ closeModal }) => {
  const { t } = useTranslation('vrack-services/listing');
  const { subsidiary } = useAuthentication();
  const queryClient = useQueryClient();

  const {
    data: vrackDeliveringOrders,
    isLoading: areVrackOrdersLoading,
    isError: isVrackOrdersError,
  } = useOrderPollingStatus({
    pollingKey: OrderDescription.vrack,
    queryToInvalidateOnDelivered: getVrackListQueryKey,
  });

  const { mutate: orderNewVrack, isLoading, isError } = useMutation({
    mutationFn: () => orderVrack({ ovhSubsidiary: subsidiary as CountryCode }),
    mutationKey: orderVrackQueryKey,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getDeliveringOrderQueryKey(OrderDescription.vrack),
      });
      closeModal();
    },
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
      {(areVrackOrdersLoading || isLoading) && (
        <OsdsSpinner inline type={ODS_SPINNER_SIZE.md} />
      )}
      {!areVrackOrdersLoading && vrackDeliveringOrders.length > 0 && (
        <DeliveringMessages
          message={t('deliveringVrackMessage')}
          orders={vrackDeliveringOrders}
        />
      )}
      {(isError || isVrackOrdersError) && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          {t('genericApiError')}
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
          isLoading ||
          vrackDeliveringOrders.length > 0 ||
          isVrackOrdersError ||
          isError ||
          undefined
        }
        {...handleClick(() => orderNewVrack())}
      >
        {t('modalCreateNewVrackButtonLabel')}
      </OsdsButton>
    </>
  );
};
