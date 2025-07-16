import React from 'react';
import {
  OdsCheckbox,
  OdsIcon,
  OdsSpinner,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useGetDomainBillingInformation } from '@/alldoms/hooks/data/query';

interface DomainsCheckboxItemProps {
  readonly domainName: string;
  readonly domainAttachedChecked: string[];
  readonly handleDomainAttached: (domainSelected: string[]) => void;
}

export default function DomainsCheckboxItem({
  domainName,
  domainAttachedChecked,
  handleDomainAttached,
}: DomainsCheckboxItemProps) {
  const { t } = useTranslation('allDom');
  const { data, isLoading } = useGetDomainBillingInformation(domainName);

  if (isLoading) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.xs} />;
  }

  const { deleteAtExpiration, forced } = data.list.results[0].renew;
  const isDisabled = deleteAtExpiration && forced;

  return (
    <div className="flex items-center gap-x-4">
      <div className="flex items-center gap-x-4">
        <OdsCheckbox
          name={domainName}
          inputId={domainName}
          isChecked={domainAttachedChecked.includes(domainName)}
          onOdsChange={(e) => {
            const updatedCheckedDomains = e.detail.checked
              ? [...domainAttachedChecked, domainName]
              : domainAttachedChecked.filter(
                  (domainChecked) => domainChecked !== domainName,
                );
            handleDomainAttached(updatedCheckedDomains);
          }}
          data-testid={`checkbox-${domainName}`}
          isDisabled={isDisabled}
        />
        <label
          htmlFor={domainName}
          className={
            isDisabled
              ? 'text-[var(--ods-color-text-disabled-default)]'
              : 'text-[var(--ods-color-text)]'
          }
        >
          {domainName}
        </label>
      </div>
      {isDisabled && (
        <div>
          <OdsIcon
            id={`${domainName}`}
            className="custom-tooltip"
            name={ODS_ICON_NAME.circleQuestion}
          />
          <OdsTooltip
            role="tooltip"
            strategy="fixed"
            triggerId={`${domainName}`}
          >
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('allDom_modal_domain_already_in_terminate')}
            </OdsText>
          </OdsTooltip>
        </div>
      )}
    </div>
  );
}
