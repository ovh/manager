module.exports = {
  writerOpts: {
    headerPartial: `## {{packageData.name}}# [{{version}}]({{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}) ({{date}})
`,
  },
};
