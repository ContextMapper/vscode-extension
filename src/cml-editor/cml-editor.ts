/**
 * Helper functions for CML editor
 */

import { window, Uri } from "vscode";

export function isNotCMLEditor(): boolean {
    let activeEditor = window.activeTextEditor;
    return !activeEditor || !activeEditor.document || activeEditor.document.languageId !== 'cml';
}

export function documentHasURI(): boolean {
    return window.activeTextEditor.document.uri instanceof Uri;
}
