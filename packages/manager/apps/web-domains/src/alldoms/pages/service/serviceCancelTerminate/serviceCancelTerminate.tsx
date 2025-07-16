import React from 'react';
import { Modal } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ODS_MODAL_COLOR, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useGetAllDomResource } from '@/alldoms/hooks/data/query';
import { useCancelAllDomTerminate } from '@/alldoms/hooks/useCancelAllDomTerminate/useCancelAllDomTerminate';

export default function ServiceCancelTerminate() {
  const { t } = useTranslation(['allDom', NAMESPACES.ACTIONS]);
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const { data: allDomResource, isLoading } = useGetAllDomResource(serviceName);

  const cancelAllDomTerminate = useCancelAllDomTerminate(
    serviceName,
    isLoading ? [] : allDomResource.currentState.domains,
  );

  return (
    <Modal
      heading={t(`allDom_cancel_terminate_title`, {
        serviceName,
      })}
      type={ODS_MODAL_COLOR.information}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:confirm`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onPrimaryButtonClick={() => cancelAllDomTerminate.mutate()}
      onSecondaryButtonClick={() => navigate(-1)}
    >
      {isLoading ? (
        <OdsSpinner size={ODS_SPINNER_SIZE.xs} />
      ) : (
        <div className="mb-8">
          <OdsText>
            {t('allDom_cancel_terminate_subtitle', {
              serviceName,
            })}
          </OdsText>
        </div>
      )}
    </Modal>
  );
}
