import React from 'react';
import {
  Card,
  CARD_COLOR,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';

interface PriceCardProps {
  readonly checked: boolean;
  readonly disabled?: boolean;
  readonly title: string;
  readonly footer: string | JSX.Element;
  readonly onCheckBoxChange?: () => void;
}

export default function PriceCard({
  checked,
  title,
  footer,
  disabled,
  onCheckBoxChange,
}: PriceCardProps) {
  const bgColor = disabled ? 'bg-gray-50' : 'bg-white';

  return (
    <Card
      className="min-w-[419px] min-h-[140px] bg-white flex flex-col justify-between h-full"
      color={CARD_COLOR.neutral}
      data-testid="price-card"
    >
      <div
        className={`flex gap-2 px-4 py-3 flex-1 items-start rounded-t-[8px] ${bgColor}`}
        data-testid="price-content"
      >
        <Checkbox
          className="pt-6 pl-5"
          onCheckedChange={onCheckBoxChange}
          checked={checked}
          disabled={disabled}
          data-testid="checkbox-price-card"
        >
          <CheckboxControl data-testid="checkbox-price-card-control" />
          <CheckboxLabel>
            <Text preset={TEXT_PRESET.heading4}>{title}</Text>
          </CheckboxLabel>
        </Checkbox>
      </div>
      <div
        className="bg-gray-100 px-4 py-6 rounded-b-[8px]"
        data-testid="price-footer"
      >
        {footer}
      </div>
    </Card>
  );
}
