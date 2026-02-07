export class CreateUrlDto {
  private constructor(
    public readonly long_url: string,
    public readonly short_url: string,
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateUrlDto?] {
    const { longUrl, shortUrl } = props;

    if (!longUrl) return ["Long Url is required", undefined];
    if (!shortUrl) return ["Short Url is required", undefined];

    return [undefined, new CreateUrlDto(longUrl, shortUrl)];
  }
}
