import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { OdsButton, OdsSelect, OdsText } from '@ovhcloud/ods-components/react';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { AttachedDomain } from '@/types/ssl';
import { useCreateDomainCertificate } from '@/data/hooks/useSsl';
import SectigoModal from './modals/SectigoModal';
import ImportModal from './modals/ImportModal';

type TTopbap = {
  setMessage: ({ status, label }: { status: string; label: string }) => void;
};
export default function Topbar({ setMessage }: Readonly<TTopbap>) {
  const { serviceName } = useParams();
  const [hasSectigoModal, setHasSectigoModal] = useState<boolean>(false);
  const [hasImportModal, setHasImportModal] = useState<boolean>(false);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const { t } = useTranslation('ssl');
  const { flattenData } = useResourcesIcebergV2({
    route: `/webhosting/attachedDomain`,
    queryKey: [],
  });
  const { createDomainCertificate } = useCreateDomainCertificate(
    serviceName,
    () => {
      setMessage({
        status: 'success',
        label: t('hosting_dashboard_ssl_order_success'),
      });
    },
    () => {
      setMessage({
        status: 'error',
        label: t('hosting_dashboard_ssl_order_error'),
      });
    },
  );
  const handleSslEncrypt = () => {
    selectedDomains?.map((domain) => createDomainCertificate(domain));
  };

  return (
    <div className="flex flex-col space-y-10 mb-10">
      {hasSectigoModal && (
        <SectigoModal
          onClose={() => setHasSectigoModal(!hasSectigoModal)}
          domains={flattenData}
        />
      )}
      {hasImportModal && (
        <ImportModal
          onClose={() => setHasImportModal(!hasImportModal)}
          setMessage={setMessage}
        />
      )}
      <div className="flex space-x-4">
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => setHasSectigoModal(!hasSectigoModal)}
          label={t('order_ssl_certificate')}
        />
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => setHasImportModal(!hasImportModal)}
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('import_ssl_certificate')}
        />
      </div>
      <div className="bg-gray-200 p-10">
        <OdsText preset={ODS_TEXT_PRESET.heading4} className="mb-5">
          {t('enable_ssl_certificate')}
        </OdsText>
        <div className="flex space-x-4">
          <OdsSelect
            name="domainName"
            className="w-1/3"
            allowMultiple
            onOdsChange={(v) => {
              setSelectedDomains(v.detail.value?.toString()?.split(','));
            }}
          >
            {flattenData
              ?.filter(
                (data: AttachedDomain) =>
                  data?.currentState?.ssl?.status !== 'ACTIVE' &&
                  data?.currentState?.hosting?.serviceName === serviceName,
              )
              ?.map((item: AttachedDomain) => (
                <option
                  value={item?.currentState?.fqdn}
                  key={item?.currentState?.fqdn}
                >
                  {item?.currentState?.fqdn}
                </option>
              ))}
          </OdsSelect>
          <OdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.outline}
            onClick={handleSslEncrypt}
            label={t('enable_ssl_encrypt')}
          />
        </div>
      </div>
    </div>
  );
}
