export class CreateUrlDto {
  private constructor(public readonly long_url: string) {}

  static create(props: { [key: string]: any }): [string?, CreateUrlDto?] {
    const { longUrl } = props;

    if (!longUrl || typeof longUrl !== "string") {
      return ["Long Url is required", undefined];
    }

    try {
      new URL(longUrl);
      return [undefined, new CreateUrlDto(longUrl.trim())];
    } catch {
      return ["Please provide a valid URL (e.g. https://example.com)", undefined];
    }
  }
}
