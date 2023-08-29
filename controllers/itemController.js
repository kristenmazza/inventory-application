const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');
const { body, validationResult } = require('express-validator');
const inventory = require('../routes/inventory');

// Display home page
exports.index = asyncHandler(async (req, res, next) => {
  const [numCategories, numItems] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
  ]);

  res.render('index', {
    title: 'Inventory Overview',
    category_count: numCategories,
    item_count: numItems,
  });
});

// Display list of all items
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().populate('category').exec();

  res.render('item_list', { title: 'All Items', item_list: allItems });
});

// Display detail page for specific item
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category').exec();

  if (item === null) {
    // No results
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('item_detail', {
    title: 'Item Detail',
    item: item,
  });
});

// Display item create form on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();

  res.render('item_form', {
    title: 'Create Item',
    categories: allCategories,
  });
});

// Display item create form on POST
exports.item_create_post = [
  // Validate and sanitize fields.
  body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category', 'Category must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('number_in_stock', 'Quantity must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      number_in_stock: req.body.number_in_stock,
      uploaded_file: '/images/uploads/' + req.file.filename,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories for form.
      const allCategories = await Category.find().exec();

      res.render('item_form', {
        title: 'Create Item',
        categories: allCategories,
      });
    } else {
      // Data from form is valid. Save item.
      await item.save();
      res.redirect(item.url);
    }
  }),
];

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
