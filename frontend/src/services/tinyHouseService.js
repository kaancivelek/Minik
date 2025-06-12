import request from './api';

export const getAllTinyHouses = () => request('/TinyHouses');
export const getTinyHouseById = (id) => request(`/TinyHouses/${id}`);
export const getTinyHouseByName = (name) => request(`/TinyHouses/${name}`);
export const getTinyHouseByPropertyOwnerId = (propertyOwnerId) => request(`/TinyHouses/by-owner/${propertyOwnerId}`);
export const createTinyHouse = (data) => request('/TinyHouses/add', 'POST', data);
export const updateTinyHouse = (id, data) => request(`/TinyHouses/update/${id}`, 'PATCH', data);
export const deleteTinyHouse = (id) => request(`/TinyHouses/${id}`, 'DELETE');
export const getTinyHouseByRange = (offset,limit) => request(`/TinyHouses/paged?offset=${offset}&limit=${limit}`, 'GET');
