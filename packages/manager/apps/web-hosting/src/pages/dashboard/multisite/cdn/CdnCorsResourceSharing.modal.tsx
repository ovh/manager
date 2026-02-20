import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  Input,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/muk';

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
      onOpenChange={() => onClose()}
      open={true}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        onClick: () => {},
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: () => onClose(),
      }}
    >
      <div className="flex flex-col space-y-3">
        <Text>{t('cdn_shared_cors_description')}</Text>
        <Text preset={TEXT_PRESET.caption}>{t('cdn_shared_cors_add_domain')}</Text>
        <Input
          name="ruleName"
          type="text"
          value={addedDomain}
          onChange={(e) => setAddedDomain(e.target.value)}
        />
        <Button
          variant={BUTTON_VARIANT.default}
          color={BUTTON_COLOR.primary}
          disabled={!addedDomain}
          onClick={() => {
            setDomainLists([...domainLists, addedDomain]);
          }}
        >
          {t(`${NAMESPACES.ACTIONS}:add`)}
        </Button>
        <Text preset={TEXT_PRESET.caption}>{t('cdn_shared_cors_domain_list')}</Text>
        <Select
          name="domainList"
          data-testid="domainList"
          className="mt-3 w-full"
          items={domainLists?.map((item) => ({
            label: item,
            value: item,
          }))}
          onValueChange={(detail) => setSelectedDomain(detail.value[0])}
        >
          <SelectControl aria-label={t('cdn_shared_cors_domain_list')} />
          <SelectContent />
        </Select>
        <Button
          variant={BUTTON_VARIANT.default}
          color={BUTTON_COLOR.primary}
          disabled={!selectedDomain}
          onClick={() => {
            setDomainLists(domainLists?.filter((item) => item !== selectedDomain));
          }}
        >
          {t(`${NAMESPACES.ACTIONS}:remove`)}
        </Button>
      </div>
    </Modal>
  );
}
