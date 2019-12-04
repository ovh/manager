export default class WucHelper {
  /*
   * Compare engine version based on Engine X.X format,
   * from latest to oldest (by default)
   */
  static engineVersionCompare(engineA, engineB, splitChar = ' ', desc = true) {
    const [engineALabel, engineAVersion] = engineA.split(splitChar);
    const [engineBLabel, engineBVersion] = engineB.split(splitChar);

    if (engineALabel === engineBLabel) {
      const aVersion = parseFloat(engineAVersion) * 100;
      const bVersion = parseFloat(engineBVersion) * 100;

      if (aVersion === bVersion) {
        return 0;
      }

      if (desc) {
        return aVersion > bVersion ? -1 : 1;
      }
      return aVersion < bVersion ? -1 : 1;
    }

    return engineALabel > engineBLabel ? 1 : -1;
  }
}
