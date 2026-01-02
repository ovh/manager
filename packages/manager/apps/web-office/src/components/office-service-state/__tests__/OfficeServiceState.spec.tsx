import { describe, expect } from 'vitest';

import { BADGE_COLOR } from '@ovhcloud/ods-react';

import status from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/status/Messages_fr_FR.json';

import { ServiceStateEnum, UserStateEnum } from '@/data/api/ApiType';
import { StateEnum } from '@/data/api/service-infos/type';
import { renderWithRouter } from '@/utils/Test.provider';

import { OfficeServiceState } from '../OfficeServiceState.component';

describe('OfficeServiceState component', () => {
  it('Badge for ok status', () => {
    const { getByTestId } = renderWithRouter(<OfficeServiceState state={StateEnum.OK} />);
    const badge = getByTestId('badge-status');

    expect(badge.className).contain(BADGE_COLOR.success);
    expect(badge).toHaveTextContent(status.ok);
  });

  it('Badge for autorenewInProgress status', () => {
    const { getByTestId } = renderWithRouter(
      <OfficeServiceState state={StateEnum.AUTO_RENEW_IN_PROGRESS} />,
    );
    const badge = getByTestId('badge-status');

    expect(badge.className).contain(BADGE_COLOR.information);
    expect(badge).toHaveTextContent(status.autorenewInProgress);
  });

  it('Badge for expired status', () => {
    const { getByTestId } = renderWithRouter(<OfficeServiceState state={StateEnum.EXPIRED} />);
    const badge = getByTestId('badge-status');

    expect(badge.className).contain(BADGE_COLOR.critical);
    expect(badge).toHaveTextContent(status.expired);
  });

  it('Badge for inCreation status', () => {
    const { getByTestId } = renderWithRouter(<OfficeServiceState state={StateEnum.IN_CREATION} />);
    const badge = getByTestId('badge-status');

    expect(badge.className).contain(BADGE_COLOR.information);
    expect(badge).toHaveTextContent(status.inCreation);
  });

  it('Badge for creating status', () => {
    const { getByTestId } = renderWithRouter(
      <OfficeServiceState state={ServiceStateEnum.CREATING} />,
    );
    const badge = getByTestId('badge-status');

    expect(badge.className).contain(BADGE_COLOR.information);
    expect(badge).toHaveTextContent(status.inCreation);
  });

  it('Badge for inMaintenance status', () => {
    const { getByTestId } = renderWithRouter(
      <OfficeServiceState state={ServiceStateEnum.IN_MAINTENANCE} />,
    );
    const badge = getByTestId('badge-status');

    expect(badge.className).contain(BADGE_COLOR.information);
    expect(badge).toHaveTextContent(status.inMaintenance);
  });

  it('Badge for unPaid status', () => {
    const { getByTestId } = renderWithRouter(<OfficeServiceState state={StateEnum.UNPAID} />);
    const badge = getByTestId('badge-status');

    expect(badge.className).contain(BADGE_COLOR.critical);
    expect(badge).toHaveTextContent(status.unPaid);
  });

  it('Badge for suspended status', () => {
    const { getByTestId } = renderWithRouter(
      <OfficeServiceState state={ServiceStateEnum.SUSPENDED} />,
    );
    const badge = getByTestId('badge-status');

    expect(badge.className).contain(BADGE_COLOR.critical);
    expect(badge).toHaveTextContent(status.suspended);
  });

  it('Badge for suspending status', () => {
    const { getByTestId } = renderWithRouter(
      <OfficeServiceState state={ServiceStateEnum.SUSPENDING} />,
    );
    const badge = getByTestId('badge-status');

    expect(badge.className).contain(BADGE_COLOR.critical);
    expect(badge).toHaveTextContent(status.suspending);
  });

  it('Badge for deleting status', () => {
    const { getByTestId } = renderWithRouter(<OfficeServiceState state={UserStateEnum.DELETING} />);
    const badge = getByTestId('badge-status');

    expect(badge.className).contain(BADGE_COLOR.critical);
    expect(badge).toHaveTextContent(status.deleting);
  });

  it('Badge for pendingDebt status', () => {
    const { getByTestId } = renderWithRouter(<OfficeServiceState state={StateEnum.PENDING_DEBT} />);
    const badge = getByTestId('badge-status');

    expect(badge.className).contain(BADGE_COLOR.information);
    expect(badge).toHaveTextContent(status.pendingDebt);
  });
});

describe('OfficeServiceState W3C Validation', () => {
  it('should have a valid html', async () => {
    const { container } = renderWithRouter(<OfficeServiceState state={StateEnum.OK} />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
