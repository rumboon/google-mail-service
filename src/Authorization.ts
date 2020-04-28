import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { Express } from 'express';

interface ServiceCredentials {
    "client_id": string;
    "project_id": string;
    "auth_uri": string;
    "token_uri": string;
    "auth_provider_x509_cert_url": string;
    "client_secret": string;
    "redirect_uris": string[];
}

const SCOPE = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
];

passport.serializeUser(function(user: Express.User, done) {
    done(null, user);
});

passport.deserializeUser(function(user: Express.User, done) {
    done(null, user);
});

export default class Authorization {
    public constructor(app: Express) {
        passport.use(new Strategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
            authorizationURL: process.env.AUTH_URL,
            tokenURL: process.env.TOKEN_URL,
        }, (accessToken, refreshToken, profile, done) => {
            const user = {
                id: profile.id,
                name: profile.displayName,
                email: profile._json.email,
                locale: profile._json.locale,
                accessToken,
                refreshToken,
            }

            return done(undefined, user);
        }));

        
        app.use(passport.initialize());
        app.use(passport.session());
    }

    public authorize() {
        return passport.authenticate('google', { accessType: 'offline', scope: SCOPE });
    }

    public callback() {
        // TODO determine which page to redirect to on failing
        return passport.authenticate('google', { failureRedirect: '/failed' });
    }
}