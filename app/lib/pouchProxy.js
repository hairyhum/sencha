Ext.define('Ext.data.proxy.Pouch', {
  extend:'Ext.data.proxy.Client',
  alternateClassName:'Ext.data.PouchProxy',

  requires:'Ext.Date',

  config:{
    /**
     * @cfg {String} db
     */
    db:undefined,
    // WebStorage proxies dont use readers and writers
    reader:null,
    writer:null
  },
  create:function (operation, callback, scope) {

  },
  read:function (operation, callback, scope) {
  },
  update:function (operation, callback, scope) {
  },
  destroy:function (operation, callback, scope) {
  }
});



