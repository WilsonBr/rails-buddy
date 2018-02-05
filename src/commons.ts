export const REG_EXP_PER_FILE_TYPE = {
    MODEL: RegExp(/^.*app\/models\/([^\.]+)\.rb/),
    CONTROLLER: RegExp(/^.*app\/controllers\/([^\.]+)\.rb/),
    UNIT_TEST: RegExp(/^.*test\/unit\/([^\.]+)\.rb/),
    FUNCTIONAL_TEST: RegExp(/^.*test\/functional\/([^\.]+)\.rb/),
    VIEW: RegExp(/^.*app\/views\/([^\.]+)(\.\w+)?\.erb/),
    MIGRATION: RegExp(/^.*db\/migrations\/([^\.]+)\.rb/),
}

export const enum RailsFileType {
    Model = 1,
    Controller = 2,
    UnitTest = 3,
    FunctionalTest = 4,
    View = 5,
    Migration = 6
}