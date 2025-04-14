import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { subRoutes, urls } from '@/routes/routes.constants';

export default function Topbar() {
  const navigate = useNavigate();
  const { serviceName } = useParams();

  const { t } = useTranslation('ssl');

  return (
    <div className="flex flex-col space-y-10 mb-10">
      <div className="flex space-x-4">
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          data-testid="order-ssl"
          onClick={() =>
            navigate(
              urls.orderSectigo.replace(subRoutes.serviceName, serviceName),
            )
          }
          label={t('order_ssl_certificate')}
        />
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          data-testid="import-ssl"
          onClick={() =>
            navigate(urls.importSsl.replace(subRoutes.serviceName, serviceName))
          }
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('import_ssl_certificate')}
        />
      </div>
    </div>
  );
}
