Ext.require(['*']); //Khai báo các thành phần cần load cho module extls, chọn '*' để load tất cả
Ext.onReady(function() {
    // Tạo data cho comboboxx
    var addcheck=false;
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
                {"send":1, "name":"CH4"},
                {"send":2, "name":"NMHC"},
                {"send":3, "name":"NO"},
                {"send":4, "name":"NO2"},
                {"send":5, "name":"NOx"},
                {"send":6, "name":"Ozone"},
                {"send":7, "name":"CO"},
                {"send":8, "name":"SO2"},
                {"send":9, "name":"PM2.5"}
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
    Ext.define('Store.AddData',{
        extend: 'Ext.data.Model',
        fields: [
            {name: 'date', type: 'date', dateFormat: 'Y-m-d'},
            {name: 'time', type: 'date', dateFormat: 'H:i:s'},
            {name: 'value_ch4', type: 'float'},
            {name: 'min_ch4', type: 'float'},
            {name: 'downquar_ch4', type: 'float'},
            {name: 'median_ch4', type: 'float'},
            {name: 'upquar_ch4', type: 'float'},
            {name: 'max_ch4', type: 'float'},
            {name: 'value_nm', type: 'float'},
            {name: 'min_nm', type: 'float'},
            {name: 'downquar_nm', type: 'float'},
            {name: 'median_nm', type: 'float'},
            {name: 'upquar_nm', type: 'float'},
            {name: 'max_nm', type: 'float'},
            {name: 'value_no', type: 'float'},
            {name: 'min_no', type: 'float'},
            {name: 'downquar_no', type: 'float'},
            {name: 'median_no', type: 'float'},
            {name: 'upquar_no', type: 'float'},
            {name: 'max_no', type: 'float'},
            {name: 'value_no2', type: 'float'},
            {name: 'min_no2', type: 'float'},
            {name: 'downquar_no2', type: 'float'},
            {name: 'median_no2', type: 'float'},
            {name: 'upquar_no2', type: 'float'},
            {name: 'max_no2', type: 'float'},
            {name: 'value_nox', type: 'float'},
            {name: 'min_nox', type: 'float'},
            {name: 'downquar_nox', type: 'float'},
            {name: 'median_nox', type: 'float'},
            {name: 'upquar_nox', type: 'float'},
            {name: 'max_nox', type: 'float'},
            {name: 'value_o3', type: 'float'},
            {name: 'min_o3', type: 'float'},
            {name: 'downquar_o3', type: 'float'},
            {name: 'median_o3', type: 'float'},
            {name: 'upquar_o3', type: 'float'},
            {name: 'max_o3', type: 'float'},
            {name: 'value_co', type: 'float'},
            {name: 'min_co', type: 'float'},
            {name: 'downquar_co', type: 'float'},
            {name: 'median_co', type: 'float'},
            {name: 'upquar_co', type: 'float'},
            {name: 'max_co', type: 'float'},
            {name: 'value_so2', type: 'float'},
            {name: 'min_so2', type: 'float'},
            {name: 'downquar_so2', type: 'float'},
            {name: 'median_so2', type: 'float'},
            {name: 'upquar_so2', type: 'float'},
            {name: 'max_so2', type: 'float'},
            {name: 'value_pm25', type: 'float'},
            {name: 'min_pm25', type: 'float'},
            {name: 'downquar_pm25', type: 'float'},
            {name: 'median_pm25', type: 'float'},
            {name: 'upquar_pm25', type: 'float'},
            {name: 'max_pm25', type: 'float'}
        ]
    });
    store = Ext.create('Ext.data.ArrayStore', {
        storeId: 'store',
        model: 'Store.AddData',
        data: [],
        proxy: {
            type: 'memory',
            enablePaging: true,                     
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
            region: 'west', //Phía bên trái, form
            collapsible: true,
            collapsed: false,
            split: true,
            autoScroll: true,
            title: 'Options',
            minWidth: 220,
            maxWidth: 250,
            xtype: 'form',
            bodyPadding: 0,
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
                border:0,
    width: 220,
    height: 500,
    layout: {
        // layout-specific configs go here
        type: 'accordion',
        titleCollapse: true,
        animate: true,
        activeOnTop: true
    },
    items: [{
        title: 'Basic',
        layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
        items: [{
                xtype: 'datefield',
                fieldLabel: 'Date',
                name: 'date',
                id: 'date',
                format: 'd/m/Y',
                submitFormat: 'Y/m/d',
                value: '01/05/2013',
                allowBlank: false
            },{
                xtype: 'timefield',
                fieldLabel: 'Time',
                name: 'time',
                id: 'time',
                format: 'H:i:s',
                increment: 60,
                allowBlank: true
            },{
                xtype: 'combo',
                fieldLabel: 'Data type view',
                id: 'view',
                name: 'view',
                store: typeview,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'send',
                value: 'h',
                allowBlank: false
            },{
                xtype: 'combo',
                store: subs,
                id: 'subs',
                queryMode: 'local',
                fieldLabel: 'Substance',
                name: 'subs',
                displayField: 'name',
                value: 1,
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
            }]
    },{
        title: 'Download options',
        items:[{
            xtype: 'fieldcontainer',
            fieldLabel: 'Chất',
            defaultType: 'checkboxfield',
            items: [
                {
                    boxLabel  : 'CH4',
                    inputValue: 1,
                    checked   : true,
                    id        : 'checkbox1'
                }, {
                    boxLabel  : 'NMHC',
                    inputValue: 2,
                    checked   : true,
                    id        : 'checkbox2'
                }, {
                    boxLabel  : 'NO',
                    inputValue: 3,
                    checked   : true,
                    id        : 'checkbox3'
                }, {
                    boxLabel  : 'NO2',
                    inputValue: 4,
                    checked   : true,
                    id        : 'checkbox4'
                }, {
                    boxLabel  : 'NOx',
                    inputValue: 5,
                    checked   : true,
                    id        : 'checkbox5'
                }, {
                    boxLabel  : 'O3',
                    inputValue: 6,
                    checked   : true,
                    id        : 'checkbox6'
                }, {
                    boxLabel  : 'CO',
                    inputValue: 7,
                    checked   : true,
                    id        : 'checkbox7'
                }, {
                    boxLabel  : 'SO2',
                    inputValue: 8,
                    checked   : true,
                    id        : 'checkbox8'
                }, {
                    boxLabel  : 'PM2.5',
                    inputValue: 9,
                    checked   : true,
                    id        : 'checkbox9'
                }
            ]
    },{
                xtype: 'button',
                    text: 'Download',
                    listeners:{
                        click: {
                            fn: function(){
                                var choose='';
                                var data = Ext.getCmp('form').getForm();
                                for (var i=1;i<=9;i++) {
                                    if (Ext.getCmp('checkbox'+i).getValue()) choose+=Ext.getCmp('checkbox'+i).getSubmitValue();
                                }
                                if (choose.length!=0) {window.location='php/download.php?date='+data.findField('date').getSubmitValue()+'&time='+data.findField('time').getSubmitValue()+'&view='+data.findField('view').getSubmitValue()+'&choose='+choose;}
                                else Ext.Msg.alert('Failed','Phải chọn ít nhất một chất');
                              
                                  
                                    
                            }
                        }    
                    }
                }]}]
            }
            ],
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
                                var radioid='radio'+sub;
                                if (Ext.getCmp(radioid).getValue()) {showdata(sub);}
                                else Ext.getCmp(radioid).setValue(true);
                                //showdata(form.findField('subs').getValue());
                                Ext.getCmp('paging').doRefresh();
                                udarray=[];
                            },
                            failure: function(form, action) {
                                store.proxy.data=[];
                                Ext.getCmp('mygrid').getStore().removeAll();
                                Ext.getCmp('paging').doRefresh();
                                showdata(form.findField('subs').getValue());
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
            minWidth: 400,
            xtype: 'grid',
            store: store,
            stateful: true,
            id: 'mygrid',
            stateId: 'stateGrid',
            listeners:{
                selectionchange: function(model, selected) {
                    var tool=Ext.getCmp('toolbar');
                    tool.getComponent('delete').enable();
                }                    
            },
            columns: [
                {
                    text : 'Ngày',
                    minWidth : 90,
                    sortable : true,             
                    renderer : Ext.util.Format.dateRenderer('d/m/Y'),
                    dataIndex: 'date',
                    editor: {
                        xtype: 'datefield',
                        format: 'd/m/Y',
                        allowBlank: false
                    }
                },{
                    text : 'Thời gian',
                    minWidth : 90,
                    sortable : true,
                    renderer : Ext.util.Format.dateRenderer('H:i:s'),
                    dataIndex: 'time',
                    editor: {
                        xtype: 'timefield',
                        format: 'H:i:s',
                        increment: 5,
                        allowBlank: false
                    }
                },{
                    text : 'CH4',
                    minWidth :60,
                    width : '7%',
                    sortable : true,                  
                    dataIndex: 'value_ch4',
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
                    dataIndex: 'value_nm',
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
                    dataIndex: 'value_no',
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
                    dataIndex: 'value_no2',
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
                    dataIndex: 'value_nox',
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
                    dataIndex: 'value_o3',
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
                    dataIndex: 'value_co',
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
                    dataIndex: 'value_so2',
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
                    dataIndex: 'value_pm25',
                    editor: {
                        xtype: 'numberfield',
                        decimalPrecision: 4,
                        allowBlank: false
                    }
                }],
            tbar: {
                id: 'toolbar',
                items: [{
                    iconCls: 'icon-add',
                    text: 'Add',
                    scope: this,
                    handler: function(){
                        var d=new Date();
                        var rec = new Store.AddData({
                            date: d,
                            time: d,
                            Metan: '0',
                            NMHC: '0',
                            NO: '0',
                            NO2: '0',
                            NOx: '0',
                            Ozone: '0',
                            SO2: '0',
                            CO: '0',
                            PM25: '0'
                        }), edit = Ext.getCmp('mygrid').getPlugin('rowedit');
                        store.insert(0, rec);
                        addcheck=true;
                        edit.startEdit(0,2);
                    }
                },{
                    iconCls: 'icon-delete',
                    text: 'Delete',
                    disabled: true,
                    itemId: 'delete',
                    scope: this,
                    handler: function (){
                        var selection=Ext.getCmp('mygrid').getView().getSelectionModel().getSelection()[0];
                        store.remove(selection);
                        udarray.push(['delete',store.proxy.data[selection.index]]);
                        store.proxy.data.splice(selection.index,1);
                        Ext.getCmp('paging').doRefresh();
                        showdata(Ext.getCmp('form').getForm().findField('subs').getValue());
                        var tool=Ext.getCmp('toolbar');
                        tool.getComponent('delete').disable();                    
                    }
                }]
            },
            bbar: {
                xtype: 'pagingtoolbar',
                id: 'paging',
                beforePageText: 'Trang',
                afterPageText: 'trên {0}',
                store: store,
                width: 500,
                displayInfo: true,
                saveDelay: 300,
                items:[{
                    iconCls: 'icon-submit',
                    xtype: 'button',
                    text: 'Submit',
                    scale: 'small',
                    handler: function(){
                        if (udarray.length==0 || store.proxy.data.length==0){
                            Ext.Msg.alert('Failed', 'Số liệu không thay đổi');
                        }
                        else {
                            var check=false;
                            var form=Ext.getCmp('form').getForm();
                            $.ajax({url:"php/update.php", // DÙng AJAX gửi biến qua PHP để update
                                    type:"POST",
                                    cache:"false",
                                    data:
                                    {
                                        change:udarray,
                                        table: form.findField('view').getValue()
                                    },
                                    dataType:"json",
                                    success:function(result) {
                                        if (result.success==true) {
                                            Ext.Msg.alert('Success', 'Cập nhật số liệu thành công');
                                            udarray=[];
                                            check=true;
                                        }
                                        else {Ext.Msg.alert('Failed', 'Cập nhật thất bại');}
                                        if (check==false) {Ext.Msg.alert('Failed', 'Cập nhật thất bại');}
                                    }});               
                        }
                    }
                }]
            },
            selType: 'rowmodel',
            plugins: [
                Ext.create('Ext.grid.plugin.RowEditing', {
                    autoCancel: false,
                    clicksToEdit: 2,
                    pluginId: "rowedit",
                    listeners: {
                        edit: { // Edit dự liệu trong grid
                            fn: function(editor,e){
                                //var date=store.data.items[e.rowIdx].data.date;
                                if (addcheck) {
                                    var proxy=[];
                                    var field=store.getProxy().getModel().getFields();
                                    proxy[0]=Ext.Date.format(e.record.get('date'),'Y-m-d');
                                    proxy[1]=Ext.Date.format(e.record.get('time'),'H:i:s');
                                    for (var i=2;i<=10;i++) {
                                        proxy[i]=e.record.get(field[i].name);
                                    }
                                    store.proxy.data.unshift(proxy);
                                    udarray.push(['add',changearray(e.newValues)]);
                                    Ext.getCmp('paging').doRefresh();
                                    showdata(Ext.getCmp('form').getForm().findField('subs').getValue());
                                    addcheck=false;        
                                }
                                else {
                                    var rowid=e.rowIdx+(store.currentPage-1)*itemsPerPage;
                                    var proxy=store.proxy.data[rowid];
                                    var field=store.getProxy().getModel().getFields();
                                    switch(checkchange(e.newValues,e.originalValues)) {
                                        case 'update':
                                            for (var i=2;i<=10;i++) {
                                                proxy[i]=e.record.get(field[i].name);
                                            }
                                            udarray.push(['update',changearray(e.newValues)]);
                                            showdata(Ext.getCmp('form').getForm().findField('subs').getValue());
                                            break;
                                        case 'change':
                                            udarray.push(['change',changearray(e.originalValues), changearray(e.newValues)]);
                                            proxy[0]=Ext.Date.format(e.record.get('date'),'Y-m-d');
                                            proxy[1]=Ext.Date.format(e.record.get('time'),'H:i:s');
                                            for (var i=2;i<=10;i++) {
                                                proxy[i]=e.record.get(field[i].name);
                                            }
                                            showdata(Ext.getCmp('form').getForm().findField('subs').getValue());
                                            break;    
                                    }    
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
                    // Tạo radio chọn chất cần xem
                    xtype      : 'fieldcontainer',
                    defaultType: 'radiofield',                                
                    defaults: {
                        flex: 0,
                        listeners:{
                            mouseover:{
                                fn: function(){
                                    alert('test');
                                }
                            },
                            change:{
                                fn: function(){
                                    if (this.value) {    
                                        showdata(this.inputValue);
                                        Ext.getCmp('form').getForm().findField('subs').setValue(this.inputValue);
                                    }                               
                                }
                            }
                        }                    
                    },     
                    items: [{
                        name      : 'size',
                        inputValue: 1,
                        id        : 'radio1'
                    },{
                        name      : 'size',
                        inputValue: 2,
                        id        : 'radio2'
                    }, {
                        name      : 'size',
                        inputValue: 3,
                        id        : 'radio3'
                    },{
                        name      : 'size',
                        inputValue: 4,
                        id        : 'radio4'
                    }, {
                        name      : 'size',
                        inputValue: 5,
                        id        : 'radio5'
                    }, {
                        name      : 'size',
                        inputValue: 6,
                        id        : 'radio6'
                    },{
                        name      : 'size',
                        inputValue: 7,
                        id        : 'radio7'
                    }, {
                        name      : 'size',
                        inputValue: 8,
                        id        : 'radio8'
                    }, {
                        name      : 'size',
                        inputValue: 9,
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
    if (Ext.Date.format(a.date,'Y-m-d')!=Ext.Date.format(b.date,'Y-m-d') || Ext.Date.format(a.time,'H:i:s')!=Ext.Date.format(b.time,'H:i:s')) {return 'change';}
    else if (a.value_ch4==b.value_ch4&&
        a.value_nm==b.value_nm&&
        a.value_no==b.value_no&&
        a.value_no2==b.value_no2&&
        a.value_nox==b.value_nox&&
        a.value_o3==b.value_o3&&
        a.value_co==b.value_co&&
        a.value_so2==b.value_so2&&
        a.value_pm25==b.value_pm25) {return 'nochange';}
    else return 'update';
}
function changearray(a){
    var b=[];
    b[0]=Ext.Date.format(a.date,'Y-m-d');
    b[1]=Ext.Date.format(a.time,'H:i:s');
    b[2]=a.value_ch4;
    b[3]=a.value_nm;
    b[4]=a.value_no;
    b[5]=a.value_no2;
    b[6]=a.value_nox;
    b[7]=a.value_o3;
    b[8]=a.value_co;
    b[9]=a.value_so2;
    b[10]=a.value_pm25;
    return b;
}

