import { render } from '@testing-library/react';
import { describe } from 'vitest';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import StatusChip from './StatusChip.component';
import { TInstanceStatus } from '@/data/hooks/instance/useInstances';

type Data = {
  status: TInstanceStatus;
  label: string;
  bgColor: ODS_THEME_COLOR_INTENT;
};

const successStatus: TInstanceStatus = {
  severity: 'success',
  state: 'ACTIVE',
};

const warningStatus: TInstanceStatus = {
  severity: 'warning',
  state: 'PAUSED',
};

const errorStatus: TInstanceStatus = {
  severity: 'error',
  state: 'ERROR',
};

const infoStatus: TInstanceStatus = {
  severity: 'info',
  state: 'UNKNOWN',
};

describe('StatusChip component', () => {
  test.each`
    status           | bgColor
    ${successStatus} | ${ODS_THEME_COLOR_INTENT.success}
    ${errorStatus}   | ${ODS_THEME_COLOR_INTENT.error}
    ${warningStatus} | ${ODS_THEME_COLOR_INTENT.warning}
    ${infoStatus}    | ${ODS_THEME_COLOR_INTENT.info}
  `(
    'Should render the correct chip color <$bgColor> and label based on the status <$status>',
    ({ status, bgColor }: Data) => {
      const { getByText, getByTestId } = render(<StatusChip status={status} />);
      const chipEl = getByTestId('status-chip');
      expect(chipEl).toHaveStyle(`background-color: ${bgColor}`);
      const labelEl = getByText(status.state.toLowerCase());
      expect(labelEl).toBeInTheDocument();
    },
  );
});
