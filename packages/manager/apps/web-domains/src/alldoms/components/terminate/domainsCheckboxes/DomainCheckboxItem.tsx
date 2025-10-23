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
} from '@ovhcloud/ods-react';
import { OdsTooltip } from '@ovhcloud/ods-components/react';
import { toUnicode } from 'punycode';

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
          {toUnicode(serviceName)}
        </CheckboxLabel>
      </Checkbox>
      {isDisabled && (
        <div className="flex item-center">
          <Icon
            id={serviceName}
            className="text-[var(--ods-color-primary-500)]"
            name={ICON_NAME.circleQuestion}
          />
          {/* Using OdsTooling because ODS 19 Tooltip not working with MRC MODAL */}
          <OdsTooltip role="tooltip" strategy="fixed" triggerId={serviceName}>
            <Text preset={TEXT_PRESET.paragraph}>
              {t('allDom_modal_domain_already_in_terminate')}
            </Text>
          </OdsTooltip>
        </div>
      )}
    </div>
  );
}
