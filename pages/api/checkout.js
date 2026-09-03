import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const baseUrl = process.env.BASE_URL?.trim() || "http://localhost:3000";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res
            .status(405)
            .json({ error: `Method ${req.method} not allowed` });
    }

    try {
        const { planId, planName, price, userId } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],

            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: planName },
                        unit_amount: price * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${baseUrl}/success` ,
            cancel_url: `${baseUrl}/cancel`,
            metadata: { userId, planId },
        });

        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error.message);
        return res.status(500).json({ error: "Payment initialization failed" });
    }
}
