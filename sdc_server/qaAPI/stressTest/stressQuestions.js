

import http from 'k6/http';
import { check} from 'k6';
export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'ramping-arrival-rate',
      startRate: 50,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 200,
      stages: [
        { target: 100, duration: '30s' },
        { target: 400, duration: '30s' },
        { target: 600, duration: '1m' },
        //{ target: 1000, duration: '1m' },
        { target: 0, duration: '30s' },
      ],
    },
  },
};

export default function () {
  const res =http.get('http://localhost:4000/qa/questions?product_id=59553');
  check(res, { 'status was 200': (r) => r.status == 200 });
}