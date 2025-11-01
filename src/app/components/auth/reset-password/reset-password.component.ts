import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  token!: string;
  email!: string;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

ngOnInit(): void {
  // Obtener token desde el fragmento (#token)
  this.route.fragment.subscribe(fragment => {
    this.token = fragment || '';

    if (this.token) {
      // Llamar al backend para validar el token y obtener el email
      this.authService.validateToken(this.token).subscribe({
        next: (res) => {
          this.email = res.email;
        },
        error: () => {
          this.errorMessage = 'El enlace no es válido o ha expirado';
        }
      });
    }
  });

  this.form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });
}


  

  submit(): void {
    if (this.form.invalid) return;

    const { password, confirmPassword } = this.form.value;
    if (password !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resetPassword({
      email: this.email,
      token: this.token,
      password,
      password_confirmation: confirmPassword
    }).subscribe({
      next: () => {
        this.successMessage = '✅ Contraseña restablecida correctamente';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al restablecer contraseña';
        this.loading = false;
      }
    });
  }
}
