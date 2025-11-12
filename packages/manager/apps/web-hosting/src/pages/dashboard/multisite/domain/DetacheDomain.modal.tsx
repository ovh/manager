import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsCheckbox, OdsInput, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import {
  useDeleteAttachedDomains,
  useWebHostingAttachedDomain,
} from '@/data/hooks/webHosting/webHostingAttachedDomain/useWebHostingAttachedDomain';
import { useGetAddDomainExisting } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { HostingdOffer } from '@/data/types/product/webHosting';
import { GitStatus } from '@/data/types/status';

export default function DetacheDomainModal() {
  const navigate = useNavigate();
  const { domain, serviceName } = useParams();
  const { addSuccess, addWarning } = useNotifications();

  const [isAutoconfigure, setIsAutoconfigure] = useState<boolean>(true);
  const [wwwRemoved, setWwwRemoved] = useState<boolean>(false);
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS]);
  const { data } = useWebHostingAttachedDomain({ domain });
  const domainData = data?.find((d) => d?.currentState?.fqdn === domain);
  const canDetachDomainWithGit = domainData?.currentState?.git?.status === GitStatus?.DISABLED;
  const domainExisting = useGetAddDomainExisting(serviceName, false, Boolean(serviceName));
  const wwwDomainExists = domainExisting?.data?.existingDomains?.includes(`www.${domain}`);

  const onClose = () => {
    navigate(-1);
  };

  const { deleteAttachedDomains } = useDeleteAttachedDomains(
    serviceName,
    () => {
      addSuccess(t('hosting_tab_DOMAINS_configuration_remove_success'), true);
    },
    (error) => {
      addWarning(
        t('hosting_tab_DOMAINS_configuration_remove_failure', {
          error: error?.response?.data?.message,
        }),
        true,
      );
    },
  );

  const onConfirm = () => {
    const domains = [domain];
    if (wwwDomainExists && wwwRemoved) {
      domains.push(`www.${domain}`);
    }
    deleteAttachedDomains({
      domains,
      bypassDNSConfiguration: !isAutoconfigure,
    });
    onClose();
  };

  return (
    <Modal
      primaryLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      isPrimaryButtonDisabled={
        !canDetachDomainWithGit ||
        (domainData?.currentState?.hosting?.offer as HostingdOffer) === HostingdOffer.STARTER_OVH
      }
      heading={t('detache_domain')}
      onDismiss={onClose}
      onPrimaryButtonClick={onConfirm}
      onSecondaryButtonClick={onClose}
      isOpen
    >
      <div className="flex flex-col mb-10 mt-5">
        <OdsText>{t('hosting_tab_DOMAINS_configuration_remove_title')}</OdsText>
        <OdsText preset={ODS_TEXT_PRESET.heading6} className="mt-6">
          {t('hosting_tab_DOMAINS_configuration_domain_name')}
        </OdsText>
        <OdsInput type="text" name="domain" value={domain} isDisabled className="w-11/12" />
        <OdsText preset={ODS_TEXT_PRESET.heading6} className="mt-6">
          {t('hosting_tab_DOMAINS_configuration_home')}
        </OdsText>
        <div className="space-x-2">
          <OdsInput type="text" name="domain" value="./" isDisabled className="w-1/12" />
          <OdsInput
            type="text"
            name="domain"
            value={domainData?.currentState?.path || ''}
            isDisabled
            className="w-10/12"
          />
        </div>
        {wwwDomainExists && (
          <div className="flex flex-row mt-6">
            <OdsCheckbox
              isChecked={wwwRemoved}
              onOdsChange={() => setWwwRemoved(!wwwRemoved)}
              name="wwwRemoved"
            />
            <label className="ml-4 cursor-pointer">
              <OdsText preset={ODS_TEXT_PRESET.span}>
                {t('hosting_tab_DOMAINS_configuration_remove_step1_www', {
                  domain: `www.${domain}`,
                })}
              </OdsText>
            </label>
          </div>
        )}
        <div className="flex flex-row mt-6 mb-6">
          <OdsCheckbox
            isChecked={isAutoconfigure}
            onOdsChange={() => setIsAutoconfigure(!isAutoconfigure)}
            name="autoconfigure"
          />
          <label className="ml-4 cursor-pointer">
            <OdsText preset={ODS_TEXT_PRESET.heading6}>
              {t('hosting_tab_DOMAINS_configuration_autoconfigure')}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.caption}>
              {t('hosting_tab_DOMAINS_configuration_autoconfigure_remove_text')}
            </OdsText>
          </label>
        </div>
        {!canDetachDomainWithGit && (
          <OdsMessage color={ODS_MESSAGE_COLOR.warning} isDismissible={false}>
            {t('hosting_tab_DOMAINS_configuration_remove_step1_git_warning')}
          </OdsMessage>
        )}
      </div>
    </Modal>
  );
}
