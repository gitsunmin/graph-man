import * as path from 'node:path';
import * as vscode from 'vscode';
import { createJSON } from '../utils/file';
import { match } from 'ts-pattern';
import { E } from '../lib/fp/Either';

type Props = {
    rootPath: string;
    forderName: string;
}

export const createConfigFile = (props: Props) => () => {
    const { rootPath, forderName } = props;

    const JSON_CONTENTS = {
        environment: {
            dev: {
                url: 'https://dev.example.com/graphql',
                headers: {
                    Cookies: 'cookie1=value1; cookie2=value2',
                    Authorization: 'Bearer token',
                },
            },
            prod: {
                url: 'https://prod.example.com/graphql',
                headers: {},
            },
        },
    };

    const createdJSON = createJSON({
        filePath: path.join(rootPath, forderName),
        name: 'config.json',
        content: JSON_CONTENTS,
    });

    match(createdJSON)
        .with(E.RIGHT, ({ value: filePath }) => {
            vscode.window.showInformationMessage(`Created ${filePath}`);
        })
        .with(E.LEFT, ({ value: filePath }) => {
            vscode.window.showErrorMessage(`Failed to create ${filePath}: already exists`);
        })
        .exhaustive();

};
