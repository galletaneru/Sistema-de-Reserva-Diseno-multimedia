<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController; 
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Prestamo\PrestamoController;
use App\Http\Controllers\Prestamo\PrestamoAdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// 1. RUTAS PÚBLICAS 
Route::post('/forgot', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset', [ResetPasswordController::class, 'reset']);
// Ruta para iniciar sesión
// URL: /api/login
Route::post('/login', [AuthController::class, 'login']);

// Ruta para registrar un nuevo usuario
// URL: /api/register
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    
    // Ruta de prueba para verificar el token (ya la tenías)
    // URL: /api/user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Ruta para cerrar sesión (requiere que el usuario esté autenticado para invalidar su token)
    // Método: POST
    // URL: /api/logout
    Route::post('/logout', [AuthController::class, 'logout']); 
    
    // Prestamos
    Route::post('/prestamos', [PrestamoController::class, 'store']);
    // Route::post('/prestamos/solicitar', [PrestamoController::class, 'solicitarPrestamo']);
    
});
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/prestamos/cambiar-estado', [PrestamoAdminController::class, 'cambiarEstado']);
});
//Funciona
/*
Route::middleware(['auth:sanctum'])->group(function () {
    // Ruta para que el ADMIN apruebe o rechace solicitudes
    Route::patch('/admin/prestamos/actualizar-estado', [PrestamoAdminController::class, 'updateEstado']);
});
*/
