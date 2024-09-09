import { OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { UPGRADE_POLICIES } from '@/constants';

interface UpgradePolicySelectorProps {
  onSelectPolicy: (policy) => void;
}
export const tileClass =
  'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]';

export const selectedTileClass =
  'font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]';

export function UpgradePolicyTileSelector({
  onSelectPolicy,
}: Readonly<UpgradePolicySelectorProps>) {
  const [selectPolicy, setSelectedPolicy] = useState<string | null>(null);
  const { t } = useTranslation(['add', 'service']);

  const select = (policy: string) => {
    if (policy) {
      setSelectedPolicy(policy);
      onSelectPolicy(policy);
    }
  };

  return (
    <>
      <OsdsText>{t('kubernetes_add_update_policy_title')}</OsdsText>
      <OsdsText>{t('kube_update_policy_picker_documentation_text')}</OsdsText>
      <OsdsText>{t('kube_update_policy_picker_documentation_link')}</OsdsText>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {UPGRADE_POLICIES.map((policy) => (
          <OsdsTile
            key={policy}
            className={clsx(
              tileClass,
              policy === selectPolicy ? selectPolicy : null,
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
                {t(`kube_service_upgrade_policy_${policy}`)}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._400}
                className="mt-2 block"
              >
                {t(`kube_service_upgrade_policy_description_${policy}`)}
              </OsdsText>
            </div>
          </OsdsTile>
        ))}
      </div>
    </>
  );
}
