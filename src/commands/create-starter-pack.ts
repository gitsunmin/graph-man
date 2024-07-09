import { createConfigFile } from './create-config-file';
import { createExampleGraphqlFile } from './create-example-graphql-file';

type Props = {
    rootPath: string;
    forderName: string;
};

export const createStarterPack = (props: Props) => () => {
    Promise.all([
        Promise.resolve().then(createConfigFile(props)),
        Promise.resolve().then(createExampleGraphqlFile(props))
    ]);
};