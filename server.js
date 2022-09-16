const http = require("http");
const app = require("./app/app");
require("dotenv").config();


http.createServer(app).listen(process.env.port || 3000, () => console.log(`Server running on port ${process.env.port}`));