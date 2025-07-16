import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@ovh-ux/manager-react-components';
import { useParams } from 'react-router-dom';
import ModalStepOne from '@/alldoms/components/terminate/steps/Terminate.stepOne';
import ModalStepTwo from '@/alldoms/components/terminate/steps/Terminate.stepTwo';
import { useGetAllDomResource } from '@/alldoms/hooks/data/query';
import Loading from '@/alldoms/components/loading/Loading';

export default function ServiceTerminate() {
  const { t } = useTranslation(['allDom']);
  const { serviceName } = useParams<{ serviceName: string }>();
  const [domainAttachedChecked, setDomainAttachedChecked] = useState<string[]>(
    [],
  );
  const [isAllDomainChecked, setIsAllDomainChecked] = useState<boolean>(false);
  const [isStepOne, setIsStepOne] = useState<boolean>(true);

  const { data: domains, isLoading } = useGetAllDomResource(serviceName);

  const changeStep = () => {
    setIsStepOne(!isStepOne);
  };

  const handleDomainAttached = (domainsChecked: string[]) => {
    setDomainAttachedChecked(domainsChecked);
  };

  const handleCheckAllDomain = (checked: boolean) => {
    setIsAllDomainChecked(checked);
  };

  useEffect(() => {
    if (!domainAttachedChecked.length) {
      setIsAllDomainChecked(false);
    }
  }, [domainAttachedChecked]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Modal
      isLoading={isLoading}
      type={ODS_MODAL_COLOR.critical}
      heading={t('allDom_modal_title', {
        serviceName,
      })}
    >
      <div>
        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mb-4">
          {t('allDom_modal_subtitle')}
        </OdsText>

        {isStepOne ? (
          <ModalStepOne
            domainsAttached={domains.currentState.domains}
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
            serviceName={serviceName}
          />
        )}
      </div>
    </Modal>
  );
}
