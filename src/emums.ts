export enum Role {
    SystemAdministrator = "System administrator",
    CompetitionAdministrator = "Competition administrator",
    Participant = "Participant",
    TasksAdministrator = "Tasks administrator",
}

export enum Category {
    Frontend = "Frontend",
    Angular = "Angular",
    React = "React",
    TypeScript = "TypeScript",
    JavaScript = "JavaScript",
    dotNet = ".Net",
    CSharp = "C Sharp",
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
    expressLocalEgor = 6666,
    azure = 0,
}

export enum ItemPermission {
    CreateItems = "create:items",
    UpdateItems = "update:items",
    DeleteItems = "delete:items",
}
