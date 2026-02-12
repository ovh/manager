import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import AssociateGitPage from '../AssociateGit.page';

describe('AssociateGitPage', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render correctly', () => {
    const { container } = render(<AssociateGitPage />, { wrapper });
    expect(container).toBeInTheDocument();
  });
});
