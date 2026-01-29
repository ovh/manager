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

import { MAX_URL_ENTRIES } from '@/constants';
import { useGetCdnOption } from '@/data/hooks/cdn/useCdn';
import { CdnOptionType } from '@/data/types/product/cdn';
import { findOption } from '@/utils/cdn';

export default function CdnEditUrlsModal() {
  const { serviceName, domain } = useParams();
  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS]);
  const { data } = useGetCdnOption(serviceName, domain);
  const prewarmData = findOption(data, CdnOptionType.PREWARM);
  const [urlLists, setUrlLists] = useState(prewarmData?.config?.resources);

  const [selectedUrl, setSelectedUrl] = useState('');
  const [protocole] = useState(t('cdn_shared_change_edit_urls_modal_propdown_protocol_HTTP'));
  const [ressourcePath, setRessourcePath] = useState('');
  const newUrl = `${protocole.toLowerCase()}://${domain}/${ressourcePath}`;
  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };

  return (
    <Modal
      heading={t('cdn_shared_option_prewarm_title')}
      onOpenChange={onClose}
      open={true}
      primaryButton={{
        label: t('cdn_shared_option_cache_rule_table_items_option_set_rule'),
        onClick: () => {},
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: onClose,
      }}
    >
      <div className="flex flex-col space-y-3">
        <Text>{t('cdn_shared_change_edit_urls_modal_info')}</Text>
        <div>
          <Text preset={TEXT_PRESET.caption} className="w-3/12">
            {t('cdn_shared_change_edit_urls_modal_protocol_label')}
          </Text>
          <Text preset={TEXT_PRESET.caption} className="w-4/12">
            {t('cdn_shared_change_edit_urls_modal_domain_label')}
          </Text>
          <Text preset={TEXT_PRESET.caption} className="w-15/12">
            {t('cdn_shared_change_edit_urls_modal_resource_label')}
          </Text>
        </div>
        <div className="flex flex-row">
          <Select
            id="protocole"
            data-testid="protocole"
            className="w-3/12"
            name="protocole"
            value={protocole ? [protocole] : []}
            onValueChange={(detail) => detail.value}
            items={[
              {
                label: t('cdn_shared_change_edit_urls_modal_propdown_protocol_HTTP'),
                value: t('cdn_shared_change_edit_urls_modal_propdown_protocol_HTTP'),
              },
              {
                label: t('cdn_shared_change_edit_urls_modal_propdown_protocol_HTTPS'),
                value: t('cdn_shared_change_edit_urls_modal_propdown_protocol_HTTPS'),
              },
            ]}
          >
            <SelectControl aria-label={t('cdn_shared_change_edit_urls_modal_protocol_label')} />
            <SelectContent />
          </Select>
          <Input name="ruleName" type="text" className="w-4/12" disabled={true} value={domain} />
          <Input
            name="ruleName"
            type="text"
            className="w-5/12"
            value={ressourcePath}
            onChange={(e) => setRessourcePath(e.target.value)}
          />
        </div>
        <Text>{newUrl}</Text>
        <Button
          variant={BUTTON_VARIANT.default}
          color={BUTTON_COLOR.primary}
          disabled={!ressourcePath}
          onClick={() => {
            setUrlLists([...urlLists, newUrl]);
          }}
        >
          {t(`${NAMESPACES.ACTIONS}:add`)}
        </Button>
        <Text preset={TEXT_PRESET.caption}>
          {t('cdn_shared_change_edit_urls_modal_url_to_preload_label')}
        </Text>
        <Text preset={TEXT_PRESET.caption}>
          {t('cdn_shared_change_edit_urls_modal_url_to_preload_info', {
            numberOfUrls: urlLists?.length,
            maxUrls: MAX_URL_ENTRIES,
          })}
        </Text>
        <Select
          name="selectedUrl"
          id="selectedUrl"
          data-testid="selectedUrl"
          className="mt-3 w-full"
          value={selectedUrl ? [selectedUrl] : []}
          items={urlLists?.map((item) => ({
            label: item,
            value: item,
          }))}
          onValueChange={(detail: { value?: string[] }) =>
            setSelectedUrl(Array.isArray(detail.value) ? (detail.value[0] ?? '') : '')
          }
        >
          <SelectControl aria-label={t('cdn_shared_change_edit_urls_modal_url_to_preload_label')} />
          <SelectContent />
        </Select>
        <Button
          variant={BUTTON_VARIANT.default}
          color={BUTTON_COLOR.primary}
          disabled={urlLists?.length >= MAX_URL_ENTRIES}
          onClick={() => {
            setUrlLists(urlLists?.filter((item) => item !== selectedUrl));
          }}
        >
          {t(`${NAMESPACES.ACTIONS}:remove`)}
        </Button>
      </div>
    </Modal>
  );
}
