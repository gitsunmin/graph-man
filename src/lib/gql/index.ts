import { E } from "../fp/Either";

const send = async ({
	query = "",
	variables = {},
	endpoint,
	headers,
}: {
	query: string;
	variables: Record<string, unknown>;
	endpoint: string;
	headers: Record<string, string>;
}) => {
	try {
		return E.Right(
			await fetch(endpoint, {
				method: "POST",
				headers: {
					Accept: 'application/graphql-response+json; charset=utf-8, application/json; charset=utf-8',
					'Content-Type': 'application/json',
					...headers
				},
				body: JSON.stringify({
					query,
					variables,
				}),
			}).then((res) => res.json()),
		);
	} catch (error) {
		return E.Left(error);
	}
};

export const GQL = {
	send,
};
