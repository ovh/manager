import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import userEvent from '@testing-library/user-event';
import { Mock, vi } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import DataProtection from './DataProtection';
import {
  TDomainResource,
  DisclosureConfigurationEnum,
  TContactsConfiguration,
} from '@/domain/types/domainResource';
import { serviceInfoAuto, serviceInfoInCreation } from '@/domain/__mocks__/serviceInfo';
import { useAuthorizationIam } from '@ovh-ux/manager-react-components';
import { domainResourceOK } from '@/domain/__mocks__/serviceInfoDetail';

const createMockDomainResource = (
  contactsConfig: TContactsConfiguration,
): TDomainResource => ({
  ...domainResourceOK,
  currentState: {
    ...domainResourceOK.currentState,
    contactsConfiguration: contactsConfig,
  },
});

describe('DataProtection component', () => {
  const mockSetDataProtectionDrawerOpened = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthorizationIam as Mock).mockReturnValue({
      isPending: false,
      isAuthorized: true,
    });
  });

  describe('when data protection is ACTIVE', () => {
    it('should display active status badge', () => {
      const domainResource = createMockDomainResource({
        contactOwner: {
          id: 'owner-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.REDACTED,
            forcedDisclosureConfiguration: false,
            disclosedFields: [],
            visibleViaRdds: true,
          },
        },
        contactAdministrator: {
          id: 'admin-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.REDACTED,
            forcedDisclosureConfiguration: false,
            disclosedFields: [],
            visibleViaRdds: true,
          },
        },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      render(
        <DataProtection
          domainResource={domainResource}
          serviceInfo={serviceInfoAuto}
          setDataProtectionDrawerOpened={mockSetDataProtectionDrawerOpened}
        />,
        {
          wrapper,
        },
      );

      expect(
        screen.getByText('domain_tab_general_information_data_protection'),
      ).toBeInTheDocument();
    });

    it('should enable manage button when protection is active', async () => {
      const user = userEvent.setup();
      const domainResource = createMockDomainResource({
        contactOwner: {
          id: 'owner-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.REDACTED,
            forcedDisclosureConfiguration: false,
            disclosedFields: [],
            visibleViaRdds: true,
          },
        },
        contactAdministrator: { id: 'admin-id' },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      const { container } = render(
        <DataProtection
          domainResource={domainResource}
          serviceInfo={serviceInfoAuto}
          setDataProtectionDrawerOpened={mockSetDataProtectionDrawerOpened}
        />,
        {
          wrapper,
        },
      );

      // Verify that the action menu is enabled and open it
      const actionMenu = container.querySelector('#data-protection-action-menu');
      expect(actionMenu).toHaveAttribute('is-disabled', 'false');
      await user.click(actionMenu);
      // Find and click the button to open the data protection drawer
      const manageButton = container.querySelector('ods-button[label="domain_tab_general_information_data_protection_manage_button"]');
      await user.click(manageButton);
      expect(mockSetDataProtectionDrawerOpened).toHaveBeenCalledWith(true);
    });
  });

  describe('when data protection is PARTIAL', () => {
    it('should display partial status badge', () => {
      const domainResource = createMockDomainResource({
        contactOwner: {
          id: 'owner-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.REDACTED,
            forcedDisclosureConfiguration: false,
            disclosedFields: [],
            visibleViaRdds: true,
          },
        },
        contactAdministrator: {
          id: 'admin-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.DISCLOSED,
            forcedDisclosureConfiguration: false,
            disclosedFields: ['EMAIL', 'PHONE'],
            visibleViaRdds: true,
          },
        },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      render(
        <DataProtection
          domainResource={domainResource}
          serviceInfo={serviceInfoAuto}
          setDataProtectionDrawerOpened={mockSetDataProtectionDrawerOpened}
        />,
        {
          wrapper,
        },
      );

      expect(
        screen.getByText('domain_tab_general_information_data_protection'),
      ).toBeInTheDocument();
    });
  });

  describe('when data protection is NONE', () => {
    it('should display none status when no contacts are redacted', () => {
      const domainResource = createMockDomainResource({
        contactOwner: {
          id: 'owner-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.DISCLOSED,
            forcedDisclosureConfiguration: false,
            disclosedFields: ['EMAIL', 'NAME'],
            visibleViaRdds: true,
          },
        },
        contactAdministrator: { id: 'admin-id' },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      render(
        <DataProtection
          domainResource={domainResource}
          serviceInfo={serviceInfoAuto}
          setDataProtectionDrawerOpened={mockSetDataProtectionDrawerOpened}
        />,
        {
          wrapper,
        },
      );

      expect(
        screen.getByText('domain_tab_general_information_data_protection'),
      ).toBeInTheDocument();
    });
  });

  describe('when data protection is DISABLED', () => {
    it('should display only generic information when forceDisclosure is true', () => {
      const domainResource = createMockDomainResource({
        contactOwner: {
          id: 'owner-id',
          disclosurePolicy: {
            disclosureConfiguration: DisclosureConfigurationEnum.DISCLOSED,
            forcedDisclosureConfiguration: true,
            disclosedFields: ['EMAIL', 'NAME'],
            visibleViaRdds: true,
          },
        },
        contactAdministrator: { id: 'admin-id' },
        contactTechnical: { id: 'tech-id' },
        contactBilling: { id: 'billing-id' },
      });

      render(
        <DataProtection
          domainResource={domainResource}
          serviceInfo={serviceInfoAuto}
          setDataProtectionDrawerOpened={mockSetDataProtectionDrawerOpened}
        />,
        {
          wrapper,
        },
      );

      expect(
        screen.getByText(
          'domain_tab_general_information_data_protection_deactivated',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('when service is in creation', () => {
    it('the action button shoud be disabled', () => {
      const domainResource = createMockDomainResource({} as TContactsConfiguration);

      const { container } = render(
        <DataProtection
          domainResource={domainResource}
          serviceInfo={serviceInfoInCreation}
          setDataProtectionDrawerOpened={mockSetDataProtectionDrawerOpened}
        />,
        {
          wrapper,
        },
      );

      const actionMenu = container.querySelector('#data-protection-action-menu');
      expect(
        actionMenu
      ).toBeInTheDocument();
      expect(
        actionMenu,
      ).toHaveAttribute('is-disabled', 'true');
    });
  });

  describe('when customer is not allowed to modify the disclosure policy', () => {
    it('the action button shoud be disabled', () => {
      (useAuthorizationIam as Mock).mockReturnValue({
        isPending: false,
        isAuthorized: false,
      });

      const { container } = render(
        <DataProtection
          domainResource={domainResourceOK}
          serviceInfo={serviceInfoInCreation}
          setDataProtectionDrawerOpened={mockSetDataProtectionDrawerOpened}
        />,
        {
          wrapper,
        },
      );

      const actionMenu = container.querySelector('#data-protection-action-menu');
      expect(
        actionMenu
      ).toBeInTheDocument();
      expect(
        actionMenu,
      ).toHaveAttribute('is-disabled', 'true');
    });
  });
});
