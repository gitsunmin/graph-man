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

![usage-video0](.docs/videos/usage-video0.gif)

1. Install Graph Man Extension
2. Create `.graph-man` folder in your project root
3. Create Configration File (name is `.graph-man/config.json`)
   - [Example Config File](https://github.com/gitsunmin/bun-graphql-server/blob/main/.graph-man/config.json)
4. Create Queries And Mutations Files (`.graph-man/**/*.graphql`)
   - [Example Query File](https://github.com/gitsunmin/bun-graphql-server/blob/main/.graph-man/pet/query-pets.graphql).
5. Select Your Environment to Side Bar   
6. Click the "paper airplane icon" on Right-Top  for Send Your "Query" Or "Mutation" on `.graph-man/**/*.grapql` file

> Tip: If you don't include the `.graph-man/**/*` files in the project, you can add them to `.gitignore` for use.

## Commands
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
