import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsInput, OdsSelect, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';

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
  const [protocole, setProtocole] = useState(
    t('cdn_shared_change_edit_urls_modal_propdown_protocol_HTTP'),
  );
  const [ressourcePath, setRessourcePath] = useState('');
  const newUrl = `${protocole.toLowerCase()}://${domain}/${ressourcePath}`;
  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };

  return (
    <Modal
      heading={t('cdn_shared_option_prewarm_title')}
      onDismiss={onClose}
      isOpen
      primaryLabel={t('cdn_shared_option_cache_rule_table_items_option_set_rule')}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={onClose}
      onPrimaryButtonClick={() => {}}
    >
      <div className="flex flex-col space-y-3">
        <OdsText>{t('cdn_shared_change_edit_urls_modal_info')}</OdsText>
        <div>
          <OdsText preset={ODS_TEXT_PRESET.caption} className="w-3/12">
            {t('cdn_shared_change_edit_urls_modal_protocol_label')}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.caption} className="w-4/12">
            {t('cdn_shared_change_edit_urls_modal_domain_label')}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.caption} className="w-15/12">
            {t('cdn_shared_change_edit_urls_modal_resource_label')}
          </OdsText>
        </div>
        <div className="flex flex-row">
          <OdsSelect
            className="w-3/12"
            name="protocole"
            value={protocole}
            onOdsChange={(event) => setProtocole(event.detail.value)}
          >
            <option
              key="unit_minutes"
              value={t('cdn_shared_change_edit_urls_modal_propdown_protocol_HTTP')}
            >
              {t('cdn_shared_change_edit_urls_modal_propdown_protocol_HTTP')}
            </option>
            <option
              key="unit_hours"
              value={t('cdn_shared_change_edit_urls_modal_propdown_protocol_HTTPS')}
            >
              {t('cdn_shared_change_edit_urls_modal_propdown_protocol_HTTPS')}
            </option>
          </OdsSelect>
          <OdsInput
            name="ruleName"
            type="text"
            className="w-4/12"
            isDisabled={true}
            value={domain}
          />
          <OdsInput
            name="ruleName"
            type="text"
            className="w-5/12"
            value={ressourcePath}
            onOdsChange={(e) => setRessourcePath(e.target.value as string)}
          />
        </div>
        <OdsText>{newUrl}</OdsText>
        <OdsButton
          label={t(`${NAMESPACES.ACTIONS}:add`)}
          variant={ODS_BUTTON_VARIANT.default}
          color={ODS_BUTTON_COLOR.primary}
          isDisabled={!ressourcePath}
          onClick={() => {
            setUrlLists([...urlLists, newUrl]);
          }}
        />
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t('cdn_shared_change_edit_urls_modal_url_to_preload_label')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t('cdn_shared_change_edit_urls_modal_url_to_preload_info', {
            numberOfUrls: urlLists?.length,
            maxUrls: MAX_URL_ENTRIES,
          })}
        </OdsText>
        <select
          className="mt-3 w-full"
          value={selectedUrl}
          size={6}
          onChange={(event) => setSelectedUrl(event.target.value)}
        >
          {urlLists?.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <OdsButton
          label={t(`${NAMESPACES.ACTIONS}:remove`)}
          variant={ODS_BUTTON_VARIANT.default}
          color={ODS_BUTTON_COLOR.primary}
          isDisabled={urlLists?.length >= MAX_URL_ENTRIES}
          onClick={() => {
            setUrlLists(urlLists?.filter((item) => item !== selectedUrl));
          }}
        />
      </div>
    </Modal>
  );
}
