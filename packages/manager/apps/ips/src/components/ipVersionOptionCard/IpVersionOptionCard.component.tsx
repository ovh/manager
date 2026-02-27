import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  CARD_COLOR,
  RadioControl,
  RadioGroup,
  SPINNER_SIZE,
  TEXT_PRESET,
  Card,
  Radio,
  Spinner,
  Text,
} from '@ovhcloud/ods-react';

import { PriceDescription } from '../PriceDescription/PriceDescription';
import { handleEnterAndEscapeKeyDown } from '@/utils';
import './ip-version-option-card.scss';

export type IpVersionOptionCardProps = React.PropsWithChildren<{
  className?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  loading?: boolean;
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
  loading,
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
    <Card
      tabIndex={0}
      color={CARD_COLOR.neutral}
      className={`flex flex-col justify-between transition-shadow ${stateStyle} ${cardStyle} ${className}`}
      onClick={() => !isDisabled && onClick?.()}
      {...handleEnterAndEscapeKeyDown({
        onEnter: () => !isDisabled && onClick?.(),
      })}
    >
      <Text className="justify-left m-4 flex" preset={TEXT_PRESET.heading4}>
        <span className="mr-3 h-full align-middle">
          <RadioGroup
            value={isSelected ? 'selected' : 'notSelected'}
            disabled={isDisabled}
          >
            <Radio value="selected" disabled={isDisabled}>
              <RadioControl />
            </Radio>
          </RadioGroup>
        </span>
        <span>{title}</span>
      </Text>
      {description && (
        <Text
          className="m-4 mt-0 flex justify-center text-left"
          preset={TEXT_PRESET.paragraph}
        >
          {description}
        </Text>
      )}
      {loading ? (
        <div className="text-center">
          <Spinner size={SPINNER_SIZE.xs} />
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
    </Card>
  );
};
