import { P, match } from "ts-pattern";

type None = {
	__tag: "None";
};

type Some<T> = {
	value: T;
	__tag: "Some";
};

export type Option<T> = None | Some<T>;

const PATTERN = {
	NONE: { __tag: "None" } as const,
	SOME: { __tag: "Some" } as const,
};

export const O = {
	...PATTERN,
	make: <T>(value: T): Option<T> => ({
			value,
			__tag: match(value)
				.with(P.nullish, () => "None" as const)
				.otherwise(() => "Some" as const),
	}),
	Some: <T>(value: T): Option<T> => O.make(value),
	None: <T>(): Option<T> => ({ __tag: "None" }),
};
