import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ModalStepsProps } from '@/alldoms/types';
import {
  ServiceInfoUpdateEnum,
} from '@/alldoms/enum/service.enum';
import {
  useUpdateAllDomService,
  useUpdateDomainServiceInfo,
} from '@/alldoms/hooks/data/mutation/mutation';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';

export default function TerminateModalStepTwo({
  domainTerminateList,
  serviceName,
  changeStep,
}: Readonly<ModalStepsProps>) {
  const { t } = useTranslation(['allDom', NAMESPACES.ACTIONS]);
  const { addError, addSuccess } = useNotifications();
  const updateAllDomServiceMutation = useUpdateAllDomService();
  const updateDomainServiceInfoMutation = useUpdateDomainServiceInfo();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleTerminate = async () => {
    try {
      await updateAllDomServiceMutation.mutateAsync({
        serviceName,
        displayName: serviceName,
        renew: {
          mode: ServiceInfoRenewModeEnum.Manual,
        },
        terminationPolicy: ServiceInfoUpdateEnum.TerminateAtExpirationDate,
      });

      await Promise.all(
        domainTerminateList.map((domainName) =>
          updateDomainServiceInfoMutation.mutateAsync(domainName),
        ),
      );

      addSuccess(
        <OdsText>
          {t('allDom_modal_success_message', {
            t0: serviceName,
            t1: domainTerminateList.join(', '),
          })}
        </OdsText>,
      );
      await queryClient.invalidateQueries({
        queryKey: ['serviceInfo'],
      });
    } catch (error) {
      addError(
        <OdsText>
          {t('allDom_modal_error_message', {
            t0: error.message,
          })}
        </OdsText>,
      );
    } finally {
      navigate(-1);
    }
  };

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
          onClick={async () => {
            handleTerminate();
          }}
        />
      </div>
    </div>
  );
}
