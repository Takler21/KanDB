"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angularfire2_1 = require("angularfire2");
var project_info_1 = require("../models/project-info");
var data_service_1 = require("app/shared/data.service");
var platform_browser_1 = require("@angular/platform-browser");
var ExportService = (function () {
    function ExportService(af, dataService, sanitizer) {
        this.af = af;
        this.dataService = dataService;
        this.sanitizer = sanitizer;
        this.cardlistStr = "";
    }
    //Formamos los conjuntos que formaran el Json a partir del tipo de elemnto que sean.
    ExportService.prototype.getJsonExport = function () {
        var _this = this;
        this.dataService.getCardListsByProject(this.projectExp.$key).subscribe(function (cList) {
            _this.cardlistExp = cList;
            var i = 0;
            _this.cardlistStr = "";
            cList.forEach(function (cL) {
                _this.cardlistStr = _this.cardlistStr.concat("\"" + cL.$key + "\":{\n                                                \"color\":\"" + cL.color + "\", \n                                                \"name\":\"" + cL.name + "\", \n                                                \"projectId\": \"" + cL.projectId + "\", \n                                                \"order\": " + cL.order + ", \n                                                \"created_at\": \"" + cL.created_at + "\"}").concat(", " + "\n");
            });
            _this.cardsExp = [];
            _this.cardsStr = "";
            _this.subcardlistsExp = [];
            _this.subCardListStr = "";
            _this.taskExp = [];
            _this.taskStr = "";
            cList.forEach(function (cardList) {
                _this.dataService.getSubCardListsByListId(cardList.$key)
                    .subscribe(function (subList) {
                    if (subList.length > 0) {
                        subList.forEach(function (sub) {
                            if (_this.subcardlistsExp.indexOf(sub) == -1) {
                                _this.subCardListStr = _this.subCardListStr.concat("  \"" + sub.$key + "\":{\n                                        \"cardlistId\":\"" + sub.cardlistId + "\", \n                                        \"name\":\"" + sub.name + "\", \n                                        \"order\": " + sub.order + ", \n                                        \"created_at\": \"" + sub.created_at + "\"}, ".concat("\n"));
                                _this.subcardlistsExp.push(sub);
                            }
                            _this.dataService.getCardsByListId(sub.$key)
                                .subscribe(function (cardSub) {
                                cardSub.forEach(function (t) {
                                    if (_this.cardsExp.indexOf(t) == -1) {
                                        _this.cardsStr = _this.cardsStr.concat("\"" + t.$key + "\":{\n                                \"description\":\"" + t.description + "\", \n                                \"cardListId\":\"" + t.cardListId + "\", \n                                \"name\":\"" + t.name + "\", \n                                \"isExpanded\":" + t.isExpanded + ",\n                                \"order\": " + t.order + ", \n                                \"created_at\": \"" + t.created_at + "\"}, ".concat("\n"));
                                        _this.cardsExp.push(t);
                                    }
                                    _this.dataService.getTasksByCardId(t.$key)
                                        .subscribe(function (data) {
                                        data.forEach(function (da) {
                                            if (_this.taskExp.indexOf(da.$key) == -1) {
                                                _this.taskStr = _this.taskStr.concat("\"" + da.$key + "\":{\n                                \"description\":\"" + da.description + "\", \n                                \"isCompleted\":" + da.isCompleted + ", \n                                \"cardId\": \"" + da.cardId + "\", \n                                \"order\": " + da.order + ", \n                                \"created_at\": \"" + da.created_at + "\"}, ".concat("\n"));
                                                _this.taskExp.push(da.$key);
                                            }
                                        });
                                    });
                                });
                            });
                        });
                        _this.subCardListStr = _this.subCardListStr.slice(0, _this.subCardListStr.lastIndexOf(",") - 1).concat("}");
                    }
                    else {
                        _this.dataService.getCardsByListId(cardList.$key).subscribe(function (cards) {
                            cards.forEach(function (c) {
                                if (_this.cardsExp.indexOf(c) == -1) {
                                    var nombre = c.name;
                                    if (c.name.indexOf('"') > -1) {
                                        nombre = _this.replaceAll(nombre, '\\"', '"');
                                    }
                                    _this.cardsStr = _this.cardsStr.concat("\"" + c.$key + "\":{\n                    \"description\":\"" + c.description + "\", \n                    \"cardListId\":\"" + c.cardListId + "\", \n                    \"name\":\"" + nombre + "\", \n                    \"isExpanded\":" + c.isExpanded + ",\n                    \"order\": " + c.order + ", \n                    \"created_at\": \"" + c.created_at + "\"}, ".concat("\n"));
                                    _this.cardsExp.push(c);
                                }
                                _this.dataService.getTasksByCardId(c.$key).subscribe(function (data) {
                                    data.forEach(function (da) {
                                        if (_this.taskExp.indexOf(da.$key) == -1) {
                                            _this.taskExp.push(da.$key);
                                            _this.taskStr = _this.taskStr.concat("\"" + da.$key + "\":{\n                                    \"description\":\"" + da.description + "\", \n                                    \"isCompleted\":" + da.isCompleted + ", \n                                    \"cardId\": \"" + da.cardId + "\", \n                                    \"order\": " + da.order + ", \n                                    \"created_at\": \"" + da.created_at + "\"}, ".concat("\n"));
                                        }
                                    });
                                });
                            });
                        });
                    }
                });
            });
        });
    };
    //Da la forma al string que pasaremos para generar el JSON.
    ExportService.prototype.setJsonExport = function () {
        this.getJsonExport();
        var projStr = "\"" + this.projectExp.$key + "\":{\n                        \"created_at\":\"" + this.projectExp.created_at + "\", \n                        \"name\":\"" + this.projectExp.name + "\"\n                        }";
        this.cardlistStr = this.cardlistStr.slice(0, this.cardlistStr.lastIndexOf(",") - 1);
        if (this.cardlistExp.length > 0)
            this.cardlistStr = this.cardlistStr.concat("}");
        this.cardsStr = this.cardsStr.slice(0, this.cardsStr.lastIndexOf(",") - 1);
        if (this.cardsExp.length > 0) {
            this.cardsStr = this.cardsStr.concat("}");
        }
        this.taskStr = this.taskStr.slice(0, this.taskStr.lastIndexOf(",") - 1);
        if (this.taskExp.length > 0) {
            this.taskStr = this.taskStr.concat("}");
        }
        this.resJsonResponse = "{\n            \"cardlist\": {\n                " + this.cardlistStr + "\n            },\n            \"cards\": {\n                " + this.cardsStr + "\n            },\n            \"projects\": {\n                " + projStr + "\n            },\n            \"subcardlist\": {\n                " + this.subCardListStr + "\n            },\n            \"tasks\": {\n                " + this.taskStr + "\n    }\n}";
    };
    //Metodo para que las comillas dentro de un string se importen correctamente como parte del string.
    ExportService.prototype.replaceAll = function (cadena, replacement, searched) {
        var i = 0;
        var replaced = "";
        var indexes = [];
        var segments = [];
        while (cadena.indexOf(searched, i) > -1 && (cadena.length > i && i > -1)) {
            segments.push(cadena.substring(i, cadena.indexOf(searched, i)));
            i = cadena.indexOf(searched, i) + 1;
        }
        segments.forEach(function (seg) {
            replaced = replaced.concat(seg).concat(replacement);
        });
        if (cadena.lastIndexOf(searched) < cadena.length - 1)
            replaced = replaced.substr(0, replaced.length - replacement.length);
        return replaced;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", project_info_1.Project)
    ], ExportService.prototype, "projectExp", void 0);
    ExportService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [typeof (_a = typeof angularfire2_1.AngularFire !== "undefined" && angularfire2_1.AngularFire) === "function" && _a || Object, typeof (_b = typeof data_service_1.DataService !== "undefined" && data_service_1.DataService) === "function" && _b || Object, platform_browser_1.DomSanitizer])
    ], ExportService);
    return ExportService;
    var _a, _b;
}());
exports.ExportService = ExportService;
//# sourceMappingURL=export.service.js.map