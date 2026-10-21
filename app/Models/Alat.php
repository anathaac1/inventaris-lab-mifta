<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Alat extends Model
{
    use HasFactory;

    protected $table = 'alats';

    protected $fillable = [
        'name',
        'category',
        'code',
        'stock',
        'total',
        'description',
        'specs',
        'icon_type',
        'is_visible_to_students',
    ];

    protected $casts = [
        'specs' => 'array',
        'is_visible_to_students' => 'boolean',
        'stock' => 'integer',
        'total' => 'integer',
    ];

    protected $appends = [
        'status',
        'iconType',
        'isVisibleToStudents',
    ];

    public function peminjamans(): HasMany
    {
        return $this->hasMany(Peminjaman::class);
    }

    public function getStatusAttribute(): string
    {
        return $this->stock > 0 ? 'Tersedia' : 'Dipinjam';
    }

    public function getIconTypeAttribute(): string
    {
        return $this->attributes['icon_type'] ?? 'laptop';
    }

    public function getIsVisibleToStudentsAttribute(): bool
    {
        return (bool) ($this->attributes['is_visible_to_students'] ?? true);
    }
}
