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
var DataService = (function () {
    function DataService(af) {
        this.af = af;
        //console.log("DataService");
    }
    DataService.prototype.getProjects = function () {
        this.projects = this.af.database.list('/projects');
        return this.projects;
    };
    DataService.prototype.getProjectById = function (projectId) {
        return this.af.database.object("/projects/" + projectId);
    };
    DataService.prototype.addProject = function (project) {
        return this.projects.push(project);
    };
    DataService.prototype.deleteProject = function (key) {
        return this.projects.remove(key);
    };
    DataService.prototype.importProject = function (key, value) {
        this.af.database.object("/projects/" + key).update(value);
    };
    DataService.prototype.importCardlist = function (key, value) {
        this.af.database.object("/cardlist/" + key).update(value);
    };
    DataService.prototype.importCards = function (key, value) {
        this.af.database.object("/cards/" + key).update(value);
    };
    DataService.prototype.importSubcardlist = function (key, value) {
        this.af.database.object("/subcardlist/" + key).update(value);
    };
    DataService.prototype.importTasks = function (key, value) {
        this.af.database.object("/tasks/" + key).update(value);
    };
    DataService.prototype.getCardLists = function () {
        this.cardlists = this.af.database.list('/cardlist', {
            query: {
                orderByChild: 'order'
            }
        });
        return this.cardlists;
    };
    DataService.prototype.getCardListsById = function (cardListId) {
        return this.af.database.object("/cardlist/" + cardListId);
    };
    DataService.prototype.getCardListsByOrder = function (order) {
        var _cardlist = this.af.database.list('/cardlist', {
            query: {
                orderByChild: 'order',
                equalTo: order,
            }
        });
        return _cardlist;
    };
    DataService.prototype.getCachedCardListsById = function (cardListId) {
        return this.cardlists
            .filter(function (d) { return d.$key == cardListId; })
            .map(function (d) { return d.$key; });
    };
    DataService.prototype.getCardListsByProject = function (projectId) {
        var _cardlist = this.af.database.list('/cardlist', {
            query: {
                orderByChild: 'projectId',
                equalTo: projectId,
            }
        });
        return _cardlist;
    };
    DataService.prototype.addCardList = function (cardlist) {
        return this.cardlists.push(cardlist);
    };
    DataService.prototype.updateCardList = function (key, updCardlist) {
        return this.cardlists.update(key, updCardlist);
    };
    DataService.prototype.deleteCardlist = function (key) {
        return this.cardlists.remove(key);
    };
    DataService.prototype.addSubCardList = function (cardlist) {
        return this.subcardslists.push(cardlist);
    };
    DataService.prototype.updateSubCardList = function (key, updSubCardList) {
        return this.subcardslists.update(key, updSubCardList);
    };
    DataService.prototype.getSubCardList = function () {
        this.subcardslists = this.af.database.list('/subcardlist', {
            query: {
                orderByChild: 'order'
            }
        });
        return this.subcardslists;
    };
    DataService.prototype.deleteSubCard = function (key) {
        return this.subcardslists.remove(key);
    };
    DataService.prototype.getCards = function () {
        this.cards = this.af.database.list('/cards');
        return this.cards;
    };
    DataService.prototype.getSubCardListsByListId = function (listId) {
        this.subcardslists = this.af.database.list('/subcardlist', {
            query: {
                orderByChild: 'cardlistId',
                equalTo: listId,
            }
        });
        return this.subcardslists;
    };
    DataService.prototype.getSubCardListsById = function (subCardlistId) {
        return this.af.database.object("/subcardlist/" + subCardlistId);
    };
    DataService.prototype.getCardsById = function (cardId) {
        return this.af.database.object("/cards/" + cardId);
    };
    DataService.prototype.getCardsByListId = function (listId) {
        this.cards = this.af.database.list('/cards', {
            query: {
                orderByChild: 'cardListId',
                equalTo: listId,
            }
        });
        return this.cards;
    };
    DataService.prototype.addCard = function (card) {
        return this.cards.push(card);
    };
    DataService.prototype.updateCard = function (key, updCard) {
        return this.cards.update(key, updCard);
    };
    DataService.prototype.deleteCard = function (key) {
        return this.cards.remove(key);
    };
    DataService.prototype.getTasks = function () {
        this.tasks = this.af.database.list('/tasks');
        return this.cards;
    };
    DataService.prototype.getTaskById = function (taskId) {
        return this.af.database.object("/tasks/" + taskId);
    };
    DataService.prototype.getTasksByCardId = function (cardId) {
        var _tasks = this.af.database.list('/tasks', {
            query: {
                orderByChild: 'cardId',
                equalTo: cardId,
            }
        });
        return _tasks;
    };
    DataService.prototype.addTask = function (task) {
        return this.tasks.push(task);
    };
    DataService.prototype.updateTask = function (key, updTask) {
        return this.tasks.update(key, updTask);
    };
    DataService.prototype.deleteTask = function (key) {
        return this.tasks.remove(key);
    };
    DataService.prototype.exportJson = function () {
        var aux = window.URL.createObjectURL(Blob);
    };
    DataService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [typeof (_a = typeof angularfire2_1.AngularFire !== "undefined" && angularfire2_1.AngularFire) === "function" && _a || Object])
    ], DataService);
    return DataService;
    var _a;
}());
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map