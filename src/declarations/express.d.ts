declare namespace Express {
    interface User {
        id: string;
        name: string;
        email: string;
        locale: string;
        accessToken: string;
        refreshToken?: string;
    }

    export interface Request {
        user?: User;
    }
}