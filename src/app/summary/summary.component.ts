import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '@app/_models';
import { IngredientService } from '../_services/ingredient.service';
import { Ingredient, TotalIngredient } from '../_models/ingredient';

@Component({ templateUrl: 'summary.component.html' })
export class SummaryComponent implements OnInit {
  loading = false;
  users: User[];
  ingredients: Ingredient[] = [];
  totalIngredient: TotalIngredient;

  enableAnalyseButton = false;
  submitted = false;
  returnUrl: string;
  error = '';
  ingredientsValueArray: string[];

  constructor(private ingredientService: IngredientService, private router: Router) {
  }

  ngOnInit() {
    this.users = [JSON.parse(localStorage.getItem('currentUser'))];
    this.ingredients = this.ingredientService.getingredientsList();
  }

  total() {
    this.loading = true;
    this.ingredientService.total()
      .subscribe(
        data => {
          //alert(JSON.stringify(data));
          this.totalIngredient = data;
          this.loading = false;
        },
        error => {
          alert(JSON.stringify(error));
          this.error = error.statusText;
          this.loading = false;
        });

  }

}

