import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Datagrid,
  DataGridTextCell,
  ManagerButton,
} from '@ovh-ux/manager-react-components';
import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { subRoutes } from '@/routes/routes.constant';
import TEST_IDS from '@/utils/testIds.constants';
import { iamActions } from '@/utils/iam.constants';
import { VcdaWhitelistEntry } from '@ovh-ux/manager-module-vcd-api';
import { useMigrationContext } from '../Migration.context';

export default function WhitelistSection() {
  const { t } = useTranslation('migration');
  const navigate = useNavigate();
  const {
    whitelist,
    isPending,
    isError,
    isEditable,
    organisationUrn,
    refetch,
  } = useMigrationContext();

  const columns = [
    {
      id: 'ip',
      label: t('migration.column.ip'),
      cell: (row: VcdaWhitelistEntry) => (
        <DataGridTextCell>{`${row.ip}/32`}</DataGridTextCell>
      ),
    },
    {
      id: 'actions',
      label: '',
      cell: (row: VcdaWhitelistEntry) => (
        <div className="flex justify-end">
          <ManagerButton
            id={`migration-delete-${row.ip}`}
            label=""
            iamActions={[iamActions.vmwareCloudDirectorApiovhMigrationEdit]}
            urn={organisationUrn}
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_BUTTON_COLOR.critical}
            icon={ODS_ICON_NAME.trash}
            isDisabled={!isEditable}
            aria-label={t('migration.column.action.delete.ariaLabel', {
              cidr: `${row.ip}/32`,
            })}
            data-testid={`${TEST_IDS.migrationDeleteCta}-${row.ip}`}
            onClick={() =>
              navigate(
                `${subRoutes.migrationDeleteIp}?ip=${encodeURIComponent(
                  row.ip,
                )}`,
              )
            }
          />
        </div>
      ),
    },
  ];

  return (
    <section
      aria-labelledby="vcda-whitelist-heading"
      aria-busy={isPending}
      className="px-10 mt-8"
    >
      <OdsText id="vcda-whitelist-heading" preset="heading-2">
        {t('migration.section.title')}
      </OdsText>

      <div className="w-fit mt-4 mb-6">
        <ManagerButton
          id="migration-add-cta"
          iamActions={[iamActions.vmwareCloudDirectorApiovhMigrationEdit]}
          urn={organisationUrn}
          label={t('migration.cta.add')}
          isDisabled={!isEditable}
          data-testid={TEST_IDS.migrationAddCta}
          onClick={() => navigate(subRoutes.migrationAddIp)}
        />
      </div>

      {isError ? (
        <div className="flex flex-col gap-3 max-w-[640px]">
          <OdsMessage color="critical" isDismissible={false}>
            {t('migration.error.fetch')}
          </OdsMessage>
          <OdsButton
            variant={ODS_BUTTON_VARIANT.outline}
            label={t('migration.error.retry')}
            data-testid={TEST_IDS.migrationRetryCta}
            onClick={() => refetch()}
          />
        </div>
      ) : (
        <>
          {!isPending && whitelist.length === 0 ? (
            <OdsText preset="paragraph" className="block max-w-[640px]">
              {t('migration.empty.message')}
            </OdsText>
          ) : (
            <Datagrid
              columns={columns}
              items={whitelist}
              totalItems={whitelist.length}
              manualSorting={false}
              isLoading={isPending}
            />
          )}
        </>
      )}
    </section>
  );
}
