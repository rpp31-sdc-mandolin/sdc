

import http from 'k6/http';

export default function () {
  const url = 'http://localhost:4000/qa/questions?product_id=34';
  /*const payload = '';

  const params = {

    product_id:34
  };*/
  http.put(url);
}


