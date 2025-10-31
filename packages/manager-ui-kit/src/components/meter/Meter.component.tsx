import { Meter as OdsMeter } from '@ovhcloud/ods-react';

import { MeterProps } from '@/components/meter/Meter.props';

export const Meter = (props: MeterProps) => <OdsMeter {...props} />;
