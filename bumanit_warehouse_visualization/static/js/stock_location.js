//-*- coding:utf-8 -*-
// BumanIT | Буман АйТи | Odoo системийн монгол хувилбар. Зохиогчийн эрхээр хамгаалагдав.
// Part of Bumanit's Odoo Extension. Restricted for use without confirmation of BumanIT.
// Author: Boldsukh.A 
// 2020

odoo.define('bumanit_warehouse_visualization.stock_location', function (require) {
    'use strict';

    var Widget = require('web.Widget');
    var widgetRegistry = require('web.widget_registry');
    var core = require('web.core');
    var rpc = require('web.rpc');
    var Context = require('web.Context');

    var QWeb = core.qweb;
    var _t = core._t;

    var stock_location = Widget.extend({
        template: "stock_location_template",
        xmlDependencies: ['/bumanit_warehouse_visualization/static/xml/stock_location_visualize.xml'],

        init: function (action) {
            this._super.apply(this, arguments);
            var raycaster = new THREE.Raycaster();
            var objects = [];
            var mouse = new THREE.Vector3(),
                INTERSECTED, SELECTED;
            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(
                60,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );

            window.my_locationid = []
            camera.position.set(20, 20, 0);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
            var renderer = new THREE.WebGLRenderer({ antialias: true }, this);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0xfff6e6);

            window.foobar = renderer.domElement;

            var loader = new THREE.FontLoader();

            loader.load('/bumanit_warehouse_visualization/static/fonts/helvetiker_bold.typeface.json', function (font) {

                // var none = new THREE.TextGeometry('Product expiration date state: None', {
                //     font: font,
                //     size: 1,
                //     height: 0,
                //     curveSegments: 12,
                //     bevelEnabled: false,
                //     bevelThickness: 0.1,
                //     bevelSize: 0.1,
                //     bevelSegments: 0.1
                // });
                // var txt_mat = new THREE.MeshPhongMaterial({ color: 0xffffff });
                // var txt_mesh = new THREE.Mesh(none, txt_mat);
                // txt_mesh.position.x = 0.5;
                // txt_mesh.position.z = 0;
                // txt_mesh.position.y = 2.5;
                // txt_mesh.rotation.z = Math.PI / 2;
                // pbox.add(txt_mesh);
                // var ins = new THREE.TextGeometry('Product expiration date state: In 10 days', {
                //     font: font,
                //     size: 1,
                //     height: 0,
                //     curveSegments: 12,
                //     bevelEnabled: false,
                //     bevelThickness: 0.1,
                //     bevelSize: 0.1,
                //     bevelSegments: 0.1
                // });
                // var txt_mat1 = new THREE.MeshPhongMaterial({ color: 0xffffff });
                // var txt_mesh1 = new THREE.Mesh(ins, txt_mat1);
                // txt_mesh1.position.z = 0;
                // txt_mesh1.position.x = 0.5;
                // txt_mesh1.position.y = 2.5;
                // txt_mesh1.rotation.z = Math.PI / 2;
                // pbox1.add(txt_mesh1);
                // var outs = new THREE.TextGeometry('Product expiration date state: Out 10 days', {
                //     font: font,
                //     size: 1,
                //     height: 0,
                //     curveSegments: 12,
                //     bevelEnabled: false,
                //     bevelThickness: 0.1,
                //     bevelSize: 0.1,
                //     bevelSegments: 0.1
                // });
                // var txt_mat2 = new THREE.MeshPhongMaterial({ color: 0xffffff });
                // var txt_mesh2 = new THREE.Mesh(outs, txt_mat2);
                // txt_mesh2.position.z = 0;
                // txt_mesh2.position.x = 0.5;
                // txt_mesh2.position.y = 2.5;
                // txt_mesh2.rotation.z = Math.PI / 2;
                // pbox2.add(txt_mesh2);

            });

            var plane = new THREE.Mesh(
                new THREE.PlaneGeometry(500, 2000, 10, 120),
                new THREE.MeshBasicMaterial({ color: 0x393839, transparent: true, side: THREE.DoubleSide, wireframe: true })
            );
            plane.rotateX(Math.PI / 2);
            scene.add(plane);

            var pbox = new THREE.Mesh(
                new THREE.PlaneGeometry(2, 3, 0),
                new THREE.MeshBasicMaterial({ color: 0x378CA8, wireframe: false })
            );
            pbox.rotateX(Math.PI / -2);
            pbox.position.set(-4, 0, -10);
            scene.add(pbox);

            var pbox1 = new THREE.Mesh(
                new THREE.PlaneGeometry(2, 3, 0),
                new THREE.MeshBasicMaterial({ color: 0xA84A37, wireframe: false })
            );
            pbox1.rotateX(Math.PI / -2);
            pbox1.position.set(-7, 0, -10);
            scene.add(pbox1);

            var pbox2 = new THREE.Mesh(
                new THREE.PlaneGeometry(2, 3, 0),
                new THREE.MeshBasicMaterial({ color: 0x56B570, wireframe: false })
            );
            pbox2.rotateX(Math.PI / -2);
            pbox2.position.set(-10, 0, -10);
            scene.add(pbox2);

            renderer.render(scene, camera);

            this._rpc({
                model: 'get.location',
                method: 'search_read',
                fields: ['startposx', 'startposy', 'startposz', 'loc_height', 'loc_width', 'loc_lenght', 'loc_repeat']
            }).then(function (result1) {
                $.each(result1, function (id, pos) {
                    if (pos.startposx && pos.startposy && pos.startposz && pos.loc_height && pos.loc_width && pos.loc_lenght && pos.loc_repeat) {
                        var geometry = new THREE.BoxGeometry(pos.loc_height, pos.loc_width, pos.loc_lenght);
                        var edges = new THREE.EdgesGeometry(geometry);
                        for (var j = 0; j < pos.loc_repeat; j++) {
                            var box = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x494446, transparent: true, opacity: 1, linewidth: 4 }));
                            box.rotateY(Math.PI / 2);
                            box.position.set(pos.startposx, pos.startposy, pos.startposz);
                            scene.add(box);

                            pos.startposx -= 10;
                            if (j % 5 == 4) {
                                pos.startposy += 4;
                                pos.startposx += 50;
                            }
                        }
                        renderer.render(scene, camera);
                    }
                })
            }, false);

            window.myresult = null
            window.odoodata = []

            this._rpc({
                model: 'stock.location',
                method: 'search_read',
                fields: ['id', 'posx', 'posy', 'posz', 'complete_name'],
            }).then(function (result) {
                window.myresult = result
                $.each(result, function (id, location) {
                    setTimeout(() => {
                        let lid = document.getElementById('lid')
                        let dv = `
                        <div id="lid"><div id="rtable">
                        <table id="btable"></table>    
                        <button id="closewindow" type="button" aria-label="Close">
                        <img id="x" src="/bumanit_warehouse_visualization/static/image/close.png" style="width: 30px"; "height:30px" >
                        </div>
                        </button>
                            <div id="cbutton"></div>
                        </div></div>`;
                        if (lid) {
                            lid.innerHTML = dv
                        } else {
                            document.querySelector('.locates').insertAdjacentHTML('beforeEnd', dv)
                        }
                        document.getElementById('closewindow').addEventListener('click', closeMyWindow)
                    }, 2.001)

                    if (location.posx && location.posy && location.posz) {
                        window.my_locationid.push(location.id)

                        var pr5 = new THREE.Mesh(
                            new THREE.BoxGeometry(10, 4, 4),
                            new THREE.MeshBasicMaterial({
                                color: 0xFFFFFF,
                                transparent: true,
                                opacity: 1,
                                wireframeLinewidth: 5
                            }),
                        );
                        scene.add(pr5);
                        pr5.name = location.id
                        pr5.rotateX(Math.PI);
                        pr5.position.set(location.posx, location.posy, location.posz);
                        objects.push(pr5);
                        window.tempdata = location
                    }
                    rpc.query({
                        model: 'stock.quant',
                        method: 'search_read',
                        fields: ['product_id', 'quantity', 'location_id'],
                        domain: [['location_id', '=', location.id]],
                    })
                        .then(function (rs) {
                            $.each(rs, function (id, lol) {
                                var myJSON = null
                                if (rs.length > 0) {
                                    for (let i = 0; i < rs.length; i++) {
                                        if (rs[i].location_id && window.my_locationid.includes(rs[i].location_id[0])) {
                                            if (!window.check[rs[i].location_id[0]]) {
                                                window.check[rs[i].location_id[0]] = {}
                                                var arr = []
                                                arr.push(rs)
                                                myJSON = JSON.stringify(arr);
                                            }
                                        }
                                    }
                                }
                                if (myJSON) {
                                    window.odoodata[location.id] = myJSON
                                }
                            })
                        })
                }, false);

                var i = 0;

                function closeMyWindow() {
                    const bar = document.getElementById('rtable')
                    if (bar) {
                        document.getElementById('cbutton').innerHTML = ''
                        bar.style.display = 'none'
                    }
                }

                document.addEventListener('click', onDocumentMouseClick, false);

                window.check = {}
                function onDocumentMouseClick(event) {
                    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
                    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
                    raycaster.setFromCamera(mouse, camera);
                    var intersects = raycaster.intersectObjects(objects);

                    if (intersects.length > 0) {
                        let oresult = JSON.parse(JSON.stringify(intersects[i].object))
                        intersects[i].object.material.color.set(0xff0000);
                        try {
                            var datas = JSON.parse(window.odoodata[oresult.object.name])
                            let btable = document.getElementById('btable')
                            btable.innerHTML = ''
                            for (let tempVar in datas) {
                                let p_data = datas[tempVar]
                                for (let p_dt in p_data) {
                                    btable.insertAdjacentHTML('beforeEnd', `<tr><th>Product Name</th><th>Product Quantity</th><th>Location</th></tr><tr><td>
                                    ${p_data[p_dt]['product_id'][1]}</a></td><td>${p_data[p_dt]['quantity']}</td><td>${p_data[p_dt]['location_id'][1]}</td></tr>`)
                                }
                            }
                            let rtable = document.getElementById('rtable')
                            rtable.style.display = 'block'
                        }
                        catch {
                            alert("There's no product on your selected location.")
                        }
                    }
                }
            })

            var controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.addEventListener('change', function () {
                renderer.render(scene, camera);
            })
        },

        start: function () {
            this._renderTemplate();
            // setTimeout(() => {
            this.$('.locates').append(window.foobar);
            this.$('lid').append(window.foobar);
            // }, 1000)
        },

        _renderTemplate: function () {
            this.$el.append(QWeb.render('stock_location_template'));
        },
    });

    widgetRegistry.add(
        'stock_location', stock_location,
    )
})