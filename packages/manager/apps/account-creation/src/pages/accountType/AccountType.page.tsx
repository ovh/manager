import { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  OdsRadio,
  OdsFormField,
  OdsText,
  OdsButton,
  OdsSkeleton,
  OdsPopover,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { LegalForm } from '@ovh-ux/manager-config';
import { ButtonType, PageLocation, usePageTracking } from '@ovh-ux/manager-react-shell-client';
import { useTrackingContext } from '@/context/tracking/useTracking';
import { useUserContext } from '@/context/user/useUser';
import { useLegalFormRules } from '@/data/hooks/useRules';
import { useTrackError } from '@/hooks/tracking/useTracking';
import { AVERAGE_NUMBER_OF_LEGAL_FORMS } from './accountType.constants';
import AccountTypeTooltipContent from './tooltip-content/TooltipContent.component';
import { urls } from '@/routes/routes.constant';
import { shouldAccessOrganizationSearch } from '@/helpers/flowHelper';

export default function AccountType() {
  const { t } = useTranslation('account-type');
  const { t: tAction } = useTranslation(NAMESPACES.ACTIONS);
  const { t: tForm } = useTranslation(NAMESPACES.FORM);
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();
  const { trackClick } = useTrackingContext();
  const { trackError } = useTrackError('select-account-type');
  const pageTracking = usePageTracking();
  const { ovhSubsidiary, country, legalForm, setLegalForm, language } = useUserContext();
  const { data: rule, isLoading, error } = useLegalFormRules({
    ovhSubsidiary,
    country,
  });
  const [legalFormError, setLegalFormError] = useState<boolean>(false);

  const testVar = 'test';

  const validateStep = useCallback(() => {
    // Account are created with the "other" legal form which is not available anymore
    if (!legalForm || legalForm === 'other') {
      setLegalFormError(true);
      trackError('empty');
      return;
    }
    if (pageTracking) {
      trackClick(pageTracking, {
        location: PageLocation.page,
        buttonType: ButtonType.button,
        actions: ['account-create-select-account-type', 'next', `${ovhSubsidiary}_${language}_${legalForm}`],
      });
    }
    if (shouldAccessOrganizationSearch(country, legalForm)) {
      navigate(`${urls.company}?${searchParams.toString()}`);
    } else {
      navigate(`${urls.accountDetails}?${searchParams.toString()}`);
    }
  }, [legalForm, country]);

  useEffect(() => {
    if (error) {
      trackError(error.message);
    }
  }, [error]);

  const trackTooltipClick = useCallback(() => {
    if (pageTracking) {
      trackClick(pageTracking, {
        buttonType: ButtonType.externalLink,
        actions: ['see-more-account-type'],
      });
    }
  }, [trackClick]);

  return (
    <>
      <div className={'flex flex-col gap-8'}>
        <div className={'flex flex-col gap-5'}>
          <OdsText preset={ODS_TEXT_PRESET.heading1}>{t('title')}</OdsText>
          <OdsText
            className="cursor-pointer"
            preset={ODS_TEXT_PRESET.paragraph}
            id="account-type-description"
            onClick={() => trackTooltipClick()}
          >
            <Trans t={t} i18nKey="description" />
          </OdsText>
          {!isLoading && rule && (
            <OdsPopover
              className="md:w-1/4 p-5"
              triggerId="account-type-description"
              with-arrow
            >
              <AccountTypeTooltipContent legalForms={rule.in as LegalForm[]} />
            </OdsPopover>
          )}
        </div>
        <OdsFormField>
          <div className={'flex flex-row flex-wrap items-center gap-4'}>
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
                    <OdsSkeleton className="w-[11ch] h-5 content-center" />
                  </div>
                ),
              )}
            {rule?.in &&
              rule.in.map((value: string) => (
                <div
                  className={`w-full sm:w-auto flex items-center gap-4 border border-solid border-[--ods-color-primary-700] rounded-md px-6 py-4 ${
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
                      setLegalForm(value as LegalForm);
                      setLegalFormError(false);
                    }}
                    hasError={legalFormError}
                    className="contents sm:inline-flex"
                  ></OdsRadio>
                  <label
                    className="text-[--ods-color-primary-700]"
                    htmlFor={`legal_form_${value}`}
                  >
                    {t(`legal_form_${value}`)}
                  </label>
                </div>
              ))}
          </div>
          {legalFormError && (
            <OdsText
              className="text-critical leading-[0.8]"
              preset={ODS_TEXT_PRESET.caption}
            >
              {tForm('required_field')}
            </OdsText>
          )}
        </OdsFormField>
        <OdsButton
          className={'w-full'}
          label={tAction('validate')}
          onClick={validateStep}
              isDisabled={isLoading || legalFormError}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
