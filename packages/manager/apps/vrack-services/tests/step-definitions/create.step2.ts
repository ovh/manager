/* eslint-disable import/no-extraneous-dependencies */
import { defineFeature, loadFeature } from 'jest-cucumber';
import { waitFor } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import { TestConfig, labels, renderWithShell, routeUrls } from '../utils';

const feature = loadFeature('../features/create.feature', {
  loadRelativePath: true,
});

let context: Awaited<ReturnType<typeof renderWithShell>>;
let config: TestConfig;

defineFeature(feature, (test) => {
  test('User can create a vRack Services', ({ given, when, then }) => {
    afterEach(() => {
      context.server.close();
      context.unmount();
    });

    given(/^User has (.*) vRack Services$/, (nbVsStr: string) => {
      config = { nbVs: Number(nbVsStr) };
    });

    when('User navigates to vRack Services Listing page', async () => {
      context = await renderWithShell({
        initialRoute: routeUrls.listing,
        ...config,
      });
    });

    then(
      /^User sees the create a vRack Services button (.*)$/,
      (buttonState: 'enabled' | 'disabled') => {
        const button = context.getByText(
          labels.listing.createVrackServicesButtonLabel,
        );
        if (buttonState === 'enabled') {
          expect(button.getAttribute('disabled')).toBeNull();
        } else {
          expect(button.getAttribute('disabled')).toBeDefined();
        }
      },
    );
  });

  test('User wants to create a new vRack Services', ({ given, when, then }) => {
    let vsData: { name?: string; zone: string };

    afterEach(() => {
      context.server.close();
      context.unmount();
    });

    given(
      /^User wants to create a vRack Services with name (.*) and zone (.*)$/,
      (name: string, zone: string) => {
        vsData = { name, zone };
      },
    );

    given(
      /^The order service for vRack Services is (.*)$/,
      (vsOrderState: 'KO' | 'OK') => {
        config = {
          nbVs: 1,
          vrackServicesOrderKo: vsOrderState === 'KO',
        };
      },
    );

    given(/^The order service for vRack is (.*)$/, (vrackOrderState) => {
      config.vrackOrderKo = vrackOrderState === 'KO';
    });

    when(
      'User fills the configuration form and click the submit button',
      async () => {
        context = await renderWithShell({
          initialRoute: routeUrls.create,
          ...config,
        });
        const displayNameInput = context.getByPlaceholderText(
          labels.create.displayNamePlaceholder,
        );
        await userEvents.type(displayNameInput, vsData.name);

        const zoneRadioButton = await context.findByText(vsData.zone, {
          exact: false,
        });
        await userEvents.click(zoneRadioButton);

        await userEvents.click(
          context.getByText(labels.create.createButtonLabel, {
            selector: 'osds-button',
          }),
        );
      },
    );

    then(
      'A modal appear to ask if the user wants to create a new vRack',
      async () => {
        await waitFor(() =>
          expect(
            context.container
              .querySelector('osds-modal')
              .getAttribute('masked'),
          ).toBeNull(),
        );
      },
    );

    when(/^User (.*)$/, async (choice: 'accepts' | 'denies' | 'cancel') => {
      const buttonLabelByChoice = {
        accepts: labels.create.modalConfirmVrackButtonLabel,
        denies: labels.create.modalNoVrackButtonLabel,
        cancel: labels.create.modalCancelButtonLabel,
      };

      await userEvents.click(context.getByText(buttonLabelByChoice[choice]));
    });

    then(
      /^User (.*) on the Listing page$/,
      async (returnsListing: 'returns' | "doesn't return") => {
        const labelOnPage =
          returnsListing === 'returns'
            ? labels.listing.description
            : labels.create.zoneDescription;
        await waitFor(() => context.getByText(labelOnPage));
      },
    );

    then(/^User sees (.*) error message$/, async (anyError: 'an' | 'no') => {
      const message = context.queryByText(
        labels.create.creationServiceError.replace(/{{.*}}/, ''),
        { exact: false },
      );
      if (anyError === 'an') {
        expect(message).toBeDefined();
      } else {
        expect(message).toBeNull();
      }
    });
  });
});
