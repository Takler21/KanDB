import { Component, OnInit, Input } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { DataService } from "../shared/data.service";
import { ExportService } from "../shared/export.service";
import { Observable } from "rxjs";
import { CardList } from "../models/cardlist-info";
import { SubCardList } from "../models/subcardlist-info";
import { Card } from "../models/card-info";
import { Task } from "../models/task-info";

import { Global } from '../Shared/global';
import { UserService } from "../Service/user.service"

@Component({
    selector: 'cardlist',
    templateUrl: './cardlist.component.html',
    styleUrls: ['./cardlist.component.css']
})
export class CardListComponent implements OnInit {
    @Input() item: CardList;
    msg;
    existSub: boolean;
    cardlistEmpty: boolean;
    cards: Card[]
    subcardlists: SubCardList[];
    fatherIdCard: number;
    toShowAddCard: boolean;
    editCard: Card;

    subcardlistname: string;
    toShowAddSubCardList: boolean;

    cardname;
    carddescription;
    allowedDropFrom = [];
    allowedDragTo = false;


    constructor(private _userService: UserService, private exportService: ExportService) {
    }

    ngOnInit() {
        this._userService.get(Global.BASE_SUBCARDLIST_ENDPOINT)
            .subscribe(s => {
                //filter aqui.
                this.subcardlists = s.filter(subcardlist => subcardlist.cardlistId == this.item.Id);//resultado del filtrado
                this.existSub = this.subcardlists.length != 0;
                //En desarrollo.
                //Esto en el complete()
                
            },
            error => this.msg = error,
            () => {
                if (!this.existSub) {
                    this._userService.get(Global.BASE_CARDS_ENDPOINT)
                        .subscribe(data => {
                            this.cards = data.filter(cards => cards.cardlistId == this.item.Id);
                            if (this.cards.length == 0)
                                this.cardlistEmpty = true
                            else
                                this.cardlistEmpty = false;
                            //this.exportService.getJsonExport();
                        });
                }
                else {
                    this.loadCardWithSublists();
                }
            }
        );

        //fill allowed drop-from containers

        //Usar item para el id del proyecto, con el que sacar 
        //los card list y filtrar o lo que sea por orden.
        //luego comprobar si el siguiente tiene subcardlist
        this.allowedDropFrom = [];
        this._userService.get(Global.BASE_CARDLIST_ENDPOINT).subscribe(p => {
            let carp = p.filter(cardlist => cardlist.projectId == (this.item.projectId))
            this.allowedDropFrom = [];
            carp.forEach(p1 => {
                if (p1.order == this.item.order - 1)
                    this.allowedDropFrom.push(p1.Id);
                //Hasta aqui permite el pase de cardlist normales
            });
            //Add subcardlists keys to allowedDropFrom variable.
            this.dataService.getSubCardListsByListId(this.allowedDropFrom[0])
                .subscribe(data => {
                    if (data.length > 0 && this.item.order != 0)
                        data.forEach(sub => {
                            this.allowedDropFrom.push(sub.Id);
                        })
                })
            //Let change card between subcardlist in the same card list
            if (this.subcardlists && this.subcardlists.length > 0) {
                this.subcardlists.forEach(sub => {
                    this.allowedDropFrom.push(sub.Id);
                }
                );
            }
        });
        //fill if it has next containers
        //filtrar por order.
        this.dataService.getCardListsByOrder(this.item.order + 1)
            .subscribe(d => {
                if (d.length > 0)
                    this.allowedDragTo = true;
            }
            );
    }

    loadCardWithSublists() {
        //El !this.cards tiene algun sentido?
        if (!this.cards || this.existSub)
            this.cards = [];
        this.subcardlists.forEach(sub => {
            if (this.allowedDropFrom.indexOf(sub.Id))
                this.allowedDropFrom.push(sub.Id);

            /////mejorar forma.
            this._userService.get(Global.BASE_CARDS_ENDPOINT)
                .subscribe(data => {
                    let cardsFiltered = data.filter(cards => cards.cardListId == sub.Id);
                    let aux = [];

                    //cardsFiltered por cards.
                    this.cards.forEach(c => {
                        aux[c.Id] = c.Id;
                    });
                    cardsFiltered.forEach(d => {
                        if (!aux[d.Id]) {
                            this.cards.push(d);
                        }
                    })
                });

            /////
        })
    }

