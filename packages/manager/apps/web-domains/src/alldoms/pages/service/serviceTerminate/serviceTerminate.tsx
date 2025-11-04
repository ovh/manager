import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@ovh-ux/manager-react-components';
import { useParams } from 'react-router-dom';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { toUnicode } from 'punycode';
import { ODS_MODAL_COLOR as MODAL_COLOR } from '@ovhcloud/ods-components';
import { useGetAllDomResource } from '@/alldoms/hooks/data/query';
import { useGetServices } from '@/alldoms/hooks/data/useGetServices';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';
import TerminateModalStepOne from '@/alldoms/components/terminate/steps/Terminate.stepOne';
import TerminateModalStepTwo from '@/alldoms/components/terminate/steps/Terminate.stepTwo';

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
      type={MODAL_COLOR.critical}
      heading={t('allDom_modal_title', {
        serviceName: toUnicode(serviceName),
      })}
    >
      <div>
        <Text preset={TEXT_PRESET.paragraph} className="mb-4">
          {t('allDom_modal_subtitle')}
        </Text>

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
