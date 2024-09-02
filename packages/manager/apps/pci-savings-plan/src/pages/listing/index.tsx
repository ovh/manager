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
import i18next from 'i18next';

import { Title } from '@ovhcloud/manager-components';

import TableContainer from '@/components/Table/TableContainer';
import {
  getMutationKeyCreateSavingsPlan,
  useSavingsPlan,
  useServiceId,
} from '@/hooks/useSavingsPlan';
import { SavingsPlanService } from '@/types';

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

const Banner = ({ message }: { message: string }) => (
  <OsdsMessage type={ODS_MESSAGE_TYPE.success} className="my-4">
    <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="inline-block">
      {message}
    </OsdsText>
  </OsdsMessage>
);

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
    variables: {
      periodEndAction: 'REACTIVATE' | 'ACTIVATE';
    };
  }>({
    filters: { mutationKey: ['savings-plan', serviceId, 'change-period'] },
  });

  const mutationSPEditName = useMutationState<{
    status: MutationStatus;
  }>({
    filters: { mutationKey: ['savings-plan', serviceId, 'edit-name'] },
  });
  const lastMutation =
    mutationSPChangePeriod[mutationSPChangePeriod.length - 1];

  const mutationSpCreate = useMutationState<{
    status: MutationStatus;
    error?: {
      code: string;
    };
  }>({
    filters: { mutationKey: getMutationKeyCreateSavingsPlan(serviceId) },
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
        <Banner
          message={
            lastMutation?.variables.periodEndAction === 'REACTIVATE'
              ? t('banner_renew_activate')
              : t('banner_renew_deactivate')
          }
        />
      )}
      {mutationSpCreate.length > 0 && !mutationSpCreate[0].error.code && (
        <Banner
          message={t('banner_create_sp', {
            startDate: formatDateString(
              new Date(
                new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
                  0,
                  0,
                  0,
                  0,
                ),
              ).toISOString(),
              i18next.language.replace('_', '-'),
            ),
          })}
        />
      )}
      {mutationSPEditName.length > 0 && (
        <Banner message={t('banner_edit_name')} />
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
    if (!isLoading && !isPending && services?.length === 0) {
      navigate(`/pci/projects/${projectId}/savings-plan/onboarding`);
    }
  }, [isLoading, isPending, services]);

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
