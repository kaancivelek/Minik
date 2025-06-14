import request from './api';

export const getAllTinyHouseImages = () => request('/HouseImages');
export const getTinyHouseImagesByTinyHouseId = (tiny_house_id) => request(`/HouseImages/${tiny_house_id}`, 'GET');
export const addTinyHouseImageByTinyHouseId = (tiny_house_id, body) => request(`/HouseImages/${tiny_house_id}`, 'POST', body);
export const deleteTinyHouseImageById =(imageId) => request(`/HouseImages/${imageId}`, 'DELETE');