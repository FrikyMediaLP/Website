## Tim Klenk

My Website [TimKlenk.de](https://timklenk.de) was build with the frontend Framework Angular and is hosted on NodeJs using Express.

### How to Run it

First, install [Node.js](https://nodejs.dev/en/learn/how-to-install-nodejs/) and [git](https://git-scm.com/downloads).

Then, download this Repository:

```
git clone <this-repo>
```

This Repo includes `two node projects`: 
- the Frontend running Angular 
- the Backend running pure node 

Install all dependencies for each project like this:
```
cd <frontend or backend folder directory>
npm install
```

To start the Frontend run the follwing commands - this will host a live updating dev server.
```
cd <frontend directory> (if you are not there yet)
ng serve
```

Check the dev server on `http://localhost:4200/`.

**Note:** The Frontend assumes the API is hosted on the same domain and port as the website - if you´re testing on the ng serve dev server, you need to point the Frontend to another API backend server. Checkout [Enviroment Variables](#environment-variables) below!

After making changes to the Frontend run the follwing commands - this compiles the code for production and places it into the public folder of the backend.
```
ng build
```

To start the Backend, run:
```
cd <backend directory>
npm start
```

Check the final website on `http://localhost:8888/`.

### Environment Variables

#### Front End Angular App

Create an `environment.ts` and an `environment.prod.ts` file in the `<frontend dir>/src/environments` folder and fill the following Variables with your information.

```
export const environment = {
    production: false, //true in environment.prod.ts
    TTV_CLIENT_ID: <YOUR TWITCH APPLICATION ID>,
    LOGIN_SERVER: 'http://localhost:<PORT>',
    CONTACTS_SERVER: 'http://localhost:<PORT>',
    ADMIN_TWITCH_IDS: ['<USER_ID_1>', '<USER_ID_2>', ...]
};
```

**Note:** To use Twitch Login create a [Twitch Application](https://dev.twitch.tv/console/apps/create), supply the Client ID here and add `http://localhost:<PORT>/login` to the OAuth Redirect URLs.

**Note:** Keep `LOGIN_SERVER` and `CONTACTS_SERVER` empty in production to host the API on the same backend server.

#### Back End NodeJs App
Create a `.env` in the `<backend dir>` folder and fill the following Variables with your information.

```
PORT="<PORT>"
MAIL_LOGIN_EMAIL="<YOUR EMAIL>"
MAIL_LOGIN_PW="<YOUR EMAIL PASSWORD>"
MAIL_TO_EMAIL="<AN EMAIL TO SEND CONTACT REQUESTS TO>"
TWITCH_USER_ID="<COMMA SEPARATED LIST OF TWITCH USER IDs>"
```

## Contributing
Assets are omitted on purpose - so most contributions will end in fixing typos or adding further language options, both are highly welcome :)