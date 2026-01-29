import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_CARD_COLOR,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsCard,
  OdsRadio,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { handleClick } from '@ovh-ux/manager-react-components';

import { PriceDescription } from '../PriceDescription/PriceDescription';
import './ip-version-option-card.scss';

export type IpVersionOptionCardProps = React.PropsWithChildren<{
  className?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  title: React.ReactNode;
  description?: string;
  isStartingPrice?: boolean;
  price: number | null;
  priceSuffix?: string;
}>;

export const IpVersionOptionCard: React.FC<IpVersionOptionCardProps> = ({
  className,
  isDisabled,
  isSelected,
  isLoading,
  onClick,
  title,
  description,
  isStartingPrice,
  price,
  priceSuffix,
}) => {
  const { t } = useTranslation();
  const stateStyle = isDisabled
    ? 'cursor-not-allowed bg-neutral-100'
    : 'cursor-pointer hover:shadow-md';
  const cardStyle = isSelected ? 'option_card_selected' : 'option_card m-[1px]';
  return (
    <OdsCard
      tabIndex={0}
      className={`flex flex-col justify-between transition-shadow ${stateStyle} ${cardStyle} ${className}`}
      {...handleClick(() => !isDisabled && onClick?.())}
      color={ODS_CARD_COLOR.neutral}
    >
      <OdsText
        className="justify-left m-4 flex"
        preset={ODS_TEXT_PRESET.heading4}
      >
        <span className="mr-3 h-full align-middle">
          <OdsRadio name="" is-checked={isSelected}></OdsRadio>
        </span>
        <span>{title}</span>
      </OdsText>
      {description && (
        <OdsText
          className="m-4 mt-0 flex justify-center text-left"
          preset={ODS_TEXT_PRESET.paragraph}
        >
          {description}
        </OdsText>
      )}
      {isLoading ? (
        <div className="text-center">
          <OdsSpinner size={ODS_SPINNER_SIZE.xs} />
        </div>
      ) : (
        <span className="card-children rounded-b-md p-4">
          {!isStartingPrice && price === 0 ? (
            <span className="free-price">{t('free_price')}</span>
          ) : (
            <PriceDescription
              isStartingPrice
              price={price}
              suffix={priceSuffix}
              shouldOverrideStyle={true}
            />
          )}
        </span>
      )}
    </OdsCard>
  );
};
