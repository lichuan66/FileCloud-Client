import service from "@/request/index";

export function getFileList(routerPath) {
  return service({
    url: "/fileManage/getFileList",
    method: "post",
    data: {
      routerPath,
    },
  });
}

export function createFolder(routerPath, folderName) {
  return service({
    url: "/fileManage/createFolder",
    method: "post",
    data: {
      routerPath,
      folderName,
    },
  });
}

export function deleteFolder(routerPath, folderName) {
  return service({
    url: "/fileManage/deleteFolder",
    method: "post",
    data: {
      routerPath,
      folderName,
    },
  });
}

export function enterFolder(routerPath, folderName) {
  return service({
    url: "/fileManage/enterFolder",
    method: "post",
    data: {
      routerPath,
      folderName,
    },
  });
}

export function uploadFile(file) {
  return service({
    url: "/fileManage/uploadFile",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data: file,
  });
}

export function getFileData(routerPath, fileName) {
  return service({
    url: "/fileManage/getFileData",
    method: "post",
    data: {
      routerPath,
      fileName,
    },
  });
}
