import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ModalStepsProps } from '@/alldoms/types';
import {
  useUpdateAllDomService,
  useUpdateDomainServiceInfo,
} from '@/alldoms/hooks/data/query';
import { ServiceInfoRenewMode } from '@/alldoms/enum/service.enum';

export default function ModalStepTwo({
  domainTerminateList,
  serviceInfoDetail,
  changeStep,
  closeModal,
}: Readonly<ModalStepsProps>) {
  const { t } = useTranslation('allDom');
  const { name: serviceName } = serviceInfoDetail.allDomProperty;
  const { addError, addSuccess } = useNotifications();
  const updateAllDomServiceMutation = useUpdateAllDomService();
  const updateDomainServiceInfoMutation = useUpdateDomainServiceInfo();

  const handleTerminate = async () => {
    try {
      await updateAllDomServiceMutation.mutateAsync({
        serviceName: serviceInfoDetail.allDomProperty.name,
        renew: {
          mode: ServiceInfoRenewMode.Manual,
        },
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
    } catch (error) {
      addError(
        <OdsText>
          {t('allDom_modal_error_message', {
            t0: error.message,
          })}
        </OdsText>,
      );
    } finally {
      closeModal();
    }
  };

  return (
    <div>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('allDom_modal_step_two_warning')}
      </OdsText>
      <ul className="flex flex-col gap-y-2 ml-2 pl-8">
        {domainTerminateList.map((element) => (
          <li className="text-[#4D5592]" key={element}>
            {element}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-x-6 justify-end">
        <OdsButton
          label={t('allDom_modal_step_previous')}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={() => changeStep()}
        />
        <OdsButton
          label={t('allDom_modal_step_terminate')}
          variant={ODS_BUTTON_VARIANT.default}
          color={ODS_BUTTON_COLOR.critical}
          isDisabled={!domainTerminateList}
          onClick={handleTerminate}
        />
      </div>
    </div>
  );
}
