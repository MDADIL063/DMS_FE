export class StorageService {
  setItem(key: string, value: any): boolean {
    value = btoa(btoa(JSON.stringify(value)));
    localStorage.setItem(key, value);
    return true;
  }

  getItem(key: string) {
    const encodedValue = localStorage.getItem(key);
    if (encodedValue) {
      return JSON.parse(atob(atob(encodedValue)));
    }
    return null;
  }

  removeItem(key: string): boolean {
    localStorage.removeItem(key);
    return true;
  }
}
