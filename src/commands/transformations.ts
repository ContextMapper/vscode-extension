/**
 * CML OOAD transformation & refactoring commands
 */

import { commands, window, Uri, ViewColumn } from "vscode";
import * as editor from "../editors/cml-editor";
import { CommandType } from "./command"
import * as input from "./userinput";
import * as fs from 'fs';

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
        if (!integrationType)
            return;

        const featureBoundedContextName: string = args[1];

        const transformFunction: Function = transform('cml.ar.deriveFrontendBackendSystemsFromFeatureBC', featureBoundedContextName, integrationType);
        transformFunction();
    };
}

export function splitSystemContextIntoSubsystems(): CommandType {
    return async (...args: any[]) => {
        const existingSystemName: string = args[1];

        const name4ExistingContext = await input.askForName("Please provide a name for the existing system.", existingSystemName);
        if (!name4ExistingContext)
            return;

        const name4NewContext = await input.askForName("Please provide a name for the new system that shall be extracted.", "NewSubSystem");
        if (!name4NewContext)
            return;

        const transformFunction: Function = transform('cml.ar.splitSystemContextIntoSubsystems', existingSystemName, name4ExistingContext, name4NewContext);
        transformFunction();
    };
}

export function extractAggregatesByVolatility(): CommandType {
    return async (...args: any[]) => {
        const boundedContextName: string = args[1];

        const volatilityToExtract = await input.askForStringSelection("Please choose with which volatility value the Aggregates shall be extracted.", ["NORMAL", "OFTEN", "RARELY"]);
        if (!volatilityToExtract)
            return;

        const transformFunction: Function = transform('cml.ar.extractAggregatesByVolatility', boundedContextName, volatilityToExtract);
        transformFunction();
    };
}

export function extractAggregatesByCohesion(): CommandType {
    return async (...args: any[]) => {
        const boundedContextName: string = args[1];

        var i: number;
        var aggregates: string[] = [];
        for (i = 2; i < args.length; i++) {
            aggregates.push(args[i]);
        }

        const selectedAggregates: string[] = await input.askForMultipleStringSelection("Please select the Aggregates that shall be extracted.", aggregates);
        if (!selectedAggregates || selectedAggregates.length == 0)
            return;

        const newBoundedContextName: string = await input.askForName("Please define how the new Bounded Context shall be named.", "NewBoundedContext");
        if (!newBoundedContextName)
            return;

        const transformFunction: Function = transform('cml.ar.extractAggregatesByCohesion', boundedContextName, newBoundedContextName, selectedAggregates);
        transformFunction();
    };
}

export function mergeAggregates(): CommandType {
    return async (...args: any[]) => {
        const firstAggregateName: string = args[1];

        var i: number;
        var aggregates2Select: string[] = [];
        for (i = 2; i < args.length; i++) {
            aggregates2Select.push(args[i]);
        }

        const selectedAggregate: string = await input.askForStringSelection("Please select a second Aggregate with which you want to merge.", aggregates2Select);
        if (!selectedAggregate)
            return;

        const transformFunction: Function = transform('cml.ar.mergeAggregates', firstAggregateName, selectedAggregate);
        transformFunction();
    };
}

export function mergeBoundedContexts(): CommandType {
    return async (...args: any[]) => {
        const firstBoundedContext: string = args[1];

        var i: number;
        var boundedContexts2Select: string[] = [];
        for (i = 2; i < args.length; i++) {
            boundedContexts2Select.push(args[i]);
        }

        const selectecBoundedContext: string = await input.askForStringSelection("Please select a second Bounded Context with which you want to merge.", boundedContexts2Select);
        if (!selectecBoundedContext)
            return;

        const transformFunction: Function = transform('cml.ar.mergeBoundedContexts', firstBoundedContext, selectecBoundedContext);
        transformFunction();
    };
}

export function suspendPartnership(): CommandType {
    return async (...args: any[]) => {
        const boundedContext1: string = args[1];
        const boundedContext2: string = args[2];

        // unfortunately mode A (MERGE) does currently not work because of the following Xtext bug: https://github.com/eclipse/xtext-core/issues/1494
        const modeB: string = "Extract a new Bounded Context.";
        const modeC: string = "Replace the Partnership with an upstream-downstream relationship.";

        const modeBCode: string = "EXTRACT_NEW_BOUNDED_CONTEXT";
        const modeCCode: string = "REPLACE_RELATIONSHIP_WITH_UPSTREAM_DOWNSTREAM";

        const selectedMode: string = await input.askForStringSelection("Please choose the strategy with which you want to suspend the partnership.", [modeB, modeC]);
        if (!selectedMode)
            return;

        const mode: string = selectedMode === modeB ? modeBCode : modeCCode;
        var transformFunction: Function;
        if (mode === modeBCode) {
            console.log("chose mode B");
            transformFunction = transform('cml.ar.suspendPartnership', boundedContext1, boundedContext2, mode);
        } else if (mode === modeCCode) {
            console.log("chose mode C");
            const upstreamContext: string = await input.askForStringSelection("Please choose which Bounded Context shall become Upstream in the Upstream-Downstream relationship.", [boundedContext1, boundedContext2]);
            transformFunction = transform('cml.ar.suspendPartnership', boundedContext1, boundedContext2, mode, upstreamContext);
        }

        if (transformFunction != null)
            transformFunction();
    };
}

export function executeGenericCommandWithSingleStringArg(command: string): CommandType {
    return async (...args: any[]) => {
        const singleInputId: string = args[1];
        const transformFunction: Function = transform(command, singleInputId);
        transformFunction();
    }
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
