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
var card_info_1 = require("app/models/card-info");
var task_info_1 = require("app/models/task-info");
var modal_1 = require("ng2-bootstrap/modal");
var CardComponent = (function () {
    function CardComponent(dataService, exportService) {
        this.dataService = dataService;
        this.exportService = exportService;
        //console.log(this.item);
    }
    CardComponent.prototype.ngOnInit = function () {
        var _this = this;
        //console.log(this.item);
        this.dataService.getTasksByCardId(this.item.$key)
            .subscribe(function (data) {
            _this.tasks = data;
        });
    };
    CardComponent.prototype.addNewTask = function () {
        var _this = this;
        //console.log('Add new subtask!');
        var newTask = new task_info_1.Task();
        newTask.cardId = this.item.$key;
        newTask.description = this.newtaskdesc;
        newTask.isCompleted = false;
        newTask.order = 0;
        newTask.created_at = new Date().toString();
        console.log(newTask.created_at);
        this.dataService.addTask(newTask)
            .then(function () {
            _this.newtaskdesc = '';
        });
        this.exportService.getJsonExport();
    };
    //elimina la tarea de la carta
    CardComponent.prototype.deleteTask = function (task) {
        //console.log(task);
        this.dataService.deleteTask(task.$key);
        //this.childModal.show();
        this.exportService.getJsonExport();
    };
    CardComponent.prototype.hideChildModal = function () {
        this.childModal.hide();
    };
    //Cambia el estado de la tarea si esta incompleta a completa y viceversa
    CardComponent.prototype.changeTaskCompleted = function (task) {
        //console.log(task);
        this.dataService.updateTask(task.$key, { isCompleted: task.isCompleted });
    };
    ////////////////////////////
    //Aqui primera intervencion.
    ////////////////////////////
    CardComponent.prototype.clickCarret = function () {
        this.item.isExpanded = !this.item.isExpanded;
        this.dataService.updateCard(this.item.$key, { isExpanded: this.item.isExpanded });
    };
    __decorate([
        core_1.ViewChild('childModal'),
        __metadata("design:type", modal_1.ModalDirective)
    ], CardComponent.prototype, "childModal", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", typeof (_a = typeof card_info_1.Card !== "undefined" && card_info_1.Card) === "function" && _a || Object)
    ], CardComponent.prototype, "item", void 0);
    CardComponent = __decorate([
        core_1.Component({
            selector: 'card',
            templateUrl: './card.component.html',
            styleUrls: ['./card.component.css']
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof data_service_1.DataService !== "undefined" && data_service_1.DataService) === "function" && _b || Object, typeof (_c = typeof export_service_1.ExportService !== "undefined" && export_service_1.ExportService) === "function" && _c || Object])
    ], CardComponent);
    return CardComponent;
    var _a, _b, _c;
}());
exports.CardComponent = CardComponent;
//# sourceMappingURL=card.component.js.map