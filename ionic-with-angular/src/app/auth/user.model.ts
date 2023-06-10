export class User {

  constructor(
    public id: string,
    public email: string,
    private _token: string,
    public tokenExpirationDate: Date
  ) { }

  get token() {
    if(this.tokenExpirationDate && this.tokenExpirationDate > new Date()) {
      return this._token;
    }
    return null;
  }
}