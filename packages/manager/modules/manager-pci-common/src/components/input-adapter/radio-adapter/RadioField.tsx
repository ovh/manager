import { ComponentProps, FC, PropsWithChildren, ReactNode } from 'react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';

export type RadioFieldProps = PropsWithChildren<
  ComponentProps<'fieldset'> & {
    label: ReactNode;
    subtitle?: ReactNode;
  }
>;

export const RadioField: FC<RadioFieldProps> = ({
  label,
  subtitle,
  children,
  ...otherProps
}) => (
  <fieldset className="border-0 p-0" role="radiogroup" {...otherProps}>
    <legend>
      <Subtitle>{label}</Subtitle>
    </legend>
    <OdsText>{subtitle}</OdsText>

    {children}
  </fieldset>
);
