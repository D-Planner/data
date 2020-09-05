import dotenv from 'dotenv';
import packageInfo from '../package.json';

dotenv.config({ silent: true });

export const PORT = process.env.PORT || 9090;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/dplanner-data';
export const SELF_URL = process.env.NODE_ENV === 'development' ? `http://localhost:${9090}` : packageInfo.productionURL;
