
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 1 },
    { duration: '30s', target: 10},
    { duration: '30s', target: 100 },
    { duration: '1m', target: 200},
    {duration: '1m', target:1000},
    {duration: '20s', target:0}
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 200ms
  },
};

export default function () {
  const res = http.get('http://localhost:4000/qa/questions/116/answers');
  //http.get('https://httpbin.org/');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}