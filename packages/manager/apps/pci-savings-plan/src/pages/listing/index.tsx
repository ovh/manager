import React, { useEffect, useState } from 'react';
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

import { Title } from '@ovh-ux/manager-react-components';

import TableContainer from '@/components/Table/TableContainer';
import {
  getMutationKeyCreateSavingsPlan,
  useSavingsPlan,
  useServiceId,
} from '@/hooks/useSavingsPlan';
import { SavingsPlanService } from '@/types';
import { formatDate } from '../../utils/formatter/date';

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

const Banner = ({ message }: { message: string }) => {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (message) {
      setShowBanner(true);
    }
  }, [message]);
  return (
    showBanner && (
      <OsdsMessage
        type={ODS_MESSAGE_TYPE.success}
        className="my-4"
        removable
        onOdsRemoveClick={() => setShowBanner(false)}
      >
        <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="inline-block">
          {message}
        </OsdsText>
      </OsdsMessage>
    )
  );
};

export interface ListingProps {
  data: SavingsPlanService[];
  refetchSavingsPlans: () => void;
}

type MutationInfo<Data = void> = {
  submittedAt: number;
  error?: {
    code: string;
  };
  status: MutationStatus;
  data?: Data;
};

const getMutationFilters = (filters: (string | number)[]) => ({
  filters: { mutationKey: filters },
});

const ListingTablePage: React.FC<ListingProps> = ({
  data,
  refetchSavingsPlans,
}) => {
  const { t } = useTranslation('listing');

  const hrefDashboard = useHref('');
  const serviceId = useServiceId();
  const mutationSPChangePeriod = useMutationState<
    MutationInfo<SavingsPlanService> & {
      variables: {
        periodEndAction: 'REACTIVATE' | 'ACTIVATE';
      };
    }
  >(getMutationFilters(['savings-plan', serviceId, 'change-period']));

  const mutationSPEditName = useMutationState<MutationInfo>(
    getMutationFilters(['savings-plan', serviceId, 'edit-name']),
  );

  const mutationSpCreate = useMutationState<MutationInfo<SavingsPlanService>>(
    getMutationFilters(getMutationKeyCreateSavingsPlan(serviceId)),
  );

  const lastMutationEditName =
    mutationSPEditName[mutationSPEditName.length - 1];
  const lastMutationChangePeriod =
    mutationSPChangePeriod[mutationSPChangePeriod.length - 1];
  const lastMutationSpCreate = mutationSpCreate[mutationSpCreate.length - 1];

  const renewBannerMessage = t(
    lastMutationChangePeriod?.variables.periodEndAction === 'REACTIVATE'
      ? 'banner_renew_activate'
      : 'banner_renew_deactivate',
    {
      planName: lastMutationChangePeriod?.data?.displayName,
      endDate: lastMutationChangePeriod?.data?.endDate,
    },
  );

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
        <Banner
          message={renewBannerMessage}
          key={lastMutationChangePeriod.submittedAt}
        />
      )}
      {mutationSpCreate.length > 0 && !lastMutationSpCreate.error?.code && (
        <Banner
          message={t('banner_create_sp', {
            startDate: lastMutationSpCreate.data.startDate,
          })}
          key={lastMutationSpCreate.submittedAt}
        />
      )}
      {mutationSPEditName.length > 0 && (
        <Banner
          message={t('banner_edit_name')}
          key={lastMutationEditName.submittedAt}
        />
      )}
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
