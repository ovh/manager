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
  startLabel: string;
  endLabel: string;
  start: string;
  end: string;
  isStartIpHasError: boolean;
  isEndIpHasError: boolean;
  onStartIpChange: (event: CustomEvent) => void;
  onEndIpChange: (event: CustomEvent) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
};

const IpRange: FC<PropsWithChildren<IpRangeProps>> = ({
  children,
  startLabel,
  endLabel,
  start,
  end,
  isStartIpHasError,
  isEndIpHasError,
  onStartIpChange,
  onEndIpChange,
  startPlaceholder,
  endPlaceholder,
}) => {
  const { t } = useTranslation('new');

  return (
    <div>
      <div className="flex">
        <OsdsFormField>
          <OsdsText color={ODS_TEXT_COLOR_INTENT.text} slot="label">
            {startLabel}
          </OsdsText>

          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            color={
              isStartIpHasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.primary
            }
            value={start}
            placeholder={startPlaceholder || '10.0.0.1'}
            onOdsValueChange={onStartIpChange}
            error={isStartIpHasError}
          />
        </OsdsFormField>
        <OsdsFormField className="ml-5">
          <OsdsText color={ODS_TEXT_COLOR_INTENT.text} slot="label">
            {endLabel}
          </OsdsText>

          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            color={
              isEndIpHasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.primary
            }
            value={end}
            placeholder={endPlaceholder || '10.0.0.5'}
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
