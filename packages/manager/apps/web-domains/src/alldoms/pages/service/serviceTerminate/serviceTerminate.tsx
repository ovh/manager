import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@ovh-ux/manager-react-components';
import { useParams } from 'react-router-dom';
import { useGetAllDomResource } from '@/alldoms/hooks/data/query';
import { useGetServices } from '@/alldoms/hooks/data/useGetServices';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';
import TerminateModalStepOne from '@/alldoms/components/Terminate/Steps/Terminate.stepOne';
import TerminateModalStepTwo from '@/alldoms/components/Terminate/Steps/Terminate.stepTwo';

export default function ServiceTerminate() {
  const { t } = useTranslation(['allDom']);
  const { serviceName } = useParams<{ serviceName: string }>();
  const [domainsChecked, setDomainsChecked] = useState<string[]>([]);
  const [isStepOne, setIsStepOne] = useState<boolean>(true);
  const [isCheckedAllDomains, setIsCheckedAllDomains] = useState(false);

  const { data: domains, isLoading } = useGetAllDomResource(serviceName);

  const { data: serviceList, listLoading } = useGetServices({
    names: domains?.currentState?.domains?.map((domain) => domain.name),
    serviceRoute: ServiceRoutes.Domain,
  });

  useEffect(() => {
    if (domainsChecked.length === 0) {
      setIsCheckedAllDomains(false);
    }
  }, [domainsChecked]);

  return (
    <Modal
      isLoading={isLoading || listLoading}
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
          <TerminateModalStepOne
            services={serviceList}
            setIsStepOne={setIsStepOne}
            domainsChecked={domainsChecked}
            setDomainsChecked={setDomainsChecked}
            checkAllDomains={isCheckedAllDomains}
            setCheckAllDomains={setIsCheckedAllDomains}
          />
        ) : (
          <TerminateModalStepTwo
            domainTerminateList={domainsChecked}
            setIsStepOne={setIsStepOne}
            serviceName={serviceName}
          />
        )}
      </div>
    </Modal>
  );
}
