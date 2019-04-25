import {AfterViewChecked, AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {PenduService} from '../services/pendu.service';
import {Subscription} from 'rxjs';
import {UserModel} from '../../../shared/models/user.model';
import {LoginService} from '../../login/services/login.service';

@Component({
  selector: 'app-pendu',
  templateUrl: './pendu.component.html',
  styleUrls: ['./pendu.component.sass'],
})
export class PenduComponent implements OnInit, OnDestroy {



  sub: Subscription;
  mots: string[] = [];
  randomMot: any;
  motMystere: any[] = [];
  tableauLettre: any[] = [];
  essai = 0;
  lettresTrouvees = 0;
  user: UserModel = new UserModel();
  perdu = false;
  gagne = false;
  partiesGagnees = 0;
  partiestotales = -1;

  constructor(
    // tslint:disable-next-line:variable-name
    private _penduService: PenduService,
    // tslint:disable-next-line:variable-name
    private _loginService: LoginService,
  ) { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.randomMot) {
      let compteur = 0
      this.tableauLettre.forEach((lettre, i) => {
        if (event.key === lettre) {
          compteur++;
          this.tableauLettre[i] = '▓';
          this.motMystere[i] = lettre;
          this.lettresTrouvees++;
        }
      });
      if (compteur === 0) {
        this.essai++;
        compteur = 0;
      }
      if (this.tableauLettre.length === this.lettresTrouvees) {
        this.gagne = true;
        this.partiesGagnees++;
      }
      if (this.essai >= 10) {
        this.essai = 10;
        this.perdu = true;
        this.tableauLettre = [];
      }
    }
  }

  ngOnInit() {
    this.sub = this._penduService.getListOfMots()
      .subscribe(res => {
        this.mots = res;
        this.randomizeMot();
      });
    this.sub = this._loginService.getUser()
      .subscribe((res: any) => {
        this.user = res;
      });
  }


    randomizeMot() {
    this.gagne = this.perdu = false;
    this.essai = 0;
    this.partiestotales++;
    this.motMystere = [];
    this.lettresTrouvees = 0;
    this.randomMot = this.mots[Math.floor(Math.random() * this.mots.length)];
    for (const lettre of this.randomMot.mot.split('')) {
      this.motMystere.push('?');
    }
    this.tableauLettre = this.randomMot.mot.split('');
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
