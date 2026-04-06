const Transaction = require('../models/Transaction');

const getSummary = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    let totalIncome = 0, totalExpense = 0;
    result.forEach(r => {
      if (r._id === 'income') totalIncome = r.total;
      if (r._id === 'expense') totalExpense = r.total;
    });

    res.status(200).json({
      success: true,
      data: { totalIncome, totalExpense, netBalance: totalIncome - totalExpense }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategoryWise = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecentTransactions = async (req, res) => {
  try {
    const data = await Transaction.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name email');
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSummary, getCategoryWise, getMonthlyTrends, getRecentTransactions };