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
import { useNavigate } from 'react-router-dom';
import ImageSlider from '@/components/image-slider/ImageSlider';
import LargeSpinner from '@/components/large-spinner/LargeSpinner';
import { UPDATING_GUIDE_URLS } from '@/constants';
import {
  useDeliveredProjectId,
  useOrderFollowUpPolling,
} from '@/data/hooks/useOrder';
import { useParam } from '@/hooks/useParam';
import { PROJECTS_TRACKING } from '@/tracking.constant';
import { useUpdatingTracking } from './hooks/useUpdatingTracking';

export default function UpdatingPage() {
  const { t } = useTranslation('updating');

  const { trackClick } = useOvhTracking();

  const {
    trackProjectUpdated,
    trackActivateProjectSuccess,
    trackActivateProjectError,
  } = useUpdatingTracking();

  const [isDelivered, setIsDelivered] = useState(false);

  const orderId = useParam('orderId');
  const voucherCode = useParam('voucherCode');

  const navigate = useNavigate();

  const { environment } = useContext(ShellContext);
  const user = environment.getUser();

  const handleProjectDeliveryFail = () => {
    trackActivateProjectError();
    throw new Error(t('pci_projects_updating_delivery_error'));
  };

  const guideUrl = UPDATING_GUIDE_URLS[user?.ovhSubsidiary];

  useOrderFollowUpPolling({
    orderId: Number(orderId),
    onProjectDelivered: () => setIsDelivered(true),
    onProjectDeliveryFail: handleProjectDeliveryFail,
  });

  useDeliveredProjectId({
    orderId: Number(orderId),
    enabled: isDelivered,
    onProjectIdDelivered: (projectId: string) => {
      trackProjectUpdated();
      trackActivateProjectSuccess({ voucherCode });
      navigate(`../${projectId}`);
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--ods-color-primary-050)]">
      <div className="bg-white min-h-screen w-full max-w-2xl p-10 shadow-lg flex flex-col">
        <div className="flex flex-col justify-center items-center flex-1 gap-8">
          <OdsText preset={ODS_TEXT_PRESET.heading1} className="text-center">
            {t('pci_projects_updating_main_title')}
          </OdsText>

          <OdsText preset={ODS_TEXT_PRESET.heading4} className="text-center">
            {t('pci_projects_updating_secondary_title')}
          </OdsText>

          <LargeSpinner>
            <ImageSlider />
          </LargeSpinner>

          <div className="text-center space-y-4">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('pci_projects_updating_long_time')}
            </OdsText>

            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('pci_projects_updating_long_time_wait')}
            </OdsText>
          </div>

          <div>
            <OdsLink
              href={guideUrl}
              target="_blank"
              rel="noopener noreferrer"
              color={ODS_LINK_COLOR.primary}
              label={t('pci_projects_updating_guides')}
              iconAlignment="left"
              icon={ODS_ICON_NAME.externalLink}
              onClick={() => {
                trackClick({
                  actionType: 'action',
                  actions: PROJECTS_TRACKING.UPDATING.CTA_GUIDE,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
