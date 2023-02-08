import service from "@/request/index";

export function userLogin(body) {
  return service({
    url: "/user/userLogin",
    method: "post",
    data: body,
  });
}

export function userSignUp(body) {
  return service({
    url: "/user/signUp",
    method: "post",
    data: body,
  });
}
