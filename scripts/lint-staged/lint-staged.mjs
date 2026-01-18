#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const result = spawnSync('yarn', ['lint:staged'], {
  stdio: 'inherit',
  shell: true,
});

// Important: exit code propagation
process.exit(result.status ?? 1);
