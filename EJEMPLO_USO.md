# Vista de Cambio de Contraseña

## Funcionalidad Implementada

He creado una vista completa para que los usuarios puedan cambiar su contraseña después de hacer clic en el enlace que reciben por correo.

### Archivos Creados

1. **Componente TypeScript**: `src/app/components/auth/cambiar-contraseña/cambiar-contraseña.component.ts`
2. **Template HTML**: `src/app/components/auth/cambiar-contraseña/cambiar-contraseña.component.html`
3. **Estilos CSS**: `src/app/components/auth/cambiar-contraseña/cambiar-contraseña.component.css`

### Características Implementadas

✅ **Validación de formulario**:
- Campo de nueva contraseña (mínimo 8 caracteres)
- Campo de confirmación de contraseña
- Validación en tiempo real de que las contraseñas coincidan

✅ **Interfaz de usuario**:
- Diseño consistente con el resto de la aplicación
- Botones para mostrar/ocultar contraseñas
- Mensajes de error y éxito
- Indicador de carga durante el proceso

✅ **Funcionalidad**:
- Obtiene el token de la URL (query parameter)
- Valida que el token esté presente
- Simula el envío al backend (listo para conectar con Laravel)
- Redirige al login después del éxito

### Cómo Usar

1. **URL con token**: `http://localhost:4200/auth/cambiar-contraseña?token=abc123`
2. **Sin token**: `http://localhost:4200/auth/cambiar-contraseña` (muestra mensaje de error)

### Integración con Laravel

En el método `cambiarContraseña()` del componente, necesitarás:

```typescript
private cambiarContraseña(password: string, token: string) {
  return this.http.post('/api/auth/reset-password', {
    token: token,
    password: password
  }).subscribe({
    next: (response) => {
      this.successMessage = 'Contraseña cambiada exitosamente';
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2000);
    },
    error: (error) => {
      this.errorMessage = 'Error al cambiar la contraseña. Inténtalo de nuevo.';
    }
  });
}
```

### Rutas Configuradas

- ✅ Agregada en `app-routing.module.ts`
- ✅ Registrada en `app.module.ts`
- ✅ Enlace de navegación agregado para pruebas

### Próximos Pasos

1. Conectar con el endpoint de Laravel para cambiar contraseña
2. Manejar errores específicos del backend
3. Implementar expiración de tokens
4. Agregar validaciones adicionales de seguridad

### Pruebas

Puedes probar la vista navegando a:
- `http://localhost:4200/auth/cambiar-contraseña?token=test123`
- `http://localhost:4200/auth/cambiar-contraseña` (sin token)


