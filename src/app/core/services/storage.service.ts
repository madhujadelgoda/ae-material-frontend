export class StorageService {
  static setToken(token: string) {
    localStorage.setItem('token', token);
  }

  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  static clear() {
    localStorage.clear();
  }
}