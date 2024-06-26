import { match } from "ts-pattern";

type Left<T> = {
	value: T;
	__tag: "Left";
};

type Right<T> = {
	value: T;
	__tag: "Right";
};

export type Either<L, R> = Left<L> | Right<R>;

const PATTERN = {
	LEFT: { __tag: "Left" } as const,
	RIGHT: { __tag: "Right" } as const,
};

export const E = {
	...PATTERN,
	Left: <T>(value: T): Left<T> => ({ value, __tag: "Left" }),
	Right: <T>(value: T): Right<T> => ({ value, __tag: "Right" }),
	map: <L, R, T>(either: Either<L, R>, fn: (value: R) => T): Either<L, T> =>
		match(either)
			.with(PATTERN.LEFT, (left) => left)
			.with(PATTERN.RIGHT, (right) => E.Right(fn(right.value)))
			.exhaustive(),
	mapLeft: <L, R, T>(either: Either<L, R>, fn: (value: L) => T): Either<T, R> =>
		match(either)
			.with(PATTERN.LEFT, (left) => E.Left(fn(left.value)))
			.with(PATTERN.RIGHT, (right) => right)
			.exhaustive(),
};
