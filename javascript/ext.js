Ext.require(['*']); //Khai báo các thành phần cần load cho module extls, chọn '*' để load tất cả
Ext.onReady(function() {
    var updatearray=[];
            // Tạo data cho combobox
            var typeview = Ext.create('Ext.data.Store', {
                fields: ['send', 'name'],
                data : [
                    {"send":"1p", "name":"1 phút"},
                    {"send":"5p", "name":"5 phút"},
                    {"send":"15p", "name":"15 phút"},
                    {"send":"h", "name":"Giờ"},
                    {"send":"d", "name":"Ngày"},
                    {"send":"m", "name":"Tháng"},
                    {"send":"raw", "name":"Raw"}
                ]
            }),
                subs = Ext.create('Ext.data.Store', {
                    fields: ['send', 'name'],
                    data : [
                        {"send":"2", "name":"Metan"},
                        {"send":"3", "name":"NMHC"},
                        {"send":"4", "name":"NO"},
                        {"send":"5", "name":"NO2"},
                        {"send":"6", "name":"NOx"},
                        {"send":"7", "name":"Ozone"},
                        {"send":"8", "name":"CO"},
                        {"send":"9", "name":"SO2"},
                        {"send":"10", "name":"PM2.5"}
                    ]
                }),
                unit = Ext.create('Ext.data.Store', {
                    fields: ['send', 'name'],
                    data : [
                        {"send":"md", "name":"Mật độ"},
                        {"send":"si", "name":"SI"}
                    ]
                });
            // Tạo khung data grid
            itemsPerPage=20;
            var store = Ext.create('Ext.data.JsonPStore', {
                storeId: 'store',
                fields: [
                    {name: 'date', type: 'date', dateFormat: 'Y-m-d'},
                    {name: 'time', type: 'date', dateFormat: 'H:i:s'},
                    {name: 'Metan', type: 'float'},
                    {name: 'NMHC', type: 'float'},
                    {name: 'NO', type: 'float'},
                    {name: 'NO2', type: 'float'},
                    {name: 'NOx', type: 'float'},
                    {name: 'Ozone', type: 'float'},
                    {name: 'SO2', type: 'float'},
                    {name: 'CO', type: 'float'},
                    {name: 'PM25', type: 'float'}
                ],
                proxy: {
                type: 'memory',
                enablePaging: true,
                data: [],
                reader: {
                    type: 'array'
                }
            },
                //Data blank, khi truy cập vào trang web sẽ thấy bảng trống
                pageSize: itemsPerPage
            });
            store.load({
    params:{
        start:0,
        limit: itemsPerPage
    }
});
            // Tạo viewport
            Ext.create('Ext.container.Viewport', {
                layout: 'border',
                //Tạo item, mỗi item tương ứng 1 vùng trên web, đối với viewport sẽ chiếm toàn nền web
                items: [{
                    region: 'north', //Phía trên cùng
                    html: '<h1 class="x-panel-header">SEP</h1>',
                    border: false,
                    margins: '0 0 5 0'
                }, {
                    region: 'west', //Phía bên trái
                    collapsible: true,
                    collapsed: true,
                    split: true,
                    title: 'Customize',
                    width: '18%',
                    minWidth: 220,
                    xtype: 'form',
                    bodyPadding: 5,
                    id: 'form',
                    // The form will submit an AJAX request to this URL when submitted
                    url: 'php/process.php',
                    // Fields will be arranged vertically, stretched to full width
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    // The fields
                    items: [{
                        xtype: 'datefield',
                        fieldLabel: 'Date',
                        name: 'date',
                        format: 'Y/m/d',
                        value: '2013/09/10',
                        allowBlank: false
                    },{
                        xtype: 'timefield',
                        fieldLabel: 'Time',
                        name: 'time',
                        format: 'H:i',
                        increment: 60,
                        allowBlank: true
                    },{
                        xtype: 'combo',
                        fieldLabel: 'Data type view',
                        name: 'view',
                        store: typeview,
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'send',
                        value: '5p',
                        allowBlank: false

                    },{
                        xtype: 'combo',
                        store: subs,
                        id: 'subs',
                        queryMode: 'local',
                        fieldLabel: 'Substance',
                        name: 'subs',
                        displayField: 'name',
                        value: '2',
                        valueField: 'send'
                    },{
                        xtype: 'combo',
                        fieldLabel: 'Unit',
                        name: 'unit',
                        store: unit,
                        queryMode: 'local',
                        displayField: 'name',
                        value: 'md',
                        valueField: 'send'
                    }],

                    // Reset and Submit buttons
    buttons: [{
        text: 'Reset',
        handler: function() {
            this.up('form').getForm().reset();
        }
    }, {
        text: 'Submit',
        formBind: true, //only enabled once the form is valid
        disabled: true,
        handler: function() {
            var form = this.up('form').getForm();
            if (form.isValid()) {
                form.submit({
                    submitEmptyText: true,
                    waitMsg: 'Đang chuyển yêu cầu...',
                    success: function(form, action) {
                        store.proxy.data=action.result.root;
                        var sub=form.findField('subs').getValue();
                        var radioid='radio'+(sub-1);
                        Ext.getCmp(radioid).setValue(true);
                        //showdata(form.findField('subs').getValue());
                        Ext.getCmp('paging').doRefresh();
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert('Failed', 'Gửi thông tin thất bại');
                    }
                });
            }
        }
    }]
        // could use a TreePanel or AccordionLayout for navigational items
                },{
                    region: 'east',
                    title: 'Bảng số liệu',
                    titleAlign: 'center',
                    collapsible: true,
                    split: true,
                    width: '50%',
                    minWidth: 530,
                    xtype: 'grid',
                    store: store,
                    stateful: true,
                    id: 'mygrid',
                    stateId: 'stateGrid',
                    columns: [
                        {
                            text : 'Ngày',
                            minWidth : 90,
                            sortable : true,
                 
                            renderer : Ext.util.Format.dateRenderer('d/m/Y'),
                            dataIndex: 'date'
                        },{
                            text : 'Thời gian',
                            minWidth : 90,
                            sortable : true,
                            renderer : Ext.util.Format.dateRenderer('H:i:s'),
                            dataIndex: 'time'
                        },{
                            text : 'Metan',
                            minWidth :60,
                            width : '7%',
                            sortable : true,
                            
                            dataIndex: 'Metan',
                            editor: {
                                xtype: 'numberfield',
                                decimalPrecision: 4,
                                allowBlank: false
                            }
                        },{
                            text : 'NMHC',
                            minWidth :60,
                            width : '7%',
                            sortable : true,
                            dataIndex: 'NMHC',
                            editor: {
                                xtype: 'numberfield',
                                decimalPrecision: 4,
                                allowBlank: false
                            }
                        },{
                            text : 'NO',
                            minWidth :60,
                            width : '7%',
                            sortable : true,
                            dataIndex: 'NO',
                            editor: {
                                xtype: 'numberfield',
                                decimalPrecision: 4,
                                allowBlank: false
                            }
                        },{
                            text : 'NO2',
                            minWidth :60,
                            width : '7%',
                            sortable : true,
                            dataIndex: 'NO2',
                            editor: {
                                xtype: 'numberfield',
                                decimalPrecision: 4,
                                allowBlank: false
                            }
                        },{
                            text : 'NOx',
                            minWidth :60,
                            width : '7%',
                            sortable : true,
                            dataIndex: 'NOx',
                            editor: {
                                xtype: 'numberfield',
                                decimalPrecision: 4,
                                allowBlank: false
                            }
                        },{
                            text : 'Ozone',
                            minWidth :60,
                            width : '7%',
                            sortable : true,
                            dataIndex: 'Ozone',
                            editor: {
                                xtype: 'numberfield',
                                decimalPrecision: 4,
                                allowBlank: false
                            }
                        },{
                            text : 'CO',
                            width : '7%',
                            minWidth :60,
                            sortable : true,
                            dataIndex: 'CO',
                            editor: {
                                xtype: 'numberfield',
                                decimalPrecision: 4,
                                allowBlank: false
                            }
                        },{
                            text : 'SO2',
                            minWidth :60,
                            width : '7%',
                            sortable : true,
                            dataIndex: 'SO2',
                            editor: {
                                xtype: 'numberfield',
                                decimalPrecision: 4,
                                allowBlank: false
                            }
                        },
                        {
                            text : 'PM25',
                            minWidth :60,
                            width : '7%',
                            sortable : true,
                            dataIndex: 'PM25',
                            editor: {
                                xtype: 'numberfield',
                                decimalPrecision: 4,
                                allowBlank: false
                            }
                        }],
                    tbar: {
                    },
                    bbar: {
                                              
                        padding: '0 0 0 0',
                        
                        xtype: 'pagingtoolbar',
                        id: 'paging',
                        beforePageText: 'Trang',
                        afterPageText: 'trên {0}',
                        store: store,
                        width: 500,
                        displayInfo: true,
                    items:[{
                        xtype: 'button',
                        text: 'Submit',
                        scale: 'small',
                        handler: function(){
                            if (updatearray.length==0){
                                Ext.Msg.alert('Failed', 'Số liệu không thay đổi');
                            }
                            else {
                                var upar=[[]];
                                var check=false;
                                var form=Ext.getCmp('form').getForm();
                                for (var i=0;i<=(updatearray.length-1);i++){
                                    upar[i]=store.proxy.data[updatearray[i]];
                                }
                                $.ajax({url:"php/update.php", // DÙng AJAX gửi biến qua PHP để update
                        type:"POST",
                        cache:"false",
                        data:
                        {
                            update:upar,
                            table: form.findField('view').getValue()
                        },
                        dataType:"json",
                        success:function(result) {
                            if (result.success==true) {
                            Ext.Msg.alert('Success', 'Cập nhật số liệu thành công');
                            updatearray=[];
                            check=true;
                            }
                            else Ext.Msg.alert('Failed', 'Cập nhật thất bại');
                        }});
                        if (check==false) {Ext.Msg.alert('Failed', 'Cập nhật thất bại');}
                            }
                        }
                }]
                             },
                        selType: 'rowmodel',
                        plugins: [
        Ext.create('Ext.grid.plugin.RowEditing', {
            autoCancel: false,
            clicksToEdit: 2,
            listeners: {
                edit: { // Edit dự liệu trong grid
                    fn: function(editor,e){
                        //var date=store.data.items[e.rowIdx].data.date;
                        if (checkchange(e.newValues,e.originalValues)){
                            //Lưu lại dòng có sửa data vào updatearray
                            var rowid=e.rowIdx+(store.currentPage-1)*itemsPerPage;
                            if (updatearray.indexOf(rowid)<0) updatearray.push(rowid);
                            //Chuyển data từ record vào data gốc
                            //Do phương thức lưu data khá đặc biệt nên chỉ có thể viết từng dòng
                            var pro=store.proxy.data[rowid];
                            pro[2]=e.newValues.Metan;
                            pro[3]=e.newValues.NMHC;
                            pro[4]=e.newValues.NO;
                            pro[5]=e.newValues.NO2;
                            pro[6]=e.newValues.NOx;
                            pro[7]=e.newValues.Ozone;
                            pro[8]=e.newValues.CO;
                            pro[9]=e.newValues.SO2;
                            pro[10]=e.newValues.PM25;
                            
                        }
                        
                        //alert(e.newValues);
                        //alert(store.getPageFromRecordIndex(19));
                        //e.record.commit();
                        
                }
                }
            }
            
        })
    ],
                        viewConfig: {
                        stripeRows: true
                        }
                        },{
                        region: 'center',
                        minWidth: 300,
                        xtype: 'tabpanel', // TabPanel itself has no title
                        activeTab: 0, // First tab active by default
                        
                        items: [{
                        title: 'Quan trắc không khí',
                        layout: 'border',
                        items:[{
                            region: 'center',
                            id: 'chart'
                        },{
                            region: 'south',
                            height: 30,
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'center'
                            },
                            xtype      : 'fieldcontainer',
            defaultType: 'radiofield',
                            
            defaults: {
                flex: 0,
                listeners:{
                                change:{
                                    fn: function(){
                                    if (this.value) {    
                                        showdata(this.inputValue);
                                    }
                                        
                                }
                                }
                            }
                        
            },

            
            items: [
                {
                    name      : 'size',
                    inputValue: '2',
                    id        : 'radio1'
                }, {
                    name      : 'size',
                    inputValue: '3',
                    id        : 'radio2'
                }, {
                    name      : 'size',
                    inputValue: '4',
                    id        : 'radio3'
                },{
                    name      : 'size',
                    inputValue: '5',
                    id        : 'radio4'
                }, {
                    name      : 'size',
                    inputValue: '6',
                    id        : 'radio5'
                }, {
                    name      : 'size',
                    inputValue: '7',
                    id        : 'radio6'
                },{
                    name      : 'size',
                    inputValue: '8',
                    id        : 'radio7'
                }, {
                    name      : 'size',
                    inputValue: '9',
                    id        : 'radio8'
                }, {
                    name      : 'size',
                    inputValue: '10',
                    id        : 'radio9'
                }
            ]
                        }]
                        

                        },{
                            title: 'Dữ liệu khí tượng'
                        }]
                }],

            });
        });
function checkchange(a,b){
    if                        (a.Metan==b.Metan&&
                            a.NMHC==b.NMHC&&
                            a.NO==b.NO&&
                            a.NO2==b.NO2&&
                            a.NOx==b.NOx&&
                            a.Ozone==b.Ozone&&
                            a.CO==b.CO&&
                            a.SO2==b.SO2&&
                            a.PM25==b.PM25) {return false;}
    else return true;
}
