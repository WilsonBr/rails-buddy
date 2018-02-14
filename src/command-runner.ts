'use strict';

import * as vscode from 'vscode'
import { REG_EXP_PER_FILE_TYPE } from './commons'
import ActiveEditorListener from './active-editor-listener'

class CommandRunner{
    static rModel() {
        console.log('Running command rModel')         
        const filePattern = 'app/models/**/*.rb'
        const fileMatcher = REG_EXP_PER_FILE_TYPE.MODEL

        return CommandRunner.userPickFile(filePattern, fileMatcher, CommandRunner.fileOpenCallback);
    }
    
    static rController() {
        console.log('Running command rController')         
        const filePattern = 'app/controllers/**/*.rb'
        const fileMatcher = REG_EXP_PER_FILE_TYPE.CONTROLLER
        
        return CommandRunner.userPickFile(filePattern, fileMatcher, CommandRunner.fileOpenCallback);
    }
    
    static rUnitTest() {
        console.log('Running command rUnitTest')
        const filePattern = `test/unit/**/*.rb`
        const fileMatcher = REG_EXP_PER_FILE_TYPE.UNIT_TEST
        
        return CommandRunner.userPickFile(filePattern, fileMatcher, CommandRunner.fileOpenCallback);
    }
    
    static rFunctionalTest() {
        console.log('Running command rFunctionalTest')         
        const filePattern = 'test/{functional,controllers}/**/*.rb'
        const fileMatcher = REG_EXP_PER_FILE_TYPE.FUNCTIONAL_TEST
        
        return CommandRunner.userPickFile(filePattern, fileMatcher, CommandRunner.fileOpenCallback);
    }
    
    static rView() {
        console.log('Running command rView')         
        const filePattern = 'app/views/**/*.erb'
        const fileMatcher = REG_EXP_PER_FILE_TYPE.VIEW
        
        return CommandRunner.userPickFile(filePattern, fileMatcher, CommandRunner.fileOpenCallback);
    }
    
    static rMigration() {
        console.log('Running command rView')         
        const filePattern = 'db/migrations/**/*.rb'
        const fileMatcher = REG_EXP_PER_FILE_TYPE.MIGRATION
        
        return CommandRunner.userPickFile(filePattern, fileMatcher, CommandRunner.fileOpenCallback);
    }

    static rRelated(){
        ActiveEditorListener.openRelatedFile()
    }
    //----------------------------------------------------------------
    // PRIVATE -------------------------------------------------------

    private static fileOpenCallback(itemKey: String, fileUri: vscode.Uri){
        console.log(`Item ${itemKey} selected`)
        console.log(fileUri.path)
        vscode.window.showTextDocument(fileUri, {
            preserveFocus: true,
            preview: true
        })
    }

    private static userPickFile(
        filePattern: string, 
        fileMatcher: RegExp, 
        optionSelectedCallback: (itemKey: String, fileUri: vscode.Uri) => void) {

        return vscode.workspace.findFiles(filePattern)
            .then(function (result) {
                const fileNames = result.reduce(function (result, currentItem) {
                    let matchStr;
                    if (matchStr = fileMatcher.exec(currentItem.path)) {
                        result[matchStr[1]] = currentItem;
                    }
                    return result;
                }, {});

                vscode.window.showQuickPick(Object.keys(fileNames), {
                    onDidSelectItem: function (item) {
                        if (item) {
                            optionSelectedCallback(item.toString(), fileNames[item.toString()]);
                        }
                        else {
                            console.log(`Selection cancelled by user`);
                        }
                    },
                });
            });
    }
}

export default CommandRunner