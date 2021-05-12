function convertJobSpecToCliCommand(jobSpec) {
  let baseCmdArray = ['job run', `--name ${jobSpec.name}`];

  if (jobSpec.resources.gpu > 0) {
    baseCmdArray.push(`--gpu ${jobSpec.resources.gpu}`);
  } else {
    baseCmdArray.push(`--cpu ${jobSpec.resources.cpu}`);
  }

  if (jobSpec.volumes?.length > 0) {
    baseCmdArray = baseCmdArray.concat(
      jobSpec.volumes.map(
        ({ container, region, prefix, mountPath, permission, cache }) => {
          const prefixStr = prefix ? `:/${prefix}` : '';
          const cacheStr = cache ? ':cache' : '';
          return `--volume ${container}@${region}${prefixStr}:${mountPath}:${permission}${cacheStr}`;
        },
      ),
    );
  }

  if (jobSpec.labels) {
    baseCmdArray = baseCmdArray.concat(
      Object.keys(jobSpec.labels).map(
        (key) => `--label ${key}=${jobSpec.labels[key]}`,
      ),
    );
  }

  baseCmdArray.push(`${jobSpec.image}`);

  if (jobSpec.command && jobSpec.command.length > 0) {
    baseCmdArray.push('--');
    baseCmdArray = baseCmdArray.concat(jobSpec.command);
  }

  return baseCmdArray.join(' \\\n\t');
}

export default convertJobSpecToCliCommand;
