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
            var itemsPerPage=20;
            store = Ext.create('Ext.data.ArrayStore', {
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
                        showdata(action.result.root, action.result.subs);
                        store.proxy.data=action.result.root;
                        Ext.getCmp('paging').doRefresh();
                        $('#form-innerCt').append(form.findField('unit').getValue());
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
                    buttons: {
                        layout:{
                            buttonAlign: 'right',
                        },                        
                        padding: '0 0 0 0',
                        items:[{
                        xtype: 'pagingtoolbar',
                        id: 'paging',
                        beforePageText: 'Trang',
                        afterPageText: 'trên {0}',
                        store: store,
                            
                        displayInfo: true
                    },{
                        xtype: 'button',
                        text: 'Submit',
                        
                        scale: 'medium'
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
                        if (e.newValues!=e.originalValues){
                            //Lưu lại dòng có sửa data vào updatearray
                            var rowid=e.rowIdx+(store.currentPage-1)*itemsPerPage;
                            updatearray.push(rowid);
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
                        
                        //alert(e.grid.columns[i].dataIndex);
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
                                    alert('Test');
                                }
                                }
                            }
                        
            },

            
            items: [
                {
                    name      : 'size',
                    inputValue: 'm',
                    id        : 'radio1'
                }, {
                    name      : 'size',
                    inputValue: 'l',
                    id        : 'radio2'
                }, {
                    name      : 'size',
                    inputValue: 'xl',
                    id        : 'radio3'
                },{
                    name      : 'size',
                    inputValue: 'm',
                    id        : 'radio4'
                }, {
                    name      : 'size',
                    inputValue: 'l',
                    id        : 'radio5'
                }, {
                    name      : 'size',
                    inputValue: 'xl',
                    id        : 'radio6'
                },{
                    name      : 'size',
                    inputValue: 'm',
                    id        : 'radio7'
                }, {
                    name      : 'size',
                    inputValue: 'l',
                    id        : 'radio8'
                }, {
                    name      : 'size',
                    inputValue: 'xl',
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