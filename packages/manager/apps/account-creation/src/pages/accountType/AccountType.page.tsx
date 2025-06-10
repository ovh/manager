import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OdsRadio,
  OdsFormField,
  OdsText,
  OdsTooltip,
  OdsButton,
  OdsSkeleton,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useState } from 'react';
import { useUserContext } from '@/context/user/useUser';
import { useLegalFormRules } from '@/data/hooks/useRules';
import {
  AVERAGE_LEGAL_FORM_LENGTH,
  AVERAGE_NUMBER_OF_LEGAL_FORMS,
} from './accountType.constants';

export default function AccountType() {
  const { t } = useTranslation('account-type');
  const { t: tAction } = useTranslation(NAMESPACES.ACTIONS);
  const { t: tForm } = useTranslation(NAMESPACES.FORM);
  const navigate = useNavigate();
  const { ovhSubsidiary, setLegalForm } = useUserContext();
  const { data: rule, isLoading } = useLegalFormRules({ ovhSubsidiary });
  const [selectedLegalForm, setSelectedLegalForm] = useState<string | null>(
    null,
  );
  const [legalFormError, setLegalFormError] = useState<boolean>(false);

  const validateStep = () => {
    if (selectedLegalForm === null) {
      setLegalFormError(true);
    } else {
      setLegalForm(selectedLegalForm);
      if (selectedLegalForm === 'individual') {
        navigate('/info');
      } else {
        // TODO: create /corporation route and implement its page
        navigate('/corporation');
      }
    }
  };

  return (
    <>
      <div className={'flex flex-col gap-8'}>
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
            {/* TODO: add tooltip text */}
            <OdsText>{t('legal_form_tooltip')}</OdsText>
          </OdsTooltip>
        </div>
        <OdsFormField
          className={'flex flex-row flex-wrap items-center gap-4'}
          error={legalFormError ? tForm('required_field') : ''}
        >
          {isLoading &&
            Array.from({ length: AVERAGE_NUMBER_OF_LEGAL_FORMS }).map(
              (_, index) => (
                <div
                  className={
                    'w-full sm:w-auto flex items-center gap-4 border border-solid rounded-md px-6 py-4'
                  }
                  key={`legal_form_skeleton_${index}`}
                >
                  <OdsRadio
                    name={`legal_form`}
                    isDisabled={true}
                    className="contents sm:inline-flex"
                  ></OdsRadio>
                  <OdsSkeleton
                    style={{
                      width: `${AVERAGE_LEGAL_FORM_LENGTH}ch`,
                      height: '20px',
                      'align-content': 'center',
                    }}
                  />
                </div>
              ),
            )}
          {rule?.in &&
            rule.in.map((value: string) => (
              <div
                className={`w-full sm:w-auto flex items-center gap-4 border border-solid rounded-md px-6 py-4 ${
                  legalFormError
                    ? 'border-[var(--ods-color-form-element-border-critical)]'
                    : ''
                }`}
                key={`legal_form_${value}`}
              >
                <OdsRadio
                  inputId={`legal_form_${value}`}
                  name={`legal_form`}
                  value={value}
                  onOdsChange={() => {
                    setSelectedLegalForm(value);
                    setLegalFormError(false);
                  }}
                  hasError={legalFormError}
                  className="contents sm:inline-flex"
                ></OdsRadio>
                <label htmlFor={`legal_form_${value}`}>
                  {t(`legal_form_${value}`)}
                </label>
              </div>
            ))}
        </OdsFormField>
        <OdsButton
          className={'w-full'}
          label={tAction('validate')}
          onClick={validateStep}
        />
      </div>
    </>
  );
}
