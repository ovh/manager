import { useContext, useState } from 'react';

import { useHref, useNavigate, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_LINK_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';

import { PageType, ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import ImageSlider from '@/components/image-slider/ImageSlider';
import LargeSpinner from '@/components/large-spinner/LargeSpinner';
import { CREATING_GUIDE_URLS } from '@/constants';
import { useDeliveredProjectId, useOrderFollowUpPolling } from '@/data/hooks/useOrder';
import { useParam } from '@/hooks/useParam';
import { PROJECTS_TRACKING } from '@/tracking.constant';

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
      pageType: PageType.bannerError,
      pageName: PROJECTS_TRACKING.CREATING.PROJECT_DELIVERY_FAILED,
    });

    throw new Error(t('pci_projects_creating_delivery_error'));
  };

  const guideUrl = CREATING_GUIDE_URLS[user?.ovhSubsidiary] || CREATING_GUIDE_URLS.FR;

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
        pageType: PageType.bannerInfo,
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
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--ods-color-primary-050)]">
      <div className="flex min-h-screen w-full max-w-2xl flex-col bg-white p-10 shadow-lg">
        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <OdsText preset={ODS_TEXT_PRESET.heading1} className="text-center">
            {t('pci_projects_creating_main_title')}
          </OdsText>

          <OdsText preset={ODS_TEXT_PRESET.heading4} className="text-center">
            {t('pci_projects_creating_secondary_title')}
          </OdsText>

          <LargeSpinner>
            <ImageSlider />
          </LargeSpinner>

          <div className="space-y-4 text-center">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('pci_projects_creating_long_time')}
            </OdsText>

            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('pci_projects_creating_long_time_wait')}
            </OdsText>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <OdsLink
              href={guideUrl || ''}
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
