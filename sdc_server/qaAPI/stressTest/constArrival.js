

import http from 'k6/http';
import { check} from 'k6';
export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      rate: 600, // 200 RPS, since timeUnit is the default 1s
      duration: '1m',
      preAllocatedVUs: 50,
      maxVUs: 100,
    },
  },
};

export default function () {
  const res =http.get('http://localhost:4000/qa/questions?product_id=34');
  check(res, { 'status was 200': (r) => r.status == 200 });
}

/*New-Relic
Account: 3382712 - Account 3382712
API Key
NRAK-28KNRYAMEXENM2GF7Q22FIBK3FG*/