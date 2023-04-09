import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecipeDetailPage implements OnInit {

  recipe!: Recipe;

  constructor(
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipesService,
    private alertController: AlertController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const recipeId = paramMap.get('recipeId')!;
      this.recipe = this.recipeService.getRecipe(recipeId)!;
      
      if (!paramMap.has('recipeId') || this.recipe == null) {
        this.router.navigateByUrl('recipes');
      }
    })
  }

  deleteRecipe() {
    this.alertController.create({
      header: 'Are you sure?',
      message: 'Do you want to delete this recipe?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', handler: () => this.onDeleteHandler() }
      ]
    }).then((alertEl) => {
      alertEl.present();
    })
  }

  private onDeleteHandler() {
    this.recipeService.deleteRecipe(this.recipe.id);
    this.router.navigateByUrl('recipes');
  }

}
