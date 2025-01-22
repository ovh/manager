import React from 'react';
import {
  IntervalUnitType,
  OvhSubsidiary,
  Price,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_CARD_COLOR,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsCard,
  OdsDivider,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import './option-card.scss';

export type OptionCardProps = React.PropsWithChildren<{
  className?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: string;
}>;

export const OptionCard: React.FC<OptionCardProps> = ({
  className,
  isDisabled,
  isSelected,
  onClick,
  title,
  description,
  subtitle,
  children,
}) => {
  const stateStyle = isDisabled
    ? 'cursor-not-allowed bg-neutral-100'
    : 'cursor-pointer hover:shadow-md';
  const borderStyle = isSelected ? 'option_card_selected' : 'm-[1px]';
  return (
    <OdsCard
      className={`flex flex-col p-3 transition-shadow ${stateStyle} ${borderStyle} ${className}`}
      onClick={() => !isDisabled && onClick?.()}
      color={ODS_CARD_COLOR.neutral}
    >
      <OdsText
        className="flex justify-center mb-2"
        preset={ODS_TEXT_PRESET.heading4}
      >
        {title}
      </OdsText>
      {subtitle && (
        <OdsText
          preset={ODS_TEXT_PRESET.paragraph}
          className="flex justify-center mb-4"
        >
          {subtitle}
        </OdsText>
      )}
      {description && (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{description}</OdsText>
      )}
      <OdsDivider className="block -ml-3 -mr-3 mt-auto mb-2" />
      {children}
    </OdsCard>
  );
};

export type PriceFooterProps = {
  price: number | null;
  suffix?: string;
  isStartingPrice?: boolean;
};

export const PriceDescription: React.FC<PriceFooterProps> = ({
  price,
  suffix,
  isStartingPrice,
}) => {
  const { i18n } = useTranslation();
  const { environment } = React.useContext(ShellContext);

  return (
    <OdsText preset={ODS_TEXT_PRESET.paragraph} className="flex justify-center">
      {price === null ? (
        <OdsSpinner size={ODS_SPINNER_SIZE.xs} />
      ) : (
        <Price
          isStartingPrice={isStartingPrice}
          suffix={suffix}
          value={price}
          tax={0}
          intervalUnit={IntervalUnitType.month}
          ovhSubsidiary={environment.user.ovhSubsidiary as OvhSubsidiary}
          locale={i18n.language}
        />
      )}
    </OdsText>
  );
};
