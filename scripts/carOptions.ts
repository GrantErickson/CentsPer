//import { Buffer } from "buffer";
import { parse } from "csv-parse/sync";

export class CarOptions {
  private static carData: Map<number, string[][]> = new Map();

  public readonly years: number[] = [
    // years 1992-2025
    1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003,
    2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015,
    2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
  ].sort((a, b) => b - a);

  public async getCarData(year: number): Promise<string[][]> {
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
    if (models.length === 1) {
      return JSON.parse(models[0]) as string[];
    }
    if (year && make && model) return ["Standard"];
    return [];
  }
}
