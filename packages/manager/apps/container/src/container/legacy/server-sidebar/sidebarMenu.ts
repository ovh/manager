export type SidebarMenuItem = {
  id: string | number;
  label?: string;
  title?: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string;
  isExternal?: boolean;
  routeMatcher?: RegExp;
  pathMatcher?: RegExp;
  subItems?: SidebarMenuItem[];
  parent?: SidebarMenuItem;
  depth?: number;

  parentName?: string;
  serviceName?: string;
  extraParams?: Record<string, string>;
  stateParams?: (number | string)[];
  searchParams?: string[];

  loader?: () => Promise<SidebarMenuItem[]>;
  isLoading?: boolean;
  loadingError?: string;

  searchField?: string;
  searchQuery?: string;
  keywords?: string;
  minSearchItems?: number;
  hiddenBySearch?: boolean;
  ignoreSearch?: boolean;
  isNoResultField?: boolean;

  isOpen?: boolean;
  isSelected?: boolean;
};

// perform search query on given item using item label and keywords
export const itemSearchMatch = (item: SidebarMenuItem, query: string) => {
  if (item.label?.toLowerCase().indexOf(query?.trim().toLowerCase()) >= 0) {
    return true;
  }
  if (
    item.serviceName?.toLowerCase().indexOf(query?.trim().toLowerCase()) >= 0
  ) {
    return true;
  }
  if (item.keywords?.toLowerCase().indexOf(query?.trim().toLowerCase()) >= 0) {
    return true;
  }
  return false;
};

// async load item's subItems by using it's loader function
export async function loadItem(item: SidebarMenuItem): Promise<void> {
  item.isLoading = true;
  item.loadingError = '';
  return item
    .loader()
    .then((children) => {
      item.subItems = children?.filter((i) => i);
    })
    .catch((e) => {
      item.loadingError = e?.message || 'Error';
      item.subItems = [];
    })
    .finally(() => {
      item.isLoading = false;
    });
}

// remove null values from menu
export function sanitizeMenu(root: SidebarMenuItem) {
  const sanitizeRecur = (item: SidebarMenuItem) => {
    if (!item) return;
    item.subItems = item.subItems?.filter((i) => i);
    item.subItems?.forEach(sanitizeRecur);
  };
  sanitizeRecur(root);
  return root;
}

// computes and updates 'depth' & 'parent' attributes of items in the tree
export function syncTree(root: SidebarMenuItem) {
  const updateRecur = (item: SidebarMenuItem, parent?: SidebarMenuItem) => {
    item.parent = parent;
    item.depth = parent ? parent.depth + 1 : -1;
    item.subItems?.forEach((child) => updateRecur(child, item));
  };
  updateRecur(root);
  return root;
}

// perform recursive search on the given menu item, marking item that needs
// to be hidden from the search results
export function filterBySearch(
  menu: SidebarMenuItem,
  refresh: CallableFunction,
) {
  // mark all tree items as visible
  const unhideAll = (menu: SidebarMenuItem) => {
    menu.hiddenBySearch = false;
    menu.subItems?.forEach(unhideAll);
  };
  // mark all parents of given item as visible
  const revealParents = (item: SidebarMenuItem) => {
    let { parent } = item;
    while (parent) {
      parent.hiddenBySearch = false;
      parent = parent.parent;
    }
  };
  // perform recursive search in the tree
  const searchRecursive = (item: SidebarMenuItem, query?: string) => {
    // ignore loading items or search field items
    if (item.ignoreSearch || item.searchField || item.isLoading) {
      return;
    }
    // if we have a search query perform it
    if (query) {
      item.hiddenBySearch = true;
      // if item has a loader, call it and perform the search again later
      if (item.loader && !item.isLoading && !item.subItems) {
        item.hiddenBySearch = false;
        loadItem(item).finally(() => refresh());
        // else we check if the item matches
      } else if (itemSearchMatch(item, query)) {
        item.hiddenBySearch = false;
        // if it's a parent item we stop here, all children will be visible
        if (item.subItems?.length) {
          return;
          // if it's a leaf item, reveal all of his parents in the tree
        }
        revealParents(item);
      }
    }
    // perform the search on each subItems
    item.subItems?.forEach((subItem) =>
      searchRecursive(subItem, item.searchQuery || query),
    );
  };
  syncTree(menu);
  unhideAll(menu);
  searchRecursive(menu);
  return menu;
}

