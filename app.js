Ext.application({
  name:'pie',

  requires:[
    'Ext.MessageBox',
    'Ext.ModelMgr',
    'pie.model.Item'
  ],

  views:['Main'],

  icon:{
    '57':'resources/icons/Icon.png',
    '72':'resources/icons/Icon~ipad.png',
    '114':'resources/icons/Icon@2x.png',
    '144':'resources/icons/Icon~ipad@2x.png'
  },

  isIconPrecomposed:true,

  startupImage:{
    '320x460':'resources/startup/320x460.jpg',
    '640x920':'resources/startup/640x920.png',
    '768x1004':'resources/startup/768x1004.png',
    '748x1024':'resources/startup/748x1024.png',
    '1536x2008':'resources/startup/1536x2008.png',
    '1496x2048':'resources/startup/1496x2048.png'
  },

  launch:function () {
    // Destroy the #appLoadingIndicator element
    Ext.fly('appLoadingIndicator').destroy();

    // Initialize the main view
    Ext.Viewport.add(Ext.create('pie.view.Main'));
    var Item = Ext.ModelMgr.getModel('pie.model.Item');
    console.log(Item.getIdProperty());
    var ed = Item.create({
      amount:'123'
    });
    ed.save({
      success:function (a) {
        console.log(a);
        a.set('amount','12345');
        console.log(a);
        a.save({
          success:function (a) {
            console.log(a);
          }});
      },
      failure:function (err) {
        console.error(err);
      }
    });


  },

  onUpdated:function () {
    Ext.Msg.confirm(
      "Application Update",
      "This application has just successfully been updated to the latest version. Reload now?",
      function (buttonId) {
        if (buttonId === 'yes') {
          window.location.reload();
        }
      }
    );
  }
});
