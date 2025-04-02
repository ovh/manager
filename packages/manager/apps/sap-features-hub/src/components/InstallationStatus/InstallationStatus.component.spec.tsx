import React from 'react';
import { render } from '@testing-library/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { SAPInstallationStatus } from '@/types/installation.type';
import { InstallationStatus } from './InstallationStatus.component';
import '@testing-library/jest-dom';

function renderComponent(status: SAPInstallationStatus) {
  return render(<InstallationStatus status={status} />);
}

describe('SAPInstallationStatus component tests suite', () => {
  it.each([
    {
      status: SAPInstallationStatus.failure,
      color: ODS_BADGE_COLOR.critical,
    },
    {
      status: SAPInstallationStatus.pending,
      color: ODS_BADGE_COLOR.information,
    },
    {
      status: SAPInstallationStatus.retry,
      color: ODS_BADGE_COLOR.warning,
    },
    {
      status: SAPInstallationStatus.revoked,
      color: ODS_BADGE_COLOR.neutral,
    },
    {
      status: SAPInstallationStatus.started,
      color: ODS_BADGE_COLOR.information,
    },
    {
      status: SAPInstallationStatus.success,
      color: ODS_BADGE_COLOR.success,
    },
  ])(
    'when installation status is $status badge color should be $color and have the right label',
    ({ status, color }) => {
      const { container } = renderComponent(status);

      const badge = container.querySelector('ods-badge');
      expect(badge).toHaveAttribute('color', color);
      expect(badge).toHaveAttribute('label', `status_${status}`);
    },
  );
});
