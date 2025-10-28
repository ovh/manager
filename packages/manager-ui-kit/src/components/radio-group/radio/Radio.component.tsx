import { PropsWithChildren } from 'react';

import { Radio as ODSRadio } from '@ovhcloud/ods-react';

import { RadioProps } from './Radio.props';

export const Radio = (props: PropsWithChildren<RadioProps>) => <ODSRadio {...props} />;
