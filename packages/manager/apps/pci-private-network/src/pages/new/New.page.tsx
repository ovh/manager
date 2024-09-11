import {
  Notifications,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
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
import { Suspense, useEffect } from 'react';

import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { Translation, useTranslation } from 'react-i18next';
import { useHref, useNavigate } from 'react-router-dom';
import {
  isDiscoveryProject,
  PciDiscoveryBanner,
  useProject,
} from '@ovh-ux/manager-pci-common';
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
  const { clearNotifications } = useNotifications();
  // </editor-fold>

  // <editor-fold desc="project">
  const { data: project } = useProject();
  const projectUrl = useProjectUrl('public-cloud');
  const backHref = useHref('..');

  useEffect(() => {
    if (project) {
      store.setProject({
        id: project.project_id,
        isDiscovery: isDiscoveryProject(project),
      });
    }
    clearNotifications();
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
                    message: e?.response?.data?.message || e?.message,
                  },
                ),
              }}
            />
          )}
        </Translation>,
        true,
      );
    } finally {
      store.setForm({ isCreating: false });
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
              href: backHref,
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
          onClick={() => clearNotifications()}
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
            {tNew('pci_projects_project_network_private_create')}
          </OsdsText>

          <Notifications />
        </div>
      </div>

      <div className="mb-5">
        <PciDiscoveryBanner project={project} />
      </div>

      <div className="flex flex-col gap-4 mb-10">
        <LocalizationStep />
        <ConfigurationStep onCreate={create} />
        <Suspense>
          {store.form.createGateway && <GatewaySummaryStep onCreate={create} />}
        </Suspense>
      </div>
    </>
  );
}
