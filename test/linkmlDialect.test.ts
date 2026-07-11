/* --------------------------------------------------------------------------------------------
 * Copyright (c) Red Hat, Inc. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import assert = require('assert');
import { isLinkMLSchemaText } from '../src/extension';

describe('Tests for LinkML dialect detection', () => {
  it('detects LinkML schemas with id and definition sections', () => {
    assert.equal(
      isLinkMLSchemaText(`---
id: https://example.org/person
name: person
classes:
  Person:
    slots:
      - name
`),
      true
    );
  });

  it('does not treat ordinary YAML with id fields as a LinkML schema', () => {
    assert.equal(
      isLinkMLSchemaText(`id: 123
name: deployment
metadata:
  labels:
    app: api
`),
      false
    );
  });

  it('requires id to be the first significant root key', () => {
    assert.equal(
      isLinkMLSchemaText(`name: person
id: https://example.org/person
classes:
  Person: {}
`),
      false
    );
  });
});
