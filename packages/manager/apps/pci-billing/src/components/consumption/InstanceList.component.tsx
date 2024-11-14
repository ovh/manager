import {
  TCatalog,
  TImage,
  TInstance as TProjectInstance,
  useCatalog,
  useImages,
  useInstances,
} from '@ovh-ux/manager-pci-common';
import {
  Datagrid,
  DataGridTextCell,
  DateFormat,
  useDataGrid,
  useFormattedDate,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { TInstance } from '@/api/hook/useConsumption';
import { paginateResults } from '@/api/data/consumption';
import InstanceDetailPopover from './InstanceDetailPopover.component';

export type TInstanceConsumptionDetail = {
  instanceId: string;
  instanceName: string;
  total: string;
  region: string;
  reference: string;
  imageType: string;
  vmType: string;
  isDeleted: boolean;
  monthlyBilling?: {
    since: string;
    status: string;
  };
  planCode?: string;
  monthlyPlan: string[];
};

type InstanceListProps = {
  billingInstances: TInstance[];
  colNameLabel: string;
  colTotalLabel: string;
  showAdditionalInstanceDetails?: boolean;
  isMonthlyInstances?: boolean;
};

export default function InstanceList({
  billingInstances,
  colNameLabel,
  colTotalLabel,
  showAdditionalInstanceDetails = false,
  isMonthlyInstances = false,
}: Readonly<InstanceListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/instance');

  const { currency } = useContext(ShellContext).environment.getUser();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { pagination, setPagination } = useDataGrid();

  const [instanceConsumptionDetails, setInstanceConsumptionDetails] = useState({
    rows: [],
    totalRows: 0,
    pageCount: 0,
  });

  const { data: allInstances, isPending: allInstancesPending } = useInstances(
    projectId,
  );
  const { data: allImages, isPending: allImagesPending } = useImages(projectId);
  const { data: projectCatalog, isPending: catalogPending } = useCatalog();

  const windowsStringPattern = '/^win-/';

  const getImageTypeFromReference = (reference: TInstance['reference']) => {
    if (reference) {
      return /^win/.test(reference) ? 'windows' : 'linux';
    }
    return '';
  };

  const getInstanceConsumptionDetails = (
    billingDetail: TInstance,
    instances: TProjectInstance[],
    images: TImage[],
    catalog: TCatalog,
  ) => {
    const instanceConsumptionDetail: Partial<TInstanceConsumptionDetail> = {
      instanceId: billingDetail.instanceId,
      instanceName: billingDetail.instanceId,
      total: `${billingDetail.totalPrice.toFixed(2)} ${currency.symbol}`,
      region: billingDetail.region,
      reference: billingDetail.reference,
      imageType: getImageTypeFromReference(billingDetail.reference),
      vmType: billingDetail.reference
        ? billingDetail.reference
            .replace(windowsStringPattern, '')
            .toUpperCase()
        : '',
      monthlyPlan: catalog?.addons.find((addon) =>
        addon.planCode.match(`${billingDetail.reference}.monthly`),
      )?.blobs?.tags,
    };

    const instance = instances.find(
      (instanceItem) => instanceItem.id === billingDetail.instanceId,
    );

    if (instance) {
      instanceConsumptionDetail.isDeleted = false;
      instanceConsumptionDetail.instanceName = instance.name;
      instanceConsumptionDetail.monthlyBilling = instance.monthlyBilling;

      // Handle gen3 resized message
      if (
        !instanceConsumptionDetail.monthlyBilling &&
        billingDetail.activation
      ) {
        instanceConsumptionDetail.monthlyBilling = {
          since: billingDetail.activation,
          status: 'resized',
        };
      }

      instanceConsumptionDetail.planCode = instance.planCode;

      const imageData = images.find(
        (imageItem) => imageItem.id === instance.imageId,
      );

      if (imageData) {
        instanceConsumptionDetail.imageType = imageData.type;
      }
    } else {
      instanceConsumptionDetail.isDeleted = true;
    }

    return instanceConsumptionDetail;
  };

  // TO DISPLAY CONFIRM MONTHLY PAYMENT BUTTON
  const displayUpdateToMonthlyBillingButton = (
    instanceConsumption: TInstanceConsumptionDetail,
  ) =>
    !isMonthlyInstances &&
    instanceConsumption.monthlyBilling === null &&
    !instanceConsumption.isDeleted &&
    instanceConsumption.monthlyPlan;

  useEffect(() => {
    if (billingInstances && allInstances && allImages && projectCatalog) {
      const result = billingInstances.map((billingDetail) =>
        getInstanceConsumptionDetails(
          billingDetail,
          allInstances,
          allImages,
          projectCatalog,
        ),
      );

      const sortedInstances = result?.sort((a, b) =>
        a.instanceName.localeCompare(b.instanceName),
      );

      setInstanceConsumptionDetails(
        paginateResults(sortedInstances || [], pagination),
      );
    }
  }, [
    billingInstances,
    allInstances,
    allImages,
    projectCatalog,
    pagination,
    setPagination,
  ]);

  const columns = [
    {
      id: 'name',
      cell: (row: TInstanceConsumptionDetail) => (
        <OsdsPopover>
          <div slot="popover-trigger" className="cursor-pointer">
            {row?.instanceName}
          </div>
          <OsdsPopoverContent>
            <InstanceDetailPopover row={row} />
          </OsdsPopoverContent>
        </OsdsPopover>
      ),
      label: colNameLabel,
    },
    {
      id: 'consumption',
      cell: (row: TInstanceConsumptionDetail) => (
        <div>
          <DataGridTextCell>{row.total}</DataGridTextCell>
        </div>
      ),
      label: colTotalLabel,
    },
    (!isMonthlyInstances || showAdditionalInstanceDetails) && {
      id: 'action',
      cell: (row: TInstanceConsumptionDetail) => (
        <div className="min-w-[16rem]">
          {['ok', 'resized'].includes(row.monthlyBilling?.status) && (
            <DataGridTextCell>
              {t('cpbc_hourly_instance_monthly_billing_since', {
                since: useFormattedDate({
                  dateString: row.monthlyBilling.since,
                  format: DateFormat.compact,
                }),
              })}
            </DataGridTextCell>
          )}
          {row.monthlyBilling?.status === 'activationPending' && (
            <DataGridTextCell>
              {t('cpbc_hourly_instance_monthly_billing_activationPending')}
            </DataGridTextCell>
          )}
          {!row.monthlyBilling && row.isDeleted && (
            <DataGridTextCell className="opacity-50">
              {t('cpbc_hourly_instance_deleted')}
            </DataGridTextCell>
          )}

          {displayUpdateToMonthlyBillingButton(row) && (
            <OsdsButton
              color={ODS_THEME_COLOR_INTENT.primary}
              type={ODS_BUTTON_TYPE.button}
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.stroked}
              onClick={() => navigate(`./monthly?instanceId=${row.instanceId}`)}
            >
              {t('cpbc_hourly_instance_pass_to_monthly')}
            </OsdsButton>
          )}
        </div>
      ),
      label: '',
    },
  ].filter(Boolean);

  const isPending = allInstancesPending || allImagesPending || catalogPending;

  if (isPending) {
    return (
      <div className="flex justify-center">
        <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline />
      </div>
    );
  }

  if (!isPending && instanceConsumptionDetails.totalRows === 0) {
    return (
      <div className="my-3">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          className="mb-5"
        >
          {t('cpbc_no_consumption_data')}
        </OsdsText>
      </div>
    );
  }

  return (
    <div className="my-3">
      <Datagrid
        columns={columns}
        items={instanceConsumptionDetails.rows}
        totalItems={instanceConsumptionDetails.totalRows}
        pagination={pagination}
        onPaginationChange={setPagination}
        className="overflow-x-visible"
      />
    </div>
  );
}
