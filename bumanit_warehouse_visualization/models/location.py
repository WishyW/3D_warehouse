# -*- coding:utf-8 -*-
# BumanIT | Буман АйТи | Odoo системийн монгол хувилбар. Зохиогчийн эрхээр хамгаалагдав.
# Part of Bumanit's Odoo Extension. Restricted for use without confirmation of BumanIT.
# Author: Boldsukh.A
# 2022

from odoo import api, fields, models, _


class Location(models.Model):
    _inherit = "stock.location"
    _description = "Location"

    # Stock.location дээр байгаа posx, posy, posz дээр утга оруулснаар тухайн үүсгэсэн тавиур дээр
    # өөрийн агуулахын байрлалыг байрлуулж болно.

    def locate(self):
        view = self.env.ref("bumanit_warehouse_visualization.view_three_locate")
        return {
            "name": _("Locate Wizard"),
            "type": "ir.actions.act_window",
            "view_type": "form",
            "view_mode": "form",
            "res_model": "locate.wizard",
            "views": [(view.id, "form")],
            "view_id": view.id,
            "target": "self",
        }
