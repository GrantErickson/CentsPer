export class Reliability {
  constructor(
    public make: string,
    public rating: number,
    public perYearCost: number
  ) {}
}

export class ReliabilityResult {
  constructor(
    public make: string,
    public rating: string,
    public perYearCost: string,
  ) {}
}
