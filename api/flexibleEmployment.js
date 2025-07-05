// src/api/flexibleEmployment.js
import request from "@/utils/request.js";

/** 雇主入驻申请 */
export function applyEmployer(data) {
  return request.post("employer/apply", data);
}

/** 发布职位（按日计薪） */
export function createJob(data) {
  return request.post("job/create", data);
}

/** 更新职位信息 */
export function updateJob(data) {
  return request.post("job/update", data);
}

/** 获取职位列表 */
export function getJobList(data) {
  return request.get("job/list", data, { noAuth: true });
}

/** 获取职位详情 */
export function getJobDetail(jobId) {
  return request.get("job/detail/" + jobId, {}, { noAuth: true });
}

/** 预约报名 */
export function applyJob(data) {
  return request.post("job/apply", data);
}

/** 雇主申请记录列表 */
export function getEmployerRecordList() {
  return request.get("employer/record", {}, { noAuth: false });
}

/** 获取雇主申请详情（含审核状态） */
export function getEmployerApplyDetail(id) {
  return request.get("employer/detail/" + id, {}, { noAuth: false });
}

export function getJobRecordList() {
  return request.get('job/record', {}, { noAuth: false });
}

