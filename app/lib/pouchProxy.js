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
  pouch:function (cb) {
    Pouch(this.getDb(), cb);
  },
  pouchCmd:function (cmd, cb, opts) {
    this.pouch(function (err, db) {
      var args = (opts || []).concat([cb || none]);
      db[cmd].apply(db, args);
    });
  },
  /**
   * @private
   * Sets up the Proxy by claiming the key in the database that corresponds to the unique id of this Proxy. Called
   * automatically by the constructor, this should not need to be called again unless {@link #clear} has been called.
   */
  initialize:function () {
    this.callParent(arguments);
    should.match(this.getDb(), /^(idb:\/\/|http:\/\/)/);
    this.pouch(none);
  },
  clear:function (cb) {
    this.pouchCmd('destroy', cb);
  },
  create:function (operation, callback, scope) {
    var records = operation.getRecords(),
      cb = function (err, info) {
      operation.setCompleted();
      if (!!err) {
        operation.setException(err);
      }
      else {
        operation.setSuccessful();
      }

      if (typeof callback == 'function') {
        callback.call(scope || this, operation);
      }
    };

    operation.setStarted();

    this.pouchCmd('bulkDocs', cb, {docs:records});

  },
  read:function (operation, callback, scope) {
    var records    = [],
      ids        = this.getIds(),
      model      = this.getModel(),
      idProperty = model.getIdProperty(),
      params     = operation.getParams() || {},
      length     = ids.length,
      i, record;

    //read a single record
    if (params[idProperty] !== undefined) {

      record = this.getRecord(params[idProperty]);
      if (record) {
        records.push(record);
        operation.setSuccessful();
      }
    } else {
      for (i = 0; i < length; i++) {
        records.push(this.getRecord(ids[i]));
      }
      operation.setSuccessful();
    }

    operation.setCompleted();

    operation.setResultSet(Ext.create('Ext.data.ResultSet', {
      records: records,
      total  : records.length,
      loaded : true
    }));
    operation.setRecords(records);

    if (typeof callback == 'function') {
      callback.call(scope || this, operation);
    }

  },
  update:function (operation, callback, scope) {
    should.match(this.getDb(), /^(idb:\/\/|http:\/\/)/);
  },
  destroy:function (operation, callback, scope) {
    should.match(this.getDb(), /^(idb:\/\/|http:\/\/)/);
  }
});



