import * as assert from 'assert';
import * as sinon from 'sinon';

import * as vscode from 'vscode';
import * as myExtension from '../extension';
import CommandRunner from '../command-runner';
import { resolve } from 'path';

// Defines a Mocha test suite to group tests of similar kind together
suite("Command Runner", () => {
    let vscodeWindowStub
    let findFilesSpy

    suiteSetup( () =>{
        vscodeWindowStub = sinon.stub(vscode.window, 'showQuickPick')
        findFilesSpy = sinon.stub(vscode.workspace, 'findFiles')
    })

    suiteTeardown( () =>{
        vscodeWindowStub.restore()
        findFilesSpy.restore()
    })

    test("Open model", () => {
        
        findFilesSpy.returns(new Promise( (resolve) => {
            resolve([
                {path: 'app/models/foo.rb'},
                {path: 'app/models/bar.rb'},
                {path: 'app/models/deep/foo_bar.rb'},
            ])  
        }))

        return CommandRunner.rModel().then( () => {
            assert.ok(vscodeWindowStub.calledWith(['foo', 'bar', 'deep/foo_bar']))
        })
    });

    test("Open controller", () => {
        
        findFilesSpy.returns(new Promise( (resolve) => {
            resolve([
                {path: 'app/controller/foo_controller.rb'},
                {path: 'app/controller/bar_controller.rb'},
                {path: 'app/controller/deep/foo_bar_controller.rb'},
            ])  
        }))

        return CommandRunner.rController().then( () => {
            assert.ok(vscodeWindowStub.calledWith(['foo', 'bar', 'deep/foo_bar']))
        })
    });

    test("Open unit test", () => {
        
        findFilesSpy.returns(new Promise( (resolve) => {
            resolve([
                {path: 'test/unit/foo_test.rb'},
                {path: 'test/unit/bar_test.rb'},
                {path: 'test/unit/deep/foo_bar_test.rb'},
            ])  
        }))

        return CommandRunner.rUnitTest().then( () => {
            assert.ok(vscodeWindowStub.calledWith(['foo', 'bar', 'deep/foo_bar']))
        })
    });
    
    test("Open functional test", () => {
        
        findFilesSpy.returns(new Promise( (resolve) => {
            resolve([
                {path: 'test/functional/foo_controller_test.rb'},
                {path: 'test/functional/bar_controller_test.rb'},
                {path: 'test/functional/deep/foo_bar_controller_test.rb'},
                {path: 'test/controllers/barz_controller_test.rb'},
            ])  
        }))
        
        return CommandRunner.rFunctionalTest().then( () => {
            assert.ok(
                vscodeWindowStub.calledWith(
                    [
                        'foo_controller_test', 
                        'bar_controller_test', 
                        'deep/foo_bar_controller_test',
                        'barz_controller_test', 
                    ]
                )
            )

        })
    });

    test("Open view test", () => {
                
        findFilesSpy.returns(new Promise( (resolve) => {
            resolve([
                {path: 'app/views/view_1/index_1.html.erb'},
                {path: 'app/views/view_2/index_2.html.erb'},
                {path: 'app/views/view_3/index_3.html.erb'},
            ])  
        }))
    
        return CommandRunner.rView().then( () => {
            assert.ok(vscodeWindowStub.calledWith(['view_1/index_1', 'view_2/index_2', 'view_3/index_3']))
        })
    });

    test("Open migration test", () => {
                
        findFilesSpy.returns(new Promise( (resolve) => {
            resolve([
                {path: 'db/migrate/123_create_foos.rb'},
                {path: 'db/migrate/456_create_foos.rb'},
                {path: 'db/migrate/789_create_foos.rb'},
            ])  
        }))
    
        return CommandRunner.rMigration().then( () => {
            assert.ok(vscodeWindowStub.calledWith(['123_create_foos', '456_create_foos', '789_create_foos']))
        })
    });

});

