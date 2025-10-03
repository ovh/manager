import React, { FunctionComponent } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_LEVEL } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';

import { LegalPolicyLinkByLanguage } from '@/constants';
import useUser from '@/context/User/useUser';
import { CanadianPolicyLinks } from '@/types/links.type';
import { Subsidiary } from '@/types/user.type';

type Props = {
  translationNamespace: string;
  informationTranslationKey: string;
  informationInterpolation?: Record<string, string | number | JSX.Element>;
  policyTanslationKey: string;
};

export const LegalInformations: FunctionComponent<Props> = ({
  translationNamespace,
  informationTranslationKey,
  informationInterpolation,
  policyTanslationKey,
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(translationNamespace);

  const {
    user: { subsidiary },
  } = useUser();
  const [baseLocale] = language.split('_');

  const formattedSubsidiary = ['ASIA', 'LTE'].includes(subsidiary)
    ? subsidiary
    : (subsidiary.slice(-2) as Subsidiary);
  const legalPolicyLink: string =
    formattedSubsidiary === 'CA'
      ? LegalPolicyLinkByLanguage.CA[baseLocale as keyof CanadianPolicyLinks] ||
        LegalPolicyLinkByLanguage.CA.en
      : LegalPolicyLinkByLanguage[formattedSubsidiary] || LegalPolicyLinkByLanguage.DEFAULT;

  return (
    <div className="pt-6">
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._100}
      >
        {t(informationTranslationKey, informationInterpolation)}
      </OsdsText>

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block mt-3"
        size={ODS_TEXT_SIZE._100}
      >
        <span
          data-testid="legal_information_policy_content"
          dangerouslySetInnerHTML={{
            __html: t(policyTanslationKey, {
              legalPolicyLink,
            }),
          }}
        ></span>
      </OsdsText>
    </div>
  );
};
