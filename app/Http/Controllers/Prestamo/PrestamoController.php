<?php

namespace App\Http\Controllers\Prestamo;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prestamo;
use Illuminate\Support\Facades\Auth;

class PrestamoController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'idEquipo' => 'required|integer|exists:equipos,idEquipo',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'tipo' => 'required|string',
           // 'bloques' => 'required|array',
            //'bloques.*' => 'exists:bloques,idBloque'
        ]);

        $prestamo = Prestamo::create([
            'idUser' => Auth::id(),
            'idEquipo' => $request->idEquipo,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'tipo' => $request->tipo,
            'estado' => 'pendiente',
        ]);
                // Asociar bloques
        $prestamo->bloques()->attach($request->bloques);

        return response()->json([
            'message' => 'Préstamo creado correctamente',
            'prestamo' => $prestamo->load('bloques', 'equipo', 'user')
        ], 201);

        return response()->json($prestamo, 201);
    }
}
