import React from 'react';
import { vi, describe, expect } from 'vitest';
import AutoReplies from '../AutoReplies';
import { render } from '@/utils/test.provider';
import { platformMock } from '@/api/_mock_';

vi.mock('@/hooks', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    usePlatform: vi.fn(() => ({
      platformUrn: platformMock[0].iam.urn,
    })),
    useGenerateUrl: vi.fn(
      () => '#/00000000-0000-0000-0000-000000000001/auto_replies',
    ),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Redirections page', () => {
  it('should display page correctly', () => {
    const { getByTestId } = render(<AutoReplies />);
    const button = getByTestId('header-until');

    expect(button).toHaveTextContent('zimbra_auto_replies_until');
  });
});
