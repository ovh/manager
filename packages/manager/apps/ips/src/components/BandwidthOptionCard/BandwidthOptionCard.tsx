import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_CARD_COLOR,
  ODS_ICON_NAME,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsCard,
  OdsIcon,
  OdsMessage,
  OdsRadio,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';

import { useBandwidthFormatConverter } from '@ovh-ux/manager-network-common';
import { handleClick } from '@ovh-ux/manager-react-components';

import { PriceDescription } from '../PriceDescription/PriceDescription';

import './bandwidth-option-card.scss';

export type BandwidthOptionCardProps = {
  className?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  message?: string;
  messageColor?: ODS_MESSAGE_COLOR;
  onClick?: () => void;
  bandwidthLimit: number;
  price: number;
  tooltip?: string;
};

export const BandwidthOptionCard: React.FC<BandwidthOptionCardProps> = ({
  className,
  isDisabled,
  isSelected,
  message,
  messageColor = ODS_MESSAGE_COLOR.information,
  onClick,
  bandwidthLimit,
  price,
  tooltip,
}) => {
  const { t } = useTranslation();
  const stateStyle = isDisabled
    ? 'cursor-not-allowed bg-neutral-100'
    : 'cursor-pointer hover:shadow-md';
  const cardStyle = isSelected ? 'option_card_selected' : 'option_card m-[1px]';
  const converter = useBandwidthFormatConverter();
  return (
    <OdsCard
      tabIndex={0}
      className={`flex max-w-[320px] flex-col transition-shadow ${stateStyle} ${cardStyle} ${className}`}
      {...handleClick(() => !isDisabled && onClick?.())}
      color={ODS_CARD_COLOR.neutral}
    >
      <div className="flex justify-between">
        <OdsText
          className="mx-5 my-7 flex items-center whitespace-nowrap"
          preset={ODS_TEXT_PRESET.heading4}
        >
          <OdsRadio
            className="mr-5 align-middle"
            name=""
            isChecked={isSelected}
          />
          <span>{converter(bandwidthLimit).perSecondFormat}</span>
          {tooltip && (
            <>
              <OdsIcon
                id={`tooltip-bandwidth-option-${bandwidthLimit}-${price}`}
                name={ODS_ICON_NAME.circleInfo}
                tabIndex={0}
                className="ml-4 cursor-pointer text-sm text-[var(--ods-color-text)]"
              />
              <OdsTooltip
                triggerId={`tooltip-bandwidth-option-${bandwidthLimit}-${price}`}
                withArrow
              >
                <OdsText className="max-w-[200px] whitespace-normal p-2">
                  {tooltip}
                </OdsText>
              </OdsTooltip>
            </>
          )}
        </OdsText>
        <span className="rounded-b-md px-5 py-7">
          {price === 0 ? (
            <span className="free-price">{t('free_price')}</span>
          ) : (
            <PriceDescription price={price} shouldOverrideStyle />
          )}
        </span>
      </div>
      {!!message && (
        <OdsMessage
          className="m-3 mt-0"
          color={messageColor}
          isDismissible={false}
        >
          <span className="text-sm">{message}</span>
        </OdsMessage>
      )}
    </OdsCard>
  );
};
