function convertJobSpecToCliCommand(jobSpec) {
  const baseCmdArray = [
    'job run',
    `--gpu ${jobSpec.resources.gpu}`,
    `--name ${jobSpec.name}`,
  ];

  if (jobSpec.volumes?.length > 0) {
    jobSpec.volumes
      .map(({ container, region, prefix, mountPath, permission, cache }) => {
        const prefixStr = prefix ? `:/${prefix}` : '';
        const cacheStr = cache ? ':cache' : '';
        return `--volume ${container}@${region}${prefixStr}:${mountPath}:${permission}${cacheStr}`;
      })
      .forEach((x) => baseCmdArray.push(x));
  }

  if (jobSpec.labels) {
    Object.keys(jobSpec.labels).forEach((key) =>
      baseCmdArray.push(`--label ${key}=${jobSpec.labels[key]}`),
    );
  }

  baseCmdArray.push(`${jobSpec.image}`);

  if (jobSpec.command && jobSpec.command.length > 0) {
    baseCmdArray.push('--');
    jobSpec.command.forEach((x) => baseCmdArray.push(x));
  }

  return baseCmdArray.join(' \\\n\t');
}

export default convertJobSpecToCliCommand;
