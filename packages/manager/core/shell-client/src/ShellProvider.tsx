import { initShellClient } from "@ovh-ux/shell";
import { ReactNode, useEffect, useState } from "react";
import { ShellContext } from "./ShellContext";

export const ShellProvider = ({ appName, children }: { appName: string, children: ReactNode }) => {
  const [shellContextValue, setShellContextValue] = useState(null);

  useEffect(() => {
    const init = async () => {
      const shell = await initShellClient(appName);
      const environment = await shell.environment.getEnvironment();
      setShellContextValue({ shell, environment });
    };
    init();
  }, []);

  return <>
    {shellContextValue &&
      <ShellContext.Provider value={shellContextValue}>
        {children}
      </ShellContext.Provider>}
  </>
}

export default ShellProvider;
