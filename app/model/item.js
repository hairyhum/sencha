Ext.define('pie.model.Item',{
  extend: 'Ext.data.Model',
  requires: [
    'pie.data.proxy.TestProxy'
  ],
  config:{
    fields: [
      { name: 'amount', type: 'string' }
    ],
    proxy: {
      type: 'localstorage'
    }
    //belongsTo: 'Product'
  }
});