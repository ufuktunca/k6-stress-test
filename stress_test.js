import http from "k6/http";
import { check } from "k6";
import { createCase } from "./helpers.js";

export const options = {
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<1000"], // 95% of requests should be below 1s
  },
  scenarios: {
    getCases: {
      executor: "constant-arrival-rate",
      preAllocatedVus: 25,
      rate: 1,
      exec: "getCases",
      duration: "17s",
      gracefulStop: "3s",
    },
    calculateBMI: {
      executor: "constant-arrival-rate",
      preAllocatedVus: 25,
      rate: 1,
      exec: "calculateBMI",
      duration: "17s",
      gracefulStop: "3s",
    },
    calculateCockroft: {
      executor: "constant-arrival-rate",
      preAllocatedVus: 25,
      rate: 1,
      exec: "calculateCockroft",
      duration: "17s",
      gracefulStop: "3s",
    },
    addComment: {
      executor: "constant-arrival-rate",
      preAllocatedVus: 25,
      rate: 1,
      exec: "addComment",
      duration: "17s",
      gracefulStop: "3s",
    },
  },
};

export function setup() {
  const res = createCase();

  return { caseId: res.body.id };
}

export function getCases() {
  const url = "https://medical-case-share-qa-api.herokuapp.com/cases";

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = http.get(url, params);

  check(res, {
    "Get Cases": (r) => r.status === 200,
  });
}

export function calculateBMI() {
  const url = "https://medical-case-share-qa-api.herokuapp.com/bmi";
  const payload = JSON.stringify({
    weight: 60,
    height: 185,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    "Calculate BMI": (r) => r.status === 200,
  });
}

export function calculateCockroft() {
  const url = "https://medical-case-share-qa-api.herokuapp.com/cockroft";
  const payload = JSON.stringify({
    weight: 60,
    age: 22,
    creatinine: 5,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    "Calculate Cockroft": (r) => r.status === 200,
  });
}

export function addComment(data) {
  const url = `https://medical-case-share-qa-api.herokuapp.com/cases/${data.id}/comment`;

  const payload = JSON.stringify({
    id: "2km6l4l6k",
    caseId: data.id,
    content: "You should be careful",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    "Add comment": (r) => r.status === 200,
  });
}
