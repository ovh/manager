import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import React, { FunctionComponent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CanadianPolicyLinks } from '@/types/links.type';
import useUser from '@/context/User/useUser';
import { LegalPolicyLinkByLanguage } from '@/constants';

type Props = {
  translationNamespace: string;
  informationTranslationKey: string;
  policyTanslationKey: string;
};

export const LegalInformations: FunctionComponent<Props> = ({
  translationNamespace,
  informationTranslationKey,
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

  const legalPolicyLink: string =
    subsidiary === 'CA'
      ? LegalPolicyLinkByLanguage.CA[baseLocale as keyof CanadianPolicyLinks] ||
        LegalPolicyLinkByLanguage.CA.en
      : LegalPolicyLinkByLanguage[subsidiary] ||
        LegalPolicyLinkByLanguage.DEFAULT;

  return (
    <div className="pt-6">
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._100}
      >
        {t(informationTranslationKey)}
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
