import express from "express";
import * as dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";

const app = express();

//middleware
app.use(express.json());
app.use(morgan("tiny"));

const port = 5000;
dotenv.config();

const apiUrl = process.env.API_URL;
const uris = process.env.URI_STRING;

const productsSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

const ProductModel = mongoose.model("Product", productsSchema);

app.get(`${apiUrl}/products`, async (req, res) => {
  const allProducts = await ProductModel.find({});
  if (!allProducts) {
    res.status(500).json({ success: false });
  } else {
    res.send(allProducts);
  }
});

app.post(`${apiUrl}/products`, (req, res) => {
  const product = new ProductModel({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save()
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

mongoose.set("strictQuery", false);
mongoose
  .connect(uris, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshopdbdummy",
  })
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((err) => {
    console.log("Error connecting to mongo", err);
  });

app.listen(port, () => console.log("App listening on port: " + port));
