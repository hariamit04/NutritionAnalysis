import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '@app/_models';
import { IngredientService } from '../_services/ingredient.service';
import { Ingredient } from '../_models/ingredient';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  loading = false;
  users: User[];
  ingredients: Ingredient[] = [];

  ingredientForm: FormGroup;
  enableAnalyseButton = false;
  submitted = false;
  returnUrl: string;
  error = '';
  ingredientsValueArray: string[];


  //constructor(private userService: UserService) { }
  constructor(private formBuilder: FormBuilder, private ingredientService: IngredientService, private router: Router) {
  }

  ngOnInit() {
    this.users = [JSON.parse(localStorage.getItem('currentUser'))];

    this.ingredientForm = this.formBuilder.group({
      ingredientsValue: ['', Validators.required]
    });
  }

  get f() { return this.ingredientForm.controls; }

  ingredientsValueKeyup(inputValue) {
    this.enableAnalyseButton = inputValue.length > 0;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.ingredientForm.invalid) {
      return;
    }

    this.loading = true;

    this.ingredientsValueArray = this.f.ingredientsValue.value.split('\n');

    this.ingredientsValueArray.map((currentelement, index) => {
      var ingredientsValue = currentelement.split('|');
      if (ingredientsValue.length != 3) {
        this.error = 'Line no. ' + (index + 1) + ' of Ingredient Value is not in correct format';
        this.loading = false;
        return;
      }
      this.ingredients.push({
        Name: ingredientsValue[0],
        Quantity: ingredientsValue[1],
        Unit: ingredientsValue[2]
      })
    });
    if (!this.loading)
      return;

    this.error = this.ingredientService.RecipeAnalysis(this.ingredients);
    this.loading = false;


    if (this.error.length <= 0) {
      this.router.navigate(['./summary'])
    }
  }
}
