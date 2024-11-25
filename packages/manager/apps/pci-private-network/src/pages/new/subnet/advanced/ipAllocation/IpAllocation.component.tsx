import { useTranslation } from 'react-i18next';
import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsIcon,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  IpAllocationForm,
  NewPrivateNetworkForm,
} from '@/types/private-network-form.type';
import { IP_ALLOCATION_SCHEMA } from './ipAllocation.constant';

const IpAllocation: React.FC = () => {
  const { t } = useTranslation('new');
  const {
    setValue: setAllocationIp,
    watch: watchAllocationIp,
    reset,
    formState: { errors, touchedFields, isValid: isAllocationIpValid },
  } = useForm<IpAllocationForm>({
    defaultValues: {
      ipStart: '',
      ipEnd: '',
    },
    resolver: zodResolver(IP_ALLOCATION_SCHEMA),
  });
  const { ipStart: start, ipEnd: end } = watchAllocationIp();
  const { setValue, watch } = useFormContext<NewPrivateNetworkForm>();
  const allocationPools = watch('subnet.allocationPooles') || [];

  const isIpStartHasError = touchedFields.ipStart && !!errors.ipStart;
  const isIpEndHasError = touchedFields.ipEnd && !!errors.ipEnd;

  const onAddAllocationIp = () => {
    setValue('subnet.allocationPooles', [...allocationPools, { start, end }]);
    reset();
  };

  return (
    <>
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_TEXT_COLOR_INTENT.primary}
        hue={ODS_TEXT_COLOR_HUE._800}
        size={ODS_TEXT_SIZE._200}
      >
        {t('pci_projects_project_network_private_allocation_ip')}
      </OsdsText>
      <div className="flex">
        <OsdsFormField>
          <OsdsText color={ODS_TEXT_COLOR_INTENT.text} slot="label">
            {t('pci_projects_project_network_private_allocation_ip_start')}
          </OsdsText>

          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            color={
              isIpStartHasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.primary
            }
            value={start}
            placeholder="1.0.0.0"
            onOdsValueChange={({ target }) =>
              setAllocationIp('ipStart', target.value as string, {
                shouldValidate: true,
                shouldTouch: true,
              })
            }
            error={isIpStartHasError}
          />
        </OsdsFormField>
        <OsdsFormField className="ml-5">
          <OsdsText color={ODS_TEXT_COLOR_INTENT.text} slot="label">
            {t('pci_projects_project_network_private_allocation_ip_end')}
          </OsdsText>

          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            color={
              isIpEndHasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.primary
            }
            value={end}
            placeholder="1.0.0.0"
            onOdsValueChange={({ target }) =>
              setAllocationIp('ipEnd', target.value as string, {
                shouldValidate: true,
                shouldTouch: true,
              })
            }
            error={isIpEndHasError}
          />
        </OsdsFormField>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="self-end"
          disabled={!isAllocationIpValid ? true : undefined}
          onClick={onAddAllocationIp}
        >
          <OsdsIcon
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </OsdsButton>
      </div>
    </>
  );
};

export default IpAllocation;
