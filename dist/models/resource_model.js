"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const ResourceSchema = new _mongoose.Schema({
  title: {
    type: String,
    default: 'Untitled'
  },
  description: {
    type: String,
    default: ''
  },
  value: {
    type: Number,
    default: null
  },
  date_resource_created: {
    type: Date,
    default: Date.now()
  },
  // default JSON date format for JS: https://stackoverflow.com/a/15952652/10256611,
  child_resources: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'SubResource'
  }]
});

const ResourceModel = _mongoose.default.model('Resource', ResourceSchema);

var _default = ResourceModel;
exports.default = _default;