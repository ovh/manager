import path from 'path';
import { Config, OutputTargetDist } from '@stencil/core/internal';
import { OutputTargetAngularJS } from './types';

export function toPascalCase(stringToConvert) {
  return `${stringToConvert.charAt(0).toUpperCase()}${stringToConvert.slice(
    1,
  )}`;
}

export function convertTagToPascalCase(tagName) {
  return tagName
    .split('-')
    .map((word) => toPascalCase(word))
    .join('');
}

export function getPathToCorePackageLoader(
  config: Config,
  outputTarget: OutputTargetAngularJS,
): string {
  const basePkg = outputTarget.componentCorePackage || '';
  const distOutputTarget = config.outputTargets?.find(
    (o) => o.type === 'dist',
  ) as OutputTargetDist;

  const distAbsEsmLoaderPath =
    distOutputTarget?.esmLoaderPath &&
    path.isAbsolute(distOutputTarget.esmLoaderPath)
      ? distOutputTarget.esmLoaderPath
      : null;

  const distRelEsmLoaderPath =
    config.rootDir && distAbsEsmLoaderPath
      ? path.relative(config.rootDir, distAbsEsmLoaderPath)
      : null;

  const loaderDir = outputTarget.loaderDir || distRelEsmLoaderPath;
  return path.join(basePkg, loaderDir || '');
}

export function extractParametersFromMethodSignature(
  signature: string,
): string[] {
  const parametersMatch = signature.replace(/\??: \w+/g, '').match(/\(.+\)/);

  return parametersMatch
    ? parametersMatch
        .join('')
        .replace(/\(|\)/g, '')
        .split(',')
    : [];
}

export function formatEventName(eventName: string): string {
  const formattedName = eventName
    .match(/\w+/g)!
    .map((match) => toPascalCase(match))
    .join('');
  return `on${formattedName}`;
}

export function getComponentTagPrefix(outputTarget: OutputTargetAngularJS) {
  return (
    outputTarget.wrappedComponentsPrefix ?? outputTarget.componentCorePackage
  );
}
