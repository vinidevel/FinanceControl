<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialLaunch extends Model
{
    protected $table = 'financial_launches';
    protected $fillable = [
         'month',
         'financial_flow_id',
    ];
    
     public function financialFlow()
     {
            return $this->belongsTo(FinancialFlow::class, 'financial_flow_id');
     }

     public function revenues()
     {
            return $this->hasMany(Revenue::class, 'financial_launch_id');
     }

     public function expenses()
     {
            return $this->hasMany(Expense::class, 'financial_launch_id');
     }    
}
