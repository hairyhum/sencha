Ext.define('List', {
  extend: 'Ext.data.Model',
  config: {
    fields: [
      { name: 'title', type: 'string' }
    ],
    hasMany: 'Item'
  }
});
