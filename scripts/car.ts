export class Car {
  constructor(
    public year: number,
    public make: string,
    public model: string,
    public style: string,
    public price: number,
    public miles: number,
    public location: string,
    public hotness: number = 100
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
      newCar.location,
      newCar.hotness
    );
    return car;
  }

  public centsPerMile(lifetimeMiles: number = 200000): number {
    let result =
      (this.price / (lifetimeMiles - this.miles)) *
      (100 + (100 - this.hotness));
    return Math.round(result * 100) / 100;
  }

  public get hotnessIcon() {
    if (this.hotness > 90) {
      return "🔥";
    } else if (this.hotness > 80) {
      return "😎";
    } else if (this.hotness > 70) {
      return "😀";
    } else if (this.hotness > 60) {
      return "🙂";
    } else if (this.hotness > 50) {
      return "😐";
    } else if (this.hotness > 40) {
      return "😕";
    } else if (this.hotness > 30) {
      return "😟";
    } else if (this.hotness > 20) {
      return "😢";
    } else if (this.hotness > 10) {
      return "😭";
    } else {
      return "💀";
    }
  }
}
