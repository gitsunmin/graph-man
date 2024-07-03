import * as fs from "node:fs";
import path from "node:path";
import { match } from "ts-pattern";
import * as vscode from "vscode";
import { E } from "../lib/fp/Either";
import { O, type Option } from "../lib/fp/Options";

export const readJSONSync = <T>(path: string): Option<T> => {
  try {
    return fs.existsSync(path)
      ? O.Some(JSON.parse(fs.readFileSync(path, "utf-8")) as T)
      : O.None();
  } catch (error) {
    return O.None();
  }
};

export const readDirSync = (path: string): Option<string[]> => {
  try {
    return fs.existsSync(path) ? O.Some(fs.readdirSync(path)) : O.None();
  } catch (error) {
    return O.None();
  }
};

export const openFile = (filePath: string) => {
  const fileUri = vscode.Uri.file(filePath);
  vscode.window.showTextDocument(fileUri);
};

export const createFile = (props: {
  folderPath: string;
  name: string;
  content: string;
}) => {
  const { folderPath, name, content } = props;

  try {
    const filePath = path.join(folderPath, name);

    fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFileSync(filePath, content, "utf8");
    return E.Right(filePath);
  } catch (error) {
    return E.Left(error);
  }
};

export const createJSON = (props: {
  filePath: string;
  name: string;
  content: Record<string, unknown>;
}) => {
  const { filePath, name, content } = props;

  const configFilePath = path.join(filePath, name);

  return match([fs.existsSync(filePath), fs.existsSync(configFilePath)])
    .with([true, false], () => {
      fs.writeFileSync(
        configFilePath,
        JSON.stringify(content, null, 2),
        "utf8",
      );
      return E.Right(configFilePath);
    })
    .with([false, false], () => {
      fs.mkdirSync(filePath, { recursive: true });
      fs.writeFileSync(
        configFilePath,
        JSON.stringify(content, null, 2),
        "utf8",
      );
      return E.Right(configFilePath);
    })
    .otherwise(() => E.Left(configFilePath));
};
