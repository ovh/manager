/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useLocation, useHref } from 'react-router-dom';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsLink, OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { PageLayout, Title } from '@ovhcloud/manager-components';

import { TrackingEvent, TrackingPageView } from '@/utils/tracking';
import { useTrackingAction, useTrackingPage } from '@/hooks/useTrackingPage';

import { pciSavingsPlanListMocked } from '@/_mock_/savingsPlan';
import TableContainer from '@/components/Table/TableContainer';
import { getOnboardingUrl } from '@/utils/routes';

export interface ListingProps {
  data: any[];
  refetchSavingsPlans: () => void;
}
const ListingTablePage: React.FC<ListingProps> = ({
  data,
  refetchSavingsPlans,
}) => {
  const { t } = useTranslation('listing');
  const hrefDashboard = useHref('');
  const trackAction = useTrackingAction();
  const trackClick = () =>
    trackAction(TrackingPageView.ListingPage, TrackingEvent.add);
  useTrackingPage();

  return (
    <>
      <Title>{t('title')}</Title>
      <div className="pt-5 pb-10">
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
            <span>{t('createSavingsPlan')}</span>
          </span>
        </OsdsButton>
      </div>
      <TableContainer data={data} refetchSavingsPlans={refetchSavingsPlans} />
    </>
  );
};

const Listing: React.FC<ListingProps> = ({ data, refetchSavingsPlans }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const Listingdata = pciSavingsPlanListMocked;

  console.log({ Listingdata });

  useEffect(() => {
    if (Listingdata.length === 0) {
      navigate(getOnboardingUrl(projectId));
    }
  }, [projectId, Listingdata.length]);

  return (
    <PageLayout>
      {Listingdata.length ? (
        <ListingTablePage
          data={Listingdata}
          refetchSavingsPlans={refetchSavingsPlans}
        />
      ) : (
        <></>
      )}
    </PageLayout>
  );
};

export default Listing;
