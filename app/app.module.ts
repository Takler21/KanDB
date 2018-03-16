import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { routing } from './app.routing';
import { UserService } from './Service/user.service';
import { AlertModule } from "ng2-bootstrap";
import { ModalModule } from 'ng2-bootstrap';
import { DndModule } from 'ng2-dnd';
import { ExportService } from "./shared/export.service";
import { DataService } from "./shared/data.service";
import { CardListComponent } from "./cardlist/cardlist.component";
import { CardComponent } from "./card/card.component";


@NgModule({
    imports: [BrowserModule, ReactiveFormsModule, HttpModule, routing, Ng2Bs3ModalModule, AlertModule.forRoot(), ModalModule.forRoot(), DndModule.forRoot()],
    declarations: [
                    AppComponent,
                    CardListComponent,
                    CardComponent
    ],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }, UserService, DataService, ExportService],
    bootstrap: [AppComponent]
})

export class AppModule { }