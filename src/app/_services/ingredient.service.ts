import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Ingredient, TotalIngredient } from '../_models/ingredient';

@Injectable({ providedIn: 'root' })
export class IngredientService {
  private currentUserSubject: BehaviorSubject<User>;
  private userdet: User;
  private ingredients: Ingredient[];
  public currentUser: Observable<User>;
  private recipe: any;
  totalIngredient: TotalIngredient;

  constructor(private http: HttpClient) {
    //this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    //this.currentUser = this.currentUserSubject.asObservable();
  }


  RecipeAnalysis(ingredientsValue: Ingredient[]): string {
    let errorstr: string = "";
    this.userdet = JSON.parse(localStorage.getItem('currentUser'))
    this.ingredients = ingredientsValue;

    this.ingredients.map((value, index) => {
      return this.http.get<any>('https://api.edamam.com/api/nutrition-data?app_id=' + this.userdet.app_id + '&app_key=' + this.userdet.app_key + '&ingr=' + value.Quantity + ' ' + value.Name + ' ' + value.Unit)
        .subscribe(
          data => {
            this.ingredients[index].Weight = data.totalWeight;
            this.ingredients[index].Calories = data.calories;
          },
          err => {
            errorstr = err.statusText;
          })

    })
    this.getingredientsList();
    return errorstr;

  }

  total() {
    let jsonObject = this.ingredients.map(value => { return value.Quantity + ' ' + value.Name + ' ' + value.Unit });
    //let json = JSON.stringify(jsonObject);
    this.recipe = {
      "title": "Ingredient Item List",
      "ingr": jsonObject
    }

    return this.http.post<any>('https://api.edamam.com/api/nutrition-details?app_id=' + this.userdet.app_id + '&app_key=' + this.userdet.app_key, this.recipe)
      .pipe(map(user => {
        //alert(JSON.stringify(user.totalNutrients.SUGAR.quantity));

        this.totalIngredient = {
          Calories: user.calories,
          Fat: user.totalDaily.FAT.quantity,
          Cholesterol: user.totalDaily.CHOLE.quantity,
          Sodium: user.totalDaily.NA.quantity,
          Carbohydrate: (user.totalDaily.FIBTG.quantity),
          Protein: user.totalDaily.PROCNT.quantity,
          Vitamin: user.totalDaily.VITA_RAE.quantity + user.totalDaily.VITC.quantity + user.totalDaily.VITB6A.quantity + user.totalDaily.VITB12.quantity
            + user.totalDaily.VITD.quantity + user.totalDaily.TOCPHA.quantity + user.totalDaily.VITK1.quantity,
          Calcium: user.totalDaily.CA.quantity,
          Iron: user.totalDaily.FE.quantity,
          Potassium: user.totalDaily.K.quantity
        }
        return this.totalIngredient;
      }));
  }

  getingredientsList(): Ingredient[] {
    return this.ingredients;
  }
}
