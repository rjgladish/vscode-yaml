# LinkML authoring setup

This extension provides optional syntax highlighting, completion, hover information, and schema validation for [LinkML](https://linkml.io/) schema files.

The complete integration runs in Visual Studio Code and compatible VS Code-based editors. The notes for marimo, Jupyter, Google Colab, and JetBrains describe ways to edit or validate the same YAML files; they do not install this extension or reproduce all of its behavior in those environments.

## Support matrix

| Environment | Integration level | Recommended setup |
| --- | --- | --- |
| Visual Studio Code | Full extension support | Install the extension and enable `yaml.dialect.linkml` in workspace settings. |
| VS Code-based IDEs | Full support when the editor accepts VS Code extensions and settings | Install from the editor's extension registry or a VSIX, then use the VS Code settings below. |
| marimo | Compatibility workflow | Keep LinkML schemas as `.yaml` files beside the notebook and edit them in a supported VS Code-based editor. |
| JupyterLab / Jupyter Notebook | Compatibility workflow | Use a `.yaml` file beside the notebook; JupyterLab can edit the file as text, while VS Code provides the LinkML-specific assistance. |
| Google Colab | Compatibility workflow | Upload or generate the schema as a runtime file and validate it separately; use VS Code for the full authoring experience. |
| JetBrains IDEs | Schema-based compatibility | Map the LinkML metamodel JSON Schema to the relevant YAML file patterns. |

## Visual Studio Code

Install the published **YAML** extension by Red Hat from the Extensions view. To test a VSIX built from this repository instead, run:

```shell
npm install
npm run vsix
code --install-extension ./vscode-yaml-*.vsix --force
```

You can keep the test install isolated in a named profile:

```shell
code --install-extension ./vscode-yaml-*.vsix --force --profile "LinkML"
code --list-extensions --show-versions --profile "LinkML" | grep redhat.vscode-yaml
```

If `code` is unavailable, run **Shell Command: Install 'code' command in PATH** from the VS Code Command Palette.

### Basic workspace configuration

Add the following to `.vscode/settings.json`:

```json
{
  "yaml.dialect.linkml": true,
  "yaml.disableAdditionalProperties": true
}
```

Use workspace settings rather than user settings when possible. `yaml.disableAdditionalProperties` applies strict unknown-property checking to every YAML schema in that settings scope, so enabling it globally may be too restrictive for unrelated YAML files.

### File and schema associations

The extension automatically recognizes a LinkML schema when its first significant root key is `id` and it also contains a root `classes`, `slots`, `enums`, or `types` section:

```yaml
id: https://example.org/myschema
name: myschema
classes:
  Person:
    slots:
      - name
```

For files that do not follow that shape, associate a project-specific glob with the `linkml` language mode:

```json
{
  "files.associations": {
    "**/schemas/*.{yaml,yml}": "linkml"
  }
}
```

You can also associate a local or remote copy of the [bundled LinkML metamodel schema](../../schemas/linkml-meta.schema.json) explicitly. The keys in `yaml.schemas` are schema paths or URLs; the values are file globs:

```json
{
  "yaml.schemas": {
    "./schemas/linkml-meta.schema.json": [
      "**/schemas/*.yaml",
      "**/schemas/*.yml"
    ]
  }
}
```

The example path assumes the schema has been copied into the workspace at `schemas/linkml-meta.schema.json`. Use the automatic dialect support when you do not need to maintain a separate schema copy.

### Available extension features

- LinkML-specific highlighting for top-level keys and property modifiers
- completion and hover documentation from the LinkML metamodel schema
- validation of LinkML properties, including stricter unknown-key diagnostics when `yaml.disableAdditionalProperties` is enabled
- automatic detection and a prompt to enable LinkML support for likely schemas

## VS Code-based IDEs

Editors such as VSCodium, Cursor, or other VS Code derivatives can use the same setup only when they support VS Code-compatible extensions and the settings API used by this extension.

1. Look for `redhat.vscode-yaml` in the editor's extension registry.
2. If it is not available there, use the editor's documented VSIX installation flow.
3. Add the same `yaml.dialect.linkml`, `yaml.disableAdditionalProperties`, `files.associations`, and optional `yaml.schemas` entries to the workspace settings.
4. Confirm that the editor lists the extension as enabled for that workspace.

Registry availability and VSIX compatibility are controlled by the editor. A VS Code-based interface alone does not guarantee that the extension host or settings model is compatible.

## marimo

[marimo notebooks are stored as Python files](https://docs.marimo.io/), while LinkML schemas remain separate YAML documents. The marimo browser editor does not run this VS Code extension.

For the most complete workflow, open the project in a supported VS Code-based editor, configure `.vscode/settings.json` as shown above, and keep files such as `schema.yaml` beside the marimo notebook. The notebook can read or generate that file, but validation and LinkML-specific completion occur when the YAML file is opened in the configured editor.

If you use marimo's own editor exclusively, treat the YAML as a normal project file and run your LinkML validation tooling separately.

## Jupyter notebooks

Jupyter notebook cells do not consume VS Code extension settings. In JupyterLab, you can create or open a `.yaml` file with the [built-in text editor](https://jupyterlab.readthedocs.io/en/stable/user/file_editor.html), but that provides a different editing surface and does not enable this extension's LinkML grammar or schema contributor.

Keep the schema as a real `.yaml` or `.yml` file beside the notebook. Open the same project directory in VS Code when you want the configuration from this guide, and use the notebook for loading, generating, or testing the saved schema.

## Google Colab

The hosted Colab editor cannot install this VS Code extension, and files created in its runtime are not a substitute for workspace settings. Upload or generate the LinkML schema as a `.yaml` file, validate it with tooling installed in the notebook runtime, and download or persist the result before the runtime is recycled. Colab's [FAQ](https://research.google.com/colaboratory/faq.html) describes its notebook storage and runtime lifecycle.

For interactive completion, hover information, LinkML highlighting, and the settings in this guide, author the schema in a local VS Code workspace and then upload or synchronize it with the notebook.

## JetBrains IDEs

JetBrains IDEs do not run this extension, so `yaml.dialect.linkml`, `yaml.disableAdditionalProperties`, `files.associations`, and `yaml.schemas` do not apply there. JetBrains can still provide YAML completion and inspections from a JSON Schema.

1. Make the [LinkML metamodel schema](../../schemas/linkml-meta.schema.json) available in the project, or use a reachable URL for the same schema.
2. Open **Settings | Languages & Frameworks | Schemas and DTDs | JSON Schema Mappings**.
3. Add a mapping whose schema file or URL points to the LinkML metamodel schema.
4. Associate the mapping with the LinkML schema files, directories, or patterns in the project.

See the JetBrains [YAML and JSON Schema documentation](https://www.jetbrains.com/help/idea/yaml.html) for the current mapping UI. This setup provides schema-driven completion and inspections, but not this extension's automatic LinkML detection or LinkML-specific TextMate highlighting.

## Configuration reference

| Setting | Scope | Purpose |
| --- | --- | --- |
| `yaml.dialect.linkml` | VS Code-compatible editors | Enables the bundled LinkML schema contributor and dialect support. Defaults to `false`. |
| `yaml.disableAdditionalProperties` | VS Code-compatible editors | Treats additional object properties as invalid across YAML schemas in the settings scope. Defaults to `false`. |
| `files.associations` | VS Code-compatible editors | Assigns matching files to the `linkml` language mode. |
| `yaml.schemas` | VS Code-compatible editors | Maps a schema path or URL to one or more YAML file globs. |

The `yaml.*` setting names and defaults are defined by the extension's [`package.json`](../../package.json); `files.associations` is a built-in VS Code setting. Other editors require their own equivalent file-type or JSON Schema mapping features.

## Repository layout

```text
dialect/linkml/README.md
dialect/linkml/syntaxes/linkml.tmLanguage.json
schemas/linkml-meta.schema.json
```
