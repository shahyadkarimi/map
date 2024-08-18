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
  deletedAt: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
});

const model = mongoose.models.MapModel || mongoose.model("MapModel", schema);

export default model;
