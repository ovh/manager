import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_TEXT_PRESET,
  ODS_MESSAGE_COLOR,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  OdsText,
  OdsButton,
  OdsMessage,
  OdsCheckbox,
  OdsLink,
} from '@ovhcloud/ods-components/react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Contract, Order } from '@ovh-ux/manager-module-order';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useSendOrder } from '@ovh-ux/manager-network-common';
import { LoadingText } from '@/components/LoadingText.component';

export type OrderSubmitModalContentProps = {
  submitButtonLabel: string;
  contractList: Contract[];
  cartId: string;
  onSuccess: (data: ApiResponse<Order>) => void;
  onError?: (data: ApiError) => void;
};

export const OrderSubmitModalContent: React.FC<OrderSubmitModalContentProps> = ({
  submitButtonLabel,
  contractList,
  cartId,
  onSuccess,
  onError,
}) => {
  const { t } = useTranslation('vrack-services');
  const { trackClick } = useOvhTracking();
  const [isContractAccepted, setIsContractAccepted] = React.useState(false);
  const { sendOrder, isPending, error, isError } = useSendOrder();

  return (
    <>
      {isError && (
        <OdsMessage
          isDismissible={false}
          color={ODS_MESSAGE_COLOR.critical}
          className="block mb-6"
        >
          {error?.response?.data?.message}
        </OdsMessage>
      )}
      <div className="flex">
        <OdsCheckbox
          name="confirm-contract"
          inputId="confirm-contract"
          isChecked={isContractAccepted}
          onOdsChange={(event) => setIsContractAccepted(event.detail.checked)}
        />
        <label className="ml-3 cursor-pointer" htmlFor="confirm-contract">
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('modalConfirmContractsCheckboxLabel')}
          </OdsText>
        </label>
      </div>
      <ul>
        {contractList.map(({ name, url }) => (
          <li key={name}>
            <OdsLink
              href={url}
              target="_blank"
              icon={ODS_ICON_NAME.externalLink}
              label={name}
            />
          </li>
        ))}
      </ul>
      {isPending && <LoadingText title={t('modalSubmitOrderWaitMessage')} />}
      <OdsButton
        slot="actions"
        type="button"
        isDisabled={!isContractAccepted}
        label={submitButtonLabel}
        onClick={() => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actions: ['order', 'confirm'],
          });
          sendOrder({ cartId, onSuccess, onError });
        }}
      />
    </>
  );
};
