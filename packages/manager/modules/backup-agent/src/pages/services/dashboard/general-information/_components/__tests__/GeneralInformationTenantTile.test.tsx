import { vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { GeneralInformationTenantTile } from "../general-information-tenant-tile/GeneralInformationTenantTile.component";
import { GeneralInformationTileProps } from "@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component";
import { TENANTS_MOCKS } from "@/mocks/tenant/tenants.mock";

const { useBackupTenantDetailsMock } = vi.hoisted(() => ({
  useBackupTenantDetailsMock: vi.fn()
}))

vi.mock('@/data/hooks/tenants/useBackupTenantDetails', () => ({
  useBackupTenantDetails: useBackupTenantDetailsMock
}))

vi.mock('@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component', () => ({
  GeneralInformationTile: <T extends { name: string }>({ resourceDetails, isLoading }: GeneralInformationTileProps<T>) => isLoading ? (<>is loading</>) : (<>{resourceDetails?.currentState.name}</>)
}))

describe('GeneralInformationTenantTile', () => {
  it("Should render GeneralInformationTenantTile component", async () => {
    useBackupTenantDetailsMock.mockReturnValue({ data: TENANTS_MOCKS[0]!, isLoading: false })
    const { container } = render(<GeneralInformationTenantTile tenantId={TENANTS_MOCKS[0]!.id} />)

    await expect(container).toBeAccessible();

    expect(screen.getByText(TENANTS_MOCKS[0]!.currentState.name)).toBeVisible()
  })

  it("Should render GeneralInformationTenantTile component", async () => {
    useBackupTenantDetailsMock.mockReturnValue({ data: TENANTS_MOCKS[0]!, isLoading: true })
    const { container } = render(<GeneralInformationTenantTile tenantId={TENANTS_MOCKS[0]!.id} />)

    await expect(container).toBeAccessible();

    expect(screen.getByText('is loading')).toBeVisible()
  })
});
