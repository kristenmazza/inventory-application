const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');

// Display home page
exports.index = asyncHandler(async (req, res, next) => {
  const [numCategories, numItems] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
  ]);

  res.render('index', {
    title: 'Inventory Home',
    category_count: numCategories,
    item_count: numItems,
  });
});

// Display list of all items
exports.item_list = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item list');
});

// Display detail page for specific item
exports.item_detail = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item detail');
});

// Display item create form on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item create GET');
});

// Display item create form on POST
exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item create POST');
});

// Display item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item delete GET');
});

// Handle item delete on POST
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item delete POST');
});

// Display item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item update GET');
});

// Display item update form on POST
exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item update POST');
});
