import { existsSync, unlinkSync } from 'fs';

export function safeUnlink(filePath) {
  try {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      console.log(`🧹 Removed temporary file: ${filePath}`);
    }
  } catch (err) {
    console.warn(`⚠️ Failed to remove ${filePath}:`, err.message);
  }
}

export function registerCleanupOnSignals(cleanupFn) {
  process.on('SIGINT', () => {
    console.log('\n🛑 Caught SIGINT');
    cleanupFn();
    process.exit(1);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Caught SIGTERM');
    cleanupFn();
    process.exit(1);
  });

  process.on('uncaughtException', (err) => {
    console.error('🔥 Uncaught Exception:', err);
    cleanupFn();
    process.exit(1);
  });
}
