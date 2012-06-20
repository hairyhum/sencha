Ext.define('pie.model.Product', {
  extend: 'Ext.data.Model',
  config: {
    fields: [
      { name: 'title', type: 'string' },
      { name: 'group', type: 'int' }
    ]
  }
});