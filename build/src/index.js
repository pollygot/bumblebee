"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.example" }); // Use this file as a baseline for your own environment
const ExpressApp = express();
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const EXPRESS_PORT = +(process.env.PORT || 3000);
const KUE_PORT = +(process.env.PORT || 3001);
ExpressApp.listen(EXPRESS_PORT, () => {
    console.log('Kue interface on localhost:' + EXPRESS_PORT + '/kue/');
    console.log('Kue JSON API on localhost:' + EXPRESS_PORT + '/api/');
    console.log('Kue Instance on localhost:' + KUE_PORT);
});
//# sourceMappingURL=index.js.map