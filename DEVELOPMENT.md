# MerPress

MerPress is a WordPress plugin for creating diagrams and visualizations using
[MermaidJS](https://mermaid.js.org).

## Setup

Composer is only used to run `phpcs` for linting and formatting.

```sh
pnpm install && composer install
```

## Development

Development now uses WordPress blocks best practices (i.e. '@wordpress/scripts'
to generate the javascript).  Create the production javascript with:

```sh
pnpm build
```

If you want to work with development, use the `watch` script (e.g. `pnpm
watch`). And it's suggested that you run `pnpm husky install` in order to add a
linting check before committing.

### Linting

```sh
pnpm lint
```

### Formatting

```sh
pnpm wp-scripts format <filename>
```

## Get a new mermaid drop

   1. `pnpm update -L`

      Currently React is at 18.3.1, but to check if 19.0.0 is supported:

      Try updating React first:

      `pnpm add react@^19.0.0 react-dom@^19.0.0`

      Check for peer dependency warnings

      `pnpm install`

      If warnings appear, revert

      `pnpm add react@^18.3.1 react-dom@^18.3.1`

   2. `composer update`
   3. Build a new version of mermaid (change to the mermaid git repo directory)
      1. Change the tag to the version you want: e.g. `git fetch origin mermaid@11.9.0 --depth 1`
      2. `git checkout -b mermaid@11.9.0 FETCH_HEAD`
      3. `pnpm i`
      4. `pnpm run -r clean`
      5. `pnpm run build:mermaid`
      6. `cp packages/mermaid/dist/mermaid.{,min.}js* $MERPRESS_DIR/public/`
   4. Update versions (`bin/update-versions.sh`), rebuild (`pnpm build`), test, commit, create PR. _(Check if the WordPress version or other README values should be updated.)_

## Setting a new version

Use the included script `bin/update-versions.sh` to roll the version numbers. It
takes 1 positional parameter (the new plugin version) and an optional one
(mermaid version).

```sh
# Update this plugin
./bin/update-versions.sh 1.1.11 11.9.0
# need to build again
pnpm build
```

## Creating a release

```sh
pnpm wp-scripts plugin-zip
```

## Using playground

Quickly launch a development environment after you have built the plugin using:

```sh
npx @wp-now/wp-now start
```
