import {
  ODS_TEXT_PRESET,
  ODS_MESSAGE_COLOR,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCheckbox,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModalStepsProps } from '@/alldoms/types';

export default function ModalStepOne({
  domainAttached,
  domainAttachedChecked,
  checkAllDomain,
  changeStep,
  handleDomainAttached,
  handleCheckAllDomain,
}: Readonly<ModalStepsProps>) {
  const { t } = useTranslation('allDom');

  return (
    <div>
      <div className="mb-6">
        <OdsText preset={ODS_TEXT_PRESET.heading6} className="mb-4">
          {t('allDom_modal_choice')}
        </OdsText>
        <div className="domain-all">
          <input
            type="checkbox"
            name="alldomains"
            id="alldomains"
            data-testid="checkbox-alldomains"
            checked={checkAllDomain}
            onChange={(e) => {
              handleCheckAllDomain(e.target.checked);
              handleDomainAttached(e.target.checked ? [...domainAttached] : []);
            }}
          />
          <label htmlFor="alldomains">{t('allDom_modal_all_my_domains')}</label>
        </div>
        <div className="flex flex-col gap-y-2 pl-9">
          {domainAttached.map((domain) => (
            <div key={domain} className="flex items-center gap-x-4">
              <OdsCheckbox
                name={domain}
                inputId={domain}
                isChecked={domainAttachedChecked.includes(domain)}
                onOdsChange={(e) => {
                  const updatedCheckedDomains = e.detail.checked
                    ? [...domainAttachedChecked, domain]
                    : domainAttachedChecked.filter(
                        (domainChecked) => domainChecked !== domain,
                      );
                  handleDomainAttached(updatedCheckedDomains);
                }}
                data-testid={`checkbox-${domain}`}
              />
              <label htmlFor={domain}>{domain}</label>
            </div>
          ))}
        </div>
      </div>

      <OdsMessage
        className="mb-6"
        color={ODS_MESSAGE_COLOR.information}
        isDismissible={false}
      >
        {t('allDom_modal_step_one_message')}
      </OdsMessage>

      <div className="flex justify-end">
        <OdsButton
          label={t('allDom_modal_next_step')}
          variant={ODS_BUTTON_VARIANT.default}
          onClick={() => changeStep()}
          isDisabled={!domainAttachedChecked.length}
        />
      </div>
    </div>
  );
}
