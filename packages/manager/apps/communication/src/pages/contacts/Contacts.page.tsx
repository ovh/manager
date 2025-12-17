import { useTranslation } from 'react-i18next';
import {
  ActionMenu,
  ActionMenuItemProps,
  Datagrid,
  DatagridColumn,
  Button as ManagerButton,
  Notifications,
  useNotifications,
  useDataApi,
} from '@ovh-ux/muk';
import { Badge, BUTTON_VARIANT, Icon, Message, Text } from '@ovhcloud/ods-react';
import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ButtonType,
  PageLocation,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { useAuthorization } from '@/hooks';
import { ContactMean, ContactMeanStatus } from '@/data/types/contact-mean.type';
import ContactMeanStatusChip from '@/components/contact/contactMeanStatus/contactMeanStatus.component';
import { useAccountUrn } from '@/data';
import { urls } from '@/routes/routes.constant';
import {
  useChangeContactMeanStatus,
  useRestartValidationContactMean,
} from '@/data/hooks/useContactMean/useContactMean';
import { getContactMeanListQueryKey } from '@/data/api/contacts';
import {
  ContactMeanActions,
  displayActionMenuItem,
} from './contacts.constants';
import { useTracking } from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';

function ContactMeanActionMenu({ contactMean }: { contactMean: ContactMean }) {
  const { t } = useTranslation(['contacts', NAMESPACES.ACTIONS, 'common']);
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { data: accountUrn } = useAccountUrn();
  const { trackPage, trackClick } = useTracking();

  const trackDatagridActionClick = (actions: string[]) =>
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions,
      subApp: TrackingSubApps.Contacts,
    });

  const { mutate: disableContactMean } = useChangeContactMeanStatus({
    contactMeanId: contactMean.id,
    onSuccess: ({ status }) => {
      clearNotifications();
      const isActive = status === 'VALID';
      const pageName = isActive
        ? 'activate_contact_success'
        : 'deactivate_contact_success';
      const message = isActive
        ? 'activate_contact_success_message'
        : 'deactivate_contact_success_message';

      trackPage({
        pageType: PageType.bannerSuccess,
        pageName,
        subApp: TrackingSubApps.Contacts,
      });
      addSuccess(t(message));
    },
    onError: () => {
      clearNotifications();
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'deactivate_activate_contact_error',
        subApp: TrackingSubApps.Contacts,
      });
      addError(t('deactivate_contact_error_message'));
    },
  });

  const {
    mutate: restartValidationContactMean,
  } = useRestartValidationContactMean({
    contactMeanId: contactMean.id,
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('restart_validation_contact_success_message'));
    },
    onError: (error) => {
      clearNotifications();
      if (error.response?.status === 429) {
        addError(t('error_rate_limit_message', { ns: 'common' }));
      } else {
        addError(t('restart_validation_contact_error_message'));
      }
    },
  });
  const navigate = useNavigate();

  const items = useMemo(
    () =>
      [
        displayActionMenuItem(contactMean, ContactMeanActions.EDIT) && {
          id: 1,
          label: t('table_action_edit'),
          onClick: () => {
            trackDatagridActionClick(['rename_contact']);
            navigate(urls.contact.editTo(contactMean.id));
          },
          iamActions: ['account:apiovh:notification/contactMean/edit'],
          urn: accountUrn,
        },
        displayActionMenuItem(contactMean, ContactMeanActions.VALIDATE) && {
          id: 2,
          label: t('table_action_enter_verification_code'),
          onClick: () => {
            trackDatagridActionClick(['enter_validation_code']);
            navigate(urls.contact.validateTo(contactMean.id));
          },
          iamActions: ['account:apiovh:notification/contactMean/validate'],
          urn: accountUrn,
        },
        displayActionMenuItem(
          contactMean,
          ContactMeanActions.RESTART_VALIDATION,
        ) && {
          id: 3,
          label: t('table_action_resend_verification_code'),
          onClick: () => {
            trackDatagridActionClick(['resend_validation_code']);
            return restartValidationContactMean();
          },
          iamActions: [
            'account:apiovh:notification/contactMean/restartValidation',
          ],
          urn: accountUrn,
        },
        displayActionMenuItem(contactMean, ContactMeanActions.DEACTIVATE) && {
          id: 4,
          label: t('table_action_deactivate'),
          onClick: () => {
            trackDatagridActionClick(['deactivate_contact']);
            disableContactMean(ContactMeanStatus.DISABLED);
          },
          iamActions: ['account:apiovh:notification/contactMean/edit'],
          urn: accountUrn,
        },
        displayActionMenuItem(contactMean, ContactMeanActions.ACTIVATE) && {
          id: 5,
          label: t('activate', { ns: NAMESPACES.ACTIONS }),
          onClick: () => {
            trackDatagridActionClick(['activate_contact']);
            disableContactMean(ContactMeanStatus.VALID);
          },
          iamActions: ['account:apiovh:notification/contactMean/edit'],
          urn: accountUrn,
        },
        {
          id: 6,
          label: t('delete', { ns: NAMESPACES.ACTIONS }),
          onClick: () => {
            trackDatagridActionClick(['delete_contact']);
            navigate(urls.contact.deleteTo(contactMean.id));
          },
          iamActions: ['account:apiovh:notification/contactMean/delete'],
          urn: accountUrn,
        },
      ].filter(Boolean) as ActionMenuItemProps[],
    [t, contactMean],
  );

  return (
    <ActionMenu
      id={contactMean.id}
      items={items}
      isCompact
      variant={BUTTON_VARIANT.ghost}
    />
  );
}

