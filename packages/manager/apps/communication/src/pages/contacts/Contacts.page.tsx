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

function ContactMeanActionMenu({ contactMean }: { contactMean: ContactMean }) {
  const { t } = useTranslation(['contacts', NAMESPACES.ACTIONS]);
  const { addSuccess, addError } = useNotifications();
  const { data: accountUrn } = useAccountUrn();
  const { mutate: deleteContactMean } = useDeleteContactMean({
    id: contactMean.id,
    onSuccess: () => {
      addSuccess(t('delete_contact_success_message'));
    },
    onError: () => {
      addError(t('delete_contact_error_message'));
    },
  });
  const { mutate: disableContactMean } = useChangeContactMeanStatus({
    contactMeanId: contactMean.id,
    onSuccess: () => {
      addSuccess(t('deactivate_contact_success_message'));
    },
    onError: () => {
      addError(t('deactivate_contact_error_message'));
    },
  });

  const {
    mutate: restartValidationContactMean,
  } = useRestartValidationContactMean({
    contactMeanId: contactMean.id,
    onSuccess: () => {
      addSuccess(t('restart_validation_contact_success_message'));
    },
    onError: () => {
      addError(t('restart_validation_contact_error_message'));
    },
  });
  const navigate = useNavigate();

  const items = useMemo(
    () =>
      [
        contactMean.status === 'VALID' && {
          id: 1,
          label: t('table_action_edit'),
          onClick: () => navigate(urls.ContactsEditTo(contactMean.id)),
          iamActions: ['account:apiovh:notification/contactMean/edit'],
          urn: accountUrn,
          isDisabled: contactMean.default,
        },
        contactMean.status === 'TO_VALIDATE' && {
          id: 2,
          label: t('table_action_enter_verification_code'),
          onClick: () => navigate(urls.ContactsValidateTo(contactMean.id)),
          iamActions: ['account:apiovh:notification/contactMean/validate'],
          urn: accountUrn,
        },
        contactMean.type === 'EMAIL' &&
          contactMean.status === 'TO_VALIDATE' && {
            id: 3,
            label: t('table_action_resend_verification_code'),
            onClick: () => restartValidationContactMean(),
            iamActions: [
              'account:apiovh:notification/contactMean/restartValidation',
            ],
            urn: accountUrn,
          },
        contactMean.status === 'VALID' && {
          id: 4,
          label: t('table_action_deactivate'),
          onClick: () => disableContactMean('DISABLED'),
          iamActions: ['account:apiovh:notification/contactMean/edit'],
          urn: accountUrn,
          isDisabled: contactMean.default,
        },
        contactMean.status === 'DISABLED' && {
          id: 5,
          label: t('activate', { ns: NAMESPACES.ACTIONS }),
          onClick: () => disableContactMean('VALID'),
          iamActions: ['account:apiovh:notification/contactMean/edit'],
          urn: accountUrn,
          isDisabled: contactMean.default,
        },
        {
          id: 6,
          label: t('delete', { ns: NAMESPACES.ACTIONS }),
          onClick: () => deleteContactMean(),
          iamActions: ['account:apiovh:notification/contactMean/delete'],
          urn: accountUrn,
          isDisabled: contactMean.default,
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
      cell: ({ description, default: isDefault }) => (
        <DataGridTextCell>
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
      cell: ({ type }) => (
        <DataGridTextCell>{t(`type_${type.toLowerCase()}`)}</DataGridTextCell>
      ),
    },
    {
      id: 'contact-mean',
      label: t('table_column_contact_mean'),
      /* TODO: replace with component once new contact means are defined */
      cell: (contactMean) => (
        <DataGridTextCell>{contactMean.email || '-'}</DataGridTextCell>
      ),
    },
    {
      id: 'status',
      label: t('table_column_status'),
      cell: ({ status }) => (
        <DataGridTextCell>
          <ContactMeanStatusChip status={status} />
        </DataGridTextCell>
      ),
    },
    {
      id: 'actions',
      label: '',
      cell: (contactMean) => (
        <div className="flex flex-row justify-center">
          <ContactMeanActionMenu contactMean={contactMean} />
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
