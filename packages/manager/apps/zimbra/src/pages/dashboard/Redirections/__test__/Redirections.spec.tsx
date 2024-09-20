import React from 'react';
import { vi, describe, expect } from 'vitest';
import Redirections from '../Redirections';
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
      () => '#/00000000-0000-0000-0000-000000000001/redirections/delete?',
    ),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Redirections page', () => {
  it('Page should display correctly', () => {
    const { getByTestId } = render(<Redirections />);
    const button = getByTestId('header-from');

    expect(button).toHaveTextContent('zimbra_redirections_from');
  });
});
