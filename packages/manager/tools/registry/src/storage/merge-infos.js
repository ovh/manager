module.exports = (baseInfos, addedInfos) =>
  addedInfos.reduce((infos, fragment) => {
    const fragmentInfos = infos.find(({ name }) => name === fragment.name);

    if (!fragmentInfos) {
      return [...infos, fragment];
    }

    fragmentInfos.versions = [
      ...new Set([...fragmentInfos.versions, ...fragment.versions]),
    ];

    return infos;
  }, baseInfos);
