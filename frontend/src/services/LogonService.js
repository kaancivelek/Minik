import request from "./api";

export const createNewUser = (data) => request('/Register/register', 'POST', data);
export const updateUser = (email, data) => request(`/Logon/${email}`, 'PUT', data);
export const getUserByEmail = (email) => request(`/User/users/${email}`);
export const deleteUser = (email) => request(`/Logon/${email}`, 'DELETE');
export const validateUser = (email, passwordHash) => request(`/Login/login`, 'POST', { email, passwordHash });
export const validateEmail = (email) => request(`/Logon/validateEmail`, 'POST', { email });
export const validatePassword = (password) => {request(`/Logon/validatePassword`, 'POST', { password })};
