import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalStepOne from '@/alldoms/components/Modal/Steps/Modal.stepOne';
import ModalStepTwo from '@/alldoms/components/Modal/Steps/Modal.stepTwo';
import { TServiceDetail } from '@/alldoms/types';

interface ModalProps {
  modalOpen: boolean;
  closeModal: () => void;
  serviceDetail: TServiceDetail;
}

export default function Modal({
  serviceDetail,
  modalOpen,
  closeModal,
}: Readonly<ModalProps>) {
  const { t } = useTranslation('allDom');
  const [domainAttachedChecked, setDomainAttachedChecked] = useState<string[]>(
    [],
  );
  const [isAllDomainChecked, setIsAllDomainChecked] = useState<boolean>(false);
  const [isStepOne, setIsStepOne] = useState<boolean>(true);

  const changeStep = () => {
    setIsStepOne(!isStepOne);
  };

  const handleDomainAttached = (domainsChecked: string[]) => {
    setDomainAttachedChecked(domainsChecked);
  };

  const handleCheckAllDomain = (checked: boolean) => {
    setIsAllDomainChecked(checked);
  };

  return (
    <OdsModal
      isOpen={modalOpen}
      onOdsClose={() => {
        setDomainAttachedChecked([]);
        closeModal();
        setIsStepOne(true);
      }}
      color={ODS_MODAL_COLOR.warning}
      data-testid="modal"
    >
      <hgroup className="mb-4">
        <OdsText preset={ODS_TEXT_PRESET.heading3} class="mb-8">
          {t('allDom_modal_title', {
            t0: serviceDetail.serviceInfo.domain,
          })}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('allDom_modal_subtitle')}
        </OdsText>
      </hgroup>

      {isStepOne ? (
        <ModalStepOne
          domainAttached={serviceDetail.domainAttached}
          checkAllDomain={isAllDomainChecked}
          changeStep={changeStep}
          domainAttachedChecked={domainAttachedChecked}
          handleDomainAttached={handleDomainAttached}
          handleCheckAllDomain={handleCheckAllDomain}
        />
      ) : (
        <ModalStepTwo
          domainTerminateList={domainAttachedChecked}
          changeStep={changeStep}
          serviceInfoDetail={serviceDetail}
          closeModal={closeModal}
        />
      )}
    </OdsModal>
  );
}
