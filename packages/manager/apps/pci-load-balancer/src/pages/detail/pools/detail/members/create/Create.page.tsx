import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMemo, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { OsdsFormField, OsdsInput } from '@ovhcloud/ods-components/react';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { useCreatePoolMembers } from '@/api/hook/usePoolMember';
import { TPoolMember } from '@/api/data/pool-member';
import LabelComponent from '@/components/form/Label.component';
import { REGEX } from '@/constants';

export default function CreatePage() {
  const { addSuccess, addError } = useNotifications();
  const { projectId, region, poolId } = useParams();
  const { t: tCreate } = useTranslation('pools/members/create');
  const { t: tPciCommon } = useTranslation('pci-common');
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };

  const [poolMember, setPoolMember] = useState<TPoolMember>({
    name: '',
    address: '',
    protocolPort: 9000,
  } as TPoolMember);
  const [isTouched, setIsTouched] = useState({
    address: false,
    protocolPort: false,
  });
  const {
    createPoolMembers,
    isPending: isPendingCreate,
  } = useCreatePoolMembers({
    projectId,
    region,
    poolId,
    onError(error: ApiError) {
      addError(
        <Translation ns="load-balancer">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_global_error', {
                  message: (error?.response?.data as { message: string })
                    ?.message,
                  requestId: error.response?.headers['x-ovh-queryid'],
                }),
              }}
            ></span>
          )}
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="pools/members">
          {(_t) =>
            _t('octavia_load_balancer_pools_detail_members_create_success')
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
  });
  const onConfirm = () => {
    createPoolMembers([poolMember]);
  };

  const onCancel = () => {
    navigate('..');
  };
  const errorMessageAddress = useMemo(() => {
    if (isTouched.address) {
      if (!poolMember.address.trim()) {
        return tPciCommon('common_field_error_required');
      }
      if (!RegExp(REGEX.ip).test(poolMember.address)) {
        return tPciCommon('common_field_error_pattern');
      }
    }
    return '';
  }, [poolMember.address, isTouched.address]);

  const errorMessageProtocolPort = useMemo(() => {
    if (isTouched.protocolPort) {
      if (!poolMember.protocolPort) {
        return tPciCommon('common_field_error_required');
      }
      if (!(poolMember.protocolPort >= 1 && poolMember.protocolPort <= 65535)) {
        return tPciCommon('common_field_error_max', { max: 65535 });
      }
    }
    return '';
  }, [poolMember.protocolPort, isTouched.protocolPort]);
  return (
    <PciModal
      onConfirm={onConfirm}
      onCancel={onCancel}
      onClose={onClose}
      isPending={isPendingCreate}
      cancelText={tCreate(
        'octavia_load_balancer_pools_detail_members_create_cancel',
      )}
      submitText={tCreate(
        'octavia_load_balancer_pools_detail_members_create_confirm',
      )}
      title={tCreate('octavia_load_balancer_pools_detail_members_create_title')}
    >
      <OsdsFormField className="mt-8">
        <LabelComponent
          text={tCreate(
            'octavia_load_balancer_pools_detail_members_create_name_label',
          )}
        />
        <OsdsInput
          value={poolMember.name}
          type={ODS_INPUT_TYPE.text}
          onOdsValueChange={(event) => {
            setPoolMember((state) => ({
              ...state,
              name: event.detail.value.trim(),
            }));
          }}
        />
      </OsdsFormField>
      <OsdsFormField className="mt-8" error={errorMessageAddress}>
        <LabelComponent
          text={tCreate(
            'octavia_load_balancer_pools_detail_members_create_address_ip_label',
          )}
          slot="label"
          hasError={!!errorMessageAddress}
        />
        <OsdsInput
          value={poolMember.address}
          type={ODS_INPUT_TYPE.text}
          error={!!errorMessageAddress}
          onOdsValueChange={(event) => {
            setPoolMember((state) => ({
              ...state,
              address: event.detail.value.trim(),
            }));
          }}
          onOdsInputBlur={() => {
            setIsTouched((state) => ({
              ...state,
              address: true,
            }));
          }}
        />
      </OsdsFormField>
      <OsdsFormField className="mt-8" error={errorMessageProtocolPort}>
        <LabelComponent
          text={tCreate(
            'octavia_load_balancer_pools_detail_members_create_port_label',
          )}
          slot="label"
          hasError={!!errorMessageProtocolPort}
        />
        <OsdsInput
          value={poolMember?.protocolPort}
          type={ODS_INPUT_TYPE.number}
          min={1}
          max={65535}
          error={!!errorMessageProtocolPort}
          onOdsValueChange={(event) => {
            setPoolMember((state) => ({
              ...state,
              protocolPort: event.detail.value
                ? parseInt(event.detail.value, 10)
                : 0,
            }));
          }}
          onOdsInputBlur={() => {
            setIsTouched((state) => ({
              ...state,
              protocolPort: true,
            }));
          }}
        />
      </OsdsFormField>
    </PciModal>
  );
}
