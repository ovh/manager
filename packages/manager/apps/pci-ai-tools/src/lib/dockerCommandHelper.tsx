import { DOCKER_CONFIG } from '@/configuration/docker-command';

export function parseDockerCommand(cmd: string): string[] {
  const regex = DOCKER_CONFIG.command.validationPattern;

  const matches = cmd.match(regex) || [];

  return matches.map((match) => {
    // Si la chaîne commence et se termine par des guillemets
    if (match.startsWith('"') && match.endsWith('"')) {
      return match.slice(1, -1); // On enlève les guillemets
    }
    return match;
  });
}
