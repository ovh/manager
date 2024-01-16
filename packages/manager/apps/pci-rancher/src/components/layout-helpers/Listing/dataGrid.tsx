import { OdsDatagridColumn } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsLink,
  OsdsDatagrid,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { createRoot } from 'react-dom/client';
import { RancherService } from '@/api/api.type';
import DeleteModal from '@/components/Modal/DeleteModal';
import ActionsCell from '../OdsCell/ActionsCell';
import { ProductStatusCell } from '../OdsCell/ProductStatusCell';
import { deleteRancherService, deleteRancherServiceQueryKey } from '@/api';

interface LinkServiceInterface {
  cellData?: string;
  onClick?: any;
}

interface DatagridWrapperInterface {
  data: RancherService[];
}

function LinkService({ cellData, onClick }: LinkServiceInterface) {
  return (
    <OsdsLink
      color={ODS_THEME_COLOR_INTENT.primary}
      onClick={() => {
        onClick(cellData);
      }}
    >
      {cellData}
    </OsdsLink>
  );
}

export default function DatagridWrapper({ data }: DatagridWrapperInterface) {
  const { t } = useTranslation('pci-rancher/listing');
  const { projectId } = useParams();
  const roots = new Map();

  const navigate = useNavigate();
  const [showDeleteModal, toggleDeleteModal] = useState(false);
  const [selectedRancher, setSelectedRancher] = useState<RancherService>();

  const { mutate: deleteRancher, isError } = useMutation({
    mutationFn: () =>
      deleteRancherService({
        rancherId: selectedRancher?.id,
        projectId,
      }),
    mutationKey: deleteRancherServiceQueryKey(selectedRancher?.id),
  });

  const reactFormatter = (jsx: any) => (
    cellData: any,
    rowData: any,
    cell: any,
    onRendered: any,
  ) => {
    const renderFn = () => {
      const cellEl = cell.getElement();
      if (cellEl) {
        const formatterCell = cellEl.querySelector('.formatterCell');
        if (formatterCell) {
          const CompWithMoreProps = React.cloneElement(jsx, {
            cellData,
            rowData,
          });

          let root = roots.get(formatterCell);
          if (!root) {
            root = createRoot(formatterCell);
            roots.set(formatterCell, root);
          }

          root.render(CompWithMoreProps);
        }
      }
    };

    onRendered(renderFn);

    setTimeout(() => {
      renderFn();
    }, 0);
    return '<div class="formatterCell"></div>';
  };

  const onDeleteRancher = () => deleteRancher();
  const location = useLocation();
  const columns: OdsDatagridColumn[] = [
    {
      title: t('name'),
      field: 'id',
      formatter: reactFormatter(
        <LinkService
          onClick={(cellData: string) => {
            navigate(`${location.pathname}/${cellData}`);
          }}
        />,
      ), // TODO: Find way to useHref cause hook not work in datagrid
    },
    {
      title: t('serviceLevel'),
      field: 'targetSpec.plan',
    },
    {
      title: t('rancherVersion'),
      field: 'targetSpec.version',
    },
    {
      title: t('numberOfCpu'),
      field: 'targetSpec.v' ?? '-', // TODO: Wait API to return cpu value
    },
    {
      title: t('status'),
      field: 'resourceStatus',
      formatter: reactFormatter(<ProductStatusCell t={t} />),
    },
    {
      title: t('actions'),
      field: '',
      formatter: reactFormatter(
        <ActionsCell
          openModal={() => toggleDeleteModal(true)}
          isLoading={false}
          setSelectedRancher={setSelectedRancher}
        />,
      ),
    },
  ];

  return (
    <>
      {isError && (
        <OsdsMessage color={ODS_THEME_COLOR_INTENT.error}>
          Une erreur est survenue lors de la suppression de votre service
          Rancher. Merci de réessayer.
        </OsdsMessage>
      )}
      {columns && data && data.length > 0 && (
        <OsdsDatagrid
          hasHideableColumns={undefined}
          height={500}
          columns={columns}
          rows={data as any}
          noResultLabel={t('emptyDataGridMessage')}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          toggleModal={toggleDeleteModal}
          onDeleteRancher={onDeleteRancher}
          selectedRancher={selectedRancher}
        />
      )}
    </>
  );
}
