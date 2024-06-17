import { R } from './result';

const send = async ({
    query = '',
    variables = {},
    endpoint,
    headers,
}: {
    query: string;
    variables: Record<string, any>;
    endpoint: string;
    headers: Record<string, string>;
}) => {
    try {
        return R.Right(await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify({
                query,
                variables,
            }),
        }).then(res => res.json()));

    } catch (error) {
        return R.Left(error);
    }
};

export const GQL = {
    send,
};
