const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    inclide: [
      Product, {
        model: Tag
      }
    ]
  })
    .then(categories => {
      console.log(categories)
      res.json(categories)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
      }
    ]
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No tag found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
  .then((product) => {
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(product);
  })
  .then((productTagIds) => res.status(200).json(productTagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
        id: req.params.id
    }
})
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No tag found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
