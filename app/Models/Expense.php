<?php

namespace App\Models;

use App\Models\FinancialLaunch;
use App\Models\ExpenseType;
use App\Models\PaymentMethod;
use App\Models\PaymentInstallment;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $table = 'expenses';
    protected $fillable = [
        'financial_launch_id',
        'expense_type_id',
        'payment_method_id',
        'value',
        'description',
        'date_expense',
    ];
    protected static function booted()
    {
        static::created(function ($model) {
            $launch = FinancialLaunch::find($model->financial_launch_id);
            if ($launch) $launch->recalculateNetWorthAndCascade();
        });

        static::updated(function ($model) {
            $launch = FinancialLaunch::find($model->financial_launch_id);
            if ($launch) $launch->recalculateNetWorthAndCascade();
        });

        static::deleted(function ($model) {
            $launch = FinancialLaunch::find($model->financial_launch_id);
            if ($launch) $launch->recalculateNetWorthAndCascade();
        });
    }

    public function financialLaunch()
    {
        return $this->belongsTo(FinancialLaunch::class, 'financial_launch_id');
    }
    public function expenseType()
    {
        return $this->belongsTo(ExpenseType::class, 'expense_type_id');
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }

    public function paymentInstallments()
    {
        return $this->hasMany(PaymentInstallment::class, 'expense_id');
    }
}
