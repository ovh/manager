import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Checkbox,
  CheckboxCheckedChangeDetail,
  CheckboxControl,
  CheckboxLabel,
  Icon,
  ICON_NAME,
  Text,
  TEXT_PRESET,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

interface DomainsCheckboxItemProps {
  readonly serviceName: string;
  readonly isDisabled: boolean;
  readonly domainsChecked: string[];
  readonly handleDomainAttached: (domainSelected: string[]) => void;
}

export default function DomainsCheckboxItem({
  serviceName,
  isDisabled,
  domainsChecked,
  handleDomainAttached,
}: DomainsCheckboxItemProps) {
  const { t } = useTranslation('allDom');

  return (
    <div className="flex items-center gap-x-4">
      <Checkbox
        onCheckedChange={(detail: CheckboxCheckedChangeDetail) => {
          const updatedCheckedDomains = detail.checked
            ? [...domainsChecked, serviceName]
            : domainsChecked.filter(
                (domainChecked) => domainChecked !== serviceName,
              );
          handleDomainAttached(updatedCheckedDomains);
        }}
        checked={domainsChecked.includes(serviceName)}
        data-testid={`checkbox-${serviceName}`}
        disabled={isDisabled}
      >
        <CheckboxControl />
        <CheckboxLabel
          className={
            isDisabled
              ? 'text-[var(--ods-color-text-disabled-default)]'
              : 'text-[var(--ods-color-text)]'
          }
        >
          {serviceName}
        </CheckboxLabel>
      </Checkbox>
      {isDisabled && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Icon
              name={ICON_NAME.circleQuestion}
              className="text-[var(--ods-color-primary-500)] w-6"
            />
          </TooltipTrigger>
          <TooltipContent className="relative z-[9999]">
            <Text preset={TEXT_PRESET.paragraph}>
              {t('allDom_modal_domain_already_in_terminate')}
            </Text>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
