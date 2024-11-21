import { PciModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { OsdsFormField, OsdsInput } from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import LabelComponent from '@/components/form/Label.component';
import { useGetPool, useUpdatePool } from '@/api/hook/usePool';

export default function EditName() {
  const { addSuccess, addError } = useNotifications();
  const { t: tEditName } = useTranslation('pools/overview/edit-name');
  const navigate = useNavigate();
  const { projectId, region, poolId } = useParams();
  const { data: pool, isPending: isPendingPool } = useGetPool({
    projectId,
    region,
    poolId,
  });
  const { doUpdatePool, isPending: isPendingUpdatePool } = useUpdatePool({
    projectId,
    region,
    poolId,
    onSuccess: () => {
      addSuccess(
        <Translation ns="pools/overview">
          {(_t) =>
            _t('octavia_load_balancer_pools_detail_overview_edit_name_success')
          }
        </Translation>,
        false,
      );
      navigate('..');
    },
    onError: (cause: ApiError) => {
      addError(
        <Translation ns="load-balancer">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_global_error', {
                  message: (cause?.response?.data as { message: string })
                    ?.message,
                  requestId: cause.response?.headers['x-ovh-queryid'],
                }),
              }}
            ></span>
          )}
        </Translation>,
        true,
      );
      navigate('..');
    },
  });
  const [poolName, setPoolName] = useState(pool?.name);
  useEffect(() => {
    if (pool) {
      setPoolName(pool?.name);
    }
  }, [pool]);
  const onConfirm = () => {
    doUpdatePool({
      name: poolName,
      algorithm: pool?.algorithm,
      permanentSession: {
        isEnabled: pool.sessionPersistence.type !== 'disabled',
        cookieName: pool.sessionPersistence.cookieName,
        type: pool.sessionPersistence.type,
      },
    });
  };
  const isPending = isPendingPool || isPendingUpdatePool;
  return (
    <PciModal
      title={tEditName(
        'octavia_load_balancer_pools_detail_overview_edit_name_title',
      )}
      onCancel={() => navigate('..')}
      onClose={() => navigate('..')}
      submitText={tEditName(
        'octavia_load_balancer_pools_detail_overview_edit_name_confirm',
      )}
      cancelText={tEditName(
        'octavia_load_balancer_pools_detail_overview_edit_name_cancel',
      )}
      isPending={isPending}
      onConfirm={onConfirm}
    >
      <OsdsFormField>
        <LabelComponent
          text={tEditName(
            'octavia_load_balancer_pools_detail_overview_edit_name_label',
          )}
        />
        <OsdsInput
          value={poolName}
          type={ODS_INPUT_TYPE.text}
          onOdsValueChange={(event) => {
            setPoolName(event.detail.value);
          }}
        />
      </OsdsFormField>
    </PciModal>
  );
}
