import {Component, OnInit, Input, ViewChild} from "@angular/core";
import { DataService } from "../shared/data.service";
import { ExportService } from "../shared/export.service";
import {Observable} from "rxjs";
import {CardList} from "../models/cardlist-info";
import {Card} from "../models/card-info";
import {Task} from "../models/task-info";
import { ModalDirective } from 'ng2-bootstrap/modal';
import { Global } from '../Shared/global';
import { UserService } from "../Service/user.service"


@Component({
    selector: 'card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
    @ViewChild('childModal') public childModal:ModalDirective;
    @Input() item: Card;
    tasks : Task[]

    newtaskdesc;


    constructor(private _userService: UserService, private exportService: ExportService) {
        //console.log(this.item);
    }

    ngOnInit() {
        //console.log(this.item);
        this.filterTasks();
    }

    filterTasks() {
        this._userService.get(Global.BASE_TASKS_ENDPOINT)
            .subscribe(c => {
                this.tasks = c.filter(tasks => tasks.cardId == this.item.Id);
            });
    }

    addNewTask(){
        //console.log('Add new subtask!');
        let newTask = new Task();
        newTask.cardId = this.item.Id;
        newTask.description = this.newtaskdesc;
        newTask.isCompleted = false;
        newTask.order = 0;
        newTask.created_at = new Date().toString();
        console.log(newTask.created_at);
        this._userService.post(Global.BASE_TASKS_ENDPOINT, newTask)
            .finally(() => {
                this.newtaskdesc = '';
            });
        //this.exportService.getJsonExport();
    }
    //elimina la tarea de la carta
    deleteTask(task){
        //console.log(task);
        this._userService.delete(Global.BASE_TASKS_ENDPOINT, task.Id);
        //this.childModal.show();
        this.exportService.getJsonExport();
    }

    public hideChildModal():void {
        this.childModal.hide();
    }
    //Cambia el estado de la tarea si esta incompleta a completa y viceversa
    changeTaskCompleted(task){
        //console.log(task);
        //task.isCompleted = !task.isCompleted;
        this._userService.put(Global.BASE_TASKS_ENDPOINT, task.Id, task);
    }
    ////////////////////////////
    //Aqui primera intervencion.
    ////////////////////////////
    clickCarret(){
        this.item.isExpanded = !this.item.isExpanded;
        this._userService.put(Global.BASE_CARDS_ENDPOINT, this.item.Id, this.item);
    }
}
