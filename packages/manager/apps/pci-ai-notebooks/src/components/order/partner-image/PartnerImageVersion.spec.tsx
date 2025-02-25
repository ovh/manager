import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { mockedFrameworkBis } from '@/__tests__/helpers/mocks/notebook/framework';
import ImageVersionSelector from './PartnerImageVersion.component';

describe('Parnter image version Selector component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onChange = vi.fn();
  it('should display Version Selector', async () => {
    render(
      <ImageVersionSelector
        versions={mockedFrameworkBis.versions}
        isImageSelected={true}
        onChange={onChange}
        selectedVersion=""
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('image-version-container')).toBeInTheDocument();
      expect(screen.getByTestId('popover-trigger-button')).toBeInTheDocument();
      expect(screen.getByTestId('popover-trigger-button')).toBeDisabled();
    });
  });
});
