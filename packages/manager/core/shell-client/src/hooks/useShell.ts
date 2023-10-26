import { useContext } from "react";
import { ShellContext } from "../ShellContext";

export function useShell() {
  const { shell } = useContext(ShellContext);
  return shell;
}

export default useShell;
