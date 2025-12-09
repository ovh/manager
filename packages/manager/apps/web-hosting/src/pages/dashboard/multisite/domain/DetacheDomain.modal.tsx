import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Input,
  MESSAGE_COLOR,
  Message,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/muk';

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
  const canDetachDomainWithGit = domainData?.currentState?.git?.status === GitStatus?.CREATED;
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
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        onClick: onConfirm,
        disabled:
          !canDetachDomainWithGit ||
          (domainData?.currentState?.hosting?.offer as HostingdOffer) === HostingdOffer.STARTER_OVH,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: onClose,
      }}
      heading={t('detache_domain')}
      onOpenChange={onClose}
      open={true}
    >
      <div className="mb-10 mt-5 flex flex-col">
        <Text>{t('hosting_tab_DOMAINS_configuration_remove_title')}</Text>
        <Text preset={TEXT_PRESET.heading6} className="mt-6">
          {t('hosting_tab_DOMAINS_configuration_domain_name')}
        </Text>
        <Input type="text" name="domain" value={domain} disabled className="w-11/12" />
        <Text preset={TEXT_PRESET.heading6} className="mt-6">
          {t('hosting_tab_DOMAINS_configuration_home')}
        </Text>
        <div className="space-x-2">
          <Input type="text" name="domain" value="./" disabled className="w-1/12" />
          <Input
            type="text"
            name="domain"
            value={domainData?.currentState?.path || ''}
            disabled
            className="w-10/12"
          />
        </div>
        {wwwDomainExists && (
          <div className="mt-6 flex flex-row">
            <Checkbox
              checked={wwwRemoved}
              onCheckedChange={() => setWwwRemoved(!wwwRemoved)}
              name="wwwRemoved"
            >
              <CheckboxControl />
              <CheckboxLabel>
                <Text preset={TEXT_PRESET.heading6}>
                  {t('hosting_tab_DOMAINS_configuration_remove_step1_www', {
                    domain: `www.${domain}`,
                  })}
                </Text>
              </CheckboxLabel>
            </Checkbox>
          </div>
        )}
        <div className="my-6 flex flex-row">
          <Checkbox
            checked={isAutoconfigure}
            onCheckedChange={() => setIsAutoconfigure(!isAutoconfigure)}
            name="autoconfigure"
          >
            <CheckboxControl />
            <CheckboxLabel>
              <Text preset={TEXT_PRESET.heading6}>
                {t('hosting_tab_DOMAINS_configuration_autoconfigure')}
              </Text>
              <Text preset={TEXT_PRESET.caption}>
                {t('hosting_tab_DOMAINS_configuration_autoconfigure_remove_text')}
              </Text>
            </CheckboxLabel>
          </Checkbox>
        </div>
        {!canDetachDomainWithGit && (
          <Message color={MESSAGE_COLOR.warning} dismissible={false}>
            {t('hosting_tab_DOMAINS_configuration_remove_step1_git_warning')}
          </Message>
        )}
      </div>
    </Modal>
  );
}
