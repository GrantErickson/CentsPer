export class Car{
    constructor(public name:string, public price:number, public miles: number){
  }
  
  public centsPerMile(lifetimeMiles: number = 200000): number{
    let result = (this.price / (lifetimeMiles - this.miles)) * 100;
    return Math.round(result * 100) / 100;
  }
}