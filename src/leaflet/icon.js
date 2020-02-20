// Github: https://github.com/pointhi/leaflet-color-markers
import L from 'leaflet';

const iconSize = [25, 41];
const iconAnchor = [12, 41];
const popupAnchor = [1, -34];
const shadowSize = [41, 41];

const Green = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize,
  iconAnchor,
  popupAnchor,
  shadowSize,
});

const Grey = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize,
  iconAnchor,
  popupAnchor,
  shadowSize,
});

const Gold = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize,
  iconAnchor,
  popupAnchor,
  shadowSize,
});

const Red = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize,
  iconAnchor,
  popupAnchor,
  shadowSize,
});


export default {
  Green,
  Grey,
  Gold,
  Red,
};
