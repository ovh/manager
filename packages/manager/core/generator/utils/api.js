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
  const result = res.data.apis.flatMap(({ path, description, operations }) =>
    operations.map(
      ({
        httpMethod,
        parameters,
        responseType,
        description: operationDescription,
      }) => {
        const fileName = path
          .substring(1)
          .replace(/\//g, '-')
          .replace(/[{}]/g, '')
          .toLowerCase();
        const filepathFromIndexWithoutExtension = `${httpMethod.toUpperCase()}/apiv6/${fileName}`;
        const tsResponseType = getTypeFromString(responseType);

        return {
          filepathFromIndex: `${filepathFromIndexWithoutExtension}.ts`,
          filepathFromIndexWithoutExtension,
          fileName,
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
              ...parameters.map(({ fullType }) => getTypeFromString(fullType)),
            ]
              .filter(isUnknownTypescriptType)
              .map(removeTypeBrackets),
          ),
        };
      },
    ),
  );
  return result;
};

export default {
  getApiPaths,
  getApiEndpointQueryData,
};
