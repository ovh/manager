import { describe, expect } from 'vitest';

import { BADGE_COLOR } from '@ovhcloud/ods-react';

import { ServiceStateEnum, UserStateEnum } from '@/data/api/ApiType';
import { StateEnum } from '@/data/api/service-infos/type';
import { renderWithRouter } from '@/utils/Test.provider';

import { OfficeServiceState } from '../OfficeServiceState.component';

describe('OfficeServiceState component', () => {
  it.skip('Badge for ok status', () => {
    const { getByTestId } = renderWithRouter(<OfficeServiceState state={StateEnum.OK} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'ok');

    expect(badge).toHaveAttribute('color', BADGE_COLOR.success);
  });

  it.skip('Badge for autorenewInProgress status', () => {
    const { getByTestId } = renderWithRouter(
      <OfficeServiceState state={StateEnum.AUTO_RENEW_IN_PROGRESS} />,
    );
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'autorenewInProgress');

    expect(badge).toHaveAttribute('color', BADGE_COLOR.information);
  });

  it.skip('Badge for expired status', () => {
    const { getByTestId } = renderWithRouter(<OfficeServiceState state={StateEnum.EXPIRED} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'expired');

    expect(badge).toHaveAttribute('color', BADGE_COLOR.critical);
  });

  it.skip('Badge for inCreation status', () => {
    const { getByTestId } = renderWithRouter(<OfficeServiceState state={StateEnum.IN_CREATION} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'inCreation');

    expect(badge).toHaveAttribute('color', BADGE_COLOR.information);
  });
  it.skip('Badge for creating status', () => {
    const { getByTestId } = renderWithRouter(
      <OfficeServiceState state={ServiceStateEnum.CREATING} />,
    );
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'inCreation');

    expect(badge).toHaveAttribute('color', BADGE_COLOR.information);
  });
  it.skip('Badge for inMaintenance status', () => {
    const { getByTestId } = renderWithRouter(
      <OfficeServiceState state={ServiceStateEnum.IN_MAINTENANCE} />,
    );
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'inMaintenance');

    expect(badge).toHaveAttribute('color', BADGE_COLOR.information);
  });
  it.skip('Badge for unPaid status', () => {
    const { getByTestId } = renderWithRouter(<OfficeServiceState state={StateEnum.UNPAID} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'unPaid');

    expect(badge).toHaveAttribute('color', BADGE_COLOR.critical);
  });
  it.skip('Badge for suspended status', () => {
    const { getByTestId } = renderWithRouter(
      <OfficeServiceState state={ServiceStateEnum.SUSPENDED} />,
    );
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'suspended');

    expect(badge).toHaveAttribute('color', BADGE_COLOR.critical);
  });
  it.skip('Badge for suspending status', () => {
    const { getByTestId } = renderWithRouter(
      <OfficeServiceState state={ServiceStateEnum.SUSPENDING} />,
    );
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'suspending');

    expect(badge).toHaveAttribute('color', BADGE_COLOR.critical);
  });
  it.skip('Badge for deleting status', () => {
    const { getByTestId } = renderWithRouter(<OfficeServiceState state={UserStateEnum.DELETING} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'deleting');

    expect(badge).toHaveAttribute('color', BADGE_COLOR.critical);
  });
  it.skip('Badge for pendingDebt status', () => {
    const { getByTestId } = renderWithRouter(<OfficeServiceState state={StateEnum.PENDING_DEBT} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', 'pendingDebt');

    expect(badge).toHaveAttribute('color', BADGE_COLOR.information);
  });
});

describe('OfficeServiceState W3C Validation', () => {
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(<OfficeServiceState state={StateEnum.OK} />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
