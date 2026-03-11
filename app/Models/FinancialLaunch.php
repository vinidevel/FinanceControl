<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialLaunch extends Model
{
       protected $table = 'financial_launches';
       protected $fillable = [
              'month',
              'financial_flow_id',
              'net_worth',
              'card_expiration_date',
       ];

       protected static function booted()
       {
              static::created(function ($model) {
                     $model->recalculateNetWorthAndCascade();
              });

              static::updated(function ($model) {
                     $model->recalculateNetWorthAndCascade();
              });

              static::deleted(function ($model) {
                     $next = self::where('financial_flow_id', $model->financial_flow_id)
                            ->where('month', '>', $model->month)
                            ->orderBy('month', 'asc')
                            ->first();

                     if ($next) {
                            $next->recalculateNetWorthAndCascade();
                     }
              });
       }

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

       /**
        * Recalculate this launch net_worth based on previous month's net_worth
        * plus (revenues - expenses) for this month, and propagate to later months.
        */
       public function recalculateNetWorthAndCascade(): void
       {
              $totalRevenues = (float) $this->revenues()->sum('value');
              $totalExpenses = (float) $this->expenses()->sum('value');
              $delta = round($totalRevenues - $totalExpenses, 2);

              $previous = self::where('financial_flow_id', $this->financial_flow_id)
                     ->where('month', '<', $this->month)
                     ->orderBy('month', 'desc')
                     ->first();

              $previousNet = $previous ? (float) $previous->net_worth : 0.0;

              $newNet = round($previousNet + $delta, 2);

              if (round((float) $this->net_worth, 2) !== $newNet) {
                     $this->fill(['net_worth' => $newNet])->saveQuietly();
              }

              $later = self::where('financial_flow_id', $this->financial_flow_id)
                     ->where('month', '>', $this->month)
                     ->orderBy('month', 'asc')
                     ->get();

              foreach ($later as $launch) {
                     $launch->recalculateNetWorthAndCascade();
              }
       }
}
