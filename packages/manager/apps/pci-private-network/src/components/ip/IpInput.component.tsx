import { FC, FormEventHandler, PropsWithChildren } from 'react';
import {
  ODS_INPUT_TYPE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

type Props = {
  error: boolean;
  value: string;
  onValueChange: FormEventHandler<HTMLOsdsInputElement>;
};

const IpInput: FC<PropsWithChildren<Props>> = ({
  children,
  error,
  value,
  onValueChange,
}) => {
  const { t } = useTranslation('new');

  return (
    <>
      <div className="flex">
        <OsdsFormField>
          <OsdsText color={ODS_TEXT_COLOR_INTENT.text} slot="label">
            {t('pci_projects_project_network_private_dns_server_custom_title')}
          </OsdsText>

          <OsdsInput
            inline
            type={ODS_INPUT_TYPE.text}
            color={
              error
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.primary
            }
            placeholder="0.0.0.0"
            value={value}
            error={error}
            onInput={onValueChange}
          />
        </OsdsFormField>
        {children}
      </div>
      {error && (
        <OsdsText color={ODS_THEME_COLOR_INTENT.error}>
          {t('pci_projects_network_cidr')}
        </OsdsText>
      )}
    </>
  );
};

export default IpInput;
