import { describe, it, test, vi } from 'vitest';
import { render, act, fireEvent } from '@testing-library/react';
import RolesSelector from './RolesSelector';
import { Role } from '@/interface';

const renderComponent = (
  allRoles: Role[],
  onInput: () => void = () => {},
  preselectedRoles: Role[] = [],
) => {
  return render(
    <RolesSelector
      allRoles={allRoles}
      preSelectedRoles={preselectedRoles}
      onInput={onInput}
    />,
  );
};

const SELECTOR = 'osds-checkbox';

describe('RolesSelector', () => {
  const createRoles = (count: number): Role[] =>
    [...Array(count).keys()].map((i) => ({
      id: `id${i}`,
      name: `name${i}`,
    })) as Role[];

  it('should display checkbox for every role', async () => {
    const result = renderComponent(createRoles(6));
    const elements = Array.from(result.container.querySelectorAll(SELECTOR));
    expect(elements.length).toBe(6);
  });

  test('preselected roles should be checked', () => {
    const roles = createRoles(10);
    // even roles are selected
    const selectedRoles = roles.filter((_role, index) => index % 2 === 0);
    const result = renderComponent(roles, () => {}, selectedRoles);

    const elements = Array.from(result.container.querySelectorAll(SELECTOR));

    expect(
      elements
        .filter((_element, index) => index % 2 === 0)
        .every((element) => element.checked),
    ).toBe(true);
  });

  test('non preselected roles should not be checked', () => {
    const roles = createRoles(10);
    // only even roles are selected
    const selectedRoles = roles.filter((_role, index) => index % 2 === 0);
    const result = renderComponent(roles, () => {}, selectedRoles);

    const elements = Array.from(result.container.querySelectorAll(SELECTOR));

    expect(
      elements
        .filter((_element, index) => index % 2 === 1)
        .every((element) => element.checked),
    ).toBe(false);
  });

  it('should call callback with right data for every change', () => {
    const roles = createRoles(10);
    const fn = vi.fn();

    const result = renderComponent(roles, fn);

    const element = result.container.querySelector('[value=id8]');

    act(() => {
      fireEvent.click(element!);
    });
    expect(fn).toHaveBeenCalledWith([{ id: 'id8', name: 'name8' }]);
  });
});
