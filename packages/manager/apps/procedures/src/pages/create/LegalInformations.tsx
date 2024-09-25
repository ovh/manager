import React, { FunctionComponent } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import useUser from '@/context/User/useUser';
import { LegalPolicyLinkByLanguage } from '@/constants';
import { CanadianPolicyLinks } from '@/types/links.type';

export const LegalInformations: FunctionComponent = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation('account-disable-2fa');
  const {
    user: { subsidiary },
  } = useUser();
  const [baseLocale] = language.split('_');

  const legalPolicyLink: string =
    subsidiary === 'CA'
      ? LegalPolicyLinkByLanguage.CA[baseLocale as keyof CanadianPolicyLinks] ||
        LegalPolicyLinkByLanguage.CA.en
      : LegalPolicyLinkByLanguage[subsidiary] ||
        LegalPolicyLinkByLanguage.DEFAULT;
  return (
    <div className="pt-6" data-testid="legal_information">
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._100}
      >
        {t('account-disable-2fa-create-form-legal-info')}
      </OsdsText>

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._100}
      >
        <span
          data-testid="legal_information_content"
          dangerouslySetInnerHTML={{
            __html: t('account-disable-2fa-create-form-legal-info-policy', {
              legalPolicyLink,
            }),
          }}
        ></span>
      </OsdsText>
    </div>
  );
};
