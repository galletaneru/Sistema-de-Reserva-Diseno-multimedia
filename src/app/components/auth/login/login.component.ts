import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router){
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(){
    if(this.form.valid){
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      
      // Simulación de autenticación - en producción esto vendría del backend
      if(email === 'admin@gmail.com' && password === 'admin123'){
        alert('¡Bienvenido Administrador!');
        this.router.navigate(['/admin/dashboard']);
      } else {
        alert('¡Bienvenido!');
        this.router.navigate(['/alumno/solicitud-equipo']);
      }
    }
  }
}
