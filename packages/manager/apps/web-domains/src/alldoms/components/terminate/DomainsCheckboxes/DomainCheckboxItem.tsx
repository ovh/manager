import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Checkbox,
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
        name={serviceName}
        onChange={(e) => {
          const updatedCheckedDomains = e
            ? [...domainsChecked, serviceName]
            : domainsChecked.filter(
                (domainChecked) => domainChecked !== serviceName,
              );
          handleDomainAttached(updatedCheckedDomains);
        }}
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
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon name={ICON_NAME.circleQuestion} />
            </TooltipTrigger>
            <TooltipContent>
              <Text preset={TEXT_PRESET.paragraph}>
                {t('allDom_modal_domain_already_in_terminate')}
              </Text>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
