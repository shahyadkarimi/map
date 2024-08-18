const mongoose = require("mongoose");

const schema = mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: () => Date.now(),
  },
});

const model = mongoose.models.MapInfo || mongoose.model("MapInfo", schema);

export default model;