This plan outlines the steps to add LinkML (Linked Data Modeling Language) support to the Red Hat YAML extension. This includes syntax highlighting for LinkML-specific keywords and schema-based validation/intellisense.

---

### 1. **Define the LinkML Language and Grammar**
LinkML files are YAML-based but contain specific modeling keywords that benefit from specialized highlighting.

- **Create Grammar File**: Add `syntaxes/linkml.tmLanguage.json`.
- **Keywords to Highlight**:
  - Top-level: `classes`, `slots`, `types`, `enums`, `prefixes`, `imports`, `name`, `id`, `description`, `default_prefix`, `default_range`, `metamodel_version`.
  - Class/Slot properties: `is_a`, `abstract`, `mixin`, `attributes`, `multivalued`, `required`, `range`, `identifier`, `any_of`, `exactly_one_of`, `none_of`, `all_of`.
- **Register in `package.json`**:

```json
"contributes": {
  "languages": [{
    "id": "linkml",
    "aliases": ["LinkML"],
    "extensions": [".linkml.yaml"],
    "configuration": "./language-configuration.json"
  }],
  "grammars": [{
    "language": "linkml",
    "scopeName": "source.yaml.linkml",
    "path": "./syntaxes/linkml.tmLanguage.json"
  }]
}
```

---

### 2. **Integrate LinkML Meta-Schema**
To provide validation and autocompletion, the LinkML meta-schema should be associated with LinkML files.

- **Download Schema**: Obtain the latest LinkML meta-schema from [w3id.org](https://w3id.org/linkml/meta.schema.json).
- **Bundle Schema**: Place it in a `schemas/linkml-meta.schema.json` directory.
- **Register Schema**:
  Add to `package.json`:
  ```json
  "yamlValidation": [
    {
      "fileMatch": ["*.linkml.yaml"],
      "url": "./schemas/linkml-meta.schema.json"
    }
  ]
  ```

---

### 3. **Implement Syntax Highlighting (TextMate)**
The `linkml.tmLanguage.json` should extend the base YAML grammar.

- **Scope Injection**: Use the `injectTo` property or include `source.yaml` in the patterns to ensure standard YAML highlighting still works for the rest of the file.
- **Sample Pattern**:
  ```json
  {
    "match": "\\b(classes|slots|types|enums|is_a|range|required)\\b(?=\\s*:)",
    "name": "keyword.control.linkml"
  }
  ```

---

### 4. **Programmatic Schema Association (Optional)**
If more dynamic association is needed (e.g., detecting LinkML based on file content like `metamodel_version:`), update `src/extension.ts`.

- Use the Red Hat YAML API to register a contributor that detects LinkML models.
- ```typescript
  yamlAPI.registerSchemaAssociation({
    fileMatch: ['*.yaml'],
    uri: 'https://w3id.org/linkml/meta.schema.json'
  });
  ```

---

### 5. **Testing**
- **Manual Test**: Open a `.linkml.yaml` file and verify that:
  - Keywords are colored differently from standard YAML keys.
  - Hovering over a keyword shows documentation from the meta-schema.
  - Invalid keys are flagged by the validator.
- **Automated Test**: Add a test case in `test/` that verifies the language ID and schema association for LinkML files.

---

### 6. **Documentation**
- Update `README.md` to mention built-in LinkML support.
- Provide examples of how to trigger the LinkML mode for standard `.yaml` files.
