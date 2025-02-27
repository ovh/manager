import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';
import Apps from './Apps.page';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

describe('Apps List page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();

    vi.mock('@/data/api/ai/app/app.api', () => ({
      getApps: vi.fn(() => [mockedApp]),
    }));
  });

  it('should display Apps pages and skeleton', async () => {
    render(<Apps />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('apps-list-table-skeleton')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('guide-skeleton')).toBeInTheDocument();
    });
  });

  it('should display apps list table and add button', async () => {
    render(<Apps />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('create-app-button')).toBeInTheDocument();
      expect(screen.getByText(mockedApp.id)).toBeInTheDocument();
      expect(screen.getByText(mockedApp.spec.name)).toBeInTheDocument();
    });
  });

  it('open start app modal from action table button', async () => {
    render(<Apps />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedApp.id)).toBeInTheDocument();
    });
    await openButtonInMenu('apps-action-trigger', 'app-action-start-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./start/appId');
  });

  it('open kill app modal from action table button', async () => {
    render(<Apps />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedApp.id)).toBeInTheDocument();
    });
    await openButtonInMenu('apps-action-trigger', 'app-action-stop-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./stop/appId');
  });

  it('open delete notebook Modal from action table button', async () => {
    render(<Apps />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedApp.id)).toBeInTheDocument();
    });
    await openButtonInMenu('apps-action-trigger', 'app-action-delete-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete/appId');
  });

  it('go to manage app from action table button', async () => {
    render(<Apps />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedApp.id)).toBeInTheDocument();
    });
    await openButtonInMenu('apps-action-trigger', 'app-action-manage-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./appId');
  });
});
