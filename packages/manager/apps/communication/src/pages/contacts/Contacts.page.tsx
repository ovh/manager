import { useTranslation } from 'react-i18next';
import { OdsBadge, OdsMessage } from '@ovhcloud/ods-components/react';
import {
  ActionMenu,
  ActionMenuItem,
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
  ManagerButton,
  useResourcesIcebergV2,
} from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useAuthorization } from '@/hooks';
import { ContactMean } from '@/data/types/contact-mean.type';
import ContactMeanStatusChip from '@/components/contactMeanStatus/contactMeanStatus.component';
import { useAccountUrn } from '@/data';

function ContactMeanActionMenu({ contactMean }: { contactMean: ContactMean }) {
  const { t } = useTranslation('contacts');

  const items = [
    {
      id: 1,
      label: t('table_action_edit'),
      onClick: () => console.log('edit'),
    },
    contactMean.type !== 'EMAIL' &&
      contactMean.status === 'TO_VALIDATE' && {
        id: 2,
        label: t('table_action_enter_validation_code'),
        onClick: () => console.log('validation code'),
      },
    {
      id: 3,
      label: t('table_action_delete'),
      onClick: () => console.log('delete'),
    },
  ].filter(Boolean) as ActionMenuItem[];

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
    queryKey: ['/notification/contactMean'],
  });

  const isLoading = isLoadingContactMeans || isLoadingAuthorization;
  return (
    <>
      {!isLoading && !isAuthorized && (
        <OdsMessage
          color="warning"
          isDismissible={false}
          className="mb-8 w-full"
        >
          {tCommon('iam_display_content_message')}
        </OdsMessage>
      )}

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
            onClick={() => {}}
          />
        }
        totalItems={flattenData?.length || 0}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        manualSorting={true}
      />
    </>
  );
}

export default ContactsPage;
