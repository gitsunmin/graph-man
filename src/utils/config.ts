import { P, match } from "ts-pattern";
import { E, type Either } from "../lib/fp/Either";
import { readJSONSync } from "./file";
import { O } from '../lib/fp/Options';

export type Environment = {
	url: string;
	headers: Record<string, string>;
};

export type GraphManConfig = {
	environment: Record<string, Environment>;
};

export const loadConfig = (path: string): Either<string, GraphManConfig> =>
	match(readJSONSync<GraphManConfig>(path))
		.with(O.NONE, () => E.Left("Config file is empty"))
		.with({ ...O.SOME, value: { environment: P.nullish } }, () =>
			E.Left("Environment is not defined"),
		)
		.with(
			{
				value: {
					environment: P.when((environment) => {
						return (
							typeof environment !== "object" || Array.isArray(environment)
						);
					}),
				},
			},
			() => E.Left("Environment is not an object"),
		)
		.otherwise(({ value }) => E.Right(value));
