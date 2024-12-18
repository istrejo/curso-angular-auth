import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { faPen, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { RequestStatus } from '@models/request-status.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  form!: FormGroup;
  faPen = faPen;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  status: RequestStatus = 'init';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.initForm();
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const email = params.get('email');
      if (email) {
        this.form.get('email')?.setValue(email);
      }
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  doLogin() {
    if (this.form.valid) {
      this.status = 'loading';
      const { email, password } = this.form.getRawValue();
      // TODO
      this.authService.login(email, password).subscribe(
        (res) => {
          console.log(res);
          this.status = 'success';
          this.router.navigate(['/app']);
        },
        (err) => {
          this.status = 'failed';
          console.log(err);
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }
}
