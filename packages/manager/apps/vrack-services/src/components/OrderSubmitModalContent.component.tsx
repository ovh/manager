import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_ICON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  OsdsText,
  OsdsButton,
  OsdsMessage,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsLink,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { handleClick } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Contract, Order } from '@ovh-ux/manager-module-order';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useSendOrder } from '@/data/hooks/useSendOrder';
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
      <OsdsCheckbox
        className="block"
        checked={isContractAccepted}
        onOdsCheckedChange={(event) =>
          setIsContractAccepted(event.target.checked)
        }
      >
        <OsdsCheckboxButton
          size={ODS_CHECKBOX_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          <span slot="end">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
            >
              {t('modalConfirmContractsCheckboxLabel')}
            </OsdsText>
          </span>
        </OsdsCheckboxButton>
      </OsdsCheckbox>
      <ul>
        {contractList.map(({ name, url }) => (
          <li key={name}>
            <OsdsLink
              href={url}
              target={OdsHTMLAnchorElementTarget._blank}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {name}
              <OsdsIcon
                className="ml-4"
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_ICON_SIZE.xxs}
                name={ODS_ICON_NAME.EXTERNAL_LINK}
              />
            </OsdsLink>
          </li>
        ))}
      </ul>
      {isPending && <LoadingText title={t('modalSubmitOrderWaitMessage')} />}
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        disabled={!isContractAccepted || undefined}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(() => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actions: ['order', 'confirm'],
          });
          sendOrder({ cartId, onSuccess, onError });
        })}
      >
        {submitButtonLabel}
      </OsdsButton>
    </>
  );
};