function ContactsPage() {
  const { t } = useTranslation('contacts');
  const { t: tCommon } = useTranslation('common');
  const { data: accountUrn } = useAccountUrn();
  const navigate = useNavigate();
  const { isAuthorized, isLoading: isLoadingAuthorization } = useAuthorization([
    'account:apiovh:notification/contactMean/get',
  ]);
  const { trackClick } = useTracking();

  const columns: DatagridColumn<ContactMean>[] = [
    {
      id: 'description',
      label: t('table_column_description'),
      header: t('table_column_description'),
      size: 400,
      isSortable: false,
      cell: ({ row }) => (
        <Text className="truncate">
          {row.original.description || '-'}
          {row.original.default && (
            <Badge
              className="ml-5"
              color="information"
            >
              {t('default_badge_label')}
            </Badge>
          )}
        </Text>
      ),
    },
    {
      id: 'type',
      label: t('table_column_type'),
      header: t('table_column_type'),
      isSortable: false,
      cell: ({ row }) => (
        <Text>{t(`type_${row.original.type.toLowerCase()}`)}</Text>
      ),
    },
    {
      id: 'contact-mean',
      label: t('table_column_contact_mean'),
      header: t('table_column_contact_mean'),
      isSortable: false,
      /* TODO: replace with component once new contact means are defined */
      cell: ({ row }) => (
        <Text>{row.original.email || '-'}</Text>
      ),
    },
    {
      id: 'status',
      label: t('table_column_status'),
      header: t('table_column_status'),
      size: 120,
      isSortable: false,
      cell: ({ row }) => (
        <Text>
          <ContactMeanStatusChip status={row.original.status} />
        </Text>
      ),
    },
    {
      id: 'actions',
      size: 80,
      isSortable: false,
      cell: ({ row }) => (
        <div className="flex flex-row justify-center">
          {!row.original.default && (
            <ContactMeanActionMenu contactMean={row.original} />
          )}
        </div>
      ),
    },
  ];

  const {
    flattenData,
    sorting,
    isLoading: isLoadingContactMeans,
    hasNextPage,
    fetchNextPage,
  } = useDataApi<ContactMean>({
    version: 'v2',
    iceberg: true,
    columns,
    route: '/notification/contactMean',
    cacheKey: getContactMeanListQueryKey(),
    enabled: isAuthorized,
  });

  const isLoading = isLoadingContactMeans || isLoadingAuthorization;
  return (
    <div className="flex flex-col gap-4">
      {!isLoading && !isAuthorized && (
        <Message color="warning" dismissible={false} className="w-full">
          {tCommon('iam_display_content_message')}
        </Message>
      )}

      <Notifications clearAfterRead />

      <Datagrid<ContactMean>
        data={flattenData || []}
        columns={columns}
        isLoading={isLoading}
        topbar={
          <ManagerButton
            id="add-contact-button"
            iamActions={['account:apiovh:notification/contactMean/create']}
            urn={accountUrn}
            aria-label={t('add_contact_button')}
            size="sm"
            onClick={() => {
              trackClick({
                location: PageLocation.page,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['add_contact'],
                subApp: TrackingSubApps.Contacts,
              });
              navigate(urls.contact.create);
            }}
          >
            <span className="flex items-center gap-2">
              <Icon name="plus" />
              {t('add_contact_button')}
            </span>
          </ManagerButton>
        }
        totalCount={flattenData?.length || 0}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        sorting={sorting}
      />

      <Outlet />
    </div>
  );
}

export default ContactsPage;
