# merpress

Merpress is a WordPress plugin for creating diagrams and visualizations using
[MermaidJS](https://mermaid.js.org).

## Development

Development now uses wordpress blocks best practices (i.e. '@wordpress/scripts'
to generate the javascript).  Create the production javascript with:

```sh
pnpm build
```

If you want to work with development, use the `watch` script (e.g. `pnpm
watch`). And it's suggested that you run `pnpm install husky` in order to add a
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

Check out the latest tag/version (on the mermaid repo):

   1. `git fetch origin v9.3.0 --depth 1`
   2. `git checkout -b 9.3.0 FETCH_HEAD`
   3. `pnpm i`
   4. `pnpm build`
   5. `cp packages/mermaid/dist/mermaid.{,min.}js* <to-public-directory>`

## Setting a new version

Use the included script `bin/update-versions.sh` to roll the version numbers. It
takes 1 positional parameter (the new plugin version) and an optional one
(mermaid version).

### Example

```sh
# Update this plugin to 1.0.99-beta and use mermaid 9.3.0
./bin/update-versions.sh 1.0.99-beta 9.3.0
```

## Creating a release

```sh
pnpm wp-scripts plugin-zip
```
