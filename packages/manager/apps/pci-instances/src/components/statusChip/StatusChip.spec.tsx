import { render } from '@testing-library/react';
import { describe } from 'vitest';
import StatusChip from './StatusChip.component';
import { TInstanceStatus } from '@/types/instance/entity.type';

type Data = {
  status: TInstanceStatus;
  label: string;
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
    status
    ${successStatus}
    ${errorStatus}
    ${warningStatus}
    ${infoStatus}
  `(
    'Should render the correct chip color <$bgColor> and label based on the status <$status>',
    ({ status }: Data) => {
      const { getByText } = render(<StatusChip status={status} />);
      const labelEl = getByText(status.state.toLowerCase());
      expect(labelEl).toBeInTheDocument();
    },
  );
});
