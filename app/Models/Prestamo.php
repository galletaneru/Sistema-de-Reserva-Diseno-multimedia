<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\BloquePrestamo;

class Prestamo extends Model
{
    protected $table = 'prestamos';
    protected $primaryKey = 'idPrestamo';
    public $timestamps = false;

    protected $fillable = [
        'idUser',
        'idEquipo',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'tipo'
    ];

    //  Relaciones

    public function user()
    {
        return $this->belongsTo(User::class, 'idUser');
    }

    public function equipo()
    {
        return $this->belongsTo(Equipo::class, 'idEquipo');
    }

     /*public function bloques()
    {
        return $this->hasMany(BloquePrestamo::class, 'idPrestamo', 'idPrestamo');
    }
    */
    public function bloques()
    {
        return $this->belongsToMany(
            Bloque::class,
            'bloqueprestamos',
            'idPrestamo',
            'idBloque'
        );
    }

    public function bloquePrestamo()
    {
        return $this->hasMany(BloquePrestamo::class, 'idPrestamo');
    }

    public function observacion()
    {
        return $this->hasMany(Observacion::class, 'idPrestamo');

    }
    
}
