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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OrderDescription,
  getDeliveringOrderQueryKey,
  getVrackListQueryKey,
  orderVrack,
  orderVrackQueryKey,
  useOrderPollingStatus,
} from '@/api';
import { DeliveringMessages } from '../DeliveringMessages';
import { handleClick } from '@/utils/ods-utils';

export type CreateVrackProps = {
  closeModal: () => void;
};

export const CreateVrack: React.FC<CreateVrackProps> = ({ closeModal }) => {
  const { t } = useTranslation('vrack-services/listing');
  const { environment } = React.useContext(ShellContext);
  const user = environment.getUser();
  const queryClient = useQueryClient();

  const {
    data: vrackDeliveringOrders,
    isLoading: areVrackOrdersLoading,
    isError: isVrackOrdersError,
    error: vrackOrdersError,
  } = useOrderPollingStatus({
    pollingKey: OrderDescription.vrack,
    queryToInvalidateOnDelivered: getVrackListQueryKey,
  });

  const { mutate: orderNewVrack, isPending, isError, error } = useMutation({
    mutationFn: () => orderVrack({ ovhSubsidiary: user.ovhSubsidiary }),
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
      {(areVrackOrdersLoading || isPending) && (
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
      )}
      <DeliveringMessages
        messageKey="deliveringVrackMessage"
        orders={vrackDeliveringOrders}
      />
      {(isError || isVrackOrdersError) && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          {t('genericApiError', {
            error: error || vrackOrdersError,
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
          isPending ||
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
