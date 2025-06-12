import { ActionMenu, useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { TProjectWithService } from '@/data/project.type';
import { CLOUD_PROJECT_BILLING_STATE, CLOUD_PROJECT_STATE } from '@/constants';
import { deleteProject } from '@/data/api/project';

type ActionsProps = {
  projectWithService: TProjectWithService;
};

export default function Actions({
  projectWithService,
}: Readonly<ActionsProps>) {
  const { t } = useTranslation('listing');

  const { addSuccess } = useNotifications();

  const deleteHref = useHref(
    `./remove?projectId=${projectWithService.project_id}&serviceId=${projectWithService.service?.serviceId}`,
  );

  const isCreating = projectWithService.status === CLOUD_PROJECT_STATE.creating;
  const isActive = projectWithService.status === CLOUD_PROJECT_STATE.ok;
  const hasPendingDebt =
    projectWithService.service?.billing.lifecycle.current.state ===
    CLOUD_PROJECT_BILLING_STATE.UNPAID;

  const handleDeleteProject = () => {
    deleteProject({ projectId: projectWithService.project_id }).then(() =>
      addSuccess(t('pci_projects_project_delete_success')),
    );
  };

  const menuItems = [
    ...((isCreating || isActive) && !hasPendingDebt
      ? [
          {
            id: 1,
            label: t('pci_projects_project_delete'),
            ...(isCreating
              ? { onclick: handleDeleteProject }
              : { href: deleteHref }),
          },
        ]
      : []),
  ];

  return (
    <ActionMenu
      id={projectWithService.project_id}
      items={menuItems}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
}
