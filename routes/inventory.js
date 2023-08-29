const express = require('express');
const router = express.Router();
const path = require('path');
const category_controller = require('../controllers/categoryController');
const item_controller = require('../controllers/itemController');
const multer = require('multer');

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Initialize upload
upload = multer({
  storage: storage,
  limits: 1000000,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;

  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb('Error: Image only');
  }
}

// GET inventory home page
router.get('/', item_controller.index);

// GET request for creating Item
router.get('/item/create', item_controller.item_create_get);

// POST request for creating Item
router.post(
  '/item/create',
  upload.single('uploaded_file'),
  item_controller.item_create_post
);

// GET request to delete Item
router.get('/item/:id/delete', item_controller.item_delete_get);

// POST request to delete Item
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET request to update Item
router.get('/item/:id/update', item_controller.item_update_get);

// POST request to update Item
router.post('/item/:id/update', item_controller.item_update_post);

// GET request for one Item
router.get('/item/:id', item_controller.item_detail);

// GET request for list of all Items
router.get('/items', item_controller.item_list);

// GET request for creating Category
router.get('/category/create', category_controller.category_create_get);

// POST request for creating Category
router.post('/category/create', category_controller.category_create_post);

// GET request to delete Category
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete Category
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update Category
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update Category
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one Category
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all Category
router.get('/categories', category_controller.category_list);

module.exports = router;
