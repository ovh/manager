import { Icon as OdsIcon, IconName } from '@ovhcloud/ods-react';
import { ComponentProps, PropsWithoutRef } from 'react';

type Props = PropsWithoutRef<ComponentProps<'span'> & { name: IconName }>;

export const Icon = ({ name, className, ...spanProps }: Props) => (
  <OdsIcon name={name} {...spanProps} />
);
