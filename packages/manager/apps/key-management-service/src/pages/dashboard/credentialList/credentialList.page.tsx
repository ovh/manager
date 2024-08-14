import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { ROUTES_URLS } from '@/routes/routes.constants';

const CredentialList = () => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { okmsId } = useParams();

  return (
    <>
      <div className={'flex mb-3 mt-6'}>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
        >
          {t('key_management_service_credential_headline')}
        </OsdsText>
      </div>
      <OsdsButton
        size={ODS_BUTTON_SIZE.sm}
        inline
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        className={'xs:mt-2 sm:mt-0 w-fit h-fit'}
        onClick={() => {
          navigate(ROUTES_URLS.createCredential);
        }}
      >
        <span slot="start">
          <OsdsIcon
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          ></OsdsIcon>
        </span>

        {t('key_management_service_credential_cta_create')}
      </OsdsButton>
      <Outlet />
    </>
  );
};

export default CredentialList;
