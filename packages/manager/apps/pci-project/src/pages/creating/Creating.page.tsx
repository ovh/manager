import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  ODS_ICON_NAME,
  ODS_LINK_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref, useNavigate, useSearchParams } from 'react-router-dom';
import { PROJECTS_TRACKING } from '@/tracking.constant';
import { useParam } from '@/hooks/useParam';
import {
  useDeliveredProjectId,
  useOrderFollowUpPolling,
} from '@/data/hooks/useOrder';
import { CREATING_GUIDE_URLS } from '@/constants';
import ImageSlider from './components/ImageSlider';
import LargeSpinner from './components/large-spinner/LargeSpinner';

export default function CreatingPage() {
  const { t } = useTranslation('creating');
  const { trackClick, trackPage } = useOvhTracking();

  const [isDelivered, setIsDelivered] = useState(false);
  const [searchParams] = useSearchParams();

  const orderId = useParam('orderId');
  const redirectState = searchParams.get('redirectState');

  const navigate = useNavigate();

  const { environment } = useContext(ShellContext);
  const user = environment.getUser();

  const pciProjectsHref = useHref('..');

  const handleProjectDeliveryFail = () => {
    trackPage({
      pageName: PROJECTS_TRACKING.CREATING.PROJECT_DELIVERY_FAILED,
    });

    throw new Error(t('pci_projects_creating_delivery_error'));
  };

  const guideUrl =
    CREATING_GUIDE_URLS[user?.ovhSubsidiary] || CREATING_GUIDE_URLS.FR;

  useOrderFollowUpPolling({
    orderId: Number(orderId),
    onProjectDelivered: () => setIsDelivered(true),
    onProjectDeliveryFail: handleProjectDeliveryFail,
  });

  useDeliveredProjectId({
    orderId: Number(orderId),
    enabled: isDelivered,
    onProjectIdDelivered: (projectId: string) => {
      trackPage({
        pageName: PROJECTS_TRACKING.CREATING.PROJECT_DELIVERED,
      });

      if (redirectState) {
        navigate(redirectState);
      } else {
        navigate(`../${projectId}`);
      }
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--ods-color-primary-050)]">
      <div className="bg-white min-h-screen w-full max-w-2xl p-10 shadow-lg flex flex-col">
        <div className="flex flex-col justify-center items-center flex-1 gap-8">
          <OdsText preset={ODS_TEXT_PRESET.heading1} className="text-center">
            {t('pci_projects_creating_main_title')}
          </OdsText>

          <OdsText preset={ODS_TEXT_PRESET.heading4} className="text-center">
            {t('pci_projects_creating_secondary_title')}
          </OdsText>

          <LargeSpinner>
            <ImageSlider />
          </LargeSpinner>

          <div className="text-center space-y-4">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('pci_projects_creating_long_time')}
            </OdsText>

            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('pci_projects_creating_long_time_wait')}
            </OdsText>
          </div>

          <div className="flex gap-8 flex-wrap justify-center">
            <OdsLink
              href={guideUrl}
              target="_blank"
              rel="noopener noreferrer"
              color={ODS_LINK_COLOR.primary}
              label={t('pci_projects_creating_guides')}
              iconAlignment="left"
              icon={ODS_ICON_NAME.externalLink}
              onClick={() => {
                trackClick({
                  actionType: 'action',
                  actions: PROJECTS_TRACKING.CREATING.CTA_GUIDE,
                });
              }}
            />
            <OdsLink
              href={pciProjectsHref}
              target="_blank"
              color={ODS_LINK_COLOR.primary}
              label={t('pci_projects_creating_other_projects')}
              iconAlignment="left"
              icon={ODS_ICON_NAME.folder}
              onClick={() => {
                trackClick({
                  actionType: 'action',
                  actions: PROJECTS_TRACKING.CREATING.CTA_OTHER_PROJECTS,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
