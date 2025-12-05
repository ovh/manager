import { render } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';

import { managedWordpressWebsitesTaskMock } from '@/data/__mocks__';
import ManagedWordpressTranslations from '@/public/translations/common/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';

import TaskPage from '../ManagedWordpressResource/tasks/Tasks.page';

vi.mock(
  '@/data/hooks/managedWordpress/managedWordpressResourceTasks/useManagedWordpressResourceTasks',
  () => ({
    useManagedWordpressResourceTasks: vi.fn(() => ({
      data: managedWordpressWebsitesTaskMock,
    })),
  }),
);

describe('Task Page', () => {
  it('should render page with content', () => {
    const { getByTestId } = render(<TaskPage />, { wrapper });
    const sortedRowFqdn = getByTestId('header-defaultFqdn');

    expect(sortedRowFqdn).toHaveTextContent(
      ManagedWordpressTranslations.web_hosting_status_header_fqdn,
    );
  });
});
