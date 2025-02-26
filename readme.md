# 99Tech Code Challenge #1 #
### >node --version v22.14.0

## Quick Start


# Problem 1 #

```sh
node src/problem1/result-problem1.js
```


# Problem 2 #

How to install
```sh
npm install
```

Start sever react
```sh
npm run start
```
Sever: http://localhost:5000/


# Problem 3 #

How to install
```sh
npm install
```

Start sever react
```sh
npm run start
```
Sever: http://localhost:3000/


# Problem 4 #

```sh
node src/problem4/result-problem1.js
```


# Problem 5 #

I have 2 repos (Frontend and Backend)

### Frontend
Pls clone Frontend
```sh
git clone https://github.com/hoangchibao29062000/Nguyen-Hoang-Chi-Bao_Frontend-Problem5.git
```

How to start Fronend
  How to install
  ```sh
  npm install
  ```
  
  Start sever react
  ```sh
  npm run start
  ```
  Sever: http://localhost:5000/

### Backend
```sh
git clone https://github.com/hoangchibao29062000/Nguyen-Hoang-Chi-Bao_Backend-Problem5.git
```

My backend uses mysql so I need you to be able to install workbench, xampp,...

How to start Backend
  How to install
  ```sh
  npm install
  ```
  
  Start sever react
  ```sh
  npm run dev
  ```
  Sever: http://localhost:3000/

Regarding Backend, I wrote code to automatically create schema and table in database, but if there is an error, I have backed up a SQL Data file located at `Nguyen-Hoang-Chi-Bao_Backend-Problem5\sql` and after creating all data to Database, change a variable `synchronize` in file `Nguyen-Hoang-Chi-Bao_Backend-Problem5\src\config\database.ts` and variable `activeCreateValueDefault` located at `Nguyen-Hoang-Chi-Bao_Backend-Problem5\app.ts` .


Change: `synchronize = false` `Nguyen-Hoang-Chi-Bao_Backend-Problem5\src\config\database.ts`
```jsx
import "reflect-metadata";
import { DataSource } from "typeorm";
import { ENV } from "./env";

export const ConnectDatabase = new DataSource({
  type: "mysql",
  host: ENV.DB_HOST,
  port: Number(ENV.DB_PORT) || 3306,
  username: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  entities: ["src/models/*.ts"],
  // you should change variable synchronize = false
  // Because its function is to automatically create and change tables according to models
  synchronize: false, 
  logging: true,
});
```

Change: `const activeCreateValueDefault = false` `Nguyen-Hoang-Chi-Bao_Backend-Problem5\app.ts`
Because this variable is responsible for allowing the creation of necessary setting variables for the server, for example: config,...

```jsx
const activeCreateValueDefault = false;
```
