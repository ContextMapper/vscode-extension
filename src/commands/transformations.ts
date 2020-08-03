/**
 * CML OOAD transformation commands
 */

import { commands, window, workspace, Uri, OpenDialogOptions, InputBoxOptions, TextDocumentShowOptions, ViewColumn } from "vscode";
import * as editor from "../editors/cml-editor";
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

export function deriveFrontendAndBackendSystemFromFeatureBC(): CommandType {
    return async (...args: any[]) => {
        const integrationType = await input.askForStringSelection("Please choose how the new systems shall integrate.", ["CONFORMIST", "ACL"]);
        if(!integrationType)
            return;

        const featureBoundedContextName : string = args[1];

        const transformFunction: Function = transform('cml.ar.deriveFrontendBackendSystemsFromFeatureBC', featureBoundedContextName, integrationType);
        transformFunction();
    };
}

export function splitSystemContextIntoSubsystems(): CommandType {
    return async (...args: any[]) => {
        const existingSystemName : string = args[1];
        
        const name4ExistingContext = await input.askForName("Please provide a name for the existing system.", existingSystemName);
        if(!name4ExistingContext)
            return;
        
        const name4NewContext = await input.askForName("Please provide a name for the new system that shall be extracted.", "NewSubSystem");
        if(!name4NewContext)
            return;

        const transformFunction: Function = transform('cml.ar.splitSystemContextIntoSubsystems', existingSystemName, name4ExistingContext, name4NewContext);
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
