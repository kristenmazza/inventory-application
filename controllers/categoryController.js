const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Item = require('../models/item');
const { body, validationResult } = require('express-validator');

// Display list of all categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();

  res.render('category_list', {
    title: 'All Categories',
    category_list: allCategories,
  });
});

// Display detail page for specific category
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    // No results
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category_detail', {
    title: 'Category Details',
    category: category,
    item_list: categoryItems,
  });
});

// Display category create form on GET
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render('category_form', {
    title: 'Create Category',
  });
});

// Display category create form on POST
exports.category_create_post = [
  // Validate and sanitize fields.
  body('category_name', 'Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category_description', 'Description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.category_name,
      description: req.body.category_description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render('category_form', {
        title: 'Create Category',
      });
    } else {
      // Data from form is valid. Save category.
      await category.save();
      res.redirect(category.url);
    }
  }),
];
// Display category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name description').exec(),
  ]);

  if (category === null) {
    res.redirect('/inventory/category');
  }

  res.render('category_delete', {
    title: 'Delete Category',
    category: category,
    category_items: categoryItems,
  });
});

// Handle category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name description').exec(),
  ]);

  if (categoryItems.length > 0) {
    res.render('category_delete', {
      title: 'Delete Category',
      category: category,
      category_items: categoryItems,
    });
    return;
  } else {
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect('/inventory/categories');
  }
});

// Display category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: category update GET');
});

// Display category update form on POST
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: category update POST');
});
