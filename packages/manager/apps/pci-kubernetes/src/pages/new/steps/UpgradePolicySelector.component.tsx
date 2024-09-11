import {
  OsdsFormField,
  OsdsText,
  OsdsTile,
  OsdsLink,
} from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { UPGRADE_POLICIES } from '@/constants';

import { DOCUMENTATION_LINK } from '@/pages/upgrade-policy/UpgradePolicy.constant';
import { UPGRADEPOLICIES } from '@/types';

interface UpgradePolicySelectorProps {
  setPolicy: (policy: UPGRADEPOLICIES) => void;
  policy: UPGRADEPOLICIES;
}
export const tileClass =
  'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]';

export const selectedTileClass =
  'font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]';

export function UpgradePolicyTileSelector({
  setPolicy,
  policy: selectPolicy,
}: Readonly<UpgradePolicySelectorProps>) {
  const { t } = useTranslation(['add', 'service']);
  const shell = useContext(ShellContext);
  const select = (pol: UPGRADEPOLICIES) => {
    if (pol) {
      setPolicy(pol);
    }
  };

  return (
    <>
      <OsdsFormField className="mt-8">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.subheading}
          slot="label"
        >
          {t('kubernetes_add_update_policy_title')}
        </OsdsText>
      </OsdsFormField>
      <div className="my-4">
        <OsdsText>{t('kube_update_policy_picker_documentation_text')}</OsdsText>
        <OsdsLink
          href={DOCUMENTATION_LINK[shell.environment.getUser().ovhSubsidiary]}
        >
          {t('kube_update_policy_picker_documentation_link')}
        </OsdsLink>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {UPGRADE_POLICIES.map((policy: UPGRADEPOLICIES) => (
          <OsdsTile
            key={policy}
            className={clsx(
              tileClass,
              policy === selectPolicy ? selectedTileClass : null,
            )}
            onClick={() => select(policy)}
          >
            <div slot="end" className="align-bottom inline-block">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._600}
                className={`block ${
                  selectPolicy === policy ? 'font-bold' : 'font-normal'
                }`}
              >
                {t(`service:kube_service_upgrade_policy_${policy}`)}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._400}
                className="mt-2 block"
              >
                {t(`service:kube_service_upgrade_policy_description_${policy}`)}
              </OsdsText>
            </div>
          </OsdsTile>
        ))}
      </div>
    </>
  );
}
