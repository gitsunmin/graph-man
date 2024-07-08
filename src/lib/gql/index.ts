import { P, match } from "ts-pattern";
import { E } from "../fp/Either";

const send = async <D = unknown, Err = { massege: string }>({
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
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept:
          "application/graphql-response+json; charset=utf-8, application/json; charset=utf-8",
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }).then((res) => res.json() as Promise<{ data?: D; errors?: Err }>);

    return match<{ data?: D; errors?: Err }>(response)
      .with({ errors: P.nonNullable }, E.Left)
      .otherwise((response) => E.Right(response as { data: D }));
  } catch (error) {
    return E.Left({ errors: [error as Error] });
  }
};

export const GQL = {
  send,
};
