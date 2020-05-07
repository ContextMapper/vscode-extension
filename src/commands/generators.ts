/**
 * CML generator commands
 */

import { commands, window, Uri, OpenDialogOptions, InputBoxOptions } from "vscode";

type CommandType = (...args: any[]) => any;

export function generatePlantUML(): CommandType {
    return generate('cml.generate.puml', 'The PlantUML diagrams have been generated into the src-gen folder.');
}

export function generateMDSL(): CommandType {
    return generate('cml.generate.mdsl', 'The MDSL contracts have been generated into the src-gen folder.');
}

export function generateGenericTextFile(): CommandType {
    return async () => {
        const fileOptions: OpenDialogOptions = {
            canSelectMany: false,
            openLabel: 'Choose Freemarker template',
            filters: {
                'Freemarker templates': ['ftl']
            }
        };
        const inputBoxOptions: InputBoxOptions = {
            value: 'output.txt',
            prompt: 'Please enter a name for the file that shall be generated.',
            validateInput: (value: string) => {
                if (!value || 0 === value.length)
                    return 'Please enter a non-empty string as filename.';
                return '';
            }
        }

        const uriSelection: Uri[] = await window.showOpenDialog(fileOptions);

        const outputFileName: string = await window.showInputBox(inputBoxOptions);
        if (uriSelection && uriSelection[0]) {
            const templateUri: string = uriSelection[0].toString();
            const generateFunction: Function = generate('cml.generate.generic.text.file', 'The file has been generated into the src-gen folder.', { templateUri, outputFileName });
            generateFunction();
        }
    };
}

function generate(command: string, successMessage: string, ...additionalParameters: any[]): CommandType {
    return async () => {
        if (editorIsNotCMLEditor())
            return;

        if (documentInEditorHasURI()) {
            console.log(`Send command ${command} to CML language server.`);
            const returnVal: string = await commands.executeCommand(command, window.activeTextEditor.document.uri.toString(), additionalParameters);
            if (returnVal.startsWith('Error occurred:')) {
                window.showErrorMessage(returnVal);
            } else {
                window.showInformationMessage(successMessage);
            }
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
