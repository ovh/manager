import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  Button,
  Checkbox,
  ICON_NAME,
  Link,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import type { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import type { Contract, Order } from '@ovh-ux/manager-module-order';
import { useSendOrder } from '@ovh-ux/manager-network-common';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { LoadingText } from '@/components/LoadingText.component';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

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
  const { t } = useTranslation([TRANSLATION_NAMESPACES.common, NAMESPACES.ORDER]);
  const { trackClick } = useOvhTracking();
  const [isContractAccepted, setIsContractAccepted] = React.useState(false);
  const { sendOrder, isPending, error, isError } = useSendOrder();

  return (
    <>
      {isError && (
        <Message dismissible={false} color={MESSAGE_COLOR.critical} className="mb-6">
          <MessageIcon name="hexagon-exclamation" />
          <MessageBody>{error?.response?.data?.message}</MessageBody>
        </Message>
      )}
      <div className="flex">
        <Checkbox
          name="confirm-contract"
          checked={isContractAccepted}
          onCheckedChange={(event) =>
            setIsContractAccepted(event.checked && event.checked !== 'indeterminate')
          }
        />
        <label className="ml-3 cursor-pointer" htmlFor="confirm-contract">
          <Text preset={TEXT_PRESET.paragraph}>{t('accept_terms', { ns: NAMESPACES.ORDER })}</Text>
        </label>
      </div>
      <ul>
        {contractList.map(({ name, url }) => (
          <li key={name}>
            <Link href={url} target="_blank" icon={ICON_NAME.externalLink}>
              {name}
            </Link>
          </li>
        ))}
      </ul>
      {isPending && <LoadingText title={t('modalSubmitOrderWaitMessage')} />}
      <Button
        type="button"
        disabled={!isContractAccepted}
        onClick={() => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actions: ['order', 'confirm'],
          });
          sendOrder({ cartId, onSuccess, onError });
        }}
      >
        {submitButtonLabel}
      </Button>
    </>
  );
};
