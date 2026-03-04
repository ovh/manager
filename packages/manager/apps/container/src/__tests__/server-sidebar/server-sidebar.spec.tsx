import {
  filterBySearch,
  flattenMenu,
  loadItem,
  selectItem,
  syncTree,
  SidebarMenuItem,
  updateSidebarItemLabel,
  unselectAll,
} from '../../container/legacy/server-sidebar/sidebarMenu';

describe('Tree structure', () => {
  it('updates the tree structure', () => {
    const subAA: SidebarMenuItem = {
      id: 'subAA',
      subItems: [],
    };
    const subA: SidebarMenuItem = {
      id: 'subA',
      subItems: [subAA],
    };
    const subB: SidebarMenuItem = {
      id: 'subB',
      subItems: [],
    };
    const menu: SidebarMenuItem = {
      id: 'menu',
      subItems: [subA, subB],
    };
    syncTree(menu);
    // the root menu has a negative depth because it is never displayed
    expect(menu.depth).toBe(-1);
    expect(subA.depth).toBe(0);
    expect(subB.depth).toBe(0);
    expect(subAA.depth).toBe(1);
    expect(subA.parent).toBe(menu);
    expect(subB.parent).toBe(menu);
    expect(subAA.parent).toBe(subA);
  });
});

describe('Rendering the menu', () => {
  it('convert the tree structure to a flat list', () => {
    const menu: SidebarMenuItem = {
      id: 'menu',
      subItems: [
        {
          id: 'a',
          subItems: [
            {
              id: 'aa',
            },
          ],
        },
        {
          id: 'b',
        },
      ],
    };
    let asList = flattenMenu(menu);
    expect(asList.length).toBe(2);
    expect(asList[0]).toBe(menu.subItems[0]);
    expect(asList[1]).toBe(menu.subItems[1]);

    menu.subItems[0].isOpen = true;
    asList = flattenMenu(menu);
    expect(asList.length).toBe(3);
    expect(asList[0]).toBe(menu.subItems[0]);
    expect(asList[1]).toBe(menu.subItems[0].subItems[0]);
    expect(asList[2]).toBe(menu.subItems[1]);
  });

  it('does add all the subItems of the root menu element to the list', () => {
    const subMenuA: SidebarMenuItem = {
      id: 'menu1',
    };
    const subMenuB: SidebarMenuItem = {
      id: 'menu2',
    };
    const menu: SidebarMenuItem = {
      id: 'home',
      subItems: [subMenuA, subMenuB],
    };

    const asList = flattenMenu(menu);
    expect(asList.length).toBe(2);
    expect(asList[0]).toBe(subMenuA);
    expect(asList[1]).toBe(subMenuB);
  });

  it('does not add menu subItems in the list if the parent item is not open', () => {
    const subMenuAA = {
      id: 'menu2',
    };
    const subMenuA = {
      id: 'menu1',
      isOpen: false,
      subItems: [subMenuAA],
    };
    const menu: SidebarMenuItem = {
      id: 'home',
      subItems: [subMenuA],
    };

    const asList = flattenMenu(menu);
    expect(asList.length).toBe(1);
    expect(asList[0]).toBe(subMenuA);
  });

  it('does add menu subItems in the list if the parent item is open', () => {
    const subMenuAA = {
      id: 'menu2',
    };
    const subMenuAB = {
      id: 'menu3',
    };
    const subMenuA = {
      id: 'menu1',
      isOpen: true,
      subItems: [subMenuAA, subMenuAB],
    };
    const menu: SidebarMenuItem = {
      id: 'home',
      subItems: [subMenuA],
    };

    const asList = flattenMenu(menu);
    expect(asList.length).toBe(3);
    expect(asList[0]).toBe(subMenuA);
    expect(asList[1]).toBe(subMenuAA);
    expect(asList[2]).toBe(subMenuAB);
  });

  it('gives correct items depth to the list', () => {
    const menu: SidebarMenuItem = {
      id: 'home',
      subItems: [
        {
          id: 'a',
          isOpen: true,
          subItems: [
            {
              id: 'aa',
              isOpen: true,
              subItems: [
                {
                  id: 'aaa',
                },
              ],
            },
            {
              id: 'ab',
            },
          ],
        },
        {
          id: 'b',
        },
      ],
    };

    const asList = flattenMenu(syncTree(menu));
    expect(asList.length).toBe(5);
    expect(asList[0].depth).toBe(0);
    expect(asList[1].depth).toBe(1);
    expect(asList[2].depth).toBe(2);
    expect(asList[3].depth).toBe(1);
    expect(asList[4].depth).toBe(0);
  });
});

