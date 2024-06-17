import { P, match } from 'ts-pattern';
import { readJSONSync } from './file';
import { R, Result } from './result';

type Environment = {
    url: string;
    header: Record<string, string>;
};

export type GraphManConfig = {
    environment: Record<string, Environment>;
};

export const loadConfig = (path: string): Result<string, GraphManConfig> => {
    const config = readJSONSync<GraphManConfig>(path);
    return match(config)
        .with(P.nullish, () => R.Left('Config file not found'))
        .with({ __tag: 'None' }, () => R.Left('Config file is empty'))
        .with({ value: { environment: P.nullish } }, () => R.Left('Environment is not defined'))
        .with({
            value: {
                environment: P.when((environment) => {
                    return typeof environment !== 'object' || Array.isArray(environment);
                })
            }
        }, () => R.Left('Environment is not an object'))
        .otherwise(({ value }) => {
            return R.Right(value);
        });
};