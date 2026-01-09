import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';

import AddModuleModal from '../AddModule.modal';

describe('AddModuleModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const { container } = render(<AddModuleModal />, { wrapper });
    expect(container).toBeInTheDocument();
  });
});