    showAddCard(id) {
        this.cardname = '';
        this.carddescription = '';
        this.toShowAddCard = true;
        this.fatherIdCard = id;
    }

    cancelAddCard() {
        this.toShowAddCard = false;
    }

    saveAddCard() {
        //console.log('save card');
        this.addCard(
            this.cardname,
            this.carddescription,
            true,
            this.fatherIdCard,
            0);
        if (this.subcardlists) {
            this.loadCardWithSublists();
        }
        this.toShowAddCard = false;
    }

    //resetOrder(cardli) {
    //    let ord = 0;
    //    cardli.forEach(c => {
    //        //console.log(c.order);
    //        if (c.order != ord)
    //            //console.log(c.order)
    //            this.dataService.updateCardList(c.Id, { order: ord })
    //        ord++;
    //    })
    //}

    addCard(
        name: string,
        description: string,
        isExpanded: boolean,
        cardListId: number,
        order: number
    ) {
        let created_at = new Date().toString();
        let newCard: Card = new Card();
        newCard.name = name;
        newCard.description = description;
        newCard.cardListId = cardListId;
        newCard.isExpanded = isExpanded;
        newCard.order = order;
        newCard.created_at = created_at;
        this._userService.post(Global.BASE_CARDS_ENDPOINT, newCard);
    }

    deleteCard(card) {
        this._userService.delete(Global.BASE_CARDS_ENDPOINT, card.Id);
                
        this.loadCardWithSublists();
    }
    //ya tengo cards por lo que otro subcribe seria innecesario, me vale con recorre el arra

    deleteSublist(subc) {

        this._userService.delete(Global.BASE_SUBCARDLIST_ENDPOINT, subc.Id)
        //ver que hacer con esto
        this.loadCardWithSublists();
    }

    deleteCardlist() {
        let tasks;
        this.cards.forEach(c => {
            this._userService.delete(Global.BASE_CARDS_ENDPOINT, c.Id)
                });
        this.subcardlists.forEach(sub => {
            this._userService.delete(Global.BASE_SUBCARDLIST_ENDPOINT, sub.Id);
        })
        this._userService.delete(Global.BASE_CARDLIST_ENDPOINT, this.item.Id);
        //puede que aqui tenga problemas de sincronizacion, esto puede
        //que tenga que llevarlo fuera.
        //this.dataService.getCardLists().subscribe(p => {
        //    var carp = p.filter(cardlist => cardlist.projectId == (this.item.projectId))
            //this.resetOrder(carp);
        //});
    }
    //Funcion para regular el desplegable
    clickCarret(subcardlist) {
        subcardlist.isExpanded = !subcardlist.isExpanded;
        this._userService.put(Global.BASE_SUBCARDLIST_ENDPOINT, subcardlist.Id, subcardlist);
    }

    cardDropped(ev) {
        let card: Card = ev.dragData;
        if (card.cardListId !== this.item.Id) {
            card.cardListId = this.item.Id;
            this._userService.put(Global.BASE_CARDS_ENDPOINT, card.Id, card);
        }
    }
    //Permite el cambiar de sublista en el mismo cardlist
    cardDropped2(ev, subcardlist) {
        let card: Card = ev.dragData;
        if (card.cardListId !== subcardlist.Id) {
            card.cardListId = subcardlist.Id;
            this._userService.put(Global.BASE_CARDS_ENDPOINT, card.Id, card);
        }
        this.loadCardWithSublists();
    }

    allowDragFunction(card: Card) {
        return this.allowedDragTo;
    }

    allowDropFunction(): any {
        return (dragData: Card) => {
            return this.allowedDropFrom.indexOf(dragData.cardListId) > -1;
        };
    }

    addSubcardlists(
        name: string) {
        let created_at = new Date().toString();
        let newSubCardList: SubCardList = new SubCardList();
        newSubCardList.name = name;
        newSubCardList.cardlistId = this.item.Id;
        newSubCardList.order = this.subcardlists.length;
        newSubCardList.created_at = created_at;
        this._userService.post(Global.BASE_SUBCARDLIST_ENDPOINT, newSubCardList);
    }

    saveAddSubCardList() {
        this.addSubcardlists(this.subcardlistname);
        this.toShowAddSubCardList = false;

    }

    showAddSubCardList() {
        this.subcardlistname = '';
        this.toShowAddSubCardList = true;
    }

    cancelAddSubCardList() {
        this.toShowAddSubCardList = false;
    }

}
