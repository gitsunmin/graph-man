type Left<T> = {
    value: T;
    __tag: 'Left';
};

type Right<T> = {
    value: T;
    __tag: 'Right';
};

export type Either<L, R> = Left<L> | Right<R>;

export const E = {
    Left: <T>(value: T): Left<T> => ({ value, __tag: 'Left' }),
    Right: <T>(value: T): Right<T> => ({ value, __tag: 'Right' }),
    isLeft: <L, R>(either: Either<L, R>): either is Left<L> => either.__tag === 'Left',
    isRight: <L, R>(either: Either<L, R>): either is Right<R> => either.__tag === 'Right',
};
