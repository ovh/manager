/* eslint-disable no-console */
import { ExecException, exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const inputDir = './dist';
const outputDir = './src/api';

function getAxiosApiVersion(jsonContent: {
  paths: Record<string, Record<string, { servers?: { url: string }[] }>>;
}) {
  let serverUrl = 'v1';
  Object.keys(jsonContent.paths).some((pathKey) => {
    const methods = jsonContent.paths[pathKey];
    Object.keys(methods).some((methodKey) => {
      const method = methods[methodKey];
      if (method.servers && method.servers.length > 0) {
        serverUrl = method.servers[0].url;
        return true;
      }
      return false;
    });
    return serverUrl !== 'v1';
  });

  // Choose the correct Axios instance based on the server URL
  return serverUrl === 'v2' ? 'v2' : 'v6';
}

// Function to process each JSON file
function processFile(filePath: string) {
  const baseName = path.basename(filePath, '.json');
  const outputPath = path.join(outputDir, baseName);

  // Read the JSON file to determine the server version
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const jsonContent = JSON.parse(fileContent);

  // Find the first path with a server URL
  const axiosInstance = getAxiosApiVersion(jsonContent);

  // ./orval.config.${axiosInstance}.ts
  // Use the selected Axios instance in the Orval command
  const command = `npx orval --config ./orval.config.${axiosInstance}.ts --input ${filePath} --output ${outputPath} --client react-query`;
  exec(
    command,
    { maxBuffer: 1024 * 1024 * 10 }, // Increase buffer size to 10MB
    (err: ExecException | null, stdout: string, stderr: string) => {
      if (err) {
        console.error(`Error generating API for ${filePath}:`, err, stderr);
        return;
      }
      console.log(`Generated API for ${filePath}:`, stdout);
    },
  );
}

// Process the script for only a specific domain (me.json, services.json)
const specificFile = process.argv[2];
function readDirectoryRecursively(dir: string) {
  fs.readdir(
    dir,
    { withFileTypes: true },
    (err: NodeJS.ErrnoException | null, entries: fs.Dirent[]) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }

      entries.forEach((entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          // If the entry is a directory, recurse into it
          readDirectoryRecursively(fullPath);
        } else if (entry.isFile() && path.extname(entry.name) === '.json') {
          // If the entry is a JSON file, process it
          processFile(fullPath);
        }
      });
    },
  );
}

const runScript = () => {
  if (specificFile) {
    // If a specific file is provided, process only that file
    if (path.extname(specificFile) === '.json') {
      processFile(`./dist/${specificFile}`);
    } else {
      console.error('Provided file is not a JSON file.');
    }
  } else {
    readDirectoryRecursively(inputDir);
  }
};

runScript();
