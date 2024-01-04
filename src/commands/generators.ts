/**
 * CML generator commands
 */

import { commands, window, workspace, Uri, OpenDialogOptions, InputBoxOptions, TextDocumentShowOptions, ViewColumn } from "vscode";
import * as editor from "../editors/cml-editor";
import { CommandType } from "./command"
import * as fs from 'fs';

export function generatePlantUML(): CommandType {
    return generate('cml.generate.puml', 'The PlantUML diagrams have been generated into the src-gen folder.');
}

export function generateSketchMinerDiagrams(): CommandType {
    return generate('cml.generate.sketchminer', 'The Sketch Miner diagrams have been generated into the src-gen folder.');
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

export function generateContextMap(): CommandType {
    return async () => {
        const currentDocument = window.activeTextEditor.document;
        const configuration = workspace.getConfiguration('', currentDocument.uri);

        var selection = [{ label: "png", picked: true }, { label: "svg", picked: true }, { label: "dot", picked: true }];
        const selectedFormats: string[] = (await window.showQuickPick(selection, { canPickMany: true })).map(item => item.label);

        const params = {
            formats: selectedFormats,
            fixWidth: configuration.get('generation.contextMapGenerator.fixImageWidth') as boolean,
            fixHeight: configuration.get('generation.contextMapGenerator.fixImageHeight') as boolean,
            width: configuration.get('generation.contextMapGenerator.imageWidth') as number,
            height: configuration.get('generation.contextMapGenerator.imageHeight') as number,
            generateLabels: configuration.get('generation.contextMapGenerator.generateLabels') as boolean,
            labelSpacingFactor: configuration.get('generation.contextMapGenerator.labelSpacingFactor') as number,
            clusterTeams: configuration.get('generation.contextMapGenerator.clusterTeams') as boolean
        }

        if (selectedFormats && params) {
            const generateFunction: Function = generate('cml.generate.contextmap', 'The files have been generated into the src-gen folder.', params);
            await generateFunction();

            // preview png if it was generated
            var inputFileName = currentDocument.uri.toString().substring(currentDocument.uri.toString().lastIndexOf("/") + 1, currentDocument.uri.toString().length - 4);
            var pngUri = Uri.file(workspace.rootPath + "/src-gen/" + inputFileName + "_ContextMap.png");
            if (fs.existsSync(pngUri.fsPath))
                await commands.executeCommand('vscode.open', pngUri, { viewColumn: ViewColumn.Two });
        }
    };
}

function generate(command: string, successMessage: string, ...additionalParameters: any[]): CommandType {
    return async () => {
        if (editor.isNotCMLEditor())
            return;

        if (editor.documentHasURI()) {
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
