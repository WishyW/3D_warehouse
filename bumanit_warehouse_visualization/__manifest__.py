# -*- coding:utf-8 -*-
# BumanIT | Буман АйТи | Odoo системийн монгол хувилбар. Зохиогчийн эрхээр хамгаалагдав.
# Part of Bumanit's Odoo Extension. Restricted for use without confirmation of BumanIT.
# Author: Boldsukh.A
# 2020
{
    "name": "Warehouse Visualization",
    "version": "13.0.1.0.0",
    "depends": ["base", "stock"],
    "author": "Boldsukh.A",
    "category": "Inventory",
    "description": """This module could be using for visualization your warehouse""",
    "license": "LGPL-3",
    "price": "99.99",
    "currency": "USD",
    "website": "http://www.bumanit.mn",
    "data": [
        "security/ir.model.access.csv",
        "views/stock_view.xml",
        "views/stock_locations_visualize.xml",
        "views/get_location.xml",
        "wizard/locate.xml",
        "data/sequence_location.xml",
    ],
    "qweb": [
        "static/xml/stock_location_visualize.xml",
    ],
    "installable": True,
    "auto_install": False,
}
