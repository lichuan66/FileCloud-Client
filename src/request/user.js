import service from "@/request/index";

export function userLogin(body) {
  return service({
    url: "/user/userLogin",
    method: "post",
    data: body,
  });
}
