"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _readline = _interopRequireDefault(require("readline"));

var _models = require("../models");

var _seedData = _interopRequireDefault(require("./seed-data.json"));

var constants = _interopRequireWildcard(require("../constants"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// DB Setup
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  loggerLevel: 'error'
};
/**
  * Executes asynchronous database seeding with default values for UserSchema.
  * @param {UserSchema} entries
  */

const seedUsers = entries => {
  return new Promise((resolve, reject) => {
    Promise.all(entries.map(entry => {
      return new Promise((resolve, reject) => {
        const newUser = new _models.Users();
        newUser.first_name = entry.first_name;
        newUser.last_name = entry.last_name;
        newUser.email = entry.email;
        newUser.password = entry.password;
        newUser.save().then(savedUser => {
          return resolve(savedUser);
        }).catch(savingError => {
          return reject(savingError);
        });
      });
    })).then(newUsers => {
      console.log(`Seeded ${entries.length} new User documents`, newUsers);
      resolve(newUsers);
    }).catch(seedingError => {
      reject(seedingError);
    });
  });
};
/**
  * Executes asynchronous database seeding with default values for ResourceSchema.
  * @param {ResourceSchema} entries
  */


const seedResources = entries => {
  return new Promise((resolve, reject) => {
    Promise.all(entries.map(entry => {
      return new Promise((resolve, reject) => {
        const newResource = new _models.Resources();
        newResource.title = entry.title;
        newResource.description = entry.description;
        newResource.value = entry.value;
        newResource.date_resource_created = entry.date_resource_created;
        newResource.save().then(savedResource => {
          return resolve(savedResource);
        }).catch(savingError => {
          return reject(savingError);
        });
      });
    })).then(savedResources => {
      console.log(`Seeded ${entries.length} new Resource documents`, savedResources);
      resolve(savedResources);
    }).catch(seedingError => {
      reject(seedingError);
    });
  });
};
/**
  * Executes asynchronous database seeding with default values for SubResourceSchema.
  * @param {SubResourcesSchema} entries
  */


const seedSubResources = entries => {
  return new Promise((resolve, reject) => {
    Promise.all(entries.map(entry => {
      return new Promise((resolve, reject) => {
        const newSubResource = new _models.SubResources();
        newSubResource.title = entry.title;
        newSubResource.description = entry.description;
        newSubResource.value = entry.value;
        newSubResource.date_resource_created = entry.date_resource_created;
        newSubResource.save().then(savedSubResource => {
          return resolve(savedSubResource);
        }).catch(savingError => {
          return reject(savingError);
        });
      });
    })).then(savedSubResources => {
      console.log(`Seeded ${entries.length} new SubResource documents`, savedSubResources);
      resolve(savedSubResources);
    }).catch(seedingError => {
      reject(seedingError);
    });
  });
};
/**
 * Links together all documents that have fields which reference other documents.
 */


const linkDocuments = () => {
  return new Promise(resolve => {
    _models.SubResources.find({}).then(subResources => {
      _models.Resources.find({}).then(resources => {
        Promise.all(resources.map(resource => {
          return new Promise(resolve => {
            _models.Resources.findById(resource._id).then(resourceToModify => {
              resourceToModify.child_resources = subResources.map(subResource => {
                return subResource._id;
              });
              resourceToModify.save().then(modifiedResource => {
                return resolve(modifiedResource._id);
              });
            });
          });
        })).then(modifiedResources => {
          _models.Users.find({}).then(users => {
            Promise.all(users.map(user => {
              return new Promise(resolve => {
                _models.Users.findById(user._id).then(userToModify => {
                  userToModify.resource = modifiedResources[0]._id;
                  userToModify.save().then(modifiedUser => {
                    return resolve(modifiedUser._id);
                  });
                });
              });
            })).then(() => {
              Promise.all(subResources.map(subResource => {
                return new Promise(resolve => {
                  _models.SubResources.findById(subResource._id).then(subResourceToModify => {
                    subResourceToModify.parent_resource = modifiedResources[0]._id;
                    subResourceToModify.save().then(() => {
                      return resolve();
                    });
                  });
                });
              })).then(() => {
                resolve();
              });
            });
          });
        });
      });
    });
  });
};
/**
 * Main seed script.
 * Connects to current mongoURI, drops the database, and then re-populates with default values.
 */


const seedDB = () => {
  return new Promise(resolve => {
    // Connect the database
    _mongoose.default.connect(constants.MONGODB_URI, mongooseOptions).then(() => {
      console.log('Connected to Database');

      _mongoose.default.connection.db.dropDatabase(() => {
        _mongoose.default.connection.close(() => {
          _mongoose.default.connect(constants.MONGODB_URI).then(() => {
            Promise.all(_seedData.default.map(schemaSet => {
              return new Promise((resolve, reject) => {
                switch (schemaSet.schema) {
                  case 'User':
                    seedUsers(schemaSet.data).then(seededData => {
                      return resolve(seededData);
                    }).catch(seedingError => {
                      return reject(seedingError);
                    });
                    break;

                  case 'Resource':
                    seedResources(schemaSet.data).then(seededData => {
                      return resolve(seededData);
                    }).catch(seedingError => {
                      return reject(seedingError);
                    });
                    break;

                  case 'SubResource':
                    seedSubResources(schemaSet.data).then(seededData => {
                      return resolve(seededData);
                    }).catch(seedingError => {
                      return reject(seedingError);
                    });
                    break;

                  default:
                    reject(new Error('Invalid schema type specified in input data.'));
                }
              });
            })).then(() => {
              console.log('Seeding complete.');
              linkDocuments().then(() => {
                console.log('Newly seeded documents linked for testing. Safe to exit.');
                resolve();
              });
            }).catch(seedingError => {
              throw new Error(seedingError);
            });
          }).catch(connectionError => {
            throw new Error(connectionError);
          });
        });
      });
    }).catch(connectionError => {
      throw new Error(connectionError);
    });
  });
};

const cli = _readline.default.createInterface({
  input: process.stdin,
  output: process.stdout
});

cli.question(`Seeding the DB will delete all data connected to ${constants.MONGODB_URI}, are you sure? (Y/N)`, async answer => {
  cli.close();

  switch (answer) {
    case 'Y':
      await seedDB();
      break;

    default:
      console.log('Aborting... database will NOT be seeded.');
      break;
  }
});