// automatically add search fields in the menu depending on subItems list length
export function updateSearchFields(menu: SidebarMenuItem, minSearchSize = 2) {
  const updateSearchFieldsRec = (subItems: SidebarMenuItem[]) => {
    subItems?.forEach((item: SidebarMenuItem) => {
      const searchField = item.subItems?.find(
        (child) => 'searchField' in child,
      );
      const min =
        item.minSearchItems === undefined ? minSearchSize : item.minSearchItems;
      let hasSearchField = !!searchField;

      const subItemsLength =
        item.subItems?.filter((i) => !i.ignoreSearch)?.length || 0;

      // if search field exists but items count is lower than threshold remove the search field
      if (searchField && subItemsLength < min) {
        item.subItems.splice(item.subItems.indexOf(searchField), 1);
        hasSearchField = false;
        // if there is no search field already and we have many items, add a search field
      } else if (!searchField && subItemsLength >= min) {
        item.subItems?.unshift({
          id: `${item.id}-search-field`,
          label: '',
          depth: item.depth + 1,
          parent: item.parent,
          searchField: '',
        });
        hasSearchField = true;
      }

      // since search field are searching in all sub items, we might only add a search field
      // in the sub items if the parent item doesn't have one already
      if (!hasSearchField) {
        updateSearchFieldsRec(item.subItems);
      }
    });
  };
  updateSearchFieldsRec(menu.subItems);
  return menu;
}

export function unselectAll(menu: SidebarMenuItem) {
  const unselectAllRecur = (item: SidebarMenuItem) => {
    item.isSelected = false;
    item.subItems?.forEach(unselectAll);
  };
  unselectAllRecur(menu);
}

// select the given toSelect item in the menu, unselect every previously selected items
// expand (open) all the parents of the selected item
export async function selectItem(
  menu: SidebarMenuItem,
  toSelect: SidebarMenuItem,
) {
  unselectAll(menu);
  syncTree(menu);
  let { parent } = toSelect;
  toSelect.isSelected = true;
  while (parent) {
    parent.isOpen = true;
    parent = parent.parent;
  }
}

// find and select the item corresponding to the given route
export async function selectActiveItem(
  menu: SidebarMenuItem,
  route: string,
  path: string,
  onMenuChange: CallableFunction,
): Promise<SidebarMenuItem> {
  const findMatchingItem = async (
    item: SidebarMenuItem,
  ): Promise<SidebarMenuItem> => {
    if (
      item.depth < 0 ||
      item.routeMatcher?.test(route) ||
      item.pathMatcher?.test(path) ||
      (item.serviceName && route.indexOf(item.serviceName) >= 0) ||
      item.href?.endsWith(route)
    ) {
      if (
        item.routeMatcher &&
        !item.routeMatcher.test(route) &&
        item.pathMatcher &&
        !item.pathMatcher.test(path)
      ) {
        return null;
      }
      selectItem(menu, item);
      onMenuChange();
      let loadItemPromise = Promise.resolve();
      if (item.loader && !item.isLoading && !item.subItems) {
        loadItemPromise = loadItem(item);
        onMenuChange();
      }
      await loadItemPromise;
      onMenuChange();
      const matchingSubItems = await Promise.all(
        item.subItems?.map((subItem) => findMatchingItem(subItem)) || [],
      );
      const matchingSubItem = matchingSubItems.find(
        (subItem) => subItem !== null,
      );
      return matchingSubItem || item;
    }
    return null;
  };

  unselectAll(menu);
  return route ? findMatchingItem(menu) : Promise.resolve(null);
}

export function updateSidebarItemLabel(
  menu: SidebarMenuItem,
  serviceName: string,
  label: string,
) {
  const updateRecur = (item: SidebarMenuItem) => {
    if (item.serviceName === serviceName) {
      item.label = label;
    }
    item.subItems?.forEach(updateRecur);
  };
  updateRecur(menu);
}

type FlattenMenuOptions = {
  addNoResultsItems?: boolean;
};

// convert the tree like menu structure to an array of items
export function flattenMenu(
  menu: SidebarMenuItem,
  options: FlattenMenuOptions = {
    addNoResultsItems: false,
  },
) {
  const result: SidebarMenuItem[] = [];
  const flatten = (item: SidebarMenuItem) => {
    if (!item || item.hiddenBySearch) return;
    result.push(item);
    if (item === menu || item.isOpen) {
      item.subItems?.forEach(flatten);
      if (
        options?.addNoResultsItems &&
        item.isOpen &&
        item.depth >= 0 &&
        !item.isLoading &&
        item.subItems &&
        item.subItems.filter(
          (i) => !i.hiddenBySearch && (i.serviceName || i.loader || i.subItems),
        ).length <= 0
      ) {
        result.push({
          id: `${item.id}-no-results`,
          depth: item.depth + 1,
          parent: item,
          isNoResultField: true,
        });
      }
    }
  };
  flatten(menu);
  result.shift();
  return result;
}
