import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ModalStepsProps } from '@/alldoms/types';
import { updateService } from '@/alldoms/data/api/web-domains';
import {
  ServiceInfoUpdateEnum,
  ServiceRoutes,
} from '@/alldoms/enum/service.enum';

export default function TerminateModalStepTwo({
  domainTerminateList,
  serviceName,
  changeStep,
}: Readonly<ModalStepsProps>) {
  const { t } = useTranslation(['allDom', NAMESPACES.ACTIONS]);
  const { addError, addSuccess } = useNotifications();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const useTerminateService = useMutation({
    mutationFn: async () => {
      await updateService(
        serviceName,
        ServiceInfoUpdateEnum.TerminateAtExpirationDate,
        ServiceRoutes.AllDom,
      );
      await Promise.all(
        domainTerminateList.map((domain) =>
          updateService(
            domain,
            ServiceInfoUpdateEnum.TerminateAtExpirationDate,
            ServiceRoutes.Domain,
          ),
        ),
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDom'] });
      addSuccess(t('allDom_modal_success_message'));
    },
    onError: (error) => {
      addError(
        t('allDom_modal_error_message', {
          t0: error.message,
        }),
      );
    },
    onSettled: () => {
      navigate(-1);
    },
  });

  return (
    <div>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('allDom_modal_step_two_warning')}
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
          onClick={() => changeStep()}
        />
        <OdsButton
          label={t('allDom_modal_step_terminate')}
          variant={ODS_BUTTON_VARIANT.default}
          color={ODS_BUTTON_COLOR.critical}
          isDisabled={!domainTerminateList}
          onClick={() => useTerminateService.mutate()}
        />
      </div>
    </div>
  );
}
