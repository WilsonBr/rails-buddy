export const REG_EXP_PER_FILE_TYPE = {
    MODEL: RegExp(/^.*app\/models\/([^\.]+)\.rb/),
    CONTROLLER: RegExp(/^.*app\/controllers\/([^\.]+)\.rb/),
    UNIT_TEST: RegExp(/^.*test\/(?:unit|models)\/([^\.]+)\.rb/),
    FUNCTIONAL_TEST: RegExp(/^.*test\/(?:functional|controllers)\/([^\.]+)\.rb/),
    VIEW: RegExp(/^.*app\/views\/([^\.]+)(\.\w+)?\.erb/),
    MIGRATION: RegExp(/^.*db\/migrate\/([^\.]+)\.rb/),
}

export const enum RailsFileType {
    Model = 1,
    Controller = 2,
    UnitTest = 3,
    FunctionalTest = 4,
    View = 5,
    Migration = 6
}