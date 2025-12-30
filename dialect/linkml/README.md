# LinkML Dialect Support

This extension provides optional support for [LinkML](https://linkml.io/) schema files, a modeling language for linked data.

## Automatic Detection

Files are automatically detected as LinkML when the **first line** matches:

```yaml
id: https://example.org/myschema
```

The detection pattern validates proper LinkML `id:` syntax:

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

## Configuration

Add to your `settings.json` to enable support. For the best experience, it is highly recommended to enable strict validation:

```json
{
  "yaml.dialect.linkml": true,
  "yaml.disableAdditionalProperties": true
}
```

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
dialect/linkml/
├── README.md           # This file
├── schemas/
│   └── linkml-meta.schema.json
└── syntaxes/
    └── linkml.tmLanguage.json
```
