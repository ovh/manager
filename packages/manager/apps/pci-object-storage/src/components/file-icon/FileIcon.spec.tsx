import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import FileIcon from './FileIcon.component';

describe('File Icon component', () => {
  it('renders File icon', async () => {
    render(<FileIcon fileName={'test.yaml'} className="w-4 h-4" />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('file-icon')).toBeTruthy();
    });
  });
});
