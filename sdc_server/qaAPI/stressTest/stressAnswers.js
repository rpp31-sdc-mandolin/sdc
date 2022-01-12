

/*import http from 'k6/http';

export default function () {
  const url = 'http://localhost:4000/qa/questions/116/answers';


  const params = {

    question_id:116
  };
  http.get(url);
}*/
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
        { target: 1, duration: '30s' },
        { target: 10, duration: '30s' },
        { target: 100, duration: '30s' },
        { target: 400, duration: '30s' },
        //{ target: 600, duration: '1m' },
        //{ target: 1000, duration: '1m' },
        { target: 0, duration: '30s' },
      ],
    },
  },
};

export default function () {
  let product_id = Math.floor(Math.random() * (999777-900045)+900045)
  const res =http.get(`http://localhost:4000/qa/questions?product_id=${product_id}`);
  check(res, { 'status was 200': (r) => r.status == 200 });
}


/*import http from 'k6/http';
import { check} from 'k6';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: '30s',
      preAllocatedVUs: 100, // how large the initial pool of VUs would be
      maxVUs: 300, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
};

export default function () {
  const res = http.get('http://localhost:4000/qa/questions/116/answers');
  check(res, { 'status was 200': (r) => r.status == 200 });
}*/

