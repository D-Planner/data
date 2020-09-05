import express from 'express';

import { SCOPES, requireAuth } from '../authentication';
import { llController } from '../controllers';
import { Resources } from '../models';

const router = express();

router.route('/reviews')

  .get(requireAuth([SCOPES.LL_REVIEWS.READ]), llController.readReviews)

  .post(requireAuth, (req, res) => {
    const resource = new Resources();

    resource.title = req.body.title;
    resource.description = req.body.description;
    resource.value = req.body.value;
    resource.date_account_created = Date.now();

    resource.save()
      .then((savedResource) => {
        return res.json(savedResource);
      }).catch((error) => {
        return res.status(500).json(error);
      });
  })

  // Delete all resources (SECURE, TESTING ONLY)
  .delete(requireAuth, (req, res) => {
    Resources.deleteMany({ })
      .then(() => {
        return res.json({ message: 'Successfully deleted all resources.' });
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  });

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
  .put(requireAuth, (req, res) => {
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
  .delete(requireAuth, (req, res) => {
    Resources.deleteOne({ _id: req.params.id })
      .then(() => {
        return res.json({ message: `Resource with id: ${req.params.id} was successfully deleted` });
      })
      .catch((error) => {
        return res.json(error);
      });
  });

export default router;
