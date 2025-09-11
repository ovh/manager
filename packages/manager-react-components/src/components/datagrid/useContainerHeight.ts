import { useState, useEffect, RefObject } from 'react';

export const useContainerHeight = ({
  tableContainerRef,
}: {
  tableContainerRef: RefObject<HTMLDivElement>;
}) => {
  const [containerHeight, setContainerHeight] = useState('100%');

  useEffect(() => {
    const calculateHeight = () => {
      if (!tableContainerRef.current) return;

      const { current } = tableContainerRef;
      const container = current;
      const { parentElement } = container;

      if (!parentElement) return;

      // Get the parent element's position relative to viewport
      const parentRect = parentElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate available height (viewport height minus parent's top position)
      const availableHeight = viewportHeight - parentRect.top;

      // Set a minimum height of 200px and maximum of 80vh
      const calculatedHeight = Math.max(
        200,
        Math.min(availableHeight, viewportHeight * 0.8),
      );

      setContainerHeight(`${calculatedHeight - 210}px`);
    };

    // Calculate initial height
    calculateHeight();

    // Add resize listener
    window.addEventListener('resize', calculateHeight);

    // Cleanup
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  return containerHeight;
};
