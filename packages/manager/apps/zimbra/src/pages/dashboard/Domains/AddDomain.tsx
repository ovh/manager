import React, { useState } from 'react';
import { LinkType, Links, Subtitle } from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OsdsFormField,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
  OsdsButton,
  OsdsInput,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_INPUT_TYPE,
  ODS_RADIO_BUTTON_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsInputValueChangeEvent,
  OdsSelectValueChangeEvent,
  OsdsRadioGroupCustomEvent,
} from '@ovhcloud/ods-components';
import { useQuery } from '@tanstack/react-query';

import { useOrganization, useOrganizationList, usePlatform } from '@/hooks';
import {
  getDomainsZoneList,
  getDomainsZoneListQueryKey,
  postZimbraDomain,
} from '@/api';

export default function AddDomain() {
  const { t } = useTranslation('domains/addDomain');
  const { platformId } = usePlatform();

  const { data, isLoading } = useOrganizationList();
  const navigate = useNavigate();
  const { data: organization } = useOrganization();
  const [selectedOrganization, setSelectedOrganization] = useState(
    organization?.id || '',
  );

  const { data: domains } = useQuery({
    queryKey: getDomainsZoneListQueryKey,
    queryFn: () => getDomainsZoneList(),
  });

  const [selectedRadioDomain, setSelectedRadioDomain] = useState('');
  const [selectedDomainName, setSelectedDomainName] = useState('');
  const handleRadioDomainChange = (
    event: OsdsRadioGroupCustomEvent<{
      newValue?: string;
      previousValue?: string;
    }>,
  ) => {
    setSelectedRadioDomain(event.detail.newValue);
  };

  const handleInputChange = (event: OdsInputValueChangeEvent) => {
    setSelectedDomainName(event.detail.value);
  };

  const handleSubmit = () => {
    const formData = {
      organizationId: selectedOrganization,
      name: selectedDomainName,
    };
    postZimbraDomain(platformId, formData);
  };

  console.log(selectedDomainName);
  return (
    <div className="flex flex-col items-start w-full md:w-3/4 space-y-4">
      <Links
        type={LinkType.back}
        onClickReturn={() => navigate('..')}
        label={t('zimbra_domains_add_domain_cta_back')}
      />

      <Subtitle>{t('zimbra_domains_add_domain_title')}</Subtitle>

      {data?.length > 0 && (
        <>
          <OsdsFormField className="w-full">
            <div slot="label">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._100}
                level={ODS_TEXT_LEVEL.heading}
              >
                {t('zimbra_domains_add_domain_organization')}
              </OsdsText>
            </div>
            <OsdsSelect
              disabled={isLoading || organization?.id}
              value={selectedOrganization}
              onOdsValueChange={(e: OdsSelectValueChangeEvent) =>
                setSelectedOrganization(e?.detail.value as string)
              }
              className="mt-2 w-1/2"
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

          <OsdsFormField className="w-1/2">
            <OsdsRadioGroup
              value={selectedRadioDomain}
              onOdsValueChange={(event) => handleRadioDomainChange(event)}
            >
              <OsdsRadio value="ovhDomain">
                <OsdsRadioButton size={ODS_RADIO_BUTTON_SIZE.sm}>
                  <span slot="end">
                    <OsdsText
                      color={ODS_THEME_COLOR_INTENT.text}
                      size={ODS_TEXT_SIZE._100}
                      level={ODS_TEXT_LEVEL.body}
                    >
                      {t('zimbra_domains_add_domain_select_title')}
                    </OsdsText>
                  </span>
                </OsdsRadioButton>
              </OsdsRadio>
              <OsdsRadio value="externalDomain">
                <OsdsRadioButton size={ODS_RADIO_BUTTON_SIZE.sm}>
                  <span slot="end">
                    <OsdsText
                      color={ODS_THEME_COLOR_INTENT.text}
                      size={ODS_TEXT_SIZE._100}
                      level={ODS_TEXT_LEVEL.body}
                    >
                      {t('zimbra_domains_add_domain_input_title')}
                    </OsdsText>
                  </span>
                </OsdsRadioButton>
              </OsdsRadio>
            </OsdsRadioGroup>
          </OsdsFormField>

          {selectedRadioDomain === 'ovhDomain' && (
            <OsdsFormField className="w-full">
              <OsdsSelect
                className="w-1/2"
                value={selectedDomainName}
                onOdsValueChange={(e: OdsSelectValueChangeEvent) =>
                  setSelectedDomainName(e?.detail.value as string)
                }
              >
                <span slot="placeholder">
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_TEXT_SIZE._100}
                    level={ODS_TEXT_LEVEL.body}
                  >
                    {t('zimbra_domains_add_domain_select')}
                  </OsdsText>
                </span>
                {domains.map((domain: string) => (
                  <OsdsSelectOption key={domain} value={domain}>
                    {domain}
                  </OsdsSelectOption>
                ))}
              </OsdsSelect>
            </OsdsFormField>
          )}

          {selectedRadioDomain === 'externalDomain' && (
            <OsdsFormField className="w-full">
              <OsdsInput
                type={ODS_INPUT_TYPE.text}
                onOdsValueChange={handleInputChange}
                placeholder={t('zimbra_domains_add_domain_input')}
                className="w-1/2"
              />
            </OsdsFormField>
          )}

          <OsdsFormField className="w-full">
            <OsdsButton
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={handleSubmit}
              className="mt-8 w-1/2"
              {...(!selectedOrganization || !selectedDomainName
                ? { disabled: true }
                : {})}
            >
              {t('zimbra_domains_add_domain_cta_confirm')}
            </OsdsButton>
          </OsdsFormField>
        </>
      )}
    </div>
  );
}
