import React from 'react';
import { Outlet } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import useUser from '@/context/User/useUser';
import { LegalInformations } from '@/components/legalInformations/LegalInformations.component';

export default function CreateRequest() {
  const { t } = useTranslation('account-disable-2fa');
  const { user } = useUser();

  return (
    <div className="lg:px-10 sm:px-3 lg:py-5 sm:py-3 flex flex-col gap-4">
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.info}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        className="block mb-2"
        size={ODS_TEXT_SIZE._500}
      >
        {t('account-disable-2fa-create-title')}
      </OsdsText>

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._400}
      >
        {t('account-disable-2fa-create-intro')}
        <ul className="list-disc ml-6">
          <li>{t('account-disable-2fa-create-intro-sensitive-info')}</li>
          <li>{t('account-disable-2fa-create-intro-document-visibility')}</li>
        </ul>
      </OsdsText>

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.info}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        className="block mb-2"
        size={ODS_TEXT_SIZE._500}
      >
        {t('account-disable-2fa-create-title-sub')}
      </OsdsText>

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._400}
      >
        <p>{t('account-disable-2fa-create-attention-readable-doc')}</p>
        <p className="mb-4">
          {t('account-disable-2fa-create-attention-no-valid-doc')}
        </p>
        <p>{t('account-disable-2fa-create-delay', { mail: user.email })}</p>
        <p className="mb-4">
          {t('account-disable-2fa-create-reactivate-info')}
        </p>
        <p className="font-bold">
          {t('account-disable-2fa-create-file-format')}
        </p>
      </OsdsText>

      <Outlet />

      <LegalInformations
        translationNamespace="account-disable-2fa"
        informationTranslationKey="account-disable-2fa-create-form-legal-info"
        policyTanslationKey="account-disable-2fa-create-form-legal-info-policy"
      />
    </div>
  );
}
