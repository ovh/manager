import {
  isDiscoveryProject,
  Notifications,
  PciDiscoveryBanner,
  useNotifications,
  useProject,
  useProjectUrl,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsBreadcrumb,
  OsdsIcon,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect } from 'react';

import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { Translation, useTranslation } from 'react-i18next';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import ConfigurationStep from './steps/ConfigurationStep';
import GatewaySummaryStep from './steps/GatewaySummaryStep';
import LocalizationStep from './steps/LocalizationStep';
import { useNewNetworkStore } from '@/pages/new/store';

export default function NewPage(): JSX.Element {
  const store = useNewNetworkStore();
  // <editor-fold desc="translations">
  const { t } = useTranslation('common');
  const { t: tListing } = useTranslation('listing');
  const { t: tNew } = useTranslation('new');
  // </editor-fold>

  // <editor-fold desc="project">
  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');
  const projectUrl = useProjectUrl('public-cloud');

  useEffect(() => {
    store.reset();
    if (project) {
      store.setProject({
        id: project.project_id,
        isDiscovery: isDiscoveryProject(project),
      });
    }
  }, [project]);
  // </editor-fold>

  const { addError, addSuccess } = useNotifications();
  const backLink = useHref('..');
  const navigate = useNavigate();

  const create = async () => {
    store.setForm({ isCreating: true });
    try {
      await store.create();
      addSuccess(
        <Translation ns="new">
          {(translate) => (
            <span
              dangerouslySetInnerHTML={{
                __html: translate(
                  'pci_projects_project_network_private_create_success',
                ),
              }}
            />
          )}
        </Translation>,
        true,
      );
      navigate('..');
    } catch (e) {
      addError(
        <Translation ns="new">
          {(translate) => (
            <span
              dangerouslySetInnerHTML={{
                __html: translate(
                  'pci_projects_project_network_private_create_error',
                  {
                    message: e?.message,
                  },
                ),
              }}
            />
          )}
        </Translation>,
        true,
      );
    } finally {
      store.setForm({ isCreating: true });
    }
  };

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: projectUrl,
              label: project.description,
            },
            {
              href: `${projectUrl}/private-networks`,
              label: tListing('pci_projects_project_network_private'),
            },
            {
              label: tNew('pci_projects_project_network_private_create'),
            },
          ]}
        />
      )}
      <div className="header mb-10 mt-8">
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          className="mt-10"
          href={backLink}
        >
          <OsdsIcon
            slot="start"
            name={ODS_ICON_NAME.ARROW_LEFT}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          ></OsdsIcon>
          <span className="ml-4">
            {t('common_back_button_back_to_previous_page')}
          </span>
        </OsdsLink>
        <div className="mt-[20px]">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._600}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {tNew('Créer un réseau privé')}
          </OsdsText>

          <Notifications />
        </div>
      </div>

      <div className="mb-5">
        {isDiscoveryProject(project) && (
          <PciDiscoveryBanner projectId={projectId} />
        )}
      </div>

      <div className="flex flex-col gap-4 mb-10">
        <LocalizationStep />
        <ConfigurationStep onCreate={create} />
        {store.form.createGateway && <GatewaySummaryStep onCreate={create} />}
      </div>
    </>
  );
}
