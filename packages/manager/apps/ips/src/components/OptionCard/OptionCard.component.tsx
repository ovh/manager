import React from 'react';
import {
  ODS_CARD_COLOR,
  ODS_TEXT_PRESET,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OdsCard,
  OdsDivider,
  OdsText,
  OdsSpinner,
  OdsRadio,
} from '@ovhcloud/ods-components/react';
import { handleClick } from '@ovh-ux/manager-react-components';
import './option-card.scss';

export type OptionCardProps = React.PropsWithChildren<{
  className?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
  hasRadioButton?: boolean;
  onClick?: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: string;
}>;

export const OptionCard: React.FC<OptionCardProps> = ({
  className,
  isDisabled,
  isSelected,
  isLoading,
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
  const justifyStyle = hasRadioButton ? 'justify-left' : 'justify-center';
  return (
    <OdsCard
      tabIndex={0}
      className={`flex flex-col justify-between transition-shadow ${stateStyle} ${borderStyle} ${className}`}
      {...handleClick(() => !isDisabled && onClick?.())}
      color={ODS_CARD_COLOR.neutral}
    >
      {hasRadioButton ? (
        <OdsText
          className="flex justify-left m-4"
          preset={ODS_TEXT_PRESET.heading4}
        >
          <span className="h-full align-middle mr-3">
            <OdsRadio name="" isChecked={isSelected} />
          </span>
          <span>{title}</span>
        </OdsText>
      ) : (
        <OdsText
          className="flex justify-center m-4"
          preset={ODS_TEXT_PRESET.heading4}
        >
          {title}
        </OdsText>
      )}
      {subtitle && (
        <OdsText
          preset={ODS_TEXT_PRESET.paragraph}
          className={`flex ${justifyStyle} m-4`}
        >
          {subtitle}
        </OdsText>
      )}
      {description && (
        <OdsText
          className={`flex ${justifyStyle} m-4 text-center`}
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
        children && (
          <span className="card-children p-4 rounded-b-md">{children}</span>
        )
      )}
    </OdsCard>
  );
};
