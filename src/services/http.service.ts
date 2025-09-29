import axios, { AxiosRequestConfig } from "axios";
import { useAppSelector } from "../redux/hooks";
import { LoaderService } from "./loader.service";

export class HttpService {
  private token: string = useAppSelector((store) => store.token);
  private loaderSvc = new LoaderService();

  async get(url: string, config: AxiosRequestConfig = {}) {
    try {
      this.loaderSvc.showLoader();
      if (this.token) {
        config.headers = { Authorization: `Bearer ${this.token}` };
      }
      return await axios.get(url, config);
    } catch (error) {
      throw error;
    } finally {
      this.loaderSvc.hideLoader();
    }
  }

  async post(url: string, payload: any, config: AxiosRequestConfig = {}) {
    try {
      this.loaderSvc.showLoader();
      if (this.token) {
        config.headers = { Authorization: `Bearer ${this.token}` };
      }
      return await axios.post(url, payload, config);
    } catch (error) {
      throw error;
    } finally {
      this.loaderSvc.hideLoader();
    }
  }

  async put(url: string, payload: any, config: AxiosRequestConfig = {}) {
    try {
      this.loaderSvc.showLoader();
      if (this.token) {
        config.headers = { Authorization: `Bearer ${this.token}` };
      }
      return await axios.put(url, payload, config);
    } catch (error) {
      throw error;
    } finally {
      this.loaderSvc.hideLoader();
    }
  }

  async patch(url: string, payload: any, config: AxiosRequestConfig = {}) {
    try {
      this.loaderSvc.showLoader();
      if (this.token) {
        config.headers = { Authorization: `Bearer ${this.token}` };
      }
      return await axios.patch(url, payload, config);
    } catch (error) {
      throw error;
    } finally {
      this.loaderSvc.hideLoader();
    }
  }

  async delete(url: string, config: AxiosRequestConfig = {}) {
    try {
      this.loaderSvc.showLoader();
      if (this.token) {
        config.headers = { Authorization: `Bearer ${this.token}` };
      }
      return await axios.delete(url, config);
    } catch (error) {
      throw error;
    } finally {
      this.loaderSvc.hideLoader();
    }
  }
}
