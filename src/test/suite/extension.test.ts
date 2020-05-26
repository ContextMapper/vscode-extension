import { strict as assert } from 'assert';

import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('A first sample test', () => {
		assert.ok(true);
	});
});