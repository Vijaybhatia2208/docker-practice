import mongoose from 'mongoose';
import express from 'express';

const app = express();
const port = 3000;

// Set up mongoose connection
mongoose.connect("mongodb://localhost:27017/test", {});
// console.log(process.env.MONGO_URI)

const EntrySchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
});

console.log("Hello world")

const Entry = mongoose.model('Entry', EntrySchema);

app.get('/', async (req, res) => {
  try {
    const entry = new Entry({ text: 'This is an entry by Vijay' });
    await entry.save();
    res.send('Entry added!');
  } catch (err) {
    // console.log(err)
    res.status(500).send('Error occurred');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

