<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditCardBill extends Model
{
    protected $table = 'credit_card_bills';
    //faturas
    protected $fillable = [
        'credit_card_id',
        'reference_date',
    ];

    public function creditCard()
    {
        return $this->belongsTo(CreditCard::class, 'credit_card_id');
    }

    public function paymentInstallments()
    {
        return $this->hasMany(PaymentInstallment::class, 'credit_card_bill_id');
    }
}
