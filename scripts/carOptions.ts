//import { Buffer } from "buffer";
import { parse } from "csv-parse/sync";
import { ReliabilityResult, Reliability } from "./reliability";
import { Format } from "./format";
import { reactive } from "vue";

export class CarOptions {
  private static carData: Map<number, string[][]> = new Map();
  private static reliabilityData: Reliability[] = [];

  private _maxMiles: number;
  private _milesPerYear: number;
  public _showGraphCumulative: boolean;

  public isLoading: boolean = true;

  public constructor() {
    this._maxMiles = Number(localStorage.getItem("maxMiles") || 200000);
    this._milesPerYear = Number(localStorage.getItem("milesPerYear") || 15000);
    this._showGraphCumulative =
      localStorage.getItem("showGraphCumulative") === "true";
  }

  public get maxMiles(): number {
    return this._maxMiles;
  }
  public set maxMiles(value: number) {
    this._maxMiles = Number(value);
    localStorage.setItem("maxMiles", this._maxMiles.toString());
  }

  public get milesPerYear(): number {
    return this._milesPerYear;
  }
  public set milesPerYear(value: number) {
    this._milesPerYear = Number(value);
    localStorage.setItem("milesPerYear", this._milesPerYear.toString());
  }

  public get showGraphCumulative(): boolean {
    return this._showGraphCumulative;
  }
  public set showGraphCumulative(value: boolean) {
    this._showGraphCumulative = value;
    localStorage.setItem(
      "showGraphCumulative",
      this._showGraphCumulative.toString()
    );
  }

  public readonly years: number[] = [
    // years 1992-2025
    1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003,
    2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
    2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
  ].sort((a, b) => b - a);

  public readonly colors: string[] = [
    "",
    "Red",
    "Blue",
    "Light-Blue",
    "Cyan",
    "Teal",
    "Green",
    "Light-Green",
    "Lime",
    "Black",
    "White",
    "Silver",
    "Gray",
    "Blue-Gray",
    "Brown",
    "Yellow",
    "Amber",
    "Orange",
    "Deep-Orange",
    "Purple",
    "Pink",
    "Indigo",
  ].sort((a, b) => a.localeCompare(b));

  public async loadReliabilityData(): Promise<void> {
    CarOptions.reliabilityData = [];
    const response = await fetch(`/reliability.csv`);
    const csv = await response.text();
    var data = parse(csv);
    data.splice(0, 1); // remove the header row
    for (let row of data) {
      var reliability = new Reliability(row[0], Number(row[1]), Number(row[2]));
      CarOptions.reliabilityData.push(reliability);
    }
    this.isLoading = false;
  }

  public getReliability(make: string) {
    if (make) {
      var reliability = CarOptions.reliabilityData.find(
        (item) => item.make.toLowerCase() === make.toLocaleLowerCase()
      );
      if (reliability) {
        return new ReliabilityResult(
          make,
          Format.number(reliability.rating) + "/100",
          Format.currency(reliability.perYearCost)
        );
      }
    }
    return new ReliabilityResult(make, "Unknown", "Unknown");
  }

  public async getCarData(year: number): Promise<string[][]> {
    if (year < 1992) return [];
    if (CarOptions.carData.has(year)) {
      return CarOptions.carData.get(year)!;
    }
    const response = await fetch(`/cars/${year}.csv`);
    const csv = await response.text();
    var data = parse(csv);
    data.splice(0, 1); // remove the header row
    CarOptions.carData.set(year, data);
    return data;
  }

  public async makes(year: number): Promise<string[]> {
    const data = await this.getCarData(year);
    const unique: string[] = [
      ...new Set<string>(data.map((item: string[]) => item[1] as string)),
    ];
    return unique;
  }

  public async models(year: number, make: string): Promise<string[]> {
    const data = await this.getCarData(year);
    const models = data
      .filter((item: string[]) => item[1] === make)
      .map((item: string[]) => item[2] as string);
    return models;
  }

  public async styles(
    year: number,
    make: string,
    model: string
  ): Promise<string[]> {
    const data = await this.getCarData(year);
    const models = data
      .filter((item: string[]) => item[1] === make && item[2] === model)
      .map((item: string[]) => item[3] as string);
    if (models.length === 1 && models[0]) {
      return JSON.parse(models[0]) as string[];
    }
    if (year && make && model) return ["Standard"];
    return [];
  }
}

export const carOptions = reactive(new CarOptions());
