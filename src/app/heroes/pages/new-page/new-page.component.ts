import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogeComponent } from '../../components/confirm-dialoge/confirm-dialoge.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id:               new FormControl(''),
    superhero:        new FormControl<string>('', { nonNullable:true }),
    publisher:        new FormControl<Publisher>(Publisher.MarvelComics),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ]

  constructor(private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog ){}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.heroesService.getHeroById(id)),
    ).subscribe(hero=>{
      if(!hero) return this.router.navigateByUrl('/');

      this.heroForm.reset(hero);
      return;

    })
  }

  get currentHero():Hero{
    const hero = this.heroForm.value as Hero;

    return hero;
  }

  onSubmit():void{

    if(this.heroForm.invalid) return;
    // this.heroesService.updateHero()

    if(this.currentHero.id){
      this.heroesService.updateHero(this.currentHero).subscribe(hero => {
        this.showSnackBar(`${hero.superhero} updated  :)`);
      });
      return;
    }
    this. heroesService.addHero(this.currentHero).subscribe(hero => {
      this.router.navigate(['/heroes/edit/',hero.id]);
      this.showSnackBar(`${hero.superhero} created  :)`);

    })
  }

  onDeleteHero(){
    if(!this.currentHero.id) throw Error('Hero is is required');

      const dialogRef = this.dialog.open(ConfirmDialogeComponent, {
        data: {name: this.heroForm.value},
      });

      dialogRef.afterClosed()
      .pipe(
        filter((result:boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted:boolean) => wasDeleted)
      )
      .subscribe(result => {
        this.router.navigate(['/heroes']);
      })

      // dialogRef.afterClosed().subscribe(result => {
      //   console.log('The dialog was closed');
      //   if(!result) return;
      //   this.heroesService.deleteHeroById(this.currentHero.id)
      //   .subscribe( wasDeleted => {
      //     if ( wasDeleted)
      //     this.router.navigate(['/heroes'])
      //   } );
      // });

  }

  showSnackBar(message : string):void{
    this.snackbar.open(message, 'done',{
      duration: 1500,
    })
  }

}
