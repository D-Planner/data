import dotenv from 'dotenv';

dotenv.config({ silent: true });

const { MASTER_API_KEY } = process.env;

// Create function to transmit result of authenticate() call to user or next middleware
const requireKey = (scopes) => {
  return (req, res, next) => {
    if (req.query.dapikey === MASTER_API_KEY) next();
    else res.status(401).send('Invalid API key');
  };
};

export default requireKey;
