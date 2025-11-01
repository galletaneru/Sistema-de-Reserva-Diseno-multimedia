<?php

namespace App\Http\Controllers\Prestamo;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prestamo;

class PrestamoAdminController extends Controller
{
    public function cambiarEstado(Request $request)
{
    $user = auth()->user();

    // Verificar que sea admin
    if (!$user->isAdmin()) {
        return response()->json(['message' => 'No autorizado'], 403);
    }

    $idPrestamo = $request->input('id');       // id del préstamo desde el body
    $accion = strtolower($request->input('accion')); // "aceptar" o "rechazar"

    $prestamo = Prestamo::find($idPrestamo);

    if (!$prestamo) {
        return response()->json(['message' => 'Préstamo no encontrado'], 404);
    }

    // Cambiar el estado según la acción
    if ($accion === 'aceptar') {
        $prestamo->estado = 'aceptado';
    } elseif ($accion === 'rechazar') {
        $prestamo->estado = 'rechazado';
    } else {
        return response()->json(['message' => 'Acción inválida'], 400);
    }

    $prestamo->save();

    return response()->json([
        'message' => 'Estado del préstamo actualizado correctamente',
        'prestamo' => $prestamo
    ]);
}
}
