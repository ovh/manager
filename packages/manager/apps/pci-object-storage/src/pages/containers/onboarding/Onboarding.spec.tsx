// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import { render, screen, waitFor } from '@testing-library/react';

// import Onboarding from '@/pages/services/onboarding/Onboarding.page';

// import { getProject } from '@/data/project/project.api';
// import { Locale } from '@/hooks/useLocale';
// import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
// import {
//   mockedPciProject,
//   mockedPciDiscoveryProject,
// } from '@/__tests__/helpers/mocks/project';

// describe('Onboarding page', () => {
//   beforeEach(() => {
//     vi.restoreAllMocks();

//     // Mock necessary hooks and dependencies
//     vi.mock('react-i18next', () => ({
//       useTranslation: () => ({
//         t: (key: string) => key,
//       }),
//       Trans: ({ children }: { children: React.ReactNode }) => children,
//     }));
//     vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
//       const mod = await importOriginal<
//         typeof import('@ovh-ux/manager-react-shell-client')
//       >();
//       return {
//         ...mod,
//         useShell: vi.fn(() => ({
//           i18n: {
//             getLocale: vi.fn(() => Locale.fr_FR),
//             onLocaleChange: vi.fn(),
//             setLocale: vi.fn(),
//           },
//         })),
//       };
//     });
//     vi.mock('@/data/project/project.api', () => ({
//       getProject: vi.fn(() => mockedPciProject),
//     }));
//   });
//   afterEach(() => {
//     vi.clearAllMocks();
//   });
//   it('renders the onBoarding Page', async () => {
//     render(<Onboarding />, { wrapper: RouterWithQueryClientWrapper });
//     await waitFor(() => {
//       expect(
//         screen.getByTestId('onboarding-container-test'),
//       ).toBeInTheDocument();
//       const onboardingCards = screen.getAllByTestId('onboarding-card');
//       expect(onboardingCards.length).toBeGreaterThan(0);
//       expect(onboardingCards[0]).toBeInTheDocument();
//     });
//   });

//   it('renders discovery banner when it is discovery mode', async () => {
//     vi.mocked(getProject).mockResolvedValue(mockedPciDiscoveryProject);
//     render(<Onboarding />, { wrapper: RouterWithQueryClientWrapper });
//     await waitFor(() => {
//       expect(screen.getByTestId('discovery-container')).toBeInTheDocument();
//     });
//   });

//   it('does not render discovery banner when it is  not discovery mode', async () => {
//     render(<Onboarding />, { wrapper: RouterWithQueryClientWrapper });
//     await waitFor(() => {
//       expect(
//         screen.queryByTestId('discovery-container'),
//       ).not.toBeInTheDocument();
//     });
//   });
// });
