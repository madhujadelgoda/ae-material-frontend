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

  // decode payload
  static getPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  static getRoles(): string[] {
    const payload = this.getPayload();
    return payload?.roles || [];
  }

  static hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  static getUsername(): string {
    return this.getPayload()?.username || 'User';
  }
}
