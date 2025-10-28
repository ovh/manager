#!/usr/bin/env node
import { execSync } from "node:child_process";

const root = "../../";
const library = "@ovh-ux/muk";
const [type, ...extraArgs] = process.argv.slice(2);

if (!type) {
  console.error("❌ Missing analysis type.\nUsage: yarn analysis <duplication|perf|tests|types>");
  process.exit(1);
}

const tasks = {
  duplication: [`manager-code-duplication --library ${library}`],
  perf: [`manager-perf-budgets --library ${library}`],
  tests: [
    "pm:prepare:legacy:workspace",
    `manager-tests-coverage --library ${library}`,
    "pm:remove:legacy:workspace",
  ],
  types: [`manager-types-coverage --library ${library}`],
};

const commands = tasks[type];
if (!commands) {
  console.error(`❌ Unknown analysis type '${type}'. Available: ${Object.keys(tasks).join(", ")}`);
  process.exit(1);
}

try {
  for (const cmd of commands) {
    console.log(`\n🚀 [${type}] → yarn --cwd ${root} ${cmd}\n`);
    execSync(`yarn --cwd ${root} ${cmd}`, { stdio: "inherit" });
  }
  console.log(`\n✅ ${type} analysis completed successfully.\n`);
} catch (err) {
  console.error(`\n💥 ${type} analysis failed.\n`);
  process.exit(1);
}
