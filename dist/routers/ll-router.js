"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _authentication = require("../authentication");

var _controllers = require("../controllers");

var _models = require("../models");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.default)();
router.route('/query').post((0, _authentication.requireKey)([_authentication.SCOPES.LL_ALL.READ]), _controllers.llController.serveQuery);
router.route('/:id') // Get resource by id
.get((req, res) => {
  _models.Resources.findById(req.params.id).then(resource => {
    return res.json(resource);
  }).catch(error => {
    if (error.message && error.message.startsWith('Resource with id:')) {
      return res.status(404).json(error);
    } else {
      return res.status(500).json(error);
    }
  });
}) // Update resource by id (SECURE)
.put((0, _authentication.requireToken)([]), (req, res) => {
  _models.Resources.updateOne({
    _id: req.params.id
  }, req.body).then(() => {
    // Fetch resource object and send
    _models.Resources.findById(req.params.id).then(resource => {
      return res.json(resource);
    }).catch(error => {
      if (error.message.startsWith('Resource with id:')) {
        return res.status(404).json({
          message: error.message
        });
      } else {
        return res.status(500).json({
          message: error.message
        });
      }
    });
  }).catch(error => {
    return res.status(500).json(error);
  });
}) // Delete resource by id, SECURE
.delete((0, _authentication.requireToken)([]), (req, res) => {
  _models.Resources.deleteOne({
    _id: req.params.id
  }).then(() => {
    return res.json({
      message: `Resource with id: ${req.params.id} was successfully deleted`
    });
  }).catch(error => {
    return res.json(error);
  });
});
var _default = router;
exports.default = _default;