import React from 'react';
import { vi, describe, expect } from 'vitest';
import Redirections from '../Redirections';
import { render } from '@/utils/test.provider';
import { platformMock } from '@/api/_mock_';
import redirectionsTranslation from '@/public/translations/redirections/Messages_fr_FR.json';

vi.mock('@/hooks', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    usePlatform: vi.fn(() => ({
      platformUrn: platformMock[0].iam.urn,
    })),
    useGenerateUrl: vi.fn(
      () => '#/00000000-0000-0000-0000-000000000001/redirections',
    ),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Redirections page', () => {
  it('should display page correctly', () => {
    const { getByTestId } = render(<Redirections />);
    const button = getByTestId('add-redirection-btn');

    expect(button).toHaveTextContent(
      redirectionsTranslation.zimbra_redirections_cta,
    );
  });
});
