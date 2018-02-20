'use strict';

import * as vscode from 'vscode';
import { REG_EXP_PER_FILE_TYPE, RailsFileType } from './commons'
import { GlobPattern } from 'vscode';

class ActiveEditorListener {
    private static currentEditorFileType: RailsFileType
    private static activeTextEditor: vscode.TextEditor
    
    static onChange(activeEditor: vscode.TextEditor) {
        ActiveEditorListener.activeTextEditor = activeEditor

        
        if(!activeEditor || !activeEditor.document){
            return
        }
        console.log(`Active changed to ${activeEditor.document.uri.path}`)

        const documentPath = activeEditor.document.uri.path
        if(REG_EXP_PER_FILE_TYPE.MODEL.exec(documentPath)){
            console.log('This is a model')
            ActiveEditorListener.currentEditorFileType = RailsFileType.Model
            
        } else if(REG_EXP_PER_FILE_TYPE.CONTROLLER.exec(documentPath)){
            console.log('This is a controller')
            ActiveEditorListener.currentEditorFileType = RailsFileType.Controller

        } else if(REG_EXP_PER_FILE_TYPE.UNIT_TEST.exec(documentPath)){
            console.log('This is a unit test')
            ActiveEditorListener.currentEditorFileType = RailsFileType.UnitTest

        } else if(REG_EXP_PER_FILE_TYPE.FUNCTIONAL_TEST.exec(documentPath)){
            console.log('This is a func. test')
            ActiveEditorListener.currentEditorFileType = RailsFileType.FunctionalTest
            
        } else if(REG_EXP_PER_FILE_TYPE.VIEW.exec(documentPath)){
            console.log('This is a view')
            ActiveEditorListener.currentEditorFileType = RailsFileType.View
            
        } else if(REG_EXP_PER_FILE_TYPE.MIGRATION.exec(documentPath)){
            console.log('This is a migration')
            ActiveEditorListener.currentEditorFileType = RailsFileType.Migration
        }
    }

    static openRelatedFile(){
        if(!ActiveEditorListener.activeTextEditor){
            return
        }

        const documentPath = ActiveEditorListener.activeTextEditor.document.uri.path
        const documentOpener = (fileSearchPattern: GlobPattern) => {
            vscode.workspace.findFiles(fileSearchPattern).then(function(result){
                if(result && result.length > 0){
                    console.log(`Related file: ${result[0]}`)
                    if(result.length > 1){
                        console.warn(`Multiple matching paths while opening related rails file ${result.join(',')}`)
                    }
                    vscode.window.showTextDocument(result[0], {
                        preserveFocus: false,
                        preview: true
                    })
                }
            })
        }

        let matcher

        switch(ActiveEditorListener.currentEditorFileType){
            case RailsFileType.Model:
                if(matcher = REG_EXP_PER_FILE_TYPE.MODEL.exec(documentPath)){
                    const testName = matcher[1].replace(/^(.+)$/, "$1_test.rb")
                    documentOpener(`test/{unit,models}/${testName}`)
                }
                break
                
            case RailsFileType.UnitTest:
                if(matcher = REG_EXP_PER_FILE_TYPE.UNIT_TEST.exec(documentPath)){
                    const modelName = matcher[1].replace(/^(.+)_test$/, "$1.rb")
                    documentOpener(`app/models/${modelName}`)
                }

                break

            case RailsFileType.Controller:
                if(matcher = REG_EXP_PER_FILE_TYPE.CONTROLLER.exec(documentPath)){
                    const testName = matcher[1].replace(/^(.+)$/, "$1_test.rb")
                    documentOpener(`test/{controllers,functional}/${testName}`)
                }
                break

            case RailsFileType.FunctionalTest:
                if(matcher = REG_EXP_PER_FILE_TYPE.FUNCTIONAL_TEST.exec(documentPath)){
                    const controllerName = matcher[1].replace(/^(.+)_test$/, "$1.rb")
                    documentOpener(`app/controllers/${controllerName}`)
                }
                break
        }
    }
}

export default ActiveEditorListener