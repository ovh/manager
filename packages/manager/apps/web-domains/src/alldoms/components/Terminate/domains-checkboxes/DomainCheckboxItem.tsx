import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsCheckbox, OdsIcon, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

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
      <div className="flex items-center gap-x-4">
        <OdsCheckbox
          name={serviceName}
          inputId={serviceName}
          isChecked={domainsChecked.includes(serviceName)}
          onOdsChange={(e) => {
            const updatedCheckedDomains = e.detail.checked
              ? [...domainsChecked, serviceName]
              : domainsChecked.filter((domainChecked) => domainChecked !== serviceName);
            handleDomainAttached(updatedCheckedDomains);
          }}
          data-testid={`checkbox-${serviceName}`}
          isDisabled={isDisabled}
        />
        <label
          htmlFor={serviceName}
          className={
            isDisabled
              ? 'text-[var(--ods-color-text-disabled-default)]'
              : 'text-[var(--ods-color-text)]'
          }
        >
          {serviceName}
        </label>
      </div>
      {isDisabled && (
        <div>
          <OdsIcon
            id={serviceName}
            className="custom-tooltip"
            name={ODS_ICON_NAME.circleQuestion}
          />
          <OdsTooltip role="tooltip" strategy="fixed" triggerId={serviceName}>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('allDom_modal_domain_already_in_terminate')}
            </OdsText>
          </OdsTooltip>
        </div>
      )}
    </div>
  );
}
