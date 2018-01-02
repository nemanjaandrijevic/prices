//Backbone Model
var Product = Backbone.Model.extend({
  defaults: {
    product: '',
    price: '',
  }
});

//Backbone Collection
var Products = Backbone.Collection.extend({

  getTotalPrice: function() {
    var total = 0;

    this.each(function(model){
      // covert price to number and add it to total
      total += parseInt(model.get('price'));
    });

    return this.formatPrice(total);
  },

  getMaxPrice: function() {
    var max = 0;

    this.each(function(model) {
      // 1. get model price
      var price = model.get('price');
      // 2. check if that price is bigger than last max price (max)
      if (price > max) {
        // update last max price (max)
        max = price;
      }
    });

    return this.formatPrice(max);
  },

  getMinPrice: function() {

    var min = this.at(0).get('price');

    this.each(function(model) {

      var price = model.get('price');

      if (price < min) {
        min = price;
      }
    });

    return this.formatPrice(min);

  },

  getAveragePrice: function() {
    // calculate average price
    var avrg = this.getTotalPrice() / this.length;
    // return formated number - 2 decimal points
    return this.formatPrice(avrg);
  },

  formatPrice: function(num) {
    return parseFloat(Math.round(num * 100) / 100).toFixed(2);
  }

});

// instantiate a Collection
var products = new Products();

//Backbone View for one prodict
var ProductView = Backbone.View.extend({
  model: new Product(),
  tagName: 'li',
  className: 'product-item',
  events: {
    'click .editProduct': 'edit',
    'click .updateProduct': 'update',
    'click .canel': 'canel',
    'click .deleteProduct': 'delete'
  },

  initialize: function() {
    this.template = _.template( $('.products-list-template').html() );
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  edit: function() {
    this.$el.find('.editProduct').hide();
    this.$el.find('.deleteProduct').hide();
    this.$el.find('.updateProduct').show();
    this.$el.find('.canel').show();

    var product = this.$el.find('.product').html();
    var price = this.$el.find('.price').html();

    this.$el.find('.product').html('<input type="text" class="updateProductInput" value="' + product + '">');
    this.$el.find('.price').html('<input type="number" class="updatePriceInput" value="' + price + '">');
  },

  update: function() {
    this.model.set('product', this.$el.find('.updateProductInput').val());
    this.model.set('price', this.$el.find('.updatePriceInput').val());
  },

  canel: function() {
    productView.render();
  },

  delete: function() {
    this.model.destroy();
  },
});

// Backbone View for all products
var ProductsView = Backbone.View.extend({
  model: products,

  el: $('.products-list'),

  initialize: function() {
    var self = this;

    // listen for any change on collection
    this.model.on('add', this.render, this);
    this.model.on('remove', this.render, this);
    this.model.on('reset', this.render, this);
    this.model.on('change', function() {
      setTimeout(function() {
        self.render();
      }, 30);
    }, this);
  },

  render: function() {
    var self = this;

    self.$el.html('');

    _.each(this.model.toArray(), function(product) {

      // create new blog view
      var itemView = new ProductView({
        model: product
      });
      self.$el.append(itemView.render().$el);
    });

    // this.model is actually a collection
    var total = this.model.getTotalPrice();
    var max = this.model.getMaxPrice();
    var min = this.model.getMinPrice();
    var avrg = this.model.getAveragePrice();

    // odstampaj vrednost total u input!!!
    $('.total').html(total);
    $('.max').html(max);
    $('.min').html(min);
    $('.avrg').html(avrg);

    return this;
  }


});

var productView = new ProductsView();

$(document).ready(function() {
  $('.addProduct').on('click', function() {
    var product = new Product({
      product: $('.inputProduct').val(),
      price: $('.inputPrice').val(),
    });

    $('.inputProduct').val('');
    $('.inputPrice').val('');

    products.add(product);
  });
});
