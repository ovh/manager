import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import App from '@/pages/_app';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

const mockedChildren = <p>testApp</p>;

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    render(<App children={mockedChildren} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('testApp')).toBeInTheDocument();
    });
  });
});
