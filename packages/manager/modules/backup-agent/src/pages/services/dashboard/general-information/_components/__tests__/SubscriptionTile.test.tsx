import { vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { mockVaults } from "@/mocks/vaults/vaults";

import { SubscriptionTile } from "../subscription-tile/SubscriptionTile.component"
import { TENANTS_MOCKS } from "@/mocks/tenant/tenants.mock";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const LABELS_VISIBLES = [`${NAMESPACES.BILLING}:subscription`]


const { useBackupVaultDetailsMock } = vi.hoisted(() => ({
  useBackupVaultDetailsMock: vi.fn()
}))

vi.mock('@/data/hooks/vaults/getVaultDetails', () => ({
  useBackupVaultDetails: useBackupVaultDetailsMock
}))

const { useBackupTenantDetailsMock } = vi.hoisted(() => ({
  useBackupTenantDetailsMock: vi.fn()
}))

vi.mock('@/data/hooks/tenants/useBackupTenantDetails', () => ({
  useBackupTenantDetails: useBackupTenantDetailsMock
}))

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: vi.fn().mockImplementation((key: string) => key),
  })
}))


describe('SubscriptionTile', () => {
  it("Should render SubscriptionTile component", async () => {
    const queryClient = new QueryClient();
    useBackupVaultDetailsMock.mockReturnValue({ data: mockVaults[0]!, isLoading: false })
    useBackupTenantDetailsMock.mockReturnValue({ data: TENANTS_MOCKS[0]!, isLoading: false })
    const { container } = render(<QueryClientProvider client={queryClient}><MemoryRouter><SubscriptionTile tenantId={mockVaults[0]!.id} /></MemoryRouter></QueryClientProvider>)

    await expect(container).toBeAccessible();

    LABELS_VISIBLES.forEach(label => {
      expect(screen.getByText(label)).toBeVisible()
    })
  })
});
