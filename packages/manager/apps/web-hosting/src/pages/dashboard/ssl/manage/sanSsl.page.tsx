import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { MODAL_COLOR, Modal } from '@ovh-ux/muk';

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
    <Modal
      data-testid="san-modal"
      type={MODAL_COLOR.information}
      dismissible
      onOpenChange={closeModal}
      open
    >
      <div className="mb-4 flex flex-col space-y-4">
        <Text className="mb-4" preset={TEXT_PRESET.heading4}>
          {t('san_ssl_title')}
        </Text>
        <Text>{t('san_ssl_message', { n, domain })}</Text>
        <Text>{san}</Text>
      </div>
      <div className="flex justify-end space-x-4">
        <Button
          color={BUTTON_COLOR.primary}
          onClick={() => {
            navigator.clipboard.writeText(san).catch(console.error);
          }}
          variant={BUTTON_VARIANT.outline}
          data-testid="secondary-button"
          className="mt-4"
          type="button"
        >
          <>
            <Icon name={ICON_NAME.fileCopy} />
            {t('san_ssl_copy')}
          </>
        </Button>
        <Button
          color={BUTTON_COLOR.primary}
          onClick={closeModal}
          variant={BUTTON_VARIANT.default}
          data-testid="primary-button"
          className="mt-4"
          type="button"
        >
          {tActions('close')}
        </Button>
      </div>
    </Modal>
  );
}
