Ext.define('pie.data.proxy.TestProxy', {
  extend:'Ext.data.proxy.Client',
  alias: 'proxy.test',
  config:{
    /**
     * @cfg {String} db
     */
    db:undefined,
    // WebStorage proxies dont use readers and writers
    reader:null,
    writer:null
  },
  read: function(operation, callback, scope){
    console.log('read');
    console.log(operation);
  },
  create: function(operation, callback, scope){
    console.log('create');
    console.log(operation.getRecords()[0]);
    callback.call(scope || this, operation);
  },
  update: function(operation, callback, scope){
    console.log('update');
    console.log(operation.getRecords());
  }
});
