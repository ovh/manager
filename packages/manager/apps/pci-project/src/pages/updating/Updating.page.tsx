import { useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_LINK_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';

import { getProjectQueryKey } from '@ovh-ux/manager-pci-common';
import { ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import ImageSlider from '@/components/image-slider/ImageSlider';
import LargeSpinner from '@/components/large-spinner/LargeSpinner';
import { UPDATING_GUIDE_URLS } from '@/constants';
import { useDeliveredProjectId, useOrderFollowUpPolling } from '@/data/hooks/useOrder';
import { useParam } from '@/hooks/useParam';
import queryClient from '@/queryClient';
import { PROJECTS_TRACKING } from '@/tracking.constant';

import { useUpdatingTracking } from './hooks/useUpdatingTracking';

export default function UpdatingPage() {
  const { t } = useTranslation('updating');

  const { trackClick } = useOvhTracking();

  const { trackProjectUpdated, trackUpdateProjectSuccess, trackUpdateProjectError } =
    useUpdatingTracking();

  const [isDelivered, setIsDelivered] = useState(false);

  const orderId = useParam('orderId');
  const voucherCode = useParam('voucherCode', false);

  const navigate = useNavigate();

  const { environment } = useContext(ShellContext);
  const user = environment.getUser();

  const handleProjectDeliveryFail = () => {
    trackUpdateProjectError(t('pci_projects_updating_delivery_error'));
    throw new Error(t('pci_projects_updating_delivery_error'));
  };

  const guideUrl = UPDATING_GUIDE_URLS[user?.ovhSubsidiary] || UPDATING_GUIDE_URLS.DEFAULT;

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
      trackUpdateProjectSuccess({ voucherCode });
      void queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(projectId),
      });
      navigate(`../${projectId}`);
    },
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--ods-color-primary-050)]">
      <div className="flex min-h-screen w-full max-w-2xl flex-col bg-white p-10 shadow-lg">
        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <OdsText preset={ODS_TEXT_PRESET.heading1} className="text-center">
            {t('pci_projects_updating_main_title')}
          </OdsText>

          <OdsText preset={ODS_TEXT_PRESET.heading4} className="text-center">
            {t('pci_projects_updating_secondary_title')}
          </OdsText>

          <LargeSpinner>
            <ImageSlider />
          </LargeSpinner>

          <div className="space-y-4 text-center">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('pci_projects_updating_long_time')}
            </OdsText>

            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('pci_projects_updating_long_time_wait')}
            </OdsText>
          </div>

          <div>
            <OdsLink
              href={guideUrl || ''}
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
