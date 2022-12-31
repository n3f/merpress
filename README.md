# merpress

Merpress is a WordPress plugin for creating diagrams and visualizations using [MermaidJS](https://mermaid-js.github.io/mermaid/).

## Development

Development now uses wordpress blocks best practices (i.e. '@wordpress/scripts'
to generate the javascript).  Create the production javascript with:

```sh
pnpm build
```

If you want to work with development, use the `watch` script (e.g. `pnpm
watch`). And it's suggested that you run `pnpm husky install` in order to add a
linting check before committing.

## Setting a new version

TBD

## Creating a release

TBD
