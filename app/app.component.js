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
var platform_browser_1 = require("@angular/platform-browser");
var data_service_1 = require("app/shared/data.service");
var export_service_1 = require("app/shared/export.service");
var project_info_1 = require("app/models/project-info");
var cardlist_info_1 = require("app/models/cardlist-info");
var AppComponent = (function () {
    function AppComponent(dataService, sanitizer, exportService) {
        this.dataService = dataService;
        this.sanitizer = sanitizer;
        this.exportService = exportService;
        this.title = 'The Kanban Board';
        this.css_color_names = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.getProjects()
            .subscribe(function (data) {
            _this.projects = data;
            //Estoy filtrando segun el projecto inicial.
            _this.projectSelected = _this.projects[0];
            _this.exportService.projectExp = _this.projectSelected;
            //console.log(firstProject);
            // this.addAddCardList(
            //     'Done', 
            //     firstProject.$key,
            //     'green'
            // );
            if (_this.projects.length > 0) {
                _this.filterCardLists();
                _this.exportService.getJsonExport();
            }
        });
        this.dataService.getSubCardList();
        this.dataService.getCards();
        this.dataService.getTasks();
    };
    AppComponent.prototype.generateDownloadJsonUri = function () {
        this.resetOrder();
        this.exportService.setJsonExport();
        var theJSON = this.exportService.resJsonResponse;
        var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
        this.downloadJsonHref = uri;
    };
    //Actualiza los valores despues de importar el JSON
    AppComponent.prototype.fileChangeListener = function ($event) {
        var _this = this;
        var reader = new FileReader();
        if ($event.target.files && $event.target.files.length > 0) {
            var file = $event.target.files[0];
            //Asi conseguimos el JSON aunque sea en string.
            reader.readAsText(file);
            //A veces no actualiza correctamente el navegador,
            //por lo que usaremos estas variables para gestionar eso.
            var projlength_1 = this.projects.length;
            var selc_1 = this.projectSelected;
            reader.onload = function () {
                _this.importado = reader.result;
                _this.importado = JSON.parse(_this.importado);
                Object.keys(_this.importado.projects).forEach(function (project) {
                    _this.dataService.importProject(project, {
                        "created_at": _this.importado.projects[project].created_at,
                        "name": _this.importado.projects[project].name
                    });
                });
                Object.keys(_this.importado.cardlist).forEach(function (caList) {
                    if (_this.dataService.getProjectById(_this.importado.cardlist[caList].projectId)) {
                        _this.dataService.importCardlist(caList, {
                            "color": _this.importado.cardlist[caList].color,
                            "name": _this.importado.cardlist[caList].name,
                            "projectId": _this.importado.cardlist[caList].projectId,
                            "order": _this.importado.cardlist[caList].order,
                            "created_at": _this.importado.cardlist[caList].created_at
                        });
                    }
                });
                Object.keys(_this.importado.subcardlist).forEach(function (sub) {
                    if (_this.dataService.getCardListsById(_this.importado.subcardlist[sub].cardlistId)) {
                        _this.dataService.importSubcardlist(sub, {
                            "cardlistId": _this.importado.subcardlist[sub].cardlistId,
                            "name": _this.importado.subcardlist[sub].name,
                            "order": _this.importado.subcardlist[sub].order,
                            "created_at": _this.importado.subcardlist[sub].created_at
                        });
                    }
                });
                Object.keys(_this.importado.cards).forEach(function (ca) {
                    if (_this.dataService.getCardListsById(_this.importado.cards[ca].cardListId) || _this.dataService.getSubCardListsById(_this.importado.cards[ca].cardListId)) {
                        _this.dataService.importCards(ca, {
                            "description": _this.importado.cards[ca].description,
                            "cardListId": _this.importado.cards[ca].cardListId,
                            "name": _this.importado.cards[ca].name,
                            "isExpanded": _this.importado.cards[ca].isExpanded,
                            "order": _this.importado.cards[ca].order,
                            "created_at": _this.importado.cards[ca].created_at
                        });
                    }
                });
                Object.keys(_this.importado.tasks).forEach(function (ta) {
                    if (_this.dataService.getCardsById(_this.importado.tasks[ta].cardId)) {
                        _this.dataService.importTasks(ta, {
                            "description": _this.importado.tasks[ta].description,
                            "isCompleted": _this.importado.tasks[ta].isCompleted,
                            "cardId": _this.importado.tasks[ta].cardId,
                            "order": _this.importado.tasks[ta].order,
                            "created_at": _this.importado.tasks[ta].created_at
                        });
                    }
                });
                if (projlength_1 == _this.projects.length) {
                    _this.dataService.getProjects().subscribe(function (data) {
                        _this.projects = data;
                    });
                }
                _this.projectSelected = selc_1;
            };
        }
    };
    AppComponent.prototype.addProject = function (name) {
        var created_at = new Date().toString();
        var newProject = new project_info_1.Project();
        newProject.name = name;
        newProject.created_at = created_at;
        this.dataService.addProject(newProject);
    };
    AppComponent.prototype.deleteProject = function () {
        var _this = this;
        this.resetOrder();
        var mono;
        this.exportService.setJsonExport();
        mono = JSON.parse(this.exportService.resJsonResponse);
        Object.keys(mono.tasks).forEach(function (task) {
            _this.dataService.deleteTask(task);
        });
        Object.keys(mono.cards).forEach(function (ca) {
            _this.dataService.deleteCard(ca);
        });
        Object.keys(mono.subcardlist).forEach(function (sub) {
            _this.dataService.deleteSubCard(sub);
        });
        Object.keys(mono.cardlist).forEach(function (calist) {
            _this.dataService.deleteCardlist(calist);
        });
        this.dataService.deleteProject(this.projectSelected.$key);
    };
    //Al realizar algun cambio usaremos esta funcion para que el orden 
    //de los cardlist sean numeros consecutivos
    AppComponent.prototype.resetOrder = function () {
        var _this = this;
        var ord = 0;
        this.cardlists.forEach(function (c) {
            if (c.order != ord)
                _this.dataService.updateCardList(c.$key, { order: ord });
            ord++;
        });
    };
    AppComponent.prototype.addCardList = function (name, projectId, color, order) {
        var created_at = new Date().toString();
        var newCardList = new cardlist_info_1.CardList();
        newCardList.name = name;
        newCardList.projectId = projectId;
        newCardList.color = color;
        newCardList.order = order;
        newCardList.created_at = created_at;
        this.dataService.addCardList(newCardList);
    };
    AppComponent.prototype.saveAddProject = function () {
        this.addProject(this.projectname);
        this.toShowAddProject = false;
    };
    AppComponent.prototype.saveAddCardList = function () {
        var _this = this;
        this.resetOrder();
        this.cardlists.forEach(function (cardlist) {
            if (cardlist.order >= _this.cardlistorder)
                _this.dataService.updateCardList(cardlist.$key, { order: cardlist.order + 1 });
        });
        this.addCardList(this.cardlistname, this.projectSelected.$key, this.cardlistcolor, this.cardlistorder);
        this.toShowAddCardList = false;
    };
    //Filtra las tareas por los cardlist segun el projecto al que pertenezcan.
    AppComponent.prototype.filterCardLists = function () {
        var _this = this;
        this.dataService.getCardLists()
            .subscribe(function (c) {
            _this.cardlists = c;
            _this.cardlists = _this.cardlists.filter(function (cardlist) { return cardlist.projectId == _this.projectSelected.$key; });
        });
    };
    AppComponent.prototype.styles = function () {
        var sty = "width:" + 100 / this.cardlists.length + "%; float: left";
        return this.sanitizer.bypassSecurityTrustStyle(sty);
    };
    //Mostrar modal project
    AppComponent.prototype.showAddProject = function () {
        this.projectname = '';
        this.toShowAddProject = true;
    };
    //Ocultar modal project
    AppComponent.prototype.cancelAddProject = function () {
        this.toShowAddProject = false;
    };
    //Mostrar modal cardlist
    AppComponent.prototype.showAddCardList = function () {
        this.cardlistname = '';
        this.cardlistcolor = '';
        this.cardlistorder = this.cardlists.length;
        this.toShowAddCardList = true;
    };
    //Ocultar modal cardlist
    AppComponent.prototype.cancelAddCardList = function () {
        this.toShowAddCardList = false;
    };
    AppComponent.prototype.onChange = function (val) {
        this.projectSelected = val;
        this.exportService.projectExp = val;
        this.filterCardLists();
        this.exportService.setJsonExport();
    };
    __decorate([
        core_1.ViewChild('fileImportInput'),
        __metadata("design:type", Object)
    ], AppComponent.prototype, "fileImportInput", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof data_service_1.DataService !== "undefined" && data_service_1.DataService) === "function" && _a || Object, platform_browser_1.DomSanitizer, typeof (_b = typeof export_service_1.ExportService !== "undefined" && export_service_1.ExportService) === "function" && _b || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map