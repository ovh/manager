import { vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import {mockVaults} from "@/mocks/vault/vaults";

import { SubscriptionTile } from "../subscription-tile/SubscriptionTile.component"

const LABELS_VISIBLES = [`${NAMESPACES.BILLING}:subscription`, `${NAMESPACES.DASHBOARD}:consumption`, 'dashboard:type_billing']


const { useBackupVaultDetailsMock } = vi.hoisted(() => ({
  useBackupVaultDetailsMock: vi.fn()
}))

vi.mock('@/data/hooks/vault/getVaultDetails', () => ({
  useBackupVaultDetails: useBackupVaultDetailsMock
}))

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockReturnValue({
    t: vi.fn().mockImplementation((key: string) => key),
  })
}))


describe('SubscriptionTile', () => {
  it("Should render SubscriptionTile component", async () => {
    useBackupVaultDetailsMock.mockReturnValue({ data: mockVaults[0]!, isLoading: false })
    const { container } = render(<SubscriptionTile vaultId={mockVaults[0]!.id} />)

    await expect(container).toBeAccessible();

    LABELS_VISIBLES.forEach(label => {
      expect(screen.getByText(label)).toBeVisible()
    })
  })
});
