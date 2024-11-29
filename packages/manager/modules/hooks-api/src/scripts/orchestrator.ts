import { execSync } from 'child_process';

function runScript(scriptPath: string) {
  try {
    execSync(`npx ts-node ${scriptPath}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing script ${scriptPath}:`, error);
  }
}

function main() {
  // Run the generate swagger script
  runScript('./src/scripts/generate-swagger.ts');

  // Run the generate types and hooks script
  runScript('./src/scripts/generate-types-and-hooks.ts');
}

main();
