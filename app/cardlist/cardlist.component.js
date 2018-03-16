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
var data_service_1 = require("app/shared/data.service");
var export_service_1 = require("app/shared/export.service");
var cardlist_info_1 = require("app/models/cardlist-info");
var subcardlist_info_1 = require("app/models/subcardlist-info");
var card_info_1 = require("app/models/card-info");
var CardListComponent = (function () {
    function CardListComponent(dataService, exportService) {
        this.dataService = dataService;
        this.exportService = exportService;
        this.allowedDropFrom = [];
        this.allowedDragTo = false;
    }
    CardListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.getSubCardListsByListId(this.item.$key)
            .subscribe(function (s) {
            _this.subcardlists = s;
            _this.existSub = _this.subcardlists.length != 0;
            //En desarrollo.
            if (!_this.existSub) {
                _this.dataService.getCardsByListId(_this.item.$key)
                    .subscribe(function (data) {
                    _this.cards = data;
                    if (_this.cards.length == 0)
                        _this.cardlistEmpty = true;
                    else
                        _this.cardlistEmpty = false;
                    _this.exportService.getJsonExport();
                });
            }
            else {
                _this.loadCardWithSublists();
            }
        });
        //fill allowed drop-from containers
        //Usar item para el id del proyecto, con el que sacar 
        //los card list y filtrar o lo que sea por orden.
        //luego comprobar si el siguiente tiene subcardlist
        this.allowedDropFrom = [];
        this.dataService.getCardLists().subscribe(function (p) {
            var carp = p.filter(function (cardlist) { return cardlist.projectId == (_this.item.projectId); });
            _this.allowedDropFrom = [];
            carp.forEach(function (p1) {
                if (p1.order == _this.item.order - 1)
                    _this.allowedDropFrom.push(p1.$key);
                //Hasta aqui permite el pase de cardlist normales
            });
            //Add subcardlists keys to allowedDropFrom variable.
            _this.dataService.getSubCardListsByListId(_this.allowedDropFrom[0])
                .subscribe(function (data) {
                if (data.length > 0 && _this.item.order != 0)
                    data.forEach(function (sub) {
                        _this.allowedDropFrom.push(sub.$key);
                    });
            });
            //Let change card between subcardlist in the same card list
            if (_this.subcardlists && _this.subcardlists.length > 0) {
                _this.subcardlists.forEach(function (sub) {
                    _this.allowedDropFrom.push(sub.$key);
                });
            }
        });
        //fill if it has next containers
        this.dataService.getCardListsByOrder(this.item.order + 1)
            .subscribe(function (d) {
            if (d.length > 0)
                _this.allowedDragTo = true;
        });
    };
    CardListComponent.prototype.loadCardWithSublists = function () {
        var _this = this;
        if (!this.cards || this.existSub)
            this.cards = [];
        this.subcardlists.forEach(function (sub) {
            if (_this.allowedDropFrom.indexOf(sub.$key))
                _this.allowedDropFrom.push(sub.$key);
            _this.dataService.getCardsByListId(sub.$key)
                .subscribe(function (data) {
                var aux = [];
                _this.cards.forEach(function (c) {
                    aux[c.$key] = c.$key;
                });
                data.forEach(function (d) {
                    if (!aux[d.$key]) {
                        _this.cards.push(d);
                    }
                });
                _this.exportService.getJsonExport();
            });
        });
    };
    CardListComponent.prototype.showAddCard = function (id) {
        this.cardname = '';
        this.carddescription = '';
        this.toShowAddCard = true;
        this.fatherIdCard = id;
    };
    CardListComponent.prototype.cancelAddCard = function () {
        this.toShowAddCard = false;
    };
    CardListComponent.prototype.saveAddCard = function () {
        //console.log('save card');
        this.addCard(this.cardname, this.carddescription, true, this.fatherIdCard, 0);
        if (this.subcardlists) {
            this.loadCardWithSublists();
        }
        this.toShowAddCard = false;
    };
    CardListComponent.prototype.resetOrder = function (cardli) {
        var _this = this;
        var ord = 0;
        cardli.forEach(function (c) {
            //console.log(c.order);
            if (c.order != ord)
                //console.log(c.order)
                _this.dataService.updateCardList(c.$key, { order: ord });
            ord++;
        });
    };
    CardListComponent.prototype.addCard = function (name, description, isExpanded, cardListId, order) {
        var created_at = new Date().toString();
        var newCard = new card_info_1.Card();
        newCard.name = name;
        newCard.description = description;
        newCard.cardListId = cardListId;
        newCard.isExpanded = isExpanded;
        newCard.order = order;
        newCard.created_at = created_at;
        this.dataService.addCard(newCard);
    };
    CardListComponent.prototype.deleteCard = function (card) {
        var _this = this;
        this.dataService.deleteCard(card.$key);
        this.dataService.getTasksByCardId(card.$key).subscribe(function (data) {
            data.forEach(function (task) {
                _this.dataService.deleteTask(task.$key);
            });
        });
        this.loadCardWithSublists();
    };
    //ya tengo cards por lo que otro subcribe seria innecesario, me vale con recorre el arra
    CardListComponent.prototype.deleteSublist = function (subc) {
        var _this = this;
        var cardSub = [];
        this.cards.forEach(function (c) {
            if (c.cardListId == subc.$key) {
                _this.dataService.deleteCard(c.$key);
                cardSub.push(c);
            }
        });
        cardSub.forEach(function (cs) {
            _this.dataService.getTasksByCardId(cs.$key).subscribe(function (data) {
                data.forEach(function (task) {
                    _this.dataService.deleteTask(task.$key);
                });
            });
        });
        this.dataService.deleteSubCard(subc.$key);
        this.loadCardWithSublists();
    };
    CardListComponent.prototype.deleteCardlist = function () {
        var _this = this;
        var tasks;
        this.cards.forEach(function (c) {
            _this.dataService.getTasksByCardId(c.$key)
                .subscribe(function (t) {
                t.forEach(function (task) {
                    _this.dataService.deleteTask(task.$key);
                });
                _this.dataService.deleteCard(c.$key);
            });
        });
        this.subcardlists.forEach(function (sub) {
            _this.dataService.deleteSubCard(sub.$key);
        });
        this.dataService.deleteCardlist(this.item.$key);
        this.dataService.getCardLists().subscribe(function (p) {
            var carp = p.filter(function (cardlist) { return cardlist.projectId == (_this.item.projectId); });
            _this.resetOrder(carp);
        });
    };
    //Funcion para regular el desplegable
    CardListComponent.prototype.clickCarret = function (subcardlist) {
        subcardlist.isExpanded = !subcardlist.isExpanded;
        this.dataService.updateSubCardList(subcardlist.$key, { isExpanded: subcardlist.isExpanded });
    };
    CardListComponent.prototype.cardDropped = function (ev) {
        var card = ev.dragData;
        if (card.cardListId !== this.item.$key) {
            card.cardListId = this.item.$key;
            this.dataService.updateCard(card.$key, { cardListId: card.cardListId });
        }
    };
    //Permite el cambiar de sublista en el mismo cardlist
    CardListComponent.prototype.cardDropped2 = function (ev, subcardlist) {
        var card = ev.dragData;
        if (card.cardListId !== subcardlist.$key) {
            card.cardListId = subcardlist.$key;
            this.dataService.updateCard(card.$key, { cardListId: card.cardListId });
        }
        this.loadCardWithSublists();
    };
    CardListComponent.prototype.allowDragFunction = function (card) {
        return this.allowedDragTo;
    };
    CardListComponent.prototype.allowDropFunction = function () {
        var _this = this;
        return function (dragData) {
            return _this.allowedDropFrom.indexOf(dragData.cardListId) > -1;
        };
    };
    CardListComponent.prototype.addSubcardlists = function (name) {
        var created_at = new Date().toString();
        var newSubCardList = new subcardlist_info_1.SubCardList();
        newSubCardList.name = name;
        newSubCardList.cardlistId = this.item.$key;
        newSubCardList.order = this.subcardlists.length;
        newSubCardList.created_at = created_at;
        this.dataService.addSubCardList(newSubCardList);
    };
    CardListComponent.prototype.saveAddSubCardList = function () {
        this.addSubcardlists(this.subcardlistname);
        this.toShowAddSubCardList = false;
    };
    CardListComponent.prototype.showAddSubCardList = function () {
        this.subcardlistname = '';
        this.toShowAddSubCardList = true;
    };
    CardListComponent.prototype.cancelAddSubCardList = function () {
        this.toShowAddSubCardList = false;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", typeof (_a = typeof cardlist_info_1.CardList !== "undefined" && cardlist_info_1.CardList) === "function" && _a || Object)
    ], CardListComponent.prototype, "item", void 0);
    CardListComponent = __decorate([
        core_1.Component({
            selector: 'cardlist',
            templateUrl: './cardlist.component.html',
            styleUrls: ['./cardlist.component.css']
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof data_service_1.DataService !== "undefined" && data_service_1.DataService) === "function" && _b || Object, typeof (_c = typeof export_service_1.ExportService !== "undefined" && export_service_1.ExportService) === "function" && _c || Object])
    ], CardListComponent);
    return CardListComponent;
    var _a, _b, _c;
}());
exports.CardListComponent = CardListComponent;
//# sourceMappingURL=cardlist.component.js.map