const NAMES = {
  PACKAGE_PATH: ".graph-man",
  CONFIG_FILE_NAME: "config.json",
  SCHEMA_FILE_NAME: "schema.graphql",
};

export default {
  ...NAMES,
  CONFIG_FILE_PATH: `${NAMES.PACKAGE_PATH}/${NAMES.CONFIG_FILE_NAME}`,
  SCHEMA_FILE_PATH: `${NAMES.PACKAGE_PATH}/__schema__/${NAMES.SCHEMA_FILE_NAME}`,
};
