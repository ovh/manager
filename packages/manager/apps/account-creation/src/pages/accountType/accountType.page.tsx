import { Trans, useTranslation } from 'react-i18next';
import {
  OdsRadio,
  OdsFormField,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useUserContext } from '@/context/user/useUser';
import { useLegalFormRules } from '@/hooks/legalFormRules/userLegalFormRules';

export default function Type() {
  const { t } = useTranslation('account-type');
  const { ovhSubsidiary } = useUserContext();
  const rules = useLegalFormRules(ovhSubsidiary);

  return (
    <>
      <div className={'flex flex-col gap-5'}>
        <OdsText preset={ODS_TEXT_PRESET.heading1}>{t('title')}</OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <Trans
            t={t}
            i18nKey="description"
            components={{
              Tooltip: <span id={`legal-form-tooltip-trigger`} />,
            }}
          />
        </OdsText>
        <OdsTooltip triggerId={`legal-form-tooltip-trigger`}>
          <OdsText>{t('legal_form_tooltip')}</OdsText>
        </OdsTooltip>
        <OdsFormField>
          <div className={'flex flex-wrap items-center gap-4'}>
            {rules?.in &&
              rules.in.map((value: string) => (
                <div
                  className={
                    'flex items-center gap-4 border border-solid rounded-md px-6 py-4'
                  }
                >
                  <OdsRadio
                    inputId={`legal_form_${value}`}
                    name={`legal_form`}
                    value={value}
                  ></OdsRadio>
                  <label htmlFor={`legal_form_${value}`}>
                    {t(`legal_form_${value}`)}
                  </label>
                </div>
              ))}
          </div>
        </OdsFormField>
      </div>
    </>
  );
}
