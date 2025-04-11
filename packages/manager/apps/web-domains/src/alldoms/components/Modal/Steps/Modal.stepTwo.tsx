import {
  ODS_BADGE_COLOR,
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModalStepsProps } from '@/alldoms/types';
import {
  useUpdateAllDomService,
  useUpdateDomainServiceInfo,
} from '@/alldoms/hooks/data/query';

export default function ModalStepTwo({
  domainTerminateList,
  serviceInfoDetail,
  changeStep,
  changeStatus,
  closeModal,
}: Readonly<ModalStepsProps>) {
  const { t } = useTranslation('allDom');
  const { renew, domain: serviceName } = serviceInfoDetail.serviceInfo;
  const updateAllDomServiceMutation = useUpdateAllDomService(renew);
  const updateDomainServiceInfoMutation = useUpdateDomainServiceInfo();

  const handleTerminate = async () => {
    try {
      await updateAllDomServiceMutation.mutateAsync(serviceName);

      await Promise.all(
        domainTerminateList.map((domainName) =>
          updateDomainServiceInfoMutation.mutateAsync(domainName),
        ),
      );

      changeStatus(
        ODS_BADGE_COLOR.success,
        t('alldom_modal_success_message', {
          t0: serviceName,
          t1: domainTerminateList.join(', '),
        }),
      );
    } catch (error) {
      changeStatus(ODS_BADGE_COLOR.warning, error.message);
    } finally {
      closeModal();
    }
  };

  return (
    <div>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('alldom_modal_step_two_warning')}
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
          label={t('alldom_modal_step_previous')}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={() => changeStep()}
        />
        <OdsButton
          label={t('alldom_modal_step_terminate')}
          variant={ODS_BUTTON_VARIANT.default}
          color={ODS_BUTTON_COLOR.critical}
          isDisabled={!domainTerminateList}
          onClick={handleTerminate}
        />
      </div>
    </div>
  );
}
