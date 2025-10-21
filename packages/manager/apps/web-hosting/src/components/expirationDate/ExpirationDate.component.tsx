import { useParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { useFormatDate } from '@ovh-ux/manager-react-components';

import { useGetServiceInfos } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { SERVICE_INFOS_STATUS } from '@/data/types/product/ssl';

export default function ExpirationDate() {
  const { serviceName } = useParams();
  const { t } = useTranslation('dashboard');
  const formatDate = useFormatDate();

  const { data } = useGetServiceInfos(serviceName);

  const isExpired = data?.status === SERVICE_INFOS_STATUS.EXPIRED;
  const isInAutoRenew = data?.renew?.automatic || data?.renew?.forced;

  const expirationDate = formatDate({ date: data?.expiration, format: 'PP' });

  return (
    <>
      {!isExpired &&
        isInAutoRenew &&
        (data?.renew?.deleteAtExpiration ? (
          <OdsText className="mb-7">
            <Trans t={t} i18nKey="expiration_resiliation_date" values={{ expirationDate }}></Trans>
          </OdsText>
        ) : (
          <OdsText className="mb-7">
            <Trans t={t} i18nKey="expiration_renew_date" values={{ expirationDate }}></Trans>
          </OdsText>
        ))}
    </>
  );
}
