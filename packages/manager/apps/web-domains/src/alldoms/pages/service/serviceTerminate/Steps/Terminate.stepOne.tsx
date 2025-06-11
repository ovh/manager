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
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigate } from 'react-router-dom';
import { ModalStepsProps } from '@/alldoms/types';

export default function TerminateModalStepOne({
  domainsAttached,
  domainAttachedChecked,
  checkAllDomain,
  changeStep,
  handleDomainAttached,
  handleCheckAllDomain,
}: Readonly<ModalStepsProps>) {
  const { t } = useTranslation(['allDom', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

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
              handleDomainAttached(
                e.target.checked
                  ? domainsAttached.map((domain) => domain.name)
                  : [],
              );
            }}
          />
          <label htmlFor="alldomains">{t('allDom_modal_all_my_domains')}</label>
        </div>
        <div className="flex flex-col gap-y-2 pl-9">
          {domainsAttached.map((domain) => (
            <div key={domain.name} className="flex items-center gap-x-4">
              <OdsCheckbox
                name={domain.name}
                inputId={domain.name}
                isChecked={domainAttachedChecked.includes(domain.name)}
                onOdsChange={(e) => {
                  const updatedCheckedDomains = e.detail.checked
                    ? [...domainAttachedChecked, domain.name]
                    : domainAttachedChecked.filter(
                        (domainChecked) => domainChecked !== domain.name,
                      );
                  handleDomainAttached(updatedCheckedDomains);
                }}
                data-testid={`checkbox-${domain.name}`}
              />
              <label htmlFor={domain.name}>{domain.name}</label>
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

      <div className="flex justify-end gap-x-6">
        <OdsButton
          label={t(`${NAMESPACES.ACTIONS}:close`)}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={() => navigate(-1)}
        />
        <OdsButton
          label={t(`${NAMESPACES.ACTIONS}:next`)}
          variant={ODS_BUTTON_VARIANT.default}
          onClick={() => changeStep()}
          isDisabled={!domainAttachedChecked.length}
        />
      </div>
    </div>
  );
}
