'use strict';

import * as path from 'path';
import * as os from 'os';

import { Trace } from 'vscode-jsonrpc';
import { commands, workspace, ExtensionContext, Uri, InputBoxOptions } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, VersionedTextDocumentIdentifier } from 'vscode-languageclient';
import * as generators from "./commands/generators";

export function activate(context: ExtensionContext) {
    let launcher = os.platform() === 'win32' ? 'context-mapper-lsp.bat' : 'context-mapper-lsp';
    let script = context.asAbsolutePath(path.join('lsp', 'bin', launcher));

    let serverOptions: ServerOptions = {
        run: { command: script },
        debug: { command: script, args: ['-log'], options: { env: createDebugEnv() } }
    };

    let clientOptions: LanguageClientOptions = {
        documentSelector: ['cml'],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/*.*')
        }
    };

    // Create the language client and start the client.
    let lc = new LanguageClient('CML Language Server', serverOptions, clientOptions);

    // Register generator commands
    context.subscriptions.push(
        commands.registerCommand("cml.generate.puml.proxy", generators.generatePlantUML()),
        commands.registerCommand("cml.generate.mdsl.proxy", generators.generateMDSL()),
        commands.registerCommand("cml.generate.generic.text.file.proxy", generators.generateGenericTextFile()),
        commands.registerCommand("cml.generate.contextmap.proxy", generators.generateContextMap())
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