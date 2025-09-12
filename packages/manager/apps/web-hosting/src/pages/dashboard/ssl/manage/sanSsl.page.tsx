import React from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsModal, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { subRoutes, urls } from '@/routes/routes.constants';

export default function SanModal() {
  const { serviceName, domain } = useParams();
  const [searchParams] = useSearchParams();
  const san = searchParams.get('san');
  const n = san.split('; ').length;

  const navigate = useNavigate();
  const closeModal = () => navigate(urls.ssl.replace(subRoutes.serviceName, serviceName));
  const { t } = useTranslation('ssl');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);

  return (
    <OdsModal
      data-testid="san-modal"
      color={ODS_MODAL_COLOR.information}
      isDismissible
      onOdsClose={closeModal}
      isOpen
    >
      <div className="flex flex-col space-y-4 mb-4">
        <OdsText className="mb-4" preset={ODS_TEXT_PRESET.heading4}>
          {t('san_ssl_title')}
        </OdsText>
        <OdsText>{t('san_ssl_message', { n, domain })}</OdsText>
        <OdsText>{san}</OdsText>
      </div>
      <div className="flex space-x-4 justify-end">
        <OdsButton
          color={ODS_BUTTON_COLOR.primary}
          icon={ODS_ICON_NAME.fileCopy}
          iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.right}
          onClick={() => {
            navigator.clipboard.writeText(san).catch(console.error);
          }}
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('san_ssl_copy')}
          className="mt-4"
          type="button"
        />
        <OdsButton
          color={ODS_BUTTON_COLOR.primary}
          onClick={closeModal}
          variant={ODS_BUTTON_VARIANT.default}
          label={tActions('close')}
          className="mt-4"
          type="button"
        />
      </div>
    </OdsModal>
  );
}
