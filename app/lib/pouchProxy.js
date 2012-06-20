Ext.define('PouchProxy', {
  extend:'Ext.data.proxy.Client',

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
  pouchCmd:function (cmd, cb) {
    this.pouch(function (err, db) {
      var args = arguments.slice(2).concat([cb || none]);
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
    var records = this.prepare(operation.getRecords()),
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

    this.pouchCmd('bulkDocs',
      cb,
      {docs:records});

  },
  read:function (operation, callback, scope) {
    var records = [],
      params = operation.getParams() || {},
      idProp = this.getModel().getIdProperty(),
      cb = function (err, data) {
        operation.setSuccessful();
        if (!!err) {
          operation.setException(err);
        }
        else {
          operation.setCompleted();
        }
        operation.setResultSet(Ext.create('Ext.data.ResultSet', {
          records:data,
          total:data.length,
          loaded:true
        }));
        operation.setRecords(data);

        if (typeof callback == 'function') {
          callback.call(scope || this, operation);
        }
      };
    //read a single record
    if (params[idProp] !== undefined) {
      this.pouchCmd('get', function (err, doc) {
        cb(err, [doc]);
      }, params[idProp]);
    } else {
      this.pouchCmd('allDocs', function (err, docs) {
        var self = this;
        if (!!err) {
          cb(err, null);
        }

        async.map(docs.rows,
          function (doc, cb) {
            self.pouchCmd('get', cb, doc.id);
          },
          function (err, result) {
            cb(err, result);
          });
      });
    }
  },
  update:function (operation, callback, scope) {
    var records = this.prepare(operation.getRecords()),
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
  destroy:function (operation, callback, scope) {
    var records = this.prepare(operation.getRecords()),
      length = records.length,
      self = this,
      i;

    async.forEach(records,
      function (doc, iter) {
        self.pouchCmd('remove',
          function (err, info) {
            iter(err);
          },
          doc);
      },
      function (err) {
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

      });
  },
  prepare: function(records){
    return records.map(function(rec){
      return rec.getData();
    });
  }

});



