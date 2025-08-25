import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  BUTTON_VARIANT,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { ModalStepsProps } from '@/alldoms/types';
import DomainsCheckboxList from '@/alldoms/components/terminate/DomainsCheckboxes/DomainsCheckboxList';
import { hasTerminateAtExpirationDateAction } from '@/alldoms/utils/utils';

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
        <Text preset={TEXT_PRESET.heading6} className="mb-4">
          {t('allDom_modal_choice')}
        </Text>
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
                          !hasTerminateAtExpirationDateAction(
                            domain.billing.lifecycle.current.pendingActions ??
                              [],
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

      <Message
        className="mb-6"
        color={MESSAGE_COLOR.information}
        dismissible={false}
      >
        <MessageIcon name={ICON_NAME.circleInfo} />
        {t('allDom_modal_step_one_message')}
      </Message>

      <div className="flex justify-end gap-x-6">
        <Button variant={BUTTON_VARIANT.ghost} onClick={() => navigate(-1)}>
          {t(`${NAMESPACES.ACTIONS}:close`)}
        </Button>
        <Button
          variant={BUTTON_VARIANT.default}
          onClick={() => setIsStepOne(false)}
        >
          {t(`${NAMESPACES.ACTIONS}:next`)}
        </Button>
      </div>
    </div>
  );
}
