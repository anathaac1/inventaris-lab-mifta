<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Peminjaman extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'alat_id',
        'borrower_name',
        'borrower_class',
        'borrow_date',
        'return_estimate',
        'return_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'borrow_date' => 'date',
        'return_estimate' => 'date',
        'return_date' => 'date',
    ];

    protected $appends = [
        'itemId',
        'itemName',
        'code',
        'category',
        'borrowDate',
        'returnEstimate',
        'returnDate',
        'borrowerName',
        'borrowerClass',
        'iconType',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function alat(): BelongsTo
    {
        return $this->belongsTo(Alat::class);
    }

    public function getItemIdAttribute(): ?string
    {
        return $this->alat_id !== null ? (string) $this->alat_id : null;
    }

    public function getIconTypeAttribute(): string
    {
        return $this->alat?->icon_type ?? ($this->alat?->category === 'Laptop' ? 'laptop' : 'mouse');
    }

    public function getItemNameAttribute(): ?string
    {
        return $this->alat?->name;
    }

    public function getCodeAttribute(): ?string
    {
        return $this->alat?->code;
    }

    public function getCategoryAttribute(): ?string
    {
        return $this->alat?->category;
    }

    public function getBorrowDateAttribute(): ?string
    {
        return $this->borrow_date?->translatedFormat('j F Y') ?? ($this->attributes['borrow_date'] ?? null);
    }

    public function getReturnEstimateAttribute(): ?string
    {
        return $this->return_estimate?->translatedFormat('j F Y') ?? ($this->attributes['return_estimate'] ?? null);
    }

    public function getReturnDateAttribute(): ?string
    {
        return $this->return_date?->translatedFormat('j F Y') ?? ($this->attributes['return_date'] ?? null);
    }

    public function getBorrowerNameAttribute(): ?string
    {
        return $this->attributes['borrower_name'] ?? null;
    }

    public function getBorrowerClassAttribute(): ?string
    {
        return $this->attributes['borrower_class'] ?? null;
    }
}
