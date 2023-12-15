import { useContext } from "react";
import { ShellContext } from "../ShellContext";

export function useEnvironment() {
  const { environment } = useContext(ShellContext);
  return environment;
}

export default useEnvironment;
