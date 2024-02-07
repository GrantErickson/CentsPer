import type { MenuHTMLAttributes } from "vue";
import { CarOptions, carOptions } from "./carOptions";
import { Series } from "./series";

export class Car {
  constructor(
    private _year: number,
    private _make: string,
    private _model: string,
    private _style: string,
    public price: number,
    public miles: number,
    public details: string,
    public color: string,
    public hotness: number = 10
  ) {}

  public get year(): number {
    return this._year;
  }
  public set year(value: number) {
    this._year = value;
    // See if the make is still valid
    carOptions.makes(this.year).then((makes: string[]) => {
      if (!makes.includes(this.make)) {
        this.make = this.make; // This will cause this to be set and continue the refresh.
      } else {
        this.make = "";
      }
    });
  }

  public get make(): string {
    return this._make;
  }
  public set make(value: string) {
    this._make = value;
    if (!this.make) {
      this.model = "";
    } else {
      // See if the model is still valid
      carOptions.model(this.year, this.make).then((models: string[]) => {
        if (!models.includes(this.model)) {
          this.model = this.model; // This will cause this to be set and continue the refresh.
        } else {
          this.model = "";
        }
      });
    }
  }

  public get model(): string {
    return this._model;
  }
  public set model(value: string) {
    this._model = value;
    if (!this.model) {
      this.style = "";
    } else {
      // See if the style is still valid
      carOptions
        .styles(this.year, this.make, this.model)
        .then((styles: string[]) => {
          if (styles.length === 1) {
            this.style = styles[0];
          } else if (!styles.includes(this.style)) {
            this.model = this.model; // This will cause this to be set and continue the refresh.
          } else {
            this.style = "";
          }
        });
    }
  }

  public get style(): string {
    return this._style;
  }
  public set style(value: string) {
    this._style = value;
  }

  public readonly key: string = Math.random().toString();

  public static deserialize(newCar: any) {
    let car = new Car(
      Number(newCar.year),
      newCar.make,
      newCar.model,
      newCar.style,
      Number(newCar.price),
      Number(newCar.miles),
      newCar.details,
      newCar.color,
      Number(newCar.hotness)
    );
    return car;
  }

  public centsPerMile(lifetimeMiles: number = 200000): number {
    let result = (this.price / (lifetimeMiles - this.miles)) * 100;
    return Math.round(result * 100) / 100;
  }

  public centsPerMileWithHotness(lifetimeMiles: number = 200000): number {
    let result =
      (this.price / (lifetimeMiles - this.miles)) * (10 + (10 - this.hotness));
    return Math.round(result * 100) / 10;
  }

  public get hotnessIcon() {
    if (this.hotness > 9) {
      return "🔥";
    } else if (this.hotness > 8) {
      return "😎";
    } else if (this.hotness > 7) {
      return "😀";
    } else if (this.hotness > 6) {
      return "🙂";
    } else if (this.hotness > 5) {
      return "😐";
    } else if (this.hotness > 4) {
      return "😕";
    } else if (this.hotness > 3) {
      return "😟";
    } else if (this.hotness > 2) {
      return "😢";
    } else if (this.hotness > 1) {
      return "😭";
    } else {
      return "💀";
    }
  }

  public get carIcon() {
    switch (this.style) {
      case "Van/Minivan":
        return "mdi-van-passenger";
      case "Pickup":
        return "mdi-car-pickup";
      case "SUV":
        return "mdi-car-estate";
      case "Hatchback":
        return "mdi-car-hatchback";
      case "Coupe":
        return "mdi-car-sports";
      default:
        return "mdi-car";
    }
  }

  public get uiColor() {
    if (!this.color) return "gray";
    switch (this.color.toLowerCase()) {
      case "red":
        return "red-darken-2";
      case "blue":
        return "blue";
      case "green":
        return "green";
      case "black":
        return "black";
      case "white":
        return "gray";
      case "silver":
        return "silver";
      case "gray":
        return "gray";
      case "gold":
        return "gold";
      case "brown":
        return "brown";
      case "yellow":
        return "yellow";
      case "orange":
        return "orange";
      case "purple":
        return "purple";
      case "pink":
        return "pink";
      default:
        return this.color.toLowerCase() + "-darken-2";
    }
  }

  public carLifetimeGraph(
    maxMiles: number = 200000,
    milesPerYear: number = 15000
  ): Series[] {
    // Create ApexChart data
    // For each year of the car's lifetime until maxMiles
    let result: Series[] = [];
    const vehicleCost = new Series("Purchase");
    result.push(vehicleCost);
    const repairs = new Series("Repairs");
    result.push(repairs);
    const maintenance = new Series("Maintenance");
    result.push(maintenance);
    const fuel = new Series("Fuel");
    //result.push(fuel);
    const insurance = new Series("Insurance");
    //result.push(insurance);

    // loop until maxMiles is reached with milesPerYear each year
    let year = 0;
    let milesSum = Number(this.miles);
    let centsPerMile = this.centsPerMile(maxMiles);
    let hundredThousand: boolean = this.miles > 100000;
    const hundredThousandHit = 0.4;

    const repairYearly = 1000;
    const maintenanceYearly = 200;
    const insuranceYearly = 500;
    const fuelCostPerMile = 0.11;

    do {
      year++;
      milesSum += milesPerYear;
      let yearlyPurchase = Math.round((centsPerMile / 100) * milesPerYear);
      vehicleCost.data.push(yearlyPurchase);
      let repairFactor = 0;
      if (milesSum <= 30000) repairFactor += 0.05;
      else if (milesSum <= 60000) repairFactor += 0.15;
      else if (milesSum <= 80000) repairFactor += 0.25;
      else if (milesSum <= 100000) repairFactor += 0.3;
      else if (milesSum <= 120000) repairFactor += 0.4;
      else if (milesSum <= 140000) repairFactor += 0.5;
      else if (milesSum <= 160000) repairFactor += 0.6;
      else if (milesSum <= 180000) repairFactor += 0.7;
      else if (milesSum <= 200000) repairFactor += 0.8;
      else if (milesSum <= 220000) repairFactor += 0.8;
      else repairFactor += 1.0;

      if (milesSum > 100000 && !hundredThousand) {
        repairFactor += hundredThousandHit;
        hundredThousand = true;
      }
      repairs.data.push(repairFactor * repairYearly);
      maintenance.data.push(maintenanceYearly);
      fuel.data.push(fuelCostPerMile * milesPerYear);
      insurance.data.push(insuranceYearly);
    } while (milesSum < maxMiles);

    return result;
  }
}
