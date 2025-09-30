import { act, render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FlavorsTableTr } from "@/components/flavorsTable/FlavorsTableTr.component";
import { Radio, RadioControl, RadioGroup } from '@ovhcloud/ods-react';

describe("FlavorsTableTr", () => {
  it('calls onClick when available', () => {
    const handleClick = vi.fn();
    render(
      <table>
        <tbody>
        <FlavorsTableTr onClick={handleClick}>
          <td>Clickable row</td>
        </FlavorsTableTr>
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText('Clickable row'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when unavailable', () => {
    const handleClick = vi.fn();
    render(
      <table>
        <tbody>
        <FlavorsTableTr unavailable onClick={handleClick}>
          <td>Disabled row</td>
        </FlavorsTableTr>
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText('Disabled row'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not check radio button when onClick is called while unavailable', () => {
    const handleClick = vi.fn();

    render(
      <RadioGroup>
        <table>
          <tbody>
            <FlavorsTableTr unavailable={true} onClick={handleClick}>
              <td>
                <Radio value="b3-256" className="w-full" disabled>
                  <RadioControl />
                </Radio>
              </td>
            </FlavorsTableTr>
          </tbody>
        </table>
      </RadioGroup>
    );

    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();

    act(() => {
      fireEvent.click(radio);
    });

    expect(radio).not.toBeChecked();
  });
});
