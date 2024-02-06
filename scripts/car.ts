import type { MenuHTMLAttributes } from "vue";
import { CarOptions } from "./carOptions";
import { Series } from "./series";

export class Car {
  constructor(
    public year: number,
    public make: string,
    public model: string,
    public style: string,
    public price: number,
    public miles: number,
    public details: string,
    public color: string,
    public hotness: number = 10
  ) {}

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
    let result = this.price / (lifetimeMiles - this.miles);
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
    let milesSum = this.miles;
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
      vehicleCost.data.push(centsPerMile * milesPerYear);
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

    console.log(result);
    return result;
  }
}
