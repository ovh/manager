import { ComponentProps, PropsWithoutRef } from 'react';

import { IconName, Icon as OdsIcon } from '@ovhcloud/ods-react';

type Props = PropsWithoutRef<ComponentProps<'span'> & { name: IconName }>;

export const Icon = ({ name, ...spanProps }: Props) => <OdsIcon name={name} {...spanProps} />;