describe('Item asynchronous loading', () => {
  it('loads children asynchronously for items with loader function', () => {
    const item: SidebarMenuItem = {
      id: 'item',
      loader: () =>
        new Promise((resolve) => {
          resolve([
            {
              id: 'a',
            },
            {
              id: 'b',
            },
          ]);
        }),
    };
    expect(item.subItems).toBeUndefined();
    loadItem(item).then(() => {
      expect(item.subItems.length).toBe(2);
    });
  });

  it('handle loading errors', () => {
    const item: SidebarMenuItem = {
      id: 'item',
      loader: () =>
        new Promise((_, reject) => {
          reject(new Error('fail'));
        }),
    };
    expect(item.loadingError).not.toBeDefined();
    loadItem(item).finally(() => {
      expect(item.loadingError).toBeDefined();
    });
  });
});

describe('Item selection', () => {
  it('select and item and open his parents', () => {
    const toSelect: SidebarMenuItem = {
      id: 'selection',
    };
    const menu: SidebarMenuItem = {
      id: 'item',
      isOpen: false,
      subItems: [
        {
          id: 'a',
          isOpen: false,
          subItems: [toSelect],
        },
        {
          id: 'b',
          isOpen: false,
          subItems: [
            {
              id: 'b0',
            },
          ],
        },
      ],
    };
    expect(menu.isOpen).toBeFalsy();
    expect(toSelect.isSelected).toBeFalsy();
    selectItem(menu, toSelect).then(() => {
      expect(toSelect.isSelected).toBe(true);
      expect(menu.isOpen).toBe(true);
      expect(menu.subItems[0].isOpen).toBe(true);
      expect(menu.subItems[1].isOpen).toBeFalsy();
    });
  });

  it('deselect all items', () => {
    const item: SidebarMenuItem = {
      id: 'item',
      isSelected: true,
      subItems: [
        {
          id: 'a',
          isSelected: false,
        },
        {
          id: 'b',
          isSelected: true,
        },
      ],
    };
    unselectAll(item);
    expect(item.isSelected).toBe(false);
    expect(item.subItems[0].isSelected).toBe(false);
    expect(item.subItems[1].isSelected).toBe(false);
  });
});

describe('Updating items', () => {
  it('updates an item label identified by serviceName', () => {
    const menu: SidebarMenuItem = {
      id: 'menu',
      subItems: [
        {
          id: 'foo',
          label: 'foo-label',
          serviceName: 'service-0',
        },
        {
          id: 'bar',
          label: 'bar-label',
          serviceName: 'service-1',
        },
      ],
    };
    updateSidebarItemLabel(menu, 'service-0', 'test');
    expect(menu.subItems[0].label).toBe('test');
    expect(menu.subItems[1].label).toBe('bar-label');
  });
});

describe('Searching in the menu', () => {
  it('it hides items not matching the search query', () => {
    const a: SidebarMenuItem = {
      id: 'a',
      label: 'a',
    };
    const b: SidebarMenuItem = {
      id: 'b',
      label: 'b',
    };
    const foo: SidebarMenuItem = {
      id: 'foo',
      label: 'foo',
      searchQuery: 'b',
      isOpen: true,
      subItems: [a, b],
    };
    const menu: SidebarMenuItem = {
      id: 'home',
      label: 'home',
      subItems: [foo],
    };

    filterBySearch(menu, undefined);
    expect(a.hiddenBySearch).toBe(true);
    expect(b.hiddenBySearch).toBe(false);
  });
});
