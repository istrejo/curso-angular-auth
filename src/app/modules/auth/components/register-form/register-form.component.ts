import { query } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { RequestStatus } from '@models/request-status.model';
import { AuthService } from '@services/auth.service';

import { CustomValidators } from '@utils/validators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  formUser = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
  });
  form = this.formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required]],
      email: [
        { value: '', disabled: true },
        [Validators.email, Validators.required],
      ],
      password: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        CustomValidators.MatchValidator('password', 'confirmPassword'),
      ],
    }
  );
  status: RequestStatus = 'init';
  statusUser: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  errorMessage = '';
  errorMessageUser = '';
  showRegister: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, password } = this.form.getRawValue();
      console.log(name, email, password);
      this.authService.register(name, email, password).subscribe(
        (res) => {
          console.log(res);
          this.status = 'success';
          this.router.navigate(['/login']);
        },
        ({ error }) => {
          this.status = 'failed';
          if (
            error.message ===
            'SqliteError: UNIQUE constraint failed: user.email'
          ) {
            alert('User already exists');
            this.errorMessage = 'User already exists';
          }
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  validateUser() {
    console.log('validate user');
    if (this.formUser.valid) {
      this.statusUser = 'loading';
      const { email } = this.formUser.getRawValue();
      this.authService.isAvailable(email).subscribe((res) => {
        this.statusUser = 'success';
        this.showRegister = true;
        if (res.isAvailable) {
          this.form.controls.email.setValue(email);
        } else {
          this.router.navigate(['/login'], { queryParams: { email } });
        }
      });
    } else {
      this.formUser.markAllAsTouched();
    }
  }
}
