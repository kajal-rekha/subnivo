import mongoose from "mongoose";
import "@/models/User";
import "@/models/Plan";
import "@/models/Transaction";

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        plan_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
            required: true,
        },
        transaction_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
        },
        status: {
            type: String,
            enum: ["active", "expired", "canceled", "pending"],
            default: "pending",
            required: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
        autoRenew: {
            type: Boolean,
            default: false,
        },
        stripeSessionId: {
            type: String,
            unique: true,
            sparse: true,
        },
        amount: {
            type: Number,
        },
        currency: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Subscription ||
    mongoose.model("Subscription", SubscriptionSchema);
