/* eslint-disable import/no-extraneous-dependencies */
import { defineFeature, loadFeature } from 'jest-cucumber';
import { act, waitFor } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import { TestConfig, labels, renderWithShell, routeUrls } from '../utils';

const feature = loadFeature('../features/onboarding.feature', {
  loadRelativePath: true,
});

let context: Awaited<ReturnType<typeof renderWithShell>>;
let config: TestConfig;

defineFeature(feature, (test) => {
  afterEach(async () => {
    await context.queryClient.cancelQueries();
    context.queryClient.clear();
    context.unmount();
    context.server.close();
  });

  test('User wants to find informations related to vRack Services', ({
    given,
    when,
    then,
  }) => {
    given('User does not have any vRack Services', () => {
      config = { initialRoute: routeUrls.listing, nbVs: 0 };
    });

    when('User navigates to vRack Services Listing page', async () => {
      context = await renderWithShell(config);
    });

    then('User gets redirected to Onboarding page', async () => {
      await waitFor(() => context.getAllByText(labels.onboarding.newBadgeText));
    });

    then(
      /^User sees (\d+) guides on vRack Services$/,
      async (nbGuides: string) => {
        expect(
          Array.from(context.container.querySelectorAll('msc-tile')),
        ).toHaveLength(Number(nbGuides));
      },
    );
  });

  test.only('Users wants to create his first vRack Services', ({
    given,
    when,
    then,
  }) => {
    given('User is on the Onboarding page', async () => {
      config = { initialRoute: routeUrls.onboarding, nbVs: 0 };
      context = await renderWithShell(config);
    });

    when('User clicks on the vRack Services configuration button', async () => {
      await act(() =>
        userEvents.click(context.getByText(labels.onboarding.orderButtonLabel)),
      );
    });

    then('User navigates to Configuration page', async () => {
      await waitFor(() => context.getByText(labels.create.zoneDescription));
    });
  });
});
