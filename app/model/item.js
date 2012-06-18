Ext.define('Item', {
  extend: 'Ext.data.Model',
  config: {
    fields: [
      { name: 'amount', type: 'string' }
    ],
    belongsTo: 'Product'
  }
});
