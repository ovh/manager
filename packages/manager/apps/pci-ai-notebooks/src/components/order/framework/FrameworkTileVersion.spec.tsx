import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import VersionSelector from './FrameworkTileVersion.component';
import { mockedFramework } from '@/__tests__/helpers/mocks/capabilities/notebookFramework';

describe('Framework Version Selector component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display Version Selector', async () => {
    render(
      <VersionSelector
        versions={mockedFramework.versions}
        isFrameworkSelected={true}
        onChange={onChange}
        selectedVersion=""
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('fmk-tile-version-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('popover-trigger-button')).toBeInTheDocument();
      expect(screen.getByTestId('popover-trigger-button')).toBeDisabled();
    });
  });
});
