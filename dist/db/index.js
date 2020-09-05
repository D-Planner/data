"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "LLAppDB", {
  enumerable: true,
  get: function () {
    return _llAppDb.default;
  }
});
Object.defineProperty(exports, "LLCourseDB", {
  enumerable: true,
  get: function () {
    return _llCourseDb.default;
  }
});

var _llAppDb = _interopRequireDefault(require("./ll/ll-app-db"));

var _llCourseDb = _interopRequireDefault(require("./ll/ll-course-db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }