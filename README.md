# Mail service

### Description

Authorize the app via google oauth and use this session to send mails as the logged in user via google mail.

### Environmental Variables

Add a environment file to that should **NEVER** be commited to the repository.
<br>
The `.env` file should contain the following variables:


**These values should remain a secret**
```sh
# Server settings
PORT
# Cookie settings
COOKIE_NAME
COOKIE_SECRET
# Get the following values from the google oauth2 credentials
CLIENT_ID
CLIENT_SECRET
CALLBACK_URL
AUTH_URL
TOKEN_URL
```

### Google

Remove user consent [here](https://myaccount.google.com/permissions)

### Redis

The user sessions are stored in a redis database. Please make sure you have [Docker](https://www.docker.com/products/docker-desktop) installed, then start the redis server with:

```sh
$ docker-compose up -d
```

This will run the redis server in the background. You can stop the server with:

```sh
$ docker-compose stop
```

#### Redis-cli
To access the redis-cli within a docker image you will have to run the following command:

```sh
$ docker exec -it <docker-image-identifier> redis-cli
```

Use `monitor` to view the redis activity:

```sh
$ monitor
```

Use `flushdb` to remove all data from the database:

```sh
$ flushdb
```