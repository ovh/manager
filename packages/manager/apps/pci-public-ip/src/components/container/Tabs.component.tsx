import { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import { clsx } from 'clsx';

type TProps<Item> = {
  id: string;
  items: Item[];
  titleElement: (
    item: Item,
    selected: boolean,
    clickHandler?: () => void,
  ) => JSX.Element;
  contentElement: (item: Item) => JSX.Element;
  mobileBreakPoint?: number;
  className?: string;
};

export const TabsComponent = function TabsComponent<Item>({
  id,
  items,
  titleElement,
  contentElement,
  mobileBreakPoint,
  className,
}: TProps<Item>): JSX.Element {
  const [item, setItem] = useState<Item>(null);
  const isDesktop = useMedia(`(min-width: ${mobileBreakPoint || 760}px)`);

  useEffect(() => {
    if (!item) setItem(items[0]);
  }, [items]);

  return (
    <>
      {isDesktop ? (
        <section className={clsx('rounded-sm', className)}>
          <ul className="flex flex-row list-none p-0 m-0 w-full">
            {items.map(($item, index) => (
              <li
                key={`tabs-${id}title-${index}`}
                className={clsx(
                  'px-4 py-4 cursor-pointer border border-solid border-[#bef1ff] rounded-t-lg',
                  $item === item
                    ? 'border-b-0 bg-[#F5FEFF]'
                    : 'border-b bg-white',
                )}
                onClick={() => setItem($item)}
                onKeyDown={() => setItem($item)}
                role="button"
              >
                {titleElement($item, $item === item)}
              </li>
            ))}
            <li
              key={'none'}
              className="border-0 border-b border-solid border-b-[#bef1ff] w-full"
            ></li>
          </ul>
          <div className="bg-[#F5FEFF] border border-solid border-[#bef1ff] border-t-0">
            {contentElement(item)}
          </div>
        </section>
      ) : (
        <section className={clsx('grid gap-6 grid-cols-1', className)}>
          {items.map(($item, index) => (
            <div
              key={`item-${index}`}
              className="px-2 bg-[#F5FEFF] border border-solid border-[#bef1ff] rounded-lg"
            >
              <div>
                {titleElement($item, $item === item, () => {
                  setItem($item);
                })}
              </div>
              <div>{$item === item && contentElement($item)}</div>
            </div>
          ))}
        </section>
      )}
    </>
  );
};
