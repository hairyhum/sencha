Ext.define('pie.model.List', {
  extend: 'Ext.data.Model',
  config: {
    fields: [
      { name: 'title', type: 'string' }
    ],
    hasMany: 'Item'
  }
});
