import { useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  SPINNER_SIZE,
  Spinner,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/muk';

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
      open={true}
      onOpenChange={onClose}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        onClick: onConfirm,
        disabled: isFetching || isPending || websiteId === undefined,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: onClose,
      }}
    >
      {isFetching ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size={SPINNER_SIZE.lg} />
        </div>
      ) : isError || deployError ? (
        <Text preset={TEXT_PRESET.paragraph}>
          {String(error?.message ?? deployError?.message ?? t('common:unknown'))}
        </Text>
      ) : (
        <>
          <Text preset={TEXT_PRESET.paragraph} className="mb-4">
            {t('deploy_git_description')}
          </Text>

          <div className="flex items-start gap-3">
            <Checkbox
              name="deploy-git-reset"
              checked={reset}
              onCheckedChange={(detail) => setReset(Boolean(detail?.checked))}
            >
              <CheckboxControl />
              <CheckboxLabel>
                <Text preset={TEXT_PRESET.paragraph}>
                  {t('deploy_git_overwrite_local_changes')}
                </Text>
              </CheckboxLabel>
            </Checkbox>
          </div>
        </>
      )}
    </Modal>
  );
}
