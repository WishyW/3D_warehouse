# -*- coding:utf-8 -*-
# BumanIT | Буман АйТи | Odoo системийн монгол хувилбар. Зохиогчийн эрхээр хамгаалагдав.
# Part of Bumanit's Odoo Extension. Restricted for use without confirmation of BumanIT.
# Author: Boldsukh.A
# 2022

from odoo import api, fields, models, _


class LocateWizard(models.TransientModel):
    _name = "locate.wizard"
    _description = "Locate Wizard"
