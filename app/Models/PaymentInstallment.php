<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentInstallment extends Model
{
    protected $table = 'payment_installments';
    protected $fillable = [
        'expense_id',
        'installment_number',
        'installment_value',
        'credit_card_bill_id',
    ];

    public function expense()
    {
        return $this->belongsTo(Expense::class, 'expense_id');
    }

    public function creditCardBill()
    {
        return $this->belongsTo(CreditCardBill::class, 'credit_card_bill_id');
    }
}
