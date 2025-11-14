import { describe, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import RouteModal from './RouteModal';

describe('Route Modal component', () => {
  beforeEach(() => {
    mockedUsedNavigate();
  });
  it('renders Route Modal Skeleton on isLoading', async () => {
    render(
      <RouteModal
        backUrl={'../'}
        isLoading={true}
        children={<>HelloWorld</>}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('dialog-container')).toBeTruthy();
    });
  });

  it('renders Route Modal HelloWorld', async () => {
    render(
      <RouteModal
        backUrl={'../'}
        isLoading={false}
        children={<div>HelloWorld</div>}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText('HelloWorld')).toBeTruthy();
    });
  });
});
