export class Format {
  public static currency(value: number): string {
    return Number(value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  public static number(value: number): string {
    return Number(value).toLocaleString("en-US");
  }
}
