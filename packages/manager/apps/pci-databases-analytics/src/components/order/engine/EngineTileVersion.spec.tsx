import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import VersionSelector from '@/components/order/engine/EngineTileVersion.component';
import { mockedEngineVersion } from '@/__tests__/helpers/mocks/order-funnel';

describe('VersionSelector component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should display the each element of the component', async () => {
    const onChange = vi.fn();
    render(
      <VersionSelector
        versions={[mockedEngineVersion]}
        isEngineSelected={false}
        onChange={onChange}
        selectedVersion=""
      />,
    );

    await waitFor(() => {
      const versionInput = `engine-tile-version-input-${mockedEngineVersion.name}`;
      expect(
        screen.getByTestId('engine-tile-version-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId(versionInput)).toBeInTheDocument();
      expect(screen.getByTestId('popover-trigger-button')).toBeInTheDocument();
      expect(screen.getByTestId('popover-trigger-button')).toBeDisabled();
    });
  });
});
