import { render } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { managedWordpressResourceMock } from '@/data/__mocks__/managedWordpress/ressource';
import ManagedWordpressTranslations from '@/public/translations/common/Messages_fr_FR.json';
import { wrapper } from '@/utils/tests/test.provider';

import ManagedWordpressPage from '../ManagedWordpress.page';

vi.mock(
  '@/data/hooks/managedWordpress/managedWordpressResource/useManagedWordpressResource',
  () => ({
    useManagedWordpressResource: vi.fn(() => ({
      data: managedWordpressResourceMock,
      isLoading: false,
    })),
  }),
);
describe.skip('ManagedWordpressPage Page', () => {
  it('should render page with content', () => {
    const { getByTestId } = render(<ManagedWordpressPage />, { wrapper });
    const sortedRows = getByTestId('header-id');

    expect(sortedRows).toHaveTextContent(
      ManagedWordpressTranslations.web_hosting_status_header_resource,
    );
  });
});
