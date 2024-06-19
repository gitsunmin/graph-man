type Left<T> = {
    value: T;
    __tag: 'Left';
};

type Right<T> = {
    value: T;
    __tag: 'Right';
};

export type Result<L, R> = Left<L> | Right<R>;

export const R = {
    Left: <T>(value: T): Left<T> => ({ value, __tag: 'Left' }),
    Right: <T>(value: T): Right<T> => ({ value, __tag: 'Right' }),
    isLeft: <L, R>(result: Result<L, R>): result is Left<L> => result.__tag === 'Left',
    isRight: <L, R>(result: Result<L, R>): result is Right<R> => result.__tag === 'Right',
};
