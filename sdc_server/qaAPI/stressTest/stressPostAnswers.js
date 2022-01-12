
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export const errorRate = new Rate('errors');

export default function () {
  const url = 'http://localhost:4000/qa/questions/116/answers';
  /*const params = {
    headers: {
      'Authorization': 'Token ffc62b27db68502eebc6e90b7c1476d29c581f4d',
      'Content-Type': 'application/json',
    },
  };*/
  const params = {};
  const answerData = JSON.stringify({
   // name: `Organization Name ${__VU}: ${__ITER}`,
    body:'How is this product',
    email:'simol123@gmail.com',
    name:'simol'
  });
  check(http.post(url, data, params), {
    'status is 201': (r) => r.status == 201,
  }) || errorRate.add(1);

  sleep(1);
}