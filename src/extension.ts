'use strict';

import * as vscode from 'vscode';
import CommandRunner from './command-runner';
import ActiveEditorListener from './active-editor-listener'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Extension "rails-buddy" is now active!');
    const extensionCommands = {
        'extension.rModel': () => { CommandRunner.rModel() },
        'extension.rController': () => { CommandRunner.rController() },
        'extension.rUnitTest': () => { CommandRunner.rUnitTest() },
        'extension.rFunctionalTest': () => { CommandRunner.rFunctionalTest() },
        'extension.rView': () => { CommandRunner.rView() },
        'extension.rMigration': () => { CommandRunner.rMigration() },
        'extension.rRelated': () => { CommandRunner.rRelated() }
    }

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    for(const extensionCommand in extensionCommands){
        const disposable = vscode.commands.registerCommand( extensionCommand, 
                               extensionCommands[extensionCommand]
                           )
        context.subscriptions.push(disposable);
    }

    // Active TextEditor listener
    vscode.window.onDidChangeActiveTextEditor(ActiveEditorListener.onChange)
    
    ActiveEditorListener.onChange(vscode.window.activeTextEditor)
}

// this method is called when your extension is deactivated
export function deactivate() {
}