import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsInput, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';

import { useGetCdnOption } from '@/data/hooks/cdn/useCdn';
import { CdnOptionType } from '@/data/types/product/cdn';
import { findOption } from '@/utils/cdn';

export default function CdnCorsResourceSharingModal() {
  const { serviceName, domain } = useParams();
  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS]);
  const { data } = useGetCdnOption(serviceName, domain);
  const corsData = findOption(data, CdnOptionType.CORS);
  const [addedDomain, setAddedDomain] = useState('');
  const [domainLists, setDomainLists] = useState(corsData?.config?.resources);
  const [selectedDomain, setSelectedDomain] = useState('');
  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };

  return (
    <Modal
      heading={'Cross-Origin Resource Sharing'}
      onDismiss={onClose}
      isOpen
      primaryLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={onClose}
      onPrimaryButtonClick={() => {}}
    >
      <div className="flex flex-col space-y-3">
        <OdsText>{t('cdn_shared_cors_description')}</OdsText>
        <OdsText preset={ODS_TEXT_PRESET.caption}>{t('cdn_shared_cors_add_domain')}</OdsText>
        <OdsInput
          name="ruleName"
          type="text"
          value={addedDomain}
          onOdsChange={(e) => setAddedDomain(e.target.value as string)}
        />
        <OdsButton
          label={t(`${NAMESPACES.ACTIONS}:add`)}
          variant={ODS_BUTTON_VARIANT.default}
          color={ODS_BUTTON_COLOR.primary}
          isDisabled={!addedDomain}
          onClick={() => {
            setDomainLists([...domainLists, addedDomain]);
          }}
        />
        <OdsText preset={ODS_TEXT_PRESET.caption}>{t('cdn_shared_cors_domain_list')}</OdsText>
        <select
          className="mt-3 w-full"
          value={selectedDomain}
          size={6}
          onChange={(e) => setSelectedDomain(e.target.value)}
        >
          {domainLists?.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <OdsButton
          label={t(`${NAMESPACES.ACTIONS}:remove`)}
          variant={ODS_BUTTON_VARIANT.default}
          color={ODS_BUTTON_COLOR.primary}
          isDisabled={!selectedDomain}
          onClick={() => {
            setDomainLists(domainLists?.filter((item) => item !== selectedDomain));
          }}
        />
      </div>
    </Modal>
  );
}
