import { useCallback, useEffect, useState } from 'react';

const useHorizontalScroll = () => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return undefined;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (element.children[1]) {
        element.children[1].scrollLeft += e.deltaY;
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [element]);

  return ref;
};

export default useHorizontalScroll;
