import React from 'react';
import {
  ODS_CARD_COLOR,
  ODS_TEXT_PRESET,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OdsCard,
  OdsRadio,
  OdsText,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { handleClick } from '@ovh-ux/manager-react-components';
import './ip-version-option-card.scss';
import { useTranslation } from 'react-i18next';
import { PriceDescription } from '../PriceDescription/PriceDescription';

export type IpVersionOptionCardProps = React.PropsWithChildren<{
  className?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  title: React.ReactNode;
  description?: string;
  isStartingPrice?: boolean;
  price: number;
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
      className={`flex flex-col transition-shadow justify-between ${stateStyle} ${cardStyle} ${className}`}
      {...handleClick(() => !isDisabled && onClick?.())}
      color={ODS_CARD_COLOR.neutral}
    >
      <OdsText
        className="flex justify-left m-4"
        preset={ODS_TEXT_PRESET.heading4}
      >
        <span className="h-full align-middle mr-3">
          <OdsRadio name="" is-checked={isSelected}></OdsRadio>
        </span>
        <span>{title}</span>
      </OdsText>
      {description && (
        <OdsText
          className="flex justify-center text-left mt-0 m-4"
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
        <span className="card-children p-4 rounded-b-md">
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
