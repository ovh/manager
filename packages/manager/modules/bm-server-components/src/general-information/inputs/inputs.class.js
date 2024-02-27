export default class Inputs {
  constructor(resource) {
    Object.assign(this, resource);
  }

  answersHash2userMetadata(answersHash) {
    const userMetadata = [];
    Object.values(this).forEach((input) => {
      if (input.type !== 'keyValue' && answersHash[input.name]) {
        userMetadata.push({
          key: input.name.toString(),
          value: answersHash[input.name].toString(),
        });
      } else if (
        input.type === 'keyValue' &&
        answersHash[input.name].length > 0
      ) {
        answersHash[input.name].forEach((keyValueItem, keyValueIndex) => {
          userMetadata.push({
            key: `${input.name + keyValueIndex}Key`,
            value: keyValueItem.key.toString(),
          });
          userMetadata.push({
            key: `${input.name + keyValueIndex}Value`,
            value: keyValueItem.value.toString(),
          });
        });
      }
    });
    return userMetadata;
  }
}
