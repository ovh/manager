import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import {
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import TableContainer from '@/components/Table/TableContainer';
import { useSavingsPlan } from '@/hooks/useSavingsPlan';
import { SavingsPlanService } from '@/types';
import TabsDashboard from '@/components/Dashboard/TabsDashboard/TabsDashboard';

import { CHANGELOG_LINKS } from '@/constants';
import Header from '@/components/Header/Header';

interface ListingTablePageProps {
  data: SavingsPlanService[];
  refetchSavingsPlans: () => void;
}
interface ListingProps {
  refetchSavingsPlans: () => void;
}

export const formatDateString = (dateString: string, locale?: string) => {
  const date = new Date(dateString);
  return date.toString() !== 'Invalid Date'
    ? date.toLocaleString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';
};

export const getMutationFilters = (filters: (string | number)[]) => ({
  filters: { mutationKey: filters },
});

const ListingTablePage: React.FC<ListingTablePageProps> = ({
  data,
  refetchSavingsPlans,
}) => {
  const { t } = useTranslation(['listing', 'dashboard']);
  const { trackClick } = useOvhTracking();

  const navigate = useNavigate();
  const { projectId } = useParams();
  const { clearNotifications } = useNotifications();

  const handleClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: ['add_savings_plan'],
    });
    clearNotifications();
    navigate(`/pci/projects/${projectId}/savings-plan/new`);
  };
  return (
    <>
      <Header title={t('title')} />
      {projectId && <TabsDashboard projectId={projectId} />}
      <div className="py-5">
        <OdsButton
          icon="plus"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.outline}
          onClick={handleClick}
          label={t('createSavingsPlan')}
        />
      </div>

      <Notifications />
      <TableContainer data={data} refetchSavingsPlans={refetchSavingsPlans} />
    </>
  );
};

const Listing: React.FC<ListingProps> = ({ refetchSavingsPlans }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: savingsPlan, isLoading, isPending } = useSavingsPlan();

  useEffect(() => {
    if (!isLoading && !isPending && savingsPlan?.length === 0) {
      navigate(`/pci/projects/${projectId}/savings-plan/onboarding`);
    }
  }, [isLoading, isPending, savingsPlan]);

  return (
    <>
      <Outlet />
      {savingsPlan?.length ? (
        <ListingTablePage
          data={savingsPlan}
          refetchSavingsPlans={refetchSavingsPlans}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Listing;
