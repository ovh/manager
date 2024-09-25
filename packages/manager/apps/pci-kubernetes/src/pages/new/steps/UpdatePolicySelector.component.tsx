import {
  OsdsFormField,
  OsdsText,
  OsdsTile,
  OsdsLink,
  OsdsIcon,
  OsdsChip,
} from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { UPGRADE_POLICIES } from '@/constants';

import { DOCUMENTATION_LINK } from '@/pages/upgrade-policy/UpgradePolicy.constant';
import { UpdatePolicy } from '@/types';

interface UpdateSelectorProps {
  setPolicy: (policy: UpdatePolicy) => void;
  policy: UpdatePolicy;
}
export const tileClass =
  'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]';

export const selectedTileClass =
  'font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]';

export function UpdatePolicySelector({
  setPolicy,
  policy: selectPolicy,
}: Readonly<UpdateSelectorProps>) {
  const { t } = useTranslation(['add', 'service']);
  const shell = useContext(ShellContext);

  return (
    <>
      <OsdsFormField className="mt-8">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.subheading}
          slot="label"
        >
          {t('kubernetes_add_update_policy_title', { ns: 'add' })}
        </OsdsText>
      </OsdsFormField>
      <div className="my-4">
        <OsdsText>
          {t('kube_update_policy_picker_documentation_text', { ns: 'add' })}
        </OsdsText>{' '}
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          href={DOCUMENTATION_LINK[shell.environment.getUser().ovhSubsidiary]}
          target={OdsHTMLAnchorElementTarget._blank}
        >
          {t('kube_update_policy_picker_documentation_link', { ns: 'add' })}
          <OsdsIcon
            className="ml-3"
            slot="end"
            name={ODS_ICON_NAME.EXTERNAL_LINK}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
          ></OsdsIcon>
        </OsdsLink>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {UPGRADE_POLICIES.map((policy: UpdatePolicy) => (
          <OsdsTile
            data-testid={policy}
            role="button"
            key={policy}
            className={clsx(
              tileClass,
              policy === selectPolicy ? selectedTileClass : null,
            )}
            onClick={() => setPolicy(policy)}
          >
            <div slot="end" className="align-bottom inline-block">
              <div className="flex gap-x-4 gap-y-2 flex-wrap">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_TEXT_SIZE._600}
                  className={`block ${
                    selectPolicy === policy ? 'font-bold' : 'font-normal'
                  }`}
                >
                  {t(`service:kube_service_upgrade_policy_${policy}`)}
                  {/**  add chip if update policy  equal last version */}
                </OsdsText>
                {policy === UpdatePolicy.AlwaysUpdate && (
                  <OsdsChip
                    color={ODS_THEME_COLOR_INTENT.success}
                    size={ODS_CHIP_SIZE.sm}
                  >
                    {t('versions:pci_project_versions_recommended_version')}
                  </OsdsChip>
                )}
              </div>

              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._400}
                className="mt-2 block"
              >
                {t(`kube_service_upgrade_policy_description_${policy}`, {
                  ns: 'service',
                })}
              </OsdsText>
            </div>
          </OsdsTile>
        ))}
      </div>
    </>
  );
}
