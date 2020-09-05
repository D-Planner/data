"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _db = require("./db");

var _routers = require("./routers");

var constants = _interopRequireWildcard(require("./constants"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// initialize
const app = (0, _express.default)(); // enable/disable cross origin resource sharing if necessary

app.use((0, _cors.default)()); // enable/disable http request logging

app.use((0, _morgan.default)('dev')); // enable json message body for posting data to API

app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use(_bodyParser.default.json()); // declare routers

app.use('/ll', _routers.llRouter); // NOTE: Partially secured to users
// default index route

app.get('/', (req, res) => {
  res.send('Welcome to backend!');
}); // DB Setup

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  loggerLevel: 'error'
}; // Connect to MongoDB

_mongoose.default.connect(constants.MONGODB_URI, mongooseOptions).then(() => {
  _mongoose.default.Promise = global.Promise; // configures mongoose to use ES6 Promises

  console.log(`Connected to MongoDB at ${constants.MONGODB_URI}`);
}).catch(err => {
  console.log('Not Connected to MongoDB ERROR! ', err);
}); // Connect to Postgres


_db.LLAppDB.connect().then(() => {
  console.log(`Connected to Postgres DB at ${process.env.LL_APP_DB_HOST}`);
}).catch(err => {
  console.log('Not Connected to Postgres ERROR! ', err);
}); // // Reset database route
// // WARNING: NOT CONFIGURED FOR DEPLOYMENT
// app.use('/reset', (req, res) => {
//   if (req.headers.key === LOAD_KEY_HERE) { // Configure or add additional logic (preferably from .env file)
//     mongoose.connection.db.dropDatabase(() => {
//       mongoose.connection.close(() => {
//         mongoose.connect(mongoURI).then(() => {
//           const authUser = new User();
//           authUser.first_name = 'FIRST_AUTOGEN';
//           authUser.last_name = 'LAST_AUTOGEN';
//           authUser.email = 'AUTOGEN@TEST.COM'; // Configure this
//           authUser.password = 'PASSWORD'; // Configure this
//           authUser.save().then((savedUser) => {
//             res.json({ message: `Reset database, created new user with id ${savedUser._id}`, user: savedUser });
//           });
//         });
//       });
//     });
//   } else {
//     res.status(401).json({ message: 'You are not authorized to perform this request' });
//   }
// });
// Custom 404 middleware


app.use((req, res) => {
  res.status(404).json({
    message: 'The route you\'ve requested doesn\'t exist'
  });
}); // START THE SERVER
// =============================================================================

app.listen(constants.PORT);
console.log(`listening on: ${constants.PORT}`);