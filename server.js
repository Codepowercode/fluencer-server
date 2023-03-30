import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const port = process.env.PORT || 3000;
const app = express();

try {
  await mongoose.connect('mongodb://localhost/fluencer-db');
  console.log('Connected to MongoDB');
} catch(error) {
  console.error('Error connecting to MongoDB:', error);
}

const shopSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  instagramUsername: { type: String },
  industry: { type: String },
  makeDiscount: { type: Boolean, default: false },
  captureInstagram: { type: Boolean, default: false },
  captureTikTok: { type: Boolean, default: false },
  captureTwitter: { type: Boolean, default: false },
  captureYoutube: { type: Boolean, default: false },
});

const Shops = mongoose.model('Shop', shopSchema);

app.use(cors({
  origin: '*',
}));
app.use(express.json());

app.post('/api/shops', async (req, res) => {
  const { shopName, industry, instagramUsername } = req.body;

  const shop = await Shops.create({
    name: shopName,
    industry,
    instagramUsername,
  });

  res.json(shop);
})

app.get('/api/shops/:shopName', async (req, res) => {
  console.log(req.params.shopName);
  const shop = await Shops.findOne({
    name: req.params.shopName,
  });

  if (!shop) {
    return res.status(404).json({
      error: "Shop not found",
    })
  }

  res.json(shop);
})

app.put('/api/shops/:shopName', async (req, res) => {
  await Shops.updateOne({
    name: req.params.shopName,
  }, {
    makeDiscount: Boolean(req.body.makeDiscount),
    captureInstagram: Boolean(req.body.captureInstagram),
    captureTikTok: Boolean(req.body.captureTikTok),
    captureTwitter: Boolean(req.body.captureTwitter),
    captureYoutube: Boolean(req.body.captureYoutube),
  })

  res.json({
    success: true,
  });
})

// Start the Express application
app.listen(port, () => {
  console.log('Server started on port 3000');
});