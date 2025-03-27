import useShell from './useShell';

/**
 * @deprecated use ShellContext directly
 */
export const useUX = () => {
  const shell = useShell();
  return shell?.ux;
};

export default useUX;
