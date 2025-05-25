import http from "k6/http";
import { sleep, check } from "k6";

export let options = {
  vus: 20, // 20 virtual users
  duration: "30s", // for 30 seconds
};

export default function () {
  let res = http.get("http://lb:8080/tasks");
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(1); // wait 1s between iterations
}
