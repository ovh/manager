import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ModalStepsProps } from '@/alldoms/types';
import { useTerminateService } from '@/alldoms/hooks/useTerminateService/useTerminateService';

export default function TerminateModalStepTwo({
  domainTerminateList,
  serviceName,
  setIsStepOne,
}: Readonly<ModalStepsProps>) {
  const { t } = useTranslation(['allDom', NAMESPACES.ACTIONS]);

  const terminateService = useTerminateService(
    serviceName,
    domainTerminateList,
  );
  return (
    <div>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {domainTerminateList.length === 0
          ? t('allDom_modal_step_two_no_domain_checked', {
              serviceName,
            })
          : t('allDom_modal_step_two_warning')}
      </OdsText>
      <ul className="flex flex-col gap-y-2 ml-2 pl-8">
        {domainTerminateList.map((element) => (
          <li className="text-[var(--ods-color-text)]" key={element}>
            {element}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-x-6 justify-end">
        <OdsButton
          label={t(`${NAMESPACES.ACTIONS}:previous`)}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={() => setIsStepOne(true)}
        />
        <OdsButton
          label={t('allDom_modal_step_terminate')}
          variant={ODS_BUTTON_VARIANT.default}
          color={ODS_BUTTON_COLOR.critical}
          isDisabled={!domainTerminateList}
          onClick={() => terminateService.mutate()}
        />
      </div>
    </div>
  );
}
