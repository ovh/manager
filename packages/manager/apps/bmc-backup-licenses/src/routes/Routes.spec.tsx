import { createElement } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TestApp } from '@/utils/tests/TestApp';

// Tout est mocké volontairement : l'app est une coquille, son seul rôle propre est le câblage des routes.
vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const { createContext } = await import('react');
  return {
    ShellContext: createContext({ shell: { ux: { hidePreloader: vi.fn() } } }),
    useOvhTracking: () => ({ trackCurrentPage: vi.fn() }),
    useRouteSynchro: () => undefined,
  };
});

vi.mock('@ovh-ux/request-tagger', () => ({ defineCurrentPage: vi.fn() }));

vi.mock('@ovh-ux/backup-licenses', async () => {
  const { createContext } = await import('react');
  const { Route } = await import('react-router-dom');
  return {
    BackupLicensesContext: createContext({}),
    BackupLicensesRoutes: createElement(Route, {
      path: 'onboarding',
      element: createElement('span', null, 'onboarding-stub'),
    }),
  };
});

describe('Routes', () => {
  it('redirige la racine de l’app vers l’onboarding du module', async () => {
    render(createElement(TestApp, { initialRoute: '/' }));

    expect(await screen.findByText('onboarding-stub')).toBeVisible();
  });

  it('rend le catch-all 404 pour un chemin inconnu', async () => {
    render(createElement(TestApp, { initialRoute: '/chemin-inexistant' }));

    expect(await screen.findByText('404 - route not found')).toBeVisible();
  });
});
