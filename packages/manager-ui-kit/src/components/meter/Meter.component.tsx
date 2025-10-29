import { Meter as OdsMeter } from '@ovhcloud/ods-react';

import { MeterProps } from '@/components';

export const Meter = (props: MeterProps) => <OdsMeter {...props} />;
