<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BloquePrestamo extends Model
{
    protected $table = 'bloqueprestamos';
    protected $primaryKey = 'idBloquePrestamo';
    public $timestamps = false;

    protected $fillable = [
        'idPrestamo',
        'idBloque'
    ];

    public function bloque()
    {
        return $this->belongsTo(Bloque::class, 'idBloque');
    }

    public function prestamo()
    {
        return $this->belongsTo(Prestamo::class, 'idPrestamo');
    }
}
