import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Card,
  Divider,
  ICON_NAME,
  Icon,
  Meter,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, BaseLayout, ChangelogMenu, Link, useFormatDate } from '@ovh-ux/muk';

import { useVideoCenter } from '@/data/hooks/videoCenter/useVideoCenter';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { computeThresholdsFromMax } from '@/utils/videoCenter';

export default function VideoManagerDashboardPage() {
  const { serviceId } = useParams();
  const { t } = useTranslation(['videoManagerCenter', NAMESPACES.DASHBOARD, NAMESPACES.BILLING]);
  const { data } = useVideoCenter(serviceId);
  const formatDate = useFormatDate();

  const videoCountThresholds = computeThresholdsFromMax(data?.currentState?.videoCount?.max || 0);
  const videoDurationThresholds = computeThresholdsFromMax(
    data?.currentState?.videoDurationMinutes?.max || 0,
  );
  return (
    <BaseLayout
      header={{
        title: t('video_manager_page_title'),
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
      }}
    >
      <div className="flex flex-row space-x-4">
        <Card className="w-1/3 p-6">
          {t(`${NAMESPACES.DASHBOARD}:my_offer`)}
          <Text preset={TEXT_PRESET.heading4}>{data?.currentState?.agoraPlanCode}</Text>
        </Card>
        <Card className="w-1/3 p-6">
          {t('video_manager_service_video_count')}
          <Meter
            value={data?.currentState?.videoCount?.allocated || 0}
            max={data?.currentState?.videoCount?.max || 0}
            optimum={videoCountThresholds?.optimum}
            high={videoCountThresholds?.high}
            low={videoCountThresholds?.low}
          />
          <Text>
            {t('video_manager_service_video_count_label', {
              allocated: data?.currentState?.videoCount?.allocated || 0,
              max: data?.currentState?.videoCount?.max || 0,
            })}
          </Text>
        </Card>
        <Card className="w-1/3 p-6">
          {t('video_manager_service_video_duration')}
          <Meter
            value={data?.currentState?.videoDurationMinutes?.allocated || 0}
            max={data?.currentState?.videoDurationMinutes?.max || 0}
            optimum={videoDurationThresholds?.optimum}
            high={videoDurationThresholds?.high}
            low={videoDurationThresholds?.low}
          />
          <Text>
            {t('video_manager_service_video_duration_label', {
              allocated: data?.currentState?.videoDurationMinutes?.allocated || 0,
              max: data?.currentState?.videoDurationMinutes?.max || 0,
            })}
          </Text>
        </Card>
      </div>
      <div className="mt-10 flex flex-row space-x-4">
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
          <div className="flex flex-row pt-4">
            <div>
              <Text preset={TEXT_PRESET.heading6}>{t(`${NAMESPACES.DASHBOARD}:contacts`)}</Text>
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
        </Card>
        <div className="flex w-1/2 flex-col space-y-4">
          <Card className="p-6">
            <Text preset={TEXT_PRESET.heading5}>{t('video_manager_service_tips')}</Text>
            <div className="mt-2 flex flex-col space-y-2">
              <Text>{t('video_manager_ga')}</Text>
              <Link target="_blank" rel="noopener noreferrer" disabled>
                <>
                  {t('video_manager_service_tips_tutorial')}
                  <Icon name={ICON_NAME.arrowRight}></Icon>
                </>
              </Link>
              <Link target="_blank" rel="noopener noreferrer" disabled>
                <>
                  {t('video_manager_service_tips_tutorial')}
                  <Icon name={ICON_NAME.arrowRight}></Icon>
                </>
              </Link>
            </div>
          </Card>
          <Card className="p-6">
            <Text preset={TEXT_PRESET.heading5}>{t('video_manager_service_support')}</Text>
            <Divider />
            <div className="flex flex-col space-y-2">
              <Text>{t('video_manager_ga')}</Text>
              <Text preset={TEXT_PRESET.caption}>
                {t('video_manager_service_support_standard')}
              </Text>
              <Link target="_blank" rel="noopener noreferrer" disabled>
                <>
                  {t('video_manager_service_support_ticket')}
                  <Icon name={ICON_NAME.externalLink}></Icon>
                </>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
}
