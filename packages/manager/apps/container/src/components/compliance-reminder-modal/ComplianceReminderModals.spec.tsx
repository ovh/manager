import { vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import * as usePreferencesModule from '@/data/hooks/preferences/usePreferences';
import * as useTimeModule from '@/data/hooks/time/useTime';
import MissingCninModal from './MissingCninModal.component';
import {
  isUserConcernedByMissingCnin,
  missingCninDescriptionKey,
  missingCninFieldToFocus,
} from './complianceReminderModal.helpers';

const mocks = vi.hoisted(() => ({
  user: {
    legalform: 'other',
    country: 'TR',
    certificates: ['missingCNIN'] as string[],
  },
  notifyModalActionDone: vi.fn(),
  createPreference: vi.fn(),
}));

vi.mock('@/context', () => ({
  useApplication: () => ({
    shell: {
      getPlugin: (plugin: string) => {
        switch (plugin) {
          case 'navigation':
            return {
              getURL: vi.fn(
                (appName, appPath) =>
                  `https://fake-manager.com/manager/${appName}/${appPath}`,
              ),
            };
          case 'environment':
            return { getEnvironment: () => ({ getUser: () => mocks.user }) };
          case 'ux':
            return { notifyModalActionDone: mocks.notifyModalActionDone };
          case 'tracking':
            return { trackClick: vi.fn(), trackPage: vi.fn() };
        }
      },
    },
  }),
}));

const ACCOUNT_EDITION = 'https://fake-manager.com/manager/account/#/useraccount/infos';

const renderWithClient = (node: JSX.Element) =>
  render(
    <QueryClientProvider client={new QueryClient()}>{node}</QueryClientProvider>,
  );

beforeEach(() => {
  mocks.user.legalform = 'other';
  mocks.user.country = 'TR';
  mocks.user.certificates = ['missingCNIN'];
  mocks.notifyModalActionDone.mockClear();
  mocks.createPreference.mockClear();
  window.sessionStorage.clear();
  Object.defineProperty(window, 'location', {
    value: { href: 'https://fake-manager.com/manager/#/hub' },
    writable: true,
  });
  Object.defineProperty(window, 'top', {
    value: { location: { href: '' } },
    writable: true,
  });
  // Never displayed yet (`null` preference).
  vi.spyOn(usePreferencesModule, 'usePreferences').mockReturnValue({
    data: null,
  } as UseQueryResult<number>);
  vi.spyOn(usePreferencesModule, 'useCreatePreference').mockReturnValue({
    mutate: mocks.createPreference,
  } as any);
  vi.spyOn(useTimeModule, 'useTime').mockReturnValue({
    data: 10_000,
    isFetched: true,
  } as UseQueryResult<number>);
});

describe('F1 compliance reminders — display conditions', () => {
  it.each([
    [['missingCNIN'], 'FR', true],
    [['missingCNIN'], 'TR', true],
    [['missingCNIN'], 'BE', false],
    [['enterprise'], 'TR', false],
  ])('missing CNIN: %j / %s → %s', (certificates, country, expected) => {
    expect(isUserConcernedByMissingCnin({ certificates, country } as any)).toBe(
      expected,
    );
  });

  it('missing CNIN description says SIRET in France, MERSIS No in Turkey', () => {
    expect(missingCninDescriptionKey('FR')).toBe(
      'missing_cnin_modal_description_siret',
    );
    expect(missingCninDescriptionKey('TR')).toBe(
      'missing_cnin_modal_description_mersis',
    );
  });

  it('missing CNIN CTA targets the SIRET search in FR, the CNIN input elsewhere', () => {
    expect(missingCninFieldToFocus('FR')).toBe('siretForm');
    expect(missingCninFieldToFocus('TR')).toBe(
      'ovh_field_companyNationalIdentificationNumber',
    );
  });
});

describe('MissingCninModal', () => {
  it('renders for an account carrying the certificate', async () => {
    const { queryByTestId } = renderWithClient(<MissingCninModal />);
    await waitFor(() =>
      expect(queryByTestId('missing-cnin-modal')).not.toBeNull(),
    );
  });

  it('is not shown again within the hour', async () => {
    vi.spyOn(usePreferencesModule, 'usePreferences').mockReturnValue({
      data: 10_000 - 60 * 60 + 1,
    } as UseQueryResult<number>);
    const { queryByTestId } = renderWithClient(<MissingCninModal />);
    await waitFor(() =>
      expect(mocks.notifyModalActionDone).toHaveBeenCalledWith(
        'MissingCninModal',
      ),
    );
    expect(queryByTestId('missing-cnin-modal')).toBeNull();
  });

  it('comes back after an hour', async () => {
    vi.spyOn(usePreferencesModule, 'usePreferences').mockReturnValue({
      data: 10_000 - 60 * 60,
    } as UseQueryResult<number>);
    const { queryByTestId } = renderWithClient(<MissingCninModal />);
    await waitFor(() =>
      expect(queryByTestId('missing-cnin-modal')).not.toBeNull(),
    );
  });

  it('"Later" stamps the preference with the server time and hands over', async () => {
    const { findByTestId } = renderWithClient(<MissingCninModal />);
    fireEvent.click(await findByTestId('missing-cnin-modal-later'));
    expect(mocks.createPreference).toHaveBeenCalledWith(10_000);
    expect(mocks.notifyModalActionDone).toHaveBeenCalledWith(
      'MissingCninModal',
    );
  });

  it('the CTA opens the account form on the CNIN field', async () => {
    const { findByTestId } = renderWithClient(<MissingCninModal />);
    fireEvent.click(await findByTestId('missing-cnin-modal-update'));
    expect(window.top.location.href).toBe(
      `${ACCOUNT_EDITION}?fieldToFocus=ovh_field_companyNationalIdentificationNumber`,
    );
  });
});
