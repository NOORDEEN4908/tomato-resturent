import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    timesOrdered: { type: Number, default: 0 },
    season: { type: String, default: "all" },
    nutrients: { type:mongoose.Schema.Types.Mixed, default: {} },
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
