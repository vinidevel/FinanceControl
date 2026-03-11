<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Investiment extends Model
{
    protected $table = 'investiments';

    protected $fillable = [
        'name',
        'value',
        'financial_launch_id',
    ];

    public function financialLaunch()
    {
        return $this->belongsTo(FinancialLaunch::class);
    }
}
