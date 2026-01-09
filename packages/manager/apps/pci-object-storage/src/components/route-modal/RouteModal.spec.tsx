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
      <RouteModal backUrl={'../'} isLoading={true}>
        <>HelloWorld</>
      </RouteModal>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('dialog-container')).toBeTruthy();
    });
  });

  it('renders Route Modal HelloWorld', async () => {
    render(
      <RouteModal backUrl={'../'} isLoading={false}>
        {' '}
        <div>HelloWorld</div>
      </RouteModal>,
    );
    await waitFor(() => {
      expect(screen.getByText('HelloWorld')).toBeTruthy();
    });
  });
});
