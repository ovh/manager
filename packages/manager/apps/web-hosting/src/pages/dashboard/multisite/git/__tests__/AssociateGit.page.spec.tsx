import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';

import AssociateGitPage from '../AssociateGit.page';

describe('AssociateGitPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should render correctly', () => {
    const { container } = render(<AssociateGitPage />, { wrapper });
    expect(container).toBeInTheDocument();
  });
});
