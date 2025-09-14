declare module 'vnu-jar' {
  /** Absolute filesystem path to the bundled vnu.jar */
  const vnuJarPath: string;
  export = vnuJarPath; // CommonJS-style export (works with esModuleInterop)
}
