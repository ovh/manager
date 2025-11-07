import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Resource } from "@/types/Resource.type";
import { Tenant } from "@/types/Tenant.type";
import { WithRegion } from "@/types/Utils.type";
import { ConnectedVaults } from "../ConnectedVaults.component";
import { TENANTS_MOCKS } from "@/mocks/tenant/tenants.mock";

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: vi.fn().mockImplementation((key: string, options?: Record<string, any>) => {
      if (key === "number_of_connected_vaults") {
        const count = options?.connectedVaultCount ?? 0;
        return `Nombre de vaults connectés : ${count}`;
      }
      return key;
    }),
  }),
}));
  
describe("ConnectedVaults Component", () => {
  it.each([
    {
      name: "should display number of connected vaults",
      tenantDetails: TENANTS_MOCKS[0] as Resource<WithRegion<Tenant>>,
      expectedText: "Nombre de vaults connectés : 0",
    },
    {
      name: "should display Nombre de vaults connectés : 3 when there is no connected vault",
      tenantDetails: TENANTS_MOCKS[1] as Resource<WithRegion<Tenant>>,
      expectedText: "Nombre de vaults connectés : 3",
    },
    {
      name: "should display Nombre de vaults connectés : 0 when tenantDetails is missing",
      tenantDetails: undefined,
      expectedText: "Nombre de vaults connectés : 0",
    },
  ])("$name", ({ tenantDetails, expectedText }) => {
    render(<ConnectedVaults tenantDetails={tenantDetails} />);
    screen.debug();
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});
