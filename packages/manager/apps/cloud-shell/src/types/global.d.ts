export {};

declare global {
  interface Window {
    Go: new () => {
      env: Record<string, string>;
      importObject: WebAssembly.Imports;
      run: (instance: WebAssembly.Instance) => void;
    };
    exec: (command: string) => Promise<Response>;
  }
}
