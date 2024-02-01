export class Car {
  constructor(
    public name: string,
    public price: number,
    public miles: number
  ) {}

  public readonly key: string = Math.random().toString();

  public static deserialize(newCar: any) {
    let car = new Car(newCar.name, newCar.price, newCar.miles);
    return car;
  }

  public centsPerMile(lifetimeMiles: number = 200000): number {
    let result = (this.price / (lifetimeMiles - this.miles)) * 100;
    return Math.round(result * 100) / 100;
  }
}
