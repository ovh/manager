import { describe, expect } from 'vitest';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { ServiceStateEnum, UserStateEnum } from '@/data/api/ApiType';
import { StateEnum } from '@/data/api/service-infos/type';
import { render } from '@/utils/Test.provider';

import { OfficeServiceState } from '../OfficeServiceState.component';

describe('OfficeServiceState component', () => {
  it('Badge for ok status', () => {
    const { getByTestId } = render(<OfficeServiceState state={StateEnum.OK} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'ok');

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.success);
  });

  it('Badge for autorenewInProgress status', () => {
    const { getByTestId } = render(<OfficeServiceState state={StateEnum.AUTO_RENEW_IN_PROGRESS} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'autorenewInProgress');

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.information);
  });

  it('Badge for expired status', () => {
    const { getByTestId } = render(<OfficeServiceState state={StateEnum.EXPIRED} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'expired');

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.critical);
  });

  it('Badge for inCreation status', () => {
    const { getByTestId } = render(<OfficeServiceState state={StateEnum.IN_CREATION} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'inCreation');

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.information);
  });
  it('Badge for creating status', () => {
    const { getByTestId } = render(<OfficeServiceState state={ServiceStateEnum.CREATING} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'inCreation');

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.information);
  });
  it('Badge for inMaintenance status', () => {
    const { getByTestId } = render(<OfficeServiceState state={ServiceStateEnum.IN_MAINTENANCE} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'inMaintenance');

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.information);
  });
  it('Badge for unPaid status', () => {
    const { getByTestId } = render(<OfficeServiceState state={StateEnum.UNPAID} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'unPaid');

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.critical);
  });
  it('Badge for suspended status', () => {
    const { getByTestId } = render(<OfficeServiceState state={ServiceStateEnum.SUSPENDED} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'suspended');

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.critical);
  });
  it('Badge for suspending status', () => {
    const { getByTestId } = render(<OfficeServiceState state={ServiceStateEnum.SUSPENDING} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'suspending');

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.critical);
  });
  it('Badge for deleting status', () => {
    const { getByTestId } = render(<OfficeServiceState state={UserStateEnum.DELETING} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'deleting');

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.critical);
  });
  it('Badge for pendingDebt status', () => {
    const { getByTestId } = render(<OfficeServiceState state={StateEnum.PENDING_DEBT} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'pendingDebt');

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.information);
  });
});
