# Learning: VS Code Language Specialization & IntelliSense Debugging

When specializing or extending a core language (like YAML) into a distinct dialect (like LinkML), detection and IntelliSense failures often stem from "The Silent Gap"—where the UI looks correct, but the underlying system is disconnected.

---

## 1. The `firstLine` Hijacking Rule

**Insight:** VS Code’s `firstLine` regex is **not** a global filter for all files. It is an *arbitrator* used only when a file’s extension is claimed by multiple languages.

*   **The Trap:** If your new language (e.g., `linkml`) doesn't list `.yaml` in its `extensions` array, VS Code will never run your `firstLine` regex on a `.yaml` file; it will simply hand it to the native YAML provider.
*   **The Fix:** Explicitly list common extensions (e.g., `".yaml"`) in your `package.json` language contribution. This forces VS Code to use the `firstLine` regex to decide which language "wins" the file.

## 2. The Protocol Handshake (`documentSelector`)

**Insight:** Switching the language mode in the status bar only changes the UI. It does not automatically tell the Language Server to start talking.

*   **The Trap:** If your `LanguageClientOptions.documentSelector` only listens for `yaml`, and you switch a file to `linkml`, the server will stop providing validation and completions even though the file is still technically YAML.
*   **The Fix:** Always synchronize your `package.json` language IDs with the server’s `documentSelector` in `extension.ts`.

## 3. Robust IntelliSense Testing

**Insight:** The "Clean Environment" is a myth in IDE testing. Global schema stores, peer extensions, and default settings will always pollute your completion lists.

*   **The Trap:** Asserting `actual.length === expected.length` in completion tests is a recipe for flakiness. Environmental noise (like the Schema Store returning 132 items) will break your build.
*   **The Fix:** Use "Inclusion-based" testing. Verify that your specific expected labels and kinds exist within the result, and ignore the rest of the "noise."

## 4. Handling "Frozen Set" Dialects

**Insight:** Many specialized dialects (like LinkML or CloudFormation) require "Strict Mode"—where unknown keys are errors—whereas the parent language (YAML) is "Lax" by default.

*   **The Trap:** Enabling the dialect without enabling strict validation (e.g., `yaml.disableAdditionalProperties`) leads to a poor developer experience where "errors" aren't caught.
*   **The Fix:** Use a guided "One-Click Enable" popup. When the dialect is detected, offer to toggle the dialect AND the strict validation settings simultaneously.

## 5. Debugging "The Bowels"

**Insight:** When IntelliSense fails silently, you must verify the document's state through logs, not the UI.

*   **The Workflow:**
    1.  **Trace State**: Add listeners for `onDidOpenTextDocument` and `onDidChangeActiveTextEditor` that log the `uri` and `languageId`.
    2.  **Verify Selector**: Confirm the logged `languageId` matches one of the server’s `documentSelector` entries.
    3.  **Log Triggers**: Log the specific result of your schema selection logic (e.g., "Detected LinkML schema for X") to ensure the provider is actually firing.

---
*Authored during the "Refining LinkML Detection" task: 2025-12-30.*
