import request from './api'
export const getReservationByUserId = (userId) => request(`/Reservations/user/${userId}`, 'GET')
export const getReservationByTinyHouseId = (tinyHouseId) => request(`/Reservations/tinyhouse/${tinyHouseId}`, 'GET');
export const postReservation = (reservationData) => 
    request('/Reservations', 'POST', reservationData);

export const updateReservationStatus = (reservationId, newStatus) =>
    request(`/Reservations/updatestatus/${reservationId}`, 'PATCH', newStatus);
