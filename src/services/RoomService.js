import {Axios} from "./Axios";

const baseUrl = `/rooms/`
function addRoom(payload) {
    return Axios.post(baseUrl, payload);
}

function updateRoom(id, payload) {
  return Axios.put(`${baseUrl+id}`, payload);
}

function getAllRoom(page, size){
    return Axios.get(`${baseUrl}?page=${page}&size=${size},sort=id,desc`);
}
function rentRoom(id){
    return Axios.post(`${baseUrl}rent/`+id);
}

export const RoomService = {
  addRoom,
  updateRoom,
  getAllRoom,
  rentRoom
};