import { FC, PropsWithChildren, ReactNode } from 'react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';

export type RadioFieldProps = PropsWithChildren<{
  label: ReactNode;
  subtitle?: ReactNode;
}>;

export const RadioField: FC<RadioFieldProps> = ({
  label,
  subtitle,
  children,
}) => (
  <fieldset className="border-0 p-0" role="radiogroup">
    <legend>
      <Subtitle>{label}</Subtitle>
    </legend>
    <OsdsText
      size={ODS_TEXT_SIZE._400}
      level={ODS_TEXT_LEVEL.body}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      {subtitle}
    </OsdsText>

    {children}
  </fieldset>
);
