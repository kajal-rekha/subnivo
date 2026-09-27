import Transaction from "@/models/Transaction";

// ===== Create Transaction ===== //
export const createTransaction = async (req, res) => {
    try {
        const { user_id, subscription_id, tran_id, amount, status } = req.body;

        if (!user_id || !subscription_id || !tran_id || !amount) {
            return res
                .status(400)
                .json({ message: "Missing required fields." });
        }

        const newTransaction = new Transaction({
            user_id,
            subscription_id,
            tran_id,
            amount,
            status,
        });

        const savedTransaction = await newTransaction.save();
        return res.status(201).json(savedTransaction);
    } catch (error) {
        console.error("Error creating transaction:", error);
        return res
            .status(500)
            .json({ message: "Failed to create transaction." });
    }
};

// ===== Get All Transactions ===== //
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate("user_id", "name email")
            .populate("subscription_id", "status startDate endDate")
            .sort({ createdAt: -1 });

        return res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res
            .status(500)
            .json({ message: "Failed to fetch transactions." });
    }
};

// ===== Get Logged In User's Transactions ===== //
export const getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.user._id })
            .populate("subscription_id", "status startDate endDate")
            .sort({ createdAt: -1 });

        return res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching user transactions:", error);
        return res
            .status(500)
            .json({ message: "Failed to fetch transactions." });
    }
};

// ===== Get A Transaction  ===== //
export const getATransaction = async (req, res) => {
    try {
        const { id } = req.query;

        const transaction = await Transaction.findById(id)
            .populate("user_id", "name email")
            .populate("subscription_id", "status startDate endDate");

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        return res.status(200).json(transaction);
    } catch (error) {
        console.error("Error fetching transaction:", error);
        return res
            .status(500)
            .json({ message: "Failed to fetch transaction." });
    }
};

// ===== Update Transaction ===== //
export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.query;
        const { status } = req.body;

        if (!["pending", "completed", "failed", "refunded"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const transaction = await Transaction.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        return res.status(200).json(transaction);
    } catch (error) {
        console.error("Error updating transaction:", error);
        return res
            .status(500)
            .json({ message: "Failed to update transaction." });
    }
};

// ===== Delete Transaction  ===== //
export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.query;

        const transaction = await Transaction.findByIdAndDelete(id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        return res
            .status(200)
            .json({ message: "Transaction deleted successfully", transaction });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
