import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import OnboardingTile from './OnboardingTile.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  Trans: ({ i18nKey, components }: any) => {
    if (components?.br) {
      return (
        <>
          {i18nKey.split('<br />').map((part: string, i: number) => (
            <React.Fragment key={i}>
              {part}
              {i < i18nKey.split('<br />').length - 1 && components.br}
            </React.Fragment>
          ))}
        </>
      );
    }
    return <>{i18nKey}</>;
  },
}));

describe('Onboarding component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Onboarding tile', async () => {
    render(
      <OnboardingTile
        content="myContent"
        description="myDescription"
        title="myTitle"
        linkName="myLinkName"
        href="myLinkHref"
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await waitFor(() => {
      expect(screen.getByTestId('onboarding-card')).toBeTruthy();
      expect(screen.getByText('myContent')).toBeTruthy();
      expect(screen.getByText('myDescription')).toBeTruthy();
      expect(screen.getByText('myTitle')).toBeTruthy();
    });
  });
});
