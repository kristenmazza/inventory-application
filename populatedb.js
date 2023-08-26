#! /usr/bin/env node

console.log(
  'This script populates some test categories and items. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/inventory_application?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require('./models/category');
const Item = require('./models/item');

const categories = [];
const items = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createItems();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// category[0] will always be the Pens category, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const categoryDetail = { name: name, description: description };
  const category = new Category(categoryDetail);
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}, ${description}`);
}

async function itemCreate(
  index,
  i_name,
  description,
  price,
  number_in_stock,
  category
) {
  const itemdetail = {
    name: i_name,
    description: description,
    price: price,
    number_in_stock: number_in_stock,
    category: category,
  };

  const item = new Item(itemdetail);

  await item.save();
  items[index] = item;
  console.log(
    `Added item: ${i_name} ${description} ${price} ${number_in_stock} ${category}`
  );
}

async function createCategories() {
  console.log('Adding categories');
  await Promise.all([
    categoryCreate(0, 'Writing Utensils', 'Pens, pencils, and more.'),
    categoryCreate(1, 'Paper', 'Various types of paper'),
    categoryCreate(2, 'Mailing & Shipping', 'Envelopes, boxes, etc.'),
    categoryCreate(3, 'Filing', 'Products required for filing'),
  ]);
}

async function createItems() {
  console.log('Adding items');
  await Promise.all([
    itemCreate(
      0,
      'BIC Round Stic Ballpoint Pens, Medium Point, 1.0 mm, Translucent Barrel, Black Ink, Pack of 60 Pens',
      'Combine longevity, consistent performance and smooth writing with BIC Round Stic Xtra Life Ballpoint Pens. Creating clear, vivid lines, they’re the ideal ballpoint pens for writing lists, taking notes, journaling and more. The flexible round barrel fits snugly in your hand and offers a controlled yet comfortable hold, making these the best pens for prolonged writing sessions. Plus, these writing pens provide consistent ink flow, letting you write smoothly and evenly. Looking for reliable pens for school or office supplies? Choose BIC Round Stic Xtra Life Ballpoint Pens for a high-quality, affordable product you can trust — write first time, every time',
      5.99,
      15,
      categories[0]
    ),
    itemCreate(
      1,
      'Paper Mate Ballpoint Pen, Profile Retractable Pen, Medium Point (1.0mm), Blue, 12 Count',
      'Make smooth, crisp lines with Paper Mate Profile Retractable ballpoint pens. These retractable pens now come in a 1.0mm tip, so your writing stands out on the page. Profile pens also include a soft grip for comfortable writing during any writing task.',
      13.79,
      12,
      categories[0]
    ),
    itemCreate(
      2,
      'Astrobrights® Color Multi-Use Printer & Copier Paper, Letter Size (8 1/2" x 11"), Ream Of 500 Sheets, 24 Lb, Cool Assortment',
      'Stand out with vibrant colors and let your creativity shine with Astrobrights Assorted Color Paper. This Neenah paper is 20% thicker than standard paper, so you can achieve bleed-free results for single- and double-sided documents.',
      28.69,
      10,
      categories[1]
    ),
    itemCreate(
      3,
      'Hammermill® Copier Plus Paper, Letter Size (8 1/2" x 11"), 5000 Total Sheets, 92 (U.S.) Brightness, 20 Lb, FSC® Certified, White, 500 Sheets Per Ream, Case Of 10 Reams',
      `Hammermill Copy Plus paper is an economical copy paper designed for everyday use at offices large and small. Offering dependable performance on all office machines, you'll want to have plenty of this dependable paper on hand for everyday, general office use. ColorLok for bolder blacks, brighter colors and faster drying. Backed by the 99.99% Jam-Free Guarantee. Acid-free material prevents yellowing over time to ensure a long-lasting appearance.`,
      53.99,
      23,
      categories[1]
    ),
    itemCreate(
      4,
      'Quality Park® #9 Business Envelopes, Gummed Seal, White, Box Of 500',
      'Business envelopes feature a contemporary style with sturdy, 24 lb, white wove, super-white bright stock and full-size flaps.',
      48.49,
      12,
      categories[2]
    ),
    itemCreate(
      5,
      'Smead® Color File Folders, Legal Size, 1/3 Cut, Assorted Colors, Box Of 100',
      'Handle large office filing tasks with these Smead color file folders. The vivid hue makes it simple to spot your project files without having to flip through labels, while the sturdy construction can withstand frequent review. With 1/3-cut top tabs, these file folders offer ample space for handwriting or printed labels. These Smead color file folders have 3/4-inch scoring for easy expansion.',
      48.99,
      6,
      categories[3]
    ),
  ]);
}
