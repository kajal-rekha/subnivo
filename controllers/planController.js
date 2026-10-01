import Plan from "@/models/Plan";
import Subscription from "@/models/Subscription";

// ========= create plan ======== //
export const createPlan = async (req, res) => {
  try {
    const { name, price, duration, durationUnit, features } = req.body;

    const plan = await Plan.create({
      name,
      price,
      duration,
      durationUnit,
      features,
    });

    res.status(200).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//======= Get All plans ========//
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({}).sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//======= Get A plan ========//
export const getAPlan = async (req, res) => {
  try {
    const { id } = req.query;
    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({ error: "Plan not found!" });
    }

    res.status(200).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ========= update plan ======== //
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, price, duration, durationUnit, features } = req.body;

    const updateData = { name, price, duration, durationUnit, features };

    const updatedPlan = await Plan.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedPlan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.status(200).json({ updatedPlan });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//========= Delete plan ========//
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.query;

    const hasSubscriptions = await Subscription.exists({ plan_id: id });
    if (hasSubscriptions) {
      return res.status(409).json({
        error: "Cannot delete a plan that has subscriptions.",
      });
    }

    const deletedPlan = await Plan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.status(200).json({
      message: "Plan deleted successfully",
      deletedPlan,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
