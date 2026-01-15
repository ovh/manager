import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
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
import { ActionMenu, BaseLayout, ChangelogMenu, useFormatDate } from '@ovh-ux/muk';

import { useVideoCenter } from '@/data/hooks/videoCenter/useVideoCenter';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { computeThresholdsFromMax } from '@/utils/videoCenter';

import Contacts from './components/contacts.component';
import TipsAndSupport from './components/tipsAndSupport.component';

export default function VideoCenterDashboardPage() {
  const { serviceId } = useParams();
  const { t } = useTranslation(['videoManagerCenter', NAMESPACES.DASHBOARD, NAMESPACES.BILLING]);
  const { data } = useVideoCenter(serviceId);
  const formatDate = useFormatDate();

  const vodCountThresholds = computeThresholdsFromMax(data?.currentState?.vodCount?.hostable || 0);
  const vodDurationThresholds = computeThresholdsFromMax(
    data?.currentState?.vodDurationMinutes?.hostable || 0,
  );
  return (
    <BaseLayout
      header={{
        title: t('video_manager_page_title'),
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
      }}
    >
      <div className="mb-6 flex flex-wrap justify-end">
        <Button color={BUTTON_COLOR.primary}>
          {t('video_manager_service_access_video_center')}
          <Icon name={ICON_NAME.externalLink}></Icon>
        </Button>
      </div>
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
          <Contacts />
        </Card>
        <div className="flex w-1/2 flex-col space-y-4">
          <TipsAndSupport />
        </div>
      </div>
    </BaseLayout>
  );
}
