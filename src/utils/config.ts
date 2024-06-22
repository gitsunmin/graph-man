import { P, match } from 'ts-pattern';
import { readJSONSync } from './file';
import { E, Either } from '../lib/fp/Either';

type Environment = {
    url: string;
    header: Record<string, string>;
};

export type GraphManConfig = {
    environment: Record<string, Environment>;
};

export const loadConfig = (path: string): Either<string, GraphManConfig> => {
    const config = readJSONSync<GraphManConfig>(path);
    return match(config)
        .with(P.nullish, () => E.Left('Config file not found'))
        .with({ __tag: 'None' }, () => E.Left('Config file is empty'))
        .with({ value: { environment: P.nullish } }, () => E.Left('Environment is not defined'))
        .with({
            value: {
                environment: P.when((environment) => {
                    return typeof environment !== 'object' || Array.isArray(environment);
                })
            }
        }, () => E.Left('Environment is not an object'))
        .otherwise(({ value }) => {
            return E.Right(value);
        });
};