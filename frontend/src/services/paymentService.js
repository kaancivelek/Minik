import request from './api'
export const getPaymentByReservationId=(reservationId)=> request(`/Payments/reservation/${reservationId}`, 'GET');
export const getPayments=()=>request(`/Payments`,'GET');
export const updatePaymentById=(id,data)=>request(`/Payments${id}`,PATCH,data);
export const deletePaymentById=(id)=>request(`/Payments${id}`,DELETE);
export const postPayment=(data)=>request(`/Payments`,POST,data);
