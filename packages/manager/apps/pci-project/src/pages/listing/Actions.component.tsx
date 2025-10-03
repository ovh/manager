import { ActionMenu, useNotifications } from '@ovh-ux/manager-react-components';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { urls } from '@/routes/routes.constant';
import { TProjectWithService } from '@/data/types/project.type';
import { removeProject } from '@/data/api/projects';
import { useSetAsDefaultProject } from '@/data/hooks/useProjects';
import { PROJECTS_TRACKING } from '@/tracking.constant';

type ActionsProps = {
  projectWithService: TProjectWithService;
};

export default function Actions({
  projectWithService,
}: Readonly<ActionsProps>) {
  const { t } = useTranslation(['listing', 'edit', NAMESPACES.ERROR]);
  const { trackClick } = useOvhTracking();
  const { addSuccess, addError } = useNotifications();
  const {
    shell: { navigation },
  } = useContext(ShellContext);

  // URLs and navigation
  const [billingHref, setBillingHref] = useState('');
  const projectHref = useHref(`./${projectWithService.project_id}`);
  const deleteHref = useHref(
    `./${urls.remove}?projectId=${projectWithService.project_id}&serviceId=${projectWithService.service?.serviceId}`,
  );

  // Project status flags
  const projectStatus = {
    isCreating: projectWithService.status === 'creating',
    isActive: projectWithService.status === 'ok',
    isSuspended: projectWithService.status === 'suspended',
    hasPendingDebt: projectWithService.isUnpaid,
    isDefault: projectWithService.isDefault,
  };

  const trackDeleteProjectClick = () => {
    trackClick({
      actionType: 'action',
      actions: PROJECTS_TRACKING.LISTING.DELETE_PROJECT,
    });
  };

  const handleDeleteProject = () => {
    trackDeleteProjectClick();
    removeProject({ projectId: projectWithService.project_id }).then(() =>
      addSuccess(t('pci_projects_project_delete_success')),
    );
  };

  const { mutate: setAsDefaultProject } = useSetAsDefaultProject({
    onSuccess: () => {
      addSuccess(t('pci_projects_project_edit_update_success', { ns: 'edit' }));
    },
    onError: (error: ApiError) => {
      addError(
        t('error_message', { message: error.message, ns: NAMESPACES.ERROR }),
      );
    },
  });

  useEffect(() => {
    navigation
      .getURL('dedicated', '#/billing/history', {})
      .then((url) => setBillingHref(`${url}`));
  }, [navigation]);

  const getMenuItems = () => {
    const items = [];

    // Pay bill option
    if (!projectStatus.isSuspended && projectStatus.hasPendingDebt) {
      items.push({
        id: 0,
        label: t('pci_projects_project_pay_bill'),
        href: billingHref,
      });
    }

    // View/Show project option
    if (!projectStatus.isSuspended) {
      items.push({
        id: 1,
        label: t(
          projectStatus.hasPendingDebt
            ? 'pci_projects_project_view'
            : 'pci_projects_project_show',
        ),
        href: projectHref,
      });
    }

    // Delete option
    if (
      (projectStatus.isCreating || projectStatus.isActive) &&
      !projectStatus.hasPendingDebt
    ) {
      items.push({
        id: 2,
        label: t('pci_projects_project_delete'),
        ...(projectStatus.isCreating
          ? { onClick: handleDeleteProject }
          : { href: deleteHref, onClick: trackDeleteProjectClick }),
      });
    }

    // View/Show project option
    if (!projectStatus.isDefault) {
      items.push({
        id: 3,
        label: t('pci_projects_project_edit_set_as_default_project', {
          ns: 'edit',
        }),
        onClick: () => setAsDefaultProject(projectWithService.project_id),
      });
    }

    return items;
  };

  return (
    <ActionMenu
      id={projectWithService.project_id}
      items={getMenuItems()}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
}
