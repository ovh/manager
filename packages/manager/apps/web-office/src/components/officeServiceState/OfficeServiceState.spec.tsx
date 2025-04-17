import React from 'react';
import { describe, expect } from 'vitest';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { render } from '@/utils/test.provider';
import { OfficeServiceState } from './OfficeServiceState.component';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

describe('OfficeServiceState component', () => {
  it('Badge for ok status', async () => {
    const { getByTestId } = render(<OfficeServiceState state={'ok'} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', commonTranslation.state_ok);

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.success);
  });

  it('Badge for autorenewInProgress status', () => {
    const { getByTestId } = render(
      <OfficeServiceState state={'autorenewInProgress'} />,
    );
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute(
      'label',
      commonTranslation.state_autorenewInProgress,
    );

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.information);
  });

  it('Badge for expired status', () => {
    const { getByTestId } = render(<OfficeServiceState state={'expired'} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', commonTranslation.state_expired);

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.critical);
  });

  it('Badge for inCreation status', () => {
    const { getByTestId } = render(<OfficeServiceState state={'inCreation'} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', commonTranslation.state_inCreation);

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.information);
  });
  it('Badge for creating status', () => {
    const { getByTestId } = render(<OfficeServiceState state={'creating'} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', commonTranslation.state_inCreation);

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.information);
  });
  it('Badge for inMaintenance status', () => {
    const { getByTestId } = render(
      <OfficeServiceState state={'inMaintenance'} />,
    );
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute(
      'label',
      commonTranslation.state_inMaintenance,
    );

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.information);
  });
  it('Badge for unPaid status', () => {
    const { getByTestId } = render(<OfficeServiceState state={'unPaid'} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', commonTranslation.state_unPaid);

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.critical);
  });
  it('Badge for suspended status', () => {
    const { getByTestId } = render(<OfficeServiceState state={'suspended'} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', commonTranslation.state_suspended);

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.critical);
  });
  it('Badge for suspending status', () => {
    const { getByTestId } = render(<OfficeServiceState state={'suspending'} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', commonTranslation.state_suspending);

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.critical);
  });
  it('Badge for deleting status', () => {
    const { getByTestId } = render(<OfficeServiceState state={'deleting'} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', commonTranslation.state_deleting);

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.critical);
  });
  it('Badge for pendingDebt status', () => {
    const { getByTestId } = render(
      <OfficeServiceState state={'pendingDebt'} />,
    );
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', commonTranslation.state_pendingDebt);

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.information);
  });
  it('Badge for  status', () => {
    const { getByTestId } = render(<OfficeServiceState state={''} />);
    const badge = getByTestId('badge-status');

    expect(badge).toHaveAttribute('label', commonTranslation.state);

    expect(badge).toHaveAttribute('color', ODS_BADGE_COLOR.neutral);
  });
});
