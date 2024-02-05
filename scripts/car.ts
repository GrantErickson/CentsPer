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
      newCar.year,
      newCar.make,
      newCar.model,
      newCar.style,
      newCar.price,
      newCar.miles,
      newCar.details,
      newCar.color,
      newCar.hotness
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
}
