import React from 'react';

import {
  RadioControl,
  RadioGroup,
  SPINNER_SIZE,
  TEXT_PRESET,
  Card,
  Radio,
  Spinner,
  Text,
} from '@ovhcloud/ods-react';

import './option-card.scss';
import { handleEnterAndEscapeKeyDown } from '@/utils';

export type OptionCardProps = React.PropsWithChildren<{
  className?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  loading?: boolean;
  hasRadioButton?: boolean;
  onClick?: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: string;
}>;

export const OptionCard: React.FC<OptionCardProps> = ({
  className = '',
  isDisabled,
  isSelected,
  loading,
  hasRadioButton,
  onClick,
  title,
  description,
  subtitle,
  children,
}) => {
  const stateStyle = isDisabled
    ? 'cursor-not-allowed bg-neutral-100'
    : 'cursor-pointer hover:shadow-md';
  const borderStyle = isSelected
    ? 'option_card_selected'
    : 'option_card m-[1px]';
  const justifyStyle = hasRadioButton ? 'justify-start' : 'justify-center';
  return (
    <Card
      tabIndex={0}
      className={`flex flex-col justify-between transition-shadow ${stateStyle} ${borderStyle} ${className}`}
      onClick={() => !isDisabled && onClick?.()}
      {...handleEnterAndEscapeKeyDown({
        onEnter: () => !isDisabled && onClick?.(),
      })}
      color="neutral"
    >
      {hasRadioButton ? (
        <Text className="m-4 flex justify-start" preset={TEXT_PRESET.heading4}>
          <span className="mr-3 h-full align-middle">
            <RadioGroup
              value={isSelected ? 'selected' : 'notSelected'}
              disabled={isDisabled}
            >
              <Radio value="selected">
                <RadioControl />
              </Radio>
            </RadioGroup>
          </span>
          <span>{title}</span>
        </Text>
      ) : (
        <Text className="m-4 flex justify-center" preset={TEXT_PRESET.heading4}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text
          preset={TEXT_PRESET.paragraph}
          className={`flex ${justifyStyle} m-4`}
        >
          {subtitle}
        </Text>
      )}
      {description && (
        <Text
          className={`flex ${justifyStyle} m-4 text-center`}
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
        children && (
          <span className="card-children rounded-b-md p-4">{children}</span>
        )
      )}
    </Card>
  );
};
