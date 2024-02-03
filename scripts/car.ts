export class Car {
  constructor(
    public make: string,
    public model: string,
    public year: number,
    public price: number,
    public miles: number,
    public location: string,
    public hotness: number = 100
  ) {}

  public readonly key: string = Math.random().toString();

  public static deserialize(newCar: any) {
    let car = new Car(
      newCar.make,
      newCar.model,
      newCar.year,
      newCar.price,
      newCar.miles,
      newCar.location,
      newCar.hotness
    );
    return car;
  }

  public centsPerMile(lifetimeMiles: number = 200000): number {
    let result = (this.price / (lifetimeMiles - this.miles)) * (100 + (100-this.hotness));
    return Math.round(result * 100) / 100;
  }
}
