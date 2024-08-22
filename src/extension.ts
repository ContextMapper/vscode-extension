'use strict';

import * as path from 'path';
import * as os from 'os';

import { Trace } from 'vscode-jsonrpc';
import { commands, workspace, ExtensionContext, Uri, InputBoxOptions } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, VersionedTextDocumentIdentifier } from 'vscode-languageclient';
import * as generators from "./commands/generators";
import * as transformations from "./commands/transformations";
import * as quickfixCommands from "./commands/quickfixcommands";

export function activate(context: ExtensionContext) {
    let launcher = os.platform() === 'win32' ? 'context-mapper-lsp.bat' : 'context-mapper-lsp';
    let script = context.asAbsolutePath(path.join('lsp', 'bin', launcher));

    let serverOptions: ServerOptions = {
        run: { command: script },
        debug: { command: script, args: ['-log'], options: { env: createDebugEnv() } }
    };

    let clientOptions: LanguageClientOptions = {
        documentSelector: ['cml', 'scl'],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/*.*')
        }
    };

    // Create the language client and start the client.
    let lc = new LanguageClient('CML Language Server', serverOptions, clientOptions);

    // Register generator commands
    context.subscriptions.push(
        // CML
        commands.registerCommand("cml.generate.puml.proxy", generators.generatePlantUML()),
        commands.registerCommand("cml.generate.sketchminer.proxy", generators.generateSketchMinerDiagrams()),
        commands.registerCommand("cml.generate.mdsl.proxy", generators.generateMDSL()),
        commands.registerCommand("cml.generate.generic.text.file.proxy", generators.generateGenericTextFile()),
        commands.registerCommand("cml.generate.contextmap.proxy", generators.generateContextMap())
    );

    // Register transformation commands
    context.subscriptions.push(
        commands.registerCommand("cml.ar.deriveSubdomainFromURs.proxy", transformations.deriveSubdomainFromUserRequirements()),
        commands.registerCommand("cml.ar.deriveBoundedContextFromSDs.proxy", transformations.deriveBoundedContextFromSubdomains()),
        commands.registerCommand("cml.ar.deriveFrontendBackendSystemsFromFeatureBC.proxy", transformations.deriveFrontendAndBackendSystemFromFeatureBC()),
        commands.registerCommand("cml.ar.splitSystemContextIntoSubsystems.proxy", transformations.splitSystemContextIntoSubsystems()),
        commands.registerCommand("cml.ar.extractAggregatesByVolatility.proxy", transformations.extractAggregatesByVolatility()),
        commands.registerCommand("cml.ar.extractAggregatesByCohesion.proxy", transformations.extractAggregatesByCohesion()),
        commands.registerCommand("cml.ar.mergeAggregates.proxy", transformations.mergeAggregates()),
        commands.registerCommand("cml.ar.mergeBoundedContexts.proxy", transformations.mergeBoundedContexts()),
        commands.registerCommand("cml.ar.suspendPartnership.proxy", transformations.suspendPartnership()),
        commands.registerCommand("cml.ar.moveStakeholderToGroup.proxy", transformations.executeGenericCommandWithSingleStringArg("cml.ar.moveStakeholderToGroup")),
        commands.registerCommand("cml.ar.createValueForStakeholder.proxy", transformations.executeGenericCommandWithSingleStringArg("cml.ar.createValueForStakeholder")),
        commands.registerCommand("cml.ar.addEthicalValueAssessment.proxy", transformations.executeGenericCommandWithSingleStringArg("cml.ar.addEthicalValueAssessment")),
        commands.registerCommand("cml.ar.wrapValueInCluster.proxy", transformations.executeGenericCommandWithSingleStringArg("cml.ar.wrapValueInCluster")),
        commands.registerCommand("cml.ar.createStakeholderForUserStoryRole.proxy", transformations.executeGenericCommandWithSingleStringArg("cml.ar.createStakeholderForUserStoryRole")),
        commands.registerCommand("cml.ar.createValueRegisterForBoundedContext.proxy", transformations.executeGenericCommandWithSingleStringArg("cml.ar.createValueRegisterForBoundedContext")),
    );

    // Register quickfix commands
    context.subscriptions.push(
        commands.registerCommand("cml.quickfix.command.splitStoryByVerb.proxy", quickfixCommands.splitStoryByVerb()),
        commands.registerCommand("cml.flow.open.sketch.miner", quickfixCommands.openFlowInSketchMiner()),
        commands.registerCommand("cml.coordination.open.sketch.miner", quickfixCommands.openCoordinationInSketchMiner())
    );

    // enable tracing (.Off, .Messages, Verbose)
    lc.trace = Trace.Verbose;
    let disposable = lc.start();

    // Push the disposable to the context's subscriptions so that the 
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
}

function createDebugEnv() {
    return Object.assign({
        JAVA_OPTS: "-Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=8000,suspend=n,quiet=y"
    }, process.env)
}