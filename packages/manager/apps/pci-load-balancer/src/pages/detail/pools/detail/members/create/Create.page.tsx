import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMemo, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_INPUT_TYPE, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useCreatePoolMembers } from '@/api/hook/usePoolMember';
import { TPoolMember } from '@/api/data/pool-member';
import LabelComponent from '@/components/form/Label.component';
import { REGEX } from '@/constants';

const PORT_MIN_VALUE = 1;
const PORT_MAX_VALUE = 65535;

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

  const [isAddressTouched, setIsAddressTouched] = useState(false);

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

  const addressIpErrorMessage = useMemo(() => {
    if (isAddressTouched) {
      if (!poolMember.address.trim()) {
        return tPciCommon('common_field_error_required');
      }
      if (!RegExp(REGEX.ip).test(poolMember.address)) {
        return tPciCommon('common_field_error_pattern');
      }
    }
    return '';
  }, [poolMember.address, isAddressTouched]);

  const protocolPortErrorMessage = useMemo(() => {
    if (Number.isNaN(poolMember.protocolPort)) {
      return tPciCommon('common_field_error_required');
    }

    if (poolMember.protocolPort < PORT_MIN_VALUE) {
      return tPciCommon('common_field_error_min', { min: PORT_MIN_VALUE });
    }

    if (poolMember.protocolPort > PORT_MAX_VALUE) {
      return tPciCommon('common_field_error_max', { max: PORT_MAX_VALUE });
    }

    return '';
  }, [poolMember.protocolPort]);

  const isFormValid =
    isAddressTouched && !protocolPortErrorMessage && !addressIpErrorMessage;

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
      isDisabled={!isFormValid}
    >
      <OsdsText
        level={ODS_TEXT_LEVEL.subheading}
        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {tCreate(
          'octavia_load_balancer_pools_detail_members_create_description',
        )}
      </OsdsText>
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
      <OsdsFormField className="mt-8" error={addressIpErrorMessage}>
        <LabelComponent
          text={tCreate(
            'octavia_load_balancer_pools_detail_members_create_address_ip_label',
          )}
          hasError={!!addressIpErrorMessage}
        />
        <OsdsInput
          value={poolMember.address}
          type={ODS_INPUT_TYPE.text}
          error={!!addressIpErrorMessage}
          onOdsValueChange={(event) => {
            setPoolMember((state) => ({
              ...state,
              address: event.detail.value.trim(),
            }));
          }}
          onOdsInputBlur={() => setIsAddressTouched(true)}
        />
      </OsdsFormField>
      <OsdsFormField className="mt-8" error={protocolPortErrorMessage}>
        <LabelComponent
          text={tCreate(
            'octavia_load_balancer_pools_detail_members_create_port_label',
          )}
          hasError={!!protocolPortErrorMessage}
        />
        <OsdsInput
          value={poolMember?.protocolPort}
          type={ODS_INPUT_TYPE.number}
          min={PORT_MIN_VALUE}
          max={PORT_MAX_VALUE}
          error={!!protocolPortErrorMessage}
          onOdsValueChange={(event) => {
            setPoolMember((state) => ({
              ...state,
              protocolPort: event.detail.value
                ? parseInt(event.detail.value, 10)
                : 0,
            }));
          }}
        />
      </OsdsFormField>
    </PciModal>
  );
}
