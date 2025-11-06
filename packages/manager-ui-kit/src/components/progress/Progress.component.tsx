import { ProgressBar as OdsProgress } from '@ovhcloud/ods-react';

import { ProgressProps } from '@/components/progress/Progress.props';

export const Progress = (props: ProgressProps) => <OdsProgress {...props} />;
