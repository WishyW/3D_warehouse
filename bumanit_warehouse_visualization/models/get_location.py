# -*- coding:utf-8 -*-
# BumanIT | Буман АйТи | Odoo системийн монгол хувилбар. Зохиогчийн эрхээр хамгаалагдав.
# Part of Bumanit's Odoo Extension. Restricted for use without confirmation of BumanIT.
# Author: Boldsukh.A
# 2022

from odoo import api, fields, models, _
from odoo.exceptions import UserError


class Location(models.Model):
    _name = "get.location"
    _description = "Get Locations"
    # Энэхүү классыг ашигласнаар хэрэглэгч өөрийн агуулахын тавиурын хэмжээг өгч үүсгэнэ.

    name = fields.Char(
        string="Reference",
        required=True,
        readonly=True,
        default=lambda *a: _("New"),
        copy=False,
    )
    startposx = fields.Integer(
        string="Start position X", default=16, help="Start posx default value 16"
    )
    startposy = fields.Integer(
        string="Start position Y", default=2, help="Start posy default value 2"
    )
    startposz = fields.Integer(
        string="Start position Z", default=4, help="Start posy default value 4"
    )
    loc_height = fields.Integer(string="Position Y", default=4, readonly=True)
    loc_width = fields.Integer(string="Position Z", default=4, readonly=True)
    loc_lenght = fields.Integer(string="Position X", default=10, readonly=True)
    loc_repeat = fields.Integer(string="Repeat of locations")
    row_x = fields.Integer("row_x")
    row_y = fields.Integer("row_y")
    row_z = fields.Integer("row_z")
    shelf = fields.Integer("Shelf")

    @api.model
    def create(self, vals):
        if vals.get("name", "New") == "New":
            vals["name"] = self.env["ir.sequence"].next_by_code("get.location") or "New"
            result = super(Location, self).create(vals)
            return result

    @api.onchange("loc_repeat")
    def loc_repeat_change(self):
        if self.loc_repeat > 20:
            raise UserError(_("Location repeat max number is 20."))

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
