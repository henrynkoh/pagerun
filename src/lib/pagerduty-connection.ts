import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { formatISO } from 'date-fns';

export interface PagerDutyConnectionOptions {
  url?: string;
  timeout?: number;
}

export interface RequestOptions {
  queryParams?: Record<string, any>;
  headers?: Record<string, string>;
  body?: any;
}

export class PagerDutyConnectionError extends Error {
  constructor(
    public status: number,
    message: string,
    public response?: any
  ) {
    super(message);
    this.name = 'PagerDutyConnectionError';
  }
}

export class PagerDutyConnection {
  private baseURL: string;
  private token: string;
  private timeout: number;

  constructor(token: string, options: PagerDutyConnectionOptions = {}) {
    this.token = token;
    this.baseURL = options.url || 'https://api.pagerduty.com';
    this.timeout = options.timeout || 30000;
  }

  private async makeRequest(
    method: string,
    path: string,
    options: RequestOptions = {}
  ): Promise<any> {
    const url = `${this.baseURL}/${path.replace(/^\//, '')}`;
    
    const config: AxiosRequestConfig = {
      method,
      url,
      timeout: this.timeout,
      headers: {
        'Authorization': `Token token=${this.token}`,
        'Accept': 'application/vnd.pagerduty+json;version=2',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (options.queryParams) {
      config.params = options.queryParams;
    }

    if (options.body && method !== 'GET') {
      config.data = options.body;
    }

    try {
      const response: AxiosResponse = await axios(config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new PagerDutyConnectionError(
          error.response.status,
          error.response.data?.error?.message || error.response.statusText,
          error.response.data
        );
      } else if (error.request) {
        throw new PagerDutyConnectionError(
          0,
          'Network error: No response received',
          error.request
        );
      } else {
        throw new PagerDutyConnectionError(
          0,
          error.message || 'Unknown error',
          error
        );
      }
    }
  }

  async get(path: string, options: RequestOptions = {}): Promise<any> {
    return this.makeRequest('GET', path, options);
  }

  async post(path: string, options: RequestOptions = {}): Promise<any> {
    return this.makeRequest('POST', path, options);
  }

  async put(path: string, options: RequestOptions = {}): Promise<any> {
    return this.makeRequest('PUT', path, options);
  }

  async delete(path: string, options: RequestOptions = {}): Promise<any> {
    return this.makeRequest('DELETE', path, options);
  }

  // Convenience methods for common operations
  async getIncidents(options: RequestOptions = {}): Promise<any> {
    return this.get('incidents', options);
  }

  async getUsers(options: RequestOptions = {}): Promise<any> {
    return this.get('users', options);
  }

  async getServices(options: RequestOptions = {}): Promise<any> {
    return this.get('services', options);
  }

  async getSchedules(options: RequestOptions = {}): Promise<any> {
    return this.get('schedules', options);
  }

  async getEscalationPolicies(options: RequestOptions = {}): Promise<any> {
    return this.get('escalation_policies', options);
  }
} 