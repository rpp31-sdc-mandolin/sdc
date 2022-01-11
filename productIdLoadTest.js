import http from 'k6/http';
import {sleep} from 'k6';

export const options = {
  vus: 200,
  duration: '60s'
}

export default function () {
  const url = 'http://127.0.0.1:3000/products/995953';

  // const params = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };
  http.get(url);
  sleep(1)
  // http.get(url, payload, params);
}