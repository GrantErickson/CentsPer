export class Car{
    constructor(public name:string, public price:number, public miles: number){
  }
  
  public centsPerMile(lifetimeMiles: number = 200000): number{
    return (this.price / (lifetimeMiles - this.miles)) * 100;
  }
}