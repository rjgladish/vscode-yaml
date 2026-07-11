# LinkML Dialect Support

This extension provides optional support for [LinkML](https://linkml.io/) schema files, a modeling language for linked data.

## Install from a local VSIX

Build the extension package from this repository:

```shell
npm install
npm run vsix
```

Install the generated VSIX with the VS Code command-line installer:

```shell
code --install-extension ./vscode-yaml-*.vsix --force
```

To keep the install isolated from your normal editor setup, install into a named profile:

```shell
code --install-extension ./vscode-yaml-*.vsix --force --profile "LinkML"
```

Verify that the extension is installed:

```shell
code --list-extensions --show-versions | grep redhat.vscode-yaml
```

If the `code` command is not available, install it from VS Code's Command Palette with `Shell Command: Install 'code' command in PATH`, then rerun the command.

## Configure LinkML support

Add these settings to your workspace `.vscode/settings.json`:

```json
{
  "yaml.dialect.linkml": true,
  "yaml.disableAdditionalProperties": true
}
```

Use workspace settings first. `yaml.disableAdditionalProperties` makes unknown keys invalid for every YAML schema in that workspace, which is useful for LinkML authoring but can be too strict as a global setting.

## Automatic Detection

Files are identified as LinkML schemas when the first significant root key is `id` and the file contains a root `classes`, `slots`, `enums`, or `types` section:

```yaml
id: https://example.org/myschema
name: myschema
classes:
  Person:
    slots:
      - name
```

The language mode selector can also detect LinkML when the file starts with a LinkML `id:`:

- URI format: `id: https://...` or `id: http://...`
- Identifier format: `id: my_schema_name`

Files not matching this pattern will default to YAML. You can manually switch to LinkML mode via the language picker in the status bar.

## Features

### Syntax Highlighting

LinkML-specific keywords are highlighted distinctly from regular YAML:

- **Top-level keys**: `classes`, `slots`, `types`, `enums`, `prefixes`, `imports`, etc.
- **Property modifiers**: `is_a`, `abstract`, `mixin`, `required`, `range`, `identifier`, etc.

### Schema Validation

When enabled via settings, files are validated against the LinkML metamodel schema:

- IntelliSense for valid LinkML properties
- Error highlighting for invalid keys
- Hover documentation for LinkML constructs

## Manual Association

For files that don't start with `id:`, use workspace settings:

```json
{
  "files.associations": {
    "**/schemas/*.yaml": "linkml"
  }
}
```

## File Organization

```text
dialect/linkml/README.md
dialect/linkml/syntaxes/linkml.tmLanguage.json
schemas/linkml-meta.schema.json
```
