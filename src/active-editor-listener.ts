'use strict';

import * as vscode from 'vscode';
import { REG_EXP_PER_FILE_TYPE, RailsFileType } from './commons'

class ActiveEditorListener {
    private static currentEditorFileType: RailsFileType
    private static activeTextEditor: vscode.TextEditor
    
    static onChange(activeEditor: vscode.TextEditor) {
        ActiveEditorListener.activeTextEditor = activeEditor

        console.log(`Active changed to ${activeEditor.document.uri.path}`)

        if(!activeEditor){
            return
        }

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
        let matcher

        switch(ActiveEditorListener.currentEditorFileType){
            case RailsFileType.Model:
                if(matcher = REG_EXP_PER_FILE_TYPE.MODEL.exec(documentPath)){
                    const testName = matcher[1].replace(/^(.+)_model$/, "$1_test.rb")
                    vscode.workspace.findFiles(`test/unit/${testName}`).then(function(result){
                        if(result && result.length > 0){
                            console.log(`Related file: ${result[0]}`)
                            vscode.window.showTextDocument(result[0], {
                                preserveFocus: true,
                                preview: true
                            })
                    
                        }

                    })

                }

                break
        }
    }
}

export default ActiveEditorListener