/**
 * CML OOAD transformation commands
 */

import { commands, window, workspace, Uri, OpenDialogOptions, InputBoxOptions, TextDocumentShowOptions, ViewColumn } from "vscode";
import * as editor from "../cml-editor/cml-editor";
import { CommandType } from "./command"
import * as input from "./userinput";

export function deriveSubdomainFromUserRequirements(): CommandType {
    return async (...args: any[]) => {
        var i: number;
        var userRequirements: string[] = [];
        for (i = 1; i < args.length; i++) {
            userRequirements.push(args[i]);
        }

        const domainName: string = await input.askForName("Please provide a name for the domain.", "NewDomain");
        if (!domainName)
            return;

        const subDomainName: string = await input.askForName("Please provide a name for the Subdomain.", "NewSubDomain");
        if (!subDomainName)
            return;

        const transformFunction: Function = transform('cml.ar.deriveSubdomainFromURs', domainName, subDomainName, userRequirements);
        transformFunction();
    };
}

export function deriveBoundedContextFromSubdomains(): CommandType {
    return async (...args: any[]) => {
        var i: number;
        var subdomains: string[] = [];
        for (i = 1; i < args.length; i++) {
            subdomains.push(args[i]);
        }

        const boundedContextName: string = await input.askForName("Please provide a name for the new Bounded Context.", "NewBoundedContext");
        if (!boundedContextName)
            return;

        const transformFunction: Function = transform('cml.ar.deriveBoundedContextFromSDs', boundedContextName, subdomains);
        transformFunction();
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
