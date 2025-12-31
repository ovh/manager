import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Radio, RadioControl, RadioGroup } from '@ovhcloud/ods-react';
import { FlavorsTableTr } from '@/components/flavorsTable/FlavorsTableTr.component';

describe('FlavorsTableTr', () => {
  it('calls onClick when available', async () => {
    const event = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <table>
        <tbody>
          <FlavorsTableTr onClick={handleClick}>
            <td>Clickable row</td>
          </FlavorsTableTr>
        </tbody>
      </table>,
    );

    const row = screen.getByText('Clickable row');
    await event.click(row);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not check radio button when onClick is called while disabled', async () => {
    const event = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <RadioGroup>
        <table>
          <tbody>
            <FlavorsTableTr disabled onClick={handleClick}>
              <td>
                <Radio value="b3-256" className="w-full" disabled>
                  <RadioControl />
                </Radio>
              </td>
            </FlavorsTableTr>
          </tbody>
        </table>
      </RadioGroup>,
    );

    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();

    await event.click(radio);

    expect(radio).not.toBeChecked();
    expect(handleClick).not.toHaveBeenCalled();
  });
});
