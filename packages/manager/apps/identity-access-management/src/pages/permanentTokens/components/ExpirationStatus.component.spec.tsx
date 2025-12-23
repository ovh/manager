import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IamUserToken } from '@/data/api/iam-users';
import { ExpirationStatus } from '@/pages/permanentTokens/components/ExpirationStatus.component';

function mockUserToken(expiresAt: string): IamUserToken {
  return {
    name: 'fake token',
    description: '',
    creation: '2025-05-11T00:00:00+02:00',
    lastUsed: '2025-06-11T00:00:00+02:00',
    expiresAt,
  };
}

describe('ExpirationStatus', () => {
  it("should display an 'expired' badge when token is expired", () => {
    const expiredToken = mockUserToken('2025-07-11T00:00:00+02:00');
    const { container } = render(<ExpirationStatus token={expiredToken} />);
    const badgeElement = container.querySelector('ods-badge');
    expect(badgeElement).toHaveAttribute('color', 'critical');
    expect(badgeElement).toHaveAttribute(
      'label',
      'iam_user_token_expiration_badge_expired',
    );
  });

  it("should display an 'active' badge when token is not yet expired", () => {
    const activeToken = mockUserToken('2100-12-25T00:00:00+02:00');
    const { container } = render(<ExpirationStatus token={activeToken} />);
    const badgeElement = container.querySelector('ods-badge');
    expect(badgeElement).toHaveAttribute('color', 'success');
    expect(badgeElement).toHaveAttribute(
      'label',
      'iam_user_token_expiration_badge_active',
    );
  });

  it("should display an 'active' badge when expiresAt is not present", () => {
    const nonExpiringToken = mockUserToken('');
    const { container } = render(<ExpirationStatus token={nonExpiringToken} />);
    const badgeElement = container.querySelector('ods-badge');
    expect(badgeElement).toHaveAttribute('color', 'success');
    expect(badgeElement).toHaveAttribute(
      'label',
      'iam_user_token_expiration_badge_active',
    );
  });

  it("should display an 'invalid' badge when expiresAt is invalid", () => {
    const nonExpiringToken = mockUserToken('invalid-date');
    const { container } = render(<ExpirationStatus token={nonExpiringToken} />);
    const badgeElement = container.querySelector('ods-badge');
    expect(badgeElement).toHaveAttribute('color', 'warning');
    expect(badgeElement).toHaveAttribute(
      'label',
      'iam_user_token_expiration_badge_invalid',
    );
  });
});
