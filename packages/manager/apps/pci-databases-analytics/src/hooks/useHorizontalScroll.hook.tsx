import { useEffect, useRef } from 'react';

const useHorizontalScroll = () => {
  const ref = useRef(null);

  useEffect(() => {
    const scrollContainer = ref.current;
    if (!scrollContainer) return undefined;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollContainer.children[1]) {
        scrollContainer.children[1].scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return ref;
};

export default useHorizontalScroll;
