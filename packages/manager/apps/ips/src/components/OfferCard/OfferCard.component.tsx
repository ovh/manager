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
  OdsSelect,
  OdsSkeleton,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import './offer-card.scss';

export type OfferCardProps = {
  className?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  setSelectedPlanCode: React.Dispatch<React.SetStateAction<string>>;
  selectedPlanCode: string;
  title: string;
  description: string;
  price: number;
  options?: { label: string; value: string }[];
  isLoading?: boolean;
};

export const OfferCard: React.FC<OfferCardProps> = ({
  className,
  isDisabled,
  isSelected,
  onClick,
  selectedPlanCode,
  setSelectedPlanCode,
  title,
  description,
  price,
  options,
  isLoading,
}) => {
  const { environment } = React.useContext(ShellContext);
  const { t, i18n } = useTranslation();
  const stateStyle = isDisabled
    ? 'cursor-not-allowed bg-neutral-100'
    : 'cursor-pointer';
  const borderStyle = isSelected
    ? 'offer_card_selected'
    : 'm-[1px] hover:shadow-md';

  return (
    <OdsCard
      className={`flex flex-col p-3 transition-shadow ${stateStyle} ${borderStyle} ${className}`}
      onClick={() => !isDisabled && onClick?.()}
      color={ODS_CARD_COLOR.neutral}
    >
      <OdsText
        className="flex justify-center mb-4"
        preset={ODS_TEXT_PRESET.heading4}
      >
        {title}
      </OdsText>
      <OdsText
        preset={ODS_TEXT_PRESET.paragraph}
        className="flex justify-center mb-4"
      >
        {price === null ? (
          <OdsSpinner size={ODS_SPINNER_SIZE.xs} />
        ) : (
          <Price
            suffix={t('per_ip_full')}
            value={price}
            tax={0}
            intervalUnit={IntervalUnitType.month}
            ovhSubsidiary={environment.user.ovhSubsidiary as OvhSubsidiary}
            locale={i18n.language}
          />
        )}
      </OdsText>
      <OdsText className="block text-center" preset={ODS_TEXT_PRESET.paragraph}>
        {description}
      </OdsText>
      <OdsDivider className="block -ml-3 -mr-3 mt-auto mb-2" />
      {isLoading ? (
        <OdsSkeleton />
      ) : (
        <OdsSelect
          key={options.reduce((result, { value }) => result + value, '')}
          name={title}
          value={selectedPlanCode}
          onOdsChange={(event) =>
            setSelectedPlanCode(event.target.value as string)
          }
        >
          {options.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </OdsSelect>
      )}
    </OdsCard>
  );
};
