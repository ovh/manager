import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import Configuration from './Configuration.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

describe('Configuration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({ projectId: 'projectId', swiftId: 'test-swift-id' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display swiftId in copyable field', () => {
    render(<Configuration />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByRole('textbox')).toHaveTextContent('test-swift-id');
  });
});
