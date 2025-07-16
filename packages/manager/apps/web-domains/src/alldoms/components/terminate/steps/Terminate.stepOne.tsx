import {
  ODS_TEXT_PRESET,
  ODS_MESSAGE_COLOR,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigate } from 'react-router-dom';
import { ModalStepsProps, TDomainsInfo } from '@/alldoms/types';
import DomainsCheckboxList from '@/alldoms/components/Terminate/DomainsCheckboxes/DomainsCheckboxList';

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
                  ? domainsAttached.map((domain: TDomainsInfo) => domain.name)
                  : [],
              );
            }}
          />
          <label htmlFor="alldomains" className="text-[var(--ods-color-text)]">
            {t('allDom_modal_all_my_domains')}
          </label>
        </div>
        <DomainsCheckboxList
          domainsAttached={domainsAttached}
          domainAttachedChecked={domainAttachedChecked}
          handleDomainAttached={handleDomainAttached}
        />
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
