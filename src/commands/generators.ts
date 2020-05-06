/**
 * CML generator commands
 */

import { commands, ExtensionContext, window, workspace, Uri } from "vscode";

type CommandType = (...args: any[]) => any;

export function generatePlantUML(): CommandType {
    return generate('cml.generate.puml', 'The PlantUML diagrams have been generated into the src-gen folder.');
}

export function generateMDSL(): CommandType {
    return generate('cml.generate.mdsl', 'The MDSL contracts have been generated into to src-gen folder.');
}

function generate(command: string, successMessage: string): CommandType {
    return async () => {
        if (editorIsNotCMLEditor())
            return;

        if (documentInEditorHasURI()) {
            await commands.executeCommand(command, window.activeTextEditor.document.uri.toString());
            window.showInformationMessage(successMessage);
        }
    };
}

function editorIsNotCMLEditor(): boolean {
    let activeEditor = window.activeTextEditor;
    return !activeEditor || !activeEditor.document || activeEditor.document.languageId !== 'cml';
}

function documentInEditorHasURI(): boolean {
    return window.activeTextEditor.document.uri instanceof Uri;
}
