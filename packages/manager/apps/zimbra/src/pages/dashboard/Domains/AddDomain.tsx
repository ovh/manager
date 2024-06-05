import React, { useState } from 'react';
import { LinkType, Links, Subtitle } from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useOrganization, useOrganizationList } from '@/hooks';

export default function AddDomain() {
  const { t } = useTranslation('domains');
  const { data, isLoading } = useOrganizationList();
  const navigate = useNavigate();
  const { data: organization } = useOrganization();
  const [selectedOrganization, setSelectedOrganization] = useState(
    organization?.id || '',
  );

  const handleSelectChange = (event: any) => {
    setSelectedOrganization(event.detail.value);
  };
  return (
    <div className="flex flex-col items-start space-y-4">
      <Links
        type={LinkType.back}
        onClickReturn={() => navigate('..')}
        label={t('zimbra_domains_add_domain_cta_back')}
      />
      <Subtitle>{t('zimbra_domains_add_domain_title')}</Subtitle>

      {data?.length > 0 && (
        <OsdsFormField>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._200}
            level={ODS_TEXT_LEVEL.body}
          >
            {t('zimbra_domains_add_domain_organization')}
          </OsdsText>

          <OsdsSelect
            disabled={isLoading || organization?.id}
            value={selectedOrganization}
            onOdsValueChange={handleSelectChange}
          >
            <span slot="placeholder">
              {t('zimbra_domains_add_domain_organization_select')}
            </span>
            {data.map((item) => (
              <OsdsSelectOption key={item.id} value={item.id}>
                {item.targetSpec?.name}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
          {isLoading && (
            <div slot="helper">
              <OsdsSpinner
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_SPINNER_SIZE.sm}
                inline
              />
            </div>
          )}
        </OsdsFormField>
      )}
    </div>
  );
}
