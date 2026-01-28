import { useContext } from 'react';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Badge,
  Icon,
  Link,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Text,
} from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { PciCard } from '@/components/pciCard/PciCard.component';
import { UPGRADE_POLICIES } from '@/constants';
import { cn } from '@/helpers';
import { DOCUMENTATION_LINK } from '@/pages/upgrade-policy/UpgradePolicy.constant';
import { UpdatePolicy } from '@/types';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { UpdatePolicyHelper } from './update-policy/UpdatePolicyHelper.component';

export const ClusterUpdatePolicySection = () => {
  const { t } = useTranslation(['add', 'service', 'versions']);

  const shell = useContext(ShellContext);
  const subsidiary = shell.environment.getUser().ovhSubsidiary;
  const documentationUrl =
    (subsidiary && subsidiary in DOCUMENTATION_LINK
      ? DOCUMENTATION_LINK[subsidiary as keyof typeof DOCUMENTATION_LINK]
      : null) || DOCUMENTATION_LINK.DEFAULT;

  const { watch, setValue } = useFormContext<TCreateClusterSchema>();
  const selectedPolicy = watch('updatePolicy');

  const handleSelectPolicy = (policy: UpdatePolicy) => {
    setValue('updatePolicy', policy);
  };

  const pciCardClassName = () =>
    cn('h-full', {
      'hover:shadow-sm cursor-pointer': true,
    });

  return (
    <div className="mt-8">
      <div className="flex items-center space-x-4">
        <Text preset="heading-4">{t('add:kubernetes_add_update_policy_title')}</Text>
        <UpdatePolicyHelper />
      </div>

      <div className="my-4">
        <Text preset="paragraph" color="text">
          {t('add:kube_update_policy_picker_documentation_text')}{' '}
          <Link href={documentationUrl} target="_blank" rel="noopener noreferrer">
            {t('add:kube_update_policy_picker_documentation_link')}
            <Icon name="external-link" className="ml-2 inline-block" />
          </Link>
        </Text>
      </div>

      <RadioGroup value={selectedPolicy}>
        <div className="my-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {UPGRADE_POLICIES.map((policy) => (
            <PciCard
              key={policy}
              selectable
              selected={selectedPolicy === policy}
              onClick={() => handleSelectPolicy(policy as UpdatePolicy)}
              className={pciCardClassName()}
            >
              <div className="px-6 py-4">
                <PciCard.Header>
                  <Radio className="w-full" value={policy}>
                    <RadioControl />
                    <RadioLabel className="text-lg font-bold text-[--ods-color-heading]">
                      {t(`service:kube_service_upgrade_policy_${policy}`)}
                    </RadioLabel>
                  </Radio>
                  {policy === UpdatePolicy.AlwaysUpdate && (
                    <div className="mt-2">
                      <Badge color="information">
                        {t('versions:pci_project_versions_recommended_version_female')}
                      </Badge>
                    </div>
                  )}
                </PciCard.Header>

                <div className="mt-4">
                  <Text preset="paragraph" className="text-[--ods-color-text-500]">
                    {t(`service:kube_service_upgrade_policy_description_${policy}`)}
                  </Text>
                </div>
              </div>
            </PciCard>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};
