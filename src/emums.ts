export enum Role {
    SystemAdministrator = "System administrator",
    CompetitionAdministrator = "Competition administrator",
    Participant = "Participant",
    TasksAdministrator = "Tasks administrator",
}

export enum TaskCategory {
    Frontend = "Frontend",
    Backend = "Backend",
    Angular = "Angular",
    React = "React",
    TypeScript = "TypeScript",
    JavaScript = "JavaScript",
    dotNet = ".Net",
    CSharp = "C#",
}

export enum AppError {
    General = "General",
    ConnectionError = "ConnectionError",
    QueryError = "QueryError",
    NoData = "NoData",
    NonNumericInput = "NonNumeric",
    InputParameterNotSupplied = "NoParameter",
    DeletionConflict = "DeletionConflict",
    RequiredFieldsNotProvided = "RequiredFieldsNotProvided",
    UniqueFieldsCollision = "UniqueFieldsCollision",
}

export enum HTTPRequestType {
    GET = "GET",
    POST = "POST",
    DEL = "DEL",
    PUT = "PUT",
}

export enum Host {
    localhost = "localhost",
    azure = "azure",
}

export enum Port {
    expressLocalEgor = 2050,
    azure = 0,
}

export enum TaskStaticPermission {
    CreateTaskStatic = "create:taskStatic",
    ReadTaskStatic = "read:taskStatic",
    UpdateTaskStatic = "update:taskStatic",
    DeleteTaskStatic = "delete:taskStatic",
}
