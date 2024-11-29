import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_INPUT_TYPE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';

type IpRangeProps = {
  start: string;
  end: string;
  isStartIpHasError: boolean;
  isEndIpHasError: boolean;
  onStartIpChange: (event: CustomEvent) => void;
  onEndIpChange: (event: CustomEvent) => void;
};

const IpRange: FC<PropsWithChildren<IpRangeProps>> = ({
  children,
  start,
  end,
  isStartIpHasError,
  isEndIpHasError,
  onStartIpChange,
  onEndIpChange,
}) => {
  const { t } = useTranslation('new');

  return (
    <div>
      <div className="flex">
        <OsdsFormField>
          <OsdsText color={ODS_TEXT_COLOR_INTENT.text} slot="label">
            {t('pci_projects_project_network_private_allocation_ip_start')}
          </OsdsText>

          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            color={
              isStartIpHasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.primary
            }
            value={start}
            placeholder="placeholder"
            onOdsValueChange={onStartIpChange}
            error={isStartIpHasError}
          />
        </OsdsFormField>
        <OsdsFormField className="ml-5">
          <OsdsText color={ODS_TEXT_COLOR_INTENT.text} slot="label">
            {t('pci_projects_project_network_private_allocation_ip_end')}
          </OsdsText>

          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            color={
              isEndIpHasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.primary
            }
            value={end}
            placeholder="placeholder"
            onOdsValueChange={onEndIpChange}
            error={isEndIpHasError}
          />
        </OsdsFormField>
        {children}
      </div>
      {(isStartIpHasError || isEndIpHasError) && (
        <OsdsText color={ODS_THEME_COLOR_INTENT.error}>
          {t('pci_projects_network_cidr')}
        </OsdsText>
      )}
    </div>
  );
};

export default IpRange;
