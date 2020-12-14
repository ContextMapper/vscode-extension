'use strict';

import * as path from 'path';
import * as os from 'os';

import { Trace } from 'vscode-jsonrpc';
import { commands, workspace, ExtensionContext, Uri, InputBoxOptions } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, VersionedTextDocumentIdentifier } from 'vscode-languageclient';
import * as generators from "./commands/generators";
import * as sclGenerators from "./commands/sclGenerators";
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
        commands.registerCommand("cml.generate.contextmap.proxy", generators.generateContextMap()),
        commands.registerCommand("cml.generate.new.service.cut.proxy", generators.generateNewServiceCut()),
        commands.registerCommand("cml.generate.servicecutter.input.proxy", generators.generateServiceCutterInput()),
        commands.registerCommand("cml.generate.servicecutter.user.representations.proxy", generators.generateServiceCutterUserRepresentations()),
        commands.registerCommand("cml.generate.servicecutter.user.representation.example.file.proxy", generators.generateServiceCutterUserRepresentationExampleFile()),
        
        // SCL
        commands.registerCommand("scl.generate.user.representations.json.file.proxy", sclGenerators.generateServiceCutterUserRepresentationJSONFile())
    );

    // Register OOAD transformation commands
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
        commands.registerCommand("cml.ar.extractSuggestedService.proxy", transformations.extractSuggestedServiceCut())
    );

    // Register quickfix commands
    context.subscriptions.push(
        commands.registerCommand("cml.quickfix.command.splitStoryByVerb.proxy", quickfixCommands.splitStoryByVerb()),
        commands.registerCommand("cml.flow.open.sketch.miner", quickfixCommands.openFlowInSketchMiner())
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