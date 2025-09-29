import { useTranslation } from 'react-i18next';
import { OdsBadge, OdsMessage } from '@ovhcloud/ods-components/react';
import {
  ActionMenu,
  ActionMenuItem,
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
  ManagerButton,
  Notifications,
  useNotifications,
  useResourcesIcebergV2,
} from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useAuthorization } from '@/hooks';
import { ContactMean } from '@/data/types/contact-mean.type';
import ContactMeanStatusChip from '@/components/contactMeanStatus/contactMeanStatus.component';
import { useAccountUrn } from '@/data';
import { urls } from '@/routes/routes.constant';
import {
  useDeleteContactMean,
  useChangeContactMeanStatus,
  useRestartValidationContactMean,
} from '@/data/hooks/useContactMean/useContactMean';
import { getContactMeanListQueryKey } from '@/data/api/contacts';
import {
  ContactMeanActions,
  displayActionMenuItem,
} from './contacts.constants';

function ContactMeanActionMenu({ contactMean }: { contactMean: ContactMean }) {
  const { t } = useTranslation(['contacts', NAMESPACES.ACTIONS, 'common']);
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { data: accountUrn } = useAccountUrn();
  const { mutate: deleteContactMean } = useDeleteContactMean({
    id: contactMean.id,
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('delete_contact_success_message'));
    },
    onError: () => {
      clearNotifications();
      addError(t('delete_contact_error_message'));
    },
  });
  const { mutate: disableContactMean } = useChangeContactMeanStatus({
    contactMeanId: contactMean.id,
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('deactivate_contact_success_message'));
    },
    onError: () => {
      clearNotifications();
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
          onClick: () => navigate(urls.ContactsEditTo(contactMean.id)),
          iamActions: ['account:apiovh:notification/contactMean/edit'],
          urn: accountUrn,
        },
        displayActionMenuItem(contactMean, ContactMeanActions.VALIDATE) && {
          id: 2,
          label: t('table_action_enter_verification_code'),
          onClick: () => navigate(urls.ContactsValidateTo(contactMean.id)),
          iamActions: ['account:apiovh:notification/contactMean/validate'],
          urn: accountUrn,
        },
        displayActionMenuItem(
          contactMean,
          ContactMeanActions.RESTART_VALIDATION,
        ) && {
          id: 3,
          label: t('table_action_resend_verification_code'),
          onClick: () => restartValidationContactMean(),
          iamActions: [
            'account:apiovh:notification/contactMean/restartValidation',
          ],
          urn: accountUrn,
        },
        displayActionMenuItem(contactMean, ContactMeanActions.DEACTIVATE) && {
          id: 4,
          label: t('table_action_deactivate'),
          onClick: () => disableContactMean('DISABLED'),
          iamActions: ['account:apiovh:notification/contactMean/edit'],
          urn: accountUrn,
        },
        displayActionMenuItem(contactMean, ContactMeanActions.ACTIVATE) && {
          id: 5,
          label: t('activate', { ns: NAMESPACES.ACTIONS }),
          onClick: () => disableContactMean('VALID'),
          iamActions: ['account:apiovh:notification/contactMean/edit'],
          urn: accountUrn,
        },
        {
          id: 6,
          label: t('delete', { ns: NAMESPACES.ACTIONS }),
          onClick: () => deleteContactMean(),
          iamActions: ['account:apiovh:notification/contactMean/delete'],
          urn: accountUrn,
        },
      ].filter(Boolean) as ActionMenuItem[],
    [t, contactMean],
  );

  return (
    <ActionMenu
      id={contactMean.id}
      items={items}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
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

  const columns: DatagridColumn<ContactMean>[] = [
    {
      id: 'description',
      label: t('table_column_description'),
      size: 400,
      isSortable: false,
      cell: ({ description, default: isDefault }) => (
        <DataGridTextCell className="truncate">
          {description || '-'}
          {isDefault && (
            <OdsBadge
              className="ml-5"
              label={t('default_badge_label')}
              color="information"
            />
          )}
        </DataGridTextCell>
      ),
    },
    {
      id: 'type',
      label: t('table_column_type'),
      isSortable: false,
      cell: ({ type }) => (
        <DataGridTextCell>{t(`type_${type.toLowerCase()}`)}</DataGridTextCell>
      ),
    },
    {
      id: 'contact-mean',
      isSortable: false,
      label: t('table_column_contact_mean'),
      /* TODO: replace with component once new contact means are defined */
      cell: (contactMean) => (
        <DataGridTextCell>{contactMean.email || '-'}</DataGridTextCell>
      ),
    },
    {
      id: 'status',
      label: t('table_column_status'),
      size: 120,
      isSortable: false,
      cell: ({ status }) => (
        <DataGridTextCell>
          <ContactMeanStatusChip status={status} />
        </DataGridTextCell>
      ),
    },
    {
      id: 'actions',
      label: '',
      size: 80,
      isSortable: false,
      cell: (contactMean) => (
        <div className="flex flex-row justify-center">
          {!contactMean.default && (
            <ContactMeanActionMenu contactMean={contactMean} />
          )}
        </div>
      ),
    },
  ];

  const {
    flattenData,
    sorting,
    setSorting,
    isLoading: isLoadingContactMeans,
    hasNextPage,
    fetchNextPage,
  } = useResourcesIcebergV2<ContactMean>({
    columns,
    route: '/notification/contactMean',
    queryKey: getContactMeanListQueryKey(),
    enabled: isAuthorized,
  });

  const isLoading = isLoadingContactMeans || isLoadingAuthorization;
  return (
    <div className="flex flex-col gap-4">
      {!isLoading && !isAuthorized && (
        <OdsMessage color="warning" isDismissible={false} className="w-full">
          {tCommon('iam_display_content_message')}
        </OdsMessage>
      )}

      <Notifications clearAfterRead />

      <Datagrid
        items={flattenData}
        columns={columns}
        sorting={sorting}
        onSortChange={setSorting}
        isLoading={isLoading}
        tableLayoutFixed={true}
        topbar={
          <ManagerButton
            id="add-contact-button"
            iamActions={['account:apiovh:notification/contactMean/create']}
            urn={accountUrn}
            icon="plus"
            label={t('add_contact_button')}
            aria-label={t('add_contact_button')}
            size="sm"
            onClick={() => navigate(urls.contactsAdd)}
          />
        }
        totalItems={flattenData?.length || 0}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        manualSorting={true}
      />

      <Outlet />
    </div>
  );
}

export default ContactsPage;
