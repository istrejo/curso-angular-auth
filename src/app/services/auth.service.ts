import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { switchMap, tap } from 'rxjs';
import { TokenService } from './token.service';
import { LoginResponse } from '@models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.API_URL;
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  /**
   * The login function sends a POST request to the API endpoint for user authentication with the
   * provided email and password.
   * @param {string} email - Email is a string parameter that represents the email address of the user
   * trying to log in.
   * @param {string} password - The `password` parameter in the `login` function is a string that
   * represents the user's password. It is used as part of the data sent in the HTTP POST request to the
   * API endpoint for user authentication.
   * @returns The `login` function is returning a POST request to `${this.apiUrl}/auth/login` with the
   * email and password provided as the request body.
   */
  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          this.tokenService.saveToken(response.access_token);
        })
      );
  }

  /**
   * The `register` function sends a POST request to the API endpoint for user registration with the
   * provided name, email, and password.
   * @param {string} name - Name is a string that represents the user's name.
   * @param {string} email - The `email` parameter is a string that represents the email address of the
   * user who is registering for an account.
   * @param {string} password - The `password` parameter in the `register` function is a string that
   * represents the user's chosen password for registration.
   * @returns The `register` function is returning a POST request to the specified API endpoint
   * `${this.apiUrl}/auth/register` with the provided `name`, `email`, and `password` parameters.
   */
  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/register`, {
      name,
      email,
      password,
    });
  }

  /**
   * The function `registerAndLogin` registers a user with the provided name, email, and password, and
   * then logs the user in using the same email and password.
   * @param {string} name - The `name` parameter is a string that represents the name of the user who is
   * registering and logging in.
   * @param {string} email - Email is a string that represents the email address of the user.
   * @param {string} password - The `password` parameter in the `registerAndLogin` function is a string
   * that represents the password provided by the user during registration and login. It is used to
   * securely authenticate the user's identity and grant access to the system.
   * @returns The `registerAndLogin` function is returning the result of registering the user with the
   * provided name, email, and password, and then logging in the user using the same email and password.
   * The function uses RxJS operators `pipe` and `switchMap` to handle the asynchronous operations of
   * registering and logging in the user.
   */
  registerAndLogin(name: string, email: string, password: string) {
    return this.register(name, email, password).pipe(
      switchMap(() => this.login(email, password))
    );
  }

  /**
   * The function isAvailable checks if a given email is available by sending a POST request to the
   * specified API endpoint.
   * @param {string} email - The `email` parameter is a string representing an email address.
   * @returns The `isAvailable` method is returning an Observable that will make a POST request to the
   * `${this.apiUrl}/auth/is-available` endpoint with the provided email address in the request body. The
   * response is expected to be an object with a boolean property `isAvailable`.
   */
  isAvailable(email: string) {
    return this.http.post<{ isAvailable: boolean }>(
      `${this.apiUrl}/auth/is-available`,
      { email }
    );
  }

  /**
   * The `recovery` function sends a POST request to the specified API endpoint for password recovery
   * using the provided email address.
   * @param {string} email - The `email` parameter in the `recovery` function is a string that represents
   * the email address of the user who is requesting a password recovery.
   * @returns The `recovery` function is returning a POST request to the `${this.apiUrl}/auth/recovery`
   * endpoint with the email parameter in the request body.
   */
  recovery(email: string) {
    return this.http.post(`${this.apiUrl}/auth/recovery`, { email });
  }

  /**
   * The function `changePassword` sends a POST request to change the user's password using the provided
   * token and new password.
   * @param {string} token - A string representing the authentication token for the user.
   * @param {string} newPassword - The `newPassword` parameter in the `changePassword` function is a
   * string that represents the new password that the user wants to set for their account.
   * @returns The `changePassword` method is returning a POST request to the
   * `${this.apiUrl}/auth/change-password` endpoint with the `token` and `newPassword` parameters in the
   * request body.
   */
  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/auth/change-password`, {
      token,
      newPassword,
    });
  }

  logout() {
    this.tokenService.removeToken();
  }
}
