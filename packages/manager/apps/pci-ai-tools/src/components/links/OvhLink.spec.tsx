import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import OvhLink from './OvhLink.component';

describe('OvhLink component', () => {
  beforeEach(() => {
    mockManagerReactShellClient();
  });
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
