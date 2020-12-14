/**
 * CML quickfix commands
 */

import * as vscode from "vscode";
import { commands, window, Uri, ViewColumn } from "vscode";
import * as editor from "../editors/cml-editor";
import { CommandType } from "./command"
import * as input from "./userinput";

export function splitStoryByVerb(): CommandType {
    return async (...args: any[]) => {
        const storyName = args[1];

        const firstVerb: string = await input.askForVerb("Please enter a verb for the splitted story (such as 'create', 'search', 'update', etc.).", "");

        if (firstVerb !== undefined) {
            var verbList: string[] = [firstVerb];
            var nextVerb = await input.askForVerb("Please enter a verb for the splitted story (such as 'create', 'search', 'update', etc.).", "");
            while (nextVerb !== undefined) {
                verbList.push(nextVerb);
                nextVerb = await input.askForVerb("Please enter a verb for the splitted story (such as 'create', 'search', 'update', etc.).", "");
            }
            console.log("call with: " + verbList);
            const transformFunction: Function = transform('cml.quickfix.command.splitStoryByVerb', storyName, verbList);
            transformFunction();
        }        
    };
}

export function openFlowInSketchMiner(): CommandType {
    return async (...args: any[]) => {
        vscode.env.openExternal(vscode.Uri.parse(args[0]));
    };
}

function transform(command: string, ...additionalParameters: any[]): CommandType {
    return async () => {
        if (editor.isNotCMLEditor())
            return;

        if (editor.documentHasURI()) {
            console.log(`Send command ${command} to CML language server.`);
            const returnVal: string = await commands.executeCommand(command, window.activeTextEditor.document.uri.toString(), additionalParameters);
            if (returnVal.startsWith('Error occurred:')) {
                window.showErrorMessage(returnVal);
            }
        }
    };
}
