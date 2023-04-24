import axios from 'axios';

export const getApiPaths = async () => {
  const response = await axios.get('https://api.ovh.com/1.0');
  return response.data.apis.map(({ path }) => path);
};

const isArrayType = (typeStr) => typeStr.endsWith('[]');
const removeTypeBrackets = (typeStr) =>
  isArrayType(typeStr) ? typeStr.substring(0, typeStr.length - 2) : typeStr;

const cleanUpType = (originalType) => {
  const typeStr = originalType
    .replace(/:[a-zA-Z]+/g, '')
    .replace(/<[a-zA-Z]+>/g, '');
  return typeStr[0].toUpperCase() + typeStr.substring(1);
};

const transformTypeToTypescript = (originalType) => {
  const typeWithoutBracket = removeTypeBrackets(originalType);

  if (['string', 'boolean', 'number'].includes(typeWithoutBracket)) {
    return originalType;
  }
  if (['long', 'double'].includes(typeWithoutBracket)) {
    return `number${isArrayType(originalType) ? '[]' : ''}`;
  }
  if (typeWithoutBracket === 'void') {
    return `undefined${isArrayType(originalType) ? '[]' : ''}`;
  }
  return cleanUpType(originalType);
};

const getTypeFromString = (typeStr) =>
  transformTypeToTypescript(typeStr.split('.').slice(-1)[0]);

const isUnknownTypescriptType = (typeStr) =>
  ['string', 'number', 'boolean', 'undefined', 'null'].every(
    (type) => !typeStr.includes(type),
  );

export const getApiEndpointQueryData = async (apiPath) => {
  const res = await axios.get(`https://api.ovh.com/1.0${apiPath}.json`);
  const result = res.data.apis
    .flatMap(({ path, description, operations }) =>
      operations.map(
        ({
          httpMethod,
          parameters,
          responseType,
          description: operationDescription,
        }) => {
          const functionName = `${httpMethod.toLowerCase()}${path
            .replace('Name}', '}')
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
            apiPath: path,
            description: `${description} : ${operationDescription}`,
            httpMethod: httpMethod.toLowerCase(),
            responseType: tsResponseType,
            params: parameters.map(
              ({ name, fullType, required, description: paramDescription }) => {
                const paramType = getTypeFromString(fullType);
                const paramName =
                  name ||
                  `${paramType[0].toLowerCase()}${paramType
                    .substring(1)
                    .toLowerCase()}`;
                return {
                  name: paramName,
                  type: transformTypeToTypescript(paramType),
                  required,
                  description: paramDescription,
                };
              },
            ),
            unknownTypeList: new Set(
              [
                tsResponseType,
                ...parameters.map(({ fullType }) =>
                  getTypeFromString(fullType),
                ),
              ]
                .filter(isUnknownTypescriptType)
                .map(removeTypeBrackets),
            ),
          };
        },
      ),
    )
    .map((operation) => {
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
    })
    .reduce((groupedByMethod, operation) => {
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
          unknownTypeList:
            groupedByMethod[operation.httpMethod].unknownTypeList,
        },
      };
    }, {});
  return result;
};

export default {
  getApiPaths,
  getApiEndpointQueryData,
};
