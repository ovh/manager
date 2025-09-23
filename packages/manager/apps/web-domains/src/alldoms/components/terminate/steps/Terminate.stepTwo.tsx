import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  BUTTON_VARIANT,
  BUTTON_COLOR,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { toUnicode } from 'punycode';
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
      <Text preset={TEXT_PRESET.paragraph}>
        {domainTerminateList.length === 0
          ? t('allDom_modal_step_two_no_domain_checked', {
              serviceName: toUnicode(serviceName),
            })
          : t('allDom_modal_step_two_warning')}
      </Text>
      <ul className="flex flex-col gap-y-2 ml-2 pl-8">
        {domainTerminateList.map((element) => (
          <li className="text-[var(--ods-color-text)]" key={element}>
            {toUnicode(element)}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-x-6 justify-end">
        <Button
          variant={BUTTON_VARIANT.ghost}
          onClick={() => setIsStepOne(true)}
        >
          {t(`${NAMESPACES.ACTIONS}:previous`)}
        </Button>
        <Button
          variant={BUTTON_VARIANT.default}
          color={BUTTON_COLOR.critical}
          disabled={!domainTerminateList}
          onClick={() => terminateService.mutate()}
        >
          {t('allDom_modal_step_terminate')}
        </Button>
      </div>
    </div>
  );
}
