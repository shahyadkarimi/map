const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  frequency: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "active",
  },
  date: {
    type: Date,
    default: () => Date.now(),
  },
  deletedAt: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
});

const model = mongoose.models.MapModel || mongoose.model("MapModel", schema);

export default model;
