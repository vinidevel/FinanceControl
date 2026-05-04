<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Revenue extends Model
{
    protected $table = 'revenues';
    protected $fillable = [
        'financial_launch_id',
        'revenue_type_id',
        'value',
        'description',
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
    public function revenueType()
    {
        return $this->belongsTo(RevenueType::class, 'revenue_type_id');
    }

  

}
