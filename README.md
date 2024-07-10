# Graph Man

<img src="icon.webp" width="100px" />     

This Extension is a Tester for GraphQL Queries and Mutations.

## Layout

![Layout](.docs/images/layout.png)

## Features

- [x] Test GraphQL Queries And Mutations
- [x] Save Queries And Mutations
- [x] Settings For Custom Headers
- [x] Load Schema From URL
- [x] Merge Fragments into Query
- [ ] Schema Based GraphQL IntelliSense
- [ ] Autofill fields

## Usage

<!-- ![usage-video0](.docs/videos/usage-video0.gif) -->

1. Install Graph Man Extension
2. Use `Create Starter Pack` Command
3. Click the `Graph Man` icon on the sidebar.
4. Modify `url` and `headers` in the `config.json` file to your GraphQL server.
5. Click the `Paper Airplane Icon` button in the upper right corner of the `**.*.graphql` file.

> Tip: If you want to use `Graph Man` personally in your project, you can use it by adding `/.graph-man/` to `.gitignore`.
 
## Commands

> A list of commands that you can search for and use in the Command Palette.


- `Graph Man: Show configuration`: `.graph-man/config.json` file will be opened
- `Graph Man: Refresh Environment`: Refresh Environment from `.graph-man/config.json`
- `Graph Man: Refresh Graphqls`: Refresh GraphQL Files from `.graph-man/**/*.graphql` and `.graph-man/**/*.gql`
- `Graph Man: Send Graphql`: Send GraphQL Query or Mutation
- `Graph Man: Load Schem`: Load Schema from URL
- `Graph Man: Create Config File`: Create `.graph-man/config.json` 
- `Graph Man: Create Example GraphQL Files`: Create Example GraphQL Files in `.graph-man` folder
- `Graph Man: Create Starter Pack`: Create Starter Pack in `.graph-man` folder (Execute `Create Config File` and `Create Example GraphQL Files`)
- `Graph Man: Merge Fragments into Query`: Merges the Fragments of Query currently displayed on the screen.

## Example

[here](https://github.com/gitsunmin/bun-graphql-server)    
It's a "graphql-server" that uses "graph-man". You can learn more about how to use it in this project.
