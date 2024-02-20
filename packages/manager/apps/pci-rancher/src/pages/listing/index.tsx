import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useHref, useParams } from 'react-router-dom';
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
import { RancherService } from '@/api/api.type';
import Title from '@/components/Title/Title';
import RancherTaskMessage from './RancherTaskMessage';
import TableContainer from '@/components/Table/TableContainer';
import { getOnboardingUrl } from '@/utils/route';
import { useTrackingAction } from '@/hooks/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';
import { useTrackingPage } from '../../hooks/useTrackingPage';

export interface ListingProps {
  data: RancherService[];
  refetchRanchers: () => void;
}

const Listing: React.FC<ListingProps> = ({ data, refetchRanchers }) => {
  const { t } = useTranslation('pci-rancher/listing');
  useTrackingPage();
  const hrefDashboard = useHref('');
  const navigate = useNavigate();
  const { projectId } = useParams();
  const trackAction = useTrackingAction();
  const trackClick = () =>
    trackAction(TrackingPageView.ListingPage, TrackingEvent.add);

  useEffect(() => {
    if (data.length === 0) {
      navigate(getOnboardingUrl(projectId));
    }
  }, [projectId, data.length]);

  const tasks = data.map((rancher) => rancher.currentTasks).flat();

  return (
    <>
      <Title>{t('rancherTitle')}</Title>
      <div className="my-3 mt-5">
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
      {tasks.length ? <RancherTaskMessage tasks={tasks} /> : <></>}
      {data ? (
        <TableContainer data={data} refetchRanchers={refetchRanchers} />
      ) : (
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
      )}
    </>
  );
};

export default Listing;
