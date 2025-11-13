import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import OvhLink from './OvhLink.component';

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigation: () => ({
    getURL: vi.fn((app: string, path: string) => `#mockedurl-${app}${path}`),
  }),
}));

describe('OvhLink component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should render anchor element with href fetched from navigation', async () => {
    render(
      <OvhLink application="app" path="/some-path">
        Link
      </OvhLink>,
    );
    const anchorElement = screen.getByText('Link');
    await waitFor(() => {
      expect(anchorElement).toHaveAttribute('href', '#mockedurl-app/some-path');
    });
  });
});
