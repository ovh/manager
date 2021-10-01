import ShellClient from './shell-client';
import exposeApi from './api';

export function useShellApi() {
  const shell = new ShellClient();
  window.addEventListener('message', (event) => shell.handleEvent(event));
  return exposeApi(shell);
}

export default { useShellApi };
