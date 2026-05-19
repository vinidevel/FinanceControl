<?php

namespace Database\Seeders;

use App\Models\ExpenseType;
use App\Models\PaymentMethod;
use App\Models\UnityType;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {


        if (UnityType::count() === 0) {
            $this->call(UnityTypesSeeder::class);
        }

        if (User::count() === 0) {
            $this->call(UserSeeder::class);
        }

        if (ExpenseType::count() === 0) {
            $this->call(ExpenseTypeSeeder::class);
        }

        if (PaymentMethod::count() === 0) {
            $this->call(PaymentMethodSeeder::class);
        }
    }
}
