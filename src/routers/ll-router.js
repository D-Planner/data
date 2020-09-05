import express from 'express';

import { SCOPES, requireToken, requireKey } from '../authentication';
import { llController } from '../controllers';
import { Resources } from '../models';

const router = express();

router.route('/query')

  .post(requireKey([SCOPES.LL_ALL.READ]), llController.serveQuery);

router.route('/:id')

  // Get resource by id
  .get((req, res) => {
    Resources.findById(req.params.id)
      .then((resource) => {
        return res.json(resource);
      })
      .catch((error) => {
        if (error.message && error.message.startsWith('Resource with id:')) {
          return res.status(404).json(error);
        } else {
          return res.status(500).json(error);
        }
      });
  })

  // Update resource by id (SECURE)
  .put(requireToken([]), (req, res) => {
    Resources.updateOne({ _id: req.params.id }, req.body)
      .then(() => {
        // Fetch resource object and send
        Resources.findById(req.params.id)
          .then((resource) => {
            return res.json(resource);
          })
          .catch((error) => {
            if (error.message.startsWith('Resource with id:')) {
              return res.status(404).json({ message: error.message });
            } else {
              return res.status(500).json({ message: error.message });
            }
          });
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  })

  // Delete resource by id, SECURE
  .delete(requireToken([]), (req, res) => {
    Resources.deleteOne({ _id: req.params.id })
      .then(() => {
        return res.json({ message: `Resource with id: ${req.params.id} was successfully deleted` });
      })
      .catch((error) => {
        return res.json(error);
      });
  });

export default router;
