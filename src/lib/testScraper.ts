import { monitorUrl } from './db/actions';

monitorUrl(1, 'https://example.com').then(() => console.log('Scraping Done!'));
