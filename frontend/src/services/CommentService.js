import request from './api.js'

export const getAllComments = ()=>request('/Reviews');
export const getCommentsByTinyHouseId = (tinyhouseId) => request(`/Reviews/tinyhouse/${tinyhouseId}`, 'GET');
export const postComment = (commentData) => request('/Reviews', 'POST', commentData);