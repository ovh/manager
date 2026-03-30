import { useContext } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  Card,
  Divider,
  ICON_NAME,
  Icon,
  Meter,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu, BaseLayout, ChangelogMenu, useFormatDate } from '@ovh-ux/muk';

import { VIDEO_MANAGER_URL } from '@/constants';
import {
  useGenerateVideoCenterToken,
  useVideoCenter,
} from '@/data/hooks/videoCenter/useVideoCenter';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { computeThresholdsFromMax } from '@/utils/videoCenter';

import Contacts from './components/contacts.component';
import TipsAndSupport from './components/tipsAndSupport.component';

export default function VideoCenterDashboardPage() {
  const { serviceId } = useParams();
  const { t } = useTranslation(['videoManagerCenter', NAMESPACES.DASHBOARD, NAMESPACES.BILLING]);
  const { data } = useVideoCenter(serviceId);
  const formatDate = useFormatDate();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const vodCountThresholds = computeThresholdsFromMax(data?.currentState?.vodCount?.hostable || 0);
  const vodDurationThresholds = computeThresholdsFromMax(
    data?.currentState?.vodDurationMinutes?.hostable || 0,
  );
  const hasVideos = data?.currentState?.vodCount?.allocated > 0;
  const { generateVideoCenterTokenAsync } = useGenerateVideoCenterToken(serviceId);
  const onAccessVideoCenter = async () => {
    const popup = window.open('', '_blank');
    try {
      const token = await generateVideoCenterTokenAsync({ language: ovhSubsidiary });
      if (popup) {
        popup.location.href = `${VIDEO_MANAGER_URL}?token=${token}`;
      }
    } catch {
      popup?.close();
    }
  };

  return (
    <BaseLayout
      header={{
        title: t('video_manager_page_title'),
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
      }}
    >
      <div className="flex flex-row space-x-4">
        <Card className="w-1/3 p-6">
          {t('video_manager_service_current_offer')}
          <Text preset={TEXT_PRESET.heading4}>{data?.currentState?.offerName}</Text>
        </Card>
        <Card className="w-1/3 p-6">
          {t('video_manager_service_video_count')}
          <Meter
            value={data?.currentState?.vodCount?.allocated || 0}
            max={data?.currentState?.vodCount?.hostable || 0}
            optimum={vodCountThresholds?.optimum}
            high={vodCountThresholds?.high}
            low={vodCountThresholds?.low}
          />
          <Text>
            {t('video_manager_service_video_count_label', {
              allocated: data?.currentState?.vodCount?.allocated || 0,
              max: data?.currentState?.vodCount?.hostable || 0,
            })}
          </Text>
        </Card>
        <Card className="w-1/3 p-6">
          {t('video_manager_service_video_duration')}
          <Meter
            value={data?.currentState?.vodDurationMinutes?.allocated || 0}
            max={data?.currentState?.vodDurationMinutes?.hostable || 0}
            optimum={vodDurationThresholds?.optimum}
            high={vodDurationThresholds?.high}
            low={vodDurationThresholds?.low}
          />
          <Text>
            {t('video_manager_service_video_duration_label', {
              allocated: data?.currentState?.vodDurationMinutes?.allocated || 0,
              max: data?.currentState?.vodDurationMinutes?.hostable || 0,
            })}
          </Text>
        </Card>
      </div>
      <Card className="mt-6 flex flex-col gap-4 bg-gradient-to-br from-[#2d3e5f] via-[#3b5998] to-[#4a6fa5] p-8 text-white">
        <Text preset={TEXT_PRESET.heading3} className="!m-0 pb-5 !text-white">
          {t('title')}
        </Text>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white/10 p-8">
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-4 [&_span]:text-white">
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                1
              </span>
              <Text preset={TEXT_PRESET.span}>{t('step1')}</Text>
              <span className="text-white/50">→</span>
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                2
              </span>
              <Text preset={TEXT_PRESET.span}>{t('step2')}</Text>
              <span className="text-white/50">→</span>
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                3
              </span>
              <Text preset={TEXT_PRESET.span}>{t('step3')}</Text>
            </div>
            <Text preset={TEXT_PRESET.small} className="!text-white/60">
              {t('hint')}
            </Text>
          </div>
          <Button
            onClick={() => void onAccessVideoCenter()}
            className="shrink-0 whitespace-nowrap !border-white !bg-white !text-[#294576] hover:!bg-gray-100"
          >
            {hasVideos ? t('video_manager_service_access_video_center') : t('firstVideoButton')}
            <Icon name="external-link" />
          </Button>
        </div>
      </Card>
      <div className="mt-8 flex flex-row space-x-4">
        <Card className="w-1/2 p-6">
          <Text preset={TEXT_PRESET.heading5}>{t(`${NAMESPACES.BILLING}:subscription`)}</Text>
          <Divider />
          <Text preset={TEXT_PRESET.heading6} className="pt-4">
            {t(`${NAMESPACES.DASHBOARD}:creation_date`)}
          </Text>
          <Text className="pb-4">
            {formatDate({ date: data?.currentState?.createdAt, format: 'PP' })}
          </Text>
          <Divider />
          <div className="flex flex-row py-4">
            <div>
              <Text preset={TEXT_PRESET.heading6}>
                {t('video_manager_service_subscription_renewal')}
              </Text>
              <Text>{t('video_manager_ga')}</Text>
            </div>
            <div className="ml-auto">
              <ActionMenu
                id={'video-manager-subscription-actions'}
                items={[]}
                isDisabled
                isCompact
                variant={BUTTON_VARIANT.outline}
                icon={ICON_NAME.ellipsisVertical}
              />
            </div>
          </div>
          <Divider />
          <Contacts />
        </Card>
        <div className="flex w-1/2 flex-col space-y-4">
          <TipsAndSupport />
        </div>
      </div>
    </BaseLayout>
  );
}
