/**
 * SCL generator commands
 */

import { commands, window, workspace, Uri, OpenDialogOptions, InputBoxOptions, TextDocumentShowOptions, ViewColumn } from "vscode";
import * as editor from "../editors/scl-editor";
import { CommandType } from "./command"

export function generateServiceCutterUserRepresentationJSONFile(): CommandType {
    return generate('scl.generate.user.representations.json.file', 'The JSON file has been generated into the src-gen folder.');
}

function generate(command: string, successMessage: string, ...additionalParameters: any[]): CommandType {
    return async () => {
        if (editor.isNotSCLEditor())
            return;

        if (editor.documentHasURI()) {
            console.log(`Send command ${command} to SCL language server.`);
            const returnVal: string = await commands.executeCommand(command, window.activeTextEditor.document.uri.toString(), additionalParameters);
            if (returnVal.startsWith('Error occurred:')) {
                window.showErrorMessage(returnVal);
            } else {
                window.showInformationMessage(successMessage);
            }
        }
    };
}
