import { FC, useMemo } from 'react';
import { DefaultError } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  useInstanceActionModal,
  useInstanceParams,
} from '@/pages/instances/action/hooks/useInstanceActionModal';
import { isApiErrorResponse, replaceToSnakeCase } from '@/utils';
import { useProjectId } from '@/hooks/project/useProjectId';
import ActionModal from '@/components/actionModal/ActionModal.component';
import { useBaseInstanceAction } from '@/data/hooks/instance/action/useInstanceAction';
import { TSectionType } from '@/types/instance/action/action.type';

export type TBaseInstanceActionPageProps = {
  section: TSectionType;
};

const BaseInstanceActionPage: FC<TBaseInstanceActionPageProps> = ({
  section,
}) => {
  const projectId = useProjectId();
  const { instanceId, region } = useInstanceParams();

  const { addError, addInfo } = useNotifications();
  const navigate = useNavigate();
  const { t } = useTranslation(['actions']);

  const { instance, isLoading } = useInstanceActionModal(
    region,
    instanceId,
    section,
  );

  const snakeCaseSection = useMemo(() => replaceToSnakeCase(section), [
    section,
  ]);

  const closeModal = () => navigate('..');

  const onSuccess = () => {
    addInfo(
      <Trans
        i18nKey={`pci_instances_actions_${snakeCaseSection}_instance_success_message`}
        values={{
          name: instance?.name,
        }}
        ns="actions"
        components={[
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            key="0"
            href={
              'https://help.ovhcloud.com/csm/fr-public-cloud-compute-shelve-pause-instance?id=kb_article_view&sysparm_article=KB0051278'
            }
            target={OdsHTMLAnchorElementTarget._blank}
          />,
        ]}
      />,
      true,
    );

    closeModal();
  };

  const onError = (rawError: unknown) => {
    const errorMessage = isApiErrorResponse(rawError)
      ? rawError.response?.data.message
      : (rawError as DefaultError).message;
    addError(
      t(`pci_instances_actions_${snakeCaseSection}_instance_error_message`, {
        name: instance?.name,
        error: errorMessage,
      }),
      true,
    );
  };

  const { mutationHandler, isPending } = useBaseInstanceAction(
    section,
    projectId,
    region,
    {
      onError,
      onSuccess,
    },
  );

  const handleInstanceAction = () => {
    if (instance) mutationHandler({ instance });
  };

  return (
    <ActionModal
      title={t(`pci_instances_actions_${snakeCaseSection}_instance_title`)}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      onModalClose={closeModal}
      instance={instance}
      section={section}
      variant={section === 'delete' ? 'warning' : 'primary'}
      isLoading={isLoading}
    />
  );
};

export default BaseInstanceActionPage;
