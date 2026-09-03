import { connectDB } from "@/lib/db";
import Plan from "@/models/Plan";
import Subscription from "@/models/Subscription";
import Stripe from "stripe";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  await connectDB();

  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error(" Webhook signature failed:", err.message);
    return res.status(400).send("Webhook signature mismatch");
  }

  console.log(" EVENT RECEIVED:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    console.log(" METADATA:", session.metadata);

    if (!userId || !planId) {
      console.log(" Missing metadata");
      return res.status(200).send("Missing metadata");
    }

    const plan = await Plan.findById(planId);

    if (!plan) {
      console.log(" Plan not found");
      return res.status(200).send("Plan not found");
    }

    const existingSubscription = await Subscription.findOne({
      stripeSessionId: session.id,
    });

    if (existingSubscription) {
      return res.status(200).send("Subscription already exists");
    }

    const startDate = new Date();
    const endDate = new Date(startDate);

    if (plan.durationUnit === "day")
      endDate.setDate(endDate.getDate() + plan.duration);

    if (plan.durationUnit === "month")
      endDate.setMonth(endDate.getMonth() + plan.duration);

    if (plan.durationUnit === "year")
      endDate.setFullYear(endDate.getFullYear() + plan.duration);

    try {
      await Subscription.create({
        user_id: userId,
        plan_id: planId,
        status: "active",
        startDate,
        endDate,
        stripeSessionId: session.id,
        amount: session.amount_total / 100,
        currency: session.currency,
      });
    } catch (error) {
      console.error("Subscription creation failed:", error);
      return res.status(500).send("Subscription creation failed");
    }

    console.log(" Subscription created:", userId);
  }

  res.status(200).send("Webhook received");
}

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
