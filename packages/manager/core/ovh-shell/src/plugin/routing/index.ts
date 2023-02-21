export const hashChangeEvent = 'ovh-routing-hash-change';

export function routing() {
  return {
    onHashChange: (): void => {
      window.dispatchEvent(new Event(hashChangeEvent));
    },
  };
}

export default routing;
