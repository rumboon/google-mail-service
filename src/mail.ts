import { google } from 'googleapis';

const createMessage = (from: string, to: string): string => {
    // You can use UTF-8 encoding for the subject using the method below.
    // You can also just use a plain string if you don't need anything fancy.
    const subject = '🤘 Hello 🤘';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        `From: ${from}`,
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        'This is a message just to say hello.',
        'So... <b>Hello!</b>  🤘❤️😎',
    ];
    const message = messageParts.join('\n');

    // The body needs to be base64url encoded.
    return Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function sendMail(user: Express.User): Promise<number> {
    const authClient = new google.auth.OAuth2({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.CALLBACK_URL,
    });

    authClient.setCredentials({
        'access_token': user.accessToken,
        'token_type': 'Bearer',
        'refresh_token': user.refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: authClient });

    const from = `${user.name} <${user.email}>`;

    // TODO send the mail to the provided receiver
    const to = from;

    const response = await gmail.users.messages.send({
        userId: user.id,
        requestBody: {
            raw: createMessage(from, to),
        },
    });

    return response.status;
}
