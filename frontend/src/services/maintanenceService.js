import request from './api'
export const getMaintenanceByTinyHouseId=(tinyHouseId)=>request(`/Maintenance/tinyhouse/${tinyHouseId}`);
export const postMaintenance=(body)=>request(`/Maintenance`,POST,body);
export const deleteMaintenanceById=(id)=>request(`/Maintenance/${id}`);