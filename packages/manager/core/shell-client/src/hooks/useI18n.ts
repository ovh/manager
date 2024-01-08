import { useContext } from "react";
import { ShellContext } from "../ShellContext";

export function useI18n() {
  const { shell } = useContext(ShellContext);
  return shell.i18n;
}

export default useI18n;
