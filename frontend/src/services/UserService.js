import request from './api';

export const getUserById = (userId) => request(`/User/user/${userId}`, 'GET');
export const updateUser = (email, data) => request(`/User/update/${email}`, 'PATCH', data);