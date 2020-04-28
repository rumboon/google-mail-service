require('dotenv').config()

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import redis from 'redis';
import ConnectRedis from 'connect-redis';
import { sendMail } from './mail';
import Authorization from './Authorization';

const RedisStore = ConnectRedis(session);

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
});

/*
 * Calling unref() will allow this program to exit immediately after the get
 * command finishes. Otherwise the client would hang as long as the
 * client-server connection is alive.
 */
redisClient.unref();

redisClient.on('error', (err) => {
    console.error('REDIS ERROR:', err);
});

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

app.use(session({
    secret: process.env.COOKIE_SECRET,
    name: process.env.COOKIE_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // TODO check if this is needed or needs to be true otherwise
    store: new RedisStore({ client: redisClient }),
}));

app.use(function(req, res, next) {
    if (!req.session) {
      return next(new Error('oh no, a session error occured :-(')) // TODO handle error
    }
    next();
  })

const auth = new Authorization(app);

app.get('/', async (req, res) => {
    res.send({ name: req.user ? req.user.name : '' }).status(200);
});

app.post('/send', async (req, res) => {
    if (!req.user || !req.user.id) {
        res.sendStatus(401);
        return;
    }

    try {
        const status = await sendMail(req.user);
        res.sendStatus(status);
        return;
    } catch(err) {
        console.log('Failed to send mail:', err);
        res.sendStatus(500);
    }
});

app.get('/authorize', auth.authorize());

// TODO failed redirect page or change it to something else
app.get('/callback', auth.callback(), (req, res) => {
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// TODO for pages that need authentication create a function that ensures this

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Server started on port ${process.env.PORT}`);
});