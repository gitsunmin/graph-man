import * as path from "node:path";
import { match } from "ts-pattern";
import * as vscode from "vscode";
import { E } from "../lib/fp/Either";
import { createJSON } from "../utils/file";

type Props = {
  rootPath: string;
  forderName: string;
};

export const createConfigFile = (props: Props) => () => {
  const { rootPath, forderName } = props;

  const JSON_CONTENTS = {
    environment: {
      dev: {
        url: "http://localhost:3000/graphql",
        headers: {
          Cookies: "cookie1=value1; cookie2=value2",
          Authorization: "Bearer token",
        },
      },
      prod: {
        url: "http://localhost:3200/graphql",
        headers: {},
      },
    },
  };

  const createdJSON = createJSON({
    filePath: path.join(rootPath, forderName),
    name: "config.json",
    content: JSON_CONTENTS,
  });

  match(createdJSON)
    .with(E.RIGHT, ({ value: filePath }) => {
      vscode.window.showInformationMessage(`Created ${filePath}`);
    })
    .with(E.LEFT, ({ value: filePath }) => {
      vscode.window.showErrorMessage(
        `Failed to create ${filePath}: already exists`,
      );
    })
    .exhaustive();
};
