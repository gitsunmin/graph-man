import { P, match } from 'ts-pattern';

type None = {
    __tag: 'None';
};

type Some<T> = {
    value: T;
    __tag: 'Some';
};

export type Option<T> = None | Some<T>;

export const O = {
    make<T>(value: T): Option<T> {
        return {
            value,
            __tag: match(value)
                .with(P.nullish, () => 'None' as const)
                .otherwise(() => 'Some' as const),
        };
    },
    Some: <T>(value: T): Option<T> => O.make(value),
    None: <T>(): Option<T> => ({ __tag: 'None' }),
    isNone: <T>(option: Option<T>): option is None => option.__tag === 'None',
    isSome: <T>(option: Option<T>): option is Some<T> => option.__tag === 'Some',
}
