import jwtAuthz from "express-jwt-authz";

export const checkPermissions = (permissions: string[]) => {
    return jwtAuthz(permissions, {
        customScopeKey: "permissions",
        checkAllScopes: false,
        failWithError: false,
        customUserKey: "auth",
    });
};
//
