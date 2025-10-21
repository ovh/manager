import { render } from "@testing-library/react"
import {
  ConsumptionDetails
} from "../ConsumptionDetails.component";

describe("ConsumptionDetails component a11y", () => {
  it("Should render ConsumptionDetails component", async () => {
    const { container } = render(<ConsumptionDetails />)

    await expect(container).toBeAccessible();
  })
});
