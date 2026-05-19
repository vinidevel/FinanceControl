<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditCard extends Model
{
    protected $table = 'credit_cards';
    //cartão de crédito
    protected $fillable = [
        'name',
        'expiration_date',
        'invoice_closing_date',
    ];

    public function bills()
    {
        return $this->hasMany(CreditCardBill::class, 'credit_card_id');
    }
}
