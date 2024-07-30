import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import { BaseLayout } from '@ovhcloud/manager-components';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { RancherService } from '@/api/api.type';
import TableContainer from '@/components/Table/TableContainer';
import { useTrackingAction } from '@/hooks/useTrackingPage';
import { getOnboardingUrl } from '@/utils/route';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';
import { useTrackingPage } from '../../hooks/useTrackingPage';
import RancherTaskMessage from './RancherTaskMessage';

export interface ListingProps {
  data: RancherService[];
  refetchRanchers: () => void;
}

const ListingTablePage: React.FC<ListingProps> = ({
  data,
  refetchRanchers,
}) => {
  const { t } = useTranslation('pci-rancher/listing');
  const hrefDashboard = useHref('');
  const trackAction = useTrackingAction();
  const trackClick = () =>
    trackAction(TrackingPageView.ListingPage, TrackingEvent.add);

  useTrackingPage();

  const tasks = data.map((rancher) => rancher.currentTasks).flat();

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{ title: t('rancherTitle') }}
      message={tasks.length ? <RancherTaskMessage tasks={tasks} /> : <></>}
    >
      <div>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          inline
          onClick={trackClick}
          href={`${hrefDashboard}/new`}
        >
          <span slot="start" className="flex justify-center items-center">
            <OsdsIcon
              name={ODS_ICON_NAME.ADD}
              size={ODS_ICON_SIZE.xxs}
              color={ODS_THEME_COLOR_INTENT.primary}
              className="mr-4"
            />
            <span>{t('createRancher')}</span>
          </span>
        </OsdsButton>
      </div>
      {data ? (
        <TableContainer data={data} refetchRanchers={refetchRanchers} />
      ) : (
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
      )}
    </BaseLayout>
  );
};

const Listing: React.FC<ListingProps> = ({ data, refetchRanchers }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  useEffect(() => {
    if (data.length === 0) {
      navigate(getOnboardingUrl(projectId));
    }
  }, [projectId, data.length]);

  return data.length ? (
    <ListingTablePage data={data} refetchRanchers={refetchRanchers} />
  ) : (
    <></>
  );
};

export default Listing;
