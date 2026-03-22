export class StorageService {

  private static TOKEN_KEY = 'token';

  // token
  static setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static clear() {
    localStorage.clear();
  }

  //  JWT payload
  static getPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  // user info
  static getUsername(): string {
    return this.getPayload()?.username || 'User';
  }

  // roles
  static getRoles(): string[] {
    return this.getPayload()?.roles || [];
  }

  static hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  // Permissions (NEW)
  static getPermissions(): string[] {
    return this.getPayload()?.permissions || [];
  }

  static hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  static hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.hasPermission(p));
  }
}
