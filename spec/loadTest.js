import http from 'k6/http';
import { sleep } from 'k6';
import { EXPRESS_PORT } from '..config.js'

export let options = {
    vus: 100,
    duration: '60s',
    // stages: [
    //     { duration: '15s', target: 250 },
    //     { duration: '15s', target: 350 },
    //     { duration: '15s', target: 450 },
    //     { duration: '30s', target: 500 },
    //     { duration: '30s', target: 550 },
    //     { duration: '30s', target: 600 },
    //     { duration: '15s', target: 650 },
    //     { duration: '15s', target: 700 }
    // ],
    thresholds: {
        http_req_failed: ['rate<0.01'],   // http errors should be less than 1% 
        http_req_duration: ['p(98)<2000'], // 98% of requests should be below 2000ms
    }
  };


export default function() {
    function randn_bm() {
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
        return num
    }
    
    let page = Math.floor(randn_bm() * 50);
    let count = Math.floor(randn_bm() * 50);
    let randId = Math.floor(randn_bm() * (1000011 - 900010) + 900010);
    http.get(`http://localhost:${EXPRESS_PORT}/products/${randId}`);
    sleep(1);
}