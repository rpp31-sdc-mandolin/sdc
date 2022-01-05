import http from 'k6/http';

export default function () {
  const url = 'http://127.0.0.1:3000/products/987654/styles';

  // const params = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };
  http.get(url);
  // http.get(url, payload, params);
}