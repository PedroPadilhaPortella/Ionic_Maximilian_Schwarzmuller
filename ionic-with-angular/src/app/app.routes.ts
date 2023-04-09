import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'recipes',
    children: [
      {
        path: '',
        loadComponent: () => import('./recipes/recipes.page')
          .then((p) => p.RecipesPage),
      },
      {
        path: ':recipeId',
        loadComponent: () => import('./recipes/recipe-detail/recipe-detail.page')
          .then((p) => p.RecipeDetailPage),
      },
    ]
  },
  {
    path: '',
    redirectTo: 'recipes',
    pathMatch: 'full',
  },
];
