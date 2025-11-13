import { useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_SPINNER_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsCheckbox, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';

import {
  useGetHostingWebsiteIds,
  usePostWebsiteDeploy,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';

export default function DeployeGitModal() {
  const navigate = useNavigate();
  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS]);
  const { serviceName, path } = useParams();

  const [reset, setReset] = useState(false);

  const {
    data: websiteIds,
    isFetching,
    isError,
    error,
  } = useGetHostingWebsiteIds(serviceName ?? '', path);

  const websiteId = useMemo(() => websiteIds?.[0], [websiteIds]);

  const {
    mutate: triggerDeploy,
    isPending,
    error: deployError,
  } = usePostWebsiteDeploy(serviceName ?? '', websiteId, {
    onSuccess: () => navigate(-1),
  });

  const onClose = () => {
    navigate(-1);
  };

  const onConfirm = () => {
    if (isFetching || isPending || !serviceName || websiteId === undefined) {
      return;
    }
    triggerDeploy({ reset });
  };

  return (
    <Modal
      heading={t('deploy_git')}
      isOpen
      onDismiss={onClose}
      onPrimaryButtonClick={onConfirm}
      onSecondaryButtonClick={onClose}
      isPrimaryButtonDisabled={isFetching || isPending || websiteId === undefined}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
    >
      {isFetching ? (
        <div className="flex justify-center items-center h-48">
          <OdsSpinner size={ODS_SPINNER_SIZE.lg} />
        </div>
      ) : isError || deployError ? (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {String(error?.message ?? deployError?.message ?? t('common:unknown'))}
        </OdsText>
      ) : (
        <>
          <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mb-4">
            {t('deploy_git_description')}
          </OdsText>

          <div className="flex gap-3 items-start">
            <OdsCheckbox
              name="deploy-git-reset"
              isChecked={reset}
              onOdsChange={(event: CustomEvent<{ checked: boolean }>) =>
                setReset(Boolean(event.detail?.checked))
              }
            />

            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('deploy_git_overwrite_local_changes')}
            </OdsText>
          </div>
        </>
      )}
    </Modal>
  );
}
