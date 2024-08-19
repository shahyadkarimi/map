const mongoose = require("mongoose");

const schema = mongoose.Schema({
  lat: {
    type: Number,
    required: true,
    default: 35.694523130867424,
  },
  lng: {
    type: Number,
    required: true,
    default: 51.30922197948697,
  },
  zoom: {
    type: Number,
    required: true,
    default: 13,
  },
});

const model =
  mongoose.models.SettingsModel || mongoose.model("SettingsModel", schema);

export default model;
