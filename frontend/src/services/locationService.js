import request from './api.js'

export const getLocationByTinyHouseId = (tinyHouseId) => request(`/Locations/tinyhouse/${tinyHouseId}`, 'GET');
export const addLocation = (body) => request('/Locations', 'POST', body);
export const updateLocationByLocationId = (body) => request('/Locations', 'PUT', body);
export const deleteLocationByLocationId = (locationId) => request(`/Locations/${locationId}`, 'DELETE');
export const getLocationByUserId = (userId) => request(`/Locations/propertyowner/${userId}`, 'GET');