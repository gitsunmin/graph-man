import { join } from "node:path";

const NAMES = {
  PACKAGE_PATH: ".graph-man",
  CONFIG_FILE_NAME: "config.json",
  SCHEMA_FILE_NAME: "schema.graphql",
  SCHEMA_FOLDER_NAME: "__schema__",
};

export default {
  ...NAMES,
  CONFIG_FILE_PATH: join(NAMES.PACKAGE_PATH, NAMES.CONFIG_FILE_NAME),
  SCHEMA_FILE_PATH: join(NAMES.PACKAGE_PATH, NAMES.SCHEMA_FOLDER_NAME, NAMES.SCHEMA_FILE_NAME),
};
