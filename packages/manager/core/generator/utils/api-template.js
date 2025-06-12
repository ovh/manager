/* eslint-disable import/extensions */
import {
  isArrayType,
  cleanTypeSyntax,
  getTypeFromString,
  isUnknownTypescriptType,
  removeTypeBrackets,
  transformTypeToTypescript,
} from './string-helpers.js';
import { getApiServiceOperations, isV2Endpoint } from './api.js';

/**
 * Tranform endpoint data into a list of operations template data
 */
const toOperationList = (apiVersion) => ({ path, description, operations }) =>
  operations.map(
    ({
      httpMethod,
      parameters,
      responseType,
      description: operationDescription,
    }) => {
      const functionName = `${httpMethod.toLowerCase()}${path
        .replace('Name}', '}')
        .replace('-', '')
        .replace('/', '')
        .replace(
          /{([a-z])([a-zA-Z]+)}/g,
          (_, firstLetter, rest) => firstLetter.toUpperCase() + rest,
        )
        .replace(
          /\/([a-zA-Z])([a-zA-Z]+)/g,
          (_, firstLetter, rest) => firstLetter.toUpperCase() + rest,
        )}${isArrayType(responseType) ? 'List' : ''}`;
      const tsResponseType = getTypeFromString(responseType);

      return {
        functionName,
        apiVersion,
        apiPath: path,
        description: `${description} : ${operationDescription}`,
        httpMethod: httpMethod.toLowerCase(),
        responseType: tsResponseType.replaceAll('>', ''),
        params: parameters.map(
          ({ name, fullType, required, description: paramDescription }) => {
            const paramType = fullType
              ? getTypeFromString(fullType)
              : 'unknown';
            const paramName =
              name ||
              `${paramType[0].toLowerCase()}${paramType
                .substring(1)
                .toLowerCase()}Custom`;
            const nameCustom = paramName;
            return {
              name: nameCustom.replaceAll('.', ''),
              type: transformTypeToTypescript(paramType),
              required,
              description: paramDescription,
            };
          },
        ),
        unknownTypeList: new Set(
          [
            tsResponseType,
            ...parameters.map(({ fullType }) => getTypeFromString(fullType)),
          ]
            .filter(isUnknownTypescriptType)
            .map(removeTypeBrackets)
            .map(cleanTypeSyntax),
        ),
      };
    },
  );

/**
 * Add a key urlParams that contains parameters to put in the url
 * Add a key bodyParams that contains parameters to pass in the body of the query
 */
const setUrlAndBodyParams = (operation) => {
  const urlParamNameList =
    operation.apiPath
      .match(/{[a-zA-Z]+}/g)
      ?.map((param) => param.replace(/[{}]/g, '')) || [];
  const urlParams = urlParamNameList.map((urlParamName) =>
    operation.params.find(({ name }) => name === urlParamName),
  );
  const bodyParams = operation.params.filter(
    ({ name }) => !urlParamNameList.includes(name),
  );
  return {
    ...operation,
    url: operation.apiPath.replace(/{/g, '${params.'),
    urlParams,
    bodyParams,
  };
};

/**
 * Reducer function
 * Group operations by HTTP method
 * Also group the unknown type list in the operations
 */
const groupOperationsByHttpMethod = (groupedByMethod, operation) => {
  if (!groupedByMethod[operation.httpMethod]) {
    return {
      ...groupedByMethod,
      [operation.httpMethod]: {
        operationList: [operation],
        unknownTypeList: new Set(operation.unknownTypeList),
      },
    };
  }

  operation.unknownTypeList.forEach((type) =>
    groupedByMethod[operation.httpMethod].unknownTypeList.add(type),
  );

  return {
    ...groupedByMethod,
    [operation.httpMethod]: {
      operationList: [
        ...groupedByMethod[operation.httpMethod].operationList,
        operation,
      ],
      unknownTypeList: groupedByMethod[operation.httpMethod].unknownTypeList,
    },
  };
};

/**
 * @returns template data for API service operations
 */
export const getApiTemplateData = async (apiPaths) => {
  const results = await Promise.all(
    apiPaths.map((path) => getApiServiceOperations(path)),
  );
  const endpoints = results.flat();
  return endpoints
    .flatMap(toOperationList(isV2Endpoint(apiPaths[0]) ? 'v2' : 'v6'))
    .map(setUrlAndBodyParams)
    .reduce(groupOperationsByHttpMethod, {});
};

export default getApiTemplateData;
