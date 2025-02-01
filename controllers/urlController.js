const Url = require('../models/Url');

exports.createUrl = async (req, res) => {
  const { originalUrl, remarks, expiresAt } = req.body;

  try {
    const url = new Url({
      originalUrl,
      remarks,
      expiresAt,
      user: req.user.id
    });
    await url.save();
    res.json(url);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllUrls = async (req, res) => {
  try {
    // Get query parameters for pagination and search
    const { page = 1, limit = 10, search = '' } = req.query;

    // Create a query object to filter URLs for the logged-in user and search by originalUrl
    const query = {
      user: req.user.id,
      originalUrl: { $regex: search, $options: 'i' } // Case-insensitive search
    };

    // Retrieve paginated results
    const urls = await Url.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // Count total matching documents (for pagination)
    const total = await Url.countDocuments(query);

    res.json({ 
      urls, 
      total, 
      page: Number(page), 
      pages: Math.ceil(total / limit) 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteUrl = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) return res.status(404).json({ error: 'URL not found' });

    if (url.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    await Url.deleteOne({ _id: req.params.id });
    res.json({ message: 'URL deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.trackClick = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    url.clicks.push({
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    await url.save();
    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};