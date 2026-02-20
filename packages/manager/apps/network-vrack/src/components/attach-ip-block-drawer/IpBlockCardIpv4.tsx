import {
  CARD_COLOR,
  Card,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  ICON_NAME,
  Icon,
  SPINNER_SIZE,
  Spinner,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { handleEnterAndEscapeKeyDown } from '@/utils/handleEnterAndEscapeKeyDown';

type IpBlockCardIpv4Props = {
  ip: string;
  description: string | undefined;
  isSelected: boolean;
  isDisabled: boolean;
  isPending: boolean;
  isError: boolean;
  onSelect: () => void;
};

export const IpBlockCardIpv4 = ({
  ip,
  description,
  isSelected,
  isDisabled,
  isPending,
  isError,
  onSelect,
}: IpBlockCardIpv4Props) => (
  <Card
    role="checkbox"
    aria-checked={isSelected}
    tabIndex={isDisabled ? -1 : 0}
    className={`mb-2 flex items-center px-5 py-4 ${
      isDisabled
        ? 'cursor-not-allowed bg-[var(--ods-theme-background-color-disabled)]'
        : 'cursor-pointer'
    } ${isSelected ? 'border-2' : 'border-1'}`}
    onKeyDown={handleEnterAndEscapeKeyDown({ onEnter: onSelect })}
    color={isSelected ? CARD_COLOR.primary : CARD_COLOR.neutral}
    onClick={onSelect}
  >
    <div>
      <Checkbox value={ip} tabIndex={-1} disabled={isDisabled} className="pointer-events-none">
        {isError ? (
          <Icon name={ICON_NAME.diamondExclamation} />
        ) : isPending ? (
          <Spinner size={SPINNER_SIZE.sm} />
        ) : (
          <CheckboxControl />
        )}
        <CheckboxLabel className="ml-4 flex flex-col">
          <Text preset={TEXT_PRESET.label}>{ip}</Text>
          <Text preset={TEXT_PRESET.small}>{description ?? ''}</Text>
        </CheckboxLabel>
      </Checkbox>
    </div>
  </Card>
);
