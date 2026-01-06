<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialFlow extends Model
{
   protected $table = 'financial_flows';
   protected $fillable = [
       'year',
   ];

    /**
     * Cast attributes to proper types.
     */


    public function financialLaunches()
    {
         return $this->hasMany(FinancialLaunch::class);
    }

    protected static function booted()
    {
        static::deleting(function ($flow) {
            if ($flow->financialLaunches()->exists()) {
                throw new \Exception('Cannot delete Financial Flow with associated Financial Launches.');
            }
        });
    }


}
