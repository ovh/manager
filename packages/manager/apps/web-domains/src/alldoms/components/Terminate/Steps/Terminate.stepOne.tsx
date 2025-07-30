import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT, ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import DomainsCheckboxList from '@/alldoms/components/terminate/domains-checkboxes/DomainsCheckboxList';
import { LifecycleCapacitiesEnum } from '@/alldoms/enum/service.enum';
import { ModalStepsProps } from '@/alldoms/types';

export default function TerminateModalStepOne({
  services,
  domainsChecked,
  checkAllDomains,
  setIsStepOne,
  setDomainsChecked,
  setCheckAllDomains,
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
            checked={checkAllDomains}
            onChange={(e) => {
              setCheckAllDomains(e.target.checked);
              setDomainsChecked(
                e.target.checked
                  ? services
                      .filter(
                        (domain) =>
                          !domain.billing.lifecycle.capacities.actions.includes(
                            LifecycleCapacitiesEnum.TerminateAtExpirationDate,
                          ),
                      )
                      .map((domain) => domain.resource.name)
                  : [],
              );
            }}
          />
          <label htmlFor="alldomains" className="text-[var(--ods-color-text)]">
            {t('allDom_modal_all_my_domains')}
          </label>
        </div>
        <DomainsCheckboxList
          services={services}
          domainsChecked={domainsChecked}
          handleDomainAttached={setDomainsChecked}
        />
      </div>

      <OdsMessage className="mb-6" color={ODS_MESSAGE_COLOR.information} isDismissible={false}>
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
          onClick={() => setIsStepOne(false)}
        />
      </div>
    </div>
  );
}
