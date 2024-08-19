import L from 'leaflet';
// import icon from "../../."

const PointIcon = new L.Icon({
    iconUrl: "/assets/icon.png",
    iconRetinaUrl: "/assets/icon.png",
    iconAnchor: null,
    // popupAnchor:,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 60),
    className: ''
});

export { PointIcon };