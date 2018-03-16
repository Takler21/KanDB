import { Component, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "./shared/data.service";
import { ExportService } from "./shared/export.service";
import { UserService } from "./Service/user.service"
import { Observable } from "rxjs";

import { Project } from "./models/project-info";
import { CardList } from "./models/cardlist-info";
import { Card } from "./models/card-info";
import { DBOperation } from './Shared/enum';
import { Global } from './Shared/global';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    @ViewChild('fileImportInput')
    fileImportInput: any;
    msg;
    title = 'The Kanban Board';
    //
    projects: Project[];
    //
    cardlists: CardList[];
    //
    projectSelected: Project;
    projectname;
    cardlistname: string;
    cardlistcolor: string;
    cardlistorder: number;
    toShowAddProject: boolean;
    toShowAddCardList: boolean;
    downloadJsonHref;
    importado;
    css_color_names = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];


    constructor(private _userService: UserService,
        private sanitizer: DomSanitizer, private exportService: ExportService) {
    }

    ngOnInit() {
        
        this._userService.get(Global.BASE_PROJECT_ENDPOINT)
            .subscribe(projects => {
                this.projects = projects;
                //tal vez meter aqui el LoadIds()
            },
            error => this.msg = <any>error,
            () => {
                this.projectSelected = this.projects[0];
                this.filterCardLists();
            });
    }
    //Filtra las tareas por los cardlist segun el projecto al que pertenezcan.
    filterCardLists() {
        this._userService.get(Global.BASE_CARDLIST_ENDPOINT)
            .subscribe(c => {
                this.cardlists = c;
                this.cardlists = this.cardlists.filter(cardlist => cardlist.projectId == this.projectSelected.Id);
            })
            ;
    }


    //generateDownloadJsonUri() {
    //    this.resetOrder();
    //    this.exportService.setJsonExport();
    //    var theJSON = this.exportService.resJsonResponse;
    //    var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
    //    this.downloadJsonHref = uri;
    //}

    //Actualiza los valores despues de importar el JSON
    //fileChangeListener($event) {
    //    let reader = new FileReader();

    //    if ($event.target.files && $event.target.files.length > 0) {
    //        var file = $event.target.files[0];

    //        //Asi conseguimos el JSON aunque sea en string.
    //        reader.readAsText(file);

    //        //A veces no actualiza correctamente el navegador,
    //        //por lo que usaremos estas variables para gestionar eso.
    //        let projlength = this.projects.length;
    //        let selc = this.projectSelected;

    //        reader.onload = () => {
    //            this.importado = reader.result;
    //            this.importado = JSON.parse(this.importado);
    //            Object.keys(this.importado.projects).forEach(project => {
    //                this.dataService.importProject(project, {
    //                    "created_at": this.importado.projects[project].created_at,
    //                    "name": this.importado.projects[project].name
    //                })
    //            });

    //            Object.keys(this.importado.cardlist).forEach(caList => {
    //                if (this.dataService.getProjectById(this.importado.cardlist[caList].projectId)) {
    //                    this.dataService.importCardlist(caList, {
    //                        "color": this.importado.cardlist[caList].color,
    //                        "name": this.importado.cardlist[caList].name,
    //                        "projectId": this.importado.cardlist[caList].projectId,
    //                        "order": this.importado.cardlist[caList].order,
    //                        "created_at": this.importado.cardlist[caList].created_at
    //                    });
    //                }
    //            });

    //            Object.keys(this.importado.subcardlist).forEach(sub => {
    //                if (this.dataService.getCardListsById(this.importado.subcardlist[sub].cardlistId)) {
    //                    this.dataService.importSubcardlist(sub, {
    //                        "cardlistId": this.importado.subcardlist[sub].cardlistId,
    //                        "name": this.importado.subcardlist[sub].name,
    //                        "order": this.importado.subcardlist[sub].order,
    //                        "created_at": this.importado.subcardlist[sub].created_at
    //                    });
    //                }
    //            });

    //            Object.keys(this.importado.cards).forEach(ca => {
    //                if (this.dataService.getCardListsById(this.importado.cards[ca].cardListId) || this.dataService.getSubCardListsById(this.importado.cards[ca].cardListId)) {
    //                    this.dataService.importCards(ca, {
    //                        "description": this.importado.cards[ca].description,
    //                        "cardListId": this.importado.cards[ca].cardListId,
    //                        "name": this.importado.cards[ca].name,
    //                        "isExpanded": this.importado.cards[ca].isExpanded,
    //                        "order": this.importado.cards[ca].order,
    //                        "created_at": this.importado.cards[ca].created_at
    //                    });
    //                }
    //            });

    //            Object.keys(this.importado.tasks).forEach(ta => {
    //                if (this.dataService.getCardsById(this.importado.tasks[ta].cardId)) {
    //                    this.dataService.importTasks(ta, {
    //                        "description": this.importado.tasks[ta].description,
    //                        "isCompleted": this.importado.tasks[ta].isCompleted,
    //                        "cardId": this.importado.tasks[ta].cardId,
    //                        "order": this.importado.tasks[ta].order,
    //                        "created_at": this.importado.tasks[ta].created_at
    //                    });
    //                }
    //            });
    //            if (projlength == this.projects.length) {
    //                this.dataService.getProjects().subscribe(data => {
    //                    this.projects = data;

    //                });
    //            }
    //            this.projectSelected = selc;
    //        };
    //    }
    //}

    loadProjects() {
        this._userService.get(Global.BASE_PROJECT_ENDPOINT)
            .subscribe(projects => {
                this.projects = projects;
                //tal vez meter aqui el LoadIds()
            },
            error => this.msg = <any>error,
            () => this.loadCardlists()
        );
    }

    loadCardlists() {
        this._userService.get(Global.BASE_CARDLIST_ENDPOINT)
            .subscribe(cardlist => {
                this.cardlists = cardlist;
                //tal vez meter aqui el LoadIds()
            },
            error => this.msg = <any>error,
            () => this//Deberiamos poner algo aqui?
            );
    }

    addProject(name: string) {
        let created_at = new Date().toString();
        let newProject: Project = new Project();
        newProject.name = name;
        newProject.created_at = created_at;
        this._userService.post(Global.BASE_PROJECT_ENDPOINT, newProject);

    }

    //Es aqui donde se obtendra el indice o por lo menos aqui tambien.
    deleteProject() {
        //this.resetOrder();
        var cards: Card[]
        this._userService.get(Global.BASE_CARDS_ENDPOINT)
            .subscribe(cds => {
                cards = cds
            },
            error => this.msg = <any>error,
            () => {
                this.cardlists.forEach(crdsList => {
                    cards.filter(card => card.cardListId == crdsList.Id)
                        .forEach(card => {
                            this._userService.delete(Global.BASE_CARDS_ENDPOINT, card.Id);
                        })
                });
                this._userService.delete(Global.BASE_PROJECT_ENDPOINT, this.projectSelected.Id)
                this.loadProjects();
            }
            );
    }
    //Al realizar algun cambio usaremos esta funcion para que el orden 
    //de los cardlist sean numeros consecutivos
    //resetOrder() {
    //    let ord = 0;
    //    this.cardlists.forEach(c => {
    //        if (c.order != ord)
    //            this.dataService.updateCardList(c.Id, { order: ord })
    //        ord++;
    //    })
    //}

    addCardList(
        name: string,
        projectId: number,
        color: string,
        order: number) {
        let created_at = new Date().toString();
        let newCardList: CardList = new CardList();
        newCardList.name = name;
        newCardList.projectId = projectId;
        newCardList.color = color;
        newCardList.order = order;
        newCardList.created_at = created_at;
        this._userService.post(Global.BASE_CARDLIST_ENDPOINT, newCardList).subscribe(
            data => {
                //Alternativa!

                if (data == 1) //Success
                {
                    this.msg = "Cardlist añadido correctamente.";
                    this.filterCardLists();
                }
                else {
                    this.msg = "Hay problemas para guardar los datos!"
                }
            },
            error => {
                this.msg = error;
            });
    }

    saveAddProject() {
        this.addProject(this.projectname);
        this.toShowAddProject = false;
    }

    saveAddCardList() { 
        //this.resetOrder(); 
        this.cardlists.forEach(cardlist => { 
            if (cardlist.order >= this.cardlistorder) { 
                cardlist.order = cardlist.order + 1; 
                this._userService.put(Global.BASE_CARDLIST_ENDPOINT, cardlist.Id, cardlist); 
            } 
        }) 
        this.addCardList(this.cardlistname, this.projectSelected.Id,
            this.cardlistcolor, this.cardlistorder); 
        this.toShowAddCardList = false; 
    }

    styles() {
        let sty = `width:${100 / this.cardlists.length}%; float: left`;
        return this.sanitizer.bypassSecurityTrustStyle(sty);
    }
    //Mostrar modal project
    showAddProject() {
        this.projectname = '';
        this.toShowAddProject = true;
    }
    //Ocultar modal project
    cancelAddProject() {
        this.toShowAddProject = false;
    }
    //Mostrar modal cardlist
    showAddCardList() {
        this.cardlistname = '';
        this.cardlistcolor = '';
        this.cardlistorder = this.cardlists.length;
        this.toShowAddCardList = true;
    }
    //Ocultar modal cardlist
    cancelAddCardList() {
        this.toShowAddCardList = false;
    }
    //Aqui en el indice para el delete.
    //y despues de eso habria que sacar los cardlist del nuevo project
    onChange(val) {
        this.projectSelected = val;
        //this.exportService.projectExp = val;
        this.filterCardLists();
       // this.exportService.setJsonExport();
    }

}
