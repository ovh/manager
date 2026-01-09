import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';

import DeleteModuleModal from '../DeleteModule.modal';

describe('DeleteModuleModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const { container } = render(<DeleteModuleModal />, { wrapper });
    expect(container).toBeInTheDocument();
  });
});
