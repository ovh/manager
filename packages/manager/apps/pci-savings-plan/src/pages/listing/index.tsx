import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useHref, useNavigate, useParams } from 'react-router-dom';
import { MutationStatus, useMutationState } from '@tanstack/react-query';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { Title } from '@ovhcloud/manager-components';

import TableContainer from '@/components/Table/TableContainer';
import { useSavingsPlan, useServiceId } from '@/hooks/useSavingsPlan';
import { SavingsPlanService } from '@/types';
import Loading from '@/components/Loading/Loading';

export interface ListingProps {
  data: SavingsPlanService[];
  refetchSavingsPlans: () => void;
}
const ListingTablePage: React.FC<ListingProps> = ({
  data,
  refetchSavingsPlans,
}) => {
  const { t } = useTranslation('listing');
  const hrefDashboard = useHref('');
  const serviceId = useServiceId();
  const mutationSPChangePeriod = useMutationState<{
    status: MutationStatus;
  }>({
    filters: { mutationKey: ['savings-plan', serviceId, 'change-period'] },
  });

  return (
    <>
      <Title>{t('title')}</Title>
      <div className="pt-5 pb-10">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          inline
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
      {mutationSPChangePeriod.length > 0 && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.success} className="my-2">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="inline-block"
          >
            {t('banner_renew_activate')}
          </OsdsText>
        </OsdsMessage>
      )}
      <TableContainer data={data} refetchSavingsPlans={refetchSavingsPlans} />
    </>
  );
};

const Listing: React.FC<ListingProps> = ({ refetchSavingsPlans }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: services, isLoading, isPending } = useSavingsPlan();

  useEffect(() => {
    if (!isLoading && !isPending && services.length === 0) {
      navigate(`/pci/projects/${projectId}/savings-plan/onboarding`);
    }
  }, [isLoading, isPending, services]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Outlet />
      {services?.length ? (
        <ListingTablePage
          data={services}
          refetchSavingsPlans={refetchSavingsPlans}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Listing;